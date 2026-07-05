//! ORM errors.

use thiserror::Error;

#[derive(Error, Debug)]
pub enum Error {
    #[error("database error: {0}")]
    Database(String),

    #[error("validation error: {0}")]
    Validation(String),

    #[error("not found")]
    NotFound,

    #[error("connection pool exhausted")]
    PoolExhausted,

    #[error("migration error: {0}")]
    Migration(String),

    #[error("serialisation error: {0}")]
    Serde(#[from] serde_json::Error),

    #[error("no driver configured — enable one of the `postgres`, `mysql`, or `sqlite` features on kungfu-orm")]
    NoDriver,
}

pub type Result<T> = std::result::Result<T, Error>;

impl From<kungfu_core::KungfuError> for Error {
    fn from(e: kungfu_core::KungfuError) -> Self {
        Error::Database(e.to_string())
    }
}
