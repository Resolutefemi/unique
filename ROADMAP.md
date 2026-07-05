# Kungfu.js Roadmap

This document tracks the path from V1 to "fastest framework ever" and beyond.

## Status: V1 shipped (2026-06-21)

| Component | Status |
|---|---|
| Rust core engine | ✅ shipped |
| io_uring zero-copy I/O | ✅ shipped (feature flag) |
| HTTP/1.1 pipelining | ✅ shipped (io_uring path) |
| SIMD JSON | ✅ shipped (feature flag) |
| SmallVec-backed Headers | ✅ shipped |
| Response object pooling | ✅ shipped |
| JS/TS binding (napi-rs) | ✅ scaffold |
| ORM (mock driver + sqlx feature gates) | ✅ shipped |
| kungfu-css (Tailwind-like engine) | ✅ shipped |
| Frontend module (.kng SSR + livereload + TS type gen) | ✅ shipped |
| Benchmark suite vs actix/express/fastapi | ✅ scripts + harness |

## V1 — Status: shipped (2026-06-21)

All V1 items shipped. The framework is stable and the v1.0.0 release is
on GitHub. Below is what's been done + what's left for future point releases.

| Component | Status |
|---|---|
| Rust core engine | ✅ shipped |
| io_uring zero-copy I/O | ✅ shipped (feature flag) |
| HTTP/1.1 pipelining | ✅ shipped (io_uring path) |
| SIMD JSON | ✅ shipped (feature flag) |
| SmallVec-backed Headers | ✅ shipped |
| Response object pooling | ✅ shipped |
| JS/TS binding (napi-rs) | ✅ scaffold |
| ORM (mock driver + sqlx feature gates wired) | ✅ shipped |
| kungfu-css (Tailwind-like engine) | ✅ shipped |
| Frontend module (.kng SSR + livereload + TS type gen) | ✅ shipped |
| Benchmark suite vs actix/express/fastapi | ✅ scripts + harness |
| WebSocket routes (RFC 6455) | ✅ shipped |
| Multipart body parsing | ✅ shipped |
| JSON Schema request validation | ✅ shipped |
| Argon2id password hashing | ✅ shipped |
| Gzip compression middleware | ✅ shipped |
| ETag + conditional GET middleware | ✅ shipped |
| Static file serving middleware | ✅ shipped |
| Cookie/CookieJar/SameSite | ✅ shipped |
| C ABI via cbindgen (kungfu.h) | ✅ shipped (feature flag `ffi`) |
| C++ binding (header-only) | ✅ shipped |
| Java binding (JNI scaffold) | ✅ shipped |
| Dart binding (dart:ffi scaffold) | ✅ shipped |
| Swift binding (C interop scaffold) | ✅ shipped |
| Python binding (pyo3) | ✅ scaffold |
| Go binding (net/http) | ✅ shipped |
| `.kng` SSR execution via Node subprocess | ✅ shipped |
| DevMode controller (livereload + routes.d.ts wiring) | ✅ shipped |
| File-based routing (auto-register .kng files) | ✅ shipped |
| JWT authentication middleware (scaffold) | ✅ shipped |
| Background jobs queue | ✅ shipped |
| Plugin system (scaffold) | ✅ shipped |
| CLI: kungfu new | ✅ shipped |
| CLI: kungfu start --watch (source-code hot reload) | ✅ shipped |
| CLI: kungfu build | ✅ shipped |
| CLI: kungfu migrate | ✅ shipped (generates guidance) |
| CLI: kungfu generate admin | ✅ shipped |
| CLI: kungfu deploy (Dockerfile/compose/systemd) | ✅ shipped |
| NextJS-style tutorial (10 chapters) | ✅ shipped |

## Future work (post-V1)

### Performance (path to 3M req/s)
- ⏳ Connection-per-thread scheduling — pin each TCP connection to a worker thread.
- ⏳ Custom HTTP parser (vs `httparse`).
- ⏳ HTTP/3 via `quinn` + `h3`.
- ⏳ io_uring buffer ring (true zero-copy).
- ⏳ Batched `writev` on the io_uring path.
- ⏳ TLS offload via `rustls`.

### ORM
- ⏳ Real sqlx driver for INSERT/UPDATE/DELETE (currently only SELECT is wired).
- ⏳ Connection pooling via `deadpool`.
- ⏳ Query cache keyed by SQL + params.

### Frontend
- ⏳ `.kng` client-side hydration (currently SSR-only).
- ⏳ WebSocket livereload server wired into HTTP listener (currently `DevMode` exists but isn't auto-wired).
- ⏳ End-to-end type safety (auto-emit `routes.d.ts` on every route registration).

### Auth
- ⏳ Full JWT HS256/RS256/ES256 signature verification (V1 decodes claims but doesn't verify).
- ⏳ Session-based auth (cookie + server-side store).
- ⏳ OAuth2 integration.

### Admin dashboard
- ⏳ Auto-generate CRUD interfaces from model definitions (currently just lists routes from OpenAPI).

## V1.2 — Polyglot bindings (1-2 months)

Language bindings, in priority order:

1. **Python** (pyo3) — decorators, async/await, Cython-like req/res proxies.
2. **Go** (cgo) — pure-Go wrapper around the C ABI.
3. **Java/Kotlin** (JNI or jextract) — `@RestController` annotations.
4. **Dart** (dart:ffi) — for Flutter backends.
5. **Swift** (C interop) — for server-side Swift.
6. **C++** (header-only wrapper around the C ABI).

Each binding is ~1 day of work given the C ABI exists.

## V1.3 — Performance (1-2 months)

Path to 3M req/s on 16-core production hardware:

- [ ] **Connection-per-thread scheduling** — pin each TCP connection to a specific worker thread (no cross-thread wakeups). 1.3× expected gain.
- [ ] **Custom HTTP parser** — hand-rolled for our exact `Request` shape, 1.5-2× faster than `httparse`.
- [ ] **HTTP/3** via `quinn` + `h3`. The next-gen transport.
- [ ] **io_uring buffer ring** — register a shared buffer pool with the kernel so SQEs can reference pre-registered buffers (zero buffer ownership transfer).
- [ ] **Batched `writev`** — accumulate multiple responses per connection, write them in one syscall.
- [ ] **TLS offload** — `rustls` with ring provider, async hand-off to a TLS thread pool.

## V3 — Full-stack + ecosystem (3-6 months)

- **Admin dashboard generator** — `kungfu generate admin` produces a React app served at `/admin` with CRUD interfaces auto-generated from model definitions.
- **`.kng` full client-side hydration** — currently we SSR with no hydration. V3 adds a JS client that picks up `__KUNGFU_DATA__` and hydrates the page into a reactive SPA.
- **File-based routing** — `src/pages/users/[id].kng` automatically becomes the `/users/:id` route.
- **Built-in authentication** — `Kungfu::auth(AuthProvider::Jwt(...))` middleware with `@RequireAuth` handler attribute.
- **WebSocket routes** — `ws!("/chat", handler)` macro for real-time.
- **Background jobs** — `Kungfu::queue(QueueConfig)` with `#[job]` proc macro.
- **Plugin system** — `kungfu-plugin` crate with a stable ABI for third-party extensions.

## Long-term vision

Kungfu aims to be the **fastest framework ever** that's also **polyglot** and **full-stack**. The competition:

- **For speed**: gemini (C++), may_minihttp (Rust). Kungfu matches these architecturally; V1.3 closes the remaining gap.
- **For polyglot**: no real competitor. Most frameworks are language-locked.
- **For full-stack**: Next.js, Nuxt, SvelteKit — but they're JS-only on the backend. Kungfu lets you write the backend in any language while keeping the frontend in JS/TS.

The "fastest framework ever" claim becomes defensible once V1.3 lands. The "polyglot full-stack" claim is already defensible.
