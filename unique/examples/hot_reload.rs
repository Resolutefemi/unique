//! Example: hot reload.
//!
//! Run with: `cargo run -p unique --example hot_reload`
//!
//! Demonstrates:
//! - Running a Unique server with hot-reload enabled
//! - The file watcher fires on changes to .rs files in src/ and routes/
//! - The reload callback receives the router slot and can swap in a new router
//!
//! To test:
//! 1. Run this example
//! 2. curl http://localhost:3000/hello → returns {"message":"world"}
//! 3. Edit `unique/src/lib.rs` and save
//! 4. The watcher fires and the callback runs

use unique::prelude::*;
use unique::server::{HotReloadConfig, RouterSlot};
use std::sync::Arc;

fn main() {
    tracing_subscriber::fmt().with_env_filter("info").init();

    let hello = get!("/hello", |_req: unique::Request| {
        unique::Response::new().json(&serde_json::json!({"message":"world"}))
    });

    // Build a fresh router for the reload callback.
    let build_router = || {
        let hello = get!("/hello", |_req: unique::Request| {
            unique::Response::new().json(&serde_json::json!({"message":"world (reloaded)"}))
        });
        let mut router = unique::Router::new();
        let _ = router.add_with_meta(
            unique::RouteMeta {
                path: "/hello".into(),
                method: unique::Method::Get,
                ..Default::default()
            },
            {
                use unique::__macro_support::make_handler;
                use std::sync::Arc;
                let f = |_req: unique::Request| {
                    unique::Response::new().json(&serde_json::json!({"message":"world (reloaded)"}))
                };
                make_handler(f)
            },
        );
        router
    };

    let rt = tokio::runtime::Builder::new_multi_thread()
        .enable_all()
        .build()
        .unwrap();

    let config = HotReloadConfig::default();

    rt.block_on(
        Unique::new()
            .title("Hot Reload Example")
            .route(hello)
            .run_with_hot_reload("0.0.0.0:3000", config, |router_slot: &Arc<RouterSlot>| {
                tracing::info!("Hot reload triggered — swapping router");
                unique::server::swap_router(router_slot, build_router());
            }),
    )
    .unwrap();
}
