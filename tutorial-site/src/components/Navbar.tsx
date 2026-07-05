import Link from 'next/link';
import { ThemeToggle } from '@/components/ThemeToggle';

export function Navbar() {
  return (
    <nav className="navbar">
      <Link href="/" className="navbar-brand">
        <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <polygon points="16,2 28,9 28,23 16,30 4,23 4,9" fill="#00C853" stroke="#00C853" strokeWidth="1" strokeLinejoin="round"/>
          <circle cx="16" cy="16" r="3" fill="#FFFFFF"/>
          <circle cx="16" cy="16" r="1.5" fill="#00C853"/>
        </svg>
        Kungfu.js
      </Link>
      <div className="navbar-right">
        <Link href="/" className="navbar-link">Home</Link>
        <Link href="/docs" className="navbar-link">Docs</Link>
        <a href="https://github.com/Resolutefemi/kungfu" className="navbar-link" target="_blank" rel="noopener">GitHub</a>
        <ThemeToggle />
      </div>
    </nav>
  );
}
