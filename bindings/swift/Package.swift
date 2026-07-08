// swift-tools-version: 5.9
import PackageDescription

let package = Package(
    name: "Unique",
    platforms: [
        .macOS(.v12),
        .iOS(.v15),
        .tvOS(.v15),
        .watchOS(.v8),
    ],
    products: [
        .library(name: "Unique", targets: ["Unique"]),
    ],
    targets: [
        .systemLibrary(
            name: "CUnique",
            path: "Sources/CUnique",
            pkgConfig: "unique_core",
            providers: [
                .brew(["unique-core"]),
                .apt(["libunique-core-dev"]),
            ]
        ),
        .target(
            name: "Unique",
            dependencies: ["CUnique"],
            path: "Sources/Unique"
        ),
    ]
)
