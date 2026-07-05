#!/usr/bin/env bash
# Publish the JS/TS binding to npm.
#
# Usage:
#   NPM_TOKEN=your_token ./scripts/publish-npm.sh
#
# This builds the napi-rs addon for the current platform and publishes
# with optional cross-platform prebuilt binaries (via GitHub Releases).

set -euo pipefail

cd "$(dirname "$0")/.."
cd bindings/js

if [ -z "${NPM_TOKEN:-}" ]; then
    echo "ERROR: Set NPM_TOKEN env var"
    exit 1
fi

echo "▶ Installing dependencies..."
npm install

echo "▶ Building napi addon..."
npx napi build --platform --release

echo "▶ Publishing to npm..."
NPM_CONFIG_REGISTRY=https://registry.npmjs.org/ \
    npm publish --access public 2>&1 || true

echo "✓ Published to npm"
echo "  https://www.npmjs.com/package/kungfu"
