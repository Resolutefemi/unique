import { Navbar } from '@/components/Navbar';
import { chapters, languages } from '@/data/languages';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export async function generateMetadata({ params }: { params: { lang: string } }) {
  const lang = languages.find(l => l.id === params.lang);
  if (!lang) return {};
  return {
    title: `Kungfu.js Tutorial - ${lang.name} - From Beginner to Pro`,
    description: `Learn Kungfu.js in ${lang.name}. Complete tutorial from installation to deployment. ${lang.description}`,
    keywords: `kungfu, ${lang.name}, tutorial, web framework, ${lang.fileExtension}`,
    openGraph: {
      title: `Learn Kungfu.js in ${lang.name}`,
      description: `Complete ${lang.name} tutorial for the Kungfu.js polyglot web framework.`,
    },
  };
}

export default async function TutorialPage({
  params,
}: {
  params: { lang: string; chapter: string };
}) {
  const lang = languages.find((l) => l.id === params.lang);
  if (!lang) notFound();

  const chapterIndex = chapters.findIndex((c) => c.slug === params.chapter);
  if (chapterIndex === -1) notFound();

  const chapter = chapters[chapterIndex];
  const prev = chapterIndex > 0 ? chapters[chapterIndex - 1] : null;
  const next = chapterIndex < chapters.length - 1 ? chapters[chapterIndex + 1] : null;

  const content = getTutorialContent(params.lang, params.chapter);

  return (
    <>
      <Navbar />
      <div className="tutorial-layout">
        <aside className="sidebar">
          <h3>{lang.icon} {lang.name}</h3>
          {chapters.map((c, i) => (
            <Link
              key={c.slug}
              href={`/learn/${params.lang}/${c.slug}`}
              className={c.slug === params.chapter ? 'active' : ''}
            >
              {i + 1}. {c.title}
            </Link>
          ))}
          <h3>Other Languages</h3>
          {languages.filter(l => l.id !== params.lang).map(l => (
            <Link key={l.id} href={`/learn/${l.id}/01-getting-started`}>
              {l.icon} {l.name}
            </Link>
          ))}
        </aside>
        <main className="content">
          <div dangerouslySetInnerHTML={{ __html: content }} />
          <div className="btn-row">
            {prev ? (
              <Link href={`/learn/${params.lang}/${prev.slug}`} className="btn">
                Previous: {prev.title}
              </Link>
            ) : <span />}
            {next ? (
              <Link href={`/learn/${params.lang}/${next.slug}`} className="btn">
                Next: {next.title}
              </Link>
            ) : <span />}
          </div>
        </main>
      </div>
    </>
  );
}

export async function generateStaticParams() {
  const params: { lang: string; chapter: string }[] = [];
  for (const lang of languages) {
    for (const chapter of chapters) {
      params.push({ lang: lang.id, chapter: chapter.slug });
    }
  }
  return params;
}

function getTutorialContent(lang: string, chapter: string): string {
  const langData = languages.find(l => l.id === lang)!;
  const langName = langData.name;

  if (chapter === '01-getting-started') {
    return [
      `<h1>Getting Started with Kungfu.js in ${langName}</h1>`,
      `<p>Welcome to the Kungfu.js tutorial for ${langName}! This guide will take you from beginner to pro.</p>`,
      `<h2>What is Kungfu.js?</h2>`,
      `<p>Kungfu.js is a polyglot web framework with a Rust core. It lets you write your backend in any language while keeping the frontend in JavaScript/TypeScript. The HTTP server, router, and middleware all run in Rust for maximum performance.</p>`,
      `<h2>Why use Kungfu.js?</h2>`,
      `<ul>`,
      `<li><strong>Fast:</strong> 86k+ requests per second on CI runners</li>`,
      `<li><strong>Secure:</strong> HSTS, CSP, CORS, rate limiting, JWT auth. All on by default</li>`,
      `<li><strong>Simple:</strong> No macros needed, just closures</li>`,
      `<li><strong>Polyglot:</strong> Write backend in ${langName}, Rust, Python, Go, and more</li>`,
      `</ul>`,
      `<h2>Prerequisites</h2>`,
      getPrerequisites(lang),
      `<h2>Installation</h2>`,
      getInstallSteps(lang),
      `<h2>Your First App</h2>`,
      getHelloWorld(lang),
      `<h2>Run It</h2>`,
      getRunCommand(lang),
      `<h2>What Just Happened?</h2>`,
      getExplanation(lang),
      `<h2>Package Info</h2>`,
      `<p>Package name: <code>${langData.packageName}</code><br>Registry: <code>${langData.registry}</code><br>File extension: <code>${langData.fileExtension}</code></p>`,
      `<h2>Next Steps</h2>`,
      `<p>In the next chapter, you will learn about routing, path parameters, and query strings.</p>`,
    ].join('\n');
  }

  // Chapter 2: Routing
  if (chapter === '02-routing') {
    return [
      `<h1>Routing in ${langName}</h1>`,
      `<p>Kungfu.js uses a trie router with O(path depth) lookup. This means routing stays fast even with thousands of registered routes.</p>`,
      `<h2>Static Paths</h2>`,
      `<p>The simplest route is a static path:</p>`,
      getRoutingExample(lang, 'static'),
      `<h2>Path Parameters</h2>`,
      `<p>Use <code>:name</code> to capture a single segment:</p>`,
      getRoutingExample(lang, 'param'),
      `<h2>Wildcards</h2>`,
      `<p>Use <code>*name</code> to capture the rest of the path:</p>`,
      getRoutingExample(lang, 'wildcard'),
      `<h2>Query Strings</h2>`,
      `<p>Query parameters are parsed automatically:</p>`,
      getRoutingExample(lang, 'query'),
      `<h2>HTTP Methods</h2>`,
      `<p>Kungfu.js supports GET, POST, PUT, DELETE, and PATCH. If a path is registered for GET but the client sends POST, the framework returns 405 Method Not Allowed automatically.</p>`,
    ].join('\n');
  }

  // Chapter 3: Middleware
  if (chapter === '03-middleware') {
    return [
      `<h1>Middleware in ${langName}</h1>`,
      `<p>Middleware is a function that runs before and/or after every request. Kungfu.js uses the classic "onion" model.</p>`,
      `<h2>Built-in Middleware (On by Default)</h2>`,
      `<ul>`,
      `<li><strong>security_headers</strong> - HSTS, CSP, X-Frame-Options, Referrer-Policy</li>`,
      `<li><strong>cors</strong> - CORS with preflight handling</li>`,
      `<li><strong>rate_limiter</strong> - Leaky-bucket per IP + path (200 burst, 100 rps)</li>`,
      `<li><strong>logger</strong> - Structured request logging</li>`,
      `</ul>`,
      `<h2>Opt-in Middleware</h2>`,
      `<ul>`,
      `<li><strong>serve_static</strong> - Serve files from a directory</li>`,
      `<li><strong>etag</strong> - ETag headers + If-None-Match</li>`,
      `<li><strong>gzip</strong> - Gzip compression</li>`,
      `<li><strong>validate_json</strong> - JSON Schema validation</li>`,
      `<li><strong>auth_jwt</strong> - JWT authentication</li>`,
      `</ul>`,
      `<h2>Custom Middleware</h2>`,
      `<p>A middleware is a function that wraps the request. It can short-circuit by returning a response without calling the next handler.</p>`,
      getMiddlewareExample(lang),
    ].join('\n');
  }

  // Chapter 4: Request and Response
  if (chapter === '04-request-response') {
    return [
      `<h1>Request and Response in ${langName}</h1>`,
      `<h2>Reading the Request</h2>`,
      `<p>You can read route parameters, query strings, headers, and the body.</p>`,
      getRequestExample(lang),
      `<h2>Building the Response</h2>`,
      `<p>Responses can be JSON, text, HTML, or raw bytes.</p>`,
      getResponseExample(lang),
      `<h2>Error Responses</h2>`,
      `<p>Use the unified error format with code, message, detail, and suggestion.</p>`,
      getErrorExample(lang),
    ].join('\n');
  }

  // Chapter 5: Database
  if (chapter === '05-database') {
    return [
      `<h1>Database and ORM in ${langName}</h1>`,
      `<p>Kungfu.js has a built-in ORM with support for SQLite, PostgreSQL, and MySQL. All queries are parameterized to prevent SQL injection.</p>`,
      `<h2>Connecting</h2>`,
      getDatabaseExample(lang, 'connect'),
      `<h2>Defining Models</h2>`,
      getDatabaseExample(lang, 'model'),
      `<h2>CRUD Operations</h2>`,
      getDatabaseExample(lang, 'crud'),
      `<h2>Supported Databases</h2>`,
      `<ul>`,
      `<li><strong>SQLite</strong> - <code>sqlite://file.db</code> or <code>sqlite::memory:</code></li>`,
      `<li><strong>PostgreSQL (Supabase, Neon, Railway)</strong> - <code>postgres://user:pass@host/db</code></li>`,
      `<li><strong>MySQL</strong> - <code>mysql://user:pass@host/db</code></li>`,
      `</ul>`,
    ].join('\n');
  }

  // Chapter 6: Auth
  if (chapter === '06-auth') {
    return [
      `<h1>Authentication in ${langName}</h1>`,
      `<h2>JWT Authentication</h2>`,
      `<p>Kungfu.js supports HS256, RS256, and ES256 JWT algorithms.</p>`,
      getAuthExample(lang, 'jwt'),
      `<h2>Session-based Auth</h2>`,
      `<p>For cookie-based sessions, use the SessionStore.</p>`,
      getAuthExample(lang, 'session'),
      `<h2>Role-based Access Control (RBAC)</h2>`,
      `<p>Restrict routes to specific roles.</p>`,
      getAuthExample(lang, 'rbac'),
      `<h2>OAuth2</h2>`,
      `<p>Supports Google, GitHub, Discord, and custom providers.</p>`,
    ].join('\n');
  }

  // Chapter 7: WebSocket
  if (chapter === '07-websocket') {
    return [
      `<h1>WebSocket in ${langName}</h1>`,
      `<p>Kungfu.js has built-in WebSocket support (RFC 6455) with automatic upgrade handling.</p>`,
      getWebSocketExample(lang),
      `<h2>Message Types</h2>`,
      `<ul>`,
      `<li><strong>Text</strong> - UTF-8 text messages</li>`,
      `<li><strong>Binary</strong> - Binary data</li>`,
      `<li><strong>Ping/Pong</strong> - Automatically handled</li>`,
      `<li><strong>Close</strong> - Clean shutdown</li>`,
      `</ul>`,
    ].join('\n');
  }

  // Chapter 8: CSS
  if (chapter === '08-css') {
    return [
      `<h1>CSS Engine in ${langName}</h1>`,
      `<p>Kungfu.js has a built-in CSS engine that works like Tailwind. It scans your source files for class names and generates a minimal CSS bundle.</p>`,
      `<h2>Compiling CSS</h2>`,
      getCssExample(lang),
      `<h2>Supported Utilities</h2>`,
      `<ul>`,
      `<li><strong>Layout</strong> - flex, grid, block, inline, hidden, relative, absolute</li>`,
      `<li><strong>Spacing</strong> - p-0 to p-16, m-0 to m-16, px, py, mx, my</li>`,
      `<li><strong>Colors</strong> - text-{color}-{shade}, bg-{color}-{shade} (red, blue, green, gray, yellow, purple, 100-900)</li>`,
      `<li><strong>Typography</strong> - text-xs to text-4xl, font-bold, italic, text-center</li>`,
      `<li><strong>Borders</strong> - border, rounded, rounded-lg, rounded-full</li>`,
      `<li><strong>Responsive</strong> - sm:, md:, lg:, xl:, 2xl: prefixes</li>`,
      `<li><strong>State</strong> - hover:, focus:, active:, disabled: prefixes</li>`,
      `</ul>`,
    ].join('\n');
  }

  // Chapter 9: Frontend
  if (chapter === '09-frontend') {
    return [
      `<h1>Frontend and SSR in ${langName}</h1>`,
      `<p>The frontend of Kungfu.js is JavaScript/TypeScript only. The backend can be in any language.</p>`,
      `<h2>.kungfu Files</h2>`,
      `<p>A .kungfu file exports a data() function and a template() function. The server calls data() at request time, passes the result to template(), and sends the rendered HTML to the client.</p>`,
      `<pre><code>// src/pages/index.kungfu\nexport async function data(req) {\n  return { user: { name: 'Bruce' } };\n}\n\nexport function template({ user }) {\n  return '&lt;h1&gt;Hello, ' + user.name + '!&lt;/h1&gt;';\n}</code></pre>`,
      `<h2>File-based Routing</h2>`,
      `<p>Files in src/pages/ automatically become routes:</p>`,
      `<ul>`,
      `<li><code>index.kungfu</code> becomes <code>/</code></li>`,
      `<li><code>about.kungfu</code> becomes <code>/about</code></li>`,
      `<li><code>users/[id].kungfu</code> becomes <code>/users/:id</code></li>`,
      `</ul>`,
      `<h2>Client-side Hydration</h2>`,
      `<p>The hydration script is injected automatically. It provides reactive data binding, form submission helpers, and live reload.</p>`,
      `<pre><code>&lt;div data-kungfu-bind="user.name"&gt;Loading...&lt;/div&gt;\n&lt;button data-kungfu-click="refresh"&gt;Refresh&lt;/button&gt;\n&lt;form data-kungfu-submit="/api/users" data-kungfu-method="POST"&gt;...&lt;/form&gt;</code></pre>`,
    ].join('\n');
  }

  // Chapter 10: Deployment
  if (chapter === '10-deployment') {
    return [
      `<h1>Deployment in ${langName}</h1>`,
      `<h2>Building for Production</h2>`,
      `<pre><code>cargo build --release --features "kungfu-core/io_uring kungfu-core/simd"</code></pre>`,
      `<h2>Docker</h2>`,
      `<pre><code>FROM rust:1.96 AS builder\nWORKDIR /app\nCOPY . .\nRUN cargo build --release\n\nFROM debian:bookworm-slim\nCOPY --from=builder /app/target/release/your-app /usr/local/bin/\nEXPOSE 3000\nCMD ["your-app"]</code></pre>`,
      `<h2>Docker Compose</h2>`,
      `<p>Run <code>kungfu deploy</code> to generate Dockerfile, docker-compose.yml, and systemd service file automatically.</p>`,
      `<h2>systemd</h2>`,
      `<pre><code>[Unit]\nDescription=Kungfu App\nAfter=network.target\n\n[Service]\nType=simple\nExecStart=/opt/myapp/app\nRestart=on-failure\n\n[Install]\nWantedBy=multi-user.target</code></pre>`,
      `<h2>Production Tuning</h2>`,
      `<ul>`,
      `<li>Set acceptor_threads to the number of CPU cores</li>`,
      `<li>Increase file descriptor limit: <code>ulimit -n 1048576</code></li>`,
      `<li>Tune <code>net.core.somaxconn</code> to 4096+</li>`,
      `<li>Use a reverse proxy (nginx/Caddy) for TLS termination</li>`,
      `</ul>`,
      `<h2>Congratulations!</h2>`,
      `<p>You have completed the Kungfu.js tutorial for ${langName}. You now know how to build, secure, and deploy a Kungfu.js application.</p>`,
    ].join('\n');
  }

  const chapterData = chapters.find(c => c.slug === chapter)!;
  return [
    `<h1>${chapterData.title} in ${langName}</h1>`,
    `<p>${chapterData.description}</p>`,
  ].join('\n');
}

// --- Language-specific code examples ---

function getPrerequisites(lang: string): string {
  switch (lang) {
    case 'rust': return '<p>You need <strong>Rust 1.96+</strong>. Install from <a href="https://rustup.rs">rustup.rs</a>.</p>';
    case 'javascript': return '<p>You need <strong>Node.js 18+</strong> and <strong>Rust</strong> (for the native addon).</p>';
    case 'typescript': return '<p>You need <strong>Node.js 18+</strong>, <strong>TypeScript</strong>, and <strong>Rust</strong>.</p>';
    case 'python': return '<p>You need <strong>Python 3.8+</strong> and <strong>Rust</strong> (for building the extension).</p>';
    case 'go': return '<p>You need <strong>Go 1.21+</strong>.</p>';
    case 'java': return '<p>You need <strong>Java 17+</strong> and <strong>Rust</strong> (for the C ABI).</p>';
    case 'kotlin': return '<p>You need <strong>Kotlin</strong> + <strong>JVM 17+</strong> and <strong>Rust</strong>.</p>';
    case 'dart': return '<p>You need <strong>Dart 3+</strong> and <strong>Rust</strong> (for the C ABI).</p>';
    case 'swift': return '<p>You need <strong>Swift 5.9+</strong> and <strong>Rust</strong> (for the C ABI).</p>';
    case 'cpp': return '<p>You need a <strong>C++17 compiler</strong> and <strong>Rust</strong> (for the C ABI).</p>';
    case 'php': return '<p>You need <strong>PHP 8+</strong> with the <strong>FFI extension</strong> and <strong>Rust</strong>.</p>';
    case 'ruby': return '<p>You need <strong>Ruby 3+</strong> with the <strong>ffi gem</strong> and <strong>Rust</strong>.</p>';
    case 'csharp': return '<p>You need <strong>.NET 8+</strong> and <strong>Rust</strong> (for the C ABI).</p>';
    case 'c': return '<p>You need a <strong>C compiler</strong> and <strong>Rust</strong> (for the C ABI).</p>';
    case 'elixir': return '<p>You need <strong>Elixir 1.15+</strong> and <strong>Rust</strong>.</p>';
    case 'lua': return '<p>You need <strong>Lua 5.4+</strong> with <strong>LuaJIT FFI</strong> and <strong>Rust</strong>.</p>';
    default: return '<p>Install Rust from <a href="https://rustup.rs">rustup.rs</a>.</p>';
  }
}

function getInstallSteps(lang: string): string {
  switch (lang) {
    case 'rust': return '<pre><code>git clone https://github.com/Resolutefemi/kungfu.git\ncd kungfu\ncargo build --workspace --release</code></pre>';
    case 'javascript':
    case 'typescript': return '<pre><code>npm install @kungfu/core</code></pre>';
    case 'python': return '<pre><code>pip install kungfu</code></pre>';
    case 'go': return '<pre><code>go get github.com/Resolutefemi/kungfu/bindings/go</code></pre>';
    case 'java':
    case 'kotlin': return '<pre><code>&lt;dependency&gt;\n  &lt;groupId&gt;com.kungfu&lt;/groupId&gt;\n  &lt;artifactId&gt;kungfu&lt;/artifactId&gt;\n  &lt;version&gt;1.0.0&lt;/version&gt;\n&lt;/dependency&gt;</code></pre>';
    case 'dart': return '<pre><code>dart pub add kungfu</code></pre>';
    case 'swift': return '<pre><code>.package(url: "https://github.com/Resolutefemi/kungfu.git", branch: "main")</code></pre>';
    case 'cpp': return '<pre><code>#include "kungfu.hpp"\n// Link against libkungfu_core.so</code></pre>';
    case 'php': return '<pre><code>composer require kungfu/kungfu</code></pre>';
    case 'ruby': return '<pre><code>gem install kungfu</code></pre>';
    case 'csharp': return '<pre><code>dotnet add package Kungfu.Core</code></pre>';
    case 'c': return '<pre><code>#include "kungfu.h"\n// Link against libkungfu_core.so</code></pre>';
    case 'elixir': return '<pre><code>defp deps do\n  [{:kungfu, "~> 1.0"}]\nend</code></pre>';
    case 'lua': return '<pre><code>luarocks install kungfu</code></pre>';
    default: return '<pre><code>git clone https://github.com/Resolutefemi/kungfu.git</code></pre>';
  }
}

function getHelloWorld(lang: string): string {
  switch (lang) {
    case 'rust': return '<pre><code>use kungfu::prelude::*;\n\nfn main() {\n    let rt = tokio::runtime::Runtime::new().unwrap();\n    rt.block_on(\n        Kungfu::new()\n            .handle_get("/hello", |_req, res| res.text("world"))\n            .run("0.0.0.0:3000"),\n    ).unwrap();\n}</code></pre>';
    case 'javascript': return '<pre><code>const { Kungfu } = require(\'@kungfu/core\');\nconst app = new Kungfu();\n\napp.get(\'/hello\', (req) => {\n    return { status: 200, body: JSON.stringify({ message: \'world\' }) };\n});\n\napp.listen(3000);</code></pre>';
    case 'typescript': return '<pre><code>import { Kungfu } from \'@kungfu/core\';\nconst app = new Kungfu();\n\napp.get(\'/hello\', (req) => {\n    return { status: 200, body: JSON.stringify({ message: \'world\' }) };\n});\n\napp.listen(3000);</code></pre>';
    case 'python': return '<pre><code>from kungfu import KungfuApp\nimport json\n\napp = KungfuApp()\n\napp.get(\'/hello\', lambda req: app.respond(\n    json.loads(req)[\'request_id\'], 200,\n    json.dumps({\'message\': \'world\'})\n))\n\napp.listen(3000)</code></pre>';
    case 'go': return '<pre><code>package main\nimport "github.com/Resolutefemi/kungfu/bindings/go/kungfu"\n\nfunc main() {\n    app := kungfu.New()\n    app.Get("/hello", func(w kungfu.ResponseWriter, r *kungfu.Request) {\n        w.Text(200, "world")\n    })\n    app.Run(":3000")\n}</code></pre>';
    case 'java': return '<pre><code>import com.kungfu.Kungfu;\n\npublic class Main {\n    public static void main(String[] args) {\n        Kungfu app = new Kungfu();\n        app.get("/hello", (req, res) -> {\n            res.status(200).text("world");\n        });\n        app.listen(3000);\n    }\n}</code></pre>';
    case 'kotlin': return '<pre><code>import com.kungfu.Kungfu\n\nfun main() {\n    val app = Kungfu()\n    app.get("/hello") { req, res ->\n        res.status(200).text("world")\n    }\n    app.listen(3000)\n}</code></pre>';
    case 'dart': return '<pre><code>import \'package:kungfu/kungfu.dart\';\n\nvoid main() {\n    final app = Kungfu();\n    app.get(\'/hello\', (req, res) => res.text(\'world\'));\n    app.listen(3000);\n}</code></pre>';
    case 'swift': return '<pre><code>import Kungfu\n\nlet app = Kungfu()\napp.get("/hello") { req, res in\n    res.text("world")\n}\napp.run(port: 3000)</code></pre>';
    case 'cpp': return '<pre><code>#include "kungfu.hpp"\n\nint main() {\n    kungfu::KungfuRouter router;\n    router.get("/hello", [](kungfu::Request& req, kungfu::Response& res) {\n        res.text("world");\n    });\n    kungfu::KungfuServer server(std::move(router));\n    server.listen(3000);\n}</code></pre>';
    case 'php': return '<pre><code>&lt;?php\n$ffi = FFI::cdef(file_get_contents("kungfu.h"), "libkungfu_core.so");\n$router = $ffi->kungfu_router_new();\n// Register routes via FFI\n$ffi->kungfu_server_listen($server, 3000);</code></pre>';
    case 'ruby': return '<pre><code>require \'ffi\'\nrequire \'kungfu\'\n\napp = Kungfu::App.new\napp.get(\'/hello\') do |req|\n    [200, {}, [\'world\']]\nend\napp.listen(3000)</code></pre>';
    case 'csharp': return '<pre><code>using Kungfu;\n\nvar app = new KungfuApp();\napp.Get("/hello", (req, res) => {\n    res.Text(200, "world");\n});\napp.Listen(3000);</code></pre>';
    case 'c': return '<pre><code>#include "kungfu.h"\n\nvoid hello_handler(KungfuRequest* req, KungfuResponse* res) {\n    kungfu_response_status(res, 200);\n    kungfu_response_body(res, (const uint8_t*)"world", 5);\n}\n\nint main() {\n    KungfuRouter* router = kungfu_router_new();\n    kungfu_router_get(router, "/hello", hello_handler);\n    KungfuServer* server = kungfu_server_new(router);\n    kungfu_server_listen(server, 3000);\n    return 0;\n}</code></pre>';
    case 'elixir': return '<pre><code>defmodule MyApp do\n  use Kungfu\n\n  get "/hello" do\n    "world"\n  end\nend\n\nMyApp.start(port: 3000)</code></pre>';
    case 'lua': return '<pre><code>local kungfu = require("kungfu")\nlocal app = kungfu.new()\n\napp:get("/hello", function(req, res)\n    res:text("world")\nend)\n\napp:listen(3000)</code></pre>';
    default: return '<pre><code>// See the bindings directory for examples</code></pre>';
  }
}

function getRunCommand(lang: string): string {
  switch (lang) {
    case 'rust': return '<pre><code>cargo run --example hello\n# Visit: http://localhost:3000/hello</code></pre>';
    case 'javascript':
    case 'typescript': return '<pre><code>node hello.jsk\n# Visit: http://localhost:3000/hello</code></pre>';
    case 'python': return '<pre><code>python hello.py\n# Visit: http://localhost:3000/hello</code></pre>';
    case 'go': return '<pre><code>go run main.go\n# Visit: http://localhost:3000/hello</code></pre>';
    case 'java':
    case 'kotlin': return '<pre><code>javac Main.java && java Main\n# Visit: http://localhost:3000/hello</code></pre>';
    case 'dart': return '<pre><code>dart run hello.dart\n# Visit: http://localhost:3000/hello</code></pre>';
    case 'swift': return '<pre><code>swift run\n# Visit: http://localhost:3000/hello</code></pre>';
    case 'cpp': return '<pre><code>g++ -std=c++17 hello.cpp -lkungfu_core -o hello\n./hello\n# Visit: http://localhost:3000/hello</code></pre>';
    case 'php': return '<pre><code>php hello.php\n# Visit: http://localhost:3000/hello</code></pre>';
    case 'ruby': return '<pre><code>ruby hello.rb\n# Visit: http://localhost:3000/hello</code></pre>';
    case 'csharp': return '<pre><code>dotnet run\n# Visit: http://localhost:3000/hello</code></pre>';
    case 'c': return '<pre><code>gcc hello.c -lkungfu_core -o hello\n./hello\n# Visit: http://localhost:3000/hello</code></pre>';
    case 'elixir': return '<pre><code>mix run --no-halt\n# Visit: http://localhost:3000/hello</code></pre>';
    case 'lua': return '<pre><code>lua hello.lua\n# Visit: http://localhost:3000/hello</code></pre>';
    default: return '<pre><code># See the bindings directory</code></pre>';
  }
}

function getExplanation(lang: string): string {
  return '<p>You just created a Kungfu.js server that listens on port 3000 and responds to GET /hello with "world". The Rust core handles the HTTP parsing, routing, and response writing. Your ' + lang + ' code only runs for the business logic.</p><p>The server comes with built-in security headers (HSTS, CSP, X-Frame-Options), CORS, and rate limiting. Auto-generated API docs are available at <a href="http://localhost:3000/docs">http://localhost:3000/docs</a>.</p>';
}

function getRoutingExample(lang: string, type: string): string {
  if (type === 'static') return '<pre><code>// GET /, GET /about, GET /contact\napp.get("/", (req) => { ... });\napp.get("/about", (req) => { ... });</code></pre>';
  if (type === 'param') return '<pre><code>// GET /users/42 -> req.param("id") = "42"\napp.get("/users/:id", (req) => {\n    const id = req.param("id");\n    ...\n});</code></pre>';
  if (type === 'wildcard') return '<pre><code>// GET /assets/css/app.css -> req.param("path") = "css/app.css"\napp.get("/assets/*path", (req) => {\n    const path = req.param("path");\n    ...\n});</code></pre>';
  if (type === 'query') return '<pre><code>// GET /search?q=rust&limit=10\napp.get("/search", (req) => {\n    const q = req.query("q");\n    const limit = req.query("limit");\n    ...\n});</code></pre>';
  return '';
}

function getMiddlewareExample(lang: string): string {
  if (lang === 'rust') return '<pre><code>let add_header = Arc::new(|req, next| {\n    Box::pin(async move {\n        let mut resp = next(req).await;\n        resp.set_header("x-custom", "hello");\n        resp\n    })\n});\n\nKungfu::new()\n    .use_middleware(add_header)\n    .handle_get("/", |_req, res| res.text("home"))</code></pre>';
  return '<pre><code>// Middleware wraps the request.\n// It can modify the response after the handler runs,\n// or short-circuit by returning without calling next().</code></pre>';
}

function getRequestExample(lang: string): string {
  return '<pre><code>// Route params\nconst id = req.param("id");\n\n// Query strings\nconst q = req.query("q");\n\n// Headers\nconst auth = req.header("authorization");\n\n// JSON body\nconst body = JSON.parse(req.body);</code></pre>';
}

function getResponseExample(lang: string): string {
  if (lang === 'rust') return '<pre><code>// JSON\nResponse::new().json(&serde_json::json!({"ok": true}))\n\n// Text\nResponse::new().text("hello")\n\n// HTML\nResponse::new().html("&lt;h1&gt;Hi&lt;/h1&gt;")\n\n// Custom status\nResponse::new().status(StatusCode::Created).json(&data)</code></pre>';
  return '<pre><code>// JSON\nreturn { status: 200, body: JSON.stringify({ ok: true }) };\n\n// Text\nreturn { status: 200, body: "hello" };\n\n// HTML\nreturn { status: 200, headers: { "content-type": "text/html" }, body: "&lt;h1&gt;Hi&lt;/h1&gt;" };\n\n// Custom status\nreturn { status: 201, body: JSON.stringify(data) };</code></pre>';
}

function getErrorExample(lang: string): string {
  return '<pre><code>// 404\nreturn { status: 404, body: JSON.stringify({\n    error: { code: 404, message: "Not Found" }\n}) };\n\n// 401\nreturn { status: 401, body: JSON.stringify({\n    error: { code: 401, message: "Unauthorized" }\n}) };\n\n// 422 Validation error\nreturn { status: 422, body: JSON.stringify({\n    error: { code: 422, message: "Validation failed", detail: "email is required" }\n}) };</code></pre>';
}

function getDatabaseExample(lang: string, type: string): string {
  if (type === 'connect') return '<pre><code>// SQLite (local dev)\nlet db = Db::connect(&DbConfig {\n    url: "sqlite::memory:".into(),\n    max_connections: 5,\n    min_connections: 1,\n}).await?;\n\n// PostgreSQL (Supabase)\nlet db = Db::connect(&DbConfig {\n    url: "postgres://user:pass@host/db".into(),\n    max_connections: 10,\n    min_connections: 2,\n}).await?;</code></pre>';
  if (type === 'model') return '<pre><code>#[derive(Model, Serialize, Deserialize)]\n#[table(name = "todos")]\nstruct Todo {\n    #[field(primary, auto_increment)]\n    id: i64,\n    title: String,\n    done: i64,\n}</code></pre>';
  if (type === 'crud') return '<pre><code>// Create\nlet todo = Todo { id: 0, title: "Learn Kungfu".into(), done: 0 };\nlet created = todo.insert(&db).await?;\n\n// Read all\nlet todos = Todo::all(&db).await?;\n\n// Read one\nlet todo = Todo::find_by_pk(1, &db).await?;\n\n// Update\nTodo::update_by_pk(&db, 1, vec![("done", json!(1))]).await?;\n\n// Delete\nTodo::delete_by_pk(1, &db).await?;\n\n// Count\nlet count = Todo::count(&db).await?;</code></pre>';
  return '';
}

function getAuthExample(lang: string, type: string): string {
  if (type === 'jwt') return '<pre><code>// Sign a token\nlet jwt = JwtService::new("secret");\nlet token = jwt.sign(&json!({"sub":"user123","exp":9999999999}))?;\n\n// Verify\nlet claims: serde_json::Value = jwt.verify(&token)?;\n\n// Protect routes\n.use_middleware(auth_jwt(JwtConfig::new("secret")))</code></pre>';
  if (type === 'session') return '<pre><code>let store = SessionStore::new();\nlet session_id = store.create("user123", json!({}), 3600);\n\n// In middleware\n.use_middleware(session_auth(Arc::new(store)))</code></pre>';
  if (type === 'rbac') return '<pre><code>// Only admins can access /admin\n.use_middleware(require_role("admin"))\n\n// Multiple roles\n.use_middleware(require_any_role(vec!["admin".into(), "editor".into()]))</code></pre>';
  return '';
}

function getWebSocketExample(lang: string): string {
  if (lang === 'rust') return '<pre><code>use kungfu_core::websocket::{WebSocket, WebSocketMessage};\n\nKungfu::new()\n    .ws("/chat", |mut ws: WebSocket| async move {\n        ws.send_text("Connected!").await;\n        while let Some(msg) = ws.recv().await {\n            match msg {\n                WebSocketMessage::Text(t) => {\n                    ws.send_text(format!("echo: {}", t)).await;\n                }\n                WebSocketMessage::Close => break,\n                _ => {}\n            }\n        }\n    })\n    .run("0.0.0.0:3000")</code></pre>';
  return '<pre><code>// WebSocket support is available via the Rust core.\n// See the Rust tutorial for the full API.</code></pre>';
}

function getCssExample(lang: string): string {
  if (lang === 'rust') return '<pre><code>use kungfu_css::compile_classes;\n\nlet css = compile_classes("flex p-4 text-red-500 hover:bg-blue-200");\n// Returns CSS string with only the used classes</code></pre>';
  return '<pre><code>const { compileCss } = require(\'@kungfu/core\');\n\nconst css = compileCss(\'flex p-4 text-red-500 hover:bg-blue-200\');\n// Returns CSS string with only the used classes</code></pre>';
}
