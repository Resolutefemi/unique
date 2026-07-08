// Package unique provides an idiomatic Go binding for the Unique.js
// polyglot web framework. The Rust core is exposed via a C ABI (planned
// for V1.1); until the C ABI lands, this package wraps the HTTP server
// directly using Go's net/http as a fallback.
//
// Quickstart:
//
//	package main
//
//	import "github.com/unique-js/unique/bindings/go/unique"
//
//	func main() {
//	    app := unique.New()
//	    app.Get("/hello", func(w unique.ResponseWriter, r *unique.Request) {
//	        w.JSON(200, map[string]string{"message": "world"})
//	    })
//	    app.Run(":3000")
//	}
package unique

// Version of the Unique.js framework this binding targets.
const Version = "1.0.0"
