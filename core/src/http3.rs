//! HTTP/3 server via quinn (QUIC transport) + h3 (HTTP/3 framing).
//!
//! HTTP/3 uses QUIC as the transport instead of TCP. Benefits:
//! - No head-of-line blocking (each stream is independent)
//! - 0-RTT connection resumption
//! - Built-in TLS (no separate TLS layer)
//! - Connection migration (survives network changes)
//!
//! ## Usage
//!
//! Enable the `http3` feature:
//! ```toml
//! unique-core = { features = ["http3"] }
//! ```
//!
//! ```ignore
//! use unique_core::http3::Http3Server;
//! use unique_core::tls::TlsConfig;
//!
//! let tls = TlsConfig::from_files("cert.pem", "key.pem")?;
//! let server = Http3Server::new(router, addr, tls)?;
//! server.serve().await?;
//! ```
//!
//! Note: HTTP/3 requires TLS — there's no unencrypted HTTP/3.
//! The quinn + h3 crates must be available (feature flag `http3`).

#![cfg(feature = "http3")]

use std::net::SocketAddr;
use std::sync::Arc;

use crate::error::{UniqueError, Result};
use crate::router::Router;
use crate::tls::TlsConfig;

/// HTTP/3 server using QUIC transport.
pub struct Http3Server {
    router: Arc<parking_lot::RwLock<Arc<Router>>>,
    addr: SocketAddr,
    tls_config: Arc<rustls::ServerConfig>,
}

impl Http3Server {
    /// Create a new HTTP/3 server.
    ///
    /// HTTP/3 requires TLS — pass a `TlsConfig` with your cert + key.
    pub fn new(router: Router, addr: SocketAddr, tls: TlsConfig) -> Result<Self> {
        let tls_config = tls.to_rustls_config().map_err(|e| {
            UniqueError::internal(format!("TLS config error: {e}"))
        })?;

        Ok(Self {
            router: Arc::new(parking_lot::RwLock::new(Arc::new(router))),
            addr,
            tls_config: Arc::new(tls_config),
        })
    }

    /// Start serving HTTP/3 requests. Blocks forever.
    ///
    /// Listens on UDP (QUIC uses UDP, not TCP). Make sure your firewall
    /// allows UDP traffic on the configured port.
    pub async fn serve(&self) -> Result<()> {
        tracing::info!("unique (HTTP/3) listening on https://{}", self.addr);

        // Create a QUIC endpoint.
        let server_config = quinn::ServerConfig::with_crypto(self.tls_config.clone());
        let endpoint = quinn::Endpoint::server(server_config, self.addr)
            .map_err(|e| UniqueError::internal(format!("QUIC bind: {e}")))?;

        // Accept connections.
        while let Some(incoming) = endpoint.accept().await {
            let router = self.router.read().clone();
            let tls = self.tls_config.clone();

            tokio::spawn(async move {
                match incoming.await {
                    Ok(conn) => {
                        if let Err(e) = handle_h3_connection(conn, router, tls).await {
                            tracing::debug!("HTTP/3 connection error: {e}");
                        }
                    }
                    Err(e) => {
                        tracing::debug!("QUIC connection error: {e}");
                    }
                }
            });
        }

        Ok(())
    }
}

/// Handle a single HTTP/3 connection.
async fn handle_h3_connection(
    conn: quinn::Connection,
    router: Arc<Router>,
    _tls: Arc<rustls::ServerConfig>,
) -> Result<()> {
    // Create an h3 connection driver.
    let mut h3_conn = h3::server::Connection::new(h3_quinn::Connection::new(conn))
        .await
        .map_err(|e| UniqueError::internal(format!("h3 connection: {e}")))?;

    // Accept requests on this connection.
    while let Ok((req_stream, req)) = h3_conn.accept().await {
        let router = router.clone();

        tokio::spawn(async move {
            // Parse the HTTP/3 request.
            let method = req.method();
            let path = req.uri().path();
            let headers = req.headers();

            // Convert to our Request type.
            let core_method = match method.as_str() {
                "GET" => crate::Method::Get,
                "POST" => crate::Method::Post,
                "PUT" => crate::Method::Put,
                "DELETE" => crate::Method::Delete,
                "PATCH" => crate::Method::Patch,
                _ => crate::Method::Get,
            };

            // Resolve the route.
            let resolution = router.resolve(core_method, path);
            let handler = match resolution {
                crate::router::RouteResolution::Found { handler, params, .. } => {
                    // Build the request.
                    let mut request = crate::Request::new(core_method, path);
                    request.params = params;
                    request.headers = headers
                        .iter()
                        .map(|(k, v)| (k.to_string(), v.to_str().unwrap_or("").to_string()))
                        .collect();
                    // Dispatch.
                    let resp = handler(request).await;

                    // Send the response back via h3.
                    let _ = send_h3_response(req_stream, resp).await;
                    continue;
                }
                _ => {
                    let _ = send_h3_error(req_stream, 404, "Not Found").await;
                    continue;
                }
            };
        });
    }

    Ok(())
}

/// Send an HTTP/3 response.
async fn send_h3_response(
    mut stream: h3::server::RequestStream<
        h3_quinn::BidiStream,
        bytes::Bytes,
    >,
    resp: crate::Response,
) -> Result<()> {
    use h3::quic::BidiStream;

    // Build response headers.
    let mut headers = vec![(
        ":status".to_string(),
        resp.status.as_u16().to_string(),
    )];
    for (k, v) in &resp.headers {
        headers.push((k.clone(), v.clone()));
    }

    // Send headers.
    stream
        .send_headers(headers)
        .await
        .map_err(|e| UniqueError::internal(format!("h3 send headers: {e}")))?;

    // Send body.
    if !resp.body.is_empty() {
        stream
            .send_data(bytes::Bytes::copy_from_slice(&resp.body))
            .await
            .map_err(|e| UniqueError::internal(format!("h3 send data: {e}")))?;
    }

    // Finish the stream.
    stream
        .finish()
        .await
        .map_err(|e| UniqueError::internal(format!("h3 finish: {e}")))?;

    Ok(())
}

/// Send an HTTP/3 error response.
async fn send_h3_error(
    stream: h3::server::RequestStream<
        h3_quinn::BidiStream,
        bytes::Bytes,
    >,
    status: u16,
    message: &str,
) -> Result<()> {
    let resp = crate::Response::new()
        .status(crate::StatusCode::from(status))
        .json(&serde_json::json!({
            "error": {
                "code": status,
                "message": message,
            }
        }));
    send_h3_response(stream, resp).await
}
