-- LuaRocks rockspec for the Kungfu.js Lua binding.
-- Built and uploaded with:  luarocks upload kungfu-1.0.0-1.rockspec --api-key=<KEY>

package = "kungfu"
version = "1.0.0-1"

source = {
    url = "git+https://github.com/Resolutefemi/kungfu.git",
    tag = "v1.0.0",
    dir = "bindings/lua",
}

description = {
    summary = "Lua binding for the Kungfu.js polyglot web framework",
    detailed = [[
        Lua binding for the Kungfu.js polyglot web framework — Rust core,
        polyglot bindings. Uses LuaJIT FFI to call into libkungfu_core
        (the C ABI exposed by the Rust engine).
    ]],
    homepage = "https://kungfu.js.org",
    license = "MIT OR Apache-2.0",
    maintainer = "Kungfu.js Contributors <noreply@kungfu.js.org>",
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
        kungfu = "src/kungfu.lua",
    },
    copy_directories = { "examples" },
    install = {
        lua = { "src/kungfu.lua" },
    },
}
