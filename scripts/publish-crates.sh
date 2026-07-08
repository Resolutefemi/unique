#!/usr/bin/env bash
# Publish all Rust crates of the Unique.js workspace to crates.io.
#
# Usage:
#   scripts/publish-crates.sh            # actually publish
#   scripts/publish-crates.sh --dry-run  # cargo publish --dry-run for each crate
#
# Required env:
#   CARGO_REGISTRY_TOKEN  — crates.io API token with publish-new scope.
#
# Crates are published in dependency order so each crate's dependencies
# are already on crates.io by the time it is published.

set -euo pipefail

DRY_RUN=""
if [[ "${1:-}" == "--dry-run" ]]; then
  DRY_RUN="--dry-run"
  echo "=== DRY RUN — no packages will be uploaded ==="
fi

if [[ -z "${CARGO_REGISTRY_TOKEN:-}" && -z "$DRY_RUN" ]]; then
  echo "ERROR: CARGO_REGISTRY_TOKEN is not set."
  echo "Create a token at https://crates.io/settings/api-tokens and:"
  echo "  export CARGO_REGISTRY_TOKEN=cyo_..."
  exit 1
fi

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$REPO_ROOT"

# Publish order: leaves first, then dependents.
# - unique-macros has no workspace deps
# - unique-core has no workspace deps
# - unique depends on unique-core
# - unique-css, unique-orm (deps unique-macros + unique-core),
#   unique-frontend (deps unique-core + unique-css) can publish in any order
# - unique-cli depends on unique + unique-core
CRATES=(
  "unique-macros"
  "core"            # unique-core
  "unique"          # unique
  "css"             # unique-css
  "orm"             # unique-orm
  "frontend"        # unique-frontend
  "cli"             # unique-cli
)

# unique-macros must be first because orm and frontend depend on it.
# core must come before everything except unique-macros.
# unique must come before cli.
ORDERED_CRATES=(
  "unique-macros"
  "core"
  "css"
  "orm"
  "frontend"
  "unique"
  "cli"
)

for crate in "${ORDERED_CRATES[@]}"; do
  echo ""
  echo "=== Publishing $crate ==="
  (
    cd "$crate"
    cargo publish $DRY_RUN
  )
  if [[ -z "$DRY_RUN" ]]; then
    # Wait for the crate to propagate on crates.io before publishing dependents.
    echo "Waiting 30s for crates.io to propagate $crate..."
    sleep 30
  fi
done

echo ""
echo "=== All crates published. ==="
