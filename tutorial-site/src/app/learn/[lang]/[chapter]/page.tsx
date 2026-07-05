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
      `<h2>Next Steps</h2>`,
      `<p>In the next chapter, you will learn about routing, path parameters, and query strings.</p>`,
    ].join('\n');
  }

  const chapterData = chapters.find(c => c.slug === chapter)!;
  return [
    `<h1>${chapterData.title} in ${langName}</h1>`,
    `<p>${chapterData.description}</p>`,
    `<p>This chapter covers ${chapterData.title.toLowerCase()} for ${langName} developers.</p>`,
    `<h2>Overview</h2>`,
    `<p>See the full text tutorial in the <code>docs/learn/</code> directory of the Kungfu.js repository for detailed examples.</p>`,
  ].join('\n');
}

function getPrerequisites(lang: string): string {
  switch (lang) {
    case 'rust':
      return '<p>You need <strong>Rust 1.96+</strong> installed. Get it from <a href="https://rustup.rs">rustup.rs</a>.</p>';
    case 'javascript':
    case 'typescript':
      return '<p>You need <strong>Node.js 18+</strong> and <strong>Rust</strong> (for building the native addon). Get Rust from <a href="https://rustup.rs">rustup.rs</a>.</p>';
    case 'python':
      return '<p>You need <strong>Python 3.8+</strong> and <strong>Rust</strong> (for building the extension). Get Rust from <a href="https://rustup.rs">rustup.rs</a>.</p>';
    case 'go':
      return '<p>You need <strong>Go 1.21+</strong> installed.</p>';
    default:
      return '<p>You need <strong>Rust</strong> installed (for building the C ABI). Get it from <a href="https://rustup.rs">rustup.rs</a>.</p>';
  }
}

function getInstallSteps(lang: string): string {
  switch (lang) {
    case 'rust':
      return '<pre><code>git clone https://github.com/Resolutefemi/kungfu.git\ncd kungfu\ncargo build --workspace --release</code></pre>';
    case 'javascript':
    case 'typescript':
      return '<pre><code>git clone https://github.com/Resolutefemi/kungfu.git\ncd kungfu/bindings/js\nnpm install\nnpm run build</code></pre>';
    case 'python':
      return '<pre><code>git clone https://github.com/Resolutefemi/kungfu.git\ncd kungfu/bindings/python\npip install maturin\nmaturin develop --release</code></pre>';
    case 'go':
      return '<pre><code>go get github.com/Resolutefemi/kungfu/bindings/go</code></pre>';
    default:
      return '<pre><code>git clone https://github.com/Resolutefemi/kungfu.git\ncd kungfu\ncargo build -p kungfu-core --release --features ffi</code></pre>';
  }
}

function getHelloWorld(lang: string): string {
  switch (lang) {
    case 'rust':
      return '<pre><code>use kungfu::prelude::*;\n\nfn main() {\n    let rt = tokio::runtime::Runtime::new().unwrap();\n    rt.block_on(\n        Kungfu::new()\n            .handle_get("/hello", |_req, res| res.text("world"))\n            .run("0.0.0.0:3000"),\n    ).unwrap();\n}</code></pre>';
    case 'javascript':
      return '<pre><code>const { Kungfu } = require(\'kungfu\');\nconst app = new Kungfu();\n\napp.get(\'/hello\', (req) => {\n    return { status: 200, body: JSON.stringify({ message: \'world\' }) };\n});\n\napp.listen(3000);</code></pre>';
    case 'typescript':
      return '<pre><code>import { Kungfu } from \'kungfu\';\nconst app = new Kungfu();\n\napp.get(\'/hello\', (req) => {\n    return { status: 200, body: JSON.stringify({ message: \'world\' }) };\n});\n\napp.listen(3000);</code></pre>';
    case 'python':
      return '<pre><code>from kungfu import KungfuApp\nimport json\n\napp = KungfuApp()\n\napp.get(\'/hello\', lambda req: app.respond(\n    json.loads(req)[\'request_id\'], 200,\n    json.dumps({\'message\': \'world\'})\n))\n\napp.listen(3000)</code></pre>';
    case 'go':
      return '<pre><code>package main\n\nimport "github.com/Resolutefemi/kungfu/bindings/go/kungfu"\n\nfunc main() {\n    app := kungfu.New()\n    app.Get("/hello", func(w kungfu.ResponseWriter, r *kungfu.Request) {\n        w.Text(200, "world")\n    })\n    app.Run(":3000")\n}</code></pre>';
    default:
      return '<pre><code>// See bindings/' + lang + '/ for examples</code></pre>';
  }
}

function getRunCommand(lang: string): string {
  switch (lang) {
    case 'rust':
      return '<pre><code>cargo run --example hello\n\n# Then visit:\n# http://localhost:3000/hello</code></pre>';
    case 'javascript':
    case 'typescript':
      return '<pre><code>node examples/hello.js\n\n# Then visit:\n# http://localhost:3000/hello</code></pre>';
    case 'python':
      return '<pre><code>python examples/hello_handlers.py\n\n# Then visit:\n# http://localhost:3000/hello</code></pre>';
    case 'go':
      return '<pre><code>go run examples/hello/main.go\n\n# Then visit:\n# http://localhost:3000/hello</code></pre>';
    default:
      return '<pre><code># See the bindings directory for run instructions</code></pre>';
  }
}

function getExplanation(lang: string): string {
  return [
    '<p>You just created a Kungfu.js server that listens on port 3000 and responds to GET /hello with "world". The Rust core handles the HTTP parsing, routing, and response writing. Your ' + lang + ' code only runs for the business logic.</p>',
    '<p>The server comes with built-in security headers (HSTS, CSP, X-Frame-Options), CORS, and rate limiting. You can verify this by checking the response headers:</p>',
    '<pre><code>curl -i http://localhost:3000/hello</code></pre>',
    '<p>You will see headers like <code>strict-transport-security</code>, <code>content-security-policy</code>, and more.</p>',
    '<p>Auto-generated API docs are available at <a href="http://localhost:3000/docs">http://localhost:3000/docs</a>.</p>',
  ].join('\n');
}
