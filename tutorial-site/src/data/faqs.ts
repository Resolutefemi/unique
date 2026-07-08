// FAQ data for the Unique.js tutorial site.

export interface FaqItem {
  q: string;
  a: string;
}

export interface FaqCategory {
  category: string;
  questions: FaqItem[];
}

export const faqs: FaqCategory[] = [
  {
    category: 'Getting Started',
    questions: [
      {
        q: 'What is Unique.js?',
        a: 'Unique.js is a polyglot web framework with a Rust core. You write your backend in any of 16 supported languages (Rust, JavaScript, TypeScript, Python, Go, Java, Kotlin, Dart, Swift, C++, PHP, Ruby, C#, Elixir, Lua, C) while the HTTP server, router, and middleware all run in Rust for maximum performance. The frontend is always JS/TS.',
      },
      {
        q: 'Why the name "Unique.js"?',
        a: 'The framework gives you one unique API surface that works across infinite languages. No matter which backend language you choose, the development experience is the same — that uniqueness is the core value proposition.',
      },
      {
        q: 'Do I need to know Rust to use Unique.js?',
        a: 'No. If you use the JavaScript, TypeScript, Python, or Go bindings, you never need to write any Rust. Rust is only required for building the native addon (the HTTP engine). You install it once via rustup and never touch it again.',
      },
      {
        q: 'Which languages are supported?',
        a: '16 languages: Rust (native), JavaScript (.jsk), TypeScript (.tsk), Python, Go, Java, Kotlin, Dart, Swift, C++, C, C#, PHP, Ruby, Elixir, and Lua. The Rust binding is the most complete; other bindings wrap the C ABI.',
      },
      {
        q: 'Is Unique.js production-ready?',
        a: 'The Rust core is production-ready with 127 passing tests, 86k+ req/s throughput, and full security middleware. Some language bindings (Java, Kotlin, Dart, Swift, PHP, Ruby, Elixir, Lua) are at scaffold level — they expose the C ABI but need the callback bridge completed for handler registration. Use Rust, JS/TS, Python, or Go for production apps today.',
      },
    ],
  },
  {
    category: 'Installation',
    questions: [
      {
        q: 'I get "cargo: command not found" when installing the JS/Python binding. How do I fix it?',
        a: 'The JS (napi-rs) and Python (pyo3) bindings compile a native addon from Rust source at install time. You need Rust installed: run `curl --proto "=https" --tlsv1.2 -sSf https://sh.rustup.rs | sh` and restart your terminal. This is a one-time setup — you only need Rust for the install, not for writing app code.',
      },
      {
        q: 'The build is very slow. Can I speed it up?',
        a: 'Yes. First, make sure you are using the release profile: `cargo build --release` (not debug). Second, enable LTO and codegen-units=1 in your Cargo.toml [profile.release] (already configured by default). Third, use `cargo build --release -j $(nproc)` to parallelize. A clean release build takes about 45 seconds on a 2-core CI runner.',
      },
      {
        q: 'How do I enable io_uring on Linux?',
        a: 'Add the `io_uring` feature to your Cargo.toml: `unique = { version = "1", features = ["io_uring"] }`. This requires Linux kernel 5.1+ and the `tokio-uring` crate. The performance gain is 2-3x throughput improvement on I/O-heavy workloads. On non-Linux platforms, the feature is a no-op.',
      },
      {
        q: 'Can I use Unique.js without Rust at all?',
        a: 'The Go binding is the only one that does not require Rust — it is a pure-Go reimplementation of the API surface using net/http. However, it does not get the Rust performance benefits. All other bindings require Rust for the native engine.',
      },
    ],
  },
  {
    category: 'Performance',
    questions: [
      {
        q: 'How fast is Unique.js?',
        a: 'On CI runners (2-core, 8GB RAM), Unique.js handles 86,000+ requests per second for a simple "hello world" route. This is comparable to Actix-web and 10-50x faster than Express.js or FastAPI on the same hardware. With io_uring and SIMD JSON enabled, throughput can exceed 100k req/s on dedicated hardware.',
      },
      {
        q: 'What is io_uring and should I use it?',
        a: 'io_uring is a Linux kernel (5.1+) async I/O interface that reduces syscalls by 10-20x. Instead of one syscall per read/write, io_uring uses a shared ring buffer where the kernel and userspace exchange I/O requests without context switches. Enable it with the `io_uring` feature on Linux. It is a no-op on macOS/Windows.',
      },
      {
        q: 'What is SIMD JSON and should I use it?',
        a: 'SIMD JSON uses CPU vector instructions (AVX2 on x86_64, NEON on ARM) to parse JSON 2-4x faster than traditional parsers. Enable it with the `simd` feature. It falls back to serde_json automatically on architectures without SIMD support. Recommended for APIs with heavy JSON payloads.',
      },
      {
        q: 'Why is my app slower than the benchmarks?',
        a: 'Common causes: (1) Running in debug mode instead of release — always use `cargo build --release`. (2) Database queries are the bottleneck, not the HTTP server — use EXPLAIN to analyze slow queries. (3) Not using connection pooling — the ORM pools by default, but raw SQL might not. (4) Running behind a slow reverse proxy — benchmark directly first.',
      },
    ],
  },
  {
    category: 'Deployment',
    questions: [
      {
        q: 'How do I deploy Unique.js to production?',
        a: 'Three options: (1) Docker — `unique deploy --target docker` generates a Dockerfile, build with `docker build -t myapp .` and run with `docker run -p 3000:3000 myapp`. (2) systemd — `unique deploy --target systemd` generates a .service file, copy to /etc/systemd/system/ and `systemctl start myapp`. (3) Binary — `cargo build --release` and copy the binary to your server.',
      },
      {
        q: 'Should I use a reverse proxy (nginx/Caddy) in front of Unique.js?',
        a: 'Yes, for production. A reverse proxy handles TLS termination, static file caching, request buffering, and load balancing. Unique.js can do TLS directly (via rustls) but most deployments put nginx or Caddy in front. Configure nginx to proxy_pass to 127.0.0.1:3000.',
      },
      {
        q: 'How do I enable HTTPS/TLS?',
        a: 'Two options: (1) Let Unique.js handle TLS directly: `app.run_tls("0.0.0.0:443", "./cert.pem", "./key.pem")` — this also enables HTTP/2 and HTTP/3. (2) Let a reverse proxy (nginx, Caddy, Cloudflare) handle TLS and proxy to Unique.js over plain HTTP. Option 2 is more common in production.',
      },
      {
        q: 'How many concurrent connections can Unique.js handle?',
        a: 'With default settings: ~10,000 concurrent connections per core. With SO_REUSEPORT and multiple acceptor threads: ~50,000+. With io_uring: 100,000+. The limiting factor is usually file descriptors — increase with `ulimit -n 1048576` before starting the server.',
      },
    ],
  },
  {
    category: 'Security',
    questions: [
      {
        q: 'What security features are built in?',
        a: 'By default, every Unique.js app has: HSTS (max-age=2 years, includeSubDomains, preload), Content-Security-Policy (default-src self), X-Frame-Options: DENY, X-Content-Type-Options: nosniff, Referrer-Policy: strict-origin-when-cross-origin, CORS (configurable), and leaky-bucket rate limiting (200 burst, 100 rps per IP+path). These are all ON by default — you would have to explicitly disable them.',
      },
      {
        q: 'How does password hashing work?',
        a: 'The ORM automatically hashes fields marked `#[field(sensitive)]` using Argon2id (the OWASP-recommended algorithm) before inserting or updating. You never see the hash — you set `user.password = "plaintext"` and the ORM stores `user.password = "$argon2id$v=19$m=..."`. Verification uses `verify_password(plaintext, hash)`.',
      },
      {
        q: 'Is CORS secure by default?',
        a: 'The default CORS configuration allows all origins (*). For production, you should restrict this to your known origins: `cors(CorsConfig { origins: vec!["https://myapp.com"] })`. The default is permissive for development convenience.',
      },
      {
        q: 'How do I disable specific security middleware?',
        a: 'You should not — security is not optional. If you have a specific reason (e.g., running behind Cloudflare that already adds HSTS), you can construct Unique without default middleware and add only what you need. But this is strongly discouraged for most applications.',
      },
    ],
  },
  {
    category: 'Troubleshooting',
    questions: [
      {
        q: 'My route handler returns 404 but the route is registered. What is wrong?',
        a: 'Check the HTTP method. If you registered a GET route but the client sends POST, Unique.js returns 405 Method Not Allowed (not 404). Also check the path — trailing slashes matter. "/users" and "/users/" are different routes. Use the OpenAPI docs at /docs to see all registered routes.',
      },
      {
        q: 'I get "port 3000 already in use". How do I fix it?',
        a: 'Another process is using port 3000. Find and kill it: `lsof -i :3000` (macOS/Linux) or `netstat -ano | findstr :3000` (Windows). Or use a different port: `app.run("0.0.0.0:3001")`. Common culprits: another Unique.js instance, a Node.js dev server, or Docker.',
      },
      {
        q: 'My WebSocket connection fails immediately. What is wrong?',
        a: 'Three common causes: (1) You are connecting via ws:// to an HTTPS page — browsers block mixed content. Use wss:// or serve your page over HTTP. (2) Your reverse proxy does not forward the Upgrade header. Configure nginx: `proxy_set_header Upgrade $http_upgrade; proxy_set_header Connection "upgrade";`. (3) The route is registered as HTTP, not WebSocket — use `app.ws("/path", handler)` not `app.get("/path", handler)`.',
      },
      {
        q: 'The tutorial site is not showing syntax highlighting. What is wrong?',
        a: 'The tutorial site loads Prism.js from cdnjs.cloudflare.com. If you have an ad blocker or firewall that blocks CDN requests, syntax highlighting will not load. Try disabling your ad blocker, or check your browser console for failed script loads. The code is still readable without highlighting — just not colorized.',
      },
    ],
  },
];
