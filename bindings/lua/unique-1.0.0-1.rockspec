-- LuaRocks rockspec for the Unique.js Lua binding.
-- Built and uploaded with:  luarocks upload unique-1.0.0-1.rockspec --api-key=<KEY>

package = "unique"
version = "1.0.0-1"

source = {
    url = "git+https://github.com/Resolutefemi/unique.git",
    tag = "v1.0.0",
    dir = "bindings/lua",
}

description = {
    summary = "Lua binding for the Unique.js polyglot web framework",
    detailed = [[
        Lua binding for the Unique.js polyglot web framework — Rust core,
        polyglot bindings. Uses LuaJIT FFI to call into libunique_core
        (the C ABI exposed by the Rust engine).
    ]],
    homepage = "https://unique.js.org",
    license = "MIT OR Apache-2.0",
    maintainer = "Unique.js Contributors <noreply@unique.js.org>",
    labels = { "web", "framework", "http", "server", "rust", "ffi" },
}

dependencies = {
    "lua >= 5.1",  -- works on Lua 5.1, 5.2, 5.3, 5.4, and LuaJIT
}

supported_platforms = {
    "unix",
    "windows",
}

build = {
    type = "builtin",
    modules = {
        unique = "src/unique.lua",
    },
    copy_directories = { "examples" },
    install = {
        lua = { "src/unique.lua" },
    },
}
