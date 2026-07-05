# PHP binding for Kungfu.js via FFI

## Install

```bash
composer require kungfu/kungfu
```

## Quickstart

```php
<?php
$ffi = FFI::cdef(file_get_contents("kungfu.h"), "libkungfu_core.so");

$router = $ffi->kungfu_router_new();
$ffi->kungfu_router_get($router, "/hello", function($req, $res) use ($ffi) {
    $ffi->kungfu_response_status($res, 200);
    $ffi->kungfu_response_json($res, '{"message":"world"}');
});

$server = $ffi->kungfu_server_new($router);
$ffi->kungfu_server_listen($server, 3000);
```

## Requirements
- PHP 8+ with FFI extension enabled
- libkungfu_core.so (built with `cargo build -p kungfu-core --features ffi --release`)

## Package
- **Packagist:** `kungfu/kungfu`
- **Extension:** `.php`
