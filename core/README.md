# unique-core

The core engine of [Unique.js](https://github.com/Resolutefemi/unique) — a polyglot web framework with a Rust heart.

`unique-core` is the foundation under every Unique.js binding. It contains the
hand-rolled HTTP/1.1 server, trie router, onion-model middleware pipeline,
WebSocket (RFC 6455), HTTP/3, TLS, ORM hooks, and the C ABI that lets the
framework be driven from any language.

## Highlights

- **Hand-rolled HTTP/1.1 server** (tokio + custom parser, 86k+ req/s on CI
  runners; the custom parser is 1.5–2× faster than `httparse`).
- **Trie router** with `:params`, `*wildcards`, O(path depth) lookup, automatic
  405 Method Not Allowed, and OpenAPI route metadata emission.
- **Onion-model middleware** with short-circuit support. Built-in middleware
  ships security headers, CORS, leaky-bucket rate limiting, structured logging,
  ETag, gzip, JSON-Schema validation, and JWT auth.
- **io_uring zero-copy I/O** (Linux 5.1+, optional `io_uring` feature) with a
  pre-registered buffer ring — 2–3× throughput improvement.
- **SIMD JSON** (optional `simd` feature) — 2–4× faster JSON encode/decode on
  x86_64 with AVX2.
- **WebSocket (RFC 6455)** with full frame handling, masking, fragmentation,
  and ping/pong.
- **HTTP/3** (`quinn` + `h3`).
- **TLS/HTTPS** via `rustls`.
- **C ABI** (`ffi` feature) — generates `unique.h` via `cbindgen` for use from
  C, C++, Dart, Swift, Java, Kotlin, PHP, Ruby, C#, Lua, and Elixir.
- Buffer pooling, single-syscall response writes, `SO_REUSEPORT` multi-acceptor,
  `TCP_NODELAY`.

## Feature flags

| Feature   | Effect                                                                  |
| --------- | ----------------------------------------------------------------------- |
| `default` | None — pure-Rust HTTP/1.1 server.                                       |
| `simd`    | SIMD-accelerated JSON parsing via `simd-json` (x86_64 + AVX2).          |
| `io_uring`| Linux io_uring zero-copy I/O via `tokio-uring` (no-op on other OSes).   |
| `ffi`     | Generate `unique.h` via `cbindgen` for use from other languages.        |

## License

MIT OR Apache-2.0.
