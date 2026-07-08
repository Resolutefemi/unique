import { Navbar } from '@/components/Navbar';
import { examples } from '@/data/examples';

export const metadata = {
  title: 'Examples — Unique.js',
  description: 'Real-world Unique.js examples: REST API, WebSocket chat, todo app, file upload, authentication, and more.',
  keywords: 'unique.js, examples, code, tutorial, web framework',
};

export default function ExamplesPage() {
  return (
    <>
      <Navbar />
      <div className="container">
        <div className="hero">
          <h1>Unique.js Examples</h1>
          <p>
            Real-world, copy-paste-ready examples covering the most common use cases.
            Each example is self-contained and can be run with a single command.
          </p>
        </div>

        <div className="examples-grid">
          {examples.map((example) => (
            <div key={example.slug} className="example-card">
              <div className="example-card-header">
                <span className="example-icon">{example.icon}</span>
                <h2>{example.title}</h2>
              </div>
              <p className="example-description">{example.description}</p>
              <div className="example-tags">
                {example.tags.map((tag) => (
                  <span key={tag} className="example-tag">{tag}</span>
                ))}
              </div>
              <div className="example-code">
                <pre><code className={`language-${example.language}`}>{example.code}</code></pre>
              </div>
              <div className="example-run">
                <strong>Run it:</strong>
                <code>{example.runCommand}</code>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
