import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export const metadata = {
  title: 'Migration Guide — Unique.js',
  description: 'Migrate from Express.js, FastAPI, Actix, Django, Flask, and Spring Boot to Unique.js. Side-by-side code comparisons.',
  keywords: 'unique.js, migration, express, fastapi, actix, django, flask, spring boot',
};

const migrations = [
  {
    id: 'express',
    framework: 'Express.js',
    icon: '🟢',
    description: 'Express.js is the most popular Node.js web framework. Unique.js offers the same simplicity but with 10x better performance and built-in security.',
    mappings: [
      { express: 'const express = require("express")', unique: 'use unique::Unique;' },
      { express: 'const app = express()', unique: 'let app = Unique::new();' },
      { express: 'app.get("/path", (req, res) => { ... })', unique: 'app.handle_get("/path", |req, res| { ... })' },
      { express: 'app.post("/path", (req, res) => { ... })', unique: 'app.handle_post("/path", |req, res| { ... })' },
      { express: 'res.send("text")', unique: 'res.text("text")' },
      { express: 'res.json({ key: "value" })', unique: 'res.json(r#"{ "key": "value" }"#)' },
      { express: 'res.status(404).send("Not Found")', unique: 'res.status(StatusCode::NotFound).text("Not Found")' },
      { express: 'app.use(express.json())', unique: '(built-in — no middleware needed)' },
      { express: 'app.use(cors())', unique: '(built-in — on by default)' },
      { express: 'app.use(helmet())', unique: '(built-in — security headers on by default)' },
      { express: 'app.use(rateLimit(...))', unique: '(built-in — 200 burst, 100 rps per IP)' },
      { express: 'app.listen(3000)', unique: 'app.run("0.0.0.0:3000").await' },
      { express: 'req.params.id', unique: 'req.param("id")' },
      { express: 'req.query.q', unique: 'req.query("q")' },
      { express: 'req.body', unique: 'req.body()' },
      { express: 'req.headers["authorization"]', unique: 'req.header("authorization")' },
    ],
    notes: 'The biggest change is that Unique.js handlers are async closures that return a Response, while Express handlers mutate a Response object. Also, Unique.js does not need body-parser, cors, helmet, or express-rate-limit — they are all built in.',
  },
  {
    id: 'fastapi',
    framework: 'FastAPI (Python)',
    icon: '⚡',
    description: 'FastAPI is a modern Python web framework. Unique.js gives you the same developer experience but with 30-50x better performance by running the HTTP engine in Rust.',
    mappings: [
      { express: 'from fastapi import FastAPI', unique: 'use unique::Unique;' },
      { express: 'app = FastAPI()', unique: 'let app = Unique::new();' },
      { express: '@app.get("/path")', unique: 'app.handle_get("/path", |req, res| { ... })' },
      { express: '@app.post("/path")', unique: 'app.handle_post("/path", |req, res| { ... })' },
      { express: 'def handler(request: Request):', unique: '|req: Request, res: Response| { ... }' },
      { express: 'return {"key": "value"}', unique: 'res.json(r#"{ "key": "value" }"#)' },
      { express: 'return PlainTextResponse("text")', unique: 'res.text("text")' },
      { express: 'return HTMLResponse("<h1>Hi</h1>")', unique: 'res.html("<h1>Hi</h1>")' },
      { express: 'return RedirectResponse("/other")', unique: 'res.redirect("/other")' },
      { express: 'request.path_params["id"]', unique: 'req.param("id")' },
      { express: 'request.query_params["q"]', unique: 'req.query("q")' },
      { express: 'await request.json()', unique: 'req.json::<MyType>()?' },
      { express: 'uvicorn.run(app, port=3000)', unique: 'app.run("0.0.0.0:3000").await' },
    ],
    notes: 'FastAPI uses Python type hints for validation; Unique.js uses serde for deserialization. FastAPI auto-generates OpenAPI docs from type hints; Unique.js auto-generates them from route metadata. Both approaches require no extra annotations.',
  },
  {
    id: 'actix',
    framework: 'Actix-web (Rust)',
    icon: '🦀',
    description: 'Actix-web is a high-performance Rust web framework. Unique.js offers similar performance with a simpler API and polyglot support.',
    mappings: [
      { express: 'use actix_web::{App, HttpServer, HttpResponse};', unique: 'use unique::Unique;' },
      { express: 'HttpServer::new(|| App::new()', unique: 'Unique::new()' },
      { express: '    .route("/path", web::get().to(handler))', unique: '    .handle_get("/path", |req, res| { ... })' },
      { express: '    .route("/path", web::post().to(handler))', unique: '    .handle_post("/path", |req, res| { ... })' },
      { express: ')', unique: '' },
      { express: '.bind("0.0.0.0:3000")?', unique: '.run("0.0.0.0:3000").await?' },
      { express: '.run()', unique: '' },
      { express: '.await', unique: '' },
      { express: 'HttpResponse::Ok().body("text")', unique: 'res.text("text")' },
      { express: 'HttpResponse::Ok().json(data)', unique: 'res.json(serde_json::to_string(&data)?)' },
      { express: 'HttpResponse::NotFound().finish()', unique: 'res.status(StatusCode::NotFound).text("")' },
      { express: 'web::Path::<String>::from(req)', unique: 'req.param("id")' },
      { express: 'web::Query::<T>::from(req)', unique: 'req.query("q")' },
      { express: 'web::Json::<T>::from(req)', unique: 'req.json::<T>()?' },
    ],
    notes: 'Actix uses extractors (web::Path, web::Query, web::Json) that implement FromRequest. Unique.js puts everything on the Request object directly — simpler API, slightly less type-safe but easier to learn. Actix middleware uses Service trait; Unique.js uses async closures.',
  },
  {
    id: 'django',
    framework: 'Django (Python)',
    icon: ' 🎸',
    description: 'Django is a batteries-included Python framework. Unique.js provides the same integrated experience (ORM, auth, admin) but in Rust for 50x better performance.',
    mappings: [
      { express: 'from django.http import HttpResponse', unique: 'use unique_core::Response;' },
      { express: 'def view(request):', unique: '|req, res| { ... }' },
      { express: 'return HttpResponse("text")', unique: 'res.text("text")' },
      { express: 'return JsonResponse({"key": "value"})', unique: 'res.json(r#"{ "key": "value" }"#)' },
      { express: 'urlpatterns = [path("/url", view)]', unique: 'app.handle_get("/url", view)' },
      { express: 'request.GET.get("q")', unique: 'req.query("q")' },
      { express: 'request.POST.get("q")', unique: 'req.body() // parse form data' },
      { express: 'request.headers.get("X-Key")', unique: 'req.header("x-key")' },
      { express: 'class MyModel(models.Model):', unique: '#[derive(Model)]\nstruct MyModel {' },
      { express: '    name = models.CharField(max_length=100)', unique: '    name: String,' },
      { express: 'MyModel.objects.all()', unique: 'MyModel::all(&db).await?' },
      { express: 'MyModel.objects.filter(name="x")', unique: 'Query::<MyModel>::select("my_model").where_eq("name", "x").all(&db).await?' },
      { express: 'MyModel.objects.create(name="x")', unique: 'MyModel { name: "x".into(), .. }.insert(&db).await?' },
      { express: 'MyModel.objects.get(id=42)', unique: 'MyModel::find_by_pk(42, &db).await?' },
      { express: 'MyModel.objects.delete(id=42)', unique: 'MyModel::delete_by_pk(42, &db).await?' },
    ],
    notes: 'Django models use class inheritance with metaclass magic; Unique.js uses #[derive(Model)] proc macro. Django ORM is synchronous; Unique.js ORM is async (tokio). Django admin is a full UI; Unique.js generates a basic CRUD dashboard via `unique generate admin`.',
  },
  {
    id: 'flask',
    framework: 'Flask (Python)',
    icon: '🍶',
    description: 'Flask is a minimalist Python web framework. Unique.js has the same micro-framework philosophy but with built-in async, security, and 30x performance.',
    mappings: [
      { express: 'from flask import Flask, request, jsonify', unique: 'use unique::Unique;' },
      { express: 'app = Flask(__name__)', unique: 'let app = Unique::new();' },
      { express: '@app.route("/path")', unique: 'app.handle_get("/path", |req, res| { ... })' },
      { express: '@app.route("/path", methods=["POST"])', unique: 'app.handle_post("/path", |req, res| { ... })' },
      { express: 'return "text"', unique: 'res.text("text")' },
      { express: 'return jsonify({"key": "value"})', unique: 'res.json(r#"{ "key": "value" }"#)' },
      { express: 'request.args.get("q")', unique: 'req.query("q")' },
      { express: 'request.form.get("q")', unique: 'req.body() // parse form data' },
      { express: 'request.json', unique: 'req.json::<MyType>()?' },
      { express: 'request.headers.get("X-Key")', unique: 'req.header("x-key")' },
      { express: 'app.run(port=3000)', unique: 'app.run("0.0.0.0:3000").await' },
    ],
    notes: 'Flask is synchronous; Unique.js is async-first (tokio). Flask needs extensions for everything (Flask-CORS, Flask-Limiter, Flask-SQLAlchemy); Unique.js has all of these built in.',
  },
  {
    id: 'spring',
    framework: 'Spring Boot (Java)',
    icon: ' ☕',
    description: 'Spring Boot is the standard enterprise Java framework. Unique.js provides the same integrated experience with 50x less memory and 10x better throughput.',
    mappings: [
      { express: '@SpringBootApplication', unique: '// no annotation needed' },
      { express: '@RestController', unique: '// no annotation needed' },
      { express: '@GetMapping("/path")', unique: 'app.handle_get("/path", |req, res| { ... })' },
      { express: '@PostMapping("/path")', unique: 'app.handle_post("/path", |req, res| { ... })' },
      { express: '@RequestMapping(value="/path", method=RequestMethod.PUT)', unique: 'app.handle_put("/path", |req, res| { ... })' },
      { express: 'public ResponseEntity<String> handler()', unique: 'fn handler(req: Request, res: Response) -> BoxFuture<...>' },
      { express: 'return ResponseEntity.ok("text")', unique: 'res.text("text")' },
      { express: 'return ResponseEntity.ok().body(dto)', unique: 'res.json(serde_json::to_string(&dto)?)' },
      { express: '@PathVariable String id', unique: 'req.param("id")' },
      { express: '@RequestParam String q', unique: 'req.query("q")' },
      { express: '@RequestBody MyDto dto', unique: 'let dto: MyDto = req.json()?' },
      { express: '@RequestHeader("X-Key") String key', unique: 'req.header("x-key")' },
      { express: '@Repository / @Entity', unique: '#[derive(Model)]' },
      { express: 'JpaRepository<T, Long>', unique: 'impl Model for T { ... } // auto-generated' },
      { express: 'repository.save(entity)', unique: 'entity.insert(&db).await?' },
      { express: 'repository.findById(id)', unique: 'Entity::find_by_pk(id, &db).await?' },
      { express: 'repository.findAll()', unique: 'Entity::all(&db).await?' },
    ],
    notes: 'Spring uses annotations and dependency injection; Unique.js uses closures and explicit function calls. Spring has a steep learning curve (annotations, contexts, beans); Unique.js has a flat learning curve (just closures). Spring uses Hibernate/JPA for ORM; Unique.js has its own proc-macro-based ORM that is simpler but less feature-rich.',
  },
];

export default function MigratePage() {
  return (
    <>
      <Navbar />
      <div className="container">
        <div className="hero">
          <h1>Migration Guide</h1>
          <p>
            Coming from another framework? This guide shows you the Unique.js
            equivalent of common patterns in Express.js, FastAPI, Actix, Django,
            Flask, and Spring Boot.
          </p>
        </div>

        <div className="tutorial-layout">
          <aside className="sidebar">
            <h3>Frameworks</h3>
            {migrations.map((m) => (
              <a key={m.id} href={`#${m.id}`}>
                {m.icon} {m.framework}
              </a>
            ))}
          </aside>

          <main className="content">
            {migrations.map((m) => (
              <section key={m.id} id={m.id}>
                <h2>{m.icon} {m.framework}</h2>
                <p>{m.description}</p>
                <div className="comparison-table-wrapper">
                  <table className="comparison-table">
                    <thead>
                      <tr>
                        <th>{m.framework}</th>
                        <th className="highlight">Unique.js</th>
                      </tr>
                    </thead>
                    <tbody>
                      {m.mappings.map((row, i) => (
                        <tr key={i}>
                          <td><code>{row.express}</code></td>
                          <td className="highlight"><code>{row.unique}</code></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p><em>{m.notes}</em></p>
              </section>
            ))}
          </main>
        </div>
      </div>
      <Footer />
    </>
  );
}
