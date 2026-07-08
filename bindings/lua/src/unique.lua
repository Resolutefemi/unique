-- Unique.js — Lua binding
--
-- A polyglot web framework with a Rust core. This Lua binding uses LuaJIT
-- FFI to call into libunique_core (the C ABI exposed by the Rust engine).
--
-- Status: scaffold. V1 ships the FFI cdef declarations and the Lua-side
-- API surface. Per-route handler registration requires the C bridge
-- planned for V1.1.

local unique = {}
unique._VERSION = "1.0.0"

-- Try to load LuaJIT FFI; if not available, fall back to a stub.
local has_ffi, ffi = pcall(require, "ffi")
if has_ffi then
    ffi.cdef[[
        typedef struct UniqueRouter UniqueRouter;
        typedef struct UniqueServer UniqueServer;
        typedef struct UniqueRequest UniqueRequest;
        typedef struct UniqueResponse UniqueResponse;

        UniqueRouter *unique_router_new(void);
        void          unique_router_free(UniqueRouter *router);
        UniqueServer *unique_server_new(UniqueRouter *router);
        void          unique_server_free(UniqueServer *server);
        int           unique_server_listen(UniqueServer *server,
                                           const char *host,
                                           uint16_t port);
    ]]
    -- Users must set UNIQUE_LIB_PATH or have libunique_core installed
    -- system-wide.
    local lib_path = os.getenv("UNIQUE_LIB_PATH") or "unique_core"
    unique._lib = ffi.load(lib_path)
end

--- Construct a new Unique application.
-- @return table app  A new app handle.
function unique.new()
    local app = {}
    app._router = nil
    if unique._lib then
        app._router = unique._lib.unique_router_new()
    end

    --- Register a GET route.
    -- V1 scaffold: route registration is a no-op; see README for status.
    function app:get(path, handler)
        -- TODO: wire through to libunique_core once the C bridge is in.
        return self
    end

    --- Register a POST route.
    function app:post(path, handler)
        return self
    end

    --- Start the server on the given port.
    function app:listen(port)
        port = port or 3000
        if not unique._lib or not self._router then
            error("libunique_core not loaded — set UNIQUE_LIB_PATH", 2)
        end
        local server = unique._lib.unique_server_new(self._router)
        return unique._lib.unique_server_listen(server, "0.0.0.0", port)
    end

    return app
end

return unique
