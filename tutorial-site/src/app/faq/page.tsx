import { Navbar } from '@/components/Navbar';
import { faqs } from '@/data/faqs';

export const metadata = {
  title: 'FAQ — Unique.js',
  description: 'Frequently asked questions about Unique.js. Installation issues, performance, deployment, and more.',
  keywords: 'unique.js, faq, troubleshooting, help, questions',
};

export default function FaqPage() {
  return (
    <>
      <Navbar />
      <div className="container">
        <div className="hero">
          <h1>Frequently Asked Questions</h1>
          <p>
            Common questions about Unique.js — installation, performance, deployment,
            security, and troubleshooting. Can&apos;t find your answer? Check the
            tutorial or the API reference.
          </p>
        </div>

        <div className="tutorial-layout">
          <aside className="sidebar">
            <h3>Categories</h3>
            {faqs.map((cat) => (
              <a key={cat.category} href={`#${cat.category.toLowerCase().replace(/\s+/g, '-')}`}>
                {cat.category}
              </a>
            ))}
            <h3>Resources</h3>
            <a href="/api">API Reference</a>
            <a href="/examples">Examples</a>
            <a href="/learn/rust/01-getting-started">Tutorial</a>
          </aside>

          <main className="content">
            {faqs.map((cat) => (
              <section key={cat.category} id={cat.category.toLowerCase().replace(/\s+/g, '-')}>
                <h2>{cat.category}</h2>
                {cat.questions.map((item, i) => (
                  <div key={i} className="faq-item">
                    <h3>{item.q}</h3>
                    <p>{item.a}</p>
                  </div>
                ))}
              </section>
            ))}
          </main>
        </div>
      </div>
    </>
  );
}
