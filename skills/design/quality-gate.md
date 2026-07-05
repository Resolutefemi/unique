---
name: quality-gate
description: Final blocking delivery gate for generated or major-edited design artifacts. Verifies brief fit, carrier logic, template adaptation, design-system consistency, horizontal craft application, interaction states, visualization integrity, accessibility, truthfulness of data/links/proof, and anti-AI-slop. Run as a blocking checklist, not a passive reference. Triggers on "质量检查", "交付检查", "delivery check", "design QA", "compliance check", or whenever an artifact is about to be handed off.
mode: quality-gate
platform: any
scenario: delivery-quality
preview:
  type: none
default_for:
  - quality gate
  - design QA
  - delivery check
  - compliance check
  - 交付检查
  - 质量检查
fidelity: system
---

# Quality Gate

Run this gate **after** an artifact is generated or substantially edited, **before** delivery.

This file is a verification layer. It does not contain design rules — those live in artifact skills and `horizontal-craft/*.md`. The gate only confirms that the right rules were actually applied and visible in the output.

```text
Brief → Artifact Skill → Template / Design System / Craft → Artifact → [Quality Gate] → Delivery
```

If a check fails, fix the smallest failing issue. Do not redesign the whole artifact unless the user asked for one.

---

## Required inputs

Before running any check, restate the following back to the user in 5–8 short lines. If anything is unknown, ask once rather than guessing — wrong assumptions here invalidate every check below.

```yaml
quality_gate_inputs:
  user_request:              # what the user actually asked for, one sentence
  primary_artifact_skill:    # landing-page / portfolio / prototype / content-page / info-interactive / web-tool / social-card / deck / ...
  output_target:             # web / mobile web / fixed canvas / PDF / image / slide ...
  design_system_or_reference: none | name
  template_or_seed:          none | name
  relevant_horizontal_craft: # only the ones that actually apply, not the full list
    - ...
  generated_artifact:        # path or identifier
```

The `relevant_horizontal_craft` list drives §5. Choose from:

- `anti-ai-slop` — required for every final review
- `chinese-typography` — substantial Chinese text exists
- `visual-explanation` — charts, diagrams, timelines, maps, explorable models
- `icon-system` — UI icons or pictograms
- `accessibility` — HTML or any interactive surface
- `state-coverage` — interactive / data / form / tool / prototype surface
- `form-validation` — forms, inputs, validation
- `data-integrity` — data, charts, tables, metrics, claims
- `link-and-proof` — links, CTAs, proof claims
- `color` — no design system, or color direction is unclear
- `animation-discipline` — motion exists
- `laws-of-ux` — pricing, onboarding, dashboards, H5 tools, conversion or interaction-heavy flows
- `technique-library` — advanced motion, 3D, shaders, data-viz, or effects beyond plain CSS/SVG

---

## Gate sequence

| # | Check | Guards which stage of the pipeline |
|---|---|---|
| 1 | Brief Fit | Brief → Artifact |
| 2 | Carrier / Artifact Structure | Artifact Skill → Artifact |
| 3 | Template Adaptation | Template → Artifact |
| 4 | Design System / Visual Consistency | Design System → Artifact |
| 5 | Horizontal Craft Trigger | Craft → Artifact |
| 6 | Interaction and State | Artifact (interactive surfaces) |
| 7 | Visual Explanation | Artifact (charts / diagrams) |
| 8 | Accessibility | Artifact (HTML / interactive) |
| 9 | Truthfulness | Artifact → Delivery (links + data) |
| 10 | Anti-AI Slop | Artifact → Delivery (final review) |
| 11 | Editability & Compliance Markers | Artifact → Delivery (handoff metadata) |

---

## 1. Brief Fit

```text
[ ] artifact type matches the user request
[ ] audience and use case are visible in the design
[ ] language matches request or dominant context
[ ] output surface matches requested platform / device / canvas
[ ] major constraints are not ignored
[ ] inferred assumptions are safe and not over-specific
```

Fail if the artifact is polished but solves the wrong problem.

---

## 2. Carrier / Artifact Structure

The artifact must behave like its intended carrier, not just look like it.

```text
landing-page      → single-subject conversion page, value clarity, one primary action
portfolio         → work/identity hierarchy, project structure, contact path
prototype         → reachable screens/states, real interaction, prototype.html + flow.html when required
content-page      → linear reading rhythm, section hierarchy, long-form readability
info-interactive  → explorable fixed information body, not a product demo
web-tool          → working input → logic → result path, real validation
social-card       → fixed canvas / HTML-to-image, mobile/export readability, one role per card
deck              → slide rhythm, one idea per slide, presentation canvas
```

Fail if the visual style is right but the carrier logic is wrong — e.g. a social-card delivered as a scrollable webpage, or a product-brief image treated as a landing page.

---

## 3. Template Adaptation

Skip this check if no template or seed was used.

```text
[ ] SKILL.md / markdown instructions were treated as primary over pattern.html
[ ] pattern.html was not copied wholesale
[ ] placeholder copy and fake assets are replaced or labeled
[ ] unused sections are removed rather than filled with fake content
[ ] template structure serves the current artifact skill and user goal
[ ] visual style was adapted through user request / design system / visual intent
```

Fail if the output is a shallow copy with only text/color changes.

---

## 4. Design System / Visual Consistency

```text
[ ] typography, color, spacing, radius, shadows, and components share one visual language
[ ] tokens or repeated values are used intentionally
[ ] accent color has a role and is not overused
[ ] no unrelated style systems are mixed accidentally
[ ] design-system constraints do not override usability or carrier fit
```

Fail if the artifact looks like a random template collection.

---

## 5. Horizontal Craft Trigger

For each item in `relevant_horizontal_craft` from the inputs, open that craft file and confirm its rules are visibly applied. Do not load craft files that were not listed.

| Condition | Required craft file |
|---|---|
| Final review (always) | `horizontal-craft/anti-ai-slop.md` |
| Substantial Chinese text, including typography-led titles/covers/reports | `horizontal-craft/chinese-typography.md` (+ `horizontal-craft/reference/fonts.md` when font choice materially affects visual direction) |
| Charts, diagrams, timelines, maps, explorable models | `horizontal-craft/visual-explanation.md` |
| UI icons / pictograms / icon buttons | `horizontal-craft/icon-system.md` |
| HTML / interactive / publish-ready surface | `horizontal-craft/accessibility.md` |
| Forms / inputs / validation | `horizontal-craft/form-validation.md` |
| Interactive states / dashboards / tools / prototypes | `horizontal-craft/state-coverage.md` |
| Metrics / charts / tables / demo data / claims | `horizontal-craft/data-integrity.md` |
| CTAs / links / proof claims / citations / logos | `horizontal-craft/link-and-proof.md` |
| Unclear color direction / no design system | `horizontal-craft/color.md` |
| Motion / transitions / animated charts | `horizontal-craft/animation-discipline.md` |
| Pricing / onboarding / dashboards / H5 tools / conversion or interaction-heavy flows | `horizontal-craft/laws-of-ux.md` |
| Advanced implementation beyond plain CSS/SVG | `horizontal-craft/technique-library.md` |

Fail if a needed craft rule was skipped and the artifact visibly suffers.

---

## 6. Interaction and State

Required for any interactive artifact (prototype, web-tool, dashboard, form).

```text
[ ] controls are clickable and have real behavior
[ ] no placeholder JS, TODO handler, alert('todo'), or console-only interaction remains
[ ] loading / empty / error / success / populated / edge states exist when relevant
[ ] form validation preserves input and explains recovery
[ ] dangerous actions have confirm, undo, or clear prevention
[ ] keyboard and focus behavior are usable
```

Reference: `horizontal-craft/state-coverage.md`, `horizontal-craft/form-validation.md`.

---

## 7. Visual Explanation

Required when the artifact contains charts, diagrams, timelines, maps, comparison visuals, flowcharts, explorable models, or interactive explanations.

```text
[ ] representation matches the information shape
[ ] chart/diagram/map/timeline has a clear comprehension goal
[ ] interaction changes what the user can understand, compare, filter, decide, or do
[ ] no decorative-only controls, fake filters, or motion-only widgets
[ ] charts have readable labels, units, scales, and conclusions where relevant
[ ] diagrams have legible nodes, clear arrows, and labeled branches/conditions
[ ] visual explanation feels native to the carrier
[ ] labels remain readable at target viewport / export scale
```

Reference: `horizontal-craft/visual-explanation.md`.

Fail if the visualization looks impressive but explains less than a clear paragraph or table would.

---

## 8. Accessibility

Required for HTML and interactive artifacts.

```text
[ ] text contrast is sufficient
[ ] non-text UI contrast is sufficient
[ ] focus-visible exists
[ ] interactive elements are keyboard reachable
[ ] buttons and links use correct semantics
[ ] inputs have labels
[ ] icon-only controls have accessible names
[ ] decorative icons are aria-hidden
[ ] chart/diagram information is not conveyed by color alone
[ ] reduced-motion fallback exists when motion exists
```

Reference: `horizontal-craft/accessibility.md`.

---

## 9. Truthfulness

Hard checks on links, data, and demo markers. This section covers *verifiable* failures. Stylistic/cliché failures (fake logos, invented testimonials) live in §10.

```text
[ ] no href="#" or javascript:void(0) unless visibly marked placeholder
[ ] every CTA has a real destination, action, or visible pending state
[ ] demo/sample data is visibly labeled as such
[ ] charts and tables show units and source (or are labeled demo)
[ ] numbers in copy are either sourced or softened
[ ] no broken anchors or dead internal navigation
```

Reference: `horizontal-craft/data-integrity.md`, `horizontal-craft/link-and-proof.md`.

---

## 10. Anti-AI Slop

Always run as the final review. Covers unearned defaults and fabricated proof.

```text
[ ] no decorative emoji used as icons / bullets / labels
[ ] no generic blue-purple gradient as default visual system
[ ] no fake logos, testimonials, awards, rankings, press claims, customer quotes
[ ] no invented metrics presented as real
[ ] no feature-card filler grid (3-up / 4-up with vague benefits)
[ ] no generic "hero + three cards + CTA" with no content-specific idea
[ ] no stock-photo / floating-device / fake-mockup evidence
[ ] no Chinese AI cliché copy that weakens credibility
[ ] no decorative blobs / orbs / background patterns used to fill space
[ ] consistent icon family (no emoji/icon mix)
[ ] no visualization or interaction added only to look advanced
```

Reference: `horizontal-craft/anti-ai-slop.md`.

Fix the specific failure. Do not redesign by default.

---

## 11. Editability & Compliance Markers

Required for every HTML artifact. Enforced by `SKILL.md` Before-delivery checklist and consumed by `export.md`, `deck.md`, `portfolio.md`, and version-management handoff. Not optional.

### 11a. Editability data markers

```text
[ ] page sections, slides, screens, components, and interaction states are individually identifiable
[ ] stable structural anchors exist (semantic HTML, named sections, or selected-region comments)
[ ] no opaque generated blobs that block selected-region edits
[ ] placeholder content is labeled as placeholder
```

These let the user re-select and locally edit. Without them, follow-up iteration breaks.

### 11b. Design Compliance block

Insert this non-visible HTML comment near the end of the artifact. It must match the actual code — do not paste a generic version.

```html
<!--
Design Compliance:
- brief-fit: pass
- artifact-skill: [name]
- output-target: [name]
- template-or-seed: none / [name]
- design-system: none / [name]
- horizontal-craft:
  - anti-ai-slop: pass
  - chinese-typography: pass / not relevant
  - visual-explanation: pass / not relevant
  - icon-system: pass / not relevant
  - accessibility: pass / not relevant
  - state-coverage: pass / not relevant
  - form-validation: pass / not relevant
  - data-integrity: pass / not relevant
  - link-and-proof: pass / not relevant
  - color: pass / not relevant
  - animation-discipline: pass / not relevant
  - laws-of-ux: pass / not relevant
- interaction-states: pass / not relevant
- truthfulness: pass
- anti-ai-slop: pass
- editability-markers: pass
-->
```

For non-HTML deliverables (PDF, image, deck export), record the same fields in the delivery note instead.

---

## Blocking failures

These must be fixed before delivery. Each maps to the section that owns it.

```text
[ ] wrong artifact type or carrier                                  → §2
[ ] no visible relation to the brief                                → §1
[ ] interactive artifact with no meaningful state handling          → §6
[ ] visualization that does not aid understanding                   → §7
[ ] inaccessible icon-only controls                                 → §8
[ ] form inputs without labels                                      → §8
[ ] href="#" / fake JS handler in publish-ready artifact            → §9
[ ] fake proof / invented metrics / fake logos                      → §10
[ ] decorative emoji used as icons by default                       → §10
[ ] Chinese output with obvious typography failure                  → §5 (chinese-typography)
[ ] missing editability data markers (selected-region / stable structure) → §11a
[ ] missing or mismatched Design Compliance block in HTML artifact   → §11b
```

---

## Non-blocking improvement suggestions

Note these in the delivery summary; do not block on them unless severe.

```text
[ ] visual rhythm could be more distinctive
[ ] one section feels generic
[ ] motion could be more purposeful
[ ] chart could be simplified further
[ ] design system could be made more explicit
```

Do not over-polish by adding decoration. Fix structure, hierarchy, content, proof, interaction, and representation first.

---

## Delivery summary

After running the gate, report results to the user as a short table — one row per section, `pass / fail (fixed) / not relevant`, plus any non-blocking notes. Keep it under 15 lines.
