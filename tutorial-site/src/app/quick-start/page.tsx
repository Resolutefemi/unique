import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export const metadata = {
  title: 'Quick Start — Unique.js',
  description: 'Get up and running with Unique.js in 5 minutes. Install, create your first app, and deploy.',
  keywords: 'unique.js, quick start, getting started, tutorial, install',
};

export default function QuickStartPage() {
  return (
    <>
      <Navbar />
      <div className="container">
        <div className="hero">
          <h1>Quick Start</h1>
          <p>Get up and running with Unique.js in 5 minutes.</p>
        </div>

        <div className="tutorial-layout">
          <aside className="sidebar">
            <h3>Steps</h3>
            <a href="#install">1. Install</a>
            <a href="#first-app">2. Your First App</a>
            <a href="#run">3. Run It</a>
            <a href="#add-routes">4. Add Routes</a>
            <a href="#add-db">5. Add a Database</a>
            <a href="#deploy">6. Deploy</a>
            <h3>Next Steps</h3>
            <a href="/learn/rust/01-getting-started">Full Tutorial</a>
            <a href="/api">API Reference</a>
            <a href="/examples">Examples</a>
          </aside>

          <main className="content">
            <section id="install">
              <h2>1. Install</h2>
              <p>
                Unique.js requires <strong>Rust 1.96+</strong> for the HTTP engine. Install it
                from <a href="https://rustup.rs">rustup.rs</a> if you have not already. Then
                create a new project:
              </p>
              <pre><code className="language-bash">{`# Install Rust (one-time setup)
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Create a new Unique.js project
cargo new myapp
cd myapp`}</code></pre>
              <p>Add Unique.js to your <code>Cargo.toml</code>:</p>
              <pre><code className="language-toml">{`[dependencies]
unique = "1"
unique-core = "1"
tokio = { version = "1", features = ["full"] }
serde = { version = "1", features = ["derive"] }
serde_json = "1"`}</code></pre>
            </section>

            <section id="first-app">
              <h2>2. Your First App</h2>
              <p>
                Open <code>src/main.rs</code> and replace the contents with:
              </p>
              <pre><code className="language-rust">{`use unique::Unique;

#[tokio::main]
async fn main() {
    Unique::new()
        .handle_get("/", |_req, res| res.text("Hello, World!"))
        .handle_get("/api/health", |_req, res| {
            res.json(r#"{"status":"ok"}"#)
        })
        .run("0.0.0.0:3000")
        .await
        .unwrap();
}`}</code></pre>
              <p>
                This creates a Unique.js app with two routes: a homepage that returns
                plain text, and a health check endpoint that returns JSON. Security
                headers, CORS, rate limiting, and logging are all on by default.
              </p>
            </section>

            <section id="run">
              <h2>3. Run It</h2>
              <pre><code className="language-bash">{`cargo run`}</code></pre>
              <p>
                Open <a href="http://localhost:3000">http://localhost:3000</a> in your browser.
                You should see &quot;Hello, World!&quot;. Visit
                <a href="http://localhost:3000/api/health">/api/health</a> for the JSON endpoint.
              </p>
              <p>
                Try the auto-generated API docs at
                <a href="http://localhost:3000/docs">/docs</a> — you will see a Swagger UI
                listing both routes. No annotations needed.
              </p>
            </section>

            <section id="add-routes">
              <h2>4. Add Routes</h2>
              <p>Add path parameters, wildcards, and POST handlers:</p>
              <pre><code className="language-rust">{`Unique::new()
    // Path parameter: /users/42
    .handle_get("/users/:id", |req, res| {
        let id = req.param("id").unwrap_or("0");
        res.text(format!("User {}", id))
    })
    // Wildcard: /assets/css/app.css
    .handle_get("/assets/*path", |req, res| {
        let path = req.param("path").unwrap_or("");
        res.text(format!("File: {}", path))
    })
    // POST with JSON body
    .handle_post("/api/echo", |req, res| {
        // Echo the request body back
        res.header("content-type", "application/json")
            .text(&req.body)
    })
    .run("0.0.0.0:3000").await.unwrap();`}</code></pre>
            </section>

            <section id="add-db">
              <h2>5. Add a Database</h2>
              <p>Add the ORM to your <code>Cargo.toml</code>:</p>
              <pre><code className="language-toml">{`unique-orm = { version = "1", features = ["sqlite"] }
unique-macros = "1"`}</code></pre>
              <p>Define a model and CRUD routes:</p>
              <pre><code className="language-rust">{`use unique_orm::{Db, DbConfig};
use unique_macros::Model;
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, Model)]
#[table(name = "todos")]
struct Todo {
    #[field(primary, auto_increment)]
    id: i64,
    title: String,
    #[field(default = "false")]
    done: bool,
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let db = Db::connect(DbConfig {
        url: "sqlite://todos.db".into(),
        max_connections: 5,
        min_connections: 1,
    }).await?;

    // Auto-create the table
    db.migrate(&[Todo::create_table_sql()]).await?;

    Unique::new()
        .handle_get("/api/todos", move |_req, res| {
            let db = db.clone();
            Box::pin(async move {
                let todos = Todo::all(&db).await.unwrap_or_default();
                res.json(serde_json::to_string(&todos).unwrap())
            })
        })
        .run("0.0.0.0:3000").await?;
    Ok(())
}`}</code></pre>
            </section>

            <section id="deploy">
              <h2>6. Deploy</h2>
              <p>Build a production binary:</p>
              <pre><code className="language-bash">{`cargo build --release
# Binary is at target/release/myapp`}</code></pre>
              <p>Or generate Docker + systemd configs:</p>
              <pre><code className="language-bash">{`# Generate Dockerfile + docker-compose.yml
unique deploy --target docker

# Generate systemd service file
unique deploy --target systemd`}</code></pre>
              <p>
                For production, put Unique.js behind a reverse proxy (nginx or Caddy)
                for TLS termination. See the <a href="/faq">FAQ</a> for deployment details.
              </p>
            </section>

            <section>
              <h2>Next Steps</h2>
              <ul>
                <li>Read the full <a href="/learn/rust/01-getting-started">50-chapter tutorial</a> for deep dives into every feature</li>
                <li>Browse the <a href="/api">API Reference</a> for complete method documentation</li>
                <li>Copy a ready-to-run <a href="/examples">example</a> for WebSocket, JWT auth, file upload, and more</li>
                <li>Check the <a href="/faq">FAQ</a> if you get stuck</li>
              </ul>
            </section>
          </main>
        </div>
      </div>
      <Footer />
    </>
  );
}
