#!/usr/bin/env bash
# Publish all Rust crates of the Kungfu.js workspace to crates.io.
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
# - kungfu-macros has no workspace deps
# - kungfu-core has no workspace deps
# - kungfu depends on kungfu-core
# - kungfu-css, kungfu-orm (deps kungfu-macros + kungfu-core),
#   kungfu-frontend (deps kungfu-core + kungfu-css) can publish in any order
# - kungfu-cli depends on kungfu + kungfu-core
CRATES=(
  "kungfu-macros"
  "core"            # kungfu-core
  "kungfu"          # kungfu
  "css"             # kungfu-css
  "orm"             # kungfu-orm
  "frontend"        # kungfu-frontend
  "cli"             # kungfu-cli
)

# kungfu-macros must be first because orm and frontend depend on it.
# core must come before everything except kungfu-macros.
# kungfu must come before cli.
ORDERED_CRATES=(
  "kungfu-macros"
  "core"
  "css"
  "orm"
  "frontend"
  "kungfu"
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
