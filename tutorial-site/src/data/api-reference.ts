// Complete API reference for Unique.js
// Every class, method, and type across the framework.

export interface ApiMethod {
  name: string;
  signature: string;
  description: string;
  parameters?: { name: string; type: string; description: string }[];
  returns?: string;
  example?: string;
}

export interface ApiSection {
  id: string;
  title: string;
  description: string;
  methods: ApiMethod[];
}

export const apiReference: ApiSection[] = [
  {
    id: 'unique-app',
    title: 'Unique (App)',
    description: 'The main application class. Create a new app, register routes, add middleware, and start the server.',
    methods: [
      {
        name: 'new',
        signature: 'Unique::new() -> Unique',
        description: 'Create a new Unique.js application with default middleware (security headers, CORS, rate limiter, logger) pre-installed.',
        returns: 'A new Unique app instance',
        example: `let app = Unique::new();`,
      },
      {
        name: 'handle_get',
        signature: 'handle_get(path, handler) -> &mut Self',
        description: 'Register a GET route handler. The path supports static segments, :params, and *wildcards. The handler is a closure that receives a Request and Response.',
        parameters: [
          { name: 'path', type: '&str', description: 'URL path pattern (e.g. "/", "/users/:id", "/assets/*path")' },
          { name: 'handler', type: 'impl Fn(Request, Response) -> BoxFuture', description: 'Async closure that handles the request' },
        ],
        returns: 'Mutuable reference to self for chaining',
        example: `app.handle_get("/hello", |_req, res| {
    res.text("world")
});`,
      },
      {
        name: 'handle_post',
        signature: 'handle_post(path, handler) -> &mut Self',
        description: 'Register a POST route handler. Same path syntax as handle_get.',
        parameters: [
          { name: 'path', type: '&str', description: 'URL path pattern' },
          { name: 'handler', type: 'impl Fn(Request, Response) -> BoxFuture', description: 'Async closure' },
        ],
        example: `app.handle_post("/api/users", |req, res| {
    let body: User = serde_json::from_str(&req.body)?;
    // ... create user
    res.status(StatusCode::Created).json(serde_json::to_string(&user)?)
});`,
      },
      {
        name: 'handle_put',
        signature: 'handle_put(path, handler) -> &mut Self',
        description: 'Register a PUT route handler for full-resource updates.',
      },
      {
        name: 'handle_delete',
        signature: 'handle_delete(path, handler) -> &mut Self',
        description: 'Register a DELETE route handler.',
      },
      {
        name: 'handle_patch',
        signature: 'handle_patch(path, handler) -> &mut Self',
        description: 'Register a PATCH route handler for partial updates.',
      },
      {
        name: 'use_middleware',
        signature: 'use_middleware(middleware) -> &mut Self',
        description: 'Add a custom middleware to the onion-model pipeline. Middleware runs in registration order — the first registered wraps all subsequent ones.',
        parameters: [
          { name: 'middleware', type: 'Arc<impl Fn(Request, Next) -> BoxFuture>', description: 'Async closure that can inspect/modify the request, call next(req), and inspect/modify the response' },
        ],
        example: `app.use_middleware(Arc::new(|req, next| {
    Box::pin(async move {
        let start = std::time::Instant::now();
        let mut resp = next(req).await;
        let elapsed = start.elapsed();
        resp.set_header("x-response-time", format!("{:?}", elapsed));
        resp
    })
}));`,
      },
      {
        name: 'ws',
        signature: 'ws(path, handler) -> &mut Self',
        description: 'Register a WebSocket handler. The connection is upgraded from HTTP automatically when the client sends an Upgrade: websocket header.',
        parameters: [
          { name: 'path', type: '&str', description: 'URL path for the WebSocket endpoint' },
          { name: 'handler', type: 'impl Fn(WebSocket) -> BoxFuture', description: 'Async closure that receives a WebSocket connection' },
        ],
        example: `app.ws("/chat", |mut ws| {
    Box::pin(async move {
        ws.send_text("Welcome!").await;
        while let Some(msg) = ws.recv().await {
            ws.send_text(format!("echo: {}", msg.to_text()?)).await;
        }
    })
});`,
      },
      {
        name: 'run',
        signature: 'run(addr) -> Result<()>',
        description: 'Start the HTTP server on the given address. This call blocks until the server shuts down. Enables io_uring and SIMD JSON automatically if the features are compiled in.',
        parameters: [
          { name: 'addr', type: '&str', description: 'Bind address (e.g. "0.0.0.0:3000")' },
        ],
        returns: 'Ok(()) on graceful shutdown, Err on bind failure',
        example: `app.run("0.0.0.0:3000").await?;`,
      },
      {
        name: 'run_tls',
        signature: 'run_tls(addr, cert_path, key_path) -> Result<()>',
        description: 'Start the HTTPS server with TLS via rustls. Automatically enables HTTP/2 and HTTP/3.',
        parameters: [
          { name: 'addr', type: '&str', description: 'Bind address' },
          { name: 'cert_path', type: '&str', description: 'Path to TLS certificate (PEM format)' },
          { name: 'key_path', type: '&str', description: 'Path to TLS private key (PEM format)' },
        ],
        example: `app.run_tls("0.0.0.0:443", "./cert.pem", "./key.pem").await?;`,
      },
    ],
  },
  {
    id: 'request',
    title: 'Request',
    description: 'The HTTP request object. Passed to every route handler. Provides access to method, path, headers, query parameters, path parameters, and body.',
    methods: [
      {
        name: 'method',
        signature: 'method() -> &Method',
        description: 'Get the HTTP method (GET, POST, PUT, DELETE, PATCH).',
        returns: 'A reference to the Method enum',
      },
      {
        name: 'path',
        signature: 'path() -> &str',
        description: 'Get the request path (e.g. "/users/42").',
        returns: 'The URL path as a string slice',
      },
      {
        name: 'param',
        signature: 'param(name: &str) -> Option<&str>',
        description: 'Get a path parameter extracted by the trie router. For /users/:id, param("id") returns the value from the URL.',
        parameters: [{ name: 'name', type: '&str', description: 'Parameter name (without the colon)' }],
        returns: 'Some(value) if the parameter exists, None otherwise',
        example: `app.handle_get("/users/:id", |req, res| {
    let id = req.param("id").unwrap_or("0");
    res.text(format!("User {}", id))
});`,
      },
      {
        name: 'query',
        signature: 'query(name: &str) -> Option<&str>',
        description: 'Get a query string parameter. For /search?q=rust&limit=10, query("q") returns "rust".',
        parameters: [{ name: 'name', type: '&str', description: 'Query parameter name' }],
        returns: 'Some(value) if the parameter exists, None otherwise',
      },
      {
        name: 'header',
        signature: 'header(name: &str) -> Option<&str>',
        description: 'Get a request header by name (case-insensitive).',
        parameters: [{ name: 'name', type: '&str', description: 'Header name (e.g. "content-type", "authorization")' }],
        returns: 'Some(value) if the header exists, None otherwise',
        example: `let auth = req.header("authorization").unwrap_or("");`,
      },
      {
        name: 'body',
        signature: 'body() -> &str',
        description: 'Get the request body as a string. For binary data, use body_bytes() instead.',
        returns: 'The request body as a string slice',
      },
      {
        name: 'body_bytes',
        signature: 'body_bytes() -> &[u8]',
        description: 'Get the raw request body as a byte slice. Use this for binary data (file uploads, images).',
        returns: 'The request body as a byte slice',
      },
      {
        name: 'json',
        signature: 'json<T: DeserializeOwned>() -> Result<T>',
        description: 'Parse the request body as JSON and deserialize into the given type. Returns an error if the body is not valid JSON or does not match the type.',
        returns: 'Ok(T) if parsing succeeds, Err on invalid JSON',
        example: `#[derive(Deserialize)]
struct CreateUser { name: String, email: String }

app.handle_post("/api/users", |req, res| {
    let user: CreateUser = req.json()?;
    // ... create user
});`,
      },
    ],
  },
  {
    id: 'response',
    title: 'Response',
    description: 'The HTTP response object. Build and return from every route handler. Supports text, JSON, HTML, raw bytes, custom headers, and status codes.',
    methods: [
      {
        name: 'new',
        signature: 'Response::new() -> Response',
        description: 'Create a new empty response with status 200 OK.',
        returns: 'A new Response instance',
      },
      {
        name: 'status',
        signature: 'status(code: StatusCode) -> &mut Self',
        description: 'Set the HTTP status code. Common values: 200, 201, 204, 400, 401, 403, 404, 500.',
        parameters: [{ name: 'code', type: 'StatusCode', description: 'HTTP status code' }],
        returns: 'Mutable reference for chaining',
        example: `Response::new().status(StatusCode::Created).json(body)`,
      },
      {
        name: 'header',
        signature: 'header(name: &str, value: &str) -> &mut Self',
        description: 'Set a response header. Common headers: content-type, set-cookie, cache-control, location.',
        parameters: [
          { name: 'name', type: '&str', description: 'Header name' },
          { name: 'value', type: '&str', description: 'Header value' },
        ],
        example: `Response::new().header("location", "/users/42").status(StatusCode::Redirect)`,
      },
      {
        name: 'text',
        signature: 'text(body: &str) -> Self',
        description: 'Set the response body as plain text with content-type: text/plain.',
        parameters: [{ name: 'body', type: '&str', description: 'Response body text' }],
        example: `res.text("hello world")`,
      },
      {
        name: 'html',
        signature: 'html(body: &str) -> Self',
        description: 'Set the response body as HTML with content-type: text/html; charset=utf-8.',
        parameters: [{ name: 'body', type: '&str', description: 'HTML content' }],
        example: `res.html("<h1>Welcome</h1><p>Hello!</p>")`,
      },
      {
        name: 'json',
        signature: 'json(body: &str) -> Self',
        description: 'Set the response body as JSON with content-type: application/json. The body must already be a JSON string — use serde_json::to_string to serialize.',
        parameters: [{ name: 'body', type: '&str', description: 'Pre-serialized JSON string' }],
        example: `res.json(serde_json::to_string(&user)?)`,
      },
      {
        name: 'bytes',
        signature: 'bytes(body: &[u8], content_type: &str) -> Self',
        description: 'Set the response body as raw bytes with a custom content type. Use for binary data (images, files).',
        parameters: [
          { name: 'body', type: '&[u8]', description: 'Raw bytes' },
          { name: 'content_type', type: '&str', description: 'MIME type (e.g. "image/png")' },
        ],
      },
      {
        name: 'redirect',
        signature: 'redirect(to: &str) -> Self',
        description: 'Create a 302 Found redirect response with a Location header.',
        parameters: [{ name: 'to', type: '&str', description: 'URL to redirect to' }],
        example: `res.redirect("/login")`,
      },
    ],
  },
  {
    id: 'router',
    title: 'Router',
    description: 'The trie-based URL router. O(path depth) lookup. Supports static paths, :params, *wildcards, and automatic 405 Method Not Allowed.',
    methods: [
      {
        name: 'new',
        signature: 'Router::new() -> Router',
        description: 'Create a new empty router.',
      },
      {
        name: 'add',
        signature: 'add(meta: RouteMeta, handler: Handler) -> Result<()>',
        description: 'Add a route with full metadata. Used internally by handle_get, handle_post, etc.',
        parameters: [
          { name: 'meta', type: 'RouteMeta', description: 'Route metadata (path, method, summary, tags)' },
          { name: 'handler', type: 'Handler', description: 'Async handler closure' },
        ],
      },
      {
        name: 'resolve',
        signature: 'resolve(method: &Method, path: &str) -> RouteResolution',
        description: 'Resolve a URL to a route. Returns Found (with handler + params), NotFound, or MethodNotAllowed.',
        parameters: [
          { name: 'method', type: '&Method', description: 'HTTP method' },
          { name: 'path', type: '&str', description: 'URL path' },
        ],
        returns: 'RouteResolution::Found { handler, params }, NotFound, or MethodNotAllowed',
      },
      {
        name: 'routes',
        signature: 'routes() -> &[RouteMeta]',
        description: 'Get all registered routes. Used by the OpenAPI generator to produce API docs.',
        returns: 'Slice of all route metadata',
      },
    ],
  },
  {
    id: 'middleware',
    title: 'Middleware',
    description: 'Onion-model middleware pipeline. Each middleware wraps the next. Short-circuit by returning a response without calling next().',
    methods: [
      {
        name: 'security_headers',
        signature: 'security_headers() -> Middleware',
        description: 'Built-in: adds HSTS, CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy headers. On by default.',
      },
      {
        name: 'cors',
        signature: 'cors(config: CorsConfig) -> Middleware',
        description: 'Built-in: CORS with preflight handling. Configurable origins, methods, headers, max-age.',
        parameters: [{ name: 'config', type: 'CorsConfig', description: 'CORS configuration (origins, methods, headers)' }],
      },
      {
        name: 'rate_limiter',
        signature: 'rate_limiter(burst: u32, rps: u32) -> Middleware',
        description: 'Built-in: leaky-bucket rate limiting per IP + path. Default: 200 burst, 100 rps. Returns 429 Too Many Requests when exceeded.',
        parameters: [
          { name: 'burst', type: 'u32', description: 'Maximum burst size' },
          { name: 'rps', type: 'u32', description: 'Steady-state requests per second' },
        ],
      },
      {
        name: 'logger',
        signature: 'logger() -> Middleware',
        description: 'Built-in: structured request logging. Logs method, path, status, duration, and client IP.',
      },
      {
        name: 'serve_static',
        signature: 'serve_static(dir: &str) -> Middleware',
        description: 'Opt-in: serve static files from a directory. Automatically sets content-type based on file extension.',
        parameters: [{ name: 'dir', type: '&str', description: 'Directory path to serve files from' }],
      },
      {
        name: 'gzip',
        signature: 'gzip() -> Middleware',
        description: 'Opt-in: gzip compression for responses larger than 1KB. Checks Accept-Encoding header.',
      },
      {
        name: 'auth_jwt',
        signature: 'auth_jwt(secret: &[u8]) -> Middleware',
        description: 'Opt-in: JWT authentication. Validates Bearer tokens and attaches the decoded claims to the request.',
        parameters: [{ name: 'secret', type: '&[u8]', description: 'HMAC secret for HS256, or public key for RS256/ES256' }],
      },
    ],
  },
  {
    id: 'orm',
    title: 'ORM (Database)',
    description: 'Built-in ORM with SQLite, PostgreSQL, and MySQL support. CRUD, JOINs, transactions, migrations, and Argon2id password hashing.',
    methods: [
      {
        name: 'Db::connect',
        signature: 'Db::connect(config: DbConfig) -> Result<Db>',
        description: 'Connect to a database. The database type is determined by the URL scheme: sqlite://, postgres://, or mysql://.',
        parameters: [{ name: 'config', type: 'DbConfig', description: 'Connection config (url, max_connections, min_connections)' }],
        returns: 'A database connection pool',
        example: `let db = Db::connect(DbConfig {
    url: "sqlite://app.db".into(),
    max_connections: 5,
    min_connections: 1,
}).await?;`,
      },
      {
        name: 'Model::insert',
        signature: 'model.insert(&db) -> Result<Self>',
        description: 'Insert a new row. Auto-increment IDs are set automatically. Fields marked #[field(sensitive)] are Argon2id-hashed.',
        returns: 'The inserted model with the generated ID',
        example: `let user = User { id: 0, email: "a@b.c".into(), password: "secret".into() };
let inserted = user.insert(&db).await?;`,
      },
      {
        name: 'Model::find_by_pk',
        signature: 'Model::find_by_pk(pk, &db) -> Result<Self>',
        description: 'Find a single row by its primary key.',
        parameters: [{ name: 'pk', type: 'impl Serialize', description: 'Primary key value' }],
        returns: 'The found model, or Error::NotFound',
      },
      {
        name: 'Model::all',
        signature: 'Model::all(&db) -> Result<Vec<Self>>',
        description: 'Get all rows from the table. Use Query for filtering, ordering, and pagination.',
        returns: 'A vector of all models',
      },
      {
        name: 'Model::update_by_pk',
        signature: 'Model::update_by_pk(&db, pk, sets) -> Result<u64>',
        description: 'Update a row by primary key with a list of (column, value) pairs.',
        parameters: [
          { name: 'pk', type: 'impl Serialize', description: 'Primary key value' },
          { name: 'sets', type: 'Vec<(&str, Value)>', description: 'Column-value pairs to update' },
        ],
        returns: 'Number of affected rows',
      },
      {
        name: 'Model::delete_by_pk',
        signature: 'Model::delete_by_pk(pk, &db) -> Result<u64>',
        description: 'Delete a row by primary key.',
        returns: 'Number of deleted rows (0 or 1)',
      },
      {
        name: 'Query::select',
        signature: 'Query::<T>::select(table) -> Query<T>',
        description: 'Start a type-safe query builder. Chain .where_eq(), .where_in(), .order_by(), .limit(), .inner_join(), etc.',
        returns: 'A query builder for the given model type',
        example: `let users: Vec<User> = Query::<User>::select("users")
    .where_eq("email", json!("a@b.c"))
    .order_by("id", false)
    .limit(10)
    .all(&db).await?;`,
      },
      {
        name: 'Db::transaction',
        signature: 'db.transaction(|tx| async { ... }) -> Result<T>',
        description: 'Run a closure inside a database transaction. If the closure returns Err, the transaction is rolled back. If Ok, it is committed.',
        returns: 'The closure return value on success, or the error on rollback',
        example: `db.transaction(|tx| async {
    Account::deduct(&tx, from_id, amount).await?;
    Account::add(&tx, to_id, amount).await?;
    Ok(())
}).await?;`,
      },
    ],
  },
  {
    id: 'websocket',
    title: 'WebSocket',
    description: 'RFC 6455 WebSocket support. Full-duplex communication over a single TCP connection.',
    methods: [
      {
        name: 'ws.recv',
        signature: 'ws.recv() -> Option<WebSocketMessage>',
        description: 'Receive the next message. Returns None when the connection is closed. Blocks until a message arrives.',
        returns: 'Some(WebSocketMessage) or None on close',
      },
      {
        name: 'ws.send_text',
        signature: 'ws.send_text(text: &str) -> Result<()>',
        description: 'Send a text message to the client.',
        parameters: [{ name: 'text', type: '&str', description: 'Message text' }],
      },
      {
        name: 'ws.send_binary',
        signature: 'ws.send_binary(data: &[u8]) -> Result<()>',
        description: 'Send a binary message (e.g. image data, protobuf).',
        parameters: [{ name: 'data', type: '&[u8]', description: 'Binary message data' }],
      },
      {
        name: 'ws.broadcast',
        signature: 'ws.broadcast(text: &str) -> Result<()>',
        description: 'Broadcast a message to ALL connected WebSocket clients on the same endpoint.',
        parameters: [{ name: 'text', type: '&str', description: 'Message to broadcast' }],
      },
      {
        name: 'ws.close',
        signature: 'ws.close() -> Result<()>',
        description: 'Close the WebSocket connection gracefully. Sends a close frame and waits for the client to acknowledge.',
      },
    ],
  },
];
