"""Unique.js — Python binding with handler support.

    from unique import UniqueApp

    app = UniqueApp()

    app.get('/hello', lambda req: app.respond(
        req['request_id'], 200, '{"message": "world"}'
    ))

    app.listen(3000)

A `Unique` alias is also exported for convenience and matches the
naming used in the JS and Rust APIs.
"""

from ._native import UniqueApp, compile_css, compile_css_dir, version

# Backwards-compat alias — `Unique` is the name used in the JS and Rust
# APIs, and is the more familiar entry point for new users.
Unique = UniqueApp

__version__ = "1.0.0"
__all__ = ["UniqueApp", "Unique", "compile_css", "compile_css_dir", "version", "__version__"]
