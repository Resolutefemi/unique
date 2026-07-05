# Kungfu.js VSCode Extension

Support for `.jsk` and `.tsk` file extensions with syntax highlighting and snippets.

## Installation

1. Copy this folder to your VSCode extensions directory:
   - **Windows:** `%USERPROFILE%\.vscode\extensions\kungfu`
   - **macOS/Linux:** `~/.vscode/extensions/kungfu`
2. Restart VSCode
3. Open a `.jsk` or `.tsk` file. You should see the green hexagon icon.

Or package it:
```bash
cd vscode-extension
npx vsce package
code --install-extension kungfu-1.0.0.vsix
```

## Features

- Syntax highlighting for `.jsk` (JavaScript Kungfu) files
- Syntax highlighting for `.tsk` (TypeScript Kungfu) files
- Code snippets for common Kungfu.js patterns
- Green hexagon icon for Kungfu.js files

## File Extensions

| Extension | Language | Description |
|---|---|---|
| `.jsk` | Kungfu JS | JavaScript files using the Kungfu.js framework |
| `.tsk` | Kungfu TS | TypeScript files using the Kungfu.js framework |
| `.kungfu` | Kungfu Page | SSR page files (data + template) |

## Snippets

- `kget` - GET route
- `kpost` - POST route
- `kungfu` - Complete app setup
- `kasync` - Async route handler
- `kcss` - CSS compilation
