---
name: Daniel Adegoke
description: An editorial engineer's portfolio. The name in copper particles, then giant wide type, numbered sections and numbers the words prove.
colors:
  ground: "#0b0807"
  raised: "#120d0b"
  text: "#f4ece4"
  quiet: "#bcaea2"
  faint: "#8f8277"
  rule: "#2c231e"
  rule-strong: "#4a3d34"
  copper: "#e8894f"
  amber: "#f6bc7a"
  silver: "#dfe3ea"
typography:
  display:
    fontFamily: "Archivo"
    fontVariation: "'wdth' 112"
    fontWeight: 800
    fontSize: "clamp(2.4rem, 10vw, 9.5rem)"
    lineHeight: 0.86
    letterSpacing: "-0.045em"
  proof:
    fontFamily: "Archivo"
    fontVariation: "'wdth' 112"
    fontWeight: 800
    fontSize: "clamp(5rem, 19vw, 18rem)"
    lineHeight: 0.8
    letterSpacing: "-0.06em"
  hero-headline:
    fontFamily: "Archivo"
    fontWeight: 700
    fontSize: "clamp(2.1rem, 4.4vw, 4.6rem)"
    lineHeight: 0.96
    letterSpacing: "-0.04em"
  title:
    fontFamily: "Archivo"
    fontWeight: 700
    fontSize: "clamp(2rem, 3.6vw, 3.25rem)"
    lineHeight: 0.98
  lead:
    fontFamily: "Schibsted Grotesk"
    fontSize: "clamp(1.125rem, 1.4vw, 1.3rem)"
    lineHeight: 1.4
  body:
    fontFamily: "Schibsted Grotesk"
    fontSize: "1rem"
    lineHeight: 1.55
  mono:
    fontFamily: "Geist Mono"
    fontSize: "0.75rem"
    letterSpacing: "0.02em"
rounded:
  none: "0px"
spacing:
  gutter: "clamp(1.25rem, 4vw, 3.5rem)"
  max: "92rem"
  nav: "4rem"
  section-top: "clamp(6rem, 16vh, 11rem)"
---

# Design System: Daniel Adegoke

## Overview

**North star: "Editorial engineer".** A studio-grade editorial page with the texture of a precision instrument. Huge, wide, heavy type carries the page. Mono micro-labels number and annotate it. One copper accent marks what can be acted on.

The first screen is the only place for the particle form: tens of thousands of copper points spell DANIEL ADEGOKE. As the visitor scrolls into Work, the name pours out into a sparse field of silver stars that stays, dimmed, behind the rest of the page. Below the hero every section opens the same way: a mono `NN / 07` eyebrow, a giant heading that rises word by word out of a mask, a short intro on the right, then the number the section proves, set as giant type that counts up as it arrives.

## Colour

Warm monochrome with one accent.
- **Ground** `#0b0807`: the page, canvas background, nav once scrolled, footer, browser theme colour, text on copper.
- **Raised** `#120d0b`: project cards only.
- **Text** `#f4ece4`, **Quiet** `#bcaea2` (secondary reading), **Faint** `#8f8277` (mono labels, captions, muted second headline line).
- **Rule** `#2c231e` and **Rule strong** `#4a3d34`: 1px structure and outline buttons.
- **Copper** `#e8894f`: the single accent. Solid buttons, link underlines, list dashes, the status dot, the scroll-progress hairline, and the prefix or unit of a proof number ("Top", "%"). **Amber** `#f6bc7a` only answers the visitor (hover, focus ring).
- **Silver** `#dfe3ea`: stars only, never interface.

## Typography

- **Archivo** (variable, `wdth` axis) at 800 and `wdth 112` for the display headings, proof numbers, project glyphs and wordmark. Set the width with `font-variation-settings: "wdth" 112`, not `font-stretch`, and reference `var(--font-archivo)` directly. Tailwind's `--font-display` resolves on `:root`, where next/font's variable is not defined.
- **Archivo** 700 at normal width for the hero headline and project titles.
- **Schibsted Grotesk** 400/500/600 for reading text.
- **Geist Mono** for micro-labels: section indices, dates, captions, technology lists, the clock and status.

## Layout

A centred column up to 92rem with a fluid gutter. Section heads are a two-column grid (heading left, 26rem intro right) from 1024px. Lists are full-width rows divided by 1px rules: Open source and Experience use 3-column rows.

**Hero**, in four corners: role and stack at top-left; `Famagusta HH:MM` at top-right (live); the name across the middle (particles, or type on the still tier); the headline, detail and CTAs at bottom-left; status, availability, GitHub/LinkedIn and the scroll cue at bottom-right.

**Work** is a deck of square cards: 5/7 split, text left, media right. From 1024px each card's slot is sticky at `nav + 1rem + i × 14px`, with 45vh between slots so each card holds while it's read. Covered cards scale down by about 2–7% and darken. Media is a real capture (`public/work`); a project without one shows its own number as type over a 3rem grid.

**Phones (below 640px)** get their own tighter scale: 4.5rem section tops, headings at 12.5vw, proof numbers at 21vw, 1rem card padding, and skills two to a row. Below 1024px a project card leads with its capture, and the type-only number panel is dropped because the card body already states the number. `.card` declares `grid-template-columns: minmax(0, 1fr)` so wide content can never widen it past the screen.

## Motion

All motion lives in `components/motion.tsx` (reveals, split headings, count-ups, clock, scroll progress, magnetic buttons, smooth wheel) and `components/work-stack.tsx` (stacking scale, video play and pause).
- **Hero entrance:** CSS only. The nav fades, the corner labels fade, the name and headline lines blur-rise (opacity, y 24px, blur 8px → 0 over 900ms `cubic-bezier(.16,1,.3,1)`), stepped 150 → 1100ms.
- **Section heads:** the eyebrow and intro rise; the heading's words rise out of a mask (110% → 0, 1.1s, 70ms stagger).
- **Reveals:** `[data-reveal]` rises 32px over 800ms when 15% is visible; `[data-stagger]` steps children.
- **Count-up:** `[data-count]` eases out over 1.6s. Years count from 12 below.
- **Buttons:** the label rolls up on hover (500ms); primary hero and contact CTAs are magnetic (0.22 of the pointer offset).
- **Smooth wheel:** lerp 0.12, fine pointer only, and gives way to keyboard, pointer, scrollbar and anchor jumps.
- **Grain:** a fixed SVG noise layer at 5% over everything.
- Reduced motion shows the final state of every one of these.

## Components

- **Buttons** (`.btn`): square, 44px tall, 1px border. `btn-solid` is copper with ground text and turns amber on hover. `btn-outline` has a rule-strong border and fills copper on hover.
- **Links** (`.link`): a 1px copper underline drawn as a background, amber on hover. `.link-grow`: the underline grows from the left on hover (nav-adjacent links, the contact email).
- **Nav**: transparent over the hero, ground with a rule once scrolled, a copper scroll-progress hairline, links with mono superscript section numbers, and a full-screen menu below 1024px.
- **Proof** (`ProofFigure`): the giant number with a mono caption beside it, `aria-hidden` because the words state it.

## Rendering tiers

- **Full:** 1024px and wider, fine pointer, WebGL2 and no reduced motion. Runs the particle hero and star field. Two stops only, `top` (the name) and `field` (stars), in `lib/gallery.ts`.
- **Still:** everything else. No canvas, and three.js is never downloaded. The name is set as giant type, and 40 CSS stars twinkle behind the page.

## Don'ts

- Don't add a second accent hue, or use silver in the interface.
- Don't round anything, or add glow or shadows to interface elements.
- Don't add a preloader, or hold facts behind an effect.
- Don't show a number that its section's words don't state.
- Don't use captures that undercut a claim, or invent media.
