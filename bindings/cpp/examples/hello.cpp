// Hello-world example using the Unique C++ binding.
//
// Build:
//   clang++ -std=c++17 -I../../core -L../../target/release -lunique_core \
//     -o hello examples/hello.cpp
// (Make sure `unique_core` is built as a cdylib with `--features ffi`.)

#include "unique.hpp"
#include <iostream>

int main() {
    unique::UniqueRouter router;

    router.get("/hello", [](unique::Request& req, unique::Response& res) {
        res.status(200).json(R"({"message":"world","lang":"c++"})");
    });

    router.get("/", [](unique::Request& req, unique::Response& res) {
        res.status(200).html(
            "<h1>Hello from Unique (C++)!</h1>"
            "<p>Try <a href=\"/hello\">/hello</a></p>"
        );
    });

    std::cout << "🥋 Unique (C++) listening on http://localhost:3000" << std::endl;
    unique::UniqueServer server(std::move(router));
    server.listen(3000);
    return 0;
}
