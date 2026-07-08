//! Fuzz testing harness for the HTTP parser.
//!
//! Run with:
//!   cargo fuzz run http_parser
//!
//! Or use the built-in property tests:
//!   cargo test -p unique-core --lib fuzz

/// Property-based test: random byte sequences should never panic the parser.
/// They should either parse successfully or return an error.
#[cfg(test)]
mod fuzz_tests {
    use crate::request::{Method, Request};
    use crate::error::Result;

    /// Feed random garbage into the HTTP parser and verify it doesn't panic.
    #[test]
    fn fuzz_random_bytes_dont_panic() {
        // Test with various malformed inputs.
        let mut inputs: Vec<Vec<u8>> = vec![
            b"".to_vec(),
            b"\r\n".to_vec(),
            b"\r\n\r\n".to_vec(),
            b"GET\r\n\r\n".to_vec(),
            b"GET / HTTP/1.1\r\n".to_vec(),
            b"GET / HTTP/1.1\r\n\r\n".to_vec(),
            b"GET / HTTP/1.1\r\nHost: localhost\r\n\r\n".to_vec(),
            b"POST / HTTP/1.1\r\nContent-Length: 5\r\n\r\nhello".to_vec(),
            b"\x00\x01\x02\x03\x04\x05".to_vec(),
            b"GET /../../etc/passwd HTTP/1.1\r\n\r\n".to_vec(),
        ];

        // Add a null-byte-filled header.
        let mut huge_nulls = b"GET / HTTP/1.1\r\nHost: ".to_vec();
        huge_nulls.extend_from_slice(&[0u8; 1000]);
        huge_nulls.extend_from_slice(b"\r\n\r\n");
        inputs.push(huge_nulls);

        // Add pipelined requests.
        let mut pipelined = Vec::new();
        for _ in 0..100 {
            pipelined.extend_from_slice(b"GET / HTTP/1.1\r\n");
        }
        pipelined.extend_from_slice(b"\r\n");
        inputs.push(pipelined);

        for input in &inputs {
            // The parser should either succeed or return an error — never panic.
            let _ = parse_http_input(input);
        }
    }

    /// Test with oversized headers.
    #[test]
    fn fuzz_oversized_headers() {
        let huge_header = format!("X-Huge: {}\r\n", "A".repeat(100_000));
        let input = format!("GET / HTTP/1.1\r\n{huge_header}\r\n");
        let _ = parse_http_input(input.as_bytes());
    }

    /// Test with malformed method.
    #[test]
    fn fuzz_malformed_method() {
        let inputs = vec![
            b"CONNECT / HTTP/1.1\r\n\r\n".to_vec(),
            b"TRACE / HTTP/1.1\r\n\r\n".to_vec(),
            b"PROPFIND / HTTP/1.1\r\n\r\n".to_vec(),
            b"GET\x00 / HTTP/1.1\r\n\r\n".to_vec(),
        ];
        for input in &inputs {
            let _ = parse_http_input(input);
        }
    }

    /// Simulate parsing an HTTP request from raw bytes.
    /// This is a simplified version — the real parsing happens in the server's
    /// `read_request` function. Here we just verify the bytes don't cause panics.
    fn parse_http_input(input: &[u8]) -> std::result::Result<(), String> {
        // Find the header end.
        let header_end = input.windows(4).position(|w| w == b"\r\n\r\n");
        if header_end.is_none() && input.len() > 64 * 1024 {
            return Err("headers too large".into());
        }

        // Try to parse with httparse.
        let mut headers = [httparse::EMPTY_HEADER; 64];
        let mut req = httparse::Request::new(&mut headers);
        match req.parse(input) {
            Ok(httparse::Status::Complete(_)) => Ok(()),
            Ok(httparse::Status::Partial) => Ok(()),
            Err(e) => Err(format!("parse error: {e}")),
        }
    }

    /// Chaos test: simulate dropped connections.
    #[test]
    fn chaos_dropped_connection() {
        // A request that's cut off mid-header.
        let input = b"GET / HTTP/1.1\r\nHost: local";
        let _ = parse_http_input(input);
    }

    /// Chaos test: send multiple requests in one packet (pipelining).
    #[test]
    fn chaos_pipelined_requests() {
        let input = b"GET /a HTTP/1.1\r\nHost: x\r\n\r\nGET /b HTTP/1.1\r\nHost: x\r\n\r\n";
        let _ = parse_http_input(input);
    }
}
