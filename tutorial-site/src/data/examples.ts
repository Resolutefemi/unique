// Real-world Unique.js examples for the examples gallery.

export interface Example {
  slug: string;
  title: string;
  description: string;
  icon: string;
  tags: string[];
  language: string;
  code: string;
  runCommand: string;
}

export const examples: Example[] = [
  {
    slug: 'rest-api',
    title: 'REST API Server',
    description: 'A complete REST API with CRUD operations, JSON responses, and error handling. The foundation of most web backends.',
    icon: '🔗',
    tags: ['REST', 'JSON', 'CRUD'],
    language: 'rust',
    code: `use unique::Unique;
use unique_core::{StatusCode, Response};
use serde::{Serialize, Deserialize};
use std::sync::Arc;
use std::collections::HashMap;

#[derive(Serialize, Deserialize, Clone)]
struct Todo {
    id: u64,
    title: String,
    done: bool,
}

#[tokio::main]
async fn main() {
    let todos = Arc::new(parking_lot::Mutex::new(HashMap::<u64, Todo>::new()));
    let next_id = Arc::new(parking_lot::Mutex::new(1u64));

    let app = Unique::new()
        .handle_get("/api/todos", {
            let todos = todos.clone();
            move |_req, res| {
                let todos = todos.clone();
                Box::pin(async move {
                    let todos = todos.lock();
                    let list: Vec<Todo> = todos.values().cloned().collect();
                    res.json(serde_json::to_string(&list).unwrap())
                })
            }
        })
        .handle_post("/api/todos", {
            let todos = todos.clone();
            let next_id = next_id.clone();
            move |req, res| {
                let todos = todos.clone();
                let next_id = next_id.clone();
                Box::pin(async move {
                    let mut todo: Todo = serde_json::from_str(&req.body).unwrap();
                    todo.id = { let mut id = next_id.lock(); *id += 1; *id };
                    todos.lock().insert(todo.id, todo.clone());
                    res.status(StatusCode::Created)
                        .json(serde_json::to_string(&todo).unwrap())
                })
            }
        })
        .handle_delete("/api/todos/:id", {
            let todos = todos.clone();
            move |req, res| {
                let todos = todos.clone();
                Box::pin(async move {
                    let id: u64 = req.param("id").unwrap().parse().unwrap();
                    todos.lock().remove(&id);
                    res.status(StatusCode::NoContent).text("")
                })
            }
        });

    app.run("0.0.0.0:3000").await.unwrap();
}`,
    runCommand: 'cargo run',
  },
  {
    slug: 'websocket-chat',
    title: 'WebSocket Chat Server',
    description: 'Real-time chat with WebSocket. Multiple clients can connect and broadcast messages to everyone. No polling required.',
    icon: '💬',
    tags: ['WebSocket', 'Real-time', 'Chat'],
    language: 'rust',
    code: `use unique::Unique;
use unique_core::websocket::{WebSocket, WebSocketMessage};
use std::sync::Arc;

#[tokio::main]
async fn main() {
    Unique::new()
        .ws("/chat", |mut ws: WebSocket| {
            Box::pin(async move {
                ws.send_text("Welcome to the chat!").await;

                while let Some(msg) = ws.recv().await {
                    match msg {
                        WebSocketMessage::Text(text) => {
                            // Broadcast to all connected clients
                            ws.broadcast(&format!("user: {}", text)).await;
                        }
                        WebSocketMessage::Close => break,
                        _ => {}
                    }
                }
            })
        })
        .handle_get("/", |_req, res| {
            res.html(r#"
                <h1>WebSocket Chat</h1>
                <div id="messages"></div>
                <input id="msg" placeholder="Type a message..." />
                <button onclick="send()">Send</button>
                <script>
                    const ws = new WebSocket("ws://localhost:3000/chat");
                    ws.onmessage = (e) => {
                        document.getElementById("messages")
                            .innerHTML += "<p>" + e.data + "</p>";
                    };
                    function send() {
                        const input = document.getElementById("msg");
                        ws.send(input.value);
                        input.value = "";
                    }
                </script>
            "#)
        })
        .run("0.0.0.0:3000").await.unwrap();
}`,
    runCommand: 'cargo run',
  },
  {
    slug: 'jwt-auth',
    title: 'JWT Authentication',
    description: 'Secure API with JWT authentication. Login endpoint issues tokens, protected routes verify them. Passwords are Argon2id-hashed.',
    icon: '🔐',
    tags: ['JWT', 'Auth', 'Security'],
    language: 'rust',
    code: `use unique::Unique;
use unique_core::{StatusCode, auth_ext::{hash_password, verify_password, JwtConfig}};
use serde::{Serialize, Deserialize};

#[derive(Deserialize)]
struct LoginRequest {
    email: String,
    password: String,
}

#[derive(Serialize)]
struct LoginResponse {
    token: String,
}

#[tokio::main]
async fn main() {
    let jwt = JwtConfig::new(b"my-secret-key")
        .expiry(3600); // 1 hour

    let app = Unique::new()
        // Public: login endpoint
        .handle_post("/api/login", {
            let jwt = jwt.clone();
            move |req, res| {
                let jwt = jwt.clone();
                Box::pin(async move {
                    let login: LoginRequest = serde_json::from_str(&req.body)?;

                    // Verify password (stored as Argon2id hash)
                    let stored_hash = get_user_hash(&login.email).await;
                    if !verify_password(&login.password, &stored_hash)? {
                        return res.status(StatusCode::Unauthorized)
                            .json(r#"{"error":"Invalid credentials"}"#);
                    }

                    // Issue JWT
                    let token = jwt.issue(&login.email)?;
                    res.json(serde_json::to_string(&LoginResponse { token })?)
                })
            }
        })
        // Protected: requires valid JWT
        .handle_get("/api/me", {
            let jwt = jwt.clone();
            move |req, res| {
                let jwt = jwt.clone();
                Box::pin(async move {
                    let token = req.header("authorization")
                        .and_then(|h| h.strip_prefix("Bearer "))
                        .ok_or("Missing token")?;

                    let claims = jwt.verify(token)?;
                    res.json(format!(r#"{{"user":"{}"}}"#, claims.sub))
                })
            }
        });

    app.run("0.0.0.0:3000").await.unwrap();
}

async fn get_user_hash(email: &str) -> String {
    hash_password("demo123").unwrap() // placeholder
}`,
    runCommand: 'cargo run',
  },
  {
    slug: 'file-upload',
    title: 'File Upload Server',
    description: 'Handle multipart file uploads. Files are received as binary data and saved to disk. Supports multiple files per request.',
    icon: '📁',
    tags: ['Upload', 'Multipart', 'Files'],
    language: 'rust',
    code: `use unique::Unique;
use unique_core::StatusCode;

#[tokio::main]
async fn main() {
    Unique::new()
        .handle_post("/upload", |req, res| {
            Box::pin(async move {
                // req.body_bytes() contains the raw multipart data
                // The Rust core handles multipart parsing
                let body = req.body_bytes();

                // Save to disk
                let filename = format!("upload-{}", chrono::Utc::now().timestamp());
                std::fs::write(format!("./uploads/{}", filename), body)?;

                res.status(StatusCode::Created)
                    .json(format!(r#"{{"filename":"{}"}}"#, filename))
            })
        })
        .handle_get("/", |_req, res| {
            res.html(r#"
                <h1>Upload a File</h1>
                <form method="POST" action="/upload" enctype="multipart/form-data">
                    <input type="file" name="file" />
                    <button type="submit">Upload</button>
                </form>
            "#)
        })
        .run("0.0.0.0:3000").await.unwrap();
}`,
    runCommand: 'cargo run',
  },
  {
    slug: 'database-crud',
    title: 'Database CRUD App',
    description: 'Full CRUD operations with the built-in ORM. Define a model, connect to SQLite, and perform insert/select/update/delete with type-safe queries.',
    icon: '🗄️',
    tags: ['Database', 'ORM', 'SQLite', 'CRUD'],
    language: 'rust',
    code: `use unique::Unique;
use unique_orm::{Db, DbConfig, Model};
use unique_macros::Model as ModelDerive;
use serde::{Serialize, Deserialize};

#[derive(Debug, Serialize, Deserialize, ModelDerive)]
#[table(name = "users")]
struct User {
    #[field(primary, auto_increment)]
    id: i64,
    #[field(unique)]
    email: String,
    #[field(sensitive)] // auto Argon2id hash
    password: String,
    #[field(default = "false")]
    is_admin: bool,
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let db = Db::connect(DbConfig {
        url: "sqlite://users.db".into(),
        max_connections: 5,
        min_connections: 1,
    }).await?;

    // Auto-migrate
    db.migrate(&[User::create_table_sql()]).await?;

    // Create
    let user = User {
        id: 0,
        email: "alice@example.com".into(),
        password: "secret123".into(),
        is_admin: false,
    };
    let inserted = user.insert(&db).await?;
    println!("Created user #{}", inserted.id);

    // Read
    let found = User::find_by_pk(inserted.id, &db).await?;
    println!("Found: {:?}", found.email);

    // Update
    User::update_by_pk(&db, inserted.id, vec![
        ("is_admin", serde_json::json!(true)),
    ]).await?;

    // Query with WHERE
    let admins: Vec<User> = unique_orm::Query::<User>::select("users")
        .where_eq("is_admin", serde_json::json!(true))
        .all(&db).await?;
    println!("{} admin(s)", admins.len());

    // Delete
    User::delete_by_pk(inserted.id, &db).await?;

    // Serve API
    Unique::new()
        .handle_get("/api/users", move |_req, res| {
            let db = db.clone();
            Box::pin(async move {
                let users = User::all(&db).await.unwrap_or_default();
                res.json(serde_json::to_string(&users).unwrap())
            })
        })
        .run("0.0.0.0:3000").await?;
    Ok(())
}`,
    runCommand: 'cargo run',
  },
  {
    slug: 'static-files',
    title: 'Static File Server',
    description: 'Serve static files (HTML, CSS, JS, images) from a directory with automatic content-type detection and caching headers.',
    icon: '📄',
    tags: ['Static', 'Files', 'HTTP'],
    language: 'rust',
    code: `use unique::Unique;
use unique_core::middleware::builtin::serve_static;

#[tokio::main]
async fn main() {
    Unique::new()
        .use_middleware(serve_static("./public"))
        .handle_get("/", |_req, res| {
            // This only runs if ./public/index.html doesn't exist
            res.text("Welcome! Put your files in ./public/")
        })
        .run("0.0.0.0:3000").await.unwrap();
}`,
    runCommand: 'cargo run',
  },
  {
    slug: 'sse-streaming',
    title: 'Server-Sent Events',
    description: 'Stream real-time updates to the browser using Server-Sent Events (SSE). Perfect for live dashboards and notifications.',
    icon: '📡',
    tags: ['SSE', 'Streaming', 'Real-time'],
    language: 'rust',
    code: `use unique::Unique;
use unique_core::Response;

#[tokio::main]
async fn main() {
    Unique::new()
        .handle_get("/events", |_req, _res| {
            Box::pin(async move {
                let (sender, body) = unique_core::response::stream();

                // Spawn a task that sends events every second
                tokio::spawn(async move {
                    let mut count = 0u64;
                    loop {
                        count += 1;
                        let event = format!("data: Count is {}\\n\\n", count);
                        if sender.send(Ok(event.into_bytes())).is_err() {
                            break; // client disconnected
                        }
                        tokio::time::sleep(std::time::Duration::from_secs(1)).await;
                    }
                });

                Response::new()
                    .header("content-type", "text/event-stream")
                    .header("cache-control", "no-cache")
                    .header("connection", "keep-alive")
                    .stream(body)
            })
        })
        .handle_get("/", |_req, res| {
            res.html(r#"
                <h1>SSE Demo</h1>
                <div id="events"></div>
                <script>
                    const es = new EventSource("/events");
                    es.onmessage = (e) => {
                        document.getElementById("events")
                            .innerHTML += "<p>" + e.data + "</p>";
                    };
                </script>
            "#)
        })
        .run("0.0.0.0:3000").await.unwrap();
}`,
    runCommand: 'cargo run',
  },
  {
    slug: 'middleware-chain',
    title: 'Custom Middleware Chain',
    description: 'Build a custom middleware pipeline: request logging, API key auth, rate limiting, and response timing. See the onion model in action.',
    icon: '🧅',
    tags: ['Middleware', 'Onion Model', 'Security'],
    language: 'rust',
    code: `use unique::Unique;
use unique_core::{StatusCode, Response};
use std::sync::Arc;
use std::time::Instant;

#[tokio::main]
async fn main() {
    let app = Unique::new()
        // 1. Request timing middleware (outermost — runs first, finishes last)
        .use_middleware(Arc::new(|req, next| {
            Box::pin(async move {
                let start = Instant::now();
                let mut resp = next(req).await;
                let ms = start.elapsed().as_millis();
                resp.set_header("x-response-time", format!("{}ms", ms));
                resp
            })
        }))
        // 2. API key authentication
        .use_middleware(Arc::new(|req, next| {
            Box::pin(async move {
                if req.path() != "/health" && req.header("x-api-key").is_none() {
                    return Response::new()
                        .status(StatusCode::Unauthorized)
                        .json(r#"{"error":"Missing API key"}"#);
                }
                next(req).await
            })
        }))
        // 3. Request logging
        .use_middleware(Arc::new(|req, next| {
            Box::pin(async move {
                let method = req.method().clone();
                let path = req.path().to_string();
                tracing::info!("{} {}", method, path);
                next(req).await
            })
        }))
        // Routes (innermost)
        .handle_get("/health", |_req, res| res.text("ok"))
        .handle_get("/api/data", |_req, res| {
            res.json(r#"{"data":"secret"}"#)
        });

    app.run("0.0.0.0:3000").await.unwrap();
}`,
    runCommand: 'cargo run',
  },
  {
    slug: 'graphql-endpoint',
    title: 'GraphQL-style API',
    description: 'Build a GraphQL-like API with a single POST endpoint that resolves queries. Shows how to build flexible APIs on top of Unique.js.',
    icon: '🔷',
    tags: ['GraphQL', 'API', 'POST'],
    language: 'rust',
    code: `use unique::Unique;
use unique_core::StatusCode;
use serde::{Serialize, Deserialize};
use std::collections::HashMap;

#[derive(Deserialize)]
struct Query {
    query: String,
    variables: Option<HashMap<String, String>>,
}

#[derive(Serialize)]
struct GraphQLResponse {
    data: serde_json::Value,
    errors: Vec<String>,
}

#[tokio::main]
async fn main() {
    Unique::new()
        .handle_post("/graphql", |req, res| {
            Box::pin(async move {
                let query: Query = match serde_json::from_str(&req.body) {
                    Ok(q) => q,
                    Err(e) => return res.status(StatusCode::BadRequest)
                        .json(format!(r#"{{"errors":["Invalid query: {}"]}}"#, e)),
                };

                // Simple resolver: parse the query and return data
                let data = if query.query.contains("users") {
                    serde_json::json!({
                        "users": [
                            {"id": 1, "name": "Alice", "email": "alice@example.com"},
                            {"id": 2, "name": "Bob", "email": "bob@example.com"},
                        ]
                    })
                } else if query.query.contains("todos") {
                    serde_json::json!({
                        "todos": [
                            {"id": 1, "title": "Learn Unique.js", "done": true},
                            {"id": 2, "title": "Build an app", "done": false},
                        ]
                    })
                } else {
                    serde_json::json!({})
                };

                let response = GraphQLResponse { data, errors: vec![] };
                res.json(serde_json::to_string(&response).unwrap())
            })
        })
        .handle_get("/", |_req, res| {
            res.html(r#"
                <h1>GraphQL Playground</h1>
                <textarea id="query" rows="5" cols="40">
                { users { id name email } }
                </textarea>
                <button onclick="run()">Run</button>
                <pre id="result"></pre>
                <script>
                    async function run() {
                        const query = document.getElementById("query").value;
                        const resp = await fetch("/graphql", {
                            method: "POST",
                            headers: {"content-type": "application/json"},
                            body: JSON.stringify({query})
                        });
                        document.getElementById("result").textContent =
                            JSON.stringify(await resp.json(), null, 2);
                    }
                </script>
            "#)
        })
        .run("0.0.0.0:3000").await.unwrap();
}`,
    runCommand: 'cargo run',
  },
  {
    slug: 'rate-limited-api',
    title: 'Rate-Limited API with Redis',
    description: 'Per-user rate limiting using Redis as the backend. Shows how to integrate external state stores with Unique.js middleware.',
    icon: '⏱️',
    tags: ['Rate Limiting', 'Redis', 'Middleware'],
    language: 'rust',
    code: `use unique::Unique;
use unique_core::{StatusCode, Response};
use std::sync::Arc;
use std::time::{Duration, Instant};
use std::collections::HashMap;
use parking_lot::Mutex;

// In production, use redis::RedisClient. Here we use an in-memory map
// for demonstration.
struct RateLimiter {
    // (ip, path) -> (count, window_start)
    limits: Arc<Mutex<HashMap<(String, String), (u32, Instant)>>>,
    max_requests: u32,
    window: Duration,
}

impl RateLimiter {
    fn new(max: u32, window_secs: u64) -> Self {
        Self {
            limits: Arc::new(Mutex::new(HashMap::new())),
            max_requests: max,
            window: Duration::from_secs(window_secs),
        }
    }

    fn check(&self, ip: &str, path: &str) -> bool {
        let key = (ip.to_string(), path.to_string());
        let now = Instant::now();
        let mut limits = self.limits.lock();

        let entry = limits.entry(key).or_insert((0, now));
        if now.duration_since(entry.1) > self.window {
            *entry = (0, now);
        }

        entry.0 += 1;
        entry.0 <= self.max_requests
    }
}

#[tokio::main]
async fn main() {
    let limiter = Arc::new(RateLimiter::new(100, 60)); // 100 req/min

    Unique::new()
        .use_middleware({
            let limiter = limiter.clone();
            Arc::new(move |req, next| {
                let limiter = limiter.clone();
                Box::pin(async move {
                    let ip = req.header("x-forwarded-for")
                        .unwrap_or("127.0.0.1")
                        .split(',')
                        .next()
                        .unwrap_or("127.0.0.1")
                        .trim()
                        .to_string();
                    let path = req.path().to_string();

                    if !limiter.check(&ip, &path) {
                        return Response::new()
                            .status(StatusCode::TooManyRequests)
                            .header("retry-after", "60")
                            .json(r#"{"error":"Rate limit exceeded","retry_after":60}"#);
                    }
                    next(req).await
                })
            })
        })
        .handle_get("/api/data", |_req, res| {
            res.json(r#"{"data":"success"}"#)
        })
        .run("0.0.0.0:3000").await.unwrap();
}`,
    runCommand: 'cargo run',
  },
  {
    slug: 'todo-mvc',
    title: 'TodoMVC (Full-Stack)',
    description: 'A complete TodoMVC app with SSR frontend, REST API, SQLite database, and real-time updates. The canonical full-stack example.',
    icon: '✅',
    tags: ['Full-Stack', 'SSR', 'SQLite', 'REST'],
    language: 'rust',
    code: `use unique::Unique;
use unique_orm::{Db, DbConfig};
use unique_macros::Model;
use serde::{Serialize, Deserialize};
use std::sync::Arc;

#[derive(Debug, Serialize, Deserialize, Model)]
#[table(name = "todos")]
struct Todo {
    #[field(primary, auto_increment)]
    id: i64,
    title: String,
    #[field(default = "false")]
    completed: bool,
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let db = Arc::new(Db::connect(DbConfig {
        url: "sqlite://todos.db".into(),
        max_connections: 5,
        min_connections: 1,
    }).await?);
    db.migrate(&[Todo::create_table_sql()]).await?;

    let app = Unique::new();

    // REST API
    app.handle_get("/api/todos", {
        let db = db.clone();
        move |_req, res| {
            let db = db.clone();
            Box::pin(async move {
                let todos = Todo::all(&db).await.unwrap_or_default();
                res.json(serde_json::to_string(&todos).unwrap())
            })
        }
    });

    app.handle_post("/api/todos", {
        let db = db.clone();
        move |req, res| {
            let db = db.clone();
            Box::pin(async move {
                #[derive(Deserialize)]
                struct NewTodo { title: String }
                let new: NewTodo = serde_json::from_str(&req.body)?;
                let todo = Todo { id: 0, title: new.title, completed: false };
                let created = todo.insert(&db).await?;
                res.status(unique_core::StatusCode::Created)
                    .json(serde_json::to_string(&created)?)
            })
        }
    });

    app.handle_put("/api/todos/:id/toggle", {
        let db = db.clone();
        move |req, res| {
            let db = db.clone();
            Box::pin(async move {
                let id: i64 = req.param("id").unwrap().parse()?;
                let todo = Todo::find_by_pk(id, &db).await?;
                Todo::update_by_pk(&db, id, vec![
                    ("completed", serde_json::json!(!todo.completed)),
                ]).await?;
                res.json(r#"{"ok":true}"#)
            })
        }
    });

    app.handle_delete("/api/todos/:id", {
        let db = db.clone();
        move |req, res| {
            let db = db.clone();
            Box::pin(async move {
                let id: i64 = req.param("id").unwrap().parse()?;
                Todo::delete_by_pk(id, &db).await?;
                res.status(unique_core::StatusCode::NoContent).text("")
            })
        }
    });

    // SSR frontend
    app.handle_get("/", |_req, res| {
        res.html(r#"
            <!DOCTYPE html>
            <html>
            <head><title>TodoMVC — Unique.js</title></head>
            <body>
                <div id="app"></div>
                <script>
                    async function load() {
                        const resp = await fetch("/api/todos");
                        const todos = await resp.json();
                        document.getElementById("app").innerHTML = \`
                            <h1>Todos</h1>
                            <form onsubmit="add(event)">
                                <input id="title" placeholder="What needs to be done?" />
                                <button>Add</button>
                            </form>
                            <ul>\${todos.map(t => \`
                                <li>
                                    <input type="checkbox" \${t.completed ? "checked" : ""}
                                        onchange="toggle(\${t.id})" />
                                    \${t.title}
                                    <button onclick="del(\${t.id})">x</button>
                                </li>
                            \`).join("")}</ul>
                        \`;
                    }
                    async function add(e) {
                        e.preventDefault();
                        const title = document.getElementById("title").value;
                        await fetch("/api/todos", {
                            method: "POST",
                            headers: {"content-type": "application/json"},
                            body: JSON.stringify({title})
                        });
                        load();
                    }
                    async function toggle(id) {
                        await fetch(\`/api/todos/\${id}/toggle\`, {method: "PUT"});
                        load();
                    }
                    async function del(id) {
                        await fetch(\`/api/todos/\${id}\`, {method: "DELETE"});
                        load();
                    }
                    load();
                </script>
            </body>
            </html>
        "#)
    });

    app.run("0.0.0.0:3000").await?;
    Ok(())
}`,
    runCommand: 'cargo run',
  },
  {
    slug: 'oauth-google',
    title: 'OAuth2 with Google',
    description: 'Google OAuth2 login flow: redirect to Google, handle callback, exchange code for tokens, and create a session. Shows the full OAuth2 dance.',
    icon: '🔑',
    tags: ['OAuth2', 'Google', 'Auth', 'Session'],
    language: 'rust',
    code: `use unique::Unique;
use unique_core::{StatusCode, auth_ext::{OAuth2Config, OAuth2Provider, SessionStore}};
use std::sync::Arc;
use serde::Deserialize;

#[derive(Deserialize)]
struct Callback {
    code: String,
    state: String,
}

#[tokio::main]
async fn main() {
    let oauth = OAuth2Config {
        provider: OAuth2Provider::Google,
        client_id: "your-google-client-id".into(),
        client_secret: "your-google-client-secret".into(),
        redirect_uri: "http://localhost:3000/auth/callback".into(),
        scopes: vec!["openid".into(), "email".into(), "profile".into()],
    };

    let sessions = Arc::new(SessionStore::new());

    Unique::new()
        // Step 1: Redirect user to Google
        .handle_get("/auth/login", move |_req, res| {
            let url = oauth.authorization_url("random-state-string");
            res.redirect(&url)
        })
        // Step 2: Google redirects back here with a code
        .handle_get("/auth/callback", {
            let oauth = oauth.clone();
            let sessions = sessions.clone();
            move |req, res| {
                let oauth = oauth.clone();
                let sessions = sessions.clone();
                Box::pin(async move {
                    let code = req.query("code").unwrap_or("");
                    let token = oauth.exchange_code(code).await?;
                    let user_info = oauth.get_user_info(&token.access_token).await?;

                    // Create a session
                    let session_id = sessions.create(
                        &user_info.email,
                        serde_json::json!({"name": user_info.name}),
                        86400, // 24 hours
                    );

                    // Set session cookie
                    res.header("set-cookie",
                        format!("session={}; Path=/; HttpOnly; Max-Age=86400; SameSite=Strict",
                                session_id))
                        .redirect("/dashboard")
                })
            }
        })
        // Protected route
        .handle_get("/dashboard", {
            let sessions = sessions.clone();
            move |req, res| {
                let sessions = sessions.clone();
                Box::pin(async move {
                    let cookie = req.header("cookie").unwrap_or("");
                    let session_id = cookie.split("session=")
                        .nth(1)
                        .and_then(|s| s.split(';').next())
                        .unwrap_or("");

                    match sessions.get(session_id) {
                        Some(session) => {
                            res.html(format!(
                                "<h1>Welcome, {}!</h1><p>Email: {}</p>",
                                session.data["name"], session.user_id
                            ))
                        }
                        None => res.status(StatusCode::Unauthorized)
                            .text("Not logged in. <a href='/auth/login'>Login</a>"),
                    }
                })
            }
        })
        .run("0.0.0.0:3000").await.unwrap();
}`,
    runCommand: 'cargo run',
  },
];
