# Kotlin binding for Unique.js (JVM)

## Install

```kotlin
// build.gradle.kts
dependencies {
    implementation("com.kng:unique:1.0.0")
}
```

## Quickstart

```kotlin
import com.kng.Unique

fun main() {
    val app = Unique()

    app.get("/hello") { req, res ->
        res.status(200).text("world")
    }

    app.listen(3000)
}
```

## Requirements
- Kotlin 1.9+
- JVM 17+
- libunique_core.so / .dll / .dylib

## Package
- **Maven Central:** `com.kng:unique`
- **Extension:** `.kt`
