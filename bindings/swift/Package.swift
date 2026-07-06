// swift-tools-version: 5.9
import PackageDescription

let package = Package(
    name: "Kungfu",
    platforms: [
        .macOS(.v12),
        .iOS(.v15),
        .tvOS(.v15),
        .watchOS(.v8),
    ],
    products: [
        .library(name: "Kungfu", targets: ["Kungfu"]),
    ],
    targets: [
        .systemLibrary(
            name: "CKungfu",
            path: "Sources/CKungfu",
            pkgConfig: "kungfu_core",
            providers: [
                .brew(["kungfu-core"]),
                .apt(["libkungfu-core-dev"]),
            ]
        ),
        .target(
            name: "Kungfu",
            dependencies: ["CKungfu"],
            path: "Sources/Kungfu"
        ),
    ]
)
