#!/usr/bin/env bash
# Commit files one by one in a sensible order, with descriptive messages.
# Designed to produce ~80-100 commits showing the build-up of the framework.

set -e
cd /home/z/my-project/unique

commit() {
    local file="$1"
    local msg="$2"
    git add "$file"
    git commit -m "$msg" --quiet
    echo "  ✓ $msg"
}

echo "▶ Phase 1: Project skeleton"
commit ".gitignore" "chore: add .gitignore for Rust + Node + Python"
commit "Cargo.toml" "chore: initialise Cargo workspace with 3 crates"

echo
echo "▶ Phase 2: Core crate foundation"
commit "core/Cargo.toml" "feat(core): add unique-core crate manifest"
commit "core/src/version.rs" "feat(core): add framework version constant + banner"
commit "core/src/error.rs" "feat(core): add unified UniqueError model with code/message/detail/suggestion"
commit "core/src/lib.rs" "feat(core): add crate root with public module re-exports"

echo
echo "▶ Phase 3: Request/Response types"
commit "core/src/request/mod.rs" "feat(core): add Request type with form/query/JSON parsing + percent-decoding"
commit "core/src/response/mod.rs" "feat(core): add Response type with json/text/html/html_escape + pre-serialised 404/405/429 bodies"

echo
echo "▶ Phase 4: Router"
commit "core/src/router/mod.rs" "feat(core): add trie router with :params, *wildcards, method dispatch, OpenAPI metadata"

echo
echo "▶ Phase 5: Middleware pipeline"
commit "core/src/middleware/mod.rs" "feat(core): add onion-style middleware pipeline with build_chain()"
commit "core/src/middleware/builtin/mod.rs" "feat(core): add builtin middleware module"
commit "core/src/middleware/builtin/logger.rs" "feat(core): add structured request logger middleware"
commit "core/src/middleware/builtin/cors.rs" "feat(core): add CORS middleware with pre-flight handling"
commit "core/src/middleware/builtin/security_headers.rs" "feat(core): add security headers middleware (HSTS/CSP/X-Frame-Options/Referrer-Policy/Permissions-Policy)"
commit "core/src/middleware/builtin/rate_limiter.rs" "feat(core): add leaky-bucket rate limiter middleware (per-IP + per-route)"

echo
echo "▶ Phase 6: OpenAPI generator"
commit "core/src/openapi/mod.rs" "feat(core): add auto OpenAPI 3.1 spec generator + Swagger UI at /docs"

echo
echo "▶ Phase 7: Server"
commit "core/src/server/pool.rs" "feat(core): add buffer pooling for per-connection read buffers"
commit "core/src/server/hot_reload.rs" "feat(core): add file watcher + atomic router swap for hot reload"
commit "core/src/server/mod.rs" "feat(core): add hand-rolled HTTP/1.1 server with SO_REUSEPORT + TCP_NODELAY + single-syscall writes"
commit "core/src/server/io_uring.rs" "feat(core,v2): add io_uring zero-copy I/O path with HTTP/1.1 pipelining"

echo
echo "▶ Phase 8: Idiomatic Rust API crate"
commit "unique/Cargo.toml" "feat(unique): add unique crate manifest"
commit "unique/src/prelude.rs" "feat(unique): add prelude module re-exporting common items"
commit "unique/src/macros.rs" "feat(unique): add get!/post!/put!/delete!/patch! macros"
commit "unique/src/builder.rs" "feat(unique): add UniqueBuilder with fluent API + hot-reload entry point"
commit "unique/src/lib.rs" "feat(unique): add crate root with macro re-exports"

echo
echo "▶ Phase 9: Proc-macro crate (ORM Model derive)"
commit "unique-macros/Cargo.toml" "feat(macros): add unique-macros proc-macro crate manifest"
commit "unique-macros/src/lib.rs" "feat(macros): add #[derive(Model)] with #[field] attributes (primary/unique/sensitive/min/max)"

echo
echo "▶ Phase 10: ORM"
commit "orm/Cargo.toml" "feat(orm): add unique-orm crate manifest with feature-gated sqlx drivers"
commit "orm/src/error.rs" "feat(orm): add ORM error types"
commit "orm/src/query.rs" "feat(orm): add type-safe parameterised query builder (where_eq/where_in/where_like/order/limit/offset)"
commit "orm/src/connection.rs" "feat(orm): add Db connection pool with mock in-process driver + sqlx feature-gated real drivers"
commit "orm/src/migrations.rs" "feat(orm): add CREATE TABLE migration generator from Model definitions"
commit "orm/src/lib.rs" "feat(orm): add crate root with Model trait + FieldDef"

echo
echo "▶ Phase 11: unique-css (Tailwind-like utility CSS engine)"
commit "css/Cargo.toml" "feat(css): add unique-css crate manifest"
commit "css/src/parser.rs" "feat(css): add class-string parser with responsive (sm/md/lg/xl/2xl) + state (hover/focus/...) prefixes"
commit "css/src/emitter.rs" "feat(css): add CSS emitter with 100+ utility mappings (layout/spacing/colors/typography/borders)"
commit "css/src/scanner.rs" "feat(css): add source-file scanner for class= and className= attributes"
commit "css/src/lib.rs" "feat(css): add crate root with compile_classes/compile_directory top-level API"

echo
echo "▶ Phase 12: Frontend module (SSR + live reload + type gen)"
commit "frontend/Cargo.toml" "feat(frontend): add unique-frontend crate manifest"
commit "frontend/src/parser.rs" "feat(frontend): add .unique file parser (data() + template() exports + static HTML)"
commit "frontend/src/ssr.rs" "feat(frontend): add SSR page renderer with livereload script injection + __UNIQUE_DATA__ hydration"
commit "frontend/src/livereload.rs" "feat(frontend): add WebSocket-based live reload server (broadcast::Sender)"
commit "frontend/src/types.rs" "feat(frontend): add TypeScript type generation from route metadata (tRPC-style)"
commit "frontend/src/lib.rs" "feat(frontend): add crate root with public API re-exports"

echo
echo "▶ Phase 13: JS/TS binding (napi-rs)"
commit "bindings/js/Cargo.toml" "feat(bindings/js): add napi-rs crate manifest"
commit "bindings/js/build.rs" "feat(bindings/js): add napi-build setup"
commit "bindings/js/src/lib.rs" "feat(bindings/js): add napi-rs Unique class with ThreadsafeFunction bridging to Rust async"
commit "bindings/js/package.json" "feat(bindings/js): add package.json with multi-platform napi targets"
commit "bindings/js/tsconfig.json" "feat(bindings/js): add TypeScript config"
commit "bindings/js/index.d.ts" "feat(bindings/js): add TypeScript type definitions for Unique/Request/Response/Handler"
commit "bindings/js/index.js" "feat(bindings/js): add idiomatic JS wrapper with ResponseBuilder (chainable json/text/html/status/header)"
commit "bindings/js/examples/hello.js" "feat(bindings/js): add JavaScript hello-world example"
commit "bindings/js/examples/hello.ts" "feat(bindings/js): add TypeScript hello-world example"
commit "bindings/js/README.md" "docs(bindings/js): add README with install + quickstart + API reference"

echo
echo "▶ Phase 14: Benchmark suite"
commit "bench/actix/Cargo.toml" "feat(bench): add actix-web bench crate manifest"
commit "bench/actix/src/main.rs" "feat(bench): add actix-web equivalent hello-world server"
commit "bench/express/package.json" "feat(bench): add Express.js bench package"
commit "bench/express/server.js" "feat(bench): add Express equivalent hello-world server"
commit "bench/fastapi/pyproject.toml" "feat(bench): add FastAPI bench project"
commit "bench/fastapi/server.py" "feat(bench): add FastAPI equivalent hello-world server"

echo
echo "▶ Phase 15: CLI"
commit "cli/Cargo.toml" "feat(cli): add unique-cli crate manifest"
commit "cli/src/main.rs" "feat(cli): add unique binary with demo/new/start/build/migrate/generate/deploy subcommands"
commit "cli/src/bin/unique_bench.rs" "feat(cli): add unique_bench throughput benchmark binary"

echo
echo "▶ Phase 16: Hello world example"
commit "unique/examples/hello.rs" "feat(unique): add hello-world example using get!/post! macros"

echo
echo "▶ Phase 17: Scripts"
commit "scripts/push-to-github.sh" "feat(scripts): add push-to-github.sh (interactive or GITHUB_TOKEN)"
commit "scripts/run-bench-suite.sh" "feat(scripts): add run-bench-suite.sh comparing unique vs actix vs express vs fastapi"

echo
echo "▶ Phase 18: Documentation"
commit "README.md" "docs: add README with 30-second quickstart, architecture, V2 features, building with max perf"
commit "PERF.md" "docs: add PERF.md with perf engineering write-up + path to 3M req/s"

echo
echo "▶ Phase 19: Lockfile"
commit "Cargo.lock" "chore: add Cargo.lock for reproducible builds"

echo
echo "▶ Done. Commit count:"
git rev-list --count HEAD
