//! Source-file scanner — extract used CSS classes from project files.
//!
//! Scans `.html`, `.kng`, `.tsx`, `.jsx`, `.ts`, `.js` files for class
//! strings. Recognises both `class="..."` (HTML) and `className="..."` (JSX)
//! attributes.

use std::collections::HashSet;
use std::path::{Path, PathBuf};

use once_cell::sync::Lazy;
use regex::Regex;
use walkdir::WalkDir;

static CLASS_ATTR_RE: Lazy<Regex> = Lazy::new(|| {
    // Matches `class="..."`, `className="..."`, or `class='...'`.
    Regex::new(r#"(?:class|className)\s*=\s*["']([^"']+)["']"#).unwrap()
});

/// Scan a single file for class strings.
pub fn scan_file<P: AsRef<Path>>(path: P) -> std::io::Result<HashSet<String>> {
    let content = std::fs::read_to_string(path)?;
    let mut classes = HashSet::new();
    for cap in CLASS_ATTR_RE.captures_iter(&content) {
        let class_str = cap.get(1).map(|m| m.as_str()).unwrap_or("");
        for c in class_str.split_whitespace() {
            classes.insert(c.to_string());
        }
    }
    Ok(classes)
}

/// Scan a directory recursively for files containing class strings.
pub fn scan_directory<P: AsRef<Path>>(root: P) -> std::io::Result<HashSet<String>> {
    let mut all_classes = HashSet::new();
    let valid_exts = [
        "html", "htm", "kungfu", "tsx", "jsx", "ts", "js", "vue", "svelte",
    ];

    for entry in WalkDir::new(root).into_iter().filter_map(|e| e.ok()) {
        if !entry.file_type().is_file() {
            continue;
        }
        let path: &Path = entry.path();
        let Some(ext) = path.extension().and_then(|e| e.to_str()) else { continue };
        if !valid_exts.contains(&ext) {
            continue;
        }
        if let Ok(classes) = scan_file(path) {
            all_classes.extend(classes);
        }
    }

    Ok(all_classes)
}

/// Helper: return all files that contained class strings. Useful for debugging.
pub fn list_scanned_files<P: AsRef<Path>>(root: P) -> std::io::Result<Vec<PathBuf>> {
    let mut files = Vec::new();
    let valid_exts = [
        "html", "htm", "kungfu", "tsx", "jsx", "ts", "js", "vue", "svelte",
    ];
    for entry in WalkDir::new(root).into_iter().filter_map(|e| e.ok()) {
        if !entry.file_type().is_file() {
            continue;
        }
        let path = entry.path();
        let Some(ext) = path.extension().and_then(|e| e.to_str()) else { continue };
        if valid_exts.contains(&ext) {
            files.push(path.to_path_buf());
        }
    }
    Ok(files)
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::io::Write;

    #[test]
    fn scans_html_class_attribute() {
        let tmp = std::env::temp_dir().join(format!("kungfu-css-test-{}", std::process::id()));
        std::fs::create_dir_all(&tmp).unwrap();
        let file = tmp.join("test.html");
        let mut f = std::fs::File::create(&file).unwrap();
        writeln!(f, r#"<div class="flex p-4 text-red-500">hi</div>"#).unwrap();
        writeln!(f, r#"<span className="bg-blue-200 hover:bg-blue-500">x</span>"#).unwrap();
        drop(f);

        let classes = scan_file(&file).unwrap();
        assert!(classes.contains("flex"));
        assert!(classes.contains("p-4"));
        assert!(classes.contains("text-red-500"));
        assert!(classes.contains("bg-blue-200"));
        assert!(classes.contains("hover:bg-blue-500"));

        let _ = std::fs::remove_dir_all(&tmp);
    }

    #[test]
    fn scans_directory_recursively() {
        let tmp = std::env::temp_dir().join(format!("kungfu-css-test2-{}", std::process::id()));
        std::fs::create_dir_all(tmp.join("subdir")).unwrap();
        std::fs::write(
            tmp.join("index.html"),
            r#"<div class="container mx-auto"></div>"#,
        )
        .unwrap();
        std::fs::write(
            tmp.join("subdir/card.tsx"),
            r#"export const Card = () => <div className="rounded-lg p-6 shadow">hi</div>;"#,
        )
        .unwrap();

        let classes = scan_directory(&tmp).unwrap();
        assert!(classes.contains("container"));
        assert!(classes.contains("mx-auto"));
        assert!(classes.contains("rounded-lg"));
        assert!(classes.contains("p-6"));
        assert!(classes.contains("shadow")); // not a real utility, but the scanner doesn't care

        let _ = std::fs::remove_dir_all(&tmp);
    }
}
