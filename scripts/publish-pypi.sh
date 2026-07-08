#!/usr/bin/env bash
# Publish the Unique.js Python binding to PyPI using maturin.
#
# Usage:
#   scripts/publish-pypi.sh            # actually publish
#   scripts/publish-pypi.sh --dry-run  # build wheels, no upload
#
# Required env:
#   MATURIN_PYPI_TOKEN  — PyPI API token with upload scope.
#                         Create one at https://pypi.org/manage/account/token/
#
# What it does:
#   1. cd bindings/python
#   2. maturin build --release  → builds the wheel for the current platform
#   3. maturin publish          → uploads to PyPI
#
# For multi-platform wheels (Linux x86_64, Linux aarch64, macOS x86_64/arm64,
# Windows x86_64), the GitHub Actions release.yml uses a matrix of runners
# and PyPI's trusted publishing (no token needed). This script is the local
# fallback for single-platform publishing.

set -euo pipefail

DRY_RUN=""
if [[ "${1:-}" == "--dry-run" ]]; then
  DRY_RUN="--dry-run"
  echo "=== DRY RUN — wheels will be built but not uploaded ==="
fi

if [[ -z "${MATURIN_PYPI_TOKEN:-}" && -z "$DRY_RUN" ]]; then
  echo "ERROR: MATURIN_PYPI_TOKEN is not set."
  echo "Create a token at https://pypi.org/manage/account/token/ and:"
  echo "  export MATURIN_PYPI_TOKEN=pypi-..."
  exit 1
fi

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$REPO_ROOT/bindings/python"

echo "=== Building wheel (maturin build --release) ==="
maturin build --release

if [[ -z "$DRY_RUN" ]]; then
  echo ""
  echo "=== Uploading to PyPI (maturin publish) ==="
  maturin publish --username __token__ --password "$MATURIN_PYPI_TOKEN"
fi

echo ""
echo "=== Done. ==="
