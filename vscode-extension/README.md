# Unique.js VSCode Extension

Support for `.jsk` and `.tsk` file extensions with syntax highlighting and snippets.

## Installation

1. Copy this folder to your VSCode extensions directory:
   - **Windows:** `%USERPROFILE%\.vscode\extensions\unique`
   - **macOS/Linux:** `~/.vscode/extensions/unique`
2. Restart VSCode
3. Open a `.jsk` or `.tsk` file. You should see the green hexagon icon.

Or package it:
```bash
cd vscode-extension
npx vsce package
code --install-extension unique-1.0.0.vsix
```

## Features

- Syntax highlighting for `.jsk` (JavaScript Unique) files
- Syntax highlighting for `.tsk` (TypeScript Unique) files
- Code snippets for common Unique.js patterns
- Green hexagon icon for Unique.js files

## File Extensions

| Extension | Language | Description |
|---|---|---|
| `.jsk` | Unique JS | JavaScript files using the Unique.js framework |
| `.tsk` | Unique TS | TypeScript files using the Unique.js framework |
| `.kng` | Unique Page | SSR page files (data + template) |

## Snippets

- `kget` - GET route
- `kpost` - POST route
- `unique` - Complete app setup
- `kasync` - Async route handler
- `kcss` - CSS compilation
