# kungfu-macros

Proc macros for [Kungfu.js](https://github.com/Resolutefemi/kungfu) — the ORM
derive macros.

Provides:

- `#[derive(Model)]` — generates the `Model` trait impl for a struct, including
  `table_name()`, `fields()`, and primary-key detection.
- `#[field(...)]` attributes — `primary_key`, `auto_increment`, `unique`,
  `sensitive` (auto-Argon2id-hash on insert/update), `default`, `indexed`.

Used by [`kungfu-orm`](https://crates.io/crates/kungfu-orm). You normally do
not depend on this crate directly; it is re-exported by `kungfu-orm`.

## Example

```rust
use kungfu_macros::Model;
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, Model)]
pub struct User {
    #[field(primary_key, auto_increment)]
    pub id: i64,
    pub email: String,
    #[field(sensitive)] // auto Argon2id hashed on insert/update
    pub password: String,
    #[field(default = "false")]
    pub is_admin: bool,
    pub created_at: String,
}
```

## License

MIT OR Apache-2.0.
