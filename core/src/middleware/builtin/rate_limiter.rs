//! Leaky-bucket rate limiter, keyed by client IP.
//!
//! Per spec: 100 req/s by default, per IP, per route. Implemented with a
//! `DashMap<String, LeakyBucket>` — bucket state lives behind a lock per
//! IP, so hot IPs don't block cold ones.

use std::sync::Arc;
use std::time::Instant;

use dashmap::DashMap;
use parking_lot::Mutex;

use crate::middleware::{Middleware, Next};
use crate::request::Request;
use crate::response::Response;

struct LeakyBucket {
    capacity: f64,
    tokens: f64,
    refill_per_sec: f64,
    last_refill: Instant,
}

impl LeakyBucket {
    fn new(capacity: f64, refill_per_sec: f64) -> Self {
        Self {
            capacity,
            tokens: capacity,
            refill_per_sec,
            last_refill: Instant::now(),
        }
    }

    /// Returns true if a request is allowed; consumes a token if so.
    fn allow(&mut self) -> bool {
        let now = Instant::now();
        let elapsed = now.duration_since(self.last_refill).as_secs_f64();
        self.tokens = (self.tokens + elapsed * self.refill_per_sec).min(self.capacity);
        self.last_refill = now;
        if self.tokens >= 1.0 {
            self.tokens -= 1.0;
            true
        } else {
            false
        }
    }
}

#[derive(Clone)]
pub struct RateLimiterConfig {
    pub capacity: f64,
    pub refill_per_sec: f64,
}

impl Default for RateLimiterConfig {
    fn default() -> Self {
        // 100 req/s sustained, burst of 200.
        Self {
            capacity: 200.0,
            refill_per_sec: 100.0,
        }
    }
}

pub fn rate_limiter() -> Middleware {
    rate_limiter_with(RateLimiterConfig::default())
}

pub fn rate_limiter_with(config: RateLimiterConfig) -> Middleware {
    let buckets: Arc<DashMap<String, Arc<Mutex<LeakyBucket>>>> = Arc::new(DashMap::new());
    let config = Arc::new(config);

    Arc::new(move |req: Request, next: Next| {
        let buckets = buckets.clone();
        let config = config.clone();
        Box::pin(async move {
            let ip = req
                .remote_addr
                .map(|a| a.ip().to_string())
                .unwrap_or_else(|| "unknown".to_string());
            let key = format!("{}|{}", ip, req.path);

            let allowed = {
                let entry = buckets
                    .entry(key.clone())
                    .or_insert_with(|| {
                        Arc::new(Mutex::new(LeakyBucket::new(
                            config.capacity,
                            config.refill_per_sec,
                        )))
                    })
                    .clone();
                let mut bucket = entry.lock();
                bucket.allow()
            };

            if !allowed {
                let mut resp = Response::new().error(crate::error::KungfuError::too_many_requests(
                    "Rate limit exceeded. Slow down and retry shortly.",
                ));
                resp.set_header("retry-after", "1");
                return resp;
            }
            next(req).await
        })
    })
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::request::{Method, Request};
    use std::net::{Ipv4Addr, SocketAddr, SocketAddrV4};

    fn make_req() -> Request {
        let mut r = Request::new(Method::Get, "/");
        r.remote_addr = Some(SocketAddr::V4(SocketAddrV4::new(
            Ipv4Addr::new(127, 0, 0, 1),
            1234,
        )));
        r
    }

    #[tokio::test]
    async fn allows_under_limit_blocks_over() {
        let mw = rate_limiter_with(RateLimiterConfig {
            capacity: 3.0,
            refill_per_sec: 0.0, // no refill during test
        });
        let handler: crate::router::Handler = Arc::new(|_r| {
            Box::pin(async { Response::new().text("ok") })
        });
        let next = crate::middleware::build_chain(&[mw.clone()], handler);

        // 3 should pass, the 4th should be blocked.
        for _ in 0..3 {
            let resp = next(make_req()).await;
            assert_eq!(resp.status, crate::error::StatusCode::Ok);
        }
        let resp = next(make_req()).await;
        assert_eq!(resp.status, crate::error::StatusCode::TooManyRequests);
    }

    #[test]
    fn leaky_bucket_refills_over_time() {
        let mut bucket = LeakyBucket::new(2.0, 100.0);
        assert!(bucket.allow());
        assert!(bucket.allow());
        assert!(!bucket.allow());
        std::thread::sleep(std::time::Duration::from_millis(20));
        assert!(bucket.allow()); // refilled
    }
}
