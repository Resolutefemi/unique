# kungfu-frontend

Frontend module for [Kungfu.js](https://github.com/Resolutefemi/kungfu) — SSR,
`.kng` files, live reload, type generation.

`kungfu-frontend` powers the JS/TS-only frontend story of Kungfu.js:

- **`.kng` file format** — a single file with `data()` + `template()` exports
  (plus optional `---` static HTML footer), compiled to SSR HTML.
- **Server-Side Rendering** via a Node.js subprocess — the Rust server hands
  the `.kng` file + request JSON to Node, gets HTML back, wraps it with the
  CSS + livereload script, and serves it.
- **Client-side hydration** — reactive data binding, click handlers, form
  submission, and state management via a small runtime injected into the page.
- **File-based routing** — auto-register every `.kng` file under `src/pages/`
  as a route (`index.kng` → `/`, `users/[id].kng` → `/users/:id`,
  `assets/[...path].kng` → `/assets/*path`).
- **Live reload** — WebSocket-based hot refresh in dev mode.
- **OpenAPI / route type generation** — emits a `routes.d.ts` for the frontend
  to consume.

## Quick start

```rust
use kungfu_frontend::file_routing::register_pages;
use kungfu::Kungfu;
use std::path::Path;

#[tokio::main]
async fn main() {
    let mut app = Kungfu::new();
    register_pages(app.router_mut(), Path::new("src/pages"))
        .expect("failed to register pages");
    app.run("0.0.0.0:3000").await.unwrap();
}
```

## License

MIT OR Apache-2.0.
