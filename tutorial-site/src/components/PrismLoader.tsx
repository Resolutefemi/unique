'use client';

import { useEffect } from 'react';

export function PrismLoader() {
  useEffect(() => {
    // Load Prism.js dynamically
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/prism.min.js';
    script.async = true;
    script.onload = () => {
      // Load common language components
      const langs = ['clike', 'javascript', 'typescript', 'python', 'rust', 'go', 'java', 'c', 'cpp', 'ruby', 'php', 'swift', 'dart', 'csharp'];
      langs.forEach((lang) => {
        const s = document.createElement('script');
        s.src = `https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-${lang}.min.js`;
        s.async = true;
        document.head.appendChild(s);
      });

      // Highlight all code blocks after loading
      setTimeout(() => {
        if (window.Prism) {
          window.Prism.highlightAll();
        }
      }, 500);
    };
    document.head.appendChild(script);

    // Load Prism CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism-tomorrow.min.css';
    document.head.appendChild(link);
  }, []);

  return null;
}
