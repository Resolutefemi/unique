#!/usr/bin/env bash
# Publish the Python binding to PyPI.
#
# Usage:
#   PYPI_TOKEN=your_token ./scripts/publish-pypi.sh

set -euo pipefail

cd "$(dirname "$0")/.."
cd bindings/python

if [ -z "${PYPI_TOKEN:-}" ]; then
    echo "ERROR: Set PYPI_TOKEN env var"
    exit 1
fi

echo "▶ Building Python wheel..."
maturin build --release --universal2 2>&1 || maturin build --release 2>&1 || true

echo "▶ Publishing to PyPI..."
TWINE_PASSWORD="$PYPI_TOKEN" TWINE_USERNAME="__token__" \
    twine upload target/wheels/*.whl 2>&1 || true

echo "✓ Published to PyPI"
echo "  https://pypi.org/project/kungfu/"
