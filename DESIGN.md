---
name: Daniel Adegoke
description: A solo exhibition, walked on one axis through saturated rooms of liquid-metal sculpture in glass cases.
colors:
  ultramarine: "#1b2fd0"
  vermilion: "#e8552f"
  teal: "#0f7a6c"
  label-white: "#fbfbf9"
  ink: "#14151a"
  quiet: "#4a4d57"
  rule: "#d6d7d3"
  plinth-charcoal: "#23252f"
  liquid-silver: "#f4f5f8"
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
  wordmark:
    fontFamily: "Archivo, Schibsted Grotesk, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 800
    letterSpacing: "-0.01em"
    fontVariation: "'wdth' 115"
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
  mark:
    fontFamily: "Schibsted Grotesk, system-ui, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 400
rounded:
  none: "0px"
spacing:
  gutter: "clamp(1rem, 4vw, 3.5rem)"
  label-pad: "clamp(1.5rem, 3vw, 2.5rem)"
  label-width: "31rem"
  label-width-wide: "43rem"
  list-width: "46rem"
  room-top: "7rem"
  room-bottom: "6rem"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.label-white}"
    rounded: "{rounded.none}"
    padding: "12px 20px"
  button-primary-hover:
    backgroundColor: "{colors.ultramarine}"
    textColor: "{colors.label-white}"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "12px 20px"
  button-outline-hover:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.label-white}"
  wall-label:
    backgroundColor: "{colors.label-white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "{spacing.label-pad}"
    width: "{spacing.label-width}"
  wall-label-wide:
    backgroundColor: "{colors.label-white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "{spacing.label-pad}"
    width: "{spacing.label-width-wide}"
  room-mark:
    textColor: "{colors.quiet}"
    typography: "{typography.mark}"
  nav-bar:
    backgroundColor: "{colors.label-white}"
    textColor: "{colors.ink}"
    height: "56px"
---

# Design System: Daniel Adegoke

## Overview

**Creative North Star: "The Solo Exhibition"**

The site is a building, not a page. A visitor walks one straight axis through saturated rooms, and scrolling is the walk: the camera glides between stops and holds while the visitor reads. Each stop is a piece of work, cast as a liquid-metal sculpture in a glass case on a dark plinth, with a museum label beside it.

Two layers never mix. The scene is lush, wet and fully lit, and it takes no input. The labels are plain, opaque and square, and they hold every word on the site. All colour and spectacle belong to the scene, and all reading belongs to the label, so a visitor gets the facts at once whether or not the scene ever loads.

The gallery is one presentation of a plain document. The same labels stand in front of a live scene, in front of captured stills, or alone on white in list view, and the system holds in all of them.

**Key Characteristics:**
- One axis: fixed scene behind, labels scrolling over it, alternating left and right of the case.
- Three saturated room colours, each with a fixed job.
- Opaque, square, near-white wall labels with near-black text.
- Silver liquid metal that takes a tint of the room it stands in.
- Three rendering tiers and a list view, all carrying the same words.

## Colors

Three saturated room colours are held apart from a near-white and near-black reading pair, and the rooms never reach the label except for one colour with one job.

### Primary
- **Ultramarine** (#1b2fd0): Walls of the Entrance and Skills rooms, the page background behind the stage, and the browser theme colour. On a label it is the only colour permitted, and it marks what can be acted on: link underlines, link hover, the solid button's hover fill, and the focus ring (2px, 3px offset). It also fills the text selection.

### Secondary
- **Vermilion** (#e8552f): Walls of the Experience and About rooms, the two stops about the person. Wall light only.

### Tertiary
- **Teal** (#0f7a6c): Walls of the six project rooms and the Contact room: the work, and the way out of it. Wall light only.

### Neutral
- **Label White** (#fbfbf9): Wall labels, navigation bar, footer, the hairline, and the list view page.
- **Ink** (#14151a): Reading text and the solid button fill, 17.6:1 on Label White.
- **Quiet** (#4a4d57): Secondary reading text, room marks, technology lists, and resting nav links, 8.1:1 on Label White.
- **Rule** (#d6d7d3): 1px dividers inside labels and under the navigation bar. It is the default border colour.
- **Plinth Charcoal** (#23252f): Polished plinths, metalness 0.7 and roughness 0.24.
- **Liquid Silver** (#f4f5f8): The metal's base colour before the room tints it.

### Named Rules
**The Three Rooms Rule.** Walls are ultramarine, vermilion or teal and nothing else. Every stop takes its colour from the walk in `lib/gallery.ts`, and neighbouring stops of one colour read as one long room. A fourth wall colour is a system change, not an addition.

**The Ultramarine Hand Rule.** On a label, ultramarine means one thing: this can be acted on. It is never a heading colour, a decorative accent, or static text. Remove it from a label and only the interactive elements should change.

**The Vermilion Wall Rule.** Vermilion is wall light and is never used for reading text. On Label White it reaches only 3.51:1, and it does not appear on labels at all, in any role.

**The Teal Wall Rule.** Teal stays on the walls too. It would pass as text on Label White (5.04:1), and it still does not go there: the rule is about meaning, and on a label the one accent is already spoken for.

## Typography

**Display Font:** Archivo (with Schibsted Grotesk, system-ui)
**Body Font:** Schibsted Grotesk (with system-ui)

**Character:** Archivo at extra-bold and stretched wide has the weight of cast letters and carries the name in metal and on the label. Schibsted Grotesk is an even, unshowy reading face that lets a label read like a real museum label.

### Hierarchy
- **Display** (800, clamp(2.25rem, 4vw, 3.25rem), line-height 1, -0.02em, width 115%): The name as h1 on the entrance label.
- **Headline** (800, 2.25rem, line-height 1.11, -0.02em, width 115%): Section headings as h2.
- **Title** (700, 1.875rem, line-height 1.25, -0.01em): Project names.
- **Subtitle** (700, 1.5rem, line-height 1.25): Job titles, degree, and Competitions. Skill group names step down to 1.25rem.
- **Wordmark** (800, 1.125rem, -0.01em, width 115%): The name in the navigation bar.
- **Lead** (400, 1.125rem, line-height 1.375): The line that states a result. About paragraphs use the same size at line-height 1.625.
- **Body** (400, 1rem, line-height 1.5): Label prose. Dash lists open up to 1.6.
- **Caption** (400, 0.875rem): Technology lists, dates, and availability, in Quiet. Dates use tabular figures.
- **Mark** (400, 0.8125rem): The room mark at the foot of a label.

Weights are 400, 500 and 600 for Schibsted Grotesk: 500 for button and link text, 600 for competition results. All figures are lining.

### Named Rules
**The Metal Carries Scale Rule.** The largest letters on the site are sculpture. Label type peaks at 3.25rem because the metal name holds the room, so labels never compete by growing.

**The Wide Heavy Rule.** Extra-bold at 115% width is reserved for the name and section headings. Archivo below them is 700 at normal width.

**The Sentence Case Rule.** Interface text is sentence case with no wide tracking. Capitals are for the name cast in metal.

## Layout

The layout is a fixed full-viewport stage with a single scrolling column of rooms over it. Each room is a stretch of the walk at least 118svh tall (the Entrance is exactly 100svh, with its label at the foot), padded 7rem above and 6rem below, with the fluid gutter at the sides. Scroll anchors come from the rooms themselves: the camera holds at a case while its label is read, then walks during the last 0.9 of a viewport with a smoothstep.

Labels alternate sides along the walk and the case takes the other side, so the walk zigzags while the camera stays on axis. Labels are 31rem wide, or 43rem for the text-heavy Experience, Skills and About rooms. Case position and scale are computed from the wall space the label leaves free at the current screen size. The navigation bar is fixed and 56px tall, and scroll padding clears it by 4.5rem.

Below 768px the sculpture holds the upper screen and the label follows beneath it: rooms lose their minimum height and get a 58svh top padding (46svh at the Entrance), the scene shifts up by 22% of the viewport, the name stacks smaller, and the hairline is removed. The navigation links collapse into a menu below 1024px. Skills sets in two columns from 640px.

## Elevation & Depth

Depth is real rather than simulated: the scene is a lit 3D building with a damped camera, and the interface sits flat on top of it. The interface has exactly one shadow. Rooms gain depth from doorways, which are cut only where the walk changes colour, so the next room glows through at reduced light. Pointer movement adds a slight parallax to the camera (0.55 across, 0.3 down, scene units).

### Shadow Vocabulary
- **Label lift** (`box-shadow: 0 18px 40px -22px rgb(8 10 30 / 0.55)`): Wall labels only, lifting the label off the moving scene. It is removed in list view.

### Named Rules
**The Opaque Label Rule.** Wall labels, the navigation bar and the footer are fully opaque. There is no transparency, no blur and no glass on anything that holds words, because reading never depends on what is behind it. Glass belongs to the vitrines.

**The Current Room Rule.** Only the current room animates at full light. A room the camera has left falls to half light and dims further with distance, sculptures animate only within 0.6 of a stop, and neighbouring cases are visible only on the walk between stops.

## Shapes

The interface is square. Labels, buttons, the navigation bar and the skip link have no corner radius, and structure inside labels comes from 1px rules. Curves and soft bevels belong to the sculptures. Every metal form has a small bevel (0.035 size, 0.05 thickness), so light has an edge to run along. Cases and plinths are plain boxes that keep the eye on the object.

### Named Rules
**The Square Interface Rule.** Nothing in the interface takes a radius. The token scale has one step, and it is zero.

**The One Hairline Rule.** Each label is tied to its case by exactly one 1px line in Label White, 4.25rem below the label's top edge. It leaves from the side facing the case and its length is measured so it ends on the near edge of the case at any screen width. It is removed on phones and in list view.

## Components

### Buttons
- **Shape:** Square (0px), 1px Ink border, padded 12px by 20px. The navigation version shrinks to 8px by 16px at 0.875rem.
- **Primary:** Ink fill and Label White text, weight 500.
- **Hover / Focus:** The fill and border turn ultramarine over 200ms. Focus shows the ultramarine ring.
- **Outline:** Transparent with Ink text and border, inverting to Ink on hover. The Copy email button uses this treatment at 0.875rem.

### Text Links
- **Style:** Ink text with an ultramarine underline at 0.2em offset, turning ultramarine on hover. External project links carry a 16px up-right arrow. The contact email is the largest link, in Archivo 700 with a 2px underline.
- **Quiet variant:** Icon links in Quiet rest with no underline and turn ultramarine on hover. Icons are outline strokes at 20px, with 44px touch targets where they stand alone.

### Navigation
- **Style:** A fixed Label White bar with a Rule border below, the wordmark at left, and links in Quiet at 0.95rem that darken to Ink on hover.
- **View switch:** "List view" or "Gallery view" is always visible, underlined in ultramarine, at every screen size.
- **Mobile:** A square 44px menu button opens a panel of Archivo 700 links at 1.5rem and a full-width Download CV button.

### Wall Label
The system's one container, and every word sits inside it.
- **Corner Style:** Square (0px).
- **Background:** Label White with Ink text, 100% opaque.
- **Shadow Strategy:** Label lift, as in Elevation & Depth.
- **Border:** None on the label. Rule lines divide its contents.
- **Internal Padding:** Fluid, 1.5rem to 2.5rem.
- **Lists:** Bullets are short 1px dashes in Quiet. Technologies are plain wrapped text in Quiet, not chips.

### Room Mark
The caption at the foot of a label, as in a museum: a Rule line above, 2rem of clearance, then one line in Mark type and Quiet. It gives position in the walk ("Room 3 of 6, case 2 of 6") or says how to read the sculpture ("Each slab is as long as the role."). It is gallery furniture, so list view hides it.

### Liquid Metal
One shared material for every sculpture: full metalness, roughness 0.14, base Liquid Silver. A slow flow function bends the surface normals of real geometry so reflections run like liquid while the silhouette holds still. The studio environment lights the metal and plinths only, and walls and glass stay clean. The metal tints 36% toward the current room's colour, easing as the visitor walks.

**The Real Data Rule.** A sculpture is generated from code and, where it shows a quantity, from real data. Experience slabs are as long as each role, skills columns are as tall as each group, the About sculpture is the actual CGPA, and the room mark says so.

**The Standing Rule.** Sculptures stand on thin metal rods inside their cases. Nothing floats. Motion is slow rotation or a gentle swing (0.22 to 0.45 radians per second).

Words cast in metal use Archivo from the subset at `public/fonts/gallery-display.json`, which holds only the glyphs in use, so new metal text needs a new subset.

### Vitrine
A plain glass box with a faint white edge line (28% opacity) and one soft diagonal sheen across the front pane. Name cases are wide and shallow, and work cases are tall (3.7 by 3.9 by 3 scene units). The current case on the full tier uses true transmission with slight chromatic aberration. All other cases use thin 10% white glass. Each case stands on a Plinth Charcoal block with a blurred reflection on its top in the current room on the full tier.

### Rendering Tiers
How much scene a device runs is decided at load, and every tier carries the same label layer.
- **Full:** Desktop. Moving shader wash on the walls, transmission glass and plinth reflection on the current case, pixel ratio up to 1.75.
- **Phone:** Coarse pointers and viewports below 768px. Flat room colour on the walls, thin glass, no plinth reflection, stacked name, pixel ratio up to 1.5.
- **Still:** No WebGL2, reduced motion, or a coarse pointer on a weak device (3GB memory or less, or 4 cores or fewer). The stage is removed, and each room shows a captured image over its flat room colour. The images are 22 files in `public/rooms/`: one desktop and one phone capture per stop. On desktop the image stays sticky behind the label, and on phones it is a band under the navigation bar.

**The Shed Heaviest First Rule.** Under sustained load the scene gives up effects one at a time: transmission glass and reflections first, then pixel ratio, then the wall wash, and only then falls back to Still. A visitor never waits on an effect.

### List View
One plain document on Label White, switched from the navigation bar and remembered between visits. It also opens from `?view=list`, and applies before first paint so the gallery never flashes. The stage, stills and room marks are hidden, and labels become a centred 46rem column with no fill or shadow, divided by Rule lines. Ultramarine keeps its one job.

**The Same Words Rule.** Every presentation carries the same words in the same order. A fact never lives only in the scene: the scene is `aria-hidden`, and nothing in it may be needed to understand the site.

## Do's and Don'ts

### Do:
- **Do** put every word in a wall label, and keep the label 100% opaque in Label White with Ink or Quiet text.
- **Do** give each new stop a room colour, a label side, and an id in `lib/gallery.ts`, matching a `data-stop` in the page.
- **Do** change a room colour in both `app/globals.css` and `lib/gallery.ts`, since the scene and the interface each read their own copy.
- **Do** cast a new work as a sculpture in the shared liquid metal, standing on a rod in a vitrine on a plinth.
- **Do** derive a sculpture from real data wherever it shows a quantity.
- **Do** recapture both still images in `public/rooms/` whenever a scene or a case layout changes.
- **Do** check every new surface in all three tiers and in list view.

### Don't:
- **Don't** set vermilion as reading text, in any size or weight.
- **Don't** put teal or vermilion on a label, or use ultramarine on a label for anything that cannot be acted on.
- **Don't** make a wall label translucent, blurred or glassy, or set reading text directly on the scene.
- **Don't** round a label, button or any other interface element.
- **Don't** tie a label to its case with more than the one hairline.
- **Don't** let any scene element take pointer input or hold a fact that the labels do not.
- **Don't** run a non-current room at full light or full animation.
- **Don't** add a fourth room colour or a second metal material.
