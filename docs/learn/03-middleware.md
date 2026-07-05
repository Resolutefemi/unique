# Middleware

> ⏱️ 8 minutes

Middleware is a function that runs before/after every request. Kungfu's
middleware uses the classic "onion" model — outermost middleware runs
first on the way in, last on the way out.

## Built-in middleware

Kungfu installs these automatically (secure-by-default):

| Middleware | What it does |
|---|---|
| `security_headers` | Sets HSTS, CSP, X-Frame-Options, Referrer-Policy, Permissions-Policy |
| `cors` | Handles CORS + preflight OPTIONS |
| `rate_limiter` | Leaky-bucket per IP+path (200 burst, 100 rps by default) |
| `logger` | Structured request log via `tracing` |

You can disable them with `.insecure()`, but the framework will warn
you (and you really shouldn't).

## Built-in opt-in middleware

These are available but not installed by default:

| Middleware | What it does | How to enable |
|---|---|---|
| `serve_static` | Serves files from a directory | `.use_middleware(serve_static("./public"))` |
| `etag` | Adds ETag headers + handles If-None-Match | `.use_middleware(etag())` |

## Writing custom middleware

A middleware is a closure `Fn(Request, Next) -> Future<Response>`:

```rust
use kungfu::prelude::*;
use std::sync::Arc;

fn main() {
    let add_request_id: kungfu::Middleware = Arc::new(|req, next| {
        Box::pin(async move {
            // Before handler runs.
            let request_id = req
                .header("x-request-id")
                .map(|s| s.to_string())
                .unwrap_or_else(|| format!("req-{}", std::process::id()));

            // Call the next middleware (or the handler).
            let mut resp = next(req).await;

            // After handler runs.
            resp.set_header("x-request-id", request_id);
            resp
        })
    });

    let rt = tokio::runtime::Runtime::new().unwrap();
    rt.block_on(
        Kungfu::new()
            .use_middleware(add_request_id)
            .handle_get("/hello", |_req, res| res.text("world"))
            .run("0.0.0.0:3000"),
    ).unwrap();
}
```

## Short-circuiting

If you don't call `next(req)`, the chain stops. This is how you implement
authentication:

```rust
let auth_required: kungfu::Middleware = Arc::new(|req, next| {
    Box::pin(async move {
        if req.header("x-api-key").is_none() {
            return kungfu::Response::new()
                .status(kungfu::StatusCode::Unauthorized)
                .json(&serde_json::json!({"error": "Missing API key"}));
        }
        next(req).await
    })
});
```

## Middleware order

Middleware is applied in the order you register it. Outermost first:

```rust
Kungfu::new()
    .use_middleware(logger_middleware)      // 1st in, last out
    .use_middleware(auth_middleware)        // 2nd in, 2nd-to-last out
    .use_middleware(rate_limit_middleware)  // 3rd in, 3rd-to-last out
    .handle_get("/api/data", |_req, res| res.text("data"))
```

Request flow:

```
logger → auth → rate_limit → handler → rate_limit → auth → logger
```

## Static file serving

Serve files from a directory:

```rust
use kungfu::middleware_builtin::serve_static;

Kungfu::new()
    .use_middleware(serve_static("./public"))
    .handle_get("/api/health", |_req, res| res.text("ok"))
    .run("0.0.0.0:3000")
```

A request to `GET /style.css` will serve `./public/style.css` if it exists,
otherwise the request falls through to the router. The middleware
automatically:

- Sets the `Content-Type` based on file extension
- Sets `Cache-Control: public, max-age=3600` for static assets
- Rejects path-traversal attempts (`..`)
- Serves `index.html` for directory requests

## ETag + conditional GET

The `etag` middleware generates an ETag for each response body and handles
`If-None-Match` requests automatically:

```rust
use kungfu::middleware_builtin::etag;

Kungfu::new()
    .use_middleware(etag())
    .handle_get("/large.json", |_req, res| res.json(&big_data()))
```

```bash
$ curl -i http://localhost:3000/large.json
HTTP/1.1 200 OK
etag: "abc123def456"
...

$ curl -i -H 'If-None-Match: "abc123def456"' http://localhost:3000/large.json
HTTP/1.1 304 Not Modified
```

## Next steps

Continue to [Request & Response](./04-request-response.md) to learn about
parsing JSON bodies, form data, and file uploads.
