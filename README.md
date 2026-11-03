# Daniel Adegoke, portfolio

Personal portfolio site for Daniel Mofopefoluwa Adegoke, Software Engineer.

A single form of glowing copper particles rebuilds itself as you scroll: your name, a steam train driving down its track, a frying pan tossing a resume, three meshing gears, a toolbox. It parts around the cursor, bursts on click and streaks when you scroll fast. The wormhole fly-through only plays when a visitor presses its button. Phones get a calmer version. "List view" in the navigation shows the same content as one plain page.

## Stack

- [Next.js](https://nextjs.org) (App Router) and React 19
- Tailwind CSS v4
- [React Three Fiber](https://github.com/pmndrs/react-three-fiber) and drei for the 3D scene
- [ShaderGradient](https://github.com/ruucm/shadergradient) for the copper glow behind the form
- Particle flow adapted from [liquid-logo](https://github.com/collidingScopes/liquid-logo), see `THIRD_PARTY_NOTICES.md`

## Run it locally

```bash
pnpm install
pnpm dev
```

Then open http://localhost:3000.

Add `?tier=full`, `?tier=phone` or `?tier=still` to force a performance tier, or `?view=list` for list view.

## Where things live

| Path | What it holds |
| --- | --- |
| `lib/content.ts` | All site copy: experience, projects, skills, achievements. Edit this to update the site. |
| `lib/gallery.ts` | The shapes in scroll order, form layout and tier detection. |
| `lib/gear.ts` | Involute gear profile generator used by the gear shape. |
| `app/globals.css` | Colour tokens and the phone, still and list layouts. |
| `components/gallery/` | The particle form: its shapes, shader and scene. |
| `components/` | One component per page section, plus the shared `Room` layout. |
| `public/rooms/` | Still images for devices that don't run the form. Recapture them if the scene changes. |
| `public/daniel master resume.pdf` | The CV linked from the "Download CV" buttons. |
