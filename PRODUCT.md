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

- The involute gear is not carried into the experimental redesign, by the user's decision.
- The visual materials under evaluation come from react-three-fiber, liquid-glass-js, shadergradient and liquid-logo.

## Evidence on Hand

Project links, install counts, competition results and test figures in `lib/content.ts`. There are no testimonials, client logos or project screenshots in the repo, and none may be invented.

## Product Principles

- A hiring visitor reaches the facts without waiting on an effect.
- Show proof, not adjectives.
- Never overstate a claim: the honesty of Uncooked applies to the portfolio too.

## Accessibility & Inclusion

Content must stay readable without WebGL. Effects fall back when WebGL is unavailable or reduced motion is requested, and run on phones only where they stay smooth.
