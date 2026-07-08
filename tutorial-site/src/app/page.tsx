import { Navbar } from '../components/Navbar';
import { languages } from '../data/languages';
import Link from 'next/link';

export default function HomePage() {
  return (
    <>
      <Navbar />
      <section className="hero">
        <h1>Unique.js</h1>
        <p>
          One API surface, infinite languages. A polyglot web framework with a Rust core.
          Write your backend in any of 16 languages. Frontend in JS/TS only.
          Fast, secure, simple.
        </p>

        {/* Quick navigation cards */}
        <div className="quick-nav">
          <Link href="/quick-start" className="quick-nav-card">
            <span className="quick-nav-icon">🚀</span>
            <span className="quick-nav-title">Quick Start</span>
            <span className="quick-nav-desc">Running in 5 minutes</span>
          </Link>
          <Link href="/learn/rust/01-getting-started" className="quick-nav-card">
            <span className="quick-nav-icon">📚</span>
            <span className="quick-nav-title">Tutorial</span>
            <span className="quick-nav-desc">50 chapters × 16 languages</span>
          </Link>
          <Link href="/api" className="quick-nav-card">
            <span className="quick-nav-icon">📖</span>
            <span className="quick-nav-title">API Reference</span>
            <span className="quick-nav-desc">Every class, method, type</span>
          </Link>
          <Link href="/examples" className="quick-nav-card">
            <span className="quick-nav-icon">⚡</span>
            <span className="quick-nav-title">Examples</span>
            <span className="quick-nav-desc">Copy-paste-ready code</span>
          </Link>
          <Link href="/faq" className="quick-nav-card">
            <span className="quick-nav-icon">❓</span>
            <span className="quick-nav-title">FAQ</span>
            <span className="quick-nav-desc">Common questions answered</span>
          </Link>
        </div>

        <h2 style={{ fontSize: '1.4rem', marginTop: '2.5rem' }}>Choose your language</h2>
        <div className="lang-grid">
          {languages.map((lang) => (
            <Link
              key={lang.id}
              href={`/learn/${lang.id}/01-getting-started`}
              className="lang-card"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={lang.iconUrl} alt={lang.name} className="lang-icon" width={44} height={44} />
              <span className="lang-name">{lang.name}</span>
              <span className="lang-desc">{lang.description}</span>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
