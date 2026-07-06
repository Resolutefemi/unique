-- Kungfu.js — Lua binding
--
-- A polyglot web framework with a Rust core. This Lua binding uses LuaJIT
-- FFI to call into libkungfu_core (the C ABI exposed by the Rust engine).
--
-- Status: scaffold. V1 ships the FFI cdef declarations and the Lua-side
-- API surface. Per-route handler registration requires the C bridge
-- planned for V1.1.

local kungfu = {}
kungfu._VERSION = "1.0.0"

-- Try to load LuaJIT FFI; if not available, fall back to a stub.
local has_ffi, ffi = pcall(require, "ffi")
if has_ffi then
    ffi.cdef[[
        typedef struct KungfuRouter KungfuRouter;
        typedef struct KungfuServer KungfuServer;
        typedef struct KungfuRequest KungfuRequest;
        typedef struct KungfuResponse KungfuResponse;

        KungfuRouter *kungfu_router_new(void);
        void          kungfu_router_free(KungfuRouter *router);
        KungfuServer *kungfu_server_new(KungfuRouter *router);
        void          kungfu_server_free(KungfuServer *server);
        int           kungfu_server_listen(KungfuServer *server,
                                           const char *host,
                                           uint16_t port);
    ]]
    -- Users must set KUNGFU_LIB_PATH or have libkungfu_core installed
    -- system-wide.
    local lib_path = os.getenv("KUNGFU_LIB_PATH") or "kungfu_core"
    kungfu._lib = ffi.load(lib_path)
end

--- Construct a new Kungfu application.
-- @return table app  A new app handle.
function kungfu.new()
    local app = {}
    app._router = nil
    if kungfu._lib then
        app._router = kungfu._lib.kungfu_router_new()
    end

    --- Register a GET route.
    -- V1 scaffold: route registration is a no-op; see README for status.
    function app:get(path, handler)
        -- TODO: wire through to libkungfu_core once the C bridge is in.
        return self
    end

    --- Register a POST route.
    function app:post(path, handler)
        return self
    end

    --- Start the server on the given port.
    function app:listen(port)
        port = port or 3000
        if not kungfu._lib or not self._router then
            error("libkungfu_core not loaded — set KUNGFU_LIB_PATH", 2)
        end
        local server = kungfu._lib.kungfu_server_new(self._router)
        return kungfu._lib.kungfu_server_listen(server, "0.0.0.0", port)
    end

    return app
end

return kungfu
