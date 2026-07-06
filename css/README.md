# kungfu-css

Tailwind-like utility CSS engine for [Kungfu.js](https://github.com/Resolutefemi/kungfu).

`kungfu-css` parses utility-class strings (`"flex p-4 text-red-500 hover:bg-blue-200 md:text-xl"`)
and emits real CSS. It scans `.kng` / `.html` files for class usage and produces
a minimal, tree-shaken stylesheet.

## Supported utilities (100+)

- Layout: `block`, `flex`, `grid`, `inline`, `inline-block`, `hidden`, …
- Flexbox: `flex-row`, `flex-col`, `items-center`, `justify-between`, `flex-1`, …
- Spacing: `p-{0..16}`, `px-`, `py-`, `pt-`, `pr-`, `pb-`, `pl-`, `m-`, `mx-`, …
- Typography: `text-{xs..5xl}`, `font-{bold,semibold,medium,normal,light}`,
  `italic`, `underline`, `text-{center,left,right}`, `leading-{tight,normal,loose}`, …
- Colors: `text-{red,blue,green,…}-{50..950}`, `bg-…`, `border-…`
- Borders: `border`, `border-{0,2,4,8}`, `rounded-{none,sm,md,lg,full}`
- Sizing: `w-{0..96,full,auto,1/2,1/3}`, `h-{0..96,full,auto,screen}`
- Display states: `hover:`, `focus:`, `active:`, `disabled:`, `group-hover:`
- Responsive prefixes: `sm:`, `md:`, `lg:`, `xl:`, `2xl:`

## Quick start

```rust
use kungfu_css::{compile_classes, compile_directory};

// Compile a class string into CSS:
let css = compile_classes("flex p-4 text-red-500 hover:bg-blue-200")?;
// → .flex { display: flex; } .p-4 { padding: 1rem; } ...

// Scan a directory recursively for class usage:
let css = compile_directory("./src")?;
```

## License

MIT OR Apache-2.0.
