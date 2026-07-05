"""Kungfu.js — Python binding.

Idiomatic Python API for the Kungfu.js polyglot web framework.

    from kungfu import Kungfu, compile_css, version

    print(version())  # '1.0.0'
    print(compile_css('flex p-4 text-red-500'))  # CSS string

    # Start the Rust HTTP server (built-in routes: /hello, /docs)
    Kungfu().start_server(port=3000)
"""

from ._native import compile_css, compile_css_dir, start_server, version

__version__ = "1.0.0"
__all__ = ["compile_css", "compile_css_dir", "start_server", "version", "__version__"]


class Kungfu:
    """A Kungfu.js application."""

    def __init__(self):
        pass

    def start_server(self, port: int = 3000) -> None:
        """Start the Rust HTTP server. Blocks the calling thread."""
        start_server(port)

    @staticmethod
    def version() -> str:
        return version()

    @staticmethod
    def compile_css(classes: str) -> str:
        return compile_css(classes)
