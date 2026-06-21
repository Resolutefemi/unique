//! Class-string parser.
//!
//! Converts `flex p-4 text-red-500` into a Vec of `ClassToken`s. Each token
//! has optional responsive prefix, optional state prefix, and the core
//! utility name.

use once_cell::sync::Lazy;
use regex::Regex;

#[derive(Debug, Clone, PartialEq, Eq, Hash, PartialOrd, Ord)]
pub enum ResponsivePrefix {
    Sm,
    Md,
    Lg,
    Xl,
    TwoXl,
}

impl ResponsivePrefix {
    pub fn min_width_px(&self) -> u32 {
        match self {
            Self::Sm => 640,
            Self::Md => 768,
            Self::Lg => 1024,
            Self::Xl => 1280,
            Self::TwoXl => 1536,
        }
    }

    pub fn as_str(&self) -> &'static str {
        match self {
            Self::Sm => "sm",
            Self::Md => "md",
            Self::Lg => "lg",
            Self::Xl => "xl",
            Self::TwoXl => "2xl",
        }
    }
}

#[derive(Debug, Clone, PartialEq, Eq, Hash, PartialOrd, Ord)]
pub enum StatePrefix {
    Hover,
    Focus,
    Active,
    Disabled,
}

impl StatePrefix {
    pub fn css_pseudo(&self) -> &'static str {
        match self {
            Self::Hover => ":hover",
            Self::Focus => ":focus",
            Self::Active => ":active",
            Self::Disabled => ":disabled",
        }
    }

    pub fn as_str(&self) -> &'static str {
        match self {
            Self::Hover => "hover",
            Self::Focus => "focus",
            Self::Active => "active",
            Self::Disabled => "disabled",
        }
    }
}

#[derive(Debug, Clone, PartialEq, Eq, Hash)]
pub struct ClassToken {
    pub responsive: Option<ResponsivePrefix>,
    pub state: Option<StatePrefix>,
    /// The core utility name, e.g. `flex`, `p-4`, `text-red-500`.
    pub utility: String,
}

impl ClassToken {
    /// The escaped CSS class selector for this token — e.g. `md\:hover\:bg-blue-500`.
    pub fn selector(&self) -> String {
        let mut out = String::new();
        if let Some(r) = &self.responsive {
            out.push_str(r.as_str());
            out.push_str("\\:");
        }
        if let Some(s) = &self.state {
            out.push_str(s.as_str());
            out.push_str("\\:");
        }
        out.push_str(&self.utility);
        out
    }
}

static TOKEN_RE: Lazy<Regex> =
    Lazy::new(|| Regex::new(r"[\w:/%-]+").unwrap());

/// Parse a class-string like `"flex p-4 md:hover:bg-blue-500"` into tokens.
pub fn parse_class_string(input: &str) -> Vec<ClassToken> {
    TOKEN_RE
        .find_iter(input)
        .filter_map(|m| parse_class(m.as_str()))
        .collect()
}

/// Parse a single class token like `md:hover:bg-blue-500`.
/// Returns `None` if the input is empty or doesn't contain a recognised utility.
pub fn parse_class(input: &str) -> Option<ClassToken> {
    if input.is_empty() {
        return None;
    }
    let mut parts = input.split(':');
    let mut responsive = None;
    let mut state = None;
    let mut utility = String::new();

    // Iterate, consuming prefixes greedily until we hit the utility body.
    // A prefix is one of: sm, md, lg, xl, 2xl, hover, focus, active, disabled.
    let collected: Vec<&str> = parts.clone().collect();
    let last_idx = collected.len().saturating_sub(1);
    for (i, part) in collected.iter().enumerate() {
        if i == last_idx {
            utility = part.to_string();
            break;
        }
        match *part {
            "sm" => responsive = Some(ResponsivePrefix::Sm),
            "md" => responsive = Some(ResponsivePrefix::Md),
            "lg" => responsive = Some(ResponsivePrefix::Lg),
            "xl" => responsive = Some(ResponsivePrefix::Xl),
            "2xl" => responsive = Some(ResponsivePrefix::TwoXl),
            "hover" => state = Some(StatePrefix::Hover),
            "focus" => state = Some(StatePrefix::Focus),
            "active" => state = Some(StatePrefix::Active),
            "disabled" => state = Some(StatePrefix::Disabled),
            _ => return None, // unknown prefix — reject the whole token
        }
    }

    if utility.is_empty() {
        return None;
    }

    Some(ClassToken {
        responsive,
        state,
        utility,
    })
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn parses_plain_utility() {
        let t = parse_class("flex").unwrap();
        assert_eq!(t.utility, "flex");
        assert!(t.responsive.is_none());
        assert!(t.state.is_none());
    }

    #[test]
    fn parses_responsive_prefixed() {
        let t = parse_class("md:flex").unwrap();
        assert_eq!(t.responsive, Some(ResponsivePrefix::Md));
        assert_eq!(t.utility, "flex");
    }

    #[test]
    fn parses_state_prefixed() {
        let t = parse_class("hover:bg-blue-500").unwrap();
        assert_eq!(t.state, Some(StatePrefix::Hover));
        assert_eq!(t.utility, "bg-blue-500");
    }

    #[test]
    fn parses_responsive_and_state_prefixed() {
        let t = parse_class("md:hover:bg-blue-500").unwrap();
        assert_eq!(t.responsive, Some(ResponsivePrefix::Md));
        assert_eq!(t.state, Some(StatePrefix::Hover));
        assert_eq!(t.utility, "bg-blue-500");
    }

    #[test]
    fn parses_class_string() {
        let tokens = parse_class_string("flex p-4 text-red-500");
        assert_eq!(tokens.len(), 3);
        assert_eq!(tokens[0].utility, "flex");
        assert_eq!(tokens[1].utility, "p-4");
        assert_eq!(tokens[2].utility, "text-red-500");
    }
}
