//! Re-exports the most commonly used items.

pub use crate::builder::{Unique, UniqueBuilder};
pub use crate::{delete, get, patch, post, put};
pub use unique_core::{
    error::{UniqueError, Result, StatusCode},
    middleware::{Middleware, Next},
    middleware_builtin,
    request::{Method, Request},
    response::Response,
    router::{Handler, RouteMeta, Router},
    server::Server,
};
