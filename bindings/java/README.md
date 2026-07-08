# unique (Java)

> One API surface, infinite languages. The Java binding for the Unique.js framework.

## Status: Scaffold

V1 ships a scaffold of the Java binding. The actual JNI implementation
requires the C ABI (`unique.h`) plus a C++ JNI bridge — currently a TODO.
For now, Java users can call into the C ABI directly via [JNA](https://github.com/java-native-access/jna).

## Install

```bash
# Build the native library with the ffi feature:
cargo build -p unique-core --release --features ffi

# The Java side is plain Maven/Gradle. Copy the .java files into your
# project under src/main/java/com/unique/, and ensure the native library
# is on java.library.path.
```

## Quickstart

```java
import com.kng.Unique;
import com.kng.Request;
import com.kng.Response;

public class Main {
    public main() {
        Unique app = new Unique();
        app.get("/hello", (req, res) -> {
            res.status(200).json("{\"message\":\"world\"}");
        });
        app.listen(3000);
    }
}
```

## License

MIT OR Apache-2.0.
