#!/usr/bin/env bash
# One-shot release helper: tags v$VERSION and pushes the tag to trigger the
# GitHub Actions release workflow (.github/workflows/release.yml) which then
# publishes to all language package managers.
#
# Usage:
#   scripts/release.sh 1.0.0           # tag v1.0.0 and push
#   scripts/release.sh 1.0.0 --dry-run # create the tag locally but do not push
#
# Before running this script:
#   1. Ensure all tests pass on main (CI is green).
#   2. Bump the version in:
#        - Cargo.toml ([workspace.package].version)
#        - bindings/js/package.json
#        - bindings/python/pyproject.toml
#        - bindings/dart/pubspec.yaml
#        - bindings/php/composer.json
#        - bindings/ruby/lib/unique/version.rb
#        - bindings/elixir/mix.exs (@version)
#        - bindings/lua/unique-*-1.rockspec (version + package)
#        - bindings/csharp/Unique.Core.csproj (<Version>)
#        - bindings/java/pom.xml (<version>)
#        - bindings/kotlin/build.gradle.kts (version = ...)
#   3. Commit the version bump.
#   4. Run this script.

set -euo pipefail

VERSION="${1:-}"
DRY_RUN="${2:-}"

if [[ -z "$VERSION" ]]; then
  echo "Usage: $0 <version>  (e.g. 1.0.0)"
  echo "       $0 <version> --dry-run"
  exit 1
fi

TAG="v${VERSION}"

if git rev-parse "$TAG" >/dev/null 2>&1; then
  echo "ERROR: tag $TAG already exists."
  exit 1
fi

echo "=== Creating tag $TAG ==="
git tag -a "$TAG" -m "Release $TAG"

if [[ "$DRY_RUN" == "--dry-run" ]]; then
  echo "=== DRY RUN — tag created locally, not pushed. ==="
  echo "To push:  git push origin $TAG"
  exit 0
fi

echo "=== Pushing tag $TAG to origin ==="
git push origin "$TAG"

echo ""
echo "=== Tag pushed. The release workflow will now run at: ==="
echo "    https://github.com/Resolutefemi/unique/actions/workflows/release.yml"
echo ""
echo "=== Required GitHub Actions secrets (configure at ==="
echo "    https://github.com/Resolutefemi/unique/settings/secrets/actions): ==="
echo "    - CRATES_IO_TOKEN        (crates.io publish token)"
echo "    - NPM_TOKEN              (npm automation token)"
echo "    - PYPI_API_TOKEN         (PyPI upload token)"
echo "    - MAVEN_CENTRAL_USERNAME (Sonatype OSSRH username)"
echo "    - MAVEN_CENTRAL_PASSWORD (Sonatype OSSRH password)"
echo "    - MAVEN_GPG_PRIVATE_KEY  (GPG private key for signing)"
echo "    - MAVEN_GPG_PASSPHRASE   (GPG passphrase)"
echo "    - NUGET_API_KEY          (NuGet API key)"
echo "    - RUBYGEMS_API_KEY       (RubyGems API key)"
echo "    - HEX_API_KEY            (hex.pm API key)"
echo "    - LUAROCKS_API_KEY       (LuaRocks API key)"
echo "    - PUBLISHER_DRY_RUN      (set to 'true' to skip actual uploads)"
