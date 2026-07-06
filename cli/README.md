# kungfu-cli

The `kungfu` command-line tool — your one-stop shop for scaffolding, running,
building, migrating, and deploying [Kungfu.js](https://github.com/Resolutefemi/kungfu)
apps.

## Install

```bash
cargo install kungfu-cli
```

## Commands

| Command                          | Description                                                       |
| -------------------------------- | ----------------------------------------------------------------- |
| `kungfu new <name>`              | Scaffold a new Kungfu.js project (Rust, JS, TS, Python, Go, …).   |
| `kungfu start [--watch]`         | Run the dev server. `--watch` enables hot reload.                 |
| `kungfu build`                   | Build a production binary.                                        |
| `kungfu migrate`                 | Generate + apply database migrations from `#[derive(Model)]`.    |
| `kungfu generate admin <Model>`  | Generate an admin CRUD dashboard for a model.                     |
| `kungfu deploy`                  | Generate Dockerfile, docker-compose.yml, and systemd unit files.  |
| `kungfu bench`                   | Built-in benchmark server (also: `kungfu_bench` binary).          |

## Examples

```bash
kungfu new myapp --lang rust
cd myapp
kungfu start --watch
```

```bash
kungfu generate admin User
kungfu migrate
```

```bash
kungfu deploy --target docker
kungfu deploy --target systemd
```

## License

MIT OR Apache-2.0.
