'use client';

import { useEffect, useState } from 'react';

export function ThemeToggle() {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const saved = localStorage.getItem('kungfu-theme') || 'light';
    setTheme(saved);
    document.documentElement.setAttribute('data-theme', saved);
  }, []);

  const toggle = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('kungfu-theme', next);
  };

  return (
    <button className="theme-toggle" onClick={toggle} aria-label="Toggle dark mode">
      {theme === 'light' ? '🌙' : '☀️'}
    </button>
  );
}
