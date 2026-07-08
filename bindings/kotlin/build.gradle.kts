// Build script for the Kotlin binding of Unique.js
// Publishes to Maven Central as com.unique:unique
// (Same artifact coordinates as the Java binding — Kotlin is ABI-compatible.)

group = "com.unique"
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
    implementation("com.unique:unique:1.0.0")
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
                name.set("Unique.js Kotlin Binding")
                description.set("Kotlin binding for the Unique.js polyglot web framework — Rust core, polyglot bindings. Uses JNI via the C ABI.")
                url.set("https://unique.js.org")
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
                        name.set("Unique.js Contributors")
                        email.set("noreply@unique.js.org")
                        organization.set("Unique.js")
                        organizationUrl.set("https://unique.js.org")
                    }
                }
                scm {
                    connection.set("scm:git:git://github.com/Resolutefemi/unique.git")
                    developerConnection.set("scm:git:ssh://github.com:Resolutefemi/unique.git")
                    url.set("https://github.com/Resolutefemi/unique/tree/main/bindings/kotlin")
                }
            }
        }
    }
}
