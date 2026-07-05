"""Hello-world example using the Kungfu Python binding with handlers.

Run with:
    pip install maturin
    maturin develop --release
    python examples/hello_handlers.py
"""

import json
from kungfu import KungfuApp

app = KungfuApp()


@app.get  # type: ignore  # This is a simplified decorator pattern
def _register_hello():
    pass  # Decorator pattern not supported in V1 — use explicit registration below.


# Register routes explicitly (V1 API):
def hello_handler(req_json):
    """GET /hello — returns a greeting."""
    req = json.loads(req_json)
    print(f"Python handler called: {req['method']} {req['path']}")
    app.respond(
        req["request_id"],
        200,
        json.dumps({"message": "world", "lang": "python", "framework": "kungfu"})
    )


def echo_handler(req_json):
    """POST /echo/:name — echoes back the name + body."""
    req = json.loads(req_json)
    params = json.loads(req.get("params", "{}"))
    name = params.get("name", "anonymous")
    app.respond(
        req["request_id"],
        200,
        json.dumps({"hello": name, "you_sent": req.get("body", "")})
    )


def error_handler(req_json):
    """GET /error — demonstrates error handling."""
    req = json.loads(req_json)
    app.respond(
        req["request_id"],
        500,
        json.dumps({"error": {"message": "Something went wrong!"}})
    )


# Sync handler — returns a dict directly (no need to call respond()).
def health_handler(req_json):
    """GET /health — sync handler that returns a dict."""
    return {"status": 200, "body": json.dumps({"status": "ok"})}


# Register all routes.
app.get("/hello", hello_handler)
app.post("/echo/:name", echo_handler)
app.get("/error", error_handler)
app.get("/health", health_handler)

if __name__ == "__main__":
    print("🥋 Kungfu (Python) listening on http://localhost:3000")
    print("   Try:  curl http://localhost:3000/hello")
    print("   Try:  curl -X POST http://localhost:3000/echo/bruce -H 'Content-Type: application/json' -d '{\"kick\":\"roundhouse\"}'")
    print("   Try:  curl http://localhost:3000/health")
    print("   Docs: http://localhost:3000/docs")
    app.listen(3000)
