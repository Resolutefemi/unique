'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from './ThemeToggle';

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  // Close the menu whenever the route changes (so a click on a Link
  // doesn't leave the dropdown dangling open over the new page).
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Close the menu on Escape (a11y) and on resize to desktop.
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    const onResize = () => {
      if (window.innerWidth > 768) setMenuOpen(false);
    };
    window.addEventListener('keydown', onKey);
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', onResize);
    };
  }, [menuOpen]);

  return (
    <nav className="navbar">
      <Link href="/" className="navbar-brand">
        <svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <polygon points="16,2 28,9 28,23 16,30 4,23 4,9" fill="#00C853" stroke="#00C853" strokeWidth="1" strokeLinejoin="round"/>
          <circle cx="16" cy="16" r="3" fill="#FFFFFF"/>
          <circle cx="16" cy="16" r="1.5" fill="#00C853"/>
        </svg>
        Kungfu.js
      </Link>

      {/* Desktop links — hidden on mobile, replaced by hamburger dropdown */}
      <div className="navbar-desktop-links">
        <Link href="/" className={`navbar-link ${pathname === '/' ? 'navbar-link--active' : ''}`}>
          Home
        </Link>
        <Link
          href="/learn/rust/01-getting-started"
          className={`navbar-link ${pathname?.startsWith('/learn') ? 'navbar-link--active' : ''}`}
        >
          Learn
        </Link>
        <a
          href="https://github.com/Resolutefemi/kungfu"
          className="navbar-link"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub
        </a>
      </div>

      {/* Right side: theme toggle (always visible) + hamburger (mobile only) */}
      <div className="navbar-actions">
        <ThemeToggle />
        <button
          className="hamburger"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
          aria-controls="navbar-mobile-menu"
        >
          <span className="hamburger-icon" data-open={menuOpen}>
            <span></span>
            <span></span>
            <span></span>
          </span>
        </button>
      </div>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div id="navbar-mobile-menu" className="navbar-mobile-menu" role="menu">
          <Link href="/" className="navbar-mobile-link" onClick={() => setMenuOpen(false)}>
            Home
          </Link>
          <Link
            href="/learn/rust/01-getting-started"
            className="navbar-mobile-link"
            onClick={() => setMenuOpen(false)}
          >
            Learn
          </Link>
          <a
            href="https://github.com/Resolutefemi/kungfu"
            className="navbar-mobile-link"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setMenuOpen(false)}
          >
            GitHub ↗
          </a>
        </div>
      )}
    </nav>
  );
}
