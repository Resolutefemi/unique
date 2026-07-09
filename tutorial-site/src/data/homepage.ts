// Homepage data: stats, features, and comparison table.

export const stats = [
  { value: '86k+', label: 'requests / second' },
  { value: '16', label: 'languages supported' },
  { value: '127', label: 'tests passing' },
  { value: '50', label: 'tutorial chapters' },
];

export const features = [
  {
    icon: '⚡',
    title: 'Blazing Fast',
    description: 'Hand-rolled HTTP/1.1 parser, trie router, io_uring zero-copy I/O, and SIMD JSON. 86k+ req/s on 2-core CI runners — 10-50x faster than Express or FastAPI.',
  },
  {
    icon: '🔒',
    title: 'Secure by Default',
    description: 'HSTS, CSP, X-Frame-Options, CORS, rate limiting, and JWT auth — all ON by default. You would have to explicitly disable them. Security is not optional.',
  },
  {
    icon: '🌐',
    title: 'Polyglot',
    description: 'Write your backend in Rust, JavaScript, TypeScript, Python, Go, Java, Kotlin, Dart, Swift, C++, PHP, Ruby, C#, Elixir, or Lua. One API, 16 languages.',
  },
  {
    icon: '🧅',
    title: 'Onion Middleware',
    description: 'Classic onion-model middleware pipeline. Each middleware wraps the next. Short-circuit by returning a response without calling next().',
  },
  {
    icon: '🗄️',
    title: 'Built-in ORM',
    description: 'SQLite, PostgreSQL, MySQL. CRUD, JOINs, transactions, migrations, and Argon2id password hashing — all from #[derive(Model)]. No extra dependencies.',
  },
  {
    icon: '🎨',
    title: 'CSS Engine',
    description: 'Tailwind-like utility classes compiled in Rust. 100+ utilities, responsive prefixes, state variants. No PostCSS, no Tailwind config, no Node.js dependency.',
  },
  {
    icon: '📄',
    title: 'SSR with .kng Files',
    description: 'Server-side rendering via data() + template() functions. Client-side hydration makes pages interactive without re-fetching. File-based routing.',
  },
  {
    icon: '🔌',
    title: 'WebSocket + HTTP/3',
    description: 'RFC 6455 WebSocket with broadcast support. HTTP/3 via quinn + h3. TLS via rustls. All built in — no extra crates needed.',
  },
  {
    icon: '📚',
    title: 'Auto API Docs',
    description: 'OpenAPI 3.1 spec generated automatically from your routes. Swagger UI at /docs. No annotations needed — just register routes and the docs appear.',
  },
];

export const comparisonRows = [
  {
    feature: 'Language',
    unique: '16 (polyglot)',
    express: 'JavaScript only',
    fastapi: 'Python only',
    actix: 'Rust only',
  },
  {
    feature: 'Core engine',
    unique: 'Rust',
    express: 'Node.js (V8)',
    fastapi: 'Python (uvicorn)',
    actix: 'Rust',
  },
  {
    feature: 'Requests / sec',
    unique: '86,000+',
    express: '~8,000',
    fastapi: '~2,500',
    actix: '~90,000',
  },
  {
    feature: 'Security middleware',
    unique: 'On by default',
    express: 'Manual (helmet)',
    fastapi: 'Manual',
    actix: 'Manual',
  },
  {
    feature: 'Built-in ORM',
    unique: 'Yes (SQLite/PG/MySQL)',
    express: 'No',
    fastapi: 'No (SQLAlchemy)',
    actix: 'No (diesel)',
  },
  {
    feature: 'WebSocket',
    unique: 'Built-in (RFC 6455)',
    express: 'Via ws library',
    fastapi: 'Manual',
    actix: 'Via actix-web-actors',
  },
  {
    feature: 'HTTP/3',
    unique: 'Yes (quinn + h3)',
    express: 'No',
    fastapi: 'No',
    actix: 'No',
  },
  {
    feature: 'CSS engine',
    unique: 'Built-in (Tailwind-like)',
    express: 'No',
    fastapi: 'No',
    actix: 'No',
  },
  {
    feature: 'SSR',
    unique: 'Yes (.kng files)',
    express: 'No',
    fastapi: 'No (Jinja2)',
    actix: 'No',
  },
  {
    feature: 'Learning curve',
    unique: 'Easy',
    express: 'Easy',
    fastapi: 'Easy',
    actix: 'Steep',
  },
];
