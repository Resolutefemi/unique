'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ThemeToggle } from './ThemeToggle';

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      <Link href="/" className="navbar-brand" onClick={() => setMenuOpen(false)}>
        <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <polygon points="16,2 28,9 28,23 16,30 4,23 4,9" fill="#00C853" stroke="#00C853" strokeWidth="1" strokeLinejoin="round"/>
          <circle cx="16" cy="16" r="3" fill="#FFFFFF"/>
          <circle cx="16" cy="16" r="1.5" fill="#00C853"/>
        </svg>
        Kungfu.js
      </Link>
      <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
        {menuOpen ? '\u{2715}' : '\u{2630}'}
      </button>
      <div className={`navbar-right ${menuOpen ? 'open' : ''}`}>
        <Link href="/" className="navbar-link" onClick={() => setMenuOpen(false)}>Home</Link>
        <a href="https://github.com/Resolutefemi/kungfu" className="navbar-link" target="_blank" rel="noopener" onClick={() => setMenuOpen(false)}>GitHub</a>
        <ThemeToggle />
      </div>
    </nav>
  );
}
