"""Kungfu.js — Python binding with handler support.

    from kungfu import KungfuApp

    app = KungfuApp()

    app.get('/hello', lambda req: app.respond(
        req['request_id'], 200, '{"message": "world"}'
    ))

    app.listen(3000)

A `Kungfu` alias is also exported for convenience and matches the
naming used in the JS and Rust APIs.
"""

from ._native import KungfuApp, compile_css, compile_css_dir, version

# Backwards-compat alias — `Kungfu` is the name used in the JS and Rust
# APIs, and is the more familiar entry point for new users.
Kungfu = KungfuApp

__version__ = "1.0.0"
__all__ = ["KungfuApp", "Kungfu", "compile_css", "compile_css_dir", "version", "__version__"]
