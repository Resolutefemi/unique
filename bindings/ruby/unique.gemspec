# frozen_string_literal: true

require_relative "lib/unique/version"

Gem::Specification.new do |spec|
  spec.name          = "unique"
  spec.version       = Unique::VERSION
  spec.summary       = "Ruby binding for the Unique.js polyglot web framework"
  spec.description   = "Ruby binding for the Unique.js polyglot web framework — Rust core, polyglot bindings. Uses FFI to call libunique_core."
  spec.authors       = ["Unique.js Contributors"]
  spec.email         = ["noreply@unique.js.org"]
  spec.homepage      = "https://unique.js.org"
  spec.license       = "MIT OR Apache-2.0"
  spec.required_ruby_version = Gem::Requirement.new(">= 3.0.0")

  spec.metadata = {
    "homepage_uri"          => "https://unique.js.org",
    "source_code_uri"       => "https://github.com/Resolutefemi/unique/tree/main/bindings/ruby",
    "changelog_uri"         => "https://github.com/Resolutefemi/unique/blob/main/CHANGELOG.md",
    "bug_tracker_uri"       => "https://github.com/Resolutefemi/unique/issues",
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
