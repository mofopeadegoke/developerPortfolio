---
name: Daniel Adegoke
description: One form of molten copper particles rebuilds itself into each piece of the work as the visitor scrolls.
colors:
  copper: "#e8894f"
  amber: "#f6bc7a"
  ember-deep: "#80210a"
  ember-bright: "#ff8533"
  ember-hot: "#ffdb9e"
  ground: "#0b0807"
  char: "#1a0c07"
  smoulder: "#4a1a0a"
  rule: "#33261e"
  quiet: "#bcaea2"
  text: "#f4ece4"
typography:
  display:
    fontFamily: "Archivo, Schibsted Grotesk, system-ui, sans-serif"
    fontSize: "clamp(2.25rem, 4vw, 3.25rem)"
    fontWeight: 800
    lineHeight: 1
    letterSpacing: "-0.02em"
    fontVariation: "'wdth' 115"
  headline:
    fontFamily: "Archivo, Schibsted Grotesk, system-ui, sans-serif"
    fontSize: "2.25rem"
    fontWeight: 800
    lineHeight: 1.11
    letterSpacing: "-0.02em"
    fontVariation: "'wdth' 115"
  title:
    fontFamily: "Archivo, Schibsted Grotesk, system-ui, sans-serif"
    fontSize: "1.875rem"
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: "-0.01em"
  subtitle:
    fontFamily: "Archivo, Schibsted Grotesk, system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 700
    lineHeight: 1.25
  group:
    fontFamily: "Archivo, Schibsted Grotesk, system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 700
    lineHeight: 1.4
  contact-email:
    fontFamily: "Archivo, Schibsted Grotesk, system-ui, sans-serif"
    fontSize: "clamp(1.25rem, 2.4vw, 1.625rem)"
    fontWeight: 700
  wordmark:
    fontFamily: "Archivo, Schibsted Grotesk, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 800
    letterSpacing: "-0.01em"
    fontVariation: "'wdth' 115"
  role:
    fontFamily: "Schibsted Grotesk, system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 400
    lineHeight: 1.4
  lead:
    fontFamily: "Schibsted Grotesk, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.375
  body:
    fontFamily: "Schibsted Grotesk, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
  caption:
    fontFamily: "Schibsted Grotesk, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.43
rounded:
  none: "0px"
spacing:
  gutter: "clamp(1rem, 4vw, 3.5rem)"
  text-width: "31rem"
  text-width-wide: "43rem"
  list-width: "46rem"
  stop-top: "7rem"
  stop-bottom: "6rem"
components:
  button-primary:
    backgroundColor: "{colors.copper}"
    textColor: "{colors.ground}"
    rounded: "{rounded.none}"
    padding: "12px 20px"
  button-primary-hover:
    backgroundColor: "{colors.amber}"
    textColor: "{colors.ground}"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.text}"
    rounded: "{rounded.none}"
    padding: "12px 20px"
  button-outline-hover:
    backgroundColor: "{colors.copper}"
    textColor: "{colors.ground}"
  button-copy:
    backgroundColor: "transparent"
    textColor: "{colors.text}"
    typography: "{typography.caption}"
    rounded: "{rounded.none}"
    padding: "10px 16px"
  text-column:
    backgroundColor: "transparent"
    textColor: "{colors.text}"
    width: "{spacing.text-width}"
  text-column-wide:
    backgroundColor: "transparent"
    textColor: "{colors.text}"
    width: "{spacing.text-width-wide}"
  nav-bar:
    backgroundColor: "{colors.ground}"
    textColor: "{colors.text}"
    height: "56px"
---

# Design System: Daniel Adegoke

## Overview

**Creative North Star: "Molten Copper"**

The site is one body of matter. Tens of thousands of points of copper light hold a shape, pour out of it as the visitor scrolls, and settle into the next one: the name, the career, each project, the skills, the degree, and finally an @. There is only ever one form on screen, and it is always the same particles. Nothing is swapped, faded or replaced.

The form is the main event and the words are its plain counterpart. Text sits directly on the warm near-black ground, with no panel, card or tint behind it, and the form takes the space the text leaves free. Every word is server-rendered HTML, so a visitor reaches the facts without waiting on the form.

The form is also one presentation of a plain document. The same words stand beside live particles, beside captured stills, or alone in a list view, and the system holds in all of them.

**Key Characteristics:**
- One form, one set of particles, rebuilt rather than replaced at each stop.
- One colour family of copper, amber and ember glow on a warm near-black.
- Text directly on the dark ground, with no panels or cards.
- A form that answers the visitor: it parts round the cursor, bursts on a click, and streaks on a fast scroll.
- Three rendering tiers and a list view, all carrying the same words.

## Colors

A single warm hue runs from near-black through ember and copper to a pale hot amber, and every colour on the site belongs to it.

### Primary
- **Copper** (#e8894f): The colour of action. It fills the solid button, borders the outline buttons, and underlines text links. It also draws the dashes in lists, the scrollbar thumb, and the text selection. It reaches 7.72:1 on Ground in either direction, so Ground text on a copper fill is safe.

### Secondary
- **Amber** (#f6bc7a): The colour of response. Hover states on buttons, links and icons, and the 2px focus ring at 3px offset. 11.78:1 on Ground.

### Tertiary
- **Ember Deep** (#80210a): The shadowed side of the form, where a point faces away from the light.
- **Ember Bright** (#ff8533): The lit body of the form.
- **Ember Hot** (#ffdb9e): The brightest points of the form, and the colour points move toward as they heat up in transit or near the cursor.

These three live only in the particle shader. They never appear in the interface.

### Neutral
- **Ground** (#0b0807): The page, the canvas background, the navigation bar, the footer, the browser theme colour, and text on copper or amber fills.
- **Char** (#1a0c07) and **Smoulder** (#4a1a0a): The two warm darks in the slow backdrop glow on the Full tier, mixed with Ground and dimmed heavily, so the ground seems to hold heat without becoming a colour.
- **Rule** (#33261e): 1px dividers and the default border colour. It is structure at 1.37:1, not a reading colour.
- **Quiet** (#bcaea2): Secondary reading text, dates, technology lists, resting nav links and icons. 9.23:1 on Ground.
- **Text** (#f4ece4): Primary reading text, a warm off-white. 17.08:1 on Ground.

### Named Rules
**The One Family Rule.** Every colour sits in the copper family on near-black. A second hue is a system change, not an accent. The neutrals are warm for the same reason: there is no pure white, pure black or cool grey anywhere.

**The Amber Answer Rule.** Amber in the interface only ever answers the visitor: hover and focus, never a resting state. If nothing is being pointed at or focused, no amber shows outside the form.

## Typography

**Display Font:** Archivo (with Schibsted Grotesk, system-ui)
**Body Font:** Schibsted Grotesk (with system-ui)

**Character:** Archivo at extra-bold and stretched wide has mass, and it is the letterform the particles settle into. Schibsted Grotesk is an even, unshowy reading face that stays clear in light text on dark.

### Hierarchy
- **Display** (800, clamp(2.25rem, 4vw, 3.25rem), line-height 1, -0.02em, width 115%): The name as h1. It is visible in list view and until the stage is ready. Elsewhere it stays in the document for assistive technology while the form or the still shows the name.
- **Headline** (800, 2.25rem, line-height 1.11, -0.02em, width 115%): Section headings as h2.
- **Title** (700, 1.875rem, line-height 1.25, -0.01em): Project names.
- **Subtitle** (700, 1.5rem, line-height 1.25): Job titles, the degree, and Competitions.
- **Group** (700, 1.25rem, line-height 1.4): Skill group names.
- **Contact Email** (700, clamp(1.25rem, 2.4vw, 1.625rem)): The email address, the largest link on the site, breaking anywhere so it never overflows.
- **Wordmark** (800, 1.125rem, -0.01em, width 115%): The name in the navigation bar.
- **Role** (400, 1.25rem, line-height 1.4): The role line in the first viewport, in Quiet.
- **Lead** (400, 1.125rem, line-height 1.375): The line that states a result. About paragraphs use the same size at line-height 1.625.
- **Body** (400, 1rem, line-height 1.5): Prose. Dash lists open up to 1.6.
- **Caption** (400, 0.875rem, line-height 1.43): Technology lists, dates, availability and the footer, in Quiet. Dates use tabular figures.

Schibsted Grotesk runs at 400, 500 and 600: 500 for button and link text, 600 for competition results. All figures are lining.

### Named Rules
**The Form Carries Scale Rule.** The largest letters on the site are made of particles. HTML type peaks at the Display size, so the words never compete with the form by growing.

**The Wide Heavy Rule.** Extra-bold at 115% width is reserved for the name and section headings. Archivo below them is 700 at normal width.

**The Sentence Case Rule.** Interface text is sentence case with no wide tracking. Capitals belong to the name in the form.

## Layout

A fixed full-viewport stage sits behind a single scrolling column of stops. Each stop is at least 118svh tall, padded 7rem above and 6rem below, with the fluid gutter at the sides. The first stop is exactly 100svh with its words at the foot, 2.5rem from the bottom edge, and the name in particles across the full width in the upper part of the screen.

The text column sits on one side and the form takes the other, with the side set per stop in `lib/gallery.ts`. Columns are 31rem wide, or 43rem for the text-heavy Experience, Skills and About stops. The form's position and scale are computed from the width the text leaves free at the current screen size. The navigation bar is fixed and 56px tall, and scroll padding clears it by 4.5rem.

Below 768px the form holds the upper screen and the words follow beneath it: stops lose their minimum height and take 56svh of top padding (46svh on the first stop, which stays 100svh tall), the name stacks on two lines, and the form scales to the viewport width. The navigation links collapse into a menu below 1024px. Skills sets in two columns from 640px.

## Elevation & Depth

The interface is flat and has no shadows at all. Depth belongs to the form, which is genuinely three-dimensional: points are sampled from real surfaces, shaded by how far each faces one fixed light, and turned by a slow sway and by the pointer. Bright points add to one another, so density reads as heat. On the Full tier a slow backdrop of warm darks moves behind the form, and it stays dim enough to read as the ground.

### Named Rules
**The Glow Is Matter Rule.** Glow comes from the particles themselves, through additive light and a soft halo. It never comes from a CSS shadow, a blur or a gradient on an interface element.

**The Bare Ground Rule.** Nothing that holds reading text has a panel, card or tint. The navigation bar, the footer and the skip link are filled with Ground itself, so they read as more ground, and they are opaque so the form never passes behind their words.

## Shapes

The interface is square. Buttons, the navigation bar and every other element have no corner radius, and structure comes from 1px Rule lines. All curves belong to the form, whose points are soft round lights and whose shapes can be anything the work calls for.

### Named Rules
**The Square Interface Rule.** Nothing in the interface takes a radius. The token scale has one step, and it is zero.

## Components

### Buttons
- **Shape:** Square (0px), 1px Copper border, padded 12px by 20px, weight 500. The navigation version shrinks to 8px by 16px at 0.875rem.
- **Primary:** Copper fill and Ground text.
- **Hover / Focus:** The fill and border turn Amber over 200ms. Focus shows the Amber ring.
- **Outline:** Transparent with Text and a Copper border, filling Copper with Ground text on hover.
- **Copy email:** The outline treatment at 0.875rem, padded 10px by 16px, with a 16px icon that changes to a check for two seconds.

### Text Links
- **Style:** Text with a Copper underline at 0.2em offset, turning Amber on hover. External links carry a 16px up-right arrow. The contact email takes a 2px underline.
- **Quiet variant:** Icon links in Quiet rest with no underline and turn Amber on hover. Icons are outline strokes at 20px, with 44px-tall targets where they stand alone.

### Navigation
- **Style:** A fixed Ground bar with a Rule border below, the wordmark at left, and links in Quiet at 0.95rem that brighten to Text on hover.
- **View switch:** Always visible at every screen size, underlined in Copper, and named for the view it leads to.
- **Mobile:** A square 44px menu button opens a panel of Archivo 700 links at 1.5rem and a full-width Download CV button.

### Text Column
The words at each stop, set straight on the ground.
- **Background:** None.
- **Border:** None on the column. Rule lines divide skill rows, competition rows, and the Projects introduction from the first project.
- **Dash lists:** Short 1px dashes in Copper.
- **Technologies:** Plain wrapped text in Quiet at Caption size, not chips.

### The Form
The signature component: one point cloud, drawn with `react-three-fiber`, that takes a shape for each of the 11 stops. The shapes are generated in code and sampled in advance into one float texture, and the flow that carries the points is adapted from `liquid-logo`.

- **Points:** 90,000 on Full and 28,900 on Phone, each a soft round light 0.6 to 1.4 times the base size. The first sixth are drawn again at seven times the size and very low alpha (0.07, or 0.035 on Phone), which stands in for a bloom pass at a fraction of the cost.
- **Shapes:** The name, stepped slabs for Experience, a page with a line cut out of it for Uncooked, a curling bookmark, a raised grid of modules for Omniplexus, a pen nib for Inscribe, a gear for the Gear Library, nested rings for Wormhole, a ring of columns for Skills, the figure 3.81 for About, and an @ for Contact.
- **At rest:** The surface creeps very slightly like molten metal, and the whole form sways slowly: barely on the name (0.06 radians), more on the later shapes (0.3 radians).
- **Hold and rebuild:** The form holds its shape while the visitor reads, then rebuilds over the last 0.9 of a viewport before the next stop, on a smoothstep with damping at rate 5.
- **Pour:** Points leave at different moments according to a per-point seed. In transit the form draws in by up to half, swirls round its vertical axis, and heats toward Ember Hot, so a shape pours into the next instead of fading or scattering.
- **Cursor:** The form parts around a mouse pointer like a finger through liquid, and the points it touches heat up. Any pointer tilts the form slightly (up to 0.25 radians across, 0.15 down).
- **Burst:** A click or tap on empty space throws the form apart from that spot, and it settles back on its own. Clicks on links, buttons, headings, paragraphs, list items and table cells are ignored, so selecting text never sets it off.
- **Streak:** Fast scrolling stretches the points vertically into streaks, in proportion to scroll speed.
- **Backdrop:** A slow `shadergradient` plane of Ground, Smoulder and Char, rendered off-screen at 384px on every third frame and dimmed. It runs on the Full tier only.

**The Same Matter Rule.** There is one form and one set of points. A new piece of the site is a new shape for those points, never a second object, model or scene.

**The Real Shape Rule.** Every shape is generated from code and, where it shows a quantity, from real data. Experience slabs are as long as each role, Skills columns are as tall as each group, the gear is the same involute profile as the Gear Library, and 3.81 is the actual CGPA.

**The Readable Words Rule.** The form never competes with reading. On desktop it dims to 20% at the midpoint of a rebuild, the only time it reaches the words. On phones the words scroll across it, so it steps back to 16% from just after a stop begins until just before the next.

The name, 3.81 and the @ use Archivo from the subset at `public/fonts/gallery-display.json`, which holds only the glyphs in use, so new letters in the form need a new subset.

### Rendering Tiers
How much of the form a device runs is decided at load, and every tier carries the same words.
- **Full:** Desktop. 90,000 points, the backdrop, pixel ratio up to 1.5.
- **Phone:** Coarse pointers and viewports below 768px. 28,900 points, no backdrop, the stacked name, and the form in the upper screen.
- **Still:** No WebGL2, reduced motion, or a coarse pointer on a weak device (3GB memory or less, or 4 cores or fewer). The stage is removed, and each stop shows a captured image of its shape on the dark ground. There are 22 files in `public/rooms/`: one desktop and one phone capture per stop. On desktop the image stays sticky behind the words, and on phones it is a band under the navigation bar.

**The Shed Heaviest First Rule.** When frame rate declines, the form gives things up one at a time: pixel ratio drops to 1, then the backdrop goes, and only then does the site fall back to Still. A visitor never waits on an effect.

### List View
One plain document on Ground, switched from the navigation bar and remembered between visits. It also opens from `?view=list`, and applies before first paint so the form never flashes. The stage and stills are hidden, the name appears as Display type, and the words become a centred 46rem column with a Rule line under each stop.

**The Same Words Rule.** Every presentation carries the same words in the same order. A fact never lives only in the form: the stage is `aria-hidden`, and nothing in it may be needed to understand the site.

## Do's and Don'ts

### Do:
- **Do** set reading text directly on Ground, in Text or Quiet.
- **Do** build each new stop as a shape for the existing points, with an entry in `lib/gallery.ts`, a builder in `components/gallery/form-shapes.ts`, and a matching `data-stop` in the page.
- **Do** derive a shape from real data wherever it shows a quantity.
- **Do** change Ground in `app/globals.css`, `app/layout.tsx`, the canvas, the backdrop and the icon and social images together, since each reads its own copy.
- **Do** recapture both still images in `public/rooms/` whenever a shape or its layout changes.
- **Do** keep the form dimmed wherever it can pass behind words.
- **Do** check every new surface in all three tiers and in list view.

### Don't:
- **Don't** add a second hue, or a cool or pure neutral.
- **Don't** put reading text on a panel, card, tint or blur.
- **Don't** use Amber in the interface for a resting state, or the ember colours in the interface at all.
- **Don't** round a button or any other interface element.
- **Don't** add a CSS shadow or glow to an interface element.
- **Don't** add a second 3D object beside the form, or let a shape fade or cut instead of pouring.
- **Don't** let the burst fire from text or controls, or let the form hold a fact that the words do not.
- **Don't** invent a shape's proportions when real data exists for it.
