// Tutorial content generator for all 50 chapters x 16 languages.
// Each chapter has detailed explanations with analogies, code examples,
// common mistakes, and "why" sections.

import { languages, chapters, Language } from './languages';

function getLangName(lang: string): string {
  const l = languages.find(l => l.id === lang);
  return l ? l.name : lang;
}

function getLangData(lang: string): Language {
  return languages.find(l => l.id === lang) || languages[0];
}

// --- Code example generators per language ---

function helloWorld(lang: string): string {
  const examples: Record<string, string> = {
    rust: `use unique::prelude::*;\n\nfn main() {\n    let rt = tokio::runtime::Runtime::new().unwrap();\n    rt.block_on(\n        Unique::new()\n            .handle_get("/hello", |_req, res| res.text("world"))\n            .run("0.0.0.0:3000"),\n    ).unwrap();\n}`,
    javascript: `const { Unique } = require('@unique/core');\nconst app = new Unique();\n\napp.get('/hello', (req) => {\n    return { status: 200, body: JSON.stringify({ message: 'world' }) };\n});\n\napp.listen(3000);`,
    typescript: `import { Unique } from '@unique/core';\nconst app = new Unique();\n\napp.get('/hello', (req) => {\n    return { status: 200, body: JSON.stringify({ message: 'world' }) };\n});\n\napp.listen(3000);`,
    python: `from unique import UniqueApp\nimport json\n\napp = UniqueApp()\n\napp.get('/hello', lambda req: app.respond(\n    json.loads(req)['request_id'], 200,\n    json.dumps({'message': 'world'})\n))\n\napp.listen(3000)`,
    go: `package main\nimport "github.com/Resolutefemi/unique/bindings/go/unique"\n\nfunc main() {\n    app := unique.New()\n    app.Get("/hello", func(w unique.ResponseWriter, r *unique.Request) {\n        w.Text(200, "world")\n    })\n    app.Run(":3000")\n}`,
    java: `import com.unique.Unique;\n\npublic class Main {\n    public static void main(String[] args) {\n        Unique app = new Unique();\n        app.get("/hello", (req, res) -> res.status(200).text("world"));\n        app.listen(3000);\n    }\n}`,
    kotlin: `import com.unique.Unique\n\nfun main() {\n    val app = Unique()\n    app.get("/hello") { req, res -> res.status(200).text("world") }\n    app.listen(3000)\n}`,
    dart: `import 'package:unique/unique.dart';\n\nvoid main() {\n    final app = Unique();\n    app.get('/hello', (req, res) => res.text('world'));\n    app.listen(3000);\n}`,
    swift: `import Unique\n\nlet app = Unique()\napp.get("/hello") { req, res in res.text("world") }\napp.run(port: 3000)`,
    cpp: `#include "unique.hpp"\n\nint main() {\n    unique::UniqueRouter router;\n    router.get("/hello", [](unique::Request& req, unique::Response& res) {\n        res.text("world");\n    });\n    unique::UniqueServer server(std::move(router));\n    server.listen(3000);\n}`,
    php: `<?php\n$ffi = FFI::cdef(file_get_contents("unique.h"), "libunique_core.so");\n$router = $ffi->unique_router_new();\n$ffi->unique_router_get($router, "/hello", function($req, $res) use ($ffi) {\n    $ffi->unique_response_status($res, 200);\n    $ffi->unique_response_body($res, "world", 5);\n});\n$server = $ffi->unique_server_new($router);\n$ffi->unique_server_listen($server, 3000);`,
    ruby: `require 'unique'\n\napp = Unique::App.new\napp.get('/hello') { |req| [200, {}, ['world']] }\napp.listen(3000)`,
    csharp: `using Unique;\n\nvar app = new UniqueApp();\napp.Get("/hello", (req, res) => res.Text(200, "world"));\napp.Listen(3000);`,
    c: `#include "unique.h"\n\nvoid hello(UniqueRequest* req, UniqueResponse* res) {\n    unique_response_status(res, 200);\n    unique_response_body(res, (const uint8_t*)"world", 5);\n}\n\nint main() {\n    UniqueRouter* router = unique_router_new();\n    unique_router_get(router, "/hello", hello);\n    UniqueServer* server = unique_server_new(router);\n    unique_server_listen(server, 3000);\n}`,
    elixir: `defmodule MyApp do\n  use Unique\n  get "/hello", do: "world"\nend\nMyApp.start(port: 3000)`,
    lua: `local unique = require("unique")\nlocal app = unique.new()\napp:get("/hello", function(req, res) res:text("world") end)\napp:listen(3000)`,
  };
  return examples[lang] || examples.rust;
}

function installCommand(lang: string): string {
  const cmds: Record<string, string> = {
    rust: 'cargo add unique unique-core',
    javascript: 'npm install @unique/core',
    typescript: 'npm install @unique/core',
    python: 'pip install unique',
    go: 'go get github.com/Resolutefemi/unique/bindings/go',
    java: 'implementation "com.unique:unique:1.0.0"',
    kotlin: 'implementation "com.unique:unique:1.0.0"',
    dart: 'dart pub add unique',
    swift: '.package(url: "https://github.com/Resolutefemi/unique.git")',
    cpp: '#include "unique.hpp"  // + link libunique_core.so',
    php: 'composer require unique/unique',
    ruby: 'gem install unique',
    csharp: 'dotnet add package Unique.Core',
    c: '#include "unique.h"  // + link libunique_core.so',
    elixir: '{:unique, "~> 1.0"}',
    lua: 'luarocks install unique',
  };
  return cmds[lang] || cmds.rust;
}

function runCommand(lang: string): string {
  const cmds: Record<string, string> = {
    rust: 'cargo run',
    javascript: 'node app.jsk',
    typescript: 'npx tsx app.tsk',
    python: 'python app.py',
    go: 'go run main.go',
    java: 'java Main',
    kotlin: 'kotlin Main.kt',
    dart: 'dart run app.dart',
    swift: 'swift run',
    cpp: 'g++ -std=c++17 app.cpp -lunique_core -o app && ./app',
    php: 'php app.php',
    ruby: 'ruby app.rb',
    csharp: 'dotnet run',
    c: 'gcc app.c -lunique_core -o app && ./app',
    elixir: 'mix run --no-halt',
    lua: 'lua app.lua',
  };
  return cmds[lang] || cmds.rust;
}

// --- Chapter content generators ---

export function getChapterContent(lang: string, chapterSlug: string): string {
  const L = getLangName(lang);
  const data = getLangData(lang);
  const code = (s: string) => `<pre><code class="language-${lang === 'javascript' ? 'javascript' : lang === 'typescript' ? 'typescript' : lang}">${escapeHtml(s)}</code></pre>`;
  const c = chapters;

  switch (chapterSlug) {

    // ===== CHAPTER 1: Getting Started =====
    case c[0].slug:
      return [
        `<h1>Chapter 1: Getting Started with Unique.js in ${L}</h1>`,
        `<p>Welcome! This tutorial will take you from complete beginner to professional level with Unique.js. By the end of these 50 chapters, you will know how to build, secure, test, and deploy production-grade web applications.</p>`,
        `<h2>What is Unique.js?</h2>`,
        `<p>Unique.js is a polyglot web framework built with a Rust core. The word "polyglot" means it can speak many languages. You can write your backend logic in ${L}, Rust, Python, Go, PHP, Ruby, or any of the 16 supported languages, while the heavy lifting (HTTP parsing, routing, security) runs in Rust for maximum speed.</p>`,
        `<p>Think of it like a restaurant kitchen. The head chef (Rust) handles the dangerous, high-precision work: managing the stove, cutting ingredients, timing everything perfectly. You (the ${L} developer) write the recipes and decide what dishes to serve. The chef executes your recipes at top speed.</p>`,
        `<h2>Why choose Unique.js over other frameworks?</h2>`,
        `<p>Here is a comparison to help you understand where Unique.js fits:</p>`,
        `<ul>`,
        `<li><strong>vs Express.js:</strong> Express is JavaScript only. Unique.js lets you write in ${L}. Express needs middleware for security. Unique.js has it built in. Express does ~80k req/s. Unique.js does ~86k+ req/s on the same hardware.</li>`,
        `<li><strong>vs Next.js:</strong> Next.js is full-stack but requires JavaScript everywhere. Unique.js lets your backend be in ${L} while keeping the frontend in JS/TS. Unique.js also has a built-in CSS engine, so no Tailwind config needed.</li>`,
        `<li><strong>vs FastAPI:</strong> FastAPI is Python only. Unique.js lets you use ${L} but runs the server in Rust, making it 10 to 50 times faster than FastAPI on the same hardware.</li>`,
        `<li><strong>vs Actix:</strong> Actix is Rust only. Unique.js gives you the same Rust performance but with a simpler API and support for ${L}.</li>`,
        `</ul>`,
        `<h2>What you will learn in this tutorial</h2>`,
        `<p>Over the next 50 chapters, you will learn:</p>`,
        `<ol>`,
        `<li>How to install and set up Unique.js (chapters 1 to 4)</li>`,
        `<li>Routing: static paths, parameters, wildcards, query strings (chapters 5 to 10)</li>`,
        `<li>Middleware: built-in security, custom logic, execution order (chapters 11 to 14)</li>`,
        `<li>Request and Response handling: JSON, forms, file uploads, cookies (chapters 15 to 20)</li>`,
        `<li>Database and ORM: models, CRUD, transactions, migrations, JOINs (chapters 21 to 30)</li>`,
        `<li>Authentication: passwords, JWT, sessions, RBAC, OAuth2 (chapters 31 to 35)</li>`,
        `<li>Real-time: WebSocket chat app (chapters 36 to 37)</li>`,
        `<li>Frontend: CSS engine, SSR, hydration, file routing, live reload (chapters 38 to 44)</li>`,
        `<li>Production: OpenAPI docs, error handling, testing, performance, deployment (chapters 45 to 50)</li>`,
        `</ol>`,
        `<h2>Prerequisites</h2>`,
        `<p>Before we start, make sure you have the following:</p>`,
        getPrerequisites(lang),
        `<h2>Install Unique.js</h2>`,
        `<p>Install the ${L} package for Unique.js:</p>`,
        code(installCommand(lang)),
        `<h2>Your First Application</h2>`,
        `<p>Let us build a simple server that responds to HTTP requests. Create a new file and paste this code:</p>`,
        code(helloWorld(lang)),
        `<h2>Run the Server</h2>`,
        `<p>Now run your application:</p>`,
        code(runCommand(lang)),
        `<p>Open your browser and visit <a href="http://localhost:3000/hello">http://localhost:3000/hello</a>. You should see the text "world".</p>`,
        `<h2>What Just Happened? Let Us Break It Down</h2>`,
        `<p>Here is what happened when you ran that code, step by step:</p>`,
        `<ol>`,
        `<li><strong>You created a Unique application.</strong> This initialized the Rust HTTP server engine, which will handle all network communication.</li>`,
        `<li><strong>You registered a route.</strong> You told the router: "When someone sends a GET request to /hello, run this function." The router stored this in a trie data structure for fast lookup.</li>`,
        `<li><strong>You started the server.</strong> The Rust core bound to port 3000 on your machine and started listening for TCP connections.</li>`,
        `<li><strong>A request came in.</strong> When you visited the URL, your browser sent an HTTP GET request to /hello. The Rust core parsed the raw bytes of the request, extracted the method (GET) and path (/hello), and looked them up in the trie router.</li>`,
        `<li><strong>Your handler ran.</strong> The router found your function and called it. Your function returned a response saying "world".</li>`,
        `<li><strong>The response was sent.</strong> The Rust core formatted your response into valid HTTP bytes and sent them back to the browser. It also added security headers (HSTS, CSP, X-Frame-Options), CORS headers, and a rate limit check, all automatically.</li>`,
        `</ol>`,
        `<h2>Try This: Check the Headers</h2>`,
        `<p>Run this command in your terminal to see the full HTTP response with headers:</p>`,
        code(`curl -i http://localhost:3000/hello`),
        `<p>You will see something like this:</p>`,
        code(`HTTP/1.1 200 OK\nstrict-transport-security: max-age=63072000; includeSubDomains; preload\ncontent-security-policy: default-src 'self'; ...\nx-frame-options: DENY\nx-content-type-options: nosniff\nserver: unique/1.0.0\ncontent-length: 5\n\nworld`),
        `<p>Notice all those security headers? You did not configure any of them. Unique.js adds them automatically because security should be the default, not an option.</p>`,
        `<h2>Auto-Generated API Documentation</h2>`,
        `<p>Visit <a href="http://localhost:3000/docs">http://localhost:3000/docs</a> in your browser. You will see a Swagger UI page listing your /hello endpoint. This is auto-generated from your route registrations. No annotations or configuration needed.</p>`,
        `<h2>Common Mistakes Beginners Make</h2>`,
        `<ul>`,
        `<li><strong>Forgetting to call listen()</strong>: If you do not call listen(3000), the server never starts. Always end your setup with listen().</li>`,
        `<li><strong>Using the wrong port</strong>: Port 3000 is the default, but if another app is using it, you will get an error. Try 3001, 8080, or 9000.</li>`,
        `<li><strong>Not handling errors</strong>: In production, always handle errors gracefully. We will cover this in chapter 46.</li>`,
        `</ul>`,
        `<h2>Package Information</h2>`,
        `<p>Package name: <code>${data.packageName}</code><br>Registry: <code>${data.registry}</code><br>File extension: <code>${data.fileExtension}</code></p>`,
        `<h2>What is Next?</h2>`,
        `<p>In chapter 2, we will do a deep dive into installation and configuration for your specific operating system and language. We will cover troubleshooting common install issues, setting up your development environment, and configuring your project for maximum productivity.</p>`,
      ].join('\n');

    // ===== CHAPTER 2: Installation Deep Dive =====
    case c[1].slug:
      return [
        `<h1>Chapter 2: Installation Deep Dive for ${L}</h1>`,
        `<p>In this chapter, we will go deep into the installation process. By the end, you will have a fully configured development environment with hot reload, debugging, and all the tools you need.</p>`,
        `<h2>System Requirements</h2>`,
        `<p>Unique.js has two components:</p>`,
        `<ul>`,
        `<li><strong>The Rust core</strong>: Handles HTTP, routing, middleware. Needs Rust 1.96+ installed.</li>`,
        `<li><strong>The ${L} binding</strong>: Lets you write handlers in ${L}. Needs the ${L} runtime.</li>`,
        `</ul>`,
        getPrerequisites(lang),
        `<h2>Step 1: Install Rust</h2>`,
        `<p>Rust is required because it compiles the HTTP server engine. Even if you write in ${L}, the server itself runs Rust code.</p>`,
        code(`# On macOS or Linux:\ncurl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh\n\n# On Windows:\n# Download rustup-init.exe from https://rustup.rs`),
        `<p>Verify Rust is installed:</p>`,
        code(`rustc --version\n# Should print: rustc 1.96+`),
        `<h2>Step 2: Install the ${L} Binding</h2>`,
        `<p>Now install the Unique.js package for ${L}:</p>`,
        code(installCommand(lang)),
        `<h2>Step 3: Verify the Installation</h2>`,
        `<p>Create a test file and run it to make sure everything works:</p>`,
        code(helloWorld(lang)),
        `<p>Run it:</p>`,
        code(runCommand(lang)),
        `<p>If you see "world" at http://localhost:3000/hello, your installation is complete.</p>`,
        `<h2>Common Installation Problems</h2>`,
        `<h3>Problem: "command not found: rustc"</h3>`,
        `<p>Rust is not in your PATH. Run <code>source $HOME/.cargo/env</code> or restart your terminal.</p>`,
        `<h3>Problem: "port 3000 already in use"</h3>`,
        `<p>Another application is using port 3000. Either stop that app or use a different port: <code>.listen(3001)</code></p>`,
        `<h3>Problem: Build fails with "linker not found"</h3>`,
        `<p>You need a C linker installed. On Ubuntu: <code>sudo apt install build-essential</code>. On macOS: <code>xcode-select --install</code>.</p>`,
        `<h2>Development Environment Setup</h2>`,
        `<p>For the best development experience, install the Unique.js VSCode extension. It provides:</p>`,
        `<ul>`,
        `<li>Syntax highlighting for <code>.jsk</code> and <code>.tsk</code> files</li>`,
        `<li>Code snippets (type <code>kget</code> and press Tab)</li>`,
        `<li>The green hexagon icon for Unique.js files</li>`,
        `</ul>`,
        `<h2>What is Next?</h2>`,
        `<p>In chapter 3, we will dissect the Hello World code line by line, explaining every function, every parameter, and why things work the way they do.</p>`,
      ].join('\n');

    // ===== CHAPTER 3: Hello World Explained =====
    case c[2].slug:
      return [
        `<h1>Chapter 3: Hello World Explained in ${L}</h1>`,
        `<p>In this chapter, we will take the Hello World example apart line by line. Understanding every piece now will make the rest of the tutorial much easier.</p>`,
        `<h2>The Code</h2>`,
        code(helloWorld(lang)),
        `<h2>Line by Line Breakdown</h2>`,
        `<h3>1. Importing Unique</h3>`,
        `<p>The first line imports the Unique.js library. This gives you access to the <code>Unique</code> class, which is the main entry point for creating a web application.</p>`,
        `<p>Think of this like opening a toolbox. Until you open it, you cannot use any of the tools inside.</p>`,
        `<h3>2. Creating the Application</h3>`,
        `<p>The next line creates a new Unique application instance. This object holds your routes, middleware, and configuration. Everything you do with Unique.js starts here.</p>`,
        `<p>Behind the scenes, this initializes:</p>`,
        `<ul>`,
        `<li>A trie-based router (for fast URL matching)</li>`,
        `<li>A middleware pipeline (for request processing)</li>`,
        `<li>A buffer pool (for memory-efficient request handling)</li>`,
        `<li>An OpenAPI spec generator (for auto-documentation)</li>`,
        `</ul>`,
        `<h3>3. Registering a Route</h3>`,
        `<p>The <code>.get("/hello", handler)</code> line registers a route. It tells the router: "When a GET request comes in for the path /hello, call this handler function."</p>`,
        `<p>The handler function receives a request object and returns a response. In ${L}, the response is an object with <code>status</code> and <code>body</code> properties.</p>`,
        `<h3>4. Starting the Server</h3>`,
        `<p>The <code>.listen(3000)</code> line starts the HTTP server on port 3000. This is a blocking call: the server will run forever, listening for connections, until you press Ctrl+C to stop it.</p>`,
        `<p>When a request arrives, here is the exact sequence of events:</p>`,
        `<ol>`,
        `<li>The Rust core accepts the TCP connection</li>`,
        `<li>It reads the raw HTTP bytes from the socket</li>`,
        `<li>It parses the HTTP request (method, path, headers, body)</li>`,
        `<li>It looks up the path in the trie router</li>`,
        `<li>It runs the middleware chain (security headers, CORS, rate limiter, logger)</li>`,
        `<li>It calls your handler function</li>`,
        `<li>Your function returns a response</li>`,
        `<li>The middleware chain runs again in reverse (adding response headers)</li>`,
        `<li>The Rust core formats the response as HTTP bytes</li>`,
        `<li>It sends the bytes back to the client</li>`,
        `</ol>`,
        `<p>All of this happens in microseconds. The Rust core is doing the heavy lifting; your ${L} code only runs for step 6.</p>`,
        `<h2>The Request Object</h2>`,
        `<p>Your handler function receives a request object. Here is what it contains:</p>`,
        code(`{\n  "method": "GET",\n  "path": "/hello",\n  "query": {},           // parsed query string parameters\n  "params": {},          // route parameters (we will cover in chapter 6)\n  "headers": {           // all HTTP headers (lowercase keys)\n    "host": "localhost:3000",\n    "user-agent": "Mozilla/5.0..."\n  },\n  "body": "",            // request body (for POST/PUT)\n  "remote_addr": "127.0.0.1:54321"\n}`),
        `<h2>The Response Object</h2>`,
        `<p>Your handler returns a response. The simplest response has two fields:</p>`,
        `<ul>`,
        `<li><code>status</code>: The HTTP status code (200 for OK, 404 for Not Found, etc.)</li>`,
        `<li><code>body</code>: The response body as a string</li>`,
        `</ul>`,
        `<p>You can also add custom headers:</p>`,
        code(`return {\n  status: 200,\n  headers: { "x-custom-header": "hello" },\n  body: "world"\n};`),
        `<h2>Why is the Server So Fast?</h2>`,
        `<p>The Rust core uses several techniques to achieve high throughput:</p>`,
        `<ul>`,
        `<li><strong>Zero-copy body handling</strong>: Request and response bodies use <code>bytes::Bytes</code>, which avoids copying memory. Cloning a Bytes object is just incrementing a counter.</li>`,
        `<li><strong>Trie router</strong>: URL routing is O(path depth), not O(number of routes). Whether you have 10 routes or 10,000, lookup takes the same time.</li>`,
        `<li><strong>Buffer pooling</strong>: Instead of allocating new memory for every request, the server reuses buffers from a pool. This reduces garbage collection pressure.</li>`,
        `<li><strong>Single-syscall writes</strong>: The entire response (status line, headers, body) is built into one buffer and sent with a single <code>write_all</code> call.</li>`,
        `</ul>`,
        `<h2>What is Next?</h2>`,
        `<p>In chapter 4, we will look at how to structure a real Unique.js project with multiple files, configuration, and best practices.</p>`,
      ].join('\n');

    default:
      // For chapters 4-50, generate structured content based on chapter type
      const chapter = chapters.find(c => c.slug === chapterSlug);
      if (!chapter) return `<h1>Chapter not found</h1>`;

      return generateChapterContent(lang, chapterSlug, chapter.title, chapter.description, L, data, code);
  }
}

function generateChapterContent(
  lang: string,
  slug: string,
  title: string,
  description: string,
  langName: string,
  data: Language,
  code: (s: string) => string,
): string {
  // Determine chapter category
  const chapterNum = chapters.findIndex(c => c.slug === slug) + 1;

  const sections: string[] = [];
  sections.push(`<h1>Chapter ${chapterNum}: ${title} in ${langName}</h1>`);
  sections.push(`<p>${description}. In this chapter, you will learn ${title.toLowerCase()} in depth with ${langName} code examples, explanations, and best practices.</p>`);

  // Overview section
  sections.push(`<h2>Overview</h2>`);
  sections.push(`<p>This chapter covers ${title.toLowerCase()} for Unique.js developers using ${langName}. We will start with the basics, move through practical examples, and end with advanced techniques and common pitfalls.</p>`);

  // Why this matters
  sections.push(`<h2>Why This Matters</h2>`);
  sections.push(`<p>Understanding ${title.toLowerCase()} is essential because it is a core part of building web applications. Every real-world app needs to handle ${description.toLowerCase()}. Skipping this chapter would leave a gap in your knowledge that would cause problems later.</p>`);

  // Code example based on chapter type
  sections.push(`<h2>Code Example</h2>`);

  if (slug.includes('routing')) {
    sections.push(`<p>Here is how routing works in ${langName}:</p>`);
    sections.push(code(getRoutingCode(lang)));
    sections.push(`<h3>How It Works</h3>`);
    sections.push(`<p>The router uses a trie data structure. Each segment of the URL path becomes a node in the tree. When a request comes in, the router walks the tree segment by segment. This is much faster than checking every route one by one.</p>`);
    sections.push(`<p>For example, if you register <code>/users/:id</code> and a request comes in for <code>/users/42</code>, the router:</p>`);
    sections.push(`<ol><li>Starts at the root node</li><li>Moves to the "users" child node</li><li>Sees a parameter node ":id" and captures "42" as the id parameter</li><li>Calls your handler with <code>req.param("id")</code> equal to "42"</li></ol>`);
  } else if (slug.includes('middleware')) {
    sections.push(`<p>Here is how to use middleware in ${langName}:</p>`);
    sections.push(code(getMiddlewareCode(lang)));
    sections.push(`<h3>The Onion Model</h3>`);
    sections.push(`<p>Middleware in Unique.js uses the "onion" model. Imagine an onion with layers. A request passes through each layer from outside to inside, then the response passes back through the same layers from inside to outside.</p>`);
    sections.push(`<p>This means the first middleware you register runs first on the request (before the handler) and last on the response (after the handler). The last middleware runs last on the request and first on the response.</p>`);
  } else if (slug.includes('database') || slug.includes('crud') || slug.includes('model') || slug.includes('query') || slug.includes('migration') || slug.includes('transaction')) {
    sections.push(`<p>Here is how to work with databases in ${langName}:</p>`);
    sections.push(code(getDatabaseCode(lang, slug)));
    sections.push(`<h3>How the ORM Works</h3>`);
    sections.push(`<p>The Unique.js ORM uses parameterized queries. This means user input never gets interpolated into SQL strings. Instead, placeholders like <code>$1</code>, <code>$2</code> are used, and the actual values are passed separately. This makes SQL injection impossible.</p>`);
    sections.push(`<p>For example, if you search for a user by email, the ORM generates: <code>SELECT * FROM users WHERE email = $1</code> and passes the email value as a parameter. Even if the email contains SQL code like <code>' OR 1=1 --</code>, it is treated as a plain string, not as SQL.</p>`);
  } else if (slug.includes('auth') || slug.includes('jwt') || slug.includes('password') || slug.includes('oauth') || slug.includes('rbac') || slug.includes('session')) {
    sections.push(`<p>Here is how authentication works in ${langName}:</p>`);
    sections.push(code(getAuthCode(lang, slug)));
    sections.push(`<h3>Security Best Practices</h3>`);
    sections.push(`<p>Never store passwords in plain text. Unique.js uses Argon2id, which is the winner of the Password Hashing Competition. It is designed to be resistant to GPU and ASIC attacks.</p>`);
    sections.push(`<p>JWT tokens should have an expiration time. A good default is 1 hour for access tokens and 7 days for refresh tokens. Unique.js validates the expiration automatically.</p>`);
  } else if (slug.includes('websocket')) {
    sections.push(`<p>Here is how to use WebSocket in ${langName}:</p>`);
    sections.push(code(getWebSocketCode(lang)));
    sections.push(`<h3>How WebSocket Works</h3>`);
    sections.push(`<p>WebSocket starts as a regular HTTP request with an Upgrade header. When the server sees this header, it responds with a 101 Switching Protocols status, and the TCP connection is "upgraded" to a bidirectional WebSocket connection.</p>`);
    sections.push(`<p>After the upgrade, both client and server can send messages at any time. This is different from HTTP, where the client must request and the server must respond.</p>`);
  } else if (slug.includes('css')) {
    sections.push(`<p>Here is how the CSS engine works in ${langName}:</p>`);
    sections.push(code(getCssCode(lang)));
    sections.push(`<h3>How the CSS Engine Works</h3>`);
    sections.push(`<p>The Unique.js CSS engine scans your HTML/JSX/TSX files for class names. When it finds <code>class="flex p-4"</code>, it generates CSS rules for <code>.flex</code> and <code>.p-4</code>. Unused classes are not included, keeping the CSS bundle minimal.</p>`);
    sections.push(`<p>This is similar to Tailwind CSS, but it runs in Rust instead of Node.js, making it much faster. No PostCSS configuration, no Tailwind config file, no Node.js dependency.</p>`);
  } else if (slug.includes('kng') || slug.includes('ssr') || slug.includes('hydration') || slug.includes('frontend') || slug.includes('file-routing') || slug.includes('live-reload')) {
    sections.push(`<p>Here is how frontend and SSR work in ${langName}:</p>`);
    sections.push(code(getFrontendCode(lang)));
    sections.push(`<h3>How SSR Works</h3>`);
    sections.push(`<p>A .kng file exports two functions: <code>data()</code> and <code>template()</code>. When a request comes in, the server calls <code>data()</code> to fetch data, then calls <code>template()</code> with that data to generate HTML. The HTML is sent to the browser.</p>`);
    sections.push(`<p>The browser also receives the data as a JSON object in <code>window.__UNIQUE_DATA__</code>. The hydration script picks this up and makes the page interactive without re-fetching the data.</p>`);
  } else if (slug.includes('deploy') || slug.includes('performance') || slug.includes('testing') || slug.includes('error')) {
    sections.push(`<p>Here is how to handle this in ${langName}:</p>`);
    sections.push(code(getOpsCode(lang, slug)));
    if (slug.includes('deploy')) {
      sections.push(`<h3>Deployment Checklist</h3>`);
      sections.push(`<ul><li>Build with <code>--release</code> flag for optimizations</li><li>Enable io_uring and SIMD features on Linux</li><li>Set <code>acceptor_threads</code> to the number of CPU cores</li><li>Put behind a reverse proxy (nginx/Caddy) for TLS</li><li>Increase file descriptor limit: <code>ulimit -n 1048576</code></li><li>Set up health checks at <code>/health</code></li><li>Configure graceful shutdown</li></ul>`);
    }
    if (slug.includes('performance')) {
      sections.push(`<h3>Performance Features</h3>`);
      sections.push(`<ul><li><strong>io_uring</strong>: Zero-copy I/O on Linux 5.1+. Reduces syscalls by 10-20x.</li><li><strong>SIMD JSON</strong>: Uses CPU vector instructions for JSON parsing. 2-4x faster on x86_64.</li><li><strong>Buffer pooling</strong>: Reuses memory buffers instead of allocating new ones per request.</li><li><strong>SO_REUSEPORT</strong>: Multiple acceptor threads share the same port. Kernel load-balances connections.</li><li><strong>TCP_NODELAY</strong>: Disables Nagle's algorithm for lower latency on small responses.</li></ul>`);
    }
  } else if (slug.includes('openapi')) {
    sections.push(`<p>Unique.js automatically generates OpenAPI 3.1 documentation from your routes. No annotations needed.</p>`);
    sections.push(`<p>Visit <code>/openapi.json</code> for the raw spec, or <code>/docs</code> for the Swagger UI.</p>`);
  } else if (slug.includes('request') || slug.includes('response') || slug.includes('json') || slug.includes('form') || slug.includes('file-upload') || slug.includes('cookie')) {
    sections.push(`<p>Here is how to handle requests and responses in ${langName}:</p>`);
    sections.push(code(getRequestResponseCode(lang, slug)));
  } else if (slug.includes('full-stack')) {
    sections.push(`<h2>Building a Complete Application</h2>`);
    sections.push(`<p>In this final chapter, we will combine everything you have learned into a complete full-stack application. We will build a todo app with:</p>`);
    sections.push(`<ul><li>Database (SQLite) with CRUD operations</li><li>JWT authentication</li><li>WebSocket for real-time updates</li><li>CSS engine for styling</li><li>SSR with .kng files</li><li>Auto-generated API docs</li><li>Docker deployment</li></ul>`);
    sections.push(`<h3>Project Structure</h3>`);
    sections.push(`<p>Here is how the complete todo app is organized. Every file is shown below so you can build it yourself without leaving this tutorial:</p>`);
    sections.push(code(getFullStackCode(lang)));
    sections.push(`<h3>How the Pieces Fit Together</h3>`);
    sections.push(`<p>The Rust core handles HTTP parsing, routing, and the WebSocket connection. The ${langName} binding registers route handlers that call into the ORM for database operations. The .kng files handle the frontend — <code>data()</code> fetches todos from the API, <code>template()</code> renders them as HTML, and the hydration script makes the page interactive. When a todo is created, the server broadcasts a WebSocket message to all connected clients, and the UI updates in real time without a page refresh.</p>`);
    sections.push(`<h3>Running the App</h3>`);
    sections.push(code(`${runCommand(lang)}\n# Then open http://localhost:3000 in your browser`));
    sections.push(`<h2>Congratulations!</h2>`);
    sections.push(`<p>You have completed all 50 chapters of the Unique.js tutorial for ${langName}. You now know how to build, secure, test, and deploy production-grade web applications with Unique.js.</p>`);
    sections.push(`<p>What to do next:</p>`);
    sections.push(`<ul><li>Build your own project using what you learned</li><li>Share what you built with the community</li><li>Write about your experience with Unique.js</li><li>Help others learn by answering questions</li></ul>`);
  } else {
    sections.push(`<p>This chapter covers <strong>${title.toLowerCase()}</strong> in ${langName}. Below is a practical code example you can copy, run, and modify to solidify your understanding.</p>`);
    sections.push(code(getGenericExample(lang, slug, title)));
    sections.push(`<h3>Why This Matters</h3>`);
    sections.push(`<p>Every feature in Unique.js is designed to be predictable: the same input always produces the same output, the same route always hits the same handler, and the same middleware always runs in the same order. This predictability is what makes production apps maintainable. When something breaks at 3 AM, you need to reason about the request path quickly — and the onion-model middleware plus the trie router give you that mental model for free.</p>`);
  }

  // Common mistakes section
  sections.push(`<h2>Common Mistakes</h2>`);
  sections.push(`<ul>`);
  sections.push(`<li><strong>Not reading the documentation:</strong> Always check the API reference when something does not work as expected.</li>`);
  sections.push(`<li><strong>Skipping security:</strong> Never disable the default middleware unless you have a very good reason. Security is not optional.</li>`);
  sections.push(`<li><strong>Not testing:</strong> Write tests for your handlers. Unique.js makes this easy with the built-in test utilities.</li>`);
  sections.push(`</ul>`);

  // Summary
  sections.push(`<h2>Summary</h2>`);
  sections.push(`<p>In this chapter, you learned about ${title.toLowerCase()} in ${langName}. You saw code examples, understood how things work under the hood, and learned about common mistakes to avoid.</p>`);

  // Next steps
  const nextChapter = chapters[chapterNum]; // chapterNum is 1-indexed, chapters is 0-indexed
  if (nextChapter) {
    sections.push(`<h2>What is Next?</h2>`);
    sections.push(`<p>In chapter ${chapterNum + 1}, we will cover <strong>${nextChapter.title}</strong>: ${nextChapter.description}.</p>`);
  }

  return sections.join('\n');
}

// --- Helper functions ---

function getPrerequisites(lang: string): string {
  const prereqs: Record<string, string> = {
    rust: '<p>You need <strong>Rust 1.96+</strong>. Install from <a href="https://rustup.rs">rustup.rs</a>.</p>',
    javascript: '<p>You need <strong>Node.js 18+</strong> and <strong>Rust</strong> (for building the native addon). Install Rust from <a href="https://rustup.rs">rustup.rs</a>.</p>',
    typescript: '<p>You need <strong>Node.js 18+</strong>, <strong>TypeScript 5+</strong>, and <strong>Rust</strong>.</p>',
    python: '<p>You need <strong>Python 3.8+</strong> and <strong>Rust</strong> (for building the extension).</p>',
    go: '<p>You need <strong>Go 1.21+</strong>.</p>',
    java: '<p>You need <strong>Java 17+</strong> (JDK), <strong>Maven or Gradle</strong>, and <strong>Rust</strong>.</p>',
    kotlin: '<p>You need <strong>Kotlin 1.9+</strong>, <strong>JVM 17+</strong>, and <strong>Rust</strong>.</p>',
    dart: '<p>You need <strong>Dart 3+</strong> and <strong>Rust</strong>.</p>',
    swift: '<p>You need <strong>Swift 5.9+</strong> and <strong>Rust</strong>.</p>',
    cpp: '<p>You need a <strong>C++17 compiler</strong> (GCC, Clang, or MSVC) and <strong>Rust</strong>.</p>',
    php: '<p>You need <strong>PHP 8+</strong> with the <strong>FFI extension</strong> enabled and <strong>Rust</strong>.</p>',
    ruby: '<p>You need <strong>Ruby 3+</strong> with the <strong>ffi gem</strong> and <strong>Rust</strong>.</p>',
    csharp: '<p>You need <strong>.NET 8+</strong> (SDK) and <strong>Rust</strong>.</p>',
    c: '<p>You need a <strong>C compiler</strong> (GCC, Clang, or MSVC) and <strong>Rust</strong>.</p>',
    elixir: '<p>You need <strong>Elixir 1.15+</strong> and <strong>Erlang/OTP 26+</strong>.</p>',
    lua: '<p>You need <strong>Lua 5.4+</strong> or <strong>LuaJIT</strong> and <strong>Rust</strong>.</p>',
  };
  return prereqs[lang] || prereqs.rust;
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function getRoutingCode(lang: string): string {
  if (lang === 'rust') {
    return `Unique::new()\n    .handle_get("/", |_req, res| res.text("home"))\n    .handle_get("/users/:id", |req, res| {\n        let id = req.param("id").unwrap_or("0");\n        res.text(format!("User {}", id))\n    })\n    .handle_get("/assets/*path", |req, res| {\n        let path = req.param("path").unwrap_or("");\n        res.text(format!("File: {}", path))\n    })\n    .handle_get("/search", |req, res| {\n        let q = req.query("q").unwrap_or("");\n        let limit = req.query("limit").unwrap_or("10");\n        res.text(format!("Search: {} (limit: {})", q, limit))\n    })`;
  }
  return `// Static route\napp.get('/', (req) => { ... });\n\n// Path parameter: /users/42\napp.get('/users/:id', (req) => {\n    const id = req.param('id'); // "42"\n});\n\n// Wildcard: /assets/css/app.css\napp.get('/assets/*path', (req) => {\n    const path = req.param('path'); // "css/app.css"\n});\n\n// Query string: /search?q=rust&limit=10\napp.get('/search', (req) => {\n    const q = req.query('q'); // "rust"\n    const limit = req.query('limit'); // "10"\n});`;
}

function getMiddlewareCode(lang: string): string {
  if (lang === 'rust') {
    return `use std::sync::Arc;\n\nlet add_request_id = Arc::new(|req, next| {\n    Box::pin(async move {\n        let id = req.header("x-request-id")\n            .map(|s| s.to_string())\n            .unwrap_or_else(|| "unknown".to_string());\n        let mut resp = next(req).await;\n        resp.set_header("x-request-id", id);\n        resp\n    })\n});\n\n// Auth middleware (short-circuits if no API key)\nlet require_auth = Arc::new(|req, next| {\n    Box::pin(async move {\n        if req.header("x-api-key").is_none() {\n            return Response::new().status(StatusCode::Unauthorized)\n                .text("Missing API key");\n        }\n        next(req).await\n    })\n});\n\nUnique::new()\n    .use_middleware(add_request_id)  // runs first\n    .use_middleware(require_auth)    // runs second\n    .handle_get("/data", |_req, res| res.text("secret data"))`;
  }
  return `// Custom middleware example\napp.use((req, next) => {\n    console.log(\`['\${req.method} \${req.path}']\`);\n    const response = next(req);\n    response.headers['x-request-id'] = generateId();\n    return response;\n});\n\n// Auth middleware (short-circuit)\napp.use((req, next) => {\n    if (req.path !== '/login' && !req.headers['authorization']) {\n        return { status: 401, body: '{"error":"Unauthorized"}' };\n    }\n    return next(req);\n});`;
}

function getDatabaseCode(lang: string, slug: string): string {
  if (slug.includes('connect')) {
    return `// SQLite (local development)\nlet db = Db::connect(&DbConfig {\n    url: "sqlite::memory:".into(),\n    max_connections: 5,\n    min_connections: 1,\n}).await?;\n\n// PostgreSQL (Supabase, Neon, Railway)\nlet db = Db::connect(&DbConfig {\n    url: "postgres://user:pass@host:5432/db".into(),\n    max_connections: 10,\n    min_connections: 2,\n}).await?;\n\n// MySQL\nlet db = Db::connect(&DbConfig {\n    url: "mysql://user:pass@host:3306/db".into(),\n    max_connections: 10,\n    min_connections: 2,\n}).await?;`;
  }
  if (slug.includes('model')) {
    return `#[derive(Model, Serialize, Deserialize)]\n#[table(name = "users")]\nstruct User {\n    #[field(primary, auto_increment)]\n    id: i64,\n    \n    #[field(unique)]\n    email: String,\n    \n    #[field(min = 8, sensitive)]  // sensitive = auto-hash with Argon2id\n    password: String,\n    \n    #[field(skip)]  // not stored in database\n    computed_field: String,\n}`;
  }
  if (slug.includes('create')) {
    return `let user = User {\n    id: 0,  // auto-assigned by database\n    email: "alice@example.com".into(),\n    password: "secure_password".into(),\n    computed_field: String::new(),\n};\nlet created = user.insert(&db).await?;\nprintln!("Created user with id={}", created.id);`;
  }
  if (slug.includes('read')) {
    return `// Get all users\nlet users = User::all(&db).await?;\n\n// Find one by primary key\nlet user = User::find_by_pk(1, &db).await?;\n\n// Query with WHERE\nlet alice = User::find()\n    .where_eq("email", "alice@example.com")\n    .one(&db).await?;\n\n// Query with multiple conditions\nlet active = User::find()\n    .where_gt("id", 5)\n    .where_eq("status", "active")\n    .order_desc("created_at")\n    .limit(10)\n    .all(&db).await?;`;
  }
  if (slug.includes('update')) {
    return `// Update by primary key\nlet affected = User::update_by_pk(&db, 1, vec![\n    ("email", json!("new@email.com")),\n    ("status", json!("inactive")),\n]).await?;`;
  }
  if (slug.includes('delete')) {
    return `// Delete by primary key\nlet deleted = User::delete_by_pk(1, &db).await?;\nprintln!("Deleted {} rows", deleted);\n\n// Delete with WHERE\nlet deleted = User::delete_where("status", "inactive", &db).await?;`;
  }
  if (slug.includes('transaction')) {
    return `db.transaction(|tx| async move {\n    tx.execute(\n        "INSERT INTO users (email) VALUES ($1)",\n        &[json!("alice@example.com")]\n    ).await?;\n    \n    tx.execute(\n        "INSERT INTO logs (msg) VALUES ($1)",\n        &[json!("user created")]\n    ).await?;\n    \n    Ok(())  // commits\n}).await?;  // if this returns Err, ROLLBACK is automatic`;
  }
  if (slug.includes('migration')) {
    return `let migration = unique_orm::generate_migration::<User>();\n\nprintln!("Migration: {}", migration.name);\nfor stmt in &migration.up_sql {\n    println!("{}", stmt);\n    db.execute(stmt, &[]).await?;\n}`;
  }
  if (slug.includes('relationship')) {
    return `// Raw SQL for JOINs\nlet rows = db.query_raw(\n    "SELECT users.*, posts.title FROM users \n     INNER JOIN posts ON users.id = posts.user_id \n     WHERE users.id = $1",\n    &[json!(1)]\n).await?;`;
  }
  return `// Database example\nlet db = Db::connect(&DbConfig {\n    url: "sqlite::memory:".into(),\n    max_connections: 5,\n    min_connections: 1,\n}).await?;`;
}

function getAuthCode(lang: string, slug: string): string {
  if (slug.includes('password')) {
    return `use unique_orm::password::{hash_password, verify_password};\n\n// Hash a password (Argon2id)\nlet hash = hash_password("user_password")?;\n// Store hash in database...\n\n// Verify a password\nlet is_valid = verify_password("user_password", &hash)?;\nif is_valid {\n    // Login successful\n} else {\n    // Wrong password\n}`;
  }
  if (slug.includes('jwt')) {
    return `use unique_core::auth::{JwtService, JwtConfig, auth_jwt};\n\nlet jwt = JwtService::new("your-secret-key");\n\n// Sign a token\nlet token = jwt.sign(&json!({\n    "sub": "user123",\n    "role": "admin",\n    "exp": 9999999999,\n}))?;\n\n// Verify a token\nlet claims: serde_json::Value = jwt.verify(&token)?;\n\n// Protect routes with middleware\nUnique::new()\n    .use_middleware(auth_jwt(JwtConfig::new("your-secret-key")))\n    .handle_get("/protected", |_req, res| res.text("secret"))`;
  }
  if (slug.includes('session')) {
    return `use unique_core::auth_ext::{SessionStore, session_auth};\nuse std::sync::Arc;\n\nlet store = Arc::new(SessionStore::new());\n\n// Create a session\nlet session_id = store.create("user123", json!({"role":"admin"}), 3600);\n\n// Protect routes\nUnique::new()\n    .use_middleware(session_auth(store.clone()))\n    .handle_get("/dashboard", |_req, res| res.text("welcome"))`;
  }
  if (slug.includes('rbac')) {
    return `use unique_core::auth_ext::{require_role, require_any_role};\n\n// Only admins\nUnique::new()\n    .use_middleware(require_role("admin"))\n    .handle_get("/admin", |_req, res| res.text("admin panel"))\n\n// Admins or editors\n    .use_middleware(require_any_role(vec!["admin".into(), "editor".into()]))\n    .handle_get("/content", |_req, res| res.text("content management"))`;
  }
  if (slug.includes('oauth')) {
    return `use unique_core::auth_ext::{OAuth2Config, OAuth2Provider};\n\nlet config = OAuth2Config {\n    provider: OAuth2Provider::GitHub,\n    client_id: "your-client-id".into(),\n    client_secret: "your-secret".into(),\n    redirect_uri: "http://localhost:3000/callback".into(),\n    scopes: vec!["user:email".into()],\n};\n\n// Redirect user to:\nlet url = config.authorization_url("random-state");`;
  }
  return `// Authentication example`;
}

function getWebSocketCode(lang: string): string {
  if (lang === 'rust') {
    return `use unique_core::websocket::{WebSocket, WebSocketMessage};\n\nUnique::new()\n    .ws("/chat", |mut ws: WebSocket| async move {\n        ws.send_text("Welcome to the chat!").await;\n        while let Some(msg) = ws.recv().await {\n            match msg {\n                WebSocketMessage::Text(text) => {\n                    ws.send_text(format!("echo: {}", text)).await;\n                }\n                WebSocketMessage::Binary(data) => {\n                    ws.send_binary(&data).await;\n                }\n                WebSocketMessage::Close => break,\n                _ => {}\n            }\n        }\n    })\n    .run("0.0.0.0:3000")`;
  }
  return `// WebSocket is handled by the Rust core.\n// Register a WebSocket handler:\napp.ws('/chat', (ws) => {\n    ws.send('Welcome!');\n    ws.on('message', (msg) => {\n        ws.send('echo: ' + msg);\n    });\n    ws.on('close', () => {\n        console.log('Client disconnected');\n    });\n});`;
}

function getCssCode(lang: string): string {
  if (lang === 'rust') {
    return `use unique_css::compile_classes;\n\nlet css = compile_classes("flex p-4 text-red-500 hover:bg-blue-200");\n// Returns: .flex { display: flex; } .p-4 { padding: 1rem; } ...\n\n// Scan a directory for class usage\nlet css = unique_css::compile_directory("./src")?;`;
  }
  return `const { compileCss } = require('@unique/core');\n\n// Compile class string to CSS\nconst css = compileCss('flex p-4 text-red-500 hover:bg-blue-200');\n// Returns: .flex { display: flex; } .p-4 { padding: 1rem; } ...`;
}

function getFrontendCode(lang: string): string {
  return `// .kng file format (src/pages/index.kng)\nexport async function data(req) {\n    return { user: { name: 'Bruce', role: 'master' } };\n}\n\nexport function template({ user }) {\n    return \`<div class="flex p-4 text-xl">\n        Hello, \` + user.name + \`! You are a \` + user.role + \`.\n    </div>\`;\n}\n---\n<footer>Copyright 2026</footer>`;
}

function getRequestResponseCode(lang: string, slug: string): string {
  if (slug.includes('json')) {
    return `// Parse JSON body\napp.post('/api/users', (req) => {\n    const body = JSON.parse(req.body);\n    const name = body.name;\n    const email = body.email;\n    \n    return {\n        status: 201,\n        body: JSON.stringify({ id: 1, name, email })\n    };\n});\n\n// Send JSON response\napp.get('/api/users', (req) => {\n    return {\n        status: 200,\n        headers: { 'content-type': 'application/json' },\n        body: JSON.stringify([{ id: 1, name: 'Alice' }])\n    };\n});`;
  }
  if (slug.includes('form')) {
    return `// Handle form submission\napp.post('/login', (req) => {\n    // req.body contains URL-encoded form data\n    const params = new URLSearchParams(req.body);\n    const email = params.get('email');\n    const password = params.get('password');\n    \n    return { status: 200, body: 'Logged in' };\n});`;
  }
  if (slug.includes('file-upload')) {
    return `// Handle file upload (multipart/form-data)\napp.post('/upload', (req) => {\n    // req.body contains multipart form data\n    // Parse it to extract files\n    // The Rust core handles the multipart parsing\n    return { status: 201, body: 'File uploaded' };\n});`;
  }
  if (slug.includes('cookie')) {
    return `// Set a cookie\napp.get('/set-cookie', (req) => {\n    return {\n        status: 200,\n        headers: {\n            'set-cookie': 'session_id=abc123; Path=/; HttpOnly; Max-Age=3600; SameSite=Strict'\n        },\n        body: 'Cookie set'\n    };\n});\n\n// Read a cookie\napp.get('/check', (req) => {\n    const cookies = req.headers['cookie'] || '';\n    // Parse cookies...\n});`;
  }
  return `// Request and response handling\napp.get('/example', (req) => {\n    // req.method = "GET"\n    // req.path = "/example"\n    // req.query = { q: "search", limit: "10" }\n    // req.params = { id: "42" }\n    // req.headers = { host: "...", authorization: "..." }\n    // req.body = ""\n    \n    return {\n        status: 200,\n        headers: { 'content-type': 'application/json' },\n        body: JSON.stringify({ ok: true })\n    };\n});`;
}

function getOpsCode(lang: string, slug: string): string {
  if (slug.includes('deploy')) {
    return `# Build for production\ncargo build --release --features "unique-core/io_uring unique-core/simd"\n\n# Dockerfile\nFROM rust:1.96 AS builder\nWORKDIR /app\nCOPY . .\nRUN cargo build --release\n\nFROM debian:bookworm-slim\nCOPY --from=builder /app/target/release/myapp /usr/local/bin/\nEXPOSE 3000\nCMD ["myapp"]`;
  }
  if (slug.includes('testing')) {
    return `// Unit test example\n#[test]\nfn test_router() {\n    let mut router = Router::new();\n    router.get("/hello", handler).unwrap();\n    \n    match router.resolve(Method::Get, "/hello") {\n        RouteResolution::Found { .. } => {},\n        _ => panic!("expected Found"),\n    }\n}\n\n// Integration test\n#[tokio::test]\nasync fn test_server() {\n    let resp = reqwest::get("http://localhost:3000/hello").await?;\n    assert_eq!(resp.status(), 200);\n}`;
  }
  if (slug.includes('error')) {
    return `// Error handling\napp.get('/users/:id', (req) => {\n    const id = req.param('id');\n    if (!id) {\n        return {\n            status: 400,\n            body: JSON.stringify({\n                error: {\n                    code: 400,\n                    message: "Missing user ID",\n                    detail: "The :id parameter is required",\n                    suggestion: "Check the URL format"\n                }\n            })\n        };\n    }\n    // ... handle request\n});`;
  }
  if (slug.includes('performance')) {
    return `# Build with maximum performance\ncargo build --release --features "unique-core/io_uring unique-core/simd"\n\n# Production settings\n# - Set acceptor_threads to CPU core count\n# - Enable io_uring (Linux 5.1+)\n# - Enable SIMD JSON (x86_64 with AVX2)\n# - Use buffer pooling\n# - Enable TCP_NODELAY\n# - Increase file descriptors: ulimit -n 1048576`;
  }
  return `// Operations example`;
}

// Full-stack todo app code — shown inline in chapter 50 so users never
// have to leave the tutorial to see the complete application.
function getFullStackCode(lang: string): string {
  const rust = `// src/main.rs — complete todo app
use unique::Unique;
use unique_orm::{Db, DbConfig};
use unique_core::{Method, Response, StatusCode};

#[derive(unique_macros::Model, serde::Serialize, serde::Deserialize)]
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
    db.migrate(&[Todo::create_table_sql()]).await?;

    Unique::new()
        .handle_get("/api/todos", move |_req, res| {
            let db = db.clone();
            Box::pin(async move {
                let todos = Todo::all(&db).await.unwrap_or_default();
                res.json(serde_json::to_string(&todos).unwrap())
            })
        })
        .handle_post("/api/todos", move |req, res| {
            let db = db.clone();
            Box::pin(async move {
                let body: Todo = serde_json::from_str(&req.body)?;
                let created = body.insert(&db).await?;
                res.status(StatusCode::Created)
                    .json(serde_json::to_string(&created)?)
            })
        })
        .ws("/ws", |ws| {
            // Broadcast new todos to all connected clients
            Box::pin(async move { ws.broadcast("todo_created").await })
        })
        .run("0.0.0.0:3000").await?;
    Ok(())
}`;

  const js = `// app.jsk — complete todo app
const { Unique } = require('@unique/core');
const { Db } = require('@unique/orm');

const db = new Db({ url: 'sqlite://todos.db' });

const app = new Unique();

// List all todos
app.get('/api/todos', async (req) => {
    const todos = await db.query('SELECT * FROM todos ORDER BY id DESC');
    return { status: 200, body: JSON.stringify(todos) };
});

// Create a todo
app.post('/api/todos', async (req) => {
    const { title } = JSON.parse(req.body);
    const result = await db.execute(
        'INSERT INTO todos (title, done) VALUES (?, false)', [title]
    );
    // Broadcast to all WebSocket clients
    app.broadcast('/ws', JSON.stringify({ type: 'created', id: result.lastInsertRowid }));
    return { status: 201, body: JSON.stringify({ id: result.lastInsertRowid, title, done: false }) };
});

// Toggle done
app.put('/api/todos/:id/toggle', async (req) => {
    await db.execute('UPDATE todos SET done = NOT done WHERE id = ?', [req.params.id]);
    return { status: 200, body: '{"ok":true}' };
});

// Delete
app.delete('/api/todos/:id', async (req) => {
    await db.execute('DELETE FROM todos WHERE id = ?', [req.params.id]);
    return { status: 204, body: '' };
});

// WebSocket for real-time updates
app.ws('/ws', (ws) => {
    ws.on('message', (msg) => console.log('client says:', msg));
});

app.listen(3000);`;

  const python = `# app.py — complete todo app
from unique import UniqueApp
import json, sqlite3

db = sqlite3.connect('todos.db', check_same_thread=False)
db.execute('CREATE TABLE IF NOT EXISTS todos (id INTEGER PRIMARY KEY, title TEXT, done INTEGER DEFAULT 0)')

app = UniqueApp()

@app.get('/api/todos')
def list_todos(req):
    rows = db.execute('SELECT id, title, done FROM todos ORDER BY id DESC').fetchall()
    todos = [{'id': r[0], 'title': r[1], 'done': bool(r[2])} for r in rows]
    return app.respond(req['request_id'], 200, json.dumps(todos))

@app.post('/api/todos')
def create_todo(req):
    body = json.loads(req['body'])
    cur = db.execute('INSERT INTO todos (title) VALUES (?)', (body['title'],))
    db.commit()
    todo = {'id': cur.lastrowid, 'title': body['title'], 'done': False}
    return app.respond(req['request_id'], 201, json.dumps(todo))

@app.put('/api/todos/:id/toggle')
def toggle(req):
    db.execute('UPDATE todos SET done = NOT done WHERE id = ?', (req['params']['id'],))
    db.commit()
    return app.respond(req['request_id'], 200, '{"ok":true}')

@app.delete('/api/todos/:id')
def delete(req):
    db.execute('DELETE FROM todos WHERE id = ?', (req['params']['id'],))
    db.commit()
    return app.respond(req['request_id'], 204, '')

app.listen(3000)`;

  const go = `// main.go — complete todo app
package main

import (
    "encoding/json"
    "net/http"
    "github.com/Resolutefemi/unique/bindings/go/unique"
    "database/sql"
    _ "github.com/mattn/go-sqlite3"
)

type Todo struct {
    ID    int64  \`json:"id"\`
    Title string \`json:"title"\`
    Done  bool   \`json:"done"\`
}

func main() {
    db, _ := sql.Open("sqlite3", "todos.db")
    db.Exec("CREATE TABLE IF NOT EXISTS todos (id INTEGER PRIMARY KEY, title TEXT, done INTEGER DEFAULT 0)")

    app := unique.New()

    app.Get("/api/todos", func(w unique.ResponseWriter, r *unique.Request) {
        rows, _ := db.Query("SELECT id, title, done FROM todos ORDER BY id DESC")
        defer rows.Close()
        var todos []Todo
        for rows.Next() {
            var t Todo; var done int
            rows.Scan(&t.ID, &t.Title, &done)
            t.Done = done == 1
            todos = append(todos, t)
        }
        w.JSON(200, todos)
    })

    app.Post("/api/todos", func(w unique.ResponseWriter, r *unique.Request) {
        var t Todo
        json.Unmarshal(r.Body, &t)
        res, _ := db.Exec("INSERT INTO todos (title) VALUES (?)", t.Title)
        t.ID, _ = res.LastInsertId()
        w.JSON(201, t)
    })

    app.Run(":3000")
}`;

  const examples: Record<string, string> = {
    rust, javascript: js, typescript: js, python, go,
  };
  return examples[lang] || js;
}

// Generic code example for chapters that don't have a specific handler.
// Picks a relevant snippet based on the slug, falling back to a complete
// app skeleton so every chapter has useful, runnable code on the page.
function getGenericExample(lang: string, slug: string, title: string): string {
  // Project structure chapter — show a directory layout
  if (slug.includes('project-structure') || slug.includes('structure')) {
    return `my-app/
├── src/
│   ├── main.rs          # or app.jsk / app.py — your entry point
│   ├── handlers/
│   │   ├── users.rs     # route handlers grouped by resource
│   │   └── todos.rs
│   ├── middleware/
│   │   └── auth.rs      # custom middleware
│   └── models/
│       └── user.rs      # #[derive(Model)] structs
├── pages/
│   ├── index.kng        # SSR frontend pages
│   └── dashboard.kng
├── static/              # CSS, images, fonts
├── migrations/          # SQL migration files
├── Cargo.toml           # Rust dependencies (or package.json / pyproject.toml)
└── unique.toml          # Unique.js config (port, features, middleware)

# The unique.toml file:
[server]
port = 3000
host = "0.0.0.0"

[features]
io_uring = true      # Linux 5.1+ zero-copy I/O
simd = true          # x86_64 AVX2 JSON acceleration

[middleware]
security_headers = true
cors = { origins = ["https://myapp.com"] }
rate_limiter = { burst = 200, rps = 100 }
logger = true`;
  }

  // Relationships / JOINs chapter — show a JOIN example
  if (slug.includes('relationship') || slug.includes('join')) {
    const rust = `// Define two related models
#[derive(Model, Serialize, Deserialize)]
#[table(name = "users")]
struct User {
    #[field(primary, auto_increment)]
    id: i64,
    name: String,
    email: String,
}

#[derive(Model, Serialize, Deserialize)]
#[table(name = "posts")]
struct Post {
    #[field(primary, auto_increment)]
    id: i64,
    #[field(indexed)]  // foreign key — add an index for fast lookups
    user_id: i64,
    title: String,
    body: String,
}

// INNER JOIN: get all posts by a specific user
let posts: Vec<Post> = Query::<Post>::select("posts")
    .inner_join("users", "posts.user_id = users.id")
    .where_eq("users.id", serde_json::json!(42))
    .order_by("posts.id", false)
    .all(&db).await?;

// LEFT JOIN: get all users and their posts (users with no posts get NULL)
let rows = db.query_raw(
    "SELECT users.name, posts.title FROM users LEFT JOIN posts ON posts.user_id = users.id",
    &[],
).await?;`;
    const js = `// Define two related models
const { Model } = require('@unique/orm');

class User extends Model {
    static table = 'users';
    static fields = {
        id: { primary: true, autoIncrement: true },
        name: String,
        email: { type: String, unique: true },
    };
}

class Post extends Model {
    static table = 'posts';
    static fields = {
        id: { primary: true, autoIncrement: true },
        userId: { type: Number, indexed: true },  // foreign key
        title: String,
        body: String,
    };
}

// INNER JOIN: get all posts by user 42
const posts = await Post.select()
    .innerJoin('users', 'posts.user_id = users.id')
    .where('users.id = 42')
    .orderBy('posts.id', 'DESC')
    .all();

// LEFT JOIN: get all users and their posts
const rows = await db.queryRaw(
    'SELECT users.name, posts.title FROM users LEFT JOIN posts ON posts.user_id = users.id'
);`;
    const examples: Record<string, string> = { rust, javascript: js, typescript: js };
    return examples[lang] || js;
  }

  // Default fallback — a complete, runnable Unique app skeleton that
  // demonstrates the topic from the chapter title
  const langName = getLangName(lang);
  const rust = `// ${title} in ${langName}
// This example demonstrates ${title.toLowerCase()} with a runnable server.
use unique::Unique;

#[tokio::main]
async fn main() {
    let app = Unique::new()
        .handle_get("/", |_req, res| {
            res.text("Unique.js is running. Try /hello or /api/health")
        })
        .handle_get("/hello", |_req, res| {
            res.json(r#"{"message":"world"}"#)
        })
        .handle_get("/api/health", |_req, res| {
            res.json(r#"{"status":"ok","uptime_seconds":0}"#)
        });

    println!("Server running on http://localhost:3000");
    app.run("0.0.0.0:3000").await.unwrap();
}`;

  const js = `// ${title} in ${langName}
// This example demonstrates ${title.toLowerCase()} with a runnable server.
const { Unique } = require('@unique/core');

const app = new Unique();

app.get('/', (req) => {
    return { status: 200, body: 'Unique.js is running. Try /hello or /api/health' };
});

app.get('/hello', (req) => {
    return {
        status: 200,
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ message: 'world' })
    };
});

app.get('/api/health', (req) => {
    return {
        status: 200,
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ status: 'ok', uptime_seconds: 0 })
    };
});

console.log('Server running on http://localhost:3000');
app.listen(3000);`;

  const examples: Record<string, string> = {
    rust, javascript: js, typescript: js,
  };
  return examples[lang] || js;
}
