---
name: Design Skill
description: Route design-related HTML artifact tasks to the right artifact skill, reference, design system generation, or export skill.
mode: router
platform: any
scenario: design
preview:
  type: html
default_for:
  - UI design
  - visual design
  - HTML design artifact
  - personal website
  - portfolio
  - deck
  - presentation
  - prototype
  - design system reference
  - design system generation
  - export
fidelity: adaptive
---

# Design Skill

Design Skill is the router for design-related HTML artifact work.

It decides:

- whether the task is design-related
- which artifact skill should be primary
- whether the task should use `design-system-reference.md`
- whether the task should use `design-system-generation.md`
- whether the task should use `export.md`
- how much clarification is needed before acting
- how to read the request quickly before routing (see "Before generating")
- how to apply built-in design quality defaults
- how to keep generated HTML structured for future edits

Design Skill should stay small.

Artifact-specific structure rules belong in artifact skill files. Business judgment for a scenario lives inside that scenario skill. Cross-cutting craft rules belong in horizontal-craft/.
Reference selection belongs in `design-system-reference.md`.
DESIGN.md import / extraction / persistence belongs in `design-system-generation.md`.
Export / package / handoff belongs in `export.md`.

The default first-stage deliverable is a design artifact, usually HTML unless the selected artifact skill or export target requires a fixed-image, deck, package, or design-system spec. Export is invoked when the user asks to package, download, convert, or hand off the current artifact.

## The flow (read this once; it governs everything below)

The whole skill is one flow. Most of it is internal and instant — it only pauses when a request
is genuinely ambiguous. Do **not** turn any step into a form to fill or a file you must read first.

```text
USER REQUEST
   │
   ▼
1. UNDERSTAND (internal, silent for obvious requests) — resolve three axes in parallel:
     • content  — subject, information, goal
     • scenario — form + intent  → which scenario skill   (see Routing)
     • style    — what kind of style cue, if any           (see Style Routing)
   Obvious on all three → proceed. Only ONE axis genuinely unclear → ask one focused question.
   For open-ended / creative requests, understanding also includes a creative read, not just these
   operational axes — complete the creative context + Design Read (see §Creative Context Completion).
   │
   ▼
1.5 CHECK TEMPLATES (do this by default, not only when asked)
   Scan `design-templates/INDEX.md` by carrier + scenario for a match to the request.
     • Clear match  → adopt it as the starting point; read that template's SKILL.md. Using a
                      matching template usually raises quality — prefer it over designing from scratch.
     • No good match → proceed with the scenario skill directly. Never force a template that doesn't fit.
   A template is a starting structure/skeleton, not a page to clone — keep the user's real content,
   apply the scenario skill + horizontal craft, do not copy the reference's exact layout fingerprint.
   │
   ▼
2. FILL STYLE BY PRIORITY (per dimension: color · type · layout · icons · spacing tokens)
   For each dimension, take it from the highest-priority source that covers it:
     1) user's immediate description   ← highest; dimensions it touches are locked
     2) design system (DESIGN.md)      ← fills dimensions the user didn't speak to
     3) template / seed                ← fills what's left (esp. layout scaffold)
     4) parallel constraints           ← fallback for any still-empty dimension
        (load only the ones you need: type / icons / color / a11y …)
   Sources combine — e.g. design-system tokens + a template's layout is normal.
   Style cue is a vague mood word, not a named system ("清新/简约/高级/科技感/复古/温暖/极简/
   赛博" etc.): do NOT just free-associate a look — match it to the library. Read
   `design-systems/style-skills` index (and brand `index.json`) and pick the entry whose `mood` /
   `formality` / `scheme` tags best fit the words, then use it as the base. The style tags are the
   bridge from a user's adjective to a concrete system (e.g. 清新简约 → 极简/克制 → `minimal`/`clean`;
   高级 → 奢华/克制 → `luxury`/`refined`; 科技感 → 技术感/未来 → `futuristic`/`hud`). Only design
   from scratch if nothing in the library fits the mood.
   No style cue at all + scene is restrained / not creativity-driven (tool, dashboard, admin,
   form, report, notice, generic SaaS/corporate page): do NOT design a style from scratch —
   actively pick a mature baseline from `design-systems/` (see Mature System Fallback) so the
   result is professional and consistent. (Expressive scenes that want a distinct look skip this
   and go bold per §Creative Context.)
   Conflict: if the user's description contradicts the design system on a dimension,
   the user wins on that dimension — AND say so in one line
   ("Built it <X> as you asked; note this differs from the attached design system —
    tell me if you'd rather keep the system's direction.")
   │
   ▼
3. BUILD using the scenario skill's judgment + the filled style.
   │
   ▼
4. QUALITY GATE — run quality-gate.md as a thin final checklist before delivering.
```

Why priority-fill matters: it loads constraints **only when a dimension is actually empty** —
you read the icon constraint only if nothing supplied icons, the color constraint only if
nothing supplied color. That keeps the skill light instead of dumping every rule every time.
### Mature System Fallback

For **interface / restrained** scenes (product prototypes, dashboards, admin panels, web tools, settings/forms/onboarding/checkout, data-heavy interfaces, generic corporate/notice pages), lean on a mature system instead of freeform taste — whether or not the user gave a vibe word. Resolve the scene (and any vibe word) to a `design-systems/style-skills` entry via its `mood` tags and adopt it as the UI base. Interface maturity is the goal; a real system gives structure, component discipline, spacing rhythm, state behavior, and interaction conventions.

Do NOT apply this to **creative / expressive** scenes:

- `social-card.md`
- `content-page.md`
- editorial / literary pages
- `portfolio.md`
- `landing-page.md` and expressive brand/story/lifestyle pages

For those, design from the artifact skill's own visual judgment + horizontal craft + Creative Context. They may *reference* a system's character (and a named brand always loads `brand-inspiration`), but are not pushed into a UI kit. It should not make every artifact look like a generic UI kit.

---

Context sources that may feed step 2 (fill style): user content, screenshots, a selected
template/seed, an uploaded `DESIGN.md`, the current artifact, brand assets, existing pages,
design systems / UI kits, or Figma/codebase references. Use whatever is present; read a
parallel-constraint file only for a dimension nothing else covers.

# 1. Understand first

这一块决定"做什么之前先想清楚什么"。多数情况内化、即时完成；只有真含糊才问一句。

## Role

This agent is design-oriented.

It is not a generic UI generator. It should bring design judgment to every artifact.

A design-oriented agent should:

- understand what the artifact is for
- decide what the user should notice first
- remove elements that do not earn their place
- use references before relying on generic taste
- preserve structure for later edits
- create artifacts that are usable, editable, and intentional

The goal is not to generate more interface. The goal is to create a design artifact that helps the user communicate, test, publish, present, or hand off something useful.

---

## Content Language

The language of the generated HTML content must match the user's conversation language unless the user explicitly requests otherwise.

Rules:

- If the user writes in Chinese, all visible text in the artifact (headings, body copy, labels, CTAs, microcopy, navigation, placeholders, alt text) must be in Chinese.
- If the user writes in English, generate English content.
- If the user writes in a mixed language, follow the dominant language of the request for primary content, and preserve the mixed pattern where natural (e.g., product names, technical terms).
- This rule applies to all scenarios: landing pages, portfolios, decks, content pages, prototypes, web-tool, and any future scenario.
- `<html lang>` must match the content language (`zh-CN`, `en`, `ja`, etc.).
- When adapting a preset template, replace the template's placeholder text with content in the correct language. Do not preserve the template's original English placeholders if the content language is not English.
- When Chinese / CJK content is detected (by this rule or by user request), also load `horizontal-craft/chinese-typography.md` as a shared reference. **Font iron rule (applies even before reading that file): any non-system font named in `font-family` must actually be loaded (`<link>` or `@font-face`), and a page containing Chinese must have a CJK font name in its `font-family` — never let a Latin font fall straight through to `system-ui`, or the Chinese renders in an uncontrolled fallback.** Font selection/loading detail: `horizontal-craft/fonts.md`.

Do not ask the user to confirm the content language unless the conversation is genuinely ambiguous (e.g., the user sends a bilingual brief with no clear dominant language).

---

## Core Principle

Default to action, but do not design blindly.

Use questions selectively. Do not ask a long questionnaire by default, but ask concise clarifying questions when they would materially improve the result. Otherwise infer reasonable assumptions from:

- the user's request
- existing workspace context
- provided content
- provided references
- selected preset HTML template, if any
- existing artifact state
- uploaded `DESIGN.md`, if any
- common patterns for the target scenario

Ask clarifying questions when missing information would make the result:

- unusable
- impossible to generate
- legally or brand-risky
- clearly misaligned with the user's intent

When enough information exists, generate a reasonable first version and let the user refine it through selected-region comments, local parameter edits, follow-up requests, or export.

---

## Creative Context Completion

For open-ended generation, before building, silently complete a short creative context (one sentence each; use the user's if given, else infer from scenario/audience/content/references; don't show unless useful):

```text
Creative Context
1. creative_positioning:  what this is really about, beyond the literal request
2. first_impression:      what the viewer should feel in the first 3 seconds
3. anti_default:          which generic default to avoid
```

The artifact must visibly reflect this.

### State a one-line Design Read before generating

Then commit to one explicit line naming how you read the request:

Form: **"Reading this as: <page kind> for <audience>, <character/vibe>, leaning <design direction / system / reference>."**

- "Reading this as: a SaaS landing for technical buyers, calm and precise, leaning a restrained Linear-like system."
- "Reading this as: a 国潮 tea-brand campaign for young consumers, bold and festive, leaning oversized type + strong color, expressive."
- "Reading this as: an internal admin dashboard, restrained and legible, leaning a mature design-system baseline."

May be shown to the user. If one axis is genuinely ambiguous, ask the single focused question here instead of guessing.

**The Design Read must end with a style-source clause — required, pick one, never blank:**

- **Interface scene** (prototype, info-interactive, web tool, dashboard/admin): name a system — `"leaning <style-skill> (matched from mood tags)"`, or `"leaning <brand> from brand-inspiration"` if a brand was named. Default to a mature system; don't invent UI from scratch.
- **Creative scene** (landing, portfolio, campaign, card, content): either `"referencing <system>'s <character>, original layout"` or `"original direction: <one line>"`. Both valid — "original" is a legitimate source; the point is you considered the library.
- **Any scene + named brand** → `"leaning <brand> from brand-inspiration"`.

### Then classify the scene; for expressive scenes commit to a concrete visual plan

- **Expressive** (brand site, campaign/promo, portfolio, product landing hero, editorial/cultural feature, social cover): visual impact is part of the job; a correct-but-safe centered page is a failure.
- **Restrained** (dashboard, admin, internal tool, form, government notice, report, data table, spec): clarity and calm are the job; keep motion minimal, layout regular, and skip the visual commitment below.

For **expressive** scenes, silently commit before coding — each item a specific element + action, never an adjective ("bold/premium/surprising/dynamic" are banned, they constrain nothing):

```text
Visual commitment (expressive scenes only)
1. hero_subject:   the ONE element made large/dominant  (e.g. product name '桂花酪酪' at 1/3 viewport, gold+cinnabar)
2. entrance:       which elements animate in, how       (e.g. title chars stagger in + petals fall from top)
3. break_symmetry: where layout breaks center/grid      (e.g. price tag angled bottom-right; seal bleeds off edge)
4. focal_contrast: what makes the eye land first         (size jump / color block / whitespace around hero)
```

A fully centered, symmetric, static page with no dominant element is the default-平庸 outcome — for expressive scenes it means the commitment wasn't honored. Execute each committed item. Motion specifics → `horizontal-craft/animation-discipline.md`.

### Example (inline)

"做一个 GLM-5.1 模型介绍网站" → positioning: reasoning/execution infrastructure, not a generic AI page; first_impression: calm, precise, technical; anti_default: avoid the generic AI-SaaS hero + feature-card template. Scene: expressive → hero_subject: "GLM-5.1" oversized with a single accent; entrance: title + tagline staggered fade-up; break_symmetry: spec numbers offset to one side; focal_contrast: large type against deep negative space.


## First-Stage Product Assumptions

Assume most users give no advanced design context — **not** a Figma file/MCP, mature design system, tokens, component library, brand guideline, or structured requirements.

Typical first input is: a short natural-language request, rough content, a style reference ("Apple style"), a screenshot, a chosen template, a target artifact type, an existing HTML to refine/export, or a `DESIGN.md` to import.

Default path: infer scenario → infer reasonable design assumptions → generate a usable first version → keep it editable (stable structure, selected-region comments, local parameter edits) → pass `quality-gate.md` → hand web entry artifacts to `skills/version-management/SKILL.md` when required by output type → export only when asked.

Advanced references (Figma MCP, uploaded design systems, codebase tokens, component libraries) are used when available, but aren't the default.

---

## Default Assumption Policy

With limited info, infer reasonable defaults (scenario type, layout pattern, visual tone, device priority, interaction states) instead of blocking. Ask only when: the core subject is missing, the target format can't be inferred, required assets are unavailable, legal/authorization is unclear, or interpretations would produce clearly different artifacts. Don't ask merely to avoid making a reasonable design decision.

### Fill a full content scaffold for abstract requests

When the request is abstract ("做个读书会活动页", "一个 AI 工具的落地页"), the user wants an editable **starting point**, not an empty shell. Build the full content framework the scenario needs with concrete, plausible sample content — an almost-empty page ("title and one line") is a failure even if technically correct.

- Include the sections the scenario needs (activity page: title, time/place, what-it-is, agenda, who-it's-for, sign-up CTA; landing: value, features, how-it-works, CTA) — use the scenario skill's structure.
- Write **specific, illustrative** sample copy (a real-sounding activity name, three concrete agenda items), not `Lorem ipsum` or empty `[标题]` slots. Match the user's language.

**This is not fabrication and does not override no-fake-proof.** The line:

- **Fill freely (structural/illustrative):** section structure, feature/benefit copy, agenda items, FAQ, sample product names, body text, labeled placeholder image slots — obviously the user's to replace.
- **Never fabricate (factual/evidentiary):** specific metrics ("提升 300%"), named customer logos, testimonials, awards, press, ratings, partners — anything asserting a real-world fact. No real proof → use a labeled placeholder ("[在此放置客户评价]"), never an invented fact.

---

## Variation Policy

Generate multiple variations when:

- the user asks for options
- the direction is genuinely open-ended
- the user is exploring positioning, visual style, layout, or interaction model
- the cost of exploring is lower than committing early

Do not force variations when:

- the user asks for a single direct output
- the task is a small edit
- the user is continuing an existing direction
- the artifact is already constrained by a design system or selected template
- the task is primarily local edit, export, or handoff

When generating variations:

- vary meaningful dimensions, not superficial decoration
- keep variations in one artifact when possible
- label variations clearly
- make differences easy to compare

---

# 2. Route — decide what to build

先定形态与意图，再定产出格式与风格来源。

## Routing

Design Skill routes by **primary artifact skill**. Do not use a separate form-bucket route.

Output form is captured as `output_target` in the brief/bundle. It constrains generation, export, sizing, and handoff, but it should not be a separate routing layer.

```yaml
skill_bundle:
  primary_artifact_skill: landing-page.md | prototype.md | deck.md | content-page.md | web-tool.md | social-card.md | portfolio.md | info-interactive.md
  output_target: responsive-html | mobile-html | html-slide-deck | fixed-image | design-system-spec | package
  design_system_or_reference: none | design-system-reference.md | design-system-generation.md | design-systems/[name]
  horizontal_craft: []
  template_or_seed: optional
```

## Primary Routing — Artifact Skills

Pick exactly one primary artifact skill for a concrete design artifact. The artifact skill defines the shape, structure, output mechanics, and editing expectations.

| Artifact skill | Use when the user wants… | Default output target |
|---|---|---|
| `landing-page.md` | product landing page, homepage, SaaS site, marketing page, waitlist, service page | `responsive-html` |
| `portfolio.md` | personal site, portfolio, creator profile, resume-style page, project showcase | `responsive-html` |
| `prototype.md` | app prototype, web product prototype, dashboard, admin panel, product flow, wireframe, UI mockup | `responsive-html` or `mobile-html` |
| `content-page.md` | article, editorial page, newsletter, WeChat/public-account layout, long-form reading page | `responsive-html` |
| `info-interactive.md` | information explanation page, visual explainer, flowchart, architecture diagram, system map, process map, relationship map, timeline, comparison explorer, filterable knowledge/resource page, interactive report, data story, explorable explainer; ordinary-language triggers: “讲清楚 / 梳理 / 图解 / 可视化说明 / 流程图 / 架构图 / 关系图 / 时间线 / 对比页” | `responsive-html` |
| `web-tool.md` | single-task web tool, calculator, generator, checker, picker, quiz, test, countdown, decision tool; desktop or mobile/H5 | `responsive-html` or `mobile-html` |
| `social-card.md` | social media covers/cards, Xiaohongshu/RED, WeChat/Douyin covers, long-image card sequences, fixed-image social graphics | `fixed-image` |
| `deck.md` | slide deck, presentation, pitch deck, report deck, strategy deck, workshop deck, teaching deck | `html-slide-deck` |

Legacy routing: `xiaohongshu-card.md`, “XHS card”, “小红书卡片”, and similar old references should be treated as `social-card.md`. Old references to `web-tool.md` / H5 tool should be treated as `web-tool.md`.

## Output Target

`output_target` is derived from the selected artifact skill and user request. It is not a routing layer.

Use it to decide technical surface, sizing, export behavior, and supporting references:

| Output target | Meaning | Common supporting references |
|---|---|---|
| `responsive-html` | scrollable or interactive browser page | `canvas-and-device.md`, `horizontal-craft/accessibility.md` |
| `mobile-html` | mobile-first interactive page, H5, or mobile web tool | `canvas-and-device.md`, `horizontal-craft/state-coverage.md`, `horizontal-craft/form-validation.md` |
| `html-slide-deck` | one-screen-at-a-time HTML presentation | `deck.md`, `design-templates/`, `canvas-and-device.md` |
| `fixed-image` | fixed-size export surface for social card, cover, poster, long image, or image export | `social-card.md`, `canvas-and-device.md` |
| `design-system-spec` | reusable `DESIGN.md` / tokens / component rules | `design-system-generation.md` |
| `package` | ZIP/PDF/PPTX/image/export handoff | `export.md` |

Do not create a separate canvas, web-page, or slide-runtime route file. Use the artifact skill plus `output_target`.

Info-explanation routing rule: if the user asks to organize, explain, map, compare, visualize, or clarify a fixed body of information, do not treat it as a generic content page by default. Route to `info-interactive.md` unless the requested carrier is clearly an article, deck, social image, or product prototype.

## Style Routing (decide how a style cue is handled)

A request often carries a style cue. Before reaching for a reference library, classify the cue
— most cues are NOT a reference lookup. This prevents two failure modes: treating a plain
adjective as a library lookup, and confusing "read a spec" with "write a spec".

| The user's style cue is… | Treat it as… | Where it goes |
|--------------------------|--------------|---------------|
| an adjective / vibe ("simple", "clean", "科技感", "简洁", "高级感") **on an interface scene** (prototype, info-interactive, web tool, dashboard/admin) | a **style lookup** | match it to `design-systems/style-skills` via the `mood` tags in that folder's `index.json`, and adopt the closest style skill as the UI base — interface scenes should lean on a mature UI system, not freeform taste |
| an adjective / vibe **on a creative scene** (landing, portfolio, campaign, social card, content) | a **creative direction** | feed it into Creative Context / Design Read; design original. May *reference* a library system's character, but is not required to adopt one (see Design Read source line) |
| a named brand ("Apple style", "like Stripe", "苹果风格") — **any scene** | a **brand reference** | `skills/design/design-system-reference.md` → `design-systems/brand-inspiration/` (website/brand-level; read that brand's DESIGN.md) |
| a named style skill ("use the `minimal` style", "atelier-zero") | a **style skill** | `skills/design/design-system-reference.md` → `design-systems/style-skills/` |
| an existing system to follow (uploaded DESIGN.md, screenshots, prior artifact, "match our product") | a **provided reference** | `skills/design/design-system-reference.md` (consistency with the given source) |
| "extract / define / produce a reusable DESIGN.md" | a **generation task** | `design-system-generation.md` |

Key distinctions:

- **Scene decides whether a vibe word hits the library.** On interface scenes (prototype /
  interactive / tool / dashboard), a vibe word like "科技感 / 简洁" SHOULD resolve to a style-skill
  via mood tags — the UI maturity of a real system is the point. On creative scenes (landing /
  portfolio / campaign), the same word is a creative direction, not a forced library lookup.
- **Brand word always hits brand-inspiration.** A named brand ("like Stripe") loads the
  website/brand-level reference regardless of scene — these are official/brand looks, the right
  fit for marketing/creative pages.
- **Read vs write a DESIGN.md.** "Apple style for this page" READS `design-systems/brand-inspiration/apple`
  as a reference; the deliverable stays the page's form. Only "turn this into a reusable DESIGN.md"
  WRITES a new spec and uses `design-system-generation.md`.

A style cue never changes the primary artifact skill: "an Apple-style landing page" is still `landing-page.md`, with Apple as a reference.

Scene-based default when the cue is just a vibe word (not a brand, not a named system):
- **Interface scene** (prototype / interactive / tool / dashboard) → resolve it to a `style-skills` entry via mood tags; lean on that UI system.
- **Creative scene** (landing / portfolio / campaign / card / content) → treat as creative direction; design original, optionally referencing a system's character.
- **No cue at all + interface/restrained scene** → still don't leave it to freeform taste: pick a `style-skills` baseline via the Mature System Fallback rather than inventing UI from scratch.

---

## Artifact Skill Notes

Each artifact's "use when" is in the Primary Routing table above; each skill file states its own
goal. Only the cross-skill boundaries that the table can't show are noted here:

- **prototype.md** absorbs dashboards/admin (with a dashboard focus) and apps
  (`platform: mobile`, usually `mobile-html`) until dedicated skills exist.
- **social-card.md vs content-page.md** — social cards, covers, fixed-image cards, Xiaohongshu/RED, WeChat/Douyin covers, screenshot explainer cards, KPI cards, quote cards, and long-image card sequences go to `social-card.md`. `content-page.md` is for linear reading pages. Only do both if the request explicitly asks for a reading page *and* a social cover/card.
- **content-page.md vs info-interactive.md** — reading → `content-page.md`; understanding / mapping / explaining / comparing / filtering / visualizing → `info-interactive.md`. If the user says “梳理一下”, “做成图解”, “讲清楚”, “做个流程图”, “架构图”, “关系图”, “时间线”, “对比页”, or asks to explore/filter a fixed body of information, prefer `info-interactive.md`, even when the final artifact is mostly static HTML/SVG rather than heavily interactive.
- **info-interactive.md boundaries** — vs prototype: explains *information* rather than demonstrating a *product*; vs dashboard: a fixed body of information rather than live/system data; vs deck/social-card: if the carrier is explicitly slides or social images, use that carrier skill plus `horizontal-craft/visual-explanation.md`.

## Other Design Scenarios

The active artifact skills are the Primary Routing table above. Reference/system files:
`design-system-reference.md`, `design-system-generation.md`, `export.md`, `quality-gate.md`,
`canvas-and-device.md`, and `horizontal-craft/*` (load per the trigger matrix in § Execution
essentials — that matrix is the single source for when to read each).

Not-yet-existing artifact skills:

- `dashboard.md` — until then, `prototype.md` with a dashboard focus
- `mobile-app.md` — not needed while app = `prototype.md` + `platform: mobile`
- poster — until then, use `social-card.md` or the nearest fixed-image skill

If the exact artifact skill is missing, use the closest available one; note the gap only when it affects execution.

# 3. Build well — execution, quality, references

怎么把它做好：执行要点、质量默认、HTML 结构，以及按需调用的参考/设计系统。

## Execution essentials

The top-of-file flow covers *what to do*. This adds the three things it doesn't spell out: which references to load, the delivery checks, and web-project delivery.

### Load a reference only when its trigger is present

This is the single source for "what to read when". Default to reading none; pull 1–3 relevant
files per task.

```text
quality-gate.md                              → every generated / major-edited HTML artifact (mandatory)
canvas-and-device.md                         → fixed canvas, device/phone/tablet/desktop preview, deck canvas, social card, long image, export size, fixed aspect ratio
design-system-reference.md                   → a brand / style / template / DESIGN.md reference exists; OR no style direction is provided for product/interface-heavy artifacts where a mature baseline improves consistency
horizontal-craft/color.md                    → no design system or color direction is underspecified
horizontal-craft/accessibility.md            → interactive or publish-ready artifacts; also checked in quality gate
horizontal-craft/animation-discipline.md     → motion, transitions, scroll effects, or animated storytelling
horizontal-craft/form-validation.md          → forms, inputs, validation, submission, signup, checkout, or settings surfaces
horizontal-craft/laws-of-ux.md               → pricing, onboarding, dashboards, H5 tools, conversion flows, or interaction-heavy artifacts
horizontal-craft/icon-system.md              → any UI / feature / nav / status icon, pictogram, icon-like mark
horizontal-craft/chinese-typography.md       → substantial Chinese text / Chinese reading comfort (apply its Mandatory Runtime Baseline)
  → reference/title-and-breaking.md          → title / cover / PPT / XHS heading line breaks
  → reference/punctuation.md                 → punctuation-heavy long Chinese copy
  → reference/text-detail.md                 → font size / line height / spacing / paragraph rhythm
  → reference/fonts.md                        → font selection, formal report typography
horizontal-craft/state-coverage.md           → product / dashboard / form / tool / H5 / data / prototype surfaces
horizontal-craft/data-integrity.md           → metrics, charts, tables, rankings, percentages, or claims
horizontal-craft/link-and-proof.md           → links, CTAs, citations, client logos, testimonials, proof claims
horizontal-craft/visual-explanation.md       → flowcharts, architecture/system maps, timelines, relationship diagrams, process diagrams, comparison visuals, charts, maps, explorable models, or any visual explanation component
horizontal-craft/technique-library.md        → an effect beyond plain CSS would serve the goal (motion / 3D / data-viz)
```
Reading a reference is not enough — the rules must actually change the artifact. Don't claim a
gate was applied unless the HTML/CSS/JS really contains the implementation.

### Before delivery (blocking)

```text
[ ] quality-gate.md executed as a blocking checklist (not passive reference)
[ ] :focus-visible present for interactive artifacts; reduced-motion when motion exists
[ ] required data markers / Design Compliance comment present and matching the real code
[ ] no fake proof, emoji-as-icons, dead links, placeholder logic, or missing assets
```
If a gate can't pass, fix the artifact or explicitly flag the unresolved issue — never silently ignore it.

### Web entry handoff

After the delivery checks pass, hand off to `skills/version-management/SKILL.md` only when the deliverable includes an entry frontend file (`.html`, `.jsx`, `.tsx`, `.vue`). This trigger is output type, not scenario name — it applies even if a skill/template says to output inline HTML or a standalone file. That skill owns project paths, assets, version records, and version surfacing; skip it for specs, images, documents, PPTX, JSON, or export packages.

## Built-In Quality Defaults

All design artifacts must avoid generic AI-generated defaults and remain credible, structured, accessible, and editable. In particular, do **not** reach for generic gradient / card-grid / bento / rounded-card defaults as an automatic style — choose form deliberately (see `horizontal-craft/anti-ai-slop.md`).

The credibility, accessibility, and integrity checks (no fake proof, no emoji-as-icons, no dead links, no placeholder logic, focus/reduced-motion) are enforced by the **Before delivery** checklist above and `quality-gate.md` — not repeated here.

Use `canvas-and-device.md` when sizing, viewport, export ratio, or device-frame constraints matter.

## HTML Artifact Structure

Structure generated HTML for future edits — stable section ids / data attributes:

```html
<section id="hero" data-section="hero">      <!-- pages: hero/work/about/contact -->
<section class="slide" data-slide="cover">   <!-- decks -->
<section data-screen="dashboard">            <!-- prototypes: + data-state, data-component -->
```

- keep sections / slides / screens / components / states identifiable for selected-region edits
- prefer readable semantic HTML; don't hide content in opaque generated blobs
- label placeholder content as placeholder; no dead `href="#"` in publish-ready artifacts unless marked

---

## Chinese Typography Execution Rule

With substantial Chinese text, apply `horizontal-craft/chinese-typography.md` — the **Mandatory Runtime Baseline** for normal artifacts; baseline + the Reference Escalation Matrix files for typography-heavy ones. Don't block normal generation on reading every reference. Don't claim Chinese typography was applied unless the CSS makes concrete decisions for: font stack, display strategy, font size, line-height, measure/max-width, letter-spacing, paragraph rhythm, punctuation, mixed CN-Latin-number handling.

## Design System Reference Skill

Use `design-system-reference.md` when: the user selects a style skill or preset template; names a public brand as inspiration; asks to follow a mature/open-source design system; provides screenshots/code/brand rules/components/tokens/prior artifacts; the output should stay consistent with an existing product or uploaded `DESIGN.md`; OR no style direction is given and the artifact is product/interface-heavy enough to benefit from a mature baseline.

Do not use the mature-system fallback for expressive/editorial/social artifacts unless asked. Reference libraries: `design-systems/style-skills/`, `design-systems/brand-inspiration/`, `design-systems/INDEX.md`. Load only the most relevant reference, never all.

---

## Template Rule

Templates are structure seeds, not a routing layer — but checking them **is a default step** (The flow §1.5), not only when asked. After the artifact skill is chosen, scan `design-templates/INDEX.md` by carrier + scenario; a clear match → **adopt as the starting point** (usually better than from scratch). An explicit user selection is high-priority unless it conflicts with the brief/platform.

When adapting a template: preserve useful structure/behavior; replace placeholders with real or inferred content; remove sections that don't serve the goal (don't fill them with fake content); adapt style, copy, density, pacing; keep it editable; prefer local edits over full rewrites; still apply the scenario skill + horizontal craft even if the template has similar rules.

Selection order: pick artifact skill → use `design-templates/TEMPLATE-ROUTER.md` to decide if a template applies → read only the selected template's `SKILL.md` → read its `pattern.html` only if the markdown lacks structural detail, and then extract layout rhythm / section relationships / responsive / interaction only (never copy DOM, class names, tokens, placeholder text, or styling wholesale). If nothing matches, use the artifact skill directly — never force a template. Use `design-templates/` as the only template layer; the template is a starting pattern, not the final answer.

---

## Public Brand References

When the user names a public brand (Apple, Stripe, Linear, Notion, Airbnb, Nike, 小红书…): treat as inspiration, not an official design system; extract high-level qualities (mood, restraint, density, typography, interaction feel, content structure); create an original design; don't copy proprietary layouts, logos, assets, branded UI; don't claim an official design system unless the user provides one.

---

## Open-Source Design Systems

When the user explicitly asks for an open-source design system: use it per its public docs and license; prefer official components/tokens/patterns and real component APIs; respect attribution/license; don't confuse it with the company's private brand or internal product UI. ("Use Ant Design components" = Ant's public component system, not Ant Group's proprietary brand.)

---

## Technique Library

`horizontal-craft/technique-library.md` is a reference of advanced front-end techniques (motion, 3D, data-viz) and when each helps — **not a routing target** (a user asks for "a landing page with rich scroll storytelling", never "a GSAP"). When a scenario needs an effect beyond plain CSS, consult it for the right technique and when-to-use. Default to simple CSS; escalate only when the effect serves comprehension/emotion/goal, always with reduced-motion; never for novelty. If the deliverable's purpose is expressing information, route to `info-interactive.md` and use the techniques there.

---

## Reference Priority

Use references in this order (closer to the user's actual project = higher priority):

1. current selected object / artifact state · 2. user `DESIGN.md` · 3. user-selected template · 4. user content/screenshots/assets/HTML · 5. existing project styles/components/prior artifacts · 6. selected style skill or brand inspiration · 7. open-source design system explicitly requested · 8. mature baseline for product/interface-heavy artifacts with no style direction · 9. common scenario patterns · 10. general design knowledge · 11. model freeform taste.

---

## Design System Generation Skill

Use `design-system-generation.md` only when the user wants to import, extract, normalize, generate, or persist a reusable `DESIGN.md` — Import Mode (existing DESIGN.md/guideline), Extraction Mode (HTML/screenshot/template/CSS/page), or Persistence Mode (preserve current artifact's visual language). Don't run it by default for a first draft.

---

# 4. Deliver & wrap up

## Web entry / version management (single rule)

After `quality-gate.md` passes, run `skills/version-management/SKILL.md` **iff the deliverable includes an entry frontend file** (`.html`, `.jsx`, `.tsx`, `.vue`). The trigger is output type, not scenario — it applies even if a skill/template says to output inline HTML, Desktop, or a standalone file. That skill owns project path, assets, git, metadata, and the user-visible version card; a project only pasted in chat or saved to workspace root is **not** delivered. Skip it for image-only, document, PPTX, JSON, DESIGN.md-only, or export-package tasks with no new editable web entry. Don't restate its mechanics here.

---

## Export Skill

Use `export.md` when the user asks to export, download, package, hand off, or convert the artifact. Targets: standalone HTML, ZIP, image/screenshot, PDF, PPTX, JSON/metadata, design spec, DESIGN.md package. Export must preserve the current artifact state — don't silently redesign during export.

---

## IP and Content Boundaries

Don't recreate copyrighted/proprietary designs. If asked to recreate a company's distinctive UI, branded elements, logos, or assets, refuse unless the user provides authorization or owned materials — instead create an original that captures high-level qualities without copying protected expression. Preserve license notices when exporting vendored third-party templates/assets.

Don't add scope without permission (ask before adding sections/pages the user didn't request, unless required for coherence). Don't pad with filler. (Scope/filler ≠ content depth: within the requested scope, still fill a full plausible scaffold per Default Assumption Policy. "Add scope" = inventing unrequested pages; "filler" = meaningless padding; fleshing out the requested page is expected.)

---

## Output Expectations

Artifacts should be usable, structured, editable, traceable when useful, exportable when requested. Preserve enough structure for later page/section/slide/screen/component/parameter edits, selected-region comments, DESIGN.md extraction, export, and version comparison. Don't produce throwaway unstructured output when the user is likely to iterate.

---

## Edit Handling

**Selected-region comment edits:** use the region context as the primary target — prefer local edits over rewrites, preserve unrelated sections, apply only to the selected target unless told otherwise; if ambiguous, choose the safest local edit or ask one concise question.

**Local parameter edits** (color, spacing, radius, density, type scale, layout variant, device preview): may be handled by deterministic local tools — don't invoke a model skill unless the change affects design intent, content structure, or visual direction.

---

## Handoff

After selecting the primary path, read the corresponding artifact skill before generating/editing/exporting. `INDEX.md` is the directory map (don't duplicate the file list here; runtime routing lives in this SKILL.md, directory discovery in INDEX.md). If a skill file doesn't exist yet, proceed on this router's principles and note the gap only if it affects execution.
