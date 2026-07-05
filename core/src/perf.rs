//! Connection-per-thread scheduling hint.
//!
//! When enabled, each TCP connection is pinned to the acceptor thread that
//! accepted it. This eliminates cross-thread wakeups and improves cache locality.
//!
//! This is already the behavior of the io_uring path. For the tokio epoll path,
//! this module provides a `pin_connection` flag that controls whether the
//! connection handler is spawned on the current thread or the global pool.

use std::sync::atomic::{AtomicBool, Ordering};
use std::sync::Arc;

/// Global flag controlling connection-per-thread scheduling.
static CONNECTION_PINNING: AtomicBool = AtomicBool::new(false);

/// Enable connection-per-thread scheduling.
pub fn enable_connection_pinning() {
    CONNECTION_PINNING.store(true, Ordering::Relaxed);
}

/// Check if connection pinning is enabled.
pub fn is_connection_pinning_enabled() -> bool {
    CONNECTION_PINNING.load(Ordering::Relaxed)
}

/// Batched writev support — accumulate multiple responses and write them
/// in a single `writev` syscall.
///
/// V1: the io_uring path already does single-syscall writes. This module
/// provides the API for batching multiple responses on a single connection
/// (HTTP/1.1 pipelining). Full implementation requires tracking response
/// boundaries, which is planned for V1.1.
pub struct BatchedWriter {
    buffers: Vec<bytes::Bytes>,
    total_size: usize,
}

impl BatchedWriter {
    pub fn new() -> Self {
        Self {
            buffers: Vec::new(),
            total_size: 0,
        }
    }

    pub fn push(&mut self, data: bytes::Bytes) {
        self.total_size += data.len();
        self.buffers.push(data);
    }

    pub fn total_size(&self) -> usize {
        self.total_size
    }

    pub fn is_empty(&self) -> bool {
        self.buffers.is_empty()
    }

    /// Consume the batch and return all buffers for writev.
    pub fn into_buffers(self) -> Vec<bytes::Bytes> {
        self.buffers
    }

    /// Flatten into a single buffer (fallback for platforms without writev).
    pub fn into_flattened(self) -> bytes::Bytes {
        let mut out = Vec::with_capacity(self.total_size);
        for buf in &self.buffers {
            out.extend_from_slice(buf);
        }
        bytes::Bytes::from(out)
    }
}

impl Default for BatchedWriter {
    fn default() -> Self {
        Self::new()
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn batched_writer_accumulates() {
        let mut bw = BatchedWriter::new();
        bw.push(bytes::Bytes::from_static(b"hello "));
        bw.push(bytes::Bytes::from_static(b"world"));
        assert_eq!(bw.total_size(), 11);
        assert_eq!(bw.into_flattened(), bytes::Bytes::from_static(b"hello world"));
    }

    #[test]
    fn connection_pinning_flag() {
        assert!(!is_connection_pinning_enabled());
        enable_connection_pinning();
        assert!(is_connection_pinning_enabled());
    }
}
