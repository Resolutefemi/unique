# Releasing Kungfu.js

This document describes how to cut a release of Kungfu.js across **all**
language package managers. The release is fully automated via a GitHub
Actions workflow that triggers on tag push (`v*`).

## Quick start

```bash
# 1. Make sure CI is green on main
# 2. Bump version (if needed) — see "Version numbers" below
# 3. Tag and push
./scripts/release.sh 1.0.0

# Or manually:
git tag -a v1.0.0 -m "Release v1.0.0"
git push origin v1.0.0
```

The tag push triggers
[release.yml](https://github.com/Resolutefemi/kungfu/actions/workflows/release.yml),
which publishes to every registry listed in the next section.

## Registries published to

| # | Registry        | Package                                | Triggered by job      | Notes                                          |
| - | --------------- | -------------------------------------- | --------------------- | ---------------------------------------------- |
| 1 | crates.io       | `kungfu`, `kungfu-core`, `kungfu-orm`, `kungfu-css`, `kungfu-macros`, `kungfu-frontend`, `kungfu-cli` | `publish-crates` | In dependency order; built on Ubuntu. |
| 2 | npm             | `kungfu` (+ per-platform sub-packages) | `publish-npm` + `publish-npm-umbrella` | 5-target matrix (linux x64/arm64, macOS x64/arm64, Windows x64). |
| 3 | PyPI            | `kungfu`                               | `publish-pypi` + `publish-pypi-upload` | 3-OS × 3-Python matrix → wheels uploaded via twine. |
| 4 | Maven Central   | `com.kungfu:kungfu`                    | `publish-maven`       | Requires Sonatype OSSRH + GPG signing.         |
| 5 | NuGet           | `Kungfu.Core`                          | `publish-nuget`       | .NET 8 SDK.                                    |
| 6 | RubyGems        | `kungfu`                               | `publish-rubygems`    | Ruby 3.3.                                      |
| 7 | hex.pm          | `kungfu`                               | `publish-hex`         | OTP 26 + Elixir 1.15.                          |
| 8 | LuaRocks        | `kungfu`                               | `publish-luarocks`    | LuaRocks upload of rockspec.                   |
| 9 | Go proxy        | auto-picked-up                         | (none — implicit)    | `go get` works as soon as the tag exists.      |
| 10 | Swift SPM      | auto-picked-up                         | (none — implicit)    | `import Package` from URL works once tagged.   |
| 11 | pub.dev        | `kungfu`                               | manual `dart pub publish` | Dart pub.dev requires manual `publish` — OAuth-only flow. |
| 12 | Packagist      | `kungfu/kungfu`                        | manual submit         | PHP Packagist auto-publishes from git tags.    |
| 13 | GitHub Release | `kungfu-c-abi-*.tar.gz` / `.zip`       | `github-release` + `github-release-attach` | Pre-built `libkungfu_core` + headers for C/C++ consumers. |

## Required GitHub Actions secrets

Configure at
<https://github.com/Resolutefemi/kungfu/settings/secrets/actions>.

| Secret                       | Used by             | How to obtain                                                          |
| ---------------------------- | ------------------- | ---------------------------------------------------------------------- |
| `CRATES_IO_TOKEN`            | `publish-crates`    | <https://crates.io/settings/api-tokens> — scope: `publish-new`.        |
| `NPM_TOKEN`                  | `publish-npm-umbrella` | <https://www.npmjs.com/settings/USERNAME/tokens> — automation token.   |
| `PYPI_API_TOKEN`             | `publish-pypi-upload` | <https://pypi.org/manage/account/token/> — scope: "Entire account".    |
| `MAVEN_CENTRAL_USERNAME`     | `publish-maven`     | Sonatype Jira account (`ossrh`).                                       |
| `MAVEN_CENTRAL_PASSWORD`     | `publish-maven`     | Sonatype Jira password.                                                |
| `MAVEN_GPG_PRIVATE_KEY`      | `publish-maven`     | `gpg --export-secret-keys --armor <keyid>` output.                     |
| `MAVEN_GPG_PASSPHRASE`       | `publish-maven`     | Passphrase for the GPG key above.                                      |
| `NUGET_API_KEY`              | `publish-nuget`     | <https://www.nuget.org/account/apikeys>.                               |
| `RUBYGEMS_API_KEY`           | `publish-rubygems`  | <https://rubygems.org/profile/api_keys> — scope: `push_rubygem`.       |
| `HEX_API_KEY`                | `publish-hex`       | `mix hex.user key generate <username>`.                                |
| `LUAROCKS_API_KEY`           | `publish-luarocks`  | <https://luarocks.org/settings>.                                       |

> **Note on Maven Central** — Sonatype is migrating to "Central Portal"
> with a new API. The above assumes the classic OSSRH flow. If you are
> on the new Central Portal, replace the `mvn deploy` step with a
> `mvn deploy -Dcentral-publishing-maven-plugin` invocation.

## Local dry-run

Each language has a `--dry-run` publish script under `scripts/`:

```bash
# Rust — runs cargo publish --dry-run for each crate, no upload
./scripts/publish-crates.sh --dry-run

# npm — runs npm pack, no upload
./scripts/publish-npm.sh --dry-run

# Python — builds wheel, no upload
./scripts/publish-pypi.sh --dry-run
```

For an end-to-end dry-run of the full release workflow, use
`workflow_dispatch` from the Actions UI with `dry_run=true`:

<https://github.com/Resolutefemi/kungfu/actions/workflows/release.yml>

## Version numbers

The Rust crates, JS package, Python package, Go module tag, Dart
package, Java/Kotlin artifact, C# package, PHP composer, Ruby gem,
Elixir mix app, Lua rockspec, and the git tag **must all share the same
version string** (`1.0.0`). The CI workflow does **not** bump versions
— that's a manual step.

To bump from `1.0.0` → `1.1.0`, edit:

| File                                              | Field                                |
| ------------------------------------------------- | ------------------------------------ |
| `Cargo.toml`                                     | `[workspace.package].version`        |
| `bindings/js/package.json`                       | `"version"`                          |
| `bindings/python/pyproject.toml`                 | `[project].version`                  |
| `bindings/go/go.mod`                             | (tag-only — no field to bump)        |
| `bindings/dart/pubspec.yaml`                     | `version:`                           |
| `bindings/java/pom.xml`                          | `<version>`                          |
| `bindings/kotlin/build.gradle.kts`               | `version = "..."`                    |
| `bindings/csharp/Kungfu.Core.csproj`             | `<Version>`                          |
| `bindings/php/composer.json`                     | `"version"`                          |
| `bindings/ruby/lib/kungfu/version.rb`            | `VERSION = "..."`                    |
| `bindings/elixir/mix.exs`                        | `@version "..."`                     |
| `bindings/lua/kungfu-X.Y.Z-1.rockspec`           | `version = "X.Y.Z-1"` + filename     |

Then commit, tag `vX.Y.Z`, and push the tag.

## Adding a new language binding

1. Create `bindings/<lang>/` with the manifest file for its package
   manager (e.g. `composer.json`, `gemspec`, `mix.exs`, `rockspec`).
2. Add a new `publish-<lang>` job to
   [`.github/workflows/release.yml`](.github/workflows/release.yml).
3. Add the new secret(s) required to the secrets page.
4. Add a row to the table above.
5. Add the file to bump in the version-bump table above.

## Rollback

Each registry has a different policy for unpublishing / yanking:

| Registry     | How to roll back                                                    |
| ------------ | ------------------------------------------------------------------- |
| crates.io    | `cargo yank --vers <version>` (does not delete, just prevents new dependents) |
| npm          | `npm unpublish kungfu@<version>` (within 72h) or `npm deprecate`   |
| PyPI         | Not possible. Upload a `1.0.1` patch instead.                       |
| Maven Central| Not possible. Upload a new version.                                 |
| NuGet         | `dotnet nuget delete` (only within 72h)                             |
| RubyGems     | `gem yank kungfu -v <version>`                                      |
| hex.pm        | `mix hex.publish --revert <version>`                                |
| LuaRocks     | Not possible. Upload a new rockspec.                                |
| Go proxy     | Not possible (immutable). Bump module path with `/v2`, `/v3` suffix. |
| Swift SPM    | Not possible (tag is immutable). Push a new tag.                    |
| GitHub Release | `gh release delete v1.0.0` (also delete the tag).                 |

## Common pitfalls

- **Crates.io dependency ordering.** `kungfu-cli` depends on `kungfu`
  and `kungfu-core`. If `kungfu-core` hasn't propagated yet when
  `kungfu-cli` publishes, the publish will fail with "no matching
  package." The CI workflow adds a 30s sleep between crate publishes
  to mitigate this. If it still fails, re-run the failed job only.
- **npm per-platform binaries.** napi-rs's `prepublishOnly` builds
  per-platform `.node` files and emits per-platform sub-packages as
  `optionalDependencies`. The CI workflow parallelizes per-platform
  builds, downloads all artifacts, then runs `prepublishOnly` on the
  umbrella job before `npm publish`.
- **PyPI wheel matrix.** Maturin must be run on each target OS to
  produce a manylinux / macOS / Windows wheel. The CI matrix covers
  Linux x86_64, macOS x86_64+arm64, and Windows x86_64. Linux aarch64
  wheels can be cross-compiled but require QEMU; not enabled by default.
- **Maven Central publishing is the slowest.** Sonatype's
  synchronization to Maven Central can take 30+ minutes after the
  `deploy` step succeeds. Be patient.
- **`workflow_dispatch` with `dry_run=true`** skips all `if: ${{ !inputs.dry_run }}`
  steps. Use it to validate the workflow end-to-end without uploading.
