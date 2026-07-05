//! Node.js binding for the Kungfu.js framework with FULL handler bridging.
//!
//! Uses continuation-passing style: JS handlers receive a request with an ID,
//! process it, and call `app.respond(id, response)` to send the response.

#![deny(clippy::all)]

use std::collections::HashMap;
use std::sync::Arc;

use napi::bindgen_prelude::*;
use napi::tokio::sync::{Mutex as TokioMutex, oneshot};
use napi::threadsafe_function::{ThreadsafeFunction, ErrorStrategy, ThreadsafeFunctionCallMode};
use napi_derive::napi;

use kungfu_core::{
    Method, Request as CoreRequest, Response as CoreResponse, Router as CoreRouter,
    Server as CoreServer, RouteMeta,
};

#[napi(object)]
#[derive(serde::Serialize)]
pub struct JsRequest {
    pub request_id: f64,
    pub method: String,
    pub path: String,
    pub query: String,
    pub params: String,
    pub headers: String,
    pub body: String,
}

#[napi(object)]
pub struct JsResponse {
    pub status: u16,
    pub body: String,
}

type PendingMap = Arc<TokioMutex<HashMap<u64, oneshot::Sender<JsResponse>>>>;

#[napi]
pub struct KungfuApp {
    router: Arc<TokioMutex<Option<CoreRouter>>>,
    pending: PendingMap,
    next_id: Arc<TokioMutex<u64>>,
}

#[napi]
impl KungfuApp {
    #[napi(constructor)]
    pub fn new() -> Self {
        Self {
            router: Arc::new(TokioMutex::new(Some(CoreRouter::new()))),
            pending: Arc::new(TokioMutex::new(HashMap::new())),
            next_id: Arc::new(TokioMutex::new(0)),
        }
    }

    #[napi]
    pub async fn get(&self, path: String, handler: ThreadsafeFunction<String, ErrorStrategy::Fatal>) -> Result<()> {
        self.register(Method::Get, path, handler).await
    }

    #[napi]
    pub async fn post(&self, path: String, handler: ThreadsafeFunction<String, ErrorStrategy::Fatal>) -> Result<()> {
        self.register(Method::Post, path, handler).await
    }

    #[napi]
    pub async fn put(&self, path: String, handler: ThreadsafeFunction<String, ErrorStrategy::Fatal>) -> Result<()> {
        self.register(Method::Put, path, handler).await
    }

    #[napi]
    pub async fn delete(&self, path: String, handler: ThreadsafeFunction<String, ErrorStrategy::Fatal>) -> Result<()> {
        self.register(Method::Delete, path, handler).await
    }

    /// Called from JS to send a response back to Rust for a pending request.
    #[napi]
    pub async fn respond(&self, request_id: f64, response: JsResponse) -> Result<()> {
        let id = request_id as u64;
        let mut map = self.pending.lock().await;
        if let Some(tx) = map.remove(&id) {
            let _ = tx.send(response);
        }
        Ok(())
    }

    #[napi]
    pub async fn listen(&self, port: u16) -> Result<()> {
        let router = {
            let mut guard = self.router.lock().await;
            if let Some(mut r) = guard.take() {
                for mw in kungfu_core::default_middleware_stack().into_iter().rev() {
                    r.prepend_middleware(mw);
                }
                let _ = kungfu_core::openapi::register_docs_routes(
                    &mut r, "Kungfu API", kungfu_core::VERSION,
                );
                r
            } else {
                return Err(Error::new(Status::GenericFailure, "server already started"));
            }
        };
        let addr: std::net::SocketAddr = format!("0.0.0.0:{port}")
            .parse()
            .map_err(|e| Error::new(Status::InvalidArg, format!("port: {e}")))?;
        let n_cpus = std::thread::available_parallelism().map(|n| n.get()).unwrap_or(4);
        let server = CoreServer::new(router, addr).with_acceptor_threads(n_cpus);
        server.serve().await
            .map_err(|e| Error::new(Status::GenericFailure, format!("server: {e}")))
    }

    async fn register(
        &self,
        method: Method,
        path: String,
        handler: ThreadsafeFunction<String, ErrorStrategy::Fatal>,
    ) -> Result<()> {
        let handler = Arc::new(handler);
        let pending = self.pending.clone();
        let next_id = self.next_id.clone();

        let core_handler: kungfu_core::Handler = Arc::new(move |req: CoreRequest| {
            let handler = handler.clone();
            let pending = pending.clone();
            let next_id = next_id.clone();

            Box::pin(async move {
                let id = {
                    let mut counter = next_id.lock().await;
                    *counter += 1;
                    *counter
                };

                let (tx, rx) = oneshot::channel::<JsResponse>();
                {
                    let mut map = pending.lock().await;
                    map.insert(id, tx);
                }

                let js_req = JsRequest {
                    request_id: id as f64,
                    method: req.method.as_str().to_string(),
                    path: req.path.clone(),
                    query: serde_json::to_string(&req.query).unwrap_or_default(),
                    params: serde_json::to_string(&req.params).unwrap_or_default(),
                    headers: serde_json::to_string(&req.headers).unwrap_or_default(),
                    body: String::from_utf8_lossy(&req.body).to_string(),
                };

                // Serialize as JSON string — ThreadsafeFunction handles String natively.
                let req_json = serde_json::to_string(&js_req).unwrap_or_default();

                // Fire the JS handler (fire-and-forget — JS calls respond() to send back the result).
                let _ = handler.call(req_json, ThreadsafeFunctionCallMode::NonBlocking);

                // Await the response from JS (via respond()).
                match napi::tokio::time::timeout(std::time::Duration::from_secs(30), rx).await {
                    Ok(Ok(resp)) => {
                        CoreResponse::new()
                            .status(kungfu_core::StatusCode::from(resp.status))
                            .text(resp.body)
                    }
                    _ => {
                        let mut map = pending.lock().await;
                        map.remove(&id);
                        CoreResponse::new()
                            .status(kungfu_core::StatusCode::InternalServerError)
                            .text("handler timeout")
                    }
                }
            })
        });

        let mut guard = self.router.lock().await;
        if let Some(router) = guard.as_mut() {
            router.add(method, &path, core_handler, RouteMeta {
                path: path.clone(), method, ..Default::default()
            }).map_err(|e| Error::new(Status::GenericFailure, format!("route: {e}")))
        } else {
            Err(Error::new(Status::GenericFailure, "server already started"))
        }
    }
}

#[napi]
pub fn compile_css(classes: String) -> String {
    kungfu_css::compile_classes(&classes)
}

#[napi]
pub fn compile_css_dir(dir: String) -> Result<String> {
    kungfu_css::compile_directory(&dir)
        .map_err(|e| Error::new(Status::GenericFailure, format!("CSS: {e}")))
}

#[napi]
pub fn version() -> String {
    kungfu_core::VERSION.to_string()
}
