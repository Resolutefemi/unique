// Build script for the Kotlin binding of Kungfu.js
// Publishes to Maven Central as com.kungfu:kungfu
// (Same artifact coordinates as the Java binding — Kotlin is ABI-compatible.)

group = "com.kungfu"
version = "1.0.0"

plugins {
    kotlin("jvm") version "1.9.25"
    `maven-publish`
    `java-library`
}

repositories {
    mavenCentral()
}

dependencies {
    // The Kotlin binding reuses the Java JAR at runtime — Kotlin is fully
    // interoperable with the JVM-based binding.
    implementation("com.kungfu:kungfu:1.0.0")
}

java {
    sourceCompatibility = JavaVersion.VERSION_11
    targetCompatibility = JavaVersion.VERSION_11
    withSourcesJar()
    withJavadocJar()
}

publishing {
    publications {
        create<MavenPublication>("maven") {
            from(components["java"])
            pom {
                name.set("Kungfu.js Kotlin Binding")
                description.set("Kotlin binding for the Kungfu.js polyglot web framework — Rust core, polyglot bindings. Uses JNI via the C ABI.")
                url.set("https://kungfu.js.org")
                licenses {
                    license {
                        name.set("MIT License")
                        url.set("https://opensource.org/licenses/MIT")
                    }
                    license {
                        name.set("Apache License, Version 2.0")
                        url.set("https://www.apache.org/licenses/LICENSE-2.0")
                    }
                }
                developers {
                    developer {
                        name.set("Kungfu.js Contributors")
                        email.set("noreply@kungfu.js.org")
                        organization.set("Kungfu.js")
                        organizationUrl.set("https://kungfu.js.org")
                    }
                }
                scm {
                    connection.set("scm:git:git://github.com/Resolutefemi/kungfu.git")
                    developerConnection.set("scm:git:ssh://github.com:Resolutefemi/kungfu.git")
                    url.set("https://github.com/Resolutefemi/kungfu/tree/main/bindings/kotlin")
                }
            }
        }
    }
}
