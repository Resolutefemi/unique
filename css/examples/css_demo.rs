//! Example: unique-css — compile a class string to CSS.
//!
//! Run with: `cargo run -p unique-css --example css_demo`
//!
//! Demonstrates:
//! - Parsing a class string with responsive + state prefixes
//! - Emitting CSS for the parsed tokens
//! - Scanning a directory for class= / className= usage

use unique_css::{compile_classes, parse_class_string, emit_css};

fn main() {
    // 1. Compile a single class string to CSS.
    let css = compile_classes("flex p-4 text-red-500 hover:bg-blue-200 md:grid");
    println!("--- Compiled CSS ---");
    println!("{}", css);

    // 2. Parse + emit separately (more control).
    let tokens = parse_class_string("items-center justify-between rounded-lg shadow");
    println!("--- Parsed tokens ---");
    for t in &tokens {
        println!("  {:?}", t);
    }
    let css = emit_css(&tokens);
    println!("\n--- CSS for parsed tokens ---");
    println!("{}", css);

    // 3. Demonstrate that unknown utilities are silently skipped.
    let css = compile_classes("my-custom-class p-4 unknown-utility text-blue-500");
    println!("--- CSS with unknown utilities (silently skipped) ---");
    println!("{}", css);
    println!("(Notice: 'my-custom-class' and 'unknown-utility' are not in the output.)");
}
