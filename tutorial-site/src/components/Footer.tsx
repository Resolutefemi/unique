export function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h4>Unique.js</h4>
          <p>One API surface, infinite languages. A polyglot web framework with a Rust core.</p>
        </div>

        <div className="footer-section">
          <h4>Documentation</h4>
          <a href="/quick-start">Quick Start</a>
          <a href="/learn/rust/01-getting-started">Tutorial</a>
          <a href="/api">API Reference</a>
          <a href="/examples">Examples</a>
          <a href="/faq">FAQ</a>
        </div>

        <div className="footer-section">
          <h4>Languages</h4>
          <a href="/learn/rust/01-getting-started">Rust</a>
          <a href="/learn/javascript/01-getting-started">JavaScript</a>
          <a href="/learn/typescript/01-getting-started">TypeScript</a>
          <a href="/learn/python/01-getting-started">Python</a>
          <a href="/learn/go/01-getting-started">Go</a>
        </div>

        <div className="footer-section">
          <h4>Community</h4>
          <a href="https://github.com/Resolutefemi/unique" target="_blank" rel="noopener noreferrer">GitHub</a>
          <a href="https://github.com/Resolutefemi/unique/issues" target="_blank" rel="noopener noreferrer">Issues</a>
          <a href="https://github.com/Resolutefemi/unique/pulls" target="_blank" rel="noopener noreferrer">Pull Requests</a>
          <a href="https://github.com/Resolutefemi/unique/blob/main/CHANGELOG.md" target="_blank" rel="noopener noreferrer">Changelog</a>
        </div>
      </div>

      <div className="footer-bottom">
        <p>
          &copy; 2026 Unique.js Contributors. Licensed under MIT OR Apache-2.0.
        </p>
      </div>
    </footer>
  );
}
