# Kotlin binding for Kungfu.js (JVM)

## Install

```kotlin
// build.gradle.kts
dependencies {
    implementation("com.kng:kungfu:1.0.0")
}
```

## Quickstart

```kotlin
import com.kng.Kungfu

fun main() {
    val app = Kungfu()

    app.get("/hello") { req, res ->
        res.status(200).text("world")
    }

    app.listen(3000)
}
```

## Requirements
- Kotlin 1.9+
- JVM 17+
- libkungfu_core.so / .dll / .dylib

## Package
- **Maven Central:** `com.kng:kungfu`
- **Extension:** `.kt`
