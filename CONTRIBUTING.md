# Contributing to Kungfu.js

Thanks for your interest in contributing! This document covers the basics.

## Development setup

```bash
# Clone
git clone https://github.com/Resolutefemi/kungfu.git
cd kungfu

# Build everything (default features, no io_uring/simd)
cargo build --workspace

# Run the test suite
cargo test --workspace --lib

# Run with maximum performance features (Linux 5.1+ + AVX2)
cargo build --workspace --features "kungfu-core/io_uring kungfu-core/simd"
cargo test --workspace --lib --features "kungfu-core/io_uring kungfu-core/simd"

# Run the demo server
cargo run -p kungfu-cli -- demo

# Run the benchmark
cargo run -p kungfu-cli --bin kungfu_bench --release
```

## Project structure

See `README.md` for the architecture overview. The main crates:

- `core/` — the engine (no language opinion)
- `kungfu/` — idiomatic Rust API
- `kungfu-macros/` — proc macros (`#[derive(Model)]`)
- `orm/` — built-in ORM
- `css/` — Tailwind-like utility CSS engine
- `frontend/` — SSR + live reload + TS type gen
- `cli/` — the `kungfu` binary
- `bindings/js/` — napi-rs binding for Node.js
- `bench/` — comparison harness vs actix/express/fastapi

## Before submitting a PR

1. **Run the tests**: `cargo test --workspace --lib`
2. **Run clippy**: `cargo clippy --workspace --all-targets -- -D warnings`
3. **Format**: `cargo fmt --all`
4. **Bench if you touched the hot path**: `cargo run -p kungfu-cli --bin kungfu_bench --release`
   Make sure throughput didn't regress.

## Commit message conventions

We use [Conventional Commits](https://www.conventionalcommits.org/):

- `feat(scope): description` — new feature
- `fix(scope): description` — bug fix
- `perf(scope): description` — performance improvement
- `docs(scope): description` — documentation only
- `chore(scope): description` — tooling, deps, config
- `test(scope): description` — test additions only
- `refactor(scope): description` — code restructuring, no behavior change

`scope` is one of: `core`, `kungfu`, `macros`, `orm`, `css`, `frontend`,
`cli`, `bindings/js`, `bench`, `scripts`, or omitted for repo-wide changes.

## Performance philosophy

Performance is the baseline, not a feature. Every commit on the hot path
(request parsing, routing, response writing) is benchmarked. Regressions
are bugs.

If you're adding a new optimisation, please:
1. Add a benchmark in `cli/src/bin/kungfu_bench.rs` if appropriate
2. Update `PERF.md` with the expected gain and any tradeoffs
3. Run `cargo bench` before and after — include numbers in the PR description

## Security

Kungfu is secure-by-default. If your change weakens a default security
control (CSP, HSTS, rate limiter, etc.), the framework must emit a
`tracing::warn!` per the spec. See `core/src/middleware/builtin/security_headers.rs`.

If you discover a security vulnerability, please email security@kungfu.js.org
instead of opening a public issue. See `SECURITY.md`.

## License

By contributing, you agree that your contributions will be dual-licensed
under the MIT and Apache 2.0 licenses, as described in `LICENSE-MIT` and
`LICENSE-APACHE`.
