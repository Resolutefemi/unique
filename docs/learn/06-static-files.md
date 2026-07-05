# Static Files & CSS

> ⏱️ 6 minutes

Kungfu ships with a built-in static file server and a Tailwind-like CSS
engine. Together, they let you serve a complete frontend without any
external dependencies.

## Serving static files

The `serve_static` middleware serves files from a directory on disk:

```rust
use kungfu::middleware_builtin::serve_static;

Kungfu::new()
    .use_middleware(serve_static("./public"))
    .handle_get("/api/health", |_req, res| res.text("ok"))
    .run("0.0.0.0:3000")
```

A request to `GET /style.css` will serve `./public/style.css`. A request to
`GET /api/health` falls through to the route handler.

### What it does automatically

- **MIME detection**: `.css` → `text/css`, `.js` → `application/javascript`,
  `.png` → `image/png`, and 20+ other types.
- **Cache headers**: sets `Cache-Control: public, max-age=3600` for static
  assets.
- **Path traversal protection**: rejects `..` in paths.
- **Directory index**: serves `index.html` for directory requests.

## The CSS engine

Kungfu's CSS engine (`kungfu-css`) is a Rust implementation of the
Tailwind utility-class model. It scans your source files for `class="..."`
attributes and emits a minimal CSS bundle containing only the classes
actually used.

### Why a custom engine?

Tailwind CSS is excellent, but it ships 30+ MB of CSS in development mode
and its JIT compiler requires Node.js. Kungfu's CSS engine is part of the
Rust core — `kungfu build` produces a CSS bundle in microseconds without
spawning a Node process.

### Supported utilities (V1)

- **Layout**: `block`, `inline`, `flex`, `grid`, `hidden`, `relative`, `absolute`, `fixed`, `sticky`
- **Flexbox**: `flex-row`, `flex-col`, `flex-wrap`, `flex-1`, `items-center`, `items-start`, `items-end`, `items-stretch`, `items-baseline`, `justify-center`, `justify-between`, `justify-around`, `justify-evenly`, `self-auto`, `self-start`, `self-end`, `self-center`, `gap-1` through `gap-8`
- **Spacing**: `p-{n}`, `px-{n}`, `py-{n}`, `m-{n}`, `mx-{n}`, `my-{n}` (0–16, 1 unit = 0.25rem)
- **Colors**: `text-{color}-{shade}`, `bg-{color}-{shade}`, `border-{color}-{shade}` (red, blue, green, gray, yellow, purple; 100–900)
- **Typography**: `text-{xs|sm|base|lg|xl|2xl|3xl|4xl}`, `font-{bold|semibold|medium|normal|light}`, `italic`, `text-center`, `text-left`, `text-right`
- **Borders**: `border`, `border-0`, `border-2`, `rounded`, `rounded-{sm|md|lg|xl|2xl|full}`
- **Display**: `w-{n}`, `h-{n}`, `w-full`, `h-full`
- **Responsive prefixes**: `sm:`, `md:`, `lg:`, `xl:`, `2xl:`
- **State prefixes**: `hover:`, `focus:`, `active:`, `disabled:`

### Compiling CSS at build time

```rust
use kungfu_css::compile_directory;

fn main() -> std::io::Result<()> {
    let css = compile_directory("./src")?;
    std::fs::write("./public/kungfu.css", css)?;
    Ok(())
}
```

Or use it as a Kungfu route to serve the compiled CSS in dev mode:

```rust
use kungfu_css::compile_classes;
use bytes::Bytes;

let css: Bytes = Bytes::from(compile_classes("flex p-4 text-red-500 hover:bg-blue-200"));
let css_for_handler = css.clone();

Kungfu::new()
    .handle_get("/kungfu.css", move |_req, _res| {
        kungfu::Response::new()
            .header("content-type", "text/css")
            .send_bytes(css_for_handler.clone())
    })
    .run("0.0.0.0:3000")
```

### Example HTML

```html
<!doctype html>
<html>
<head>
  <link rel="stylesheet" href="/kungfu.css">
</head>
<body class="flex items-center justify-center h-full bg-gray-100">
  <div class="bg-white rounded-lg shadow p-8 max-w-md">
    <h1 class="text-2xl font-bold mb-4 text-gray-900">Hello from Kungfu</h1>
    <p class="text-gray-600 mb-4">A polyglot web framework with a Rust core.</p>
    <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
      Get started
    </button>
  </div>
</body>
</html>
```

## Next steps

Continue to [Database & ORM](./07-database-orm.md) to learn how to define
models and run queries.
