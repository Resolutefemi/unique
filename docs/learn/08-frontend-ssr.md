# Frontend & SSR

> ⏱️ 8 minutes

Unique's frontend story is JS/TS-only — that's where the ecosystem is. The
framework provides:

1. **`.kng` SSR files** — a Svelte/Astro-like file format for server-rendered pages.
2. **WebSocket live reload** — automatic page refresh on file changes.
3. **End-to-end TypeScript types** — auto-generated route types (tRPC-style).

## The .kng file format

A `.kng` file exports `data()` and `template()` functions:

```typescript
// src/pages/index.kng
export async function data(req) {
  return { user: { name: 'Bruce', role: 'master' } };
}

export function template({ user }) {
  return `<div class="flex p-4 text-xl">
    Hello, ${user.name}! You are a ${user.role}.
  </div>`;
}
```

At build time, Unique compiles each `.kng` file into a server-rendered
route. At request time, `data()` is called, then `template()` is invoked
with the data, and the resulting HTML is sent to the client.

## File-based routing

Files in `src/pages/` become routes automatically:

| File | Route |
|---|---|
| `src/pages/index.kng` | `/` |
| `src/pages/about.kng` | `/about` |
| `src/pages/users/index.kng` | `/users` |
| `src/pages/users/[id].kng` | `/users/:id` |
| `src/pages/blog/[slug]/index.kng` | `/blog/:slug` |
| `src/pages/assets/[...path].kng` | `/assets/*path` |

The `[name]` syntax becomes `:name` route parameters. The `[...path]`
syntax becomes `*path` wildcards.

## Static HTML + front matter

A `.kng` file can include static HTML after the `---` separator:

```typescript
export async function data() {
  return { user: { name: 'Bruce' } };
}

export function template({ user }) {
  return `<main>Hello, ${user.name}!</main>`;
}
---
<footer class="text-center p-4 text-gray-500">© 2026 Unique.js</footer>
```

The static HTML is appended to the rendered template.

## SSR context + hydration

The SSR renderer wraps the template output in a complete HTML page and
injects:

- `<link rel="stylesheet" href="/unique.css">` — the CSS bundle
- `<script>window.__UNIQUE_DATA__ = {...}</script>` — the data for client-side hydration
- `<script src="/__unique_livereload.js"></script>` — live reload (dev only)

```rust
use unique_frontend::{parse_unique_file, render_page, SsrContext};

let file = parse_unique_file(file_contents, "src/pages/index.kng")?;
let data = serde_json::json!({"user": {"name": "Bruce"}});
let rendered_template = "<main>Hello, Bruce!</main>";

let ctx = SsrContext {
    url: "/".into(),
    headers: serde_json::json!({}),
    inject_livereload: true,  // dev mode
};
let html = render_page(&file, &ctx, rendered_template, &data);
```

## Live reload

In dev mode, every SSR page opens a WebSocket to `/__unique_livereload`.
When the file watcher detects a change, all connected clients receive a
`reload` message and refresh.

```rust
use unique_frontend::LiveReloadServer;

let livereload = LiveReloadServer::new();

// When a file changes:
livereload.trigger_reload();
```

## TypeScript type generation

Unique generates a `routes.d.ts` file from your route metadata, so the
frontend gets full autocomplete when calling backend routes (similar to
tRPC):

```typescript
// routes.d.ts (generated)
declare namespace UniqueRoutes {
  interface GetUsersById {
    path: '/users/:id';
    method: 'GET';
    params: { id: string };
    response: { id: number; email: string };
  }
  interface PostUsers {
    path: '/users';
    method: 'POST';
    request: { email: string; password: string };
    response: { id: number; email: string };
  }
}
```

```rust
use unique_frontend::generate_typescript;

let routes = router.routes();
let typescript = generate_typescript(&routes);
std::fs::write("./frontend/routes.d.ts", typescript)?;
```

## Next steps

Continue to [OpenAPI & Docs](./09-openapi-docs.md) to learn how the
auto-generated Swagger UI works.
