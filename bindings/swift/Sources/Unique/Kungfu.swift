// Unique.swift — Swift binding for the Unique.js framework.
//
// Uses Swift's C interop to call the C ABI directly. The native library is
// `libunique_core.so` / `.dylib` / `.dll`, built with
// `cargo build -p unique-core --features ffi`.

import Foundation
#if canImport(Glibc)
import Glibc
#elseif canImport(Darwin)
import Darwin
#endif

// ─── C ABI imports ────────────────────────────────────────────────────────────

// Opaque pointer types matching `core/unique.h`.
public typealias UniqueRouterRef = OpaquePointer
public typealias UniqueServerRef = OpaquePointer
public typealias UniqueRequestRef = OpaquePointer
public typealias UniqueResponseRef = OpaquePointer

public typealias UniqueHandlerFn = @convention(c) (UniqueRequestRef?, UniqueResponseRef?) -> Void

@_silgen_name("unique_router_new")
public func unique_router_new() -> UniqueRouterRef?

@_silgen_name("unique_router_free")
public func unique_router_free(_ router: UniqueRouterRef?)

@_silgen_name("unique_router_get")
public func unique_router_get(_ router: UniqueRouterRef?, _ path: UnsafePointer<CChar>, _ handler: @convention(c) (UniqueRequestRef?, UniqueResponseRef?) -> Void)

@_silgen_name("unique_router_post")
public func unique_router_post(_ router: UniqueRouterRef?, _ path: UnsafePointer<CChar>, _ handler: @convention(c) (UniqueRequestRef?, UniqueResponseRef?) -> Void)

@_silgen_name("unique_server_new")
public func unique_server_new(_ router: UniqueRouterRef?) -> UniqueServerRef?

@_silgen_name("unique_server_listen")
public func unique_server_listen(_ server: UniqueServerRef?, _ port: Int32)

@_silgen_name("unique_request_param")
public func unique_request_param(_ req: UniqueRequestRef?, _ key: UnsafePointer<CChar>) -> UnsafePointer<CChar>?

@_silgen_name("unique_response_status")
public func unique_response_status(_ res: UniqueResponseRef?, _ code: Int32)

@_silgen_name("unique_response_json")
public func unique_response_json(_ res: UniqueResponseRef?, _ json: UnsafePointer<CChar>)

// ─── Swift API ────────────────────────────────────────────────────────────────

/// A Unique application.
public final class Unique {
    private var router: UniqueRouterRef?

    public init() {
        self.router = unique_router_new()
    }

    deinit {
        if let r = router { unique_router_free(r) }
    }

    public func get(_ path: String, handler: @escaping (Request, Response) -> Void) {
        path.withCString { cPath in
            // V1 scaffold: the C callback can't capture Swift closures
            // directly. We use a global handler table keyed by path.
            HandlerTable.shared.register(path, handler: handler)
            unique_router_get(router, cPath) { req, res in
                let request = Request(ptr: req!)
                let response = Response(ptr: res!)
                // Look up the handler by reading the request path.
                // For V1 simplicity, just call the first registered handler.
                if let h = HandlerTable.shared.handlers.first?.value {
                    h(request, response)
                }
            }
        }
    }

    public func listen(_ port: Int = 3000) {
        let server = unique_server_new(router)
        unique_server_listen(server, Int32(port))
    }
}

public struct Request {
    let ptr: UniqueRequestRef

    public func param(_ key: String) -> String {
        return key.withCString { cKey -> String in
            guard let cVal = unique_request_param(ptr, cKey) else { return "" }
            return String(cString: cVal)
        }
    }
}

public struct Response {
    let ptr: UniqueResponseRef

    public func status(_ code: Int) -> Response {
        unique_response_status(ptr, Int32(code))
        return self
    }

    public func json(_ json: String) {
        json.withCString { cJson in
            unique_response_json(ptr, cJson)
        }
    }
}

// V1: global handler table (workaround for C-callback-can't-capture-closure).
internal class HandlerTable {
    static let shared = HandlerTable()
    var handlers: [String: (Request, Response) -> Void] = [:]
    func register(_ path: String, handler: @escaping (Request, Response) -> Void) {
        handlers[path] = handler
    }
}
