//! Example: error handling.
//!
//! Run with: `cargo run -p kungfu --example errors`
//!
//! Demonstrates:
//! - Returning a 404 with a custom error
//! - Returning a 422 validation error
//! - Returning a 500 internal error
//! - The unified error shape: { code, message, detail, suggestion }

use kungfu::prelude::*;

fn main() {
    tracing_subscriber::fmt().with_env_filter("info").init();

    let not_found = get!("/not-found", |_req: kungfu::Request| {
        kungfu::Response::new().error(
            kungfu::KungfuError::not_found("This resource does not exist")
                .with_detail("The user you requested has been deleted")
                .with_suggestion("Try GET /users to list all users"),
        )
    });

    let validation_error = post!("/users", |req: kungfu::Request| {
        // Try to parse the body as JSON.
        let body: serde_json::Value = match req.json_value() {
            Ok(v) => v,
            Err(e) => {
                return kungfu::Response::new().error(e);
            }
        };

        // Validate: email field is required.
        if body.get("email").is_none() {
            return kungfu::Response::new().error(
                kungfu::KungfuError::new(
                    kungfu::StatusCode::UnprocessableEntity,
                    "Missing required field: email",
                )
                .with_detail("The request body must contain an 'email' field.")
                .with_suggestion("Ensure your JSON has {\"email\": \"...\"}"),
            );
        }

        kungfu::Response::new()
            .status(kungfu::StatusCode::Created)
            .json(&serde_json::json!({"created": true, "user": body}))
    });

    let internal_error = get!("/boom", |_req: kungfu::Request| {
        kungfu::Response::new().error(
            kungfu::KungfuError::internal("Something went wrong on our end")
                .with_detail("Database connection refused")
                .with_suggestion("Try again in a few seconds, or contact support"),
        )
    });

    let rt = tokio::runtime::Builder::new_multi_thread()
        .enable_all()
        .build()
        .unwrap();

    rt.block_on(
        Kungfu::new()
            .title("Errors Example")
            .route(not_found)
            .route(validation_error)
            .route(internal_error)
            .run("0.0.0.0:3000"),
    )
    .unwrap();
}
