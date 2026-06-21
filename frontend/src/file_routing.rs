//! File-based routing — auto-register `.kungfu` files as routes.
//!
//! Walks `src/pages/` and converts each `.kungfu` file into a route:
//!
//! - `src/pages/index.kungfu` → `/`
//! - `src/pages/about.kungfu` → `/about`
//! - `src/pages/users/[id].kungfu` → `/users/:id`
//! - `src/pages/assets/[...path].kungfu` → `/assets/*path`
//!
//! ## Example
//!
//! ```ignore
//! use kungfu_frontend::file_routing::register_pages;
//!
//! let mut router = kungfu::Router::new();
//! register_pages(&mut router, "src/pages")?;
//! ```

use std::path::Path;

use kungfu_core::router::Router;
use kungfu_core::{Method, RouteMeta};

use crate::parser::parse_kungfu_file;

/// Walk `pages_dir`, parse each `.kungfu` file, and register a route for
/// each in `router`. The handler is a placeholder that returns a "not yet
/// rendered" message — actual SSR execution requires the `ssr_executor`
/// module wired in.
pub fn register_pages(router: &mut Router, pages_dir: &Path) -> std::io::Result<usize> {
    let mut count = 0;
    if !pages_dir.exists() {
        return Ok(0);
    }
    for entry in walkdir::WalkDir::new(pages_dir)
        .into_iter()
        .filter_map(|e| e.ok())
    {
        if !entry.file_type().is_file() {
            continue;
        }
        let path = entry.path();
        if path.extension().and_then(|e| e.to_str()) != Some("kungfu") {
            continue;
        }

        // Compute the relative path from pages_dir.
        let rel = match path.strip_prefix(pages_dir) {
            Ok(p) => p,
            Err(_) => continue,
        };
        let rel_str = rel.to_string_lossy().replace('\\', "/");

        // Read + parse the file (just to validate + derive the route path).
        let content = match std::fs::read_to_string(path) {
            Ok(c) => c,
            Err(_) => continue,
        };
        let kungfu_file = match parse_kungfu_file(&content, &rel_str) {
            Ok(f) => f,
            Err(e) => {
                tracing::warn!("failed to parse {}: {e}", path.display());
                continue;
            }
        };

        // Register a placeholder GET route. Actual SSR happens via
        // `ssr_executor::render_kungfu_file`.
        let route_path = kungfu_file.route_path.clone();
        let file_path = path.to_path_buf();
        let handler: kungfu_core::Handler = std::sync::Arc::new(move |_req| {
            let file_path = file_path.clone();
            Box::pin(async move {
                // V1: return a placeholder. V1.1 will call render_kungfu_file.
                kungfu_core::Response::new().html(format!(
                    "<!-- Kungfu SSR placeholder for {} -->\n\
                     <p>This .kungfu file would be rendered server-side.</p>\n\
                     <p>File: {}</p>",
                    file_path.display(),
                    file_path.display()
                ))
            })
        });
        let _ = router.add_with_meta(
            RouteMeta {
                path: route_path.clone(),
                method: Method::Get,
                summary: Some(format!("SSR page: {}", route_path)),
                tags: vec!["pages".into()],
                ..Default::default()
            },
            handler,
        );
        count += 1;
    }
    Ok(count)
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::fs;

    #[test]
    fn registers_pages_from_directory() {
        let tmp = std::env::temp_dir().join(format!(
            "kungfu-pages-test-{}",
            std::process::id()
        ));
        let _ = fs::remove_dir_all(&tmp);
        fs::create_dir_all(&tmp).unwrap();

        // index.kungfu → /
        fs::write(
            tmp.join("index.kungfu"),
            "export function data() { return {}; }\nexport function template() { return ''; }",
        ).unwrap();

        // users/[id].kungfu → /users/:id
        fs::create_dir_all(tmp.join("users")).unwrap();
        fs::write(
            tmp.join("users").join("[id].kungfu"),
            "export function data() { return {}; }\nexport function template() { return ''; }",
        ).unwrap();

        let mut router = Router::new();
        let count = register_pages(&mut router, &tmp).unwrap();
        assert_eq!(count, 2);

        let routes = router.routes();
        let paths: Vec<_> = routes.iter().map(|r| r.path.as_str()).collect();
        assert!(paths.contains(&"/"));
        assert!(paths.contains(&"/users/:id"));

        let _ = fs::remove_dir_all(&tmp);
    }
}
