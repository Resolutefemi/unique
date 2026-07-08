'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

declare global {
  interface Window {
    Prism?: {
      highlightAll: (element?: HTMLElement | Document) => void;
      highlightElement: (element: HTMLElement) => void;
      highlightAllUnder: (element: HTMLElement) => void;
    };
  }
}

const PRISM_VERSION = '1.29.0';
const PRISON_BASE = `https://cdnjs.cloudflare.com/ajax/libs/prism/${PRISM_VERSION}`;

// Languages used across the 16 Unique.js bindings. Order matters only in
// that 'clike' must load before 'javascript' (which extends it) — but our
// loader waits for ALL of them anyway, so order in this list is irrelevant.
const PRISM_LANGS = [
  'clike',
  'javascript',
  'typescript',
  'python',
  'rust',
  'go',
  'java',
  'c',
  'cpp',
  'ruby',
  'php',
  'swift',
  'dart',
  'csharp',
  'bash',
  'json',
  'yaml',
  'markdown',
];

// Module-level promise so we only load Prism once even across re-mounts.
let prismLoadPromise: Promise<void> | null = null;

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    // Already loaded?
    const existing = document.querySelector(
      `script[data-prism-src="${src}"]`
    ) as HTMLScriptElement | null;
    if (existing) {
      if (existing.dataset.loaded === 'true') return resolve();
      existing.addEventListener('load', () => resolve());
      existing.addEventListener('error', () => reject(new Error(`Failed: ${src}`)));
      return;
    }
    const s = document.createElement('script');
    s.src = src;
    s.async = true;
    s.dataset.prismSrc = src;
    s.onload = () => {
      s.dataset.loaded = 'true';
      resolve();
    };
    s.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.head.appendChild(s);
  });
}

function loadCss(href: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector(
      `link[data-prism-href="${href}"]`
    ) as HTMLLinkElement | null;
    if (existing) {
      if (existing.dataset.loaded === 'true') return resolve();
      existing.addEventListener('load', () => resolve());
      existing.addEventListener('error', () => reject(new Error(`Failed: ${href}`)));
      return;
    }
    const l = document.createElement('link');
    l.rel = 'stylesheet';
    l.href = href;
    l.dataset.prismHref = href;
    l.onload = () => {
      l.dataset.loaded = 'true';
      resolve();
    };
    l.onerror = () => reject(new Error(`Failed to load ${href}`));
    document.head.appendChild(l);
  });
}

function ensurePrismLoaded(): Promise<void> {
  if (prismLoadPromise) return prismLoadPromise;
  prismLoadPromise = (async () => {
    // Load the Prism CSS theme + core JS in parallel.
    await Promise.all([
      loadCss(`${PRISON_BASE}/themes/prism-tomorrow.min.css`),
      loadScript(`${PRISON_BASE}/prism.min.js`),
    ]);
    // Then load all language components in parallel.
    await Promise.all(
      PRISM_LANGS.map((lang) =>
        loadScript(`${PRISON_BASE}/components/prism-${lang}.min.js`)
      )
    );
  })();
  return prismLoadPromise;
}

function highlightAll() {
  if (typeof window === 'undefined') return;
  if (!window.Prism?.highlightAll) return;
  try {
    window.Prism.highlightAll();
  } catch {
    // Swallow — Prism occasionally throws on malformed code blocks.
  }
}

export function PrismLoader() {
  const pathname = usePathname();

  // Initial load: kick off Prism download as soon as the component mounts.
  useEffect(() => {
    let cancelled = false;
    ensurePrismLoaded()
      .then(() => {
        if (!cancelled) highlightAll();
      })
      .catch((err) => {
        // eslint-disable-next-line no-console
        console.warn('[PrismLoader] failed to load Prism:', err);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Re-highlight whenever the route changes (client-side navigation in
  // the App Router doesn't remount the root layout, so this is essential).
  useEffect(() => {
    let cancelled = false;
    ensurePrismLoaded().then(() => {
      if (!cancelled) {
        // Defer one tick so the new page's HTML is committed to the DOM
        // before we scan for <code> elements.
        requestAnimationFrame(() => highlightAll());
      }
    });
    return () => {
      cancelled = true;
    };
  }, [pathname]);

  // Safety net: watch for new <code> blocks added to the DOM after the
  // initial highlight (e.g. lazy-loaded content) and highlight them too.
  useEffect(() => {
    if (typeof MutationObserver === 'undefined') return;
    let pending = false;
    const observer = new MutationObserver((mutations) => {
      if (pending) return;
      let hasCode = false;
      for (const m of mutations) {
        m.addedNodes.forEach((n) => {
          if (n.nodeType !== 1) return;
          const el = n as HTMLElement;
          if (el.tagName === 'PRE' || el.tagName === 'CODE' || el.querySelector?.('pre code')) {
            hasCode = true;
          }
        });
        if (hasCode) break;
      }
      if (!hasCode) return;
      pending = true;
      requestAnimationFrame(() => {
        pending = false;
        highlightAll();
      });
    });
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  return null;
}
