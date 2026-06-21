#!/usr/bin/env bash
# Push the Kungfu.js repo to GitHub.
#
# Usage:
#   ./scripts/push-to-github.sh                       # interactive (browser)
#   GITHUB_TOKEN=ghp_xxx ./scripts/push-to-github.sh  # non-interactive (token)
#   REPO_OWNER=youruser REPO_NAME=kungfu ./scripts/push-to-github.sh
#
# What this does:
#   1. Ensures `gh` CLI is on PATH (uses ~/.local/bin/gh if installed there)
#   2. Authenticates (browser flow OR $GITHUB_TOKEN)
#   3. Creates the repo on GitHub (public by default; PRIVATE=1 to override)
#   4. Adds the remote and pushes main

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$REPO_ROOT"

# --- Locate gh ---
GH="${GH:-}"
if [[ -z "$GH" ]]; then
  if command -v gh >/dev/null 2>&1; then GH="$(command -v gh)"
  elif [[ -x "$HOME/.local/bin/gh" ]]; then GH="$HOME/.local/bin/gh"
  else echo "gh CLI not found. Install: https://cli.github.com/"; exit 1; fi
fi

# --- Auth ---
REPO_OWNER="${REPO_OWNER:-kungfu-js}"
REPO_NAME="${REPO_NAME:-kungfu}"
if [[ "${PRIVATE:-0}" == "1" ]]; then VIS="private"; else VIS="public"; fi

if [[ -n "${GITHUB_TOKEN:-}" ]]; then
  echo "Authenticating with GITHUB_TOKEN..."
  printf '%s\n' "$GITHUB_TOKEN" | "$GH" auth login --with-token
else
  if ! "$GH" auth status >/dev/null 2>&1; then
    echo "Opening browser for GitHub authentication..."
    "$GH" auth login --web --git-protocol https
  fi
fi

# --- Create remote repo ---
if ! "$GH" repo view "$REPO_OWNER/$REPO_NAME" >/dev/null 2>&1; then
  echo "Creating $VIS repo $REPO_OWNER/$REPO_NAME..."
  "$GH" repo create "$REPO_OWNER/$REPO_NAME" --"$VIS" --source=. --remote=origin --push
  echo "✓ Pushed to https://github.com/$REPO_OWNER/$REPO_NAME"
else
  echo "Repo $REPO_OWNER/$REPO_NAME already exists."
  git remote remove origin 2>/dev/null || true
  git remote add origin "https://github.com/$REPO_OWNER/$REPO_NAME.git"
  git push -u origin main
  echo "✓ Pushed to https://github.com/$REPO_OWNER/$REPO_NAME"
fi
