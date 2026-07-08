defmodule Unique do
  @moduledoc """
  Elixir binding for the Unique.js polyglot web framework.

  A polyglot web framework with a Rust core. This Elixir binding uses a
  NIF (Native Implemented Function) to call into `libunique_core` — the
  C ABI exposed by the Rust engine.

  ## Status

  V1 ships a scaffold of the Elixir binding. The actual NIF
  implementation requires the C ABI plus a Rustler bridge — currently
  a TODO planned for V1.1. See the README for details.

  ## Example (target API)

      iex> app = Unique.new()
      iex> app = Unique.get(app, "/hello", fn _req ->
      ...>   %{status: 200, body: ~s({"message":"world"})}
      ...> end)
      iex> Unique.listen(app, 3000)
      :ok

  """

  @version "1.0.0"

  @doc "Returns the current Unique.js binding version."
  def version, do: @version

  @doc """
  Construct a new Unique application.

  ## Status: scaffold

  The NIF bridge to libunique_core is not yet wired in. This function
  currently returns `{:error, :not_implemented}`.
  """
  def new do
    {:error, :not_implemented}
  end
end
