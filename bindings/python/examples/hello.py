"""Hello-world example using the Kungfu Python binding.

Run with:
    pip install maturin
    maturin develop --release
    python examples/hello.py
"""

from kungfu import Kungfu

app = Kungfu()


@app.get("/hello")
def hello(req):
    return {
        "status": 200,
        "headers": {},
        "body": {"message": "world", "framework": "kungfu", "lang": "python"},
    }


@app.post("/echo/:name")
async def echo(req):
    return {
        "status": 200,
        "headers": {},
        "body": {"hello": req["params"]["name"], "you_sent": req["body"]},
    }


@app.get("/")
def index(req):
    return {
        "status": 200,
        "headers": {"content-type": "text/html"},
        "body": "<h1>Hello from Kungfu (Python)!</h1><p>Try /hello or POST /echo/yourname</p>",
    }


if __name__ == "__main__":
    print("🥋 Kungfu (Python) listening on http://localhost:3000")
    app.run(port=3000)
