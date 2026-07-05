// Idiomatic JS/TS wrapper around the napi-rs binding.
//
// Hides the continuation-passing style from the user:
// - Auto-parses the request JSON
// - Auto-calls app.respond() when the handler returns
// - Supports async handlers

const { KungfuApp, compileCss, compileCssDir, version } = require('./kungfu.linux-x64-gnu.node');

class Kungfu {
  constructor() {
    this._app = new KungfuApp();
  }

  // Wrap a handler to auto-parse JSON + auto-respond
  _wrap(handler) {
    return (reqJson) => {
      const req = JSON.parse(reqJson);
      try {
        const result = handler(req);
        if (result && typeof result.then === 'function') {
          // Async handler
          result.then(
            (res) => this._app.respond(req.request_id, res),
            (err) => this._app.respond(req.request_id, {
              status: 500,
              body: JSON.stringify({ error: { message: String(err) } })
            })
          );
        } else if (result) {
          // Sync handler with return value
          this._app.respond(req.request_id, result);
        }
      } catch (err) {
        this._app.respond(req.request_id, {
          status: 500,
          body: JSON.stringify({ error: { message: String(err) } })
        });
      }
    };
  }

  get(path, handler) {
    return this._app.get(path, this._wrap(handler));
  }

  post(path, handler) {
    return this._app.post(path, this._wrap(handler));
  }

  put(path, handler) {
    return this._app.put(path, this._wrap(handler));
  }

  delete(path, handler) {
    return this._app.delete(path, this._wrap(handler));
  }

  listen(port) {
    return this._app.listen(port);
  }
}

module.exports = { Kungfu, compileCss, compileCssDir, version };
