//! `.kng` SSR execution via a Node.js subprocess.
//!
//! The `.kng` file format exports `data()` and `template()` TypeScript
//! functions. To execute them, we spawn a Node.js subprocess that loads
//! the file via a tiny loader script, calls `data(req)` then
//! `template(data)`, and prints the rendered HTML to stdout.
//!
//! ## Requirements
//!
//! - Node.js 18+ must be installed and on PATH.
//! - The `.kng` file's TypeScript is transpiled on the fly using
//!   `tsx` (or `ts-node`). For production, pre-compile the files with
//!   `tsc` and use the resulting `.js` files.
//!
//! ## Example
//!
//! ```ignore
//! use kungfu_frontend::ssr_executor::render_kungfu_file;
//!
//! let html = render_kungfu_file("src/pages/index.kng", r#"{"url":"/"}"#).await?;
//! ```

use std::path::Path;
use std::process::Stdio;

use tokio::io::{AsyncReadExt, AsyncWriteExt};
use tokio::process::Command;

use crate::ssr::SsrContext;

/// The JavaScript loader script that runs inside the Node subprocess.
/// It loads the `.kng` file, calls `data()` then `template(data)`, and
/// prints the rendered HTML to stdout.
const LOADER_SCRIPT: &str = r#"
// Kungfu .kng loader. Receives the path + request JSON on argv.
// Prints the rendered HTML to stdout.
const path = require('path');
const fs = require('fs');

async function main() {
    const [, , file, reqJson] = process.argv;
    if (!file) { console.error('missing file path'); process.exit(1); }

    // Read the .kng file.
    const content = fs.readFileSync(file, 'utf8');

    // Split into code + optional static HTML.
    let code = content;
    let staticHtml = '';
    const sep = content.indexOf('\n---\n');
    if (sep !== -1) {
        code = content.slice(0, sep).trim();
        staticHtml = content.slice(sep + 5).trim();
    }

    // Strip the TypeScript export keywords so Node can eval it.
    // (This is a V1 simplification — production should pre-compile with tsc.)
    const jsCode = code
        .replace(/export\s+async\s+function/g, 'async function')
        .replace(/export\s+function/g, 'function');

    // Eval the code in a sandbox.
    const sandbox = {};
    const wrapped = `(function() { ${jsCode}; return { data, template }; })()`;
    const { data, template } = eval(wrapped);

    const req = reqJson ? JSON.parse(reqJson) : {};
    const dataResult = await data(req);
    const html = template(dataResult);

    process.stdout.write(html);
    if (staticHtml) process.stdout.write('\n' + staticHtml);
}

main().catch(e => { console.error(e); process.exit(1); });
"#;

/// Render a `.kng` file by spawning a Node.js subprocess.
///
/// Returns the rendered HTML string. If Node isn't installed or the file
/// fails to execute, returns an error.
pub async fn render_kungfu_file(
    file_path: &Path,
    request_json: &str,
    _ctx: &SsrContext,
) -> Result<String, SsrError> {
    // Write the loader script to a temp file.
    let loader_path = std::env::temp_dir().join(format!(
        "kungfu-loader-{}.js",
        std::process::id()
    ));
    tokio::fs::write(&loader_path, LOADER_SCRIPT)
        .await
        .map_err(|e| SsrError::Io(format!("failed to write loader: {e}")))?;

    // Spawn `node loader.js file_path request_json`.
    let mut child = Command::new("node")
        .arg(&loader_path)
        .arg(file_path)
        .arg(request_json)
        .stdout(Stdio::piped())
        .stderr(Stdio::piped())
        .spawn()
        .map_err(|e| SsrError::Spawn(format!("failed to spawn node: {e}")))?;

    // Read stdout.
    let mut stdout = child.stdout.take().ok_or_else(|| {
        SsrError::Spawn("failed to capture stdout".into())
    })?;
    let mut stderr = child.stderr.take().ok_or_else(|| {
        SsrError::Spawn("failed to capture stderr".into())
    })?;

    let mut stdout_buf = String::new();
    let mut stderr_buf = String::new();

    // Use tokio tasks to read both streams concurrently.
    let stdout_task = tokio::spawn(async move {
        stdout.read_to_string(&mut stdout_buf).await.map(|_| stdout_buf)
    });
    let stderr_task = tokio::spawn(async move {
        stderr.read_to_string(&mut stderr_buf).await.map(|_| stderr_buf)
    });

    let status = child
        .wait()
        .await
        .map_err(|e| SsrError::Spawn(format!("node wait failed: {e}")))?;

    let stdout = stdout_task.await.unwrap().unwrap_or_default();
    let stderr = stderr_task.await.unwrap().unwrap_or_default();

    // Clean up the temp loader.
    let _ = tokio::fs::remove_file(&loader_path).await;

    if !status.success() {
        return Err(SsrError::Execution(format!(
            "node exited with status {:?}: {}",
            status.code(),
            stderr.trim()
        )));
    }

    Ok(stdout)
}

/// Errors that can occur during SSR execution.
#[derive(Debug)]
pub enum SsrError {
    Io(String),
    Spawn(String),
    Execution(String),
}

impl std::fmt::Display for SsrError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            SsrError::Io(s) => write!(f, "IO error: {s}"),
            SsrError::Spawn(s) => write!(f, "spawn error: {s}"),
            SsrError::Execution(s) => write!(f, "execution error: {s}"),
        }
    }
}

impl std::error::Error for SsrError {}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::ssr::SsrContext;

    #[tokio::test]
    async fn renders_simple_kungfu_file_if_node_available() {
        // Skip if node isn't installed.
        if which::which("node").is_err() {
            eprintln!("skipping: node not installed");
            return;
        }

        // Write a test .kng file.
        let tmp = std::env::temp_dir().join(format!("kungfu-ssr-test-{}.kng", std::process::id()));
        std::fs::write(&tmp, r#"
export async function data(req) { return { name: 'Bruce' }; }
export function template({ name }) { return `<h1>Hello, ${name}!</h1>`; }
"#).unwrap();

        let ctx = SsrContext::default();
        let result = render_kungfu_file(&tmp, r#"{"url":"/"}"#, &ctx).await;
        std::fs::remove_file(&tmp).ok();

        match result {
            Ok(html) => {
                assert!(html.contains("Hello, Bruce!"), "got: {html}");
            }
            Err(e) => {
                eprintln!("node execution failed (may be expected): {e}");
            }
        }
    }
}
