"use client";

import { motion, useReducedMotion } from "motion/react";
import { Github, Linkedin } from "lucide-react";
import { GearDrawing } from "@/components/gear-drawing";
import { LinkButton } from "@/components/link-button";
import { hero, profile } from "@/lib/content";

export function HeroSection() {
  const reduceMotion = useReducedMotion();

  // The gear draws first; the words follow once its outline is under way.
  const rise = (delay: number) =>
    reduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 14 },
          animate: { opacity: 1, y: 0 },
          transition: { delay, duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
        };

  return (
    <section id="top" aria-label="Introduction" className="construction-grid relative overflow-hidden border-b border-rule">
      {/* Fade the grid out towards the edges so it reads as a sheet, not wallpaper. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_70%_45%,transparent_20%,var(--paper)_75%)]"
      />

      <div className="relative mx-auto grid min-h-svh max-w-6xl content-center gap-x-8 gap-y-8 px-4 pt-24 pb-16 sm:px-6 [grid-template-areas:'intro''gear''rest'] md:grid-cols-[1.05fr_1fr] md:gap-y-0 md:pt-28 md:[grid-template-areas:'intro_gear''rest_gear']">
        <div className="[grid-area:intro] md:self-end">
          <motion.h1
            {...rise(0.6)}
            className="font-display text-[clamp(3.5rem,9vw,7rem)] font-semibold leading-[0.88] tracking-[-0.02em]"
          >
            {profile.name}
          </motion.h1>
          <motion.p {...rise(0.75)} className="mt-4 font-display text-2xl font-medium text-pencil sm:text-3xl">
            {profile.role}
          </motion.p>
        </div>

        <div className="[grid-area:rest] md:mt-8 md:self-start">
          <motion.p {...rise(0.95)} className="max-w-[34ch] text-xl leading-snug sm:text-2xl">
            {hero.lead}
          </motion.p>
          <motion.p {...rise(1.05)} className="mt-4 max-w-[52ch] text-pencil">
            {hero.detail}
          </motion.p>

          <motion.div {...rise(1.2)} className="mt-9 flex flex-wrap items-center gap-3">
            <LinkButton href={profile.resume} download={profile.resumeFileName}>
              Download CV
            </LinkButton>
            <LinkButton href={`mailto:${profile.email}`} variant="outline">
              Email me
            </LinkButton>
            <div className="ml-1 flex items-center gap-1">
              <a
                href={profile.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="grid h-10 w-10 place-items-center text-pencil transition-colors hover:text-redline"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="grid h-10 w-10 place-items-center text-pencil transition-colors hover:text-redline"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </motion.div>

          <motion.p {...rise(1.35)} className="mt-8 flex items-center gap-2.5 text-sm text-pencil">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-redline opacity-60 motion-safe:animate-ping" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-redline" />
            </span>
            {profile.location}. {profile.availability}.
          </motion.p>
        </div>

        <div className="mx-auto w-full max-w-[24rem] self-center [grid-area:gear] md:max-w-none">
          <GearDrawing />
        </div>
      </div>
    </section>
  );
}
