//! Example: error handling.
//!
//! Run with: `cargo run -p unique --example errors`
//!
//! Demonstrates:
//! - Returning a 404 with a custom error
//! - Returning a 422 validation error
//! - Returning a 500 internal error
//! - The unified error shape: { code, message, detail, suggestion }

use unique::prelude::*;

fn main() {
    tracing_subscriber::fmt().with_env_filter("info").init();

    let not_found = get!("/not-found", |_req: unique::Request| {
        unique::Response::new().error(
            unique::UniqueError::not_found("This resource does not exist")
                .with_detail("The user you requested has been deleted")
                .with_suggestion("Try GET /users to list all users"),
        )
    });

    let validation_error = post!("/users", |req: unique::Request| {
        // Try to parse the body as JSON.
        let body: serde_json::Value = match req.json_value() {
            Ok(v) => v,
            Err(e) => {
                return unique::Response::new().error(e);
            }
        };

        // Validate: email field is required.
        if body.get("email").is_none() {
            return unique::Response::new().error(
                unique::UniqueError::new(
                    unique::StatusCode::UnprocessableEntity,
                    "Missing required field: email",
                )
                .with_detail("The request body must contain an 'email' field.")
                .with_suggestion("Ensure your JSON has {\"email\": \"...\"}"),
            );
        }

        unique::Response::new()
            .status(unique::StatusCode::Created)
            .json(&serde_json::json!({"created": true, "user": body}))
    });

    let internal_error = get!("/boom", |_req: unique::Request| {
        unique::Response::new().error(
            unique::UniqueError::internal("Something went wrong on our end")
                .with_detail("Database connection refused")
                .with_suggestion("Try again in a few seconds, or contact support"),
        )
    });

    let rt = tokio::runtime::Builder::new_multi_thread()
        .enable_all()
        .build()
        .unwrap();

    rt.block_on(
        Unique::new()
            .title("Errors Example")
            .route(not_found)
            .route(validation_error)
            .route(internal_error)
            .run("0.0.0.0:3000"),
    )
    .unwrap();
}
