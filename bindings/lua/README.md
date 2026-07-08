# Lua binding for Unique.js via LuaJIT FFI

## Install

```bash
luarocks install unique
```

## Quickstart

```lua
local unique = require("unique")
local app = unique.new()

app:get("/hello", function(req, res)
    res:text("world")
end)

app:listen(3000)
```

## Requirements
- Lua 5.4+ or LuaJIT
- libunique_core.so

## Package
- **LuaRocks:** `unique`
- **Extension:** `.lua`
