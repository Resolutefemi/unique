# PHP binding for Unique.js via FFI

## Install

```bash
composer require unique/unique
```

## Quickstart

```php
<?php
$ffi = FFI::cdef(file_get_contents("unique.h"), "libunique_core.so");

$router = $ffi->unique_router_new();
$ffi->unique_router_get($router, "/hello", function($req, $res) use ($ffi) {
    $ffi->unique_response_status($res, 200);
    $ffi->unique_response_json($res, '{"message":"world"}');
});

$server = $ffi->unique_server_new($router);
$ffi->unique_server_listen($server, 3000);
```

## Requirements
- PHP 8+ with FFI extension enabled
- libunique_core.so (built with `cargo build -p unique-core --features ffi --release`)

## Package
- **Packagist:** `unique/unique`
- **Extension:** `.php`
