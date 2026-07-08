//! Example: ORM usage with the mock database.
//!
//! Run with: `cargo run -p unique-orm --example orm_mock`
//!
//! Demonstrates:
//! - Defining a Model with `#[derive(Model)]`
//! - Inserting rows (auto-incrementing IDs)
//! - Querying with `find().where_eq().one()`
//! - Generating migrations

use unique_macros::Model;
use unique_orm::{Db, Model as ModelTrait, Query};
use serde::{Deserialize, Serialize};

#[derive(Model, Serialize, Deserialize)]
#[table(name = "users")]
struct User {
    #[field(primary, auto_increment)]
    id: i64,
    #[field(unique)]
    email: String,
    #[field(min = 8, sensitive)]
    password: String,
}

#[derive(Model, Serialize, Deserialize)]
#[table(name = "posts")]
struct Post {
    #[field(primary, auto_increment)]
    id: i64,
    title: String,
    #[field(skip)]
    body: String, // not persisted (for demo purposes)
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let db = Db::mock();

    // Insert some users.
    let alice = User {
        id: 0,
        email: "alice@example.com".into(),
        password: "hunter222".into(),
    };
    let bob = User {
        id: 0,
        email: "bob@example.com".into(),
        password: "password123".into(),
    };
    let alice = User::insert(&alice, &db).await?;
    let bob = User::insert(&bob, &db).await?;
    println!("Inserted: alice id={}, bob id={}", alice.id, bob.id);

    // Query all users.
    let all_users = User::all(&db).await?;
    println!("All users ({}):", all_users.len());
    for u in &all_users {
        println!("  id={} email={}", u.id, u.email);
    }

    // Build a query (just to demonstrate the API; the mock driver doesn't
    // actually filter, but real drivers will).
    let _q: Query<User> = Query::select("users")
        .where_eq("email", "alice@example.com")
        .order_desc("id")
        .limit(10);
    let (sql, params) = _q.to_sql();
    println!("Generated SQL: {}", sql);
    println!("Params: {:?}", params);

    // Generate a migration.
    let migration = unique_orm::generate_migration::<User>();
    println!("\nMigration '{}' up SQL:", migration.name);
    for stmt in &migration.up_sql {
        for line in stmt.lines() {
            println!("  {}", line);
        }
    }

    Ok(())
}
