defmodule Unique.MixProject do
  use Mix.Project

  @version "1.0.0"
  @source_url "https://github.com/Resolutefemi/unique"
  @homepage_url "https://unique.js.org"

  def project do
    [
      app: :unique,
      version: @version,
      elixir: "~> 1.15",
      start_permanent: Mix.env() == :prod,
      deps: deps(),
      package: package(),
      docs: docs(),
      name: "Unique.js",
      source_url: @source_url,
      homepage_url: @homepage_url,
      description: description()
    ]
  end

  def application do
    [
      extra_applications: [:logger]
    ]
  end

  defp deps do
    [
      {:ex_doc, "~> 0.34", only: :dev, runtime: false}
    ]
  end

  defp description do
    "Elixir binding for the Unique.js polyglot web framework — Rust core, polyglot bindings. Uses a NIF to call libunique_core."
  end

  defp package do
    [
      name: "unique",
      files: ~w(lib mix.exs README.md LICENSE-MIT LICENSE-APACHE),
      licenses: ["MIT", "Apache-2.0"],
      links: %{
        "GitHub" => @source_url,
        "Homepage" => @homepage_url,
        "Changelog" => "#{@source_url}/blob/main/CHANGELOG.md",
        "Issues" => "#{@source_url}/issues"
      },
      maintainers: ["Unique.js Contributors"]
    ]
  end

  defp docs do
    [
      main: "Unique",
      source_url: @source_url,
      extras: ["README.md"]
    ]
  end
end
