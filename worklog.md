
---
Task ID: vercel-build-fix-2026-07-06
Agent: main (Super Z)
Task: Fix Vercel production build failures for tutorial-site (commit 212b11d)

Work Log:
- Read Vercel build log: two distinct failure groups reported
  1. Module not found: ./src/styles/globals.css in src/app/layout.tsx
  2. Syntax error in src/data/content.ts at line 510-512 (Expected ';', got 'class')
- Investigated layout.tsx: it lived at src/app/layout.tsx but imported
  './src/styles/globals.css' which (relative to src/app/) resolves to
  src/app/src/styles/globals.css — nonexistent. Switched to '@/' path alias
  (tsconfig maps '@/*' to './src/*'), so the import becomes '@/styles/globals.css'.
- Investigated content.ts line 511 (getFrontendCode): the outer template
  literal contained 6 unescaped backticks from the inner .kng template()
  example. The first inner backtick after 'return ' closed the outer template
  literal, and <div class="..."> was then parsed as TS code, producing
  'Expected ;, got class'. Escaped all 6 inner backticks with \`.
- Scanned the rest of content.ts and found the same bug at line 443
  (getMiddlewareCode): console.log(`['${req.method} ${req.path}']`) had two
  unescaped backticks inside the outer template. Escaped them as \`.
- Re-ran `npm run build` locally. Original two errors gone, but new TS error
  surfaced: 'Property icon does not exist on type Language' in
  src/app/learn/[lang]/[chapter]/page.tsx lines 43 and 56. The Language
  interface only has iconUrl (string URL), not icon. Replaced {lang.icon} and
  {l.icon} with <img src=iconUrl ... /> tags, matching how the homepage
  already renders language icons.
- Re-ran build again. New TS error: 'Property Prism does not exist on type
  Window' in src/components/PrismLoader.tsx line 23. Added a `declare global
  { interface Window { Prism?: { highlightAll: ... } } }` block.
- Final `npm run build` succeeded: 804 static pages generated, no errors.
- Added tutorial-site/.gitignore (node_modules, .next, next-env.d.ts, etc.).
- Committed (88aa8ce) and pushed to main. Vercel auto-redeploy should pick
  up the green build now.

Stage Summary:
- 4 source files modified:
  - tutorial-site/src/app/layout.tsx (import path fix)
  - tutorial-site/src/data/content.ts (escape backticks at lines 443 & 511)
  - tutorial-site/src/app/learn/[lang]/[chapter]/page.tsx (lang.icon -> <img>)
  - tutorial-site/src/components/PrismLoader.tsx (Window.Prism global type)
- 1 new file: tutorial-site/.gitignore
- Local build verified green: 804/804 static pages prerendered
- Pushed to https://github.com/Resolutefemi/unique commit 88aa8ce on main
