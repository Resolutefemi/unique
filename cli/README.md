# unique-cli

The `unique` command-line tool — your one-stop shop for scaffolding, running,
building, migrating, and deploying [Unique.js](https://github.com/Resolutefemi/unique)
apps.

## Install

```bash
cargo install unique-cli
```

## Commands

| Command                          | Description                                                       |
| -------------------------------- | ----------------------------------------------------------------- |
| `unique new <name>`              | Scaffold a new Unique.js project (Rust, JS, TS, Python, Go, …).   |
| `unique start [--watch]`         | Run the dev server. `--watch` enables hot reload.                 |
| `unique build`                   | Build a production binary.                                        |
| `unique migrate`                 | Generate + apply database migrations from `#[derive(Model)]`.    |
| `unique generate admin <Model>`  | Generate an admin CRUD dashboard for a model.                     |
| `unique deploy`                  | Generate Dockerfile, docker-compose.yml, and systemd unit files.  |
| `unique bench`                   | Built-in benchmark server (also: `unique_bench` binary).          |

## Examples

```bash
unique new myapp --lang rust
cd myapp
unique start --watch
```

```bash
unique generate admin User
unique migrate
```

```bash
unique deploy --target docker
unique deploy --target systemd
```

## License

MIT OR Apache-2.0.
