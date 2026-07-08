//! Framework version constant.

pub const VERSION: &str = "1.0.0";
pub const NAME: &str = "unique";

/// Returns `unique/1.0.0` for use in `Server` and `X-Powered-By` headers.
pub fn banner() -> String {
    format!("{NAME}/{VERSION}")
}
