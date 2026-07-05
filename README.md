# 🥋 Kungfu.js

[![CI](https://github.com/Resolutefemi/kungfu/actions/workflows/ci.yml/badge.svg)](https://github.com/Resolutefemi/kungfu/actions/workflows/ci.yml)
[![License: MIT OR Apache-2.0](https://img.shields.io/badge/license-MIT%20OR%20Apache--2.0-blue.svg)](./LICENSE-MIT)

A polyglot web framework with a Rust core. Write your backend in any language. Frontend in JS/TS only.

**Fast.** 86k+ req/s on CI runners. io_uring + SIMD JSON support.

**Secure.** HSTS, CSP, CORS, rate limiting, JWT auth. All on by default.

**Simple.** No macros needed. Just closures.

## Quick Start

```bash
git clone https://github.com/Resolutefemi/kungfu.git
cd kungfu
cargo run -p kungfu-cli -- demo
```

Visit http://localhost:3000/hello

## Hello World (Rust)

```rust
use kungfu::prelude::*;

fn main() {
    let rt = tokio::runtime::Runtime::new().unwrap();
    rt.block_on(
        Kungfu::new()
            .handle_get("/hello", |_req, res| res.text("world"))
            .run("0.0.0.0:3000"),
    ).unwrap();
}
```

## Hello World (JavaScript)

```js
const { Kungfu } = require('kungfu');
const app = new Kungfu();

app.get('/hello', (req) => {
    return { status: 200, body: JSON.stringify({ message: 'world' }) };
});

app.listen(3000);
```

## Hello World (Python)

```python
from kungfu import KungfuApp
import json

app = KungfuApp()

app.get('/hello', lambda req: app.respond(
    json.loads(req)['request_id'], 200,
    json.dumps({'message': 'world'})
))

app.listen(3000)
```

## Features

| Feature | Status |
|---|---|
| HTTP/1.1 + HTTP/3 server | Yes |
| ORM (SQLite, PostgreSQL, MySQL) | Yes |
| JWT auth (HS256, RS256, ES256) | Yes |
| WebSocket | Yes |
| CSS engine (Tailwind-like) | Yes |
| Auto OpenAPI + Swagger UI | Yes |
| TLS/HTTPS | Yes |
| SSR (.kng files) | Yes |
| Client-side hydration | Yes |
| Multipart file uploads | Yes |
| Gzip compression | Yes |
| Admin dashboard | Yes |
| io_uring zero-copy | Yes (Linux) |
| SIMD JSON | Yes (x86_64) |
| C ABI (for C++/Dart/Swift/Java) | Yes |

## Languages

| Language | Backend | Frontend |
|---|---|---|
| Rust | Full support | SSR via .kng |
| JavaScript/TypeScript | Handler bridging | Full support |
| Python | Handler bridging | SSR via .kng |
| Go | Standalone impl | SSR via .kng |
| Java | C ABI scaffold | SSR via .kng |
| Dart | C ABI scaffold | SSR via .kng |
| Swift | C ABI scaffold | SSR via .kng |
| C++ | C ABI wrapper | SSR via .kng |

## File Extensions

| Extension | Language | Purpose |
|---|---|---|
| `.jsk` | JavaScript Kungfu | Kungfu JS source files |
| `.tsk` | TypeScript Kungfu | Kungfu TS source files |
| `.kng` | All | SSR page files |

## Build with Max Performance

```bash
cargo build --workspace --release --features "kungfu-core/io_uring kungfu-core/simd"
```

## Tutorial

Visit the interactive tutorial: https://github.com/Resolutefemi/kungfu/tree/main/tutorial-site

Or read the text tutorials in `docs/learn/`.

## License

MIT OR Apache-2.0
