//! Built-in JWT authentication.
//!
//! Provides:
//!   - `JwtService` — sign and verify JWTs with HS256/HS384/HS512
//!   - `auth_jwt(config)` — middleware that verifies `Authorization: Bearer <token>`
//!     headers and rejects invalid/expired tokens with 401.
//!
//! ## Example
//!
//! ```ignore
//! use unique::auth::{JwtService, JwtConfig, auth_jwt};
//!
//! let jwt = JwtService::new("my-secret-key");
//!
//! // Sign a token:
//! let token = jwt.sign(&serde_json::json!({"sub":"user123","exp":1700000000})).unwrap();
//!
//! // Protect routes:
//! Unique::new()
//!     .use_middleware(auth_jwt(JwtConfig::new("my-secret-key")))
//!     .handle_get("/protected", |_req, res| res.text("secret data"))
//! ```

use std::sync::Arc;

use jsonwebtoken::{decode, encode, DecodingKey, EncodingKey, Header, Validation};
use serde::{Deserialize, Serialize};

use crate::middleware::{Middleware, Next};
use crate::request::Request;
use crate::response::Response;

/// JWT service — signs and verifies tokens.
#[derive(Clone)]
pub struct JwtService {
    secret: String,
    encoding_key: Arc<EncodingKey>,
    decoding_key: Arc<DecodingKey>,
}

impl JwtService {
    /// Create a new JWT service with the given HS256 secret.
    pub fn new(secret: impl Into<String>) -> Self {
        let secret = secret.into();
        Self {
            encoding_key: Arc::new(EncodingKey::from_secret(secret.as_bytes())),
            decoding_key: Arc::new(DecodingKey::from_secret(secret.as_bytes())),
            secret,
        }
    }

    /// Sign a JWT with the given claims. Returns the encoded token string.
    pub fn sign(&self, claims: &impl Serialize) -> Result<String, JwtError> {
        encode(&Header::default(), claims, &self.encoding_key)
            .map_err(|e| JwtError::Sign(e.to_string()))
    }

    /// Verify a JWT and return the decoded claims.
    pub fn verify<T: for<'de> Deserialize<'de>>(&self, token: &str) -> Result<T, JwtError> {
        let token_data = decode::<T>(token, &self.decoding_key, &Validation::default())
            .map_err(|e| JwtError::Verify(e.to_string()))?;
        Ok(token_data.claims)
    }

    /// Verify a JWT and return the claims as a raw `serde_json::Value`.
    pub fn verify_value(&self, token: &str) -> Result<serde_json::Value, JwtError> {
        self.verify::<serde_json::Value>(token)
    }

    /// Get the secret (for middleware construction).
    pub fn secret(&self) -> &str {
        &self.secret
    }
}

/// Errors from JWT operations.
#[derive(Debug)]
pub enum JwtError {
    Sign(String),
    Verify(String),
}

impl std::fmt::Display for JwtError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            JwtError::Sign(s) => write!(f, "JWT sign error: {s}"),
            JwtError::Verify(s) => write!(f, "JWT verify error: {s}"),
        }
    }
}

impl std::error::Error for JwtError {}

/// Configuration for JWT authentication middleware.
#[derive(Debug, Clone)]
pub struct JwtConfig {
    /// The HS256 secret used to verify tokens.
    pub secret: String,
    /// The header name to read the token from (default: `authorization`).
    pub header_name: String,
    /// The expected prefix (default: `Bearer `).
    pub prefix: String,
    /// Paths that don't require auth (e.g. `/login`, `/signup`).
    pub public_paths: Vec<String>,
}

impl JwtConfig {
    pub fn new(secret: impl Into<String>) -> Self {
        Self {
            secret: secret.into(),
            header_name: "authorization".into(),
            prefix: "Bearer ".into(),
            public_paths: Vec::new(),
        }
    }

    pub fn public_path(mut self, path: impl Into<String>) -> Self {
        self.public_paths.push(path.into());
        self
    }
}

/// Create a JWT authentication middleware.
///
/// Verifies the `Authorization: Bearer <token>` header on every request.
/// If the token is valid, the decoded claims are available via the
/// `x-jwt-claims` response header (V1 workaround — V1.1 will add request
/// extensions). If invalid or missing, returns 401.
pub fn auth_jwt(config: JwtConfig) -> Middleware {
    let service = Arc::new(JwtService::new(config.secret.clone()));
    let header_name = config.header_name.clone();
    let prefix = config.prefix.clone();
    let public_paths = Arc::new(config.public_paths);

    Arc::new(move |req: Request, next: Next| {
        let service = service.clone();
        let header_name = header_name.clone();
        let prefix = prefix.clone();
        let public_paths = public_paths.clone();

        Box::pin(async move {
            // Skip auth for public paths.
            if public_paths.iter().any(|p| req.path == *p) {
                return next(req).await;
            }

            // Extract the token.
            let header_value = match req.header(&header_name) {
                Some(v) => v.to_string(),
                None => {
                    return Response::new()
                        .status(crate::StatusCode::Unauthorized)
                        .json(&serde_json::json!({
                            "error": {
                                "code": 401,
                                "message": "Missing Authorization header",
                                "detail": format!("Expected: {}: {}<token>", header_name, prefix),
                                "suggestion": "Include a valid JWT in the Authorization header.",
                            }
                        }));
                }
            };

            let token = match header_value.strip_prefix(&prefix) {
                Some(t) => t.trim(),
                None => &header_value,
            };

            // Verify the token using real HS256 signature verification.
            match service.verify_value(token) {
                Ok(claims) => {
                    let claims_str = claims.to_string();
                    let mut resp = next(req).await;
                    // Attach decoded claims to the response (V1 workaround).
                    resp.set_header("x-jwt-claims", &claims_str);
                    resp
                }
                Err(e) => {
                    Response::new()
                        .status(crate::StatusCode::Unauthorized)
                        .json(&serde_json::json!({
                            "error": {
                                "code": 401,
                                "message": "Invalid or expired JWT",
                                "detail": e.to_string(),
                                "suggestion": "Ensure your token is valid and not expired.",
                            }
                        }))
                }
            }
        })
    })
}

#[cfg(test)]
mod tests {
    use super::*;
    use serde::{Deserialize, Serialize};

    #[derive(Serialize, Deserialize, PartialEq, Debug)]
    struct Claims {
        sub: String,
        exp: usize,
    }

    #[test]
    fn sign_and_verify_jwt() {
        let jwt = JwtService::new("test-secret");
        let claims = Claims {
            sub: "user123".into(),
            exp: 9999999999, // far future
        };
        let token = jwt.sign(&claims).unwrap();
        assert!(token.split('.').count() == 3);

        let decoded: Claims = jwt.verify(&token).unwrap();
        assert_eq!(decoded, claims);
    }

    #[test]
    fn rejects_tampered_token() {
        let jwt = JwtService::new("test-secret");
        let claims = Claims {
            sub: "user123".into(),
            exp: 9999999999,
        };
        let token = jwt.sign(&claims).unwrap();

        // Tamper: change the secret.
        let wrong_jwt = JwtService::new("wrong-secret");
        let result: Result<Claims, _> = wrong_jwt.verify(&token);
        assert!(result.is_err(), "should reject token signed with different secret");
    }

    #[test]
    fn rejects_expired_token() {
        let jwt = JwtService::new("test-secret");
        let claims = Claims {
            sub: "user123".into(),
            exp: 1, // expired in 1970
        };
        let token = jwt.sign(&claims).unwrap();
        let result: Result<Claims, _> = jwt.verify(&token);
        assert!(result.is_err(), "should reject expired token");
    }

    #[test]
    fn rejects_garbage_token() {
        let jwt = JwtService::new("test-secret");
        let result: Result<serde_json::Value, _> = jwt.verify_value("not.a.valid.token");
        assert!(result.is_err());
    }

    #[test]
    fn verify_value_works() {
        let jwt = JwtService::new("my-secret");
        let claims = serde_json::json!({"sub":"alice","role":"admin","exp":9999999999_i64});
        let token = jwt.sign(&claims).unwrap();
        let decoded = jwt.verify_value(&token).unwrap();
        assert_eq!(decoded["sub"], "alice");
        assert_eq!(decoded["role"], "admin");
    }
}
