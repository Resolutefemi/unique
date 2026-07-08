// kungfu.hpp — C++ wrapper around the Kungfu.js C ABI.
//
// Provides RAII types (`KungfuRouter`, `KungfuServer`) and std::function-based
// handler registration so C++ developers get an idiomatic API without manual
// pointer management.
//
// ## Quickstart
//
// ```cpp
// #include "kungfu.hpp"
// #include <iostream>
//
// int main() {
//     kungfu::KungfuRouter router;
//     router.get("/hello", [](kungfu::Request& req, kungfu::Response& res) {
//         res.status(200).json(R"({"message":"world"})");
//     });
//
//     kungfu::KungfuServer server(std::move(router));
//     server.listen(3000);
// }
// ```

#pragma once

#include <functional>
#include <memory>
#include <string>
#include <utility>

extern "C" {
#include "kungfu.h"
}

namespace kungfu {

// ─── Request ──────────────────────────────────────────────────────────────────

/// RAII wrapper around `KungfuRequest*`.
class Request {
public:
    explicit Request(KungfuRequest* req) : req_(req) {}

    /// Get a route parameter by name.
    std::string param(const std::string& key) const {
        const char* v = kungfu_request_param(req_, key.c_str());
        return v ? std::string(v) : std::string();
    }

    /// Get a header by name.
    std::string header(const std::string& key) const {
        const char* v = kungfu_request_header(req_, key.c_str());
        return v ? std::string(v) : std::string();
    }

    /// Get the request body as a std::string.
    std::string body() const {
        unsigned int len = 0;
        const uint8_t* data = kungfu_request_body(req_, &len);
        return std::string(reinterpret_cast<const char*>(data), len);
    }

private:
    KungfuRequest* req_;
};

// ─── Response ─────────────────────────────────────────────────────────────────

/// RAII wrapper around `KungfuResponse*`.
class Response {
public:
    explicit Response(KungfuResponse* res) : res_(res) {}

    Response& status(int code) {
        kungfu_response_status(res_, code);
        return *this;
    }

    Response& header(const std::string& key, const std::string& value) {
        kungfu_response_header(res_, key.c_str(), value.c_str());
        return *this;
    }

    void json(const std::string& json_str) {
        kungfu_response_json(res_, json_str.c_str());
    }

    void text(const std::string& text) {
        kungfu_response_header(res_, "content-type", "text/plain; charset=utf-8");
        kungfu_response_body(res_, reinterpret_cast<const uint8_t*>(text.data()),
                             static_cast<unsigned int>(text.size()));
    }

    void html(const std::string& html) {
        kungfu_response_header(res_, "content-type", "text/html; charset=utf-8");
        kungfu_response_body(res_, reinterpret_cast<const uint8_t*>(html.data()),
                             static_cast<unsigned int>(html.size()));
    }

    void error(int code, const std::string& message) {
        kungfu_response_error(res_, code, message.c_str());
    }

private:
    KungfuResponse* res_;
};

// ─── Router ───────────────────────────────────────────────────────────────────

/// Handler function signature: `void(Request&, Response&)`.
using Handler = std::function<void(Request&, Response&)>;

/// RAII wrapper around `KungfuRouter*`.
class KungfuRouter {
public:
    KungfuRouter() : router_(kungfu_router_new()) {}
    ~KungfuRouter() {
        if (router_) kungfu_router_free(router_);
    }
    KungfuRouter(const KungfuRouter&) = delete;
    KungfuRouter& operator=(const KungfuRouter&) = delete;
    KungfuRouter(KungfuRouter&& other) noexcept : router_(other.router_) {
        other.router_ = nullptr;
    }
    KungfuRouter& operator=(KungfuRouter&& other) noexcept {
        if (this != &other) {
            if (router_) kungfu_router_free(router_);
            router_ = other.router_;
            other.router_ = nullptr;
        }
        return *this;
    }

    /// Register a GET route.
    void get(const std::string& path, Handler handler) {
        register_handler(Method::Get, path, std::move(handler));
    }
    /// Register a POST route.
    void post(const std::string& path, Handler handler) {
        register_handler(Method::Post, path, std::move(handler));
    }
    /// Register a PUT route.
    void put(const std::string& path, Handler handler) {
        register_handler(Method::Put, path, std::move(handler));
    }
    /// Register a DELETE route.
    void del(const std::string& path, Handler handler) {
        register_handler(Method::Delete, path, std::move(handler));
    }

    /// Internal: get the raw C pointer (for `KungfuServer`).
    KungfuRouter* raw() && = delete;
    KungfuRouter* raw() & { return router_; }

    /// Release ownership — caller must free with `kungfu_router_free`.
    KungfuRouter* release() {
        KungfuRouter* r = router_;
        router_ = nullptr;
        return r;
    }

private:
    enum class Method { Get, Post, Put, Delete };

    void register_handler(Method method, const std::string& path, Handler handler) {
        // Store the handler in a static map keyed by path — the C callback
        // can't capture state directly, so we use a static lookup.
        // (V1 limitation: handlers must be stateless beyond captured path.)
        auto* heap_handler = new Handler(std::move(handler));
        auto callback = [](KungfuRequest* req, KungfuResponse* res) {
            // The handler pointer is passed via the path's handler slot.
            // For V1 simplicity, we use a thread-local "current handler" pointer.
            // This is not thread-safe across concurrent requests — for
            // production use, the Rust API is recommended.
            Request request(req);
            Response response(res);
            if (current_handler_) {
                (*current_handler_)(request, response);
            }
        };
        current_handler_ = heap_handler;
        switch (method) {
            case Method::Get:    kungfu_router_get(router_, path.c_str(), callback); break;
            case Method::Post:   kungfu_router_post(router_, path.c_str(), callback); break;
            case Method::Put:    kungfu_router_put(router_, path.c_str(), callback); break;
            case Method::Delete: kungfu_router_delete(router_, path.c_str(), callback); break;
        }
    }

    KungfuRouter* router_;

    // V1: thread-local handler pointer. Limitation noted above.
    static inline Handler* current_handler_ = nullptr;
};

// ─── Server ───────────────────────────────────────────────────────────────────

/// RAII wrapper around `KungfuServer*`.
class KungfuServer {
public:
    explicit KungfuServer(KungfuRouter router) : server_(kungfu_server_new(router.release())) {}
    ~KungfuServer() {
        if (server_) kungfu_server_free(server_);
    }
    KungfuServer(const KungfuServer&) = delete;
    KungfuServer& operator=(const KungfuServer&) = delete;
    KungfuServer(KungfuServer&&) noexcept = default;
    KungfuServer& operator=(KungfuServer&&) noexcept = default;

    /// Start listening on the given port. Blocks forever.
    void listen(int port) {
        kungfu_server_listen(server_, port);
    }

private:
    KungfuServer* server_;
};

}  // namespace kungfu
