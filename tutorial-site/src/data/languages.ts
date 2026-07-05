// Language data with real SVG icons from CDN (devicon.dev)
// Each language uses its official icon from the devicon CDN.

export interface Language {
  id: string;
  name: string;
  iconUrl: string;
  description: string;
  fileExtension: string;
  packageName: string;
  registry: string;
}

export const languages: Language[] = [
  {
    id: 'rust',
    name: 'Rust',
    iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/rust/rust-original.svg',
    description: 'Native performance, full API access',
    fileExtension: '.rs',
    packageName: 'kungfu',
    registry: 'crates.io',
  },
  {
    id: 'javascript',
    name: 'JavaScript',
    iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg',
    description: 'Node.js binding via napi-rs',
    fileExtension: '.jsk',
    packageName: '@kungfu/core',
    registry: 'npm',
  },
  {
    id: 'typescript',
    name: 'TypeScript',
    iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg',
    description: 'Type-safe JS with .tsk files',
    fileExtension: '.tsk',
    packageName: '@kungfu/core',
    registry: 'npm',
  },
  {
    id: 'python',
    name: 'Python',
    iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg',
    description: 'pyo3 binding, decorator API',
    fileExtension: '.py',
    packageName: 'kungfu',
    registry: 'PyPI',
  },
  {
    id: 'go',
    name: 'Go',
    iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/go/go-original.svg',
    description: 'Standalone net/http implementation',
    fileExtension: '.go',
    packageName: 'github.com/Resolutefemi/kungfu/bindings/go',
    registry: 'pkg.go.dev',
  },
  {
    id: 'java',
    name: 'Java',
    iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg',
    description: 'C ABI via JNI',
    fileExtension: '.java',
    packageName: 'com.kungfu:kungfu',
    registry: 'Maven Central',
  },
  {
    id: 'kotlin',
    name: 'Kotlin',
    iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kotlin/kotlin-original.svg',
    description: 'JVM binding, same as Java',
    fileExtension: '.kt',
    packageName: 'com.kungfu:kungfu',
    registry: 'Maven Central',
  },
  {
    id: 'dart',
    name: 'Dart',
    iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/dart/dart-original.svg',
    description: 'dart:ffi via C ABI',
    fileExtension: '.dart',
    packageName: 'kungfu',
    registry: 'pub.dev',
  },
  {
    id: 'swift',
    name: 'Swift',
    iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/swift/swift-original.svg',
    description: 'C interop via module map',
    fileExtension: '.swift',
    packageName: 'Kungfu',
    registry: 'Swift Package Manager',
  },
  {
    id: 'cpp',
    name: 'C++',
    iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg',
    description: 'Header-only wrapper around C ABI',
    fileExtension: '.cpp',
    packageName: 'kungfu.hpp',
    registry: 'GitHub',
  },
  {
    id: 'php',
    name: 'PHP',
    iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg',
    description: 'FFI extension to C library',
    fileExtension: '.php',
    packageName: 'kungfu/kungfu',
    registry: 'Packagist',
  },
  {
    id: 'ruby',
    name: 'Ruby',
    iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/ruby/ruby-original.svg',
    description: 'FFI gem to C library',
    fileExtension: '.rb',
    packageName: 'kungfu',
    registry: 'RubyGems',
  },
  {
    id: 'csharp',
    name: 'C#',
    iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/csharp/csharp-original.svg',
    description: 'P/Invoke to C library',
    fileExtension: '.cs',
    packageName: 'Kungfu.Core',
    registry: 'NuGet',
  },
  {
    id: 'c',
    name: 'C',
    iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg',
    description: 'Direct C ABI, no wrapper needed',
    fileExtension: '.c',
    packageName: 'kungfu.h',
    registry: 'GitHub',
  },
  {
    id: 'elixir',
    name: 'Elixir',
    iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/elixir/elixir-original.svg',
    description: 'NIF binding to C library',
    fileExtension: '.ex',
    packageName: 'kungfu',
    registry: 'hex.pm',
  },
  {
    id: 'lua',
    name: 'Lua',
    iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/lua/lua-original.svg',
    description: 'LuaJIT FFI to C library',
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
  { slug: '09-frontend', title: 'Frontend and SSR', description: '.kng files and hydration' },
  { slug: '10-deployment', title: 'Deployment', description: 'Docker, systemd, production tuning' },
];
