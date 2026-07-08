# Elixir binding for Unique.js via NIF

## Install

```elixir
defp deps do
  [{:unique, "~> 1.0"}]
end
```

## Quickstart

```elixir
defmodule MyApp do
  use Unique

  get "/hello" do
    "world"
  end
end

MyApp.start(port: 3000)
```

## Requirements
- Elixir 1.15+
- Erlang/OTP 26+
- libunique_core.so

## Package
- **hex.pm:** `unique`
- **Extension:** `.ex`
