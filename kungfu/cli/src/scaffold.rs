//! `kungfu new` — scaffold a new Kungfu project.

use std::fs;
use std::io::Write;
use std::path::Path;

/// Scaffold a new Kungfu project at the given path.
///
/// Creates:
///   - `Cargo.toml` with kungfu + kungfu-core deps
///   - `src/main.rs` with a hello-world server
///   - `README.md` with a quickstart
///   - `.gitignore` for Rust
pub fn scaffold(project_name: &str) -> std::io::Result<()> {
    let project_path = Path::new(project_name);
    if project_path.exists() {
        return Err(std::io::Error::new(
            std::io::ErrorKind::AlreadyExists,
            format!("directory '{}' already exists", project_name),
        ));
    }

    // Create directory structure.
    fs::create_dir_all(project_path.join("src"))?;

    // Cargo.toml
    let cargo_toml = format!(
        r#"[package]
name = "{name}"
version = "0.1.0"
edition = "2021"

[dependencies]
kungfu = {{ path = "../kungfu" }}
kungfu-core = {{ path = "../core" }}
tokio = {{ version = "1", features = ["full"] }}
serde = {{ version = "1", features = ["derive"] }}
serde_json = "1"
tracing = "0.1"
tracing-subscriber = {{ version = "0.3", features = ["env-filter"] }}

[[bin]]
name = "{name}"
path = "src/main.rs"
"#,
        name = project_name
    );
    fs::write(project_path.join("Cargo.toml"), cargo_toml)?;

    // src/main.rs
    let main_rs = r#"use kungfu::prelude::*;

fn main() {
    tracing_subscriber::fmt()
        .with_env_filter("info")
        .init();

    println!("🥋 Kungfu app starting on http://localhost:3000");

    let rt = tokio::runtime::Builder::new_multi_thread()
        .enable_all()
        .build()
        .unwrap();

    rt.block_on(
        Kungfu::new()
            .title("My Kungfu App")
            .handle_get("/hello", |_req, res| res.text("world"))
            .handle_get("/", |_req, res| {
                res.html("<h1>Hello from Kungfu!</h1><p>Try <a href=\"/hello\">/hello</a></p>")
            })
            .run("0.0.0.0:3000"),
    )
    .unwrap();
}
"#;
    fs::write(project_path.join("src/main.rs"), main_rs)?;

    // README.md
    let readme = format!(
        r#"# {}

A [Kungfu.js](https://github.com/Resolutefemi/kungfu) application.

## Run

```bash
cargo run
```

Visit http://localhost:3000/hello

## Auto docs

Visit http://localhost:3000/docs for Swagger UI.
"#,
        project_name
    );
    fs::write(project_path.join("README.md"), readme)?;

    // .gitignore
    fs::write(
        project_path.join(".gitignore"),
        "/target\nCargo.lock\n",
    )?;

    println!("✓ Created Kungfu project at {project_name}/");
    println!();
    println!("Next steps:");
    println!("  cd {project_name}");
    println!("  cargo run");
    println!();
    println!("Docs: http://localhost:3000/docs");

    Ok(())
}

/// Write a string to a file, creating parent directories as needed.
#[allow(dead_code)]
fn write_file(path: &Path, contents: &str) -> std::io::Result<()> {
    if let Some(parent) = path.parent() {
        fs::create_dir_all(parent)?;
    }
    let mut f = fs::File::create(path)?;
    f.write_all(contents.as_bytes())?;
    Ok(())
}
