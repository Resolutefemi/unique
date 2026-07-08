//! TLS/HTTPS support via `rustls`.
//!
//! Wraps the TCP listener with TLS termination so the server can serve
//! HTTPS directly without a reverse proxy.
//!
//! ## Example
//!
//! ```ignore
//! use unique::tls::TlsConfig;
//!
//! Unique::new()
//!     .tls(TlsConfig::from_files("cert.pem", "key.pem"))
//!     .handle_get("/hello", |_req, res| res.text("world"))
//!     .run("0.0.0.0:3443")
//! ```
//!
//! ## Self-signed certs (dev only)
//!
//! ```bash
//! openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem \
//!   -days 365 -nodes -subj "/CN=localhost"
//! ```

use std::path::PathBuf;
use std::sync::Arc;

/// TLS configuration for HTTPS.
#[derive(Debug, Clone)]
pub struct TlsConfig {
    /// Path to the PEM-encoded certificate chain file.
    pub cert_path: PathBuf,
    /// Path to the PEM-encoded private key file.
    pub key_path: PathBuf,
}

impl TlsConfig {
    /// Create a TLS config from certificate + key file paths.
    pub fn from_files(cert: impl Into<PathBuf>, key: impl Into<PathBuf>) -> Self {
        Self {
            cert_path: cert.into(),
            key_path: key.into(),
        }
    }

    /// Load the certificate + key into a `rustls::ServerConfig`.
    /// Returns an error if the files can't be read or are invalid.
    pub fn to_rustls_config(&self) -> Result<Arc<rustls::ServerConfig>, TlsError> {
        let certs = load_certs(&self.cert_path)?;
        let key = load_private_key(&self.key_path)?;

        let config = rustls::ServerConfig::builder()
            .with_no_client_auth()
            .with_single_cert(certs, key)
            .map_err(|e| TlsError::InvalidConfig(e.to_string()))?;

        Ok(Arc::new(config))
    }
}

/// Errors from TLS configuration.
#[derive(Debug)]
pub enum TlsError {
    Io(String),
    InvalidCert(String),
    InvalidKey(String),
    InvalidConfig(String),
}

impl std::fmt::Display for TlsError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            TlsError::Io(s) => write!(f, "TLS IO error: {s}"),
            TlsError::InvalidCert(s) => write!(f, "Invalid certificate: {s}"),
            TlsError::InvalidKey(s) => write!(f, "Invalid private key: {s}"),
            TlsError::InvalidConfig(s) => write!(f, "Invalid TLS config: {s}"),
        }
    }
}

impl std::error::Error for TlsError {}

fn load_certs(path: &std::path::Path) -> Result<Vec<rustls::pki_types::CertificateDer<'static>>, TlsError> {
    let file = std::fs::File::open(path).map_err(|e| TlsError::Io(format!("cert file: {e}")))?;
    let mut reader = std::io::BufReader::new(file);
    rustls_pemfile::certs(&mut reader)
        .collect::<Result<Vec<_>, _>>()
        .map_err(|e| TlsError::InvalidCert(e.to_string()))
}

fn load_private_key(path: &std::path::Path) -> Result<rustls::pki_types::PrivateKeyDer<'static>, TlsError> {
    let file = std::fs::File::open(path).map_err(|e| TlsError::Io(format!("key file: {e}")))?;
    let mut reader = std::io::BufReader::new(file);

    // Try PKCS8 first, then RSA, then EC.
    if let Ok(Some(key)) = rustls_pemfile::private_key(&mut reader) {
        return Ok(key);
    }

    Err(TlsError::InvalidKey(
        "No supported private key found in file. Expected PKCS8, RSA, or EC PEM.".into(),
    ))
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn tls_config_from_files() {
        let config = TlsConfig::from_files("cert.pem", "key.pem");
        assert_eq!(config.cert_path.to_str(), Some("cert.pem"));
        assert_eq!(config.key_path.to_str(), Some("key.pem"));
    }

    #[test]
    fn missing_cert_file_returns_error() {
        let config = TlsConfig::from_files("/nonexistent/cert.pem", "/nonexistent/key.pem");
        let result = config.to_rustls_config();
        assert!(result.is_err());
    }
}
