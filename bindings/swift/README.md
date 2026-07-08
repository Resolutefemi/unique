# unique (Swift)

> Swift binding for the Unique.js framework.

## Status: Scaffold

V1 ships a scaffold of the Swift binding using Swift's C interop to call
the C ABI. The Swift Package Manager target uses a `module.modulemap` to
wrap `core/unique.h`.

## Install

```swift
// Package.swift
.package(path: "/path/to/unique/bindings/swift")
```

Build the native library first:

```bash
cargo build -p unique-core --release --features ffi
```

## Quickstart (planned API)

```swift
import Unique

let app = Unique()
app.get("/hello") { req, res in
    res.status(200).json("{\"message\":\"world\"}")
}
app.listen(3000)
```

## License

MIT OR Apache-2.0.
