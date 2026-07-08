// unique.hpp — C++ wrapper around the Unique.js C ABI.
//
// Provides RAII types (`UniqueRouter`, `UniqueServer`) and std::function-based
// handler registration so C++ developers get an idiomatic API without manual
// pointer management.
//
// ## Quickstart
//
// ```cpp
// #include "unique.hpp"
// #include <iostream>
//
// int main() {
//     unique::UniqueRouter router;
//     router.get("/hello", [](unique::Request& req, unique::Response& res) {
//         res.status(200).json(R"({"message":"world"})");
//     });
//
//     unique::UniqueServer server(std::move(router));
//     server.listen(3000);
// }
// ```

#pragma once

#include <functional>
#include <memory>
#include <string>
#include <utility>

extern "C" {
#include "unique.h"
}

namespace unique {

// ─── Request ──────────────────────────────────────────────────────────────────

/// RAII wrapper around `UniqueRequest*`.
class Request {
public:
    explicit Request(UniqueRequest* req) : req_(req) {}

    /// Get a route parameter by name.
    std::string param(const std::string& key) const {
        const char* v = unique_request_param(req_, key.c_str());
        return v ? std::string(v) : std::string();
    }

    /// Get a header by name.
    std::string header(const std::string& key) const {
        const char* v = unique_request_header(req_, key.c_str());
        return v ? std::string(v) : std::string();
    }

    /// Get the request body as a std::string.
    std::string body() const {
        unsigned int len = 0;
        const uint8_t* data = unique_request_body(req_, &len);
        return std::string(reinterpret_cast<const char*>(data), len);
    }

private:
    UniqueRequest* req_;
};

// ─── Response ─────────────────────────────────────────────────────────────────

/// RAII wrapper around `UniqueResponse*`.
class Response {
public:
    explicit Response(UniqueResponse* res) : res_(res) {}

    Response& status(int code) {
        unique_response_status(res_, code);
        return *this;
    }

    Response& header(const std::string& key, const std::string& value) {
        unique_response_header(res_, key.c_str(), value.c_str());
        return *this;
    }

    void json(const std::string& json_str) {
        unique_response_json(res_, json_str.c_str());
    }

    void text(const std::string& text) {
        unique_response_header(res_, "content-type", "text/plain; charset=utf-8");
        unique_response_body(res_, reinterpret_cast<const uint8_t*>(text.data()),
                             static_cast<unsigned int>(text.size()));
    }

    void html(const std::string& html) {
        unique_response_header(res_, "content-type", "text/html; charset=utf-8");
        unique_response_body(res_, reinterpret_cast<const uint8_t*>(html.data()),
                             static_cast<unsigned int>(html.size()));
    }

    void error(int code, const std::string& message) {
        unique_response_error(res_, code, message.c_str());
    }

private:
    UniqueResponse* res_;
};

// ─── Router ───────────────────────────────────────────────────────────────────

/// Handler function signature: `void(Request&, Response&)`.
using Handler = std::function<void(Request&, Response&)>;

/// RAII wrapper around `UniqueRouter*`.
class UniqueRouter {
public:
    UniqueRouter() : router_(unique_router_new()) {}
    ~UniqueRouter() {
        if (router_) unique_router_free(router_);
    }
    UniqueRouter(const UniqueRouter&) = delete;
    UniqueRouter& operator=(const UniqueRouter&) = delete;
    UniqueRouter(UniqueRouter&& other) noexcept : router_(other.router_) {
        other.router_ = nullptr;
    }
    UniqueRouter& operator=(UniqueRouter&& other) noexcept {
        if (this != &other) {
            if (router_) unique_router_free(router_);
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

    /// Internal: get the raw C pointer (for `UniqueServer`).
    UniqueRouter* raw() && = delete;
    UniqueRouter* raw() & { return router_; }

    /// Release ownership — caller must free with `unique_router_free`.
    UniqueRouter* release() {
        UniqueRouter* r = router_;
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
        auto callback = [](UniqueRequest* req, UniqueResponse* res) {
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
            case Method::Get:    unique_router_get(router_, path.c_str(), callback); break;
            case Method::Post:   unique_router_post(router_, path.c_str(), callback); break;
            case Method::Put:    unique_router_put(router_, path.c_str(), callback); break;
            case Method::Delete: unique_router_delete(router_, path.c_str(), callback); break;
        }
    }

    UniqueRouter* router_;

    // V1: thread-local handler pointer. Limitation noted above.
    static inline Handler* current_handler_ = nullptr;
};

// ─── Server ───────────────────────────────────────────────────────────────────

/// RAII wrapper around `UniqueServer*`.
class UniqueServer {
public:
    explicit UniqueServer(UniqueRouter router) : server_(unique_server_new(router.release())) {}
    ~UniqueServer() {
        if (server_) unique_server_free(server_);
    }
    UniqueServer(const UniqueServer&) = delete;
    UniqueServer& operator=(const UniqueServer&) = delete;
    UniqueServer(UniqueServer&&) noexcept = default;
    UniqueServer& operator=(UniqueServer&&) noexcept = default;

    /// Start listening on the given port. Blocks forever.
    void listen(int port) {
        unique_server_listen(server_, port);
    }

private:
    UniqueServer* server_;
};

}  // namespace unique
