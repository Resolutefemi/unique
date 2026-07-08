#!/usr/bin/env bash
# Publish the Unique.js JavaScript / TypeScript binding to npm.
#
# Usage:
#   scripts/publish-npm.sh            # actually publish
#   scripts/publish-npm.sh --dry-run  # npm pack + dry run, no upload
#
# Required env:
#   NODE_AUTH_TOKEN  — npm automation token (publish-new scope).
#                      Create one at https://www.npmjs.com/settings/USERNAME/tokens
#
# What it does:
#   1. cd bindings/js
#   2. npm install (build deps)
#   3. npm run prepublishOnly  → napi prepublish -t npm
#      This builds per-platform .node binaries for the 5 napi triples
#      and prepares the optionalDependencies platform sub-packages.
#   4. npm publish (or npm pack if --dry-run).

set -euo pipefail

DRY_RUN=""
if [[ "${1:-}" == "--dry-run" ]]; then
  DRY_RUN="--dry-run"
  echo "=== DRY RUN — no package will be uploaded ==="
fi

if [[ -z "${NODE_AUTH_TOKEN:-}" && -z "$DRY_RUN" ]]; then
  echo "ERROR: NODE_AUTH_TOKEN is not set."
  echo "Create a token at https://www.npmjs.com/settings/USERNAME/tokens"
  echo "(automation or publish scope) and:"
  echo "  export NODE_AUTH_TOKEN=npm_..."
  exit 1
fi

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$REPO_ROOT/bindings/js"

echo "=== Installing dependencies ==="
npm install

echo ""
echo "=== Running prepublishOnly (napi prepublish -t npm) ==="
# This builds per-platform .node binaries and emits the per-platform
# optionalDependencies sub-packages that the umbrella package depends on.
npm run prepublishOnly

echo ""
if [[ -n "$DRY_RUN" ]]; then
  echo "=== npm pack (dry run) ==="
  npm pack --dry-run
else
  echo "=== Publishing to npm ==="
  npm publish --access public
fi

echo ""
echo "=== Done. ==="
