# frozen_string_literal: true

require_relative "lib/kungfu/version"

Gem::Specification.new do |spec|
  spec.name          = "kungfu"
  spec.version       = Kungfu::VERSION
  spec.summary       = "Ruby binding for the Kungfu.js polyglot web framework"
  spec.description   = "Ruby binding for the Kungfu.js polyglot web framework — Rust core, polyglot bindings. Uses FFI to call libkungfu_core."
  spec.authors       = ["Kungfu.js Contributors"]
  spec.email         = ["noreply@kungfu.js.org"]
  spec.homepage      = "https://kungfu.js.org"
  spec.license       = "MIT OR Apache-2.0"
  spec.required_ruby_version = Gem::Requirement.new(">= 3.0.0")

  spec.metadata = {
    "homepage_uri"          => "https://kungfu.js.org",
    "source_code_uri"       => "https://github.com/Resolutefemi/kungfu/tree/main/bindings/ruby",
    "changelog_uri"         => "https://github.com/Resolutefemi/kungfu/blob/main/CHANGELOG.md",
    "bug_tracker_uri"       => "https://github.com/Resolutefemi/kungfu/issues",
    "rubygems_mfa_required" => "true",
  }

  # Specify which files to include in the gem.
  spec.files = Dir.chdir(File.expand_path(__dir__)) do
    Dir.glob("{lib,ext,bin}/**/*", File::FNM_DOTMATCH)
      .reject { |f| File.directory?(f) }
  end + %w[README.md LICENSE-MIT LICENSE-APACHE]
  spec.bindir    = "exe"
  spec.executables = spec.files.grep(%r{\Aexe/}) { |f| File.basename(f) }
  spec.require_paths = ["lib"]

  spec.add_dependency "ffi", "~> 1.16"
end
