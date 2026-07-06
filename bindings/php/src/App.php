<?php
declare(strict_types=1);

/**
 * Kungfu.js — PHP binding
 *
 * A polyglot web framework with a Rust core. This PHP binding uses FFI
 * to call into libkungfu_core (the C ABI exposed by the Rust engine).
 *
 * Status: scaffold. V1 ships the FFI cdef declarations and the PHP-side
 * API surface. Per-route handler registration requires the C bridge
 * planned for V1.1. See the README for details.
 */

namespace Kungfu;

use FFI;

class App
{
    private FFI $ffi;
    private FFI\CData $router;
    private ?FFI\CData $server = null;

    public function __construct()
    {
        $header = file_get_contents(__DIR__ . '/kungfu.h');
        $libPath = getenv('KUNGFU_LIB_PATH') ?: 'kungfu_core';
        $this->ffi = FFI::cdef($header, $libPath);
        $this->router = $this->ffi->kungfu_router_new();
    }

    public function get(string $path, callable $handler): self
    {
        // V1 scaffold: route registration is a no-op; see README for status.
        return $this;
    }

    public function post(string $path, callable $handler): self
    {
        return $this;
    }

    public function listen(int $port = 3000): int
    {
        $this->server = $this->ffi->kungfu_server_new($this->router);
        return $this->ffi->kungfu_server_listen($this->server, '0.0.0.0', $port);
    }

    public function __destruct()
    {
        if ($this->server !== null) {
            $this->ffi->kungfu_server_free($this->server);
        }
        $this->ffi->kungfu_router_free($this->router);
    }
}
