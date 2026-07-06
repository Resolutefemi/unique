# kungfu-orm

The built-in ORM for [Kungfu.js](https://github.com/Resolutefemi/kungfu).

`kungfu-orm` provides CRUD, JOINs, transactions, query builder, Argon2id
password hashing, and migration generation. It works with SQLite, PostgreSQL,
and MySQL behind a single async API.

## Feature flags

| Feature   | Database driver              |
| --------- | ---------------------------- |
| `sqlite`  | `sqlx` with SQLite backend   |
| `postgres`| `sqlx` with Postgres backend |
| `mysql`   | `sqlx` with MySQL backend    |

## Quick start

```toml
[dependencies]
kungfu-orm = { version = "1", features = ["sqlite"] }
kungfu-macros = "1"
tokio = { version = "1", features = ["full"] }
serde = { version = "1", features = ["derive"] }
```

```rust
use kungfu_orm::{Db, DbConfig, Model};
use kungfu_macros::Model;
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, Model)]
pub struct User {
    #[field(primary_key, auto_increment)]
    pub id: i64,
    pub email: String,
    #[field(sensitive)]
    pub password: String,
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let db = Db::connect(DbConfig {
        url: "sqlite://app.db".into(),
        ..Default::default()
    }).await?;

    // CREATE TABLE users (id INTEGER PRIMARY KEY, email TEXT, password TEXT);
    db.migrate(&[User::create_table_sql()]).await?;

    let u = User { id: 0, email: "a@b.c".into(), password: "hunter2".into() };
    let inserted = u.insert(&db).await?;        // password is Argon2id-hashed
    let found = User::find_by_pk(inserted.id, &db).await?;
    let _count = User::count(&db).await?;
    Ok(())
}
```

## License

MIT OR Apache-2.0.
