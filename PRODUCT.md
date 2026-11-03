# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Hiring teams: recruiters and engineers with a few minutes to judge Daniel Adegoke as a software engineer candidate.

## Product Purpose

A personal portfolio that earns trust in Daniel's work and leads visitors to download the CV or send an email.

## Positioning

A recent software engineering graduate who owned frontend architecture for production apps and also works below the UI, in C++ and AI tooling. Every claim is backed by shipped work.

## Capabilities and Constraints

- All site copy lives in `lib/content.ts` and must stay consistent with `public/daniel master resume.pdf`.
- Sections: hero, experience, projects, skills, about, contact. CV download and email are the primary actions.
- Next.js 16 and React 19, deployed on Vercel.
- This redesign is an experiment on the `experiment/liquid-redesign` branch.

## Brand Commitments

- The involute gear is no longer the site's identity. A gear appears only as the Gear Library project's own exhibit.
- The theme is one colour family, Molten Copper, on near-black. Several bright, contrasting colours were rejected by the user.
- 3D must be the main event on desktop and respond to the visitor, not decoration beside the content. It shows only the name and numbers the page proves (2020, 4,000+, top 5%, 3.81, 0.1%), never pictures of the work.
- Phones and tablets get no 3D at all: a clean, fast page with the same numbers set as type.
- The visual materials come from react-three-fiber, shadergradient and liquid-logo. liquid-glass-js is not used in this direction.

## Evidence on Hand

Project links, install counts, competition results and test figures in `lib/content.ts`. There are no testimonials, client logos or project screenshots in the repo, and none may be invented.

## Product Principles

- A hiring visitor reaches the facts without waiting on an effect.
- Show proof, not adjectives.
- Never overstate a claim: the honesty of Uncooked applies to the portfolio too.

## Accessibility & Inclusion

Content must stay readable without WebGL. The form runs only at 1024px and wider with a mouse or trackpad, and never when WebGL2 is missing or reduced motion is requested.
