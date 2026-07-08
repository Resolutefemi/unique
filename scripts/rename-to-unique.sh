#!/usr/bin/env bash
# Comprehensive rename script: Unique → Unique.js
# Handles all naming patterns across the entire codebase.
#
# Order matters: longer/more-specific patterns first, then catch-alls.

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$REPO_ROOT"

# Files to skip entirely
SKIP_DIRS='.git|target|node_modules|\.next|tool-results|upload|download|skills|dist|build|out'

find_files() {
  find . -type f \
    \( -name '*.rs' -o -name '*.toml' -o -name '*.md' -o -name '*.js' -o -name '*.ts' \
       -o -name '*.tsx' -o -name '*.jsx' -o -name '*.json' -o -name '*.yml' -o -name '*.yaml' \
       -o -name '*.sh' -o -name '*.py' -o -name '*.go' -o -name '*.java' -o -name '*.kt' \
       -o -name '*.swift' -o -name '*.dart' -o -name '*.cs' -o -name '*.php' -o -name '*.rb' \
       -o -name '*.ex' -o -name '*.lua' -o -name '*.c' -o -name '*.cpp' -o -name '*.hpp' \
       -o -name '*.h' -o -name '*.css' -o -name '*.html' -o -name '*.xml' -o -name '*.gradle' \
       -o -name '*.kts' -o -name '*.mod' -o -name '*.sum' -o -name '*.lock' \
       -o -name '*.rockspec' -o -name '*.gemspec' -o -name '*.modulemap' \
       -o -name 'Makefile' -o -name 'Dockerfile' -o -name '*.dockerfile' \
       -o -name '*.env' -o -name '*.cfg' -o -name '*.conf' -o -name '*.txt' \
       -o -name 'LICENSE*' -o -name 'CONTRIBUTING*' -o -name 'CODE_OF_CONDUCT*' \
       -o -name 'SECURITY*' -o -name 'ARCHITECTURE*' -o -name 'ROADMAP*' \
       -o -name 'CHANGELOG*' -o -name 'BADGES*' -o -name 'RELEASING*' \
       -o -name '*.jsonnet' -o -name '*.libsonnet' -o -name '*.tf' -o -name '*.hcl' \) \
    | grep -vE "$SKIP_DIRS" \
    | sort
}

echo "=== Phase 1: Brand-specific replacements ==="

# Brand name with .js suffix
find_files | xargs sed -i 's/Unique\.js/Unique.js/g'
find_files | xargs sed -i 's/unique\.js\.org/unique.js.org/g'
find_files | xargs sed -i 's/unique\.js/unique.js/g'

# npm scoped package
find_files | xargs sed -i 's/@unique\/core/@unique\/core/g'
find_files | xargs sed -i 's/@unique\/orm/@unique\/orm/g'

# Java package
find_files | xargs sed -i 's/com\.unique/com.unique/g'

echo "=== Phase 2: Hyphenated crate/package names ==="

find_files | xargs sed -i 's/unique-core/unique-core/g'
find_files | xargs sed -i 's/unique-orm/unique-orm/g'
find_files | xargs sed -i 's/unique-css/unique-css/g'
find_files | xargs sed -i 's/unique-macros/unique-macros/g'
find_files | xargs sed -i 's/unique-frontend/unique-frontend/g'
find_files | xargs sed -i 's/unique-cli/unique-cli/g'
find_files | xargs sed -i 's/unique-bench/unique-bench/g'
find_files | xargs sed -i 's/unique-js/unique-js/g'
find_files | xargs sed -i 's/unique-python/unique-python/g'

echo "=== Phase 3: Underscored Rust module names ==="

find_files | xargs sed -i 's/unique_core/unique_core/g'
find_files | xargs sed -i 's/unique_orm/unique_orm/g'
find_files | xargs sed -i 's/unique_css/unique_css/g'
find_files | xargs sed -i 's/unique_macros/unique_macros/g'
find_files | xargs sed -i 's/unique_frontend/unique_frontend/g'
find_files | xargs sed -i 's/unique_cli/unique_cli/g'
find_files | xargs sed -i 's/unique_bench/unique_bench/g'

echo "=== Phase 4: PascalCase class/type names ==="

find_files | xargs sed -i 's/UniqueRouter/UniqueRouter/g'
find_files | xargs sed -i 's/UniqueServer/UniqueServer/g'
find_files | xargs sed -i 's/UniqueRequest/UniqueRequest/g'
find_files | xargs sed -i 's/UniqueResponse/UniqueResponse/g'
find_files | xargs sed -i 's/UniqueApp/UniqueApp/g'
find_files | xargs sed -i 's/UniqueApp/UniqueApp/g'
# Generic Unique → Unique (PascalCase) — do this AFTER specific types above
find_files | xargs sed -i 's/Unique/Unique/g'

echo "=== Phase 5: Uppercase constants/env vars ==="

find_files | xargs sed -i 's/UNIQUE/UNIQUE/g'

echo "=== Phase 6: Lowercase catch-all ==="

# This catches everything remaining: package names, URLs, file paths, etc.
find_files | xargs sed -i 's/unique/unique/g'

echo "=== Phase 7: GitHub repo URL references ==="

# Resolutefemi/unique (was Resolutefemi/unique)
find_files | xargs sed -i 's|Resolutefemi/unique|Resolutefemi/unique|g'  # already done by catch-all

echo "=== All text replacements done. ==="
echo ""
echo "Remaining 'unique' or 'Unique' occurrences (should be in .git/target/node_modules only):"
find . -type f | grep -vE "$SKIP_DIRS" | xargs grep -l -i 'unique' 2>/dev/null || echo "(none found)"
