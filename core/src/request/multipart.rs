//! Multipart form parsing (`multipart/form-data`).
//!
//! Used for file uploads. Parses the body into a list of parts, each with
//! its own headers and body bytes.
//!
//! ## Example
//!
//! ```ignore
//! Unique::new()
//!     .handle_post("/upload", |req, res| {
//!         let multipart = match req.multipart() {
//!             Ok(m) => m,
//!             Err(e) => return res.error(e),
//!         };
//!         for part in multipart.parts {
//!             if let Some(filename) = part.filename {
//!                 println!("Uploaded {}: {} bytes", filename, part.body.len());
//!             }
//!         }
//!         res.text("uploaded")
//!     })
//! ```

use std::collections::HashMap;

use crate::error::{UniqueError, Result, StatusCode};
use crate::request::Request;

/// A parsed multipart form.
#[derive(Debug, Clone)]
pub struct Multipart {
    pub parts: Vec<Part>,
}

/// A single part of a multipart form.
#[derive(Debug, Clone)]
pub struct Part {
    /// The `name` field from `Content-Disposition: form-data; name="..."`.
    pub name: String,
    /// The `filename` field from `Content-Disposition`, if present.
    pub filename: Option<String>,
    /// Headers on this part (e.g. `Content-Type` for file uploads).
    pub headers: HashMap<String, String>,
    /// The raw body bytes of this part.
    pub body: bytes::Bytes,
}

impl Request {
    /// Parse the request body as `multipart/form-data`. Returns an error
    /// if the Content-Type isn't multipart or the boundary is missing.
    pub fn multipart(&self) -> Result<Multipart> {
        let ct = self
            .header("content-type")
            .ok_or_else(|| UniqueError::new(StatusCode::BadRequest, "Missing Content-Type"))?;

        if !ct.starts_with("multipart/form-data") {
            return Err(UniqueError::new(
                StatusCode::BadRequest,
                "Content-Type must be multipart/form-data",
            ));
        }

        // Extract boundary from Content-Type.
        let boundary = ct
            .split(';')
            .map(|s| s.trim())
            .find_map(|s| s.strip_prefix("boundary="))
            .map(|s| s.trim_matches('"'))
            .ok_or_else(|| {
                UniqueError::new(StatusCode::BadRequest, "Missing multipart boundary")
            })?;

        parse_multipart(&self.body, boundary)
    }
}

/// Parse a multipart body given a boundary string.
pub fn parse_multipart(body: &[u8], boundary: &str) -> Result<Multipart> {
    let boundary_bytes = format!("--{boundary}");
    let boundary_end_bytes = format!("--{boundary}--");

    let mut parts = Vec::new();
    let mut cursor = 0;

    // Find the first boundary.
    let first_boundary = find_subslice(body, boundary_bytes.as_bytes())
        .ok_or_else(|| UniqueError::new(StatusCode::BadRequest, "Missing initial boundary"))?;
    cursor = first_boundary + boundary_bytes.len();

    loop {
        // Skip CRLF after boundary.
        if cursor + 2 <= body.len() && &body[cursor..cursor + 2] == b"\r\n" {
            cursor += 2;
        } else if cursor + 2 <= body.len() && &body[cursor..cursor + 2] == b"--" {
            // End boundary — we're done.
            break;
        }

        // Find the next boundary.
        let next_boundary = find_subslice(&body[cursor..], boundary_bytes.as_bytes());
        let next_boundary = match next_boundary {
            Some(pos) => cursor + pos,
            None => break,
        };

        // The part body is body[cursor..next_boundary - 2] (strip trailing CRLF).
        let part_end = if next_boundary >= 2 && &body[next_boundary - 2..next_boundary] == b"\r\n" {
            next_boundary - 2
        } else {
            next_boundary
        };
        let part_bytes = &body[cursor..part_end];

        // Parse the part: headers + blank line + body.
        let header_end = find_subslice(part_bytes, b"\r\n\r\n")
            .ok_or_else(|| UniqueError::new(StatusCode::BadRequest, "Malformed multipart part"))?;
        let header_str = std::str::from_utf8(&part_bytes[..header_end])
            .map_err(|_| UniqueError::new(StatusCode::BadRequest, "Invalid UTF-8 in headers"))?;
        let part_body = bytes::Bytes::copy_from_slice(&part_bytes[header_end + 4..]);

        // Parse headers.
        let mut headers = HashMap::new();
        let mut name = String::new();
        let mut filename = None;
        for line in header_str.split("\r\n") {
            if let Some(idx) = line.find(':') {
                let key = line[..idx].trim().to_ascii_lowercase();
                let value = line[idx + 1..].trim().to_string();
                if key == "content-disposition" {
                    // Parse: form-data; name="field"; filename="file.txt"
                    for param in value.split(';').map(|s| s.trim()) {
                        if let Some(v) = param.strip_prefix("name=") {
                            name = v.trim_matches('"').to_string();
                        } else if let Some(v) = param.strip_prefix("filename=") {
                            filename = Some(v.trim_matches('"').to_string());
                        }
                    }
                }
                headers.insert(key, value);
            }
        }

        parts.push(Part {
            name,
            filename,
            headers,
            body: part_body,
        });

        // Check for end boundary.
        if body[cursor..].starts_with(boundary_end_bytes.as_bytes()) {
            break;
        }

        cursor = next_boundary + boundary_bytes.len();
    }

    Ok(Multipart { parts })
}

/// Find a subslice in a slice. Returns the byte index of the first match.
fn find_subslice(haystack: &[u8], needle: &[u8]) -> Option<usize> {
    if needle.is_empty() || needle.len() > haystack.len() {
        return None;
    }
    for i in 0..=haystack.len() - needle.len() {
        if &haystack[i..i + needle.len()] == needle {
            return Some(i);
        }
    }
    None
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::request::Method;

    #[test]
    fn parses_simple_multipart_form() {
        let boundary = "----WebKitFormBoundaryABC123";
        let body = format!(
            "--{boundary}\r\n\
             Content-Disposition: form-data; name=\"field1\"\r\n\r\n\
             value1\r\n\
             --{boundary}\r\n\
             Content-Disposition: form-data; name=\"file\"; filename=\"test.txt\"\r\n\
             Content-Type: text/plain\r\n\r\n\
             hello world\r\n\
             --{boundary}--\r\n"
        );
        let body_bytes = body.as_bytes();

        let multipart = parse_multipart(body_bytes, boundary).unwrap();
        assert_eq!(multipart.parts.len(), 2);

        assert_eq!(multipart.parts[0].name, "field1");
        assert_eq!(multipart.parts[0].filename, None);
        assert_eq!(multipart.parts[0].body, bytes::Bytes::from_static(b"value1"));

        assert_eq!(multipart.parts[1].name, "file");
        assert_eq!(multipart.parts[1].filename.as_deref(), Some("test.txt"));
        assert_eq!(multipart.parts[1].body, bytes::Bytes::from_static(b"hello world"));
        assert_eq!(
            multipart.parts[1].headers.get("content-type"),
            Some(&"text/plain".to_string())
        );
    }

    #[test]
    fn rejects_non_multipart_content_type() {
        let mut req = Request::new(Method::Post, "/upload");
        req.headers
            .push(("content-type".into(), "application/json".into()));
        let result = req.multipart();
        assert!(result.is_err());
    }

    #[test]
    fn rejects_missing_boundary() {
        let mut req = Request::new(Method::Post, "/upload");
        req.headers
            .push(("content-type".into(), "multipart/form-data".into()));
        let result = req.multipart();
        assert!(result.is_err());
    }
}
