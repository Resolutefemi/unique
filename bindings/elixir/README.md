# Elixir binding for Kungfu.js via NIF

## Install

```elixir
defp deps do
  [{:kungfu, "~> 1.0"}]
end
```

## Quickstart

```elixir
defmodule MyApp do
  use Kungfu

  get "/hello" do
    "world"
  end
end

MyApp.start(port: 3000)
```

## Requirements
- Elixir 1.15+
- Erlang/OTP 26+
- libkungfu_core.so

## Package
- **hex.pm:** `kungfu`
- **Extension:** `.ex`
