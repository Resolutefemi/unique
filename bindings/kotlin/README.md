# Kotlin binding for Kungfu.js (JVM)

## Install

```kotlin
// build.gradle.kts
dependencies {
    implementation("com.kungfu:kungfu:1.0.0")
}
```

## Quickstart

```kotlin
import com.kungfu.Kungfu

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
- **Maven Central:** `com.kungfu:kungfu`
- **Extension:** `.kt`
