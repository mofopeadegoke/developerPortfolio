# Daniel Adegoke, portfolio

Personal portfolio site for Daniel Mofopefoluwa Adegoke, Software Engineer.

The design is a drafting sheet: vellum paper, graphite ink, construction-blue grid lines and a single redline accent. The hero is a live involute spur gear generated in the browser with the same maths as my [C++ gear library](https://github.com/mofopeadegoke/gearGeneration); drag the slider to change its tooth count.

## Stack

- [Next.js](https://nextjs.org) (App Router) and React 19
- Tailwind CSS v4
- [Motion](https://motion.dev) for animation (reduced-motion settings are respected)
- `next-themes` for the light (vellum) and dark (slate) sheets

## Run it locally

```bash
pnpm install
pnpm dev
```

Then open http://localhost:3000.

## Where things live

| Path | What it holds |
| --- | --- |
| `lib/content.ts` | All site copy: experience, projects, skills, achievements. Edit this to update the site. |
| `lib/gear.ts` | Involute gear profile generator used by the hero, project drawing and icons. |
| `app/globals.css` | Colour tokens for both themes, the construction grid and the slider styles. |
| `components/` | One component per page section. |
| `public/daniel master resume.pdf` | The CV linked from the "Download CV" buttons. |
