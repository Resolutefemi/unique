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
        <h2 style={{ fontSize: '1.4rem', marginTop: '1.5rem' }}>Choose your language</h2>
        <div className="lang-grid">
          {languages.map((lang) => (
            <Link
              key={lang.id}
              href={`/learn/${lang.id}/01-getting-started`}
              className="lang-card"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={lang.iconUrl} alt={lang.name} className="lang-icon" width={40} height={40} />
              <span className="lang-name">{lang.name}</span>
              <span className="lang-desc">{lang.description}</span>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
