//! Proc macros for the Kungfu.js framework.
//!
//! Currently exposes:
//!   - `#[derive(Model)]` — generates a `kungfu_orm::Model` impl for a struct.
//!
//! Future macros (planned for V1):
//!   - `#[route(GET, "/path")]` — replacement for the macro_rules! `get!` macro
//!   - `#[middleware]` — marks a function as a middleware
//!   - `#[schema(...)]` — attaches a JSON Schema to a route for OpenAPI generation

use proc_macro::TokenStream;
use quote::quote;
use syn::{parse_macro_input, Data, DeriveInput, Fields, Meta};

/// Derive `Model` for a struct.
///
/// Each field can be annotated with `#[field(...)]`:
///   - `primary` — mark as primary key
///   - `auto_increment` — auto-incrementing primary key
///   - `unique` — unique constraint
///   - `min = N` / `max = N` — length constraints (strings)
///   - `sensitive` — field is hashed with Argon2id on insert (e.g. passwords)
///   - `skip` — don't persist this field
///
/// Example:
/// ```ignore
/// #[derive(Model, Serialize, Deserialize)]
/// #[table(name = "users")]
/// struct User {
///     #[field(primary, auto_increment)]
///     id: i64,
///     #[field(unique)]
///     email: String,
///     #[field(min = 8, sensitive)]
///     password: String,
/// }
/// ```
#[proc_macro_derive(Model, attributes(table, field))]
pub fn derive_model(input: TokenStream) -> TokenStream {
    let input = parse_macro_input!(input as DeriveInput);
    let struct_name = &input.ident;

    // Parse #[table(name = "...")] attribute.
    let table_name = extract_table_name(&input.attrs).unwrap_or_else(|| {
        // Default: snake_case of the struct name.
        let s = struct_name.to_string();
        let mut out = String::new();
        for (i, c) in s.chars().enumerate() {
            if c.is_uppercase() && i > 0 {
                out.push('_');
            }
            out.push(c.to_ascii_lowercase());
        }
        out
    });

    // Walk fields, collect (rust_name, column_name, field_meta).
    let fields = match &input.data {
        Data::Struct(s) => match &s.fields {
            Fields::Named(named) => &named.named,
            _ => panic!("Model derive only supports structs with named fields"),
        },
        _ => panic!("Model derive only supports structs"),
    };

    let mut field_defs = Vec::new();
    for f in fields {
        let ident = f.ident.as_ref().expect("named field");
        let col_name = ident.to_string();

        let mut is_primary = false;
        let mut auto_increment = false;
        let mut unique = false;
        let mut sensitive = false;
        let mut skip = false;
        let mut min_len: Option<usize> = None;
        let mut max_len: Option<usize> = None;

        for attr in &f.attrs {
            if !attr.path().is_ident("field") {
                continue;
            }
            let nested = attr.meta.require_list().expect("invalid #[field(...)]");
            let _ = nested.parse_nested_meta(|meta| {
                let ident_str = meta.path.get_ident().map(|i| i.to_string()).unwrap_or_default();
                match ident_str.as_str() {
                    "primary" => { is_primary = true; Ok(()) }
                    "auto_increment" => { auto_increment = true; Ok(()) }
                    "unique" => { unique = true; Ok(()) }
                    "sensitive" => { sensitive = true; Ok(()) }
                    "skip" => { skip = true; Ok(()) }
                    "min" => {
                        let lit: syn::LitInt = meta.value()?.parse()?;
                        min_len = Some(lit.base10_parse()?);
                        Ok(())
                    }
                    "max" => {
                        let lit: syn::LitInt = meta.value()?.parse()?;
                        max_len = Some(lit.base10_parse()?);
                        Ok(())
                    }
                    other => Err(meta.error(format!("unknown #[field] option: {other}")))
                }
            });
        }

        if skip {
            continue;
        }

        // Convert Options to their token-stream form (Some(N) / None).
        let min_len_tokens = match min_len {
            Some(n) => quote! { ::std::option::Option::Some(#n) },
            None => quote! { ::std::option::Option::None },
        };
        let max_len_tokens = match max_len {
            Some(n) => quote! { ::std::option::Option::Some(#n) },
            None => quote! { ::std::option::Option::None },
        };

        field_defs.push(quote! {
            kungfu_orm::FieldDef {
                rust_name: stringify!(#ident),
                column_name: #col_name,
                is_primary: #is_primary,
                auto_increment: #auto_increment,
                unique: #unique,
                sensitive: #sensitive,
                min_len: #min_len_tokens,
                max_len: #max_len_tokens,
            }
        });
    }

    let expanded = quote! {
        impl kungfu_orm::Model for #struct_name {
            fn table_name() -> &'static str { #table_name }
            fn fields() -> &'static [kungfu_orm::FieldDef] {
                static FIELDS: &[kungfu_orm::FieldDef] = &[#(#field_defs),*];
                FIELDS
            }
        }
    };

    expanded.into()
}

fn extract_table_name(attrs: &[syn::Attribute]) -> Option<String> {
    for attr in attrs {
        if !attr.path().is_ident("table") {
            continue;
        }
        let Meta::List(list) = &attr.meta else { continue };
        let tokens: proc_macro2::TokenStream = list.tokens.clone();
        for tok in tokens.into_iter() {
            if let proc_macro2::TokenTree::Group(g) = tok {
                for inner in g.stream() {
                    if let proc_macro2::TokenTree::Ident(ident) = inner {
                        if ident == "name" {
                            // The next token should be `= "value"`.
                            // We do a simple lookahead here.
                        }
                    }
                }
            }
        }
        // Simple parse: `#[table(name = "users")]` — just extract the string.
        let s = list.tokens.to_string();
        if let Some(start) = s.find('"') {
            if let Some(end) = s[start + 1..].find('"') {
                return Some(s[start + 1..start + 1 + end].to_string());
            }
        }
    }
    None
}
