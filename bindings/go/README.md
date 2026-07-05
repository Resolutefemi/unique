# kungfu (Go)

> One API surface, infinite languages. The Go binding for the Kungfu.js framework.

## Install

```bash
go get github.com/kungfu-js/kungfu/bindings/go
```

## Quickstart

```go
package main

import "github.com/kungfu-js/kungfu/bindings/go/kungfu"

func main() {
    app := kungfu.New()

    app.Get("/hello", func(w kungfu.ResponseWriter, r *kungfu.Request) {
        w.JSON(200, map[string]string{"message": "world"})
    })

    app.Post("/echo/:name", func(w kungfu.ResponseWriter, r *kungfu.Request) {
        w.JSON(200, map[string]interface{}{
            "hello":    r.Params["name"],
            "you_sent": string(r.Body),
        })
    })

    app.Run(":3000")
}
```

## Status

V1.0 of this Go binding uses Go's `net/http` as the underlying transport
while keeping the Kungfu API surface (Router / Request / Response /
Middleware). When the C ABI lands in V1.1, this package will swap to
calling the Rust core for full performance parity with the Rust/Python
bindings.

## Why use Kungfu from Go?

- **Same API as the Rust/Python/JS bindings.** A Go developer can write
  a Kungfu backend without learning JavaScript.
- **Secure by default.** The framework ships secure-by-default middleware
  (security headers, CORS, rate limiter) — the Go binding inherits these
  via the shared API design.
- **Auto OpenAPI.** Every route is reflected in an OpenAPI 3.1 spec at
  `/openapi.json` (planned for V1.1 — currently the Go binding doesn't
  emit OpenAPI).

## Building

```bash
cd bindings/go
go build ./...
go run ./examples/hello
```

## API reference

### `kungfu.New()`

Construct a new application.

### `app.Get(pattern, handler)` / `Post` / `Put` / `Delete` / `Patch`

Register a route. `pattern` supports `:param` and `*wildcard` segments:

```go
app.Get("/users/:id", getUser)
app.Get("/assets/*path", getAsset)
```

### `app.Run(addr)`

Start the server. Blocks until the server stops.

### `app.Use(middleware)`

Register a middleware function.

### Handler signature

```go
type HandlerFunc func(w ResponseWriter, r *Request)

type Request struct {
    Method  string
    Path    string
    Query   map[string]string
    Params  map[string]string
    Headers map[string]string
    Body    []byte
}

type ResponseWriter interface {
    Status(code int)
    Header(key, value string)
    JSON(code int, v interface{})
    Text(code int, s string)
    HTML(code int, s string)
}
```

## License

MIT OR Apache-2.0.
