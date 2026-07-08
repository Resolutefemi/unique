"""Hello-world example using the Unique Python binding.

Run with:
    pip install maturin
    maturin develop --release
    python examples/hello.py
"""

from unique import Unique

app = Unique()


@app.get("/hello")
def hello(req):
    return {
        "status": 200,
        "headers": {},
        "body": {"message": "world", "framework": "unique", "lang": "python"},
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
        "body": "<h1>Hello from Unique (Python)!</h1><p>Try /hello or POST /echo/yourname</p>",
    }


if __name__ == "__main__":
    print("🥋 Unique (Python) listening on http://localhost:3000")
    app.run(port=3000)
