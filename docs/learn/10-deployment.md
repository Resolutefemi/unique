# Deployment

> ⏱️ 5 minutes

This chapter covers the common deployment patterns for a Unique app:
Docker, systemd, and serverless.

## Building for production

```bash
# Default build
cargo build --release

# Maximum performance on Linux 5.1+ with AVX2
cargo build --release --features "unique-core/io_uring unique-core/simd"
```

The release binary is at `./target/release/your-app-name`. It's a single
self-contained executable — no runtime to install, no dependencies to ship.

## Docker

A minimal Dockerfile:

```dockerfile
FROM rust:1.96 AS builder
WORKDIR /app
COPY . .
RUN cargo build --release --features "unique-core/io_uring unique-core/simd"

FROM debian:bookworm-slim
RUN apt-get update && apt-get install -y ca-certificates && rm -rf /var/lib/apt/lists/*
COPY --from=builder /app/target/release/your-app /usr/local/bin/
EXPOSE 3000
CMD ["your-app"]
```

Build and run:

```bash
docker build -t my-unique-app .
docker run -p 3000:3000 my-unique-app
```

For smaller images, use a `scratch` base:

```dockerfile
FROM rust:1.96 AS builder
WORKDIR /app
COPY . .
RUN cargo build --release

FROM scratch
COPY --from=builder /app/target/release/your-app /app
EXPOSE 3000
CMD ["/app"]
```

This produces a ~10MB image.

## systemd

Create `/etc/systemd/system/unique-app.service`:

```ini
[Unit]
Description=My Unique App
After=network.target

[Service]
Type=simple
User=unique
WorkingDirectory=/opt/unique-app
ExecStart=/opt/unique-app/your-app
Restart=on-failure
RestartSec=5
Environment=RUST_LOG=info
Environment=PORT=3000

[Install]
WantedBy=multi-user.target
```

Enable and start:

```bash
sudo systemctl enable unique-app
sudo systemctl start unique-app
sudo systemctl status unique-app
```

## Behind a reverse proxy

In production, run Unique behind a TLS-terminating reverse proxy (nginx,
Caddy, or HAProxy). The proxy handles HTTPS and forwards plain HTTP to
Unique.

### nginx

```nginx
server {
    listen 443 ssl http2;
    server_name api.example.com;

    ssl_certificate /etc/letsencrypt/live/api.example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.example.com/privkey.pem;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### Caddy (automatic HTTPS)

```
api.example.com {
    reverse_proxy 127.0.0.1:3000
}
```

## Tuning for production

See `PERF.md` for the full tuning checklist. Key items:

- Set `acceptor_threads` to the number of physical CPU cores
- Increase file descriptor limit: `ulimit -n 1048576`
- Tune `net.core.somaxconn` to ≥ 4096
- Disable transparent hugepages
- Pin NIC IRQs to specific cores

## Health checks

Add a `/health` endpoint for load balancers:

```rust
Unique::new()
    .json_get("/health", || serde_json::json!({
        "status": "ok",
        "version": unique::VERSION,
    }))
    .run("0.0.0.0:3000")
```

Configure your load balancer to hit `/health` every 5–10 seconds and
remove the instance from rotation on non-200 responses.

## Graceful shutdown

V1 doesn't ship graceful shutdown built-in. For now, send SIGTERM and let
in-flight requests finish naturally (typically <1s each).

V1.1 will add proper SIGTERM handling that:
1. Stops accepting new connections
2. Waits for in-flight requests to finish (up to a timeout)
3. Closes the process

## Serverless

Unique doesn't currently support serverless platforms (AWS Lambda, Vercel,
Cloudflare Workers) — the io_uring + SO_REUSEPORT model assumes a
long-running process. V1.1 will add a `serverless` feature that uses
plain tokio (no io_uring) for environments where only short-lived
invocations are possible.

## Next steps

You've completed the Unique tutorial! 🎉

- Browse the [examples](https://github.com/Resolutefemi/unique/tree/main/unique/examples)
- Read the [API reference](https://github.com/Resolutefemi/unique/blob/main/docs/api/)
- Star the repo: https://github.com/Resolutefemi/unique
- File issues for bugs or feature requests
