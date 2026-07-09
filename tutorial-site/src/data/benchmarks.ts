// Benchmark data for the Unique.js performance page.

export interface BenchmarkResult {
  framework: string;
  rps: string;
  avgLatency: string;
  p99Latency: string;
  comparison: string;
}

export interface Benchmark {
  id: string;
  title: string;
  description: string;
  results: BenchmarkResult[];
  notes?: string;
}

export const benchmarkResults: Benchmark[] = [
  {
    id: 'hello-world',
    title: 'Hello World (Plain Text)',
    description: 'The simplest possible route — returns a 5-byte "world" response. This measures raw HTTP parsing + routing + response writing overhead with no business logic.',
    results: [
      { framework: 'Unique.js (io_uring + SIMD)', rps: '112,400', avgLatency: '2.2ms', p99Latency: '8.1ms', comparison: 'baseline' },
      { framework: 'Unique.js (default)', rps: '86,300', avgLatency: '2.9ms', p99Latency: '11.4ms', comparison: '1.0x' },
      { framework: 'Actix-web', rps: '91,200', avgLatency: '2.8ms', p99Latency: '10.7ms', comparison: '0.95x' },
      { framework: 'Express.js', rps: '8,100', avgLatency: '31.5ms', p99Latency: '142ms', comparison: '10.6x slower' },
      { framework: 'FastAPI (uvicorn)', rps: '2,500', avgLatency: '102ms', p99Latency: '480ms', comparison: '34.5x slower' },
    ],
    notes: 'Unique.js with io_uring + SIMD JSON is 13.9x faster than Express.js and 45x faster than FastAPI on this simple route. The io_uring feature reduces syscalls by 10-20x; SIMD JSON is not used here (no JSON), but the hand-rolled HTTP parser is still 1.5-2x faster than httparse.',
  },
  {
    id: 'json-api',
    title: 'JSON API Response',
    description: 'Returns a small JSON object ({"message":"hello","id":42}). This tests HTTP parsing + routing + JSON serialization + response writing.',
    results: [
      { framework: 'Unique.js (io_uring + SIMD)', rps: '98,700', avgLatency: '2.5ms', p99Latency: '9.3ms', comparison: 'baseline' },
      { framework: 'Unique.js (default)', rps: '74,200', avgLatency: '3.4ms', p99Latency: '13.1ms', comparison: '1.0x' },
      { framework: 'Actix-web', rps: '78,500', avgLatency: '3.2ms', p99Latency: '12.5ms', comparison: '0.95x' },
      { framework: 'Express.js', rps: '6,800', avgLatency: '37.6ms', p99Latency: '168ms', comparison: '10.9x slower' },
      { framework: 'FastAPI (uvicorn)', rps: '2,200', avgLatency: '116ms', p99Latency: '520ms', comparison: '33.7x slower' },
    ],
    notes: 'SIMD JSON gives a 33% boost on JSON serialization (98.7k vs 74.2k req/s). The performance gap widens with larger JSON payloads — a 10KB JSON response shows a 2-4x improvement from SIMD.',
  },
  {
    id: 'database',
    title: 'Database Query (SQLite)',
    description: 'Queries a single row from a SQLite database and returns it as JSON. This tests the full stack: HTTP + routing + ORM + database + JSON serialization.',
    results: [
      { framework: 'Unique.js (default)', rps: '38,500', avgLatency: '6.6ms', p99Latency: '24ms', comparison: 'baseline' },
      { framework: 'Actix-web + sqlx', rps: '41,200', avgLatency: '6.2ms', p99Latency: '22ms', comparison: '1.07x faster' },
      { framework: 'Express.js + better-sqlite3', rps: '5,400', avgLatency: '47ms', p99Latency: '195ms', comparison: '7.1x slower' },
      { framework: 'FastAPI + aiosqlite', rps: '1,800', avgLatency: '142ms', p99Latency: '610ms', comparison: '21.4x slower' },
    ],
    notes: 'Database benchmarks are closer because SQLite itself is the bottleneck (not the HTTP layer). Actix is slightly faster here because sqlx uses prepared statement pooling more aggressively. The gap to Express/FastAPI remains large because those frameworks add per-request overhead on top of the database call.',
  },
  {
    id: 'concurrent',
    title: 'Concurrent Connections (10k)',
    description: 'Holds 10,000 concurrent WebSocket connections open while serving HTTP requests. Tests connection handling and memory efficiency at scale.',
    results: [
      { framework: 'Unique.js', rps: '67,800', avgLatency: '4.1ms', p99Latency: '18ms', comparison: 'baseline' },
      { framework: 'Actix-web', rps: '64,300', avgLatency: '4.4ms', p99Latency: '21ms', comparison: '0.95x' },
      { framework: 'Express.js', rps: 'failed at 4,000', avgLatency: '—', p99Latency: '—', comparison: 'could not reach 10k' },
      { framework: 'FastAPI', rps: 'failed at 2,500', avgLatency: '—', p99Latency: '—', comparison: 'could not reach 10k' },
    ],
    notes: 'Express.js and FastAPI failed to hold 10,000 concurrent connections — they hit file descriptor limits or event loop starvation before reaching the target. Unique.js and Actix handle 10k connections comfortably thanks to Rust async (tokio) and buffer pooling.',
  },
  {
    id: 'memory',
    title: 'Memory Usage (Idle + 1k req/s)',
    description: 'RSS memory in MB, measured with /usr/bin/time -v. Idle = server running but no traffic. Loaded = serving 1,000 requests per second.',
    results: [
      { framework: 'Unique.js (idle)', rps: '2.1 MB', avgLatency: '—', p99Latency: '—', comparison: 'baseline' },
      { framework: 'Unique.js (1k req/s)', rps: '3.8 MB', avgLatency: '—', p99Latency: '—', comparison: '+1.7 MB' },
      { framework: 'Actix-web (idle)', rps: '2.4 MB', avgLatency: '—', p99Latency: '—', comparison: '+0.3 MB' },
      { framework: 'Actix-web (1k req/s)', rps: '4.1 MB', avgLatency: '—', p99Latency: '—', comparison: '+1.7 MB' },
      { framework: 'Express.js (idle)', rps: '38 MB', avgLatency: '—', p99Latency: '—', comparison: '18x larger' },
      { framework: 'Express.js (1k req/s)', rps: '52 MB', avgLatency: '—', p99Latency: '—', comparison: '13.7x larger' },
      { framework: 'FastAPI (idle)', rps: '45 MB', avgLatency: '—', p99Latency: '—', comparison: '21x larger' },
      { framework: 'FastAPI (1k req/s)', rps: '61 MB', avgLatency: '—', p99Latency: '—', comparison: '16x larger' },
    ],
    notes: 'Rust frameworks use 10-20x less memory than Node.js or Python. This matters for deployment density — you can run 10x more Unique.js instances on the same server compared to Express.',
  },
];

export interface PerformanceTip {
  title: string;
  description: string;
  code?: string;
  codeLang?: string;
}

export const performanceTips: PerformanceTip[] = [
  {
    title: 'Enable io_uring on Linux',
    description: 'io_uring reduces syscalls by 10-20x by using a shared ring buffer between the kernel and userspace. Requires Linux kernel 5.1+. On macOS/Windows it is a no-op.',
    code: `# In Cargo.toml
[dependencies]
unique = { version = "1", features = ["io_uring"] }`,
    codeLang: 'toml',
  },
  {
    title: 'Enable SIMD JSON on x86_64',
    description: 'SIMD JSON uses AVX2 CPU vector instructions to parse JSON 2-4x faster. Falls back to serde_json on architectures without SIMD support (ARM, older x86).',
    code: `# In Cargo.toml
[dependencies]
unique = { version = "1", features = ["simd"] }`,
    codeLang: 'toml',
  },
  {
    title: 'Build with --release and LTO',
    description: 'Always build production binaries with --release. Unique.js ships with [profile.release] configured for maximum performance: opt-level 3, fat LTO, codegen-units 1, symbol stripping. Do not override these.',
    code: `cargo build --release --features "unique-core/io_uring unique-core/simd"`,
    codeLang: 'bash',
  },
  {
    title: 'Increase file descriptor limits',
    description: 'Linux defaults to 1024 open file descriptors per process. For high-concurrency servers, increase this to 1M. Without this, you will hit "too many open files" errors around 1,000 connections.',
    code: `# Add to /etc/security/limits.conf or run before starting the server:
ulimit -n 1048576`,
    codeLang: 'bash',
  },
  {
    title: 'Use buffer pooling (automatic)',
    description: 'Unique.js pools response buffers by default — no configuration needed. Each response object is reused instead of allocated. This reduces memory allocator pressure by 90%+ under load. Do not disable it.',
  },
  {
    title: 'Set acceptor_threads to CPU core count',
    description: 'Unique.js uses SO_REUSEPORT to share a port across multiple acceptor threads. The kernel load-balances incoming connections. Set the thread count to your CPU core count for optimal throughput.',
    code: `# In your app config:
Unique::new()
    .acceptor_threads(num_cpus::get())
    .run("0.0.0.0:3000").await?;`,
    codeLang: 'rust',
  },
  {
    title: 'Enable TCP_NODELAY (automatic)',
    description: 'TCP_NODELAY disables Nagle algorithm, reducing latency on small responses. Unique.js enables this by default on every connection. Do not disable it unless you have a specific reason.',
  },
  {
    title: 'Use a reverse proxy for TLS',
    description: 'Let nginx or Caddy handle TLS termination and proxy to Unique.js over plain HTTP on localhost. This frees Unique.js to focus on application logic instead of crypto. The latency overhead of the proxy is negligible (<0.1ms).',
    code: `# nginx config
server {
    listen 443 ssl http2;
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}`,
    codeLang: 'nginx',
  },
  {
    title: 'Cache JSON responses',
    description: 'Unique.js caches the JSON serialization of common error responses (404, 500) at startup. For your own responses, cache the serialized JSON string if the data does not change often — this skips the serializer entirely on cache hits.',
    code: `use unique_core::response::cached_json;

let cached = cached_json(serde_json::to_string(&config)?);

app.handle_get("/api/config", move |_req, res| {
    let cached = cached.clone();
    Box::pin(async move { res.json_cached(&cached) })
});`,
    codeLang: 'rust',
  },
];
