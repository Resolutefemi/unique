# Security Policy

## Supported Versions

Unique.js is pre-1.0. We currently ship security fixes for the latest
release on the `main` branch only.

| Version | Supported          |
| ------- | ------------------ |
| 0.1.x   | :white_check_mark: |
| < 0.1   | :x:                |

## Reporting a Vulnerability

If you discover a security vulnerability in Unique.js, **please do not
open a public GitHub issue**. Instead, email security@unique.js.org with:

1. A description of the vulnerability
2. Steps to reproduce (proof of concept if possible)
3. Affected versions
4. Suggested fix (optional)

You should receive an acknowledgement within 48 hours. We'll coordinate
a fix and disclosure timeline with you.

## Security posture

Unique.js is **secure-by-default**. The framework installs the following
middleware automatically on every server:

- **Security headers**: HSTS (2 years + preload), CSP (strict default),
  X-Content-Type-Options: nosniff, X-Frame-Options: DENY, Referrer-Policy,
  Permissions-Policy.
- **CORS**: permissive-but-explicit (logs warning if `allow_origin=*` is
  combined with `allow_credentials=true`).
- **Rate limiter**: leaky-bucket per IP+path (default 200 burst / 100 rps).
- **Logger**: structured request log with method, path, status, latency.

Disabling any of these via `.insecure()` emits a `tracing::warn!`.

## Hardening checklist for production

- [ ] Set `acceptor_threads` to the number of physical CPU cores
- [ ] Put Unique behind a TLS-terminating reverse proxy (nginx, Caddy, etc.)
- [ ] Set `connection: close` on responses with sensitive bodies
- [ ] Review the CSP — the default is strict; some apps need to relax it
- [ ] Increase rate-limiter capacity only if you understand the trade-off
- [ ] Use the ORM with parameterised queries only — never string-interpolate SQL

## Known security-relevant design choices

- `#![forbid(unsafe_code)]` in `unique-core`. All `unsafe` is concentrated
  in proven third-party crates (`tokio`, `httparse`, `socket2`, `tokio-uring`).
- The ORM uses parameterised queries exclusively. The query builder
  (`orm/src/query.rs`) is the only supported way to build SQL; raw SQL
  is not exposed.
- HTML escaping is opt-in via `Response::html_escape()`. Handlers that
  embed user input in HTML responses MUST call this — the framework
  cannot tell which responses contain user input.
- The default CSP disallows inline scripts. If you need them (e.g. for
  the Swagger UI), the `/docs` route relaxes the CSP for that path only.
