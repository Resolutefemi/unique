# kungfu

The idiomatic Rust API for [Kungfu.js](https://github.com/Resolutefemi/kungfu) —
a polyglot web framework with a Rust core.

`kungfu` is the high-level, ergonomic surface you reach for when writing a
Rust-native Kungfu.js app. It wraps [`kungfu-core`](https://crates.io/crates/kungfu-core)
with a fluent builder, sensible defaults, and all the middleware wired in.

## Quick start

```toml
[dependencies]
kungfu = "1"
tokio = { version = "1", features = ["full"] }
```

```rust
use kungfu::Kungfu;

#[tokio::main]
async fn main() {
    Kungfu::new()
        .handle_get("/", |_req, res| res.text("hello world"))
        .run("0.0.0.0:3000")
        .await
        .unwrap();
}
```

## What you get out of the box

- HSTS, CSP, X-Frame-Options, Referrer-Policy headers
- CORS with preflight handling
- Leaky-bucket rate limiting (200 burst / 100 rps per IP + path)
- Structured request logging
- Trie router with `:params`, `*wildcards`, automatic 405s
- WebSocket, HTTP/3, TLS — all opt-in
- The full `kungfu-core` feature set (io_uring, SIMD JSON, FFI) via feature flags

## Examples

See [`examples/`](https://github.com/Resolutefemi/kungfu/tree/main/kungfu/examples)
for `hello`, `simple`, `middleware`, `params`, `errors`, and `hot_reload`.

## License

MIT OR Apache-2.0.
