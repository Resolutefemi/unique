import { Navbar } from '../components/Navbar';
import { languages } from '../data/languages';
import Link from 'next/link';

export default function HomePage() {
  return (
    <>
      <Navbar />
      <section className="hero">
        <h1>Learn Kungfu.js</h1>
        <p>
          A polyglot web framework with a Rust core.
          Write your backend in any language. Frontend in JS/TS only.
          Fast, secure, simple.
        </p>
        <h2 style={{ fontSize: '1.5rem', marginTop: '2rem' }}>Choose your language</h2>
        <div className="lang-grid">
          {languages.map((lang) => (
            <Link
              key={lang.id}
              href={`/learn/${lang.id}/01-getting-started`}
              className="lang-card"
            >
              <span className="lang-icon">{lang.icon}</span>
              <span className="lang-name">{lang.name}</span>
              <span className="lang-desc">{lang.description}</span>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
