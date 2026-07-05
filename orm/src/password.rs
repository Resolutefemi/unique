//! Password hashing with Argon2id.
//!
//! Used by the ORM to auto-hash `sensitive` fields (e.g. passwords) on
//! insert. Provides:
//!   - `hash_password(plain) -> Result<String>` — Argon2id with random salt
//!   - `verify_password(plain, hash) -> Result<bool>` — verify a hash
//!
//! ## Example
//!
//! ```ignore
//! use kungfu_orm::password::{hash_password, verify_password};
//!
//! let hash = hash_password("hunter222")?;
//! assert!(verify_password("hunter222", &hash)?);
//! assert!(!verify_password("wrong", &hash)?);
//! ```

use argon2::password_hash::{
    rand_core::OsRng, PasswordHash, PasswordHasher, PasswordVerifier, SaltString,
};
use argon2::Argon2;

use crate::error::{Error, Result};

/// Hash a plaintext password using Argon2id with a random 32-byte salt.
/// The returned string is in PHC format (`$argon2id$v=19$m=...`) and can
/// be stored directly in a database column.
pub fn hash_password(plain: &str) -> Result<String> {
    let salt = SaltString::generate(&mut OsRng);
    let argon2 = Argon2::default();
    argon2
        .hash_password(plain.as_bytes(), &salt)
        .map(|h| h.to_string())
        .map_err(|e| Error::Validation(format!("password hashing failed: {e}")))
}

/// Verify a plaintext password against a PHC-format hash.
/// Returns `Ok(true)` if the password matches, `Ok(false)` if it doesn't.
pub fn verify_password(plain: &str, hash: &str) -> Result<bool> {
    let parsed = PasswordHash::new(hash)
        .map_err(|e| Error::Validation(format!("invalid password hash: {e}")))?;
    Ok(Argon2::default()
        .verify_password(plain.as_bytes(), &parsed)
        .is_ok())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn hash_and_verify_password() {
        let hash = hash_password("hunter222").unwrap();
        assert!(hash.starts_with("$argon2id$"));
        assert!(verify_password("hunter222", &hash).unwrap());
    }

    #[test]
    fn rejects_wrong_password() {
        let hash = hash_password("correct horse battery staple").unwrap();
        assert!(!verify_password("wrong password", &hash).unwrap());
    }

    #[test]
    fn each_hash_has_unique_salt() {
        let h1 = hash_password("same").unwrap();
        let h2 = hash_password("same").unwrap();
        assert_ne!(h1, h2, "same password should produce different hashes due to random salt");
        assert!(verify_password("same", &h1).unwrap());
        assert!(verify_password("same", &h2).unwrap());
    }

    #[test]
    fn rejects_invalid_hash() {
        let result = verify_password("anything", "not a valid hash");
        assert!(result.is_err());
    }
}
