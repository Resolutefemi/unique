import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { languages } from '../data/languages';
import { features, stats, comparisonRows } from '../data/homepage';
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
      </section>

      {/* Stats banner */}
      <section className="stats-banner">
        {stats.map((stat) => (
          <div key={stat.label} className="stat-item">
            <div className="stat-value">{stat.value}</div>
            <div className="stat-label">{stat.label}</div>
          </div>
        ))}
      </section>

      {/* Features grid */}
      <section className="features-section">
        <h2>Why Unique.js?</h2>
        <p className="features-intro">
          A web framework should be fast by default, secure by default, and simple to learn.
          Unique.js delivers all three without trade-offs.
        </p>
        <div className="features-grid">
          {features.map((feature) => (
            <div key={feature.title} className="feature-card">
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Comparison table */}
      <section className="comparison-section">
        <h2>How does Unique.js compare?</h2>
        <p className="features-intro">
          See how Unique.js stacks up against other popular web frameworks.
        </p>
        <div className="comparison-table-wrapper">
          <table className="comparison-table">
            <thead>
              <tr>
                <th>Feature</th>
                <th className="highlight">Unique.js</th>
                <th>Express.js</th>
                <th>FastAPI</th>
                <th>Actix</th>
              </tr>
            </thead>
            <tbody>
              {comparisonRows.map((row) => (
                <tr key={row.feature}>
                  <td className="feature-name">{row.feature}</td>
                  <td className="highlight">{row.unique}</td>
                  <td>{row.express}</td>
                  <td>{row.fastapi}</td>
                  <td>{row.actix}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Language picker */}
      <section className="hero" style={{ paddingTop: '2rem' }}>
        <h2 style={{ fontSize: '1.6rem' }}>Choose your language</h2>
        <p>16 supported languages — pick one to start the tutorial</p>
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

      <Footer />
    </>
  );
}
