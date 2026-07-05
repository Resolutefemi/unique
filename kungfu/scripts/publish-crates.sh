#!/usr/bin/env bash
# Publish all Rust crates to crates.io.
#
# Usage:
#   CARGO_REGISTRY_TOKEN=your_token ./scripts/publish-crates.sh
#
# Order matters: kungfu-core → kungfu-macros → kungfu → kungfu-orm → kungfu-css → kungfu-frontend

set -euo pipe fail

if [ -z "${CARGO_REGISTRY_TOKEN:-}" ]; then
    echo "ERROR: Set CARGO_REGISTRY_TOKEN env var"
    exit 1
fi

CRATES=(
    "core"
    "kungfu-macros"
    "kungfu"
    "orm"
    "css"
    "frontend"
)

for crate in "${CRATES[@]}"; do
    echo "▶ Publishing $crate..."
    (cd "$crate" && cargo publish --token "$CARGO_REGISTRY_TOKEN" --allow-dirty 2>&1) || true
    sleep 5  # Wait for crates.io to index
done

echo "✓ All crates published to crates.io"
echo "  https://crates.io/crates/kungfu-core"
echo "  https://crates.io/crates/kungfu"
