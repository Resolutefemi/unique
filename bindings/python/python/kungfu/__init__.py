"""Kungfu.js — Python binding with handler support.

    from kungfu import KungfuApp

    app = KungfuApp()

    app.get('/hello', lambda req: app.respond(
        req['request_id'], 200, '{"message": "world"}'
    ))

    app.listen(3000)
"""

from ._native import KungfuApp, compile_css, compile_css_dir, version

__version__ = "1.0.0"
__all__ = ["KungfuApp", "compile_css", "compile_css_dir", "version", "__version__"]
