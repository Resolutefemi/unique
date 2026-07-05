// Language data for the tutorial site.

export interface Language {
  id: string;
  name: string;
  icon: string;
  description: string;
  fileExtension: string;
}

export const languages: Language[] = [
  {
    id: 'rust',
    name: 'Rust',
    icon: '🦀',
    description: 'Native performance, full API access',
    fileExtension: '.rs',
  },
  {
    id: 'javascript',
    name: 'JavaScript',
    icon: '🟨',
    description: 'Node.js binding via napi-rs',
    fileExtension: '.jsk',
  },
  {
    id: 'typescript',
    name: 'TypeScript',
    icon: '🔷',
    description: 'Type-safe JS with .tsk files',
    fileExtension: '.tsk',
  },
  {
    id: 'python',
    name: 'Python',
    icon: '🐍',
    description: 'pyo3 binding, decorator API',
    fileExtension: '.py',
  },
  {
    id: 'go',
    name: 'Go',
    icon: '🐹',
    description: 'Standalone net/http implementation',
    fileExtension: '.go',
  },
  {
    id: 'java',
    name: 'Java',
    icon: '☕',
    description: 'C ABI via JNI',
    fileExtension: '.java',
  },
  {
    id: 'dart',
    name: 'Dart',
    icon: '🎯',
    description: 'dart:ffi via C ABI',
    fileExtension: '.dart',
  },
  {
    id: 'swift',
    name: 'Swift',
    icon: '🐦',
    description: 'C interop via module map',
    fileExtension: '.swift',
  },
  {
    id: 'cpp',
    name: 'C++',
    icon: '➕',
    description: 'Header-only wrapper around C ABI',
    fileExtension: '.cpp',
  },
];

export interface TutorialChapter {
  slug: string;
  title: string;
  description: string;
}

export const chapters: TutorialChapter[] = [
  { slug: '01-getting-started', title: 'Getting Started', description: 'Install Kungfu.js and build your first app' },
  { slug: '02-routing', title: 'Routing', description: 'Path parameters, wildcards, query strings' },
  { slug: '03-middleware', title: 'Middleware', description: 'Built-in and custom middleware' },
  { slug: '04-request-response', title: 'Request and Response', description: 'JSON, form data, file uploads' },
  { slug: '05-database', title: 'Database and ORM', description: 'SQLite, PostgreSQL, MySQL CRUD' },
  { slug: '06-auth', title: 'Authentication', description: 'JWT, sessions, RBAC, OAuth2' },
  { slug: '07-websocket', title: 'WebSocket', description: 'Real-time communication' },
  { slug: '08-css', title: 'CSS Engine', description: 'Tailwind-like utility classes' },
  { slug: '09-frontend', title: 'Frontend and SSR', description: '.kungfu files and hydration' },
  { slug: '10-deployment', title: 'Deployment', description: 'Docker, systemd, production tuning' },
];
