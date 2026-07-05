'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ThemeToggle } from './ThemeToggle';

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      <Link href="/" className="navbar-brand" onClick={() => setMenuOpen(false)}>
        <svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <polygon points="16,2 28,9 28,23 16,30 4,23 4,9" fill="#00C853" stroke="#00C853" strokeWidth="1" strokeLinejoin="round"/>
          <circle cx="16" cy="16" r="3" fill="#FFFFFF"/>
          <circle cx="16" cy="16" r="1.5" fill="#00C853"/>
        </svg>
        Kungfu.js
      </Link>

      {/* Theme toggle is ALWAYS visible - not inside the menu */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
        <ThemeToggle />
        <button
          className="hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          {menuOpen ? '\u2715' : '\u2630'}
        </button>
      </div>

      {/* Dropdown menu for links only */}
      {menuOpen && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            right: '0.75rem',
            background: 'var(--bg)',
            border: '1px solid var(--border)',
            borderRadius: '0 0 10px 10px',
            padding: '0.5rem',
            minWidth: '160px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            zIndex: 1001,
            display: 'flex',
            flexDirection: 'column',
            gap: 0,
          }}
        >
          <Link
            href="/"
            className="navbar-link"
            onClick={() => setMenuOpen(false)}
            style={{ display: 'block', padding: '0.6rem 0.75rem', borderRadius: '6px' }}
          >
            Home
          </Link>
          <a
            href="https://github.com/Resolutefemi/kungfu"
            className="navbar-link"
            target="_blank"
            rel="noopener"
            onClick={() => setMenuOpen(false)}
            style={{ display: 'block', padding: '0.6rem 0.75rem', borderRadius: '6px' }}
          >
            GitHub
          </a>
        </div>
      )}
    </nav>
  );
}
