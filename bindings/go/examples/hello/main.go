// Hello-world example using the Unique Go binding.
//
// Run with:
//   cd bindings/go
//   go run ./examples/hello
package main

import (
	"encoding/json"

	"github.com/unique-js/unique/bindings/go/unique"
)

func main() {
	app := unique.New()

	app.Get("/hello", func(w unique.ResponseWriter, r *unique.Request) {
		w.JSON(200, map[string]interface{}{
			"message":   "world",
			"framework": "unique",
			"lang":      "go",
		})
	})

	app.Post("/echo/:name", func(w unique.ResponseWriter, r *unique.Request) {
		var body interface{}
		_ = json.Unmarshal(r.Body, &body)
		w.JSON(200, map[string]interface{}{
			"hello":    r.Params["name"],
			"you_sent": body,
		})
	})

	app.Get("/", func(w unique.ResponseWriter, r *unique.Request) {
		w.HTML(200, "<h1>Hello from Unique (Go)!</h1><p>Try /hello or POST /echo/yourname</p>")
	})

	println("🥋 Unique (Go) listening on http://localhost:3000")
	if err := app.Run(":3000"); err != nil {
		panic(err)
	}
}
