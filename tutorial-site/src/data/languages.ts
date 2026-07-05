// Language data for the tutorial site.
// Kungfu.js is available in ALL these languages.

export interface Language {
  id: string;
  name: string;
  icon: string;
  description: string;
  fileExtension: string;
  packageName: string;
  registry: string;
}

export const languages: Language[] = [
  {
    id: 'rust',
    name: 'Rust',
    icon: '🦀',
    description: 'Native performance, full API access',
    fileExtension: '.rs',
    packageName: 'kungfu',
    registry: 'crates.io',
  },
  {
    id: 'javascript',
    name: 'JavaScript',
    icon: '🟨',
    description: 'Node.js binding via napi-rs',
    fileExtension: '.jsk',
    packageName: '@kungfu/core',
    registry: 'npm',
  },
  {
    id: 'typescript',
    name: 'TypeScript',
    icon: '🔷',
    description: 'Type-safe JS with .tsk files',
    fileExtension: '.tsk',
    packageName: '@kungfu/core',
    registry: 'npm',
  },
  {
    id: 'python',
    name: 'Python',
    icon: '🐍',
    description: 'pyo3 binding, decorator API',
    fileExtension: '.py',
    packageName: 'kungfu',
    registry: 'PyPI',
  },
  {
    id: 'go',
    name: 'Go',
    icon: '🐹',
    description: 'Standalone net/http implementation',
    fileExtension: '.go',
    packageName: 'github.com/Resolutefemi/kungfu/bindings/go',
    registry: 'pkg.go.dev',
  },
  {
    id: 'java',
    name: 'Java',
    icon: '☕',
    description: 'C ABI via JNI',
    fileExtension: '.java',
    packageName: 'com.kungfu:kungfu',
    registry: 'Maven Central',
  },
  {
    id: 'kotlin',
    name: 'Kotlin',
    icon: '🟪',
    description: 'JVM binding, same as Java',
    fileExtension: '.kt',
    packageName: 'com.kungfu:kungfu',
    registry: 'Maven Central',
  },
  {
    id: 'dart',
    name: 'Dart',
    icon: '🎯',
    description: 'dart:ffi via C ABI',
    fileExtension: '.dart',
    packageName: 'kungfu',
    registry: 'pub.dev',
  },
  {
    id: 'swift',
    name: 'Swift',
    icon: '🐦',
    description: 'C interop via module map',
    fileExtension: '.swift',
    packageName: 'Kungfu',
    registry: 'Swift Package Manager',
  },
  {
    id: 'cpp',
    name: 'C++',
    icon: '➕',
    description: 'Header-only wrapper around C ABI',
    fileExtension: '.cpp',
    packageName: 'kungfu.hpp',
    registry: 'GitHub',
  },
  {
    id: 'php',
    name: 'PHP',
    icon: '🐘',
    description: 'FFI extension to C library',
    fileExtension: '.php',
    packageName: 'kungfu/kungfu',
    registry: 'Packagist',
  },
  {
    id: 'ruby',
    name: 'Ruby',
    icon: '💎',
    description: 'FFI gem to C library',
    fileExtension: '.rb',
    packageName: 'kungfu',
    registry: 'RubyGems',
  },
  {
    id: 'csharp',
    name: 'C#',
    icon: '🔵',
    description: 'P/Invoke to C library',
    fileExtension: '.cs',
    packageName: 'Kungfu.Core',
    registry: 'NuGet',
  },
  {
    id: 'c',
    name: 'C',
    icon: '🔤',
    description: 'Direct C ABI, no wrapper needed',
    fileExtension: '.c',
    packageName: 'kungfu.h',
    registry: 'GitHub',
  },
  {
    id: 'elixir',
    name: 'Elixir',
    icon: '💧',
    description: 'NIF binding to C library',
    fileExtension: '.ex',
    packageName: 'kungfu',
    registry: 'hex.pm',
  },
  {
    id: 'lua',
    name: 'Lua',
    icon: '🌙',
    description: 'Lua FFI to C library',
    fileExtension: '.lua',
    packageName: 'kungfu',
    registry: 'LuaRocks',
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
