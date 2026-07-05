//! Python binding for Kungfu.js.
//!
//! V1 approach: expose individual Rust functions (CSS compilation, server
//! start, version) as Python functions. The HTTP server runs entirely in
//! Rust for maximum performance. Python handler bridging will be added
//! in V1.1.

use std::sync::Arc;

use pyo3::prelude::*;
use pyo3::exceptions::PyRuntimeError;

/// Compile a class string (e.g. "flex p-4 text-red-500") to CSS.
#[pyfunction]
fn compile_css(classes: &str) -> String {
    kungfu_css::compile_classes(classes)
}

/// Scan a directory for class= / className= usage and emit a minimal CSS bundle.
#[pyfunction]
fn compile_css_dir(dir: &str) -> PyResult<String> {
    kungfu_css::compile_directory(dir)
        .map_err(|e| PyRuntimeError::new_err(format!("CSS scan: {e}")))
}

/// Get the framework version.
#[pyfunction]
fn version() -> &'static str {
    kungfu_core::VERSION
}

/// Start the Kungfu HTTP server on the given port. Blocks the calling thread.
#[pyfunction]
fn start_server(port: u16) -> PyResult<()> {
    let addr: std::net::SocketAddr = format!("0.0.0.0:{port}")
        .parse()
        .map_err(|e| PyRuntimeError::new_err(format!("invalid port: {e}")))?;

    let mut router = kungfu_core::Router::new();

    // Built-in hello route (cached response).
    let hello_body = bytes::Bytes::from(
        serde_json::to_vec(&serde_json::json!({
            "message": "world",
            "framework": "kungfu",
            "version": kungfu_core::VERSION,
        }))
        .unwrap(),
    );
    let hello_for_handler = hello_body.clone();
    router.add_with_meta(
        kungfu_core::RouteMeta {
            path: "/hello".into(),
            method: kungfu_core::Method::Get,
            ..Default::default()
        },
        Arc::new(move |_req| {
            let body = hello_for_handler.clone();
            Box::pin(async move { kungfu_core::Response::new().json_bytes(body) })
        }),
    )
    .map_err(|e| PyRuntimeError::new_err(format!("route: {e}")))?;

    // Install default middleware + auto docs.
    for mw in kungfu_core::default_middleware_stack().into_iter().rev() {
        router.prepend_middleware(mw);
    }
    let _ = kungfu_core::openapi::register_docs_routes(
        &mut router,
        "Kungfu API",
        kungfu_core::VERSION,
    );

    let n_cpus = std::thread::available_parallelism()
        .map(|n| n.get())
        .unwrap_or(4);
    let server = kungfu_core::Server::new(router, addr).with_acceptor_threads(n_cpus);

    let rt = tokio::runtime::Builder::new_multi_thread()
        .enable_all()
        .build()
        .map_err(|e| PyRuntimeError::new_err(format!("runtime: {e}")))?;

    rt.block_on(async move {
        let _ = server.serve().await;
    });

    Ok(())
}

/// Module entry point.
#[pymodule]
fn _native(_py: Python<'_>, m: &Bound<'_, PyModule>) -> PyResult<()> {
    m.add_function(wrap_pyfunction!(compile_css, m)?)?;
    m.add_function(wrap_pyfunction!(compile_css_dir, m)?)?;
    m.add_function(wrap_pyfunction!(version, m)?)?;
    m.add_function(wrap_pyfunction!(start_server, m)?)?;
    m.add("__version__", kungfu_core::VERSION)?;
    Ok(())
}
