# Daniel Adegoke, portfolio

Personal portfolio site for Daniel Mofopefoluwa Adegoke, Software Engineer.

The site is a solo exhibition. Scrolling walks a 3D gallery of colour-lit rooms, where each piece of work is a liquid-metal sculpture in a glass case with a plain, readable wall label beside it. "List view" in the navigation shows the same content as one plain page.

## Stack

- [Next.js](https://nextjs.org) (App Router) and React 19
- Tailwind CSS v4
- [React Three Fiber](https://github.com/pmndrs/react-three-fiber) and drei for the gallery
- [ShaderGradient](https://github.com/ruucm/shadergradient) for the light on the walls
- Liquid-metal shader adapted from [liquid-logo](https://github.com/collidingScopes/liquid-logo), see `THIRD_PARTY_NOTICES.md`

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
| `lib/gallery.ts` | The rooms in walking order, case layout and tier detection. |
| `lib/gear.ts` | Involute gear profile generator used by the Gear Library sculpture. |
| `app/globals.css` | Colour tokens, wall labels, and the phone, still and list layouts. |
| `components/gallery/` | The 3D scene, sculptures and liquid-metal material. |
| `components/` | One component per room, plus the shared `Room` wall label. |
| `public/rooms/` | Still images for devices that don't run the 3D scene. Recapture them if the scene changes. |
| `public/daniel master resume.pdf` | The CV linked from the "Download CV" buttons. |
