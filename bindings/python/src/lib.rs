//! Python binding for Unique.js with FULL handler bridging.
//!
//! Uses the same continuation-passing style as the JS binding:
//! - Rust serializes request as JSON → calls Python callback
//! - Python handler calls app.respond(request_id, response) → sends back to Rust
//!
//! ```python
//! from unique import UniqueApp
//!
//! app = UniqueApp()
//!
//! app.get('/hello', lambda req: app.respond(
//!     req['request_id'],
//!     {'status': 200, 'body': '{"message": "world"}'}
//! ))
//!
//! app.listen(3000)
//! ```

use std::collections::HashMap;
use std::sync::Arc;
use std::time::Duration;

use pyo3::prelude::*;
use pyo3::exceptions::PyRuntimeError;
use pyo3::types::PyDict;
use parking_lot::Mutex;
use tokio::sync::oneshot;

use unique_core::{
    Method, Request as CoreRequest, Response as CoreResponse, Router as CoreRouter,
    Server as CoreServer, RouteMeta,
};

type PendingMap = Arc<Mutex<HashMap<u64, oneshot::Sender<(u16, String)>>>>;

/// A Unique application with Python handler support.
#[pyclass]
pub struct UniqueApp {
    router: Arc<Mutex<Option<CoreRouter>>>,
    pending: PendingMap,
    next_id: Arc<Mutex<u64>>,
    /// Python callback reference — stored as a PyObject so we can call it.
    callback: Arc<Mutex<Option<PyObject>>>,
}

#[pymethods]
impl UniqueApp {
    #[new]
    fn new() -> Self {
        Self {
            router: Arc::new(Mutex::new(Some(CoreRouter::new()))),
            pending: Arc::new(Mutex::new(HashMap::new())),
            next_id: Arc::new(Mutex::new(0)),
            callback: Arc::new(Mutex::new(None)),
        }
    }

    /// Register a GET route with a Python handler.
    fn get(&self, path: &str, handler: PyObject) -> PyResult<()> {
        self.register(Method::Get, path, handler)
    }

    /// Register a POST route.
    fn post(&self, path: &str, handler: PyObject) -> PyResult<()> {
        self.register(Method::Post, path, handler)
    }

    /// Register a PUT route.
    fn put(&self, path: &str, handler: PyObject) -> PyResult<()> {
        self.register(Method::Put, path, handler)
    }

    /// Register a DELETE route.
    fn delete(&self, path: &str, handler: PyObject) -> PyResult<()> {
        self.register(Method::Delete, path, handler)
    }

    /// Called from Python to send a response back to Rust for a pending request.
    fn respond(&self, request_id: f64, status: u16, body: String) -> PyResult<()> {
        let id = request_id as u64;
        let mut map = self.pending.lock();
        if let Some(tx) = map.remove(&id) {
            let _ = tx.send((status, body));
        }
        Ok(())
    }

    /// Start the server on the given port. Blocks the calling thread.
    fn listen(&self, port: u16) -> PyResult<()> {
        let router = {
            let mut guard = self.router.lock();
            if let Some(mut r) = guard.take() {
                for mw in unique_core::default_middleware_stack().into_iter().rev() {
                    r.prepend_middleware(mw);
                }
                let _ = unique_core::openapi::register_docs_routes(
                    &mut r, "Unique API", unique_core::VERSION,
                );
                r
            } else {
                return Err(PyRuntimeError::new_err("server already started"));
            }
        };

        let addr: std::net::SocketAddr = format!("0.0.0.0:{port}")
            .parse()
            .map_err(|e| PyRuntimeError::new_err(format!("port: {e}")))?;

        let n_cpus = std::thread::available_parallelism()
            .map(|n| n.get())
            .unwrap_or(4);
        let server = CoreServer::new(router, addr).with_acceptor_threads(n_cpus);

        let rt = tokio::runtime::Builder::new_multi_thread()
            .enable_all()
            .build()
            .map_err(|e| PyRuntimeError::new_err(format!("runtime: {e}")))?;

        rt.block_on(async move {
            let _ = server.serve().await;
        });

        Ok(())
    }
}

impl UniqueApp {
    fn register(&self, method: Method, path: &str, handler: PyObject) -> PyResult<()> {
        let pending = self.pending.clone();
        let next_id = self.next_id.clone();
        let handler = Arc::new(handler);

        let core_handler: unique_core::Handler = Arc::new(move |req: CoreRequest| {
            let handler = handler.clone();
            let pending = pending.clone();
            let next_id = next_id.clone();

            Box::pin(async move {
                let id = {
                    let mut counter = next_id.lock();
                    *counter += 1;
                    *counter
                };

                let (tx, rx) = oneshot::channel::<(u16, String)>();
                {
                    let mut map = pending.lock();
                    map.insert(id, tx);
                }

                // Build the request JSON.
                let req_json = serde_json::json!({
                    "request_id": id,
                    "method": req.method.as_str(),
                    "path": req.path,
                    "query": req.query,
                    "params": req.params,
                    "headers": req.headers.iter()
                        .map(|(k, v)| (k.clone(), v.clone()))
                        .collect::<HashMap<_, _>>(),
                    "body": String::from_utf8_lossy(&req.body).to_string(),
                }).to_string();

                // Call the Python handler.
                // This uses pyo3's GIL acquisition to call back into Python.
                Python::with_gil(|py| {
                    let handler_ref = handler.clone();
                    let req_str = req_json.clone();

                    // Call the handler with the JSON string.
                    // If the handler is a callable, call it directly.
                    if let Ok(result) = handler_ref.call_bound(py, (req_str,), None) {
                        // If the handler returns None, it means it will call
                        // respond() asynchronously (continuation-passing style).
                        // If it returns a dict, we use it directly.
                        if let Ok(dict) = result.downcast_bound::<PyDict>(py) {
                            // Sync handler — extract status + body from the returned dict.
                            let status: u16 = dict.get_item("status")
                                .ok()
                                .flatten()
                                .and_then(|v| v.extract::<u16>().ok())
                                .unwrap_or(200);
                            let body: String = dict.get_item("body")
                                .ok()
                                .flatten()
                                .and_then(|v| v.extract::<String>().ok())
                                .unwrap_or_default();
                            let mut map = pending.lock();
                            if let Some(tx) = map.remove(&id) {
                                let _ = tx.send((status, body));
                            }
                        }
                        // If it returned None, the handler will call respond() later.
                    }
                });

                // Await the response from Python (via respond()).
                match tokio::time::timeout(Duration::from_secs(30), rx).await {
                    Ok(Ok((status, body))) => {
                        CoreResponse::new()
                            .status(unique_core::StatusCode::from(status))
                            .text(body)
                    }
                    _ => {
                        let mut map = pending.lock();
                        map.remove(&id);
                        CoreResponse::new()
                            .status(unique_core::StatusCode::InternalServerError)
                            .text("handler timeout")
                    }
                }
            })
        });

        let mut guard = self.router.lock();
        if let Some(router) = guard.as_mut() {
            router.add(method, path, core_handler, RouteMeta {
                path: path.to_string(), method, ..Default::default()
            }).map_err(|e| PyRuntimeError::new_err(format!("route: {e}")))
        } else {
            Err(PyRuntimeError::new_err("server already started"))
        }
    }
}

// ─── Utility functions ────────────────────────────────────────────────────────

#[pyfunction]
fn compile_css(classes: &str) -> String {
    unique_css::compile_classes(classes)
}

#[pyfunction]
fn compile_css_dir(dir: &str) -> PyResult<String> {
    unique_css::compile_directory(dir)
        .map_err(|e| PyRuntimeError::new_err(format!("CSS scan: {e}")))
}

#[pyfunction]
fn version() -> &'static str {
    unique_core::VERSION
}

/// Module entry point.
#[pymodule]
fn _native(_py: Python<'_>, m: &Bound<'_, PyModule>) -> PyResult<()> {
    m.add_class::<UniqueApp>()?;
    m.add_function(wrap_pyfunction!(compile_css, m)?)?;
    m.add_function(wrap_pyfunction!(compile_css_dir, m)?)?;
    m.add_function(wrap_pyfunction!(version, m)?)?;
    m.add("__version__", unique_core::VERSION)?;
    Ok(())
}
