# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Hiring teams: recruiters and engineers with a few minutes to judge Daniel Adegoke as a software engineer candidate.

## Product Purpose

A personal portfolio that earns trust in Daniel's work and leads visitors to download the CV or send an email.

## Positioning

A software engineering graduate (High Honors, 2026) who owned frontend architecture for production apps, gets pull requests merged into open-source AI tooling, and works below the UI in C++. Every claim is backed by shipped work.

## Capabilities and Constraints

- All site copy lives in `lib/content.ts`. Facts follow `public/daniel master resume.pdf`; the site may carry true detail the one-page resume cuts for space. Where they conflict, the resume wins, except the year Daniel started coding: **2020** (the Nov 2026 PDF says 2021 and is due to be corrected).
- Sections, in order: hero, Work, Open source, Experience, Skills, About, Competitions, Contact. CV download and email are the primary actions.
- Next.js 16 and React 19, deployed on Vercel.

## Brand Commitments

- Editorial engineer with a technical instrument's micro-labels. Warm monochrome on near-black with copper as the single accent.
- The copper particle form appears only in the hero, where it spells the name, then pours out into a sparse silver star field that stays behind the page. It never draws pictures of the work.
- Each section states one number its words prove, set as giant type that counts up: Top 10 (open source), 2020, Top 5%, 3.81, 0.5%.
- Phones and tablets get no WebGL: the name is set as giant type instead.
- Square interface. No pills, rounded cards, glow or drop shadows.

## Evidence on Hand

Project links, install counts, competition results, merged pull request links and test figures in `lib/content.ts`. Real captures of live projects live in `public/work/` (Smart Bookmarks, Wormhole). There are no testimonials or client logos, and none may be invented. Do not use the Inscribe Edge Add-ons page as a capture: it shows one store's user count, not the 4,000+ installs total. The Uncooked site (uncooked-plugin.vercel.app) was down (404) in Nov 2026; add its link and a capture back once it is redeployed.

## Product Principles

- A hiring visitor reaches the facts without waiting on an effect. No preloader.
- Show proof, not adjectives.
- Never overstate a claim: the honesty of Uncooked applies to the portfolio too.

## Accessibility & Inclusion

Every word is server-rendered and readable without JavaScript or WebGL. Motion only hides content once the script runs (`html.js`). The form runs only at 1024px and wider with a fine pointer, WebGL2 and no reduced-motion request. Reduced motion turns off the entrance, reveals, count-ups, smooth wheel, magnetic hover and stacking scale.
