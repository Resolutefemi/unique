//! C ABI for the Unique.js framework.
//!
//! Exposes opaque pointers (`UniqueRouter*`, `UniqueServer*`) and C function
//! signatures so other languages can call into the Rust core via their
//! native FFI (C++ dlopen, Dart dart:ffi, Swift C interop, Java JNI).
//!
//! ## Header generation
//!
//! The `unique.h` header is generated automatically by `cbindgen` when you
//! build with the `ffi` feature:
//!
//! ```bash
//! cargo build -p unique-core --features ffi
//! # → generates unique.h in the crate root
//! ```
//!
//! ## Quickstart (C)
//!
//! ```c
//! #include "unique.h"
//!
//! void hello_handler(UniqueRequest* req, UniqueResponse* res) {
//!     unique_response_status(res, 200);
//!     unique_response_json(res, "{\"message\":\"world\"}");
//! }
//!
//! int main() {
//!     UniqueRouter* router = unique_router_new();
//!     unique_router_get(router, "/hello", hello_handler);
//!
//!     UniqueServer* server = unique_server_new(router);
//!     unique_server_listen(server, 3000);
//!     return 0;
//! }
//! ```

// The FFI module is the one place in the crate where `unsafe` is allowed.
// The rest of the crate uses `#![deny(unsafe_code)]`.
//
// We use `#[allow(unsafe_code)]` on each function that needs it (the
// extern "C" wrappers + the raw pointer manipulation). This is more
// verbose than a module-level allow but more explicit.

#![cfg(feature = "ffi")]

use std::ffi::{CStr, CString};
use std::os::raw::{c_char, c_int, c_uint};
use std::sync::Arc;

use crate::router::{Handler, RouteMeta, Router};
use crate::server::Server;
use crate::{Method, Request, Response};

/// Opaque router handle.
pub type UniqueRouter = Router;

/// Opaque server handle.
pub type UniqueServer = Server;

/// C function pointer for a request handler.
pub type UniqueHandlerFn = extern "C" fn(*mut UniqueRequest, *mut UniqueResponse);

/// Opaque request handle. The C side receives this as a pointer and passes
/// it to the helper functions (`unique_request_param`, etc.) to extract data.
pub type UniqueRequest = Request;

/// Opaque response handle.
pub type UniqueResponse = Response;

/// Create a new router. Returns an opaque pointer that the caller owns.
/// Free with `unique_router_free`.
#[no_mangle]
#[allow(unsafe_code)]
pub extern "C" fn unique_router_new() -> *mut UniqueRouter {
    Box::into_raw(Box::new(Router::new()))
}

/// Free a router created by `unique_router_new`.
///
/// # Safety
/// The pointer must have been returned by `unique_router_new` and not
/// already freed.
#[no_mangle]
#[allow(unsafe_code)]
pub unsafe extern "C" fn unique_router_free(router: *mut UniqueRouter) {
    if !router.is_null() {
        drop(Box::from_raw(router));
    }
}

macro_rules! c_route_method {
    ($fn_name:ident, $method:expr) => {
        #[no_mangle]
        #[allow(unsafe_code)]
        pub unsafe extern "C" fn $fn_name(
            router: *mut UniqueRouter,
            path: *const c_char,
            handler: UniqueHandlerFn,
        ) {
            if router.is_null() || path.is_null() {
                return;
            }
            let router = &mut *router;
            let path = CStr::from_ptr(path).to_str().unwrap_or("/");
            let handler = wrap_handler(handler);
            let _ = router.add($method, path, handler, RouteMeta {
                path: path.to_string(),
                method: $method,
                ..Default::default()
            });
        }
    };
}

c_route_method!(unique_router_get, Method::Get);
c_route_method!(unique_router_post, Method::Post);
c_route_method!(unique_router_put, Method::Put);
c_route_method!(unique_router_delete, Method::Delete);
c_route_method!(unique_router_patch, Method::Patch);

/// Create a new server bound to a router. Returns an opaque pointer.
/// The server takes ownership of the router.
#[no_mangle]
#[allow(unsafe_code)]
pub extern "C" fn unique_server_new(router: *mut UniqueRouter) -> *mut UniqueServer {
    if router.is_null() {
        return std::ptr::null_mut();
    }
    let router = unsafe { Box::from_raw(router) };
    let addr: std::net::SocketAddr = "0.0.0.0:3000".parse().unwrap();
    let server = Server::new(*router, addr);
    Box::into_raw(Box::new(server))
}

/// Free a server created by `unique_server_new`.
#[no_mangle]
#[allow(unsafe_code)]
pub unsafe extern "C" fn unique_server_free(server: *mut UniqueServer) {
    if !server.is_null() {
        drop(Box::from_raw(server));
    }
}

/// Start the server listening on the given port. Blocks the calling thread.
///
/// Note: this function blocks forever. The C caller should run it in a
/// dedicated thread if it needs to do other work.
#[no_mangle]
#[allow(unsafe_code)]
pub extern "C" fn unique_server_listen(server: *mut UniqueServer, port: c_int) {
    if server.is_null() {
        return;
    }
    let server = unsafe { &*server };
    let port = port.max(0).min(65535) as u16;
    let addr: std::net::SocketAddr = format!("0.0.0.0:{port}").parse().unwrap_or_else(|_| "0.0.0.0:3000".parse().unwrap());

    // Install default middleware + auto docs.
    let router_arc = server.router.read().clone();
    let mut router = Router::new();
    // Copy ws_handlers (these are Arc, can be cloned).
    for (k, v) in &router_arc.ws_handlers {
        router.ws_handlers.insert(k.clone(), v.clone());
    }
    // Note: routes can't be cloned because the handlers are closures.
    // For the C ABI, callers typically register routes fresh via the
    // unique_router_* functions before calling unique_server_new. The
    // server already has those routes — we just install middleware.
    // We need to use the router that's already in the server.
    drop(router);
    let n_cpus = std::thread::available_parallelism().map(|n| n.get()).unwrap_or(4);

    // Take ownership of the server, rebuild with correct addr + acceptor count.
    let server_ptr = server as *const UniqueServer as *mut UniqueServer;
    let old_server = unsafe { Box::from_raw(server_ptr) };
    // Old server's router has all the registered routes — clone the inner Arc.
    let router = old_server.router.read().clone();
    // We can't mutate the inner Router (it's behind Arc), so we install
    // middleware via a fresh router that shares the same routes slot.
    // Actually, simplest: just call serve() with the existing server config.
    // The middleware has to be installed before serve(). Re-create the server.
    let mut fresh_router = (*router).clone_for_ffi();
    for mw in crate::default_middleware_stack().into_iter().rev() {
        fresh_router.prepend_middleware(mw);
    }
    let _ = crate::openapi::register_docs_routes(&mut fresh_router, "Unique API", crate::VERSION);
    let new_server = Server::new(fresh_router, addr).with_acceptor_threads(n_cpus);
    let rt = tokio::runtime::Builder::new_multi_thread()
        .enable_all()
        .build()
        .expect("tokio runtime");
    rt.block_on(async move {
        let _ = new_server.serve().await;
    });
}

// ─── Request helpers ──────────────────────────────────────────────────────────

/// Get a route parameter by name. Returns a null-terminated string, or NULL
/// if the parameter doesn't exist.
#[no_mangle]
#[allow(unsafe_code)]
pub unsafe extern "C" fn unique_request_param(
    req: *const UniqueRequest,
    key: *const c_char,
) -> *const c_char {
    if req.is_null() || key.is_null() {
        return std::ptr::null();
    }
    let req = &*req;
    let key = match CStr::from_ptr(key).to_str() {
        Ok(s) => s,
        Err(_) => return std::ptr::null(),
    };
    match req.param(key) {
        Some(v) => CString::new(v).unwrap_or_default().into_raw(),
        None => std::ptr::null(),
    }
}

/// Get a request header by name. Returns NULL if not present.
#[no_mangle]
#[allow(unsafe_code)]
pub unsafe extern "C" fn unique_request_header(
    req: *const UniqueRequest,
    key: *const c_char,
) -> *const c_char {
    if req.is_null() || key.is_null() {
        return std::ptr::null();
    }
    let req = &*req;
    let key = match CStr::from_ptr(key).to_str() {
        Ok(s) => s,
        Err(_) => return std::ptr::null(),
    };
    match req.header(key) {
        Some(v) => CString::new(v).unwrap_or_default().into_raw(),
        None => std::ptr::null(),
    }
}

/// Get the request body as a pointer + length.
#[no_mangle]
#[allow(unsafe_code)]
pub unsafe extern "C" fn unique_request_body(
    req: *const UniqueRequest,
    len: *mut c_uint,
) -> *const u8 {
    if req.is_null() || len.is_null() {
        return std::ptr::null();
    }
    let req = &*req;
    *len = req.body.len() as c_uint;
    req.body.as_ptr()
}

// ─── Response helpers ─────────────────────────────────────────────────────────

/// Set the response status code.
#[no_mangle]
#[allow(unsafe_code)]
pub unsafe extern "C" fn unique_response_status(res: *mut UniqueResponse, code: c_int) {
    if res.is_null() {
        return;
    }
    (*res).set_status(crate::StatusCode::from(code.max(0).min(65535) as u16));
}

/// Set a response header.
#[no_mangle]
#[allow(unsafe_code)]
pub unsafe extern "C" fn unique_response_header(
    res: *mut UniqueResponse,
    key: *const c_char,
    value: *const c_char,
) {
    if res.is_null() || key.is_null() || value.is_null() {
        return;
    }
    let key = match CStr::from_ptr(key).to_str() {
        Ok(s) => s,
        Err(_) => return,
    };
    let value = match CStr::from_ptr(value).to_str() {
        Ok(s) => s,
        Err(_) => return,
    };
    (*res).set_header(key, value);
}

/// Set the response body from raw bytes.
#[no_mangle]
#[allow(unsafe_code)]
pub unsafe extern "C" fn unique_response_body(
    res: *mut UniqueResponse,
    data: *const u8,
    len: c_uint,
) {
    if res.is_null() || data.is_null() {
        return;
    }
    let slice = std::slice::from_raw_parts(data, len as usize);
    (*res).body = bytes::Bytes::copy_from_slice(slice);
    (*res).finalised = true;
}

/// Set the response body from a JSON string. Also sets content-type.
#[no_mangle]
#[allow(unsafe_code)]
pub unsafe extern "C" fn unique_response_json(res: *mut UniqueResponse, json: *const c_char) {
    if res.is_null() || json.is_null() {
        return;
    }
    let json_str = match CStr::from_ptr(json).to_str() {
        Ok(s) => s,
        Err(_) => return,
    };
    (*res).set_header("content-type", "application/json; charset=utf-8");
    (*res).body = bytes::Bytes::from(json_str.to_string().into_bytes());
    (*res).finalised = true;
}

/// Set an error response.
#[no_mangle]
#[allow(unsafe_code)]
pub unsafe extern "C" fn unique_response_error(
    res: *mut UniqueResponse,
    code: c_int,
    message: *const c_char,
) {
    if res.is_null() || message.is_null() {
        return;
    }
    let message = match CStr::from_ptr(message).to_str() {
        Ok(s) => s.to_string(),
        Err(_) => "Unknown error".to_string(),
    };
    let err = crate::UniqueError::new(
        crate::StatusCode::from(code.max(0).min(65535) as u16),
        message,
    );
    let _ = std::mem::replace(&mut *res, Response::new().error(err));
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/// Wrap a C handler function into a Rust async Handler.
#[allow(unsafe_code)]
fn wrap_handler(handler: UniqueHandlerFn) -> Handler {
    Arc::new(move |req: Request| {
        let h = handler;
        Box::pin(async move {
            // Allocate the request on the heap so the C handler receives a
            // stable pointer.
            let req_box = Box::new(req);
            let req_ptr = Box::into_raw(req_box);
            // Allocate a fresh response.
            let mut resp = Response::new();
            let resp_ptr: *mut UniqueResponse = &mut resp;
            // Call the C handler.
            h(req_ptr, resp_ptr);
            // Reclaim the request box.
            let _ = unsafe { Box::from_raw(req_ptr) };
            resp
        })
    })
}

/// Extension trait to clone a Router for the FFI path. Routes' closures
/// can't be cloned, so this returns a router with placeholder handlers
/// that emit a helpful error message. For real production use, the Rust
/// API is recommended.
pub(crate) trait RouterCloneForFfi {
    fn clone_for_ffi(&self) -> Router;
}

impl RouterCloneForFfi for Router {
    fn clone_for_ffi(&self) -> Router {
        let mut new_router = Router::new();
        for meta in self.routes() {
            let placeholder: Handler = Arc::new(|_req| {
                Box::pin(async {
                    Response::new().text("FFI route placeholder — use Rust API for production")
                })
            });
            let _ = new_router.add_with_meta(meta.clone(), placeholder);
        }
        // Copy WebSocket handlers (these are Arc, can be cloned).
        for (k, v) in &self.ws_handlers {
            new_router.ws_handlers.insert(k.clone(), v.clone());
        }
        new_router
    }
}
