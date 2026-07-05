---
name: Design System Generation Skill
description: Import, extract, normalize, or persist a reusable DESIGN.md from an existing design system, HTML artifact, screenshot, template, style reference, or generated interface.
mode: system-generation
platform: any
scenario: design-system-generation
preview:
  type: markdown
default_for:
  - DESIGN.md
  - design system generation
  - design system extraction
  - design system import
  - design system persistence
  - design rules
  - design tokens
fidelity: system
---

# Design System Generation Skill

Use this skill to turn visual rules into a reusable `DESIGN.md`.

This skill is not required for ordinary first-draft page generation. It should be used when the user wants to import, extract, normalize, persist, or reuse a design language.

This skill is inspired by the DESIGN.md approach: describe the visual system in natural language, preserve precise values when available, and explain not only what the design looks like, but why each design choice exists.

---

## Core Purpose

This skill handles three modes:

1. **Import Mode** — user provides an existing `DESIGN.md` or design guideline.
2. **Extraction Mode** — user provides an existing visual artifact such as HTML, screenshot, template, or page.
3. **Persistence Mode** — user wants to preserve the current generated interface as a reusable design system.

The output should become a reusable reference for future design generation through:

`skills/design/design-system-reference.md`

---

## Trigger

Use this skill when the user asks to import, extract, generate, normalize, or persist a reusable `DESIGN.md`.

---

### 1. Import Mode

Use when the user provides an existing `DESIGN.md`, design guideline, brand guideline, or partial design system and wants it to become the reusable design reference.

Examples:

```text
这是我的 DESIGN.md，后面按这个来
帮我整理一下这份 design.md
检查这个 DESIGN.md 有没有缺失
把这份规范转成你能使用的格式
把这个设计规范标准化一下
```

Primary behavior:

- read the provided `DESIGN.md` or guideline
- preserve user-owned rules
- check for missing sections
- normalize structure only when useful
- do not rewrite the system into the model’s own taste
- keep exact values when provided
- flag ambiguities or missing information when relevant

---

### 2. Extraction Mode

Use when the user provides an existing visual artifact and wants design rules extracted from it.

Sources may include:

- HTML file
- generated HTML artifact
- screenshot
- preset HTML template
- existing page
- CSS / theme file
- style skill
- brand inspiration reference
- codebase styles
- Figma / MCP reference, if available in the future

Examples:

```text
从这个 HTML 里提炼 DESIGN.md
把这个截图总结成设计系统
分析这个模板的设计规则
从这个页面提取颜色、字体、布局规则
把这个已有界面变成可复用设计规范
```

Primary behavior:

- inspect the source artifact
- extract visible values and patterns
- distinguish exact values from inferred values
- describe both surface style and underlying intent
- do not mechanically copy every CSS property
- do not invent unavailable details
- separate reusable rules from one-off details

---

### 3. Persistence Mode

Use when the user wants to preserve the current generated artifact’s visual language for future pages.

Examples:

```text
把当前页面风格沉淀成 DESIGN.md
后面的页面都沿用这一版风格
把这个作品集提炼成可复用设计规范
把这个方向固化下来
把当前界面的设计语言保存下来
```

Primary behavior:

- inspect the current artifact state
- extract stable rules from the approved design
- identify which decisions should repeat
- identify which decisions are one-off
- create a reusable `DESIGN.md` for future artifacts
- avoid turning page-specific details into universal rules

---

## Do Not Use This Skill When

Do not use this skill when:

- the user only asks to generate a single first-draft page
- the user only asks to use an existing design system without changing it
- the user only asks for a local edit
- the user only changes deterministic parameters such as color, spacing, radius, or density
- the user asks for a normal design reference lookup, which should use `design-system-reference.md`

For using an existing design system, use:

`skills/design/design-system-reference.md`

---

## Goal

The goal is to produce a reusable, readable `DESIGN.md` that can guide future generation.

The output should help future agents or users understand:

- visual atmosphere
- color roles
- typography rules
- spacing and layout principles
- component styling
- interaction and motion style
- responsive behavior
- do’s and don’ts
- how to prompt future artifacts in the same style

The goal is not to over-engineer a full enterprise design system.

For first-stage usage, prefer a lightweight but useful `DESIGN.md`.

---

## Workflow

### 1. Determine Mode

Classify the task as one of:

- Import Mode
- Extraction Mode
- Persistence Mode

If multiple modes apply, prefer the user’s explicit request.

Examples:

```text
User uploads DESIGN.md
→ Import Mode

User uploads HTML and asks to generate DESIGN.md
→ Extraction Mode

User likes the current page and wants future pages to match it
→ Persistence Mode
```

---

### 2. Collect Source

For Import Mode:

- read the provided `DESIGN.md`
- preserve user-owned rules
- check for missing sections
- normalize structure only when useful
- avoid unnecessary rewriting

For Extraction Mode:

- inspect the provided artifact
- extract visible values and patterns
- distinguish exact values from inferred values
- identify layout, typography, color, component, motion, and responsive rules
- do not invent unavailable details

For Persistence Mode:

- inspect the current artifact state
- extract stable rules from the approved design
- separate reusable rules from one-off page details
- preserve the design direction that the user accepted

---

### 3. Extract Design Intent

Do not only describe surface appearance.

Explain why the design uses each pattern.

Weak:

```text
Uses blue buttons and rounded cards.
```

Better:

```text
Blue is reserved for primary actions and progress states, creating a clear path through the interface. Rounded cards soften the otherwise technical layout and make dense information feel approachable.
```

The system should explain:

- what visual choices communicate
- which choices are structural vs decorative
- how the design should scale to future pages
- which elements are essential to the style
- which elements should not be overused

---

### 4. Separate Stable Rules from One-Off Choices

A good design system should not blindly preserve every detail.

Classify decisions as:

- **Core rule** — should repeat across future artifacts.
- **Optional motif** — useful but not required everywhere.
- **One-off detail** — belongs only to the current artifact.
- **Avoid** — should not be repeated.

Example:

```text
Core rule:
Use compact monospace metadata labels for project year, role, and status.

Optional motif:
Use hover-preview imagery for project lists when the portfolio has many projects.

One-off detail:
The oversized animated project number belongs only to the homepage hero.

Avoid:
Do not add random system labels to unrelated content pages.
```

---

### 5. Produce or Update DESIGN.md

Output a reusable `DESIGN.md`.

If the user provided an existing `DESIGN.md`, update or normalize it instead of replacing it wholesale.

If extracting from an artifact, produce a new `DESIGN.md`.

If persisting current design, produce a `DESIGN.md` that future artifacts can use through `design-system-reference.md`.

---

## Output Format

Unless the user asks for another format, output one markdown document named:

```text
DESIGN.md
```

The output should be concise but complete enough to guide future generation.

Avoid huge design bibles. Prefer practical rules.

---

# DESIGN.md Structure

Use this structure by default.

```md
# DESIGN.md

## 1. Visual Theme & Atmosphere

## 2. Color Palette & Roles

## 3. Typography Rules

## 4. Layout Principles

## 5. Component Styling

## 6. Interaction & Motion

## 7. Responsive Behavior

## 8. Do's and Don'ts

## 9. Agent Prompt Guide
```

Add `Lightweight Tokens` when useful and values are available or responsibly inferred.

---

## 1. Visual Theme & Atmosphere

Describe the overall feeling of the system.

Include:

- mood
- level of polish
- density
- visual temperature
- personality
- intended audience
- what the design should feel like in the first 2 seconds

Example:

```text
The system feels editorial, confident, and quietly technical. It uses generous whitespace, sharp type hierarchy, and compact metadata to make personal work feel curated rather than marketed.
```

Avoid vague words without explanation:

```text
modern
clean
beautiful
premium
```

If used, define what they mean in this system.

---

## 2. Color Palette & Roles

Document colors by role, not just by list.

Include when available:

- background
- surface
- primary text
- secondary text
- muted text
- border
- primary accent
- secondary accent
- success / warning / error
- overlay / shadow

Example:

```md
### Core Palette

- Background: `#F7F3EA` — warm editorial base, used for page background.
- Text Primary: `#171717` — high-contrast body and headings.
- Text Muted: `#73706A` — metadata, captions, secondary details.
- Accent: `#D94F30` — used only for primary CTA, active state, and one highlight per section.
- Border: `rgba(23, 23, 23, 0.14)` — subtle structure without heavy boxes.
```

Rules:

- Explain where each color should be used.
- Avoid too many accent colors.
- Do not invent precise values if none are visible; mark inferred values.
- Note colors that should not be overused.

---

## 3. Typography Rules

Document the type system.

Include:

- font family or font category
- headline style
- body style
- label / metadata style
- scale
- weight
- line height
- letter spacing
- casing rules
- language-specific rules if relevant

Example:

```md
### Type Roles

- Display: large, high-contrast serif or expressive sans for identity and project titles.
- Body: neutral sans, 16px–18px, 1.5 line height for readability.
- Metadata: monospace, 11px–12px, uppercase, increased letter spacing, used for year, role, status, and project tags.
```

Rules:

- Do not default to serif + monospace unless it fits the artifact.
- Use 2 type voices at most unless the style explicitly demands more.
- Typography should create structure, not decoration.
- For mobile, body text should remain readable.

---

## 4. Layout Principles

Describe how pages are structured.

Include:

- grid or layout model
- spacing rhythm
- section structure
- density
- alignment
- scroll behavior
- use of asymmetry
- hierarchy rules
- how pages should start and end

Example:

```md
### Layout System

Use a fixed identity column with a scrollable work area for portfolio pages. The identity column anchors the person, while the work area carries proof. Section spacing follows an 8px base scale with large rhythm breaks between major work groups.
```

Rules:

- Document the structural paradigm.
- Avoid generic repeating vertical blocks unless the content demands it.
- Define how hierarchy is created.
- Define how empty space should be used.

---

## 5. Component Styling

Document reusable components and patterns.

Include:

- buttons
- cards
- project items
- navigation
- metadata blocks
- forms
- modals / overlays
- detail views
- empty states
- status elements

Example:

```md
### Project Card

Project cards should prioritize the work image and title. Metadata appears as compact labels. Cards may use subtle hover movement or image reveal, but should not use heavy shadows or generic SaaS-card styling.
```

For each important component, include:

- purpose
- visual treatment
- variants
- states
- usage notes
- what to avoid

Do not over-document components that do not exist.

---

## 6. Interaction & Motion

Document how the system should move and respond.

Include:

- hover behavior
- active states
- focus states
- loading behavior
- page transitions
- scroll behavior
- motion intensity
- reduced motion expectations

Example:

```md
Motion should be sparse and intentional. Use hover previews on project lists and one subtle entrance reveal for the first screen. Avoid animating every section. Motion should make the site feel responsive, not decorative.
```

Rules:

- Every interactive element needs feedback.
- Motion should reinforce the visual world.
- Avoid decorative animation with no function.
- Respect reduced motion when relevant.

---

## 7. Responsive Behavior

Document how the system adapts.

Include:

- desktop behavior
- tablet behavior
- mobile behavior
- navigation changes
- layout stacking
- touch behavior
- image cropping
- interaction fallbacks

Example:

```md
On desktop, portfolio work can use a fixed identity panel and scrollable work area. On mobile, the identity panel becomes a compact header, and project previews stack vertically. Hover previews must become tap-to-open or inline previews.
```

Rules:

- Do not simply shrink desktop layout.
- Replace hover-only interactions on touch devices.
- Preserve content hierarchy on small screens.

---

## 8. Do's and Don'ts

Write practical rules.

### Do

- Use work as the primary proof.
- Preserve strong hierarchy.
- Use metadata labels sparingly and consistently.
- Keep the number of accent colors limited.
- Use one memorable structural or interaction idea.
- Reuse exact values when they are available.

### Don't

- Add fake testimonials, fake metrics, or fake logos.
- Fill space with generic sections.
- Copy brand assets or proprietary UI.
- Add decorative gradients or emoji without purpose.
- Make every section equally loud.
- Use dead links or inactive clickable elements in publish-ready artifacts.
- Treat a one-off hero effect as a universal rule.

---

## 9. Agent Prompt Guide

Write instructions that future agents can follow.

This section should be direct and operational.

Example:

```md
When generating new pages in this system:

- Start from a work-first structure.
- Use compact metadata labels for role, year, and category.
- Keep the accent color reserved for primary action and active states.
- Show actual work early; do not lead with a long bio.
- Use one bold structural move, then keep secondary sections quiet.
- Avoid generic portfolio card grids unless the user asks for a simple version.
- Preserve responsive behavior and touch-friendly interactions.
```

The Agent Prompt Guide should make future generation more consistent.

---

## Lightweight Tokens

If useful, include a compact token section.

Use only when values are available or can be responsibly inferred.

Example:

```json
{
  "color": {
    "background": "#F7F3EA",
    "surface": "#FFFFFF",
    "textPrimary": "#171717",
    "textMuted": "#73706A",
    "accent": "#D94F30",
    "border": "rgba(23, 23, 23, 0.14)"
  },
  "radius": {
    "sm": "6px",
    "md": "12px",
    "lg": "24px"
  },
  "spacing": {
    "base": "8px",
    "section": "96px"
  },
  "typography": {
    "bodySize": "16px",
    "bodyLineHeight": "1.5",
    "labelSize": "11px"
  }
}
```

Do not include fake precision. If values are inferred, state that they are inferred.

---

## Import Mode Rules

When the user uploads an existing `DESIGN.md`:

- preserve the user’s system
- do not rewrite it into a different style
- normalize headings only when useful
- fill obvious missing sections carefully
- keep original exact values
- mark any inferred additions
- do not remove user rules unless they conflict or are duplicated

Output options:

- updated `DESIGN.md`
- normalized `DESIGN.md`
- gap analysis plus suggested edits
- short compatibility note for future generation

---

## Extraction Mode Rules

When extracting from HTML, screenshot, template, or existing page:

- inspect visible design patterns
- preserve exact values when available
- infer cautiously when values are not available
- do not copy irrelevant implementation details
- describe design intent, not only CSS
- separate reusable rules from page-specific choices
- include tokens only when useful

Avoid:

- dumping raw CSS into DESIGN.md
- inventing unavailable values
- treating every one-off detail as a design system rule
- missing responsive or interaction behavior

---

## Persistence Mode Rules

When persisting a generated artifact:

- extract from the current approved artifact state
- focus on stable rules that should guide future pages
- preserve the strongest design decisions
- classify one-off details as optional or page-specific
- make future use operational through Agent Prompt Guide

Avoid:

- overfitting to the current page
- preserving placeholder content as design rules
- turning a temporary experiment into a permanent system
- ignoring user-approved style decisions

---

## Quality Rules

A generated `DESIGN.md` should be:

- reusable
- specific
- grounded in source material
- concise enough to be useful
- clear about what is essential vs optional
- safe around brand and IP boundaries
- useful for future page generation

Avoid:

- generic design advice
- vague premium/modern/clean language
- long theory with no operational rules
- copying proprietary brand systems
- turning one artifact detail into a universal rule
- inventing tokens not supported by the source

---

## IP and Brand Safety

If the source is public brand inspiration:

- do not present the output as an official design system
- do not copy logos, assets, exact page structures, or proprietary UI
- describe only high-level visual qualities
- create reusable rules that lead to original designs

If the source is user-owned:

- treat it as authoritative when clearly provided by the user
- preserve exact values when available
- note assumptions when incomplete

---



## Chinese Typography Reference

Use `horizontal-craft/chinese-typography.md` when the artifact contains substantial Chinese / Chinese / CJK text, Chinese editorial layout, public-account formatting, Xiaohongshu content, Chinese deck typography, Chinese UI labels, or print-design-inspired HTML.

Translate print-design methods into HTML structure: 版心, 网格, 留白, 标题组, 图版, 边注, 章节 rhythm, and proper punctuation.


## Quality Gate

Before delivering this scenario, apply `quality-gate.md`.

This scenario may add stricter checks, but it must not weaken the shared gate.

## Handoff

After generating, importing, normalizing, or updating `DESIGN.md`, future design tasks can use it through:

`skills/design/design-system-reference.md`

The generated `DESIGN.md` should become a reusable reference, not a one-time summary.

When useful, also note:

- source artifact
- source template
- source screenshot
- selected style skill
- selected brand inspiration
- date/version
- assumptions
- missing information
