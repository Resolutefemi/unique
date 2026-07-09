import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { apiReference } from '@/data/api-reference';

export const metadata = {
  title: 'API Reference — Unique.js',
  description: 'Complete API reference for Unique.js — every class, method, and type across all 16 language bindings.',
  keywords: 'unique.js, api reference, documentation, web framework',
};

export default function ApiReferencePage() {
  return (
    <>
      <Navbar />
      <div className="tutorial-layout">
        <aside className="sidebar">
          <h3>API Reference</h3>
          {apiReference.map((section) => (
            <a key={section.id} href={`#${section.id}`}>
              {section.title}
            </a>
          ))}
        </aside>
        <main className="content">
          <h1>Unique.js API Reference</h1>
          <p>
            Complete reference for every class, method, and type in the Unique.js framework.
            All APIs are available in every supported language — the Rust core exposes a C ABI
            that each language binding wraps idiomatically.
          </p>

          {apiReference.map((section) => (
            <section key={section.id} id={section.id}>
              <h2>{section.title}</h2>
              <p>{section.description}</p>
              {section.methods.map((method) => (
                <div key={method.name} className="api-method">
                  <h3>
                    <code>{method.signature}</code>
                  </h3>
                  <p>{method.description}</p>
                  {method.parameters && (
                    <div>
                      <strong>Parameters:</strong>
                      <ul>
                        {method.parameters.map((param) => (
                          <li key={param.name}>
                            <code>{param.name}</code> ({param.type}): {param.description}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {method.returns && (
                    <p>
                      <strong>Returns:</strong> <code>{method.returns}</code>
                    </p>
                  )}
                  {method.example && (
                    <div>
                      <strong>Example:</strong>
                      <pre><code className="language-rust">{method.example}</code></pre>
                    </div>
                  )}
                </div>
              ))}
            </section>
          ))}
        </main>
      </div>
      <Footer />
    </>
  );
}
