---
name: Landing Page Skill
description: Design single-subject product landing pages, SaaS homepages, pre-launch waitlists, service pages, agency/studio pages, pricing pages, and conversion-oriented product marketing pages as self-contained HTML artifacts.
mode: artifact
platform: responsive-web
scenario: landing-page
preview:
  type: html
default_for:
  - landing page
  - product landing page
  - product homepage
  - SaaS homepage
  - SaaS landing
  - product website
  - marketing page
  - pre-launch waitlist
  - waitlist page
  - service page
  - agency homepage
  - studio homepage
  - pricing page
  - 产品落地页
  - 产品官网
  - SaaS 主页
  - 官网
  - waitlist 页
  - 定价页
fidelity: high
---

# Landing Page Skill

Design a landing page for **one product, service, offer, or subject** that helps a visitor understand the value, feel the product, and take one clear action.

This file gives landing-page judgment, not a full rulebook. Use the global Design Skill flow, quality gate, delivery, export, and version-management rules.

## Route elsewhere if

- it primarily showcases a person or body of work → `portfolio.md`.
- it is a product UI, dashboard, app flow, clickable demo, or operational workflow → `prototype.md`.
- it is a single-task calculator/generator/checker/tool → `web-tool.md`.
- it is linear reading, newsletter, editorial article, or report-like reading page → `content-page.md`.
- it is interactive information exploration or data story → `info-interactive.md`.
- it is a social-distribution image, product brief image, announcement card, report summary image, poster, cover, or long-image sequence → `social-card.md`.
- it is a slide presentation, pitch deck, or PPT-style output → `deck.md`.

A studio/agency site can be both portfolio and landing page. Lead with the dominant intent: selling a service (clear offer, pricing or contact CTA, capability framing) → landing page; showing work and personality (case-led grid, project depth, distinctive voice) → portfolio.

## What makes a landing page succeed

The page must make a visitor answer three questions quickly:

1. What is this?
2. Why should I care?
3. What should I do next?

The common failure mode is a polished but interchangeable page: soft gradient, vague headline, three feature cards, fake proof, and no real product logic.

For open-ended or marketing-led pages, commit to one clear visual idea: one structural idea, one type voice, one color territory, one signature moment.

For trust-sensitive or enterprise pages, distinctiveness should come from hierarchy, proof, product clarity, and restraint — not loud visual moves.

## The few decisions that matter

- **Audience and action** — one primary audience and one primary CTA. Do not split the page between competing goals.
- **Value proposition** — the hero must explain the product/service and create one emotional or practical reason to continue.
- **Structure** — pick a coherent structure: classic scroll, product showcase, sales/pricing page, waitlist launch, service page, editorial launch, or interactive-canvas hero. Do not blend several structures into mush.
- **Proof strategy** — use only real or clearly marked placeholder proof: product UI, workflow example, customer quote, metric, case, benchmark, press, or demo data.
- **Visual direction** — choose a visual idea from the product and audience. Avoid generic SaaS defaults unless the brief truly calls for convention.
- **Rhythm** — vary density. Avoid a page of equal cards. Use one dominant moment and supporting modules.
- **Conversion path** — primary CTA is visible, repeated where natural, and not drowned by secondary actions.

## Non-negotiables

- Product/service value must be concrete, not vague positioning language.
- One primary action; secondary actions stay secondary.
- Every information-dense section must show at least four visual-weight tiers (hero / primary / secondary / tertiary). No single-column equal-height row stacks — no CSV-with-CSS.
- Never invent customer logos, testimonials, usage numbers, awards, market data, quotes, or other proof.
- No Lorem ipsum, empty filler sections, dead `href="#"`, or decorative emoji as icons.
- High polish must not hide weak structure.
- Template sections that do not serve the page goal must be removed, not filled with fake content.

## Avoiding AI slop

The detailed catalog lives in `quality-gate.md`. Here the landing-page principle is simpler: every major choice — palette, hero composition, typography, motion, module order — must come from the product, audience, and action. A bento grid, purple gradient, card wall, or oversized glow is acceptable only when it earns its place.

## Decision Sequence

1. Pin the subject, audience, one primary action, and trust/conversion context.
2. Choose the page structure and proof strategy.
3. Choose the visual direction: color, type, rhythm, and one signature moment.
4. Build the page with real section hierarchy and editable section markers.
5. Run the distinctiveness test: cover the product name — could this be any competitor?
6. Run the global quality gate before delivery.

## References, load only when triggered

- `design-system-reference.md` — when a brand guide, style reference, template, or `DESIGN.md` is provided or referenced.
- `design-templates/TEMPLATE-ROUTER.md` + `design-templates/INDEX.md` — reusable pattern such as SaaS landing, pricing page, waitlist, launch page, service page.
- `horizontal-craft/chinese-typography.md` — substantial Chinese text, or custom Chinese webfont loading (preload + fetchpriority / print-onload non-blocking / unicode-range subset / system fallback).
- `horizontal-craft/color.md` — no design system is provided, or color direction is vague.
- `horizontal-craft/icon-system.md` — feature icons, pictograms, nav/status icons, or icon-like marks.
- `horizontal-craft/link-and-proof.md` — client logos, testimonials, claims, awards, press, citations, CTA links, or proof modules.
- `horizontal-craft/data-integrity.md` — metrics, ROI, market size, growth rates, benchmarks, charts, or tables.
- `horizontal-craft/animation-discipline.md` — scroll reveal, parallax, hero motion, micro-interactions, or page transitions.
- `horizontal-craft/technique-library.md` — advanced effects beyond plain CSS serve comprehension, emotion, or the product goal.
- `canvas-and-device.md` — special viewport, device frame, export size, or responsive breakpoint constraints.

Do not load every reference by default. Load what the page actually needs.

## Creative Context

For open-ended requests, use `SKILL.md` Creative Context Completion before generating. The scenario gives page judgment; creative context gives the design idea.

## Final Gate

Run `quality-gate.md` as the blocking global checklist. Before that, run this landing-page self-check:

- The hero answers what / why / next-action within one screen.
- Visual-weight tiers are visible (hero / primary / secondary / tertiary) — not a wall of equal cards.
- Primary CTA appears at hero and re-appears at one natural commitment moment; secondary actions never compete.
- Every proof element is real or clearly marked placeholder; no invented logos, quotes, or metrics.
- Every CTA resolves to a real next step (form, pricing, contact, confirmation page) — never `href="#"`.
- For Chinese pages: webfont loaded non-blockingly with system fallback; no FOIT on slow networks.
- Cover the product name — the page would not work unchanged for an arbitrary competitor.

Landing-page-specific failures:

- the hero does not explain the offer/product;
- the primary CTA is unclear or competing with too many actions;
- proof is invented or fake-real;
- the page is just generic hero + feature cards + CTA;
- sections are padded with filler;
- the visual direction is unrelated to the product/audience;
- pricing/sales pages do not answer buying objections;
- waitlist/launch pages do not make signup value clear.

## Handoff

Use the standard Design Skill delivery, export, and version-management flow. Landing pages have no separate handoff process unless the user requests export/package/asset handoff.
