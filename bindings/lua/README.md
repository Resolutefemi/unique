# Lua binding for Kungfu.js via LuaJIT FFI

## Install

```bash
luarocks install kungfu
```

## Quickstart

```lua
local kungfu = require("kungfu")
local app = kungfu.new()

app:get("/hello", function(req, res)
    res:text("world")
end)

app:listen(3000)
```

## Requirements
- Lua 5.4+ or LuaJIT
- libkungfu_core.so

## Package
- **LuaRocks:** `kungfu`
- **Extension:** `.lua`
