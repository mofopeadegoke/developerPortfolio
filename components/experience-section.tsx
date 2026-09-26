"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useSpring } from "motion/react";
import { SectionHeading } from "@/components/section-heading";
import { experience } from "@/lib/content";

function DateRange({ start, end }: { start: string; end: string }) {
  return (
    <p className="flex items-center gap-2 text-sm text-pencil tabular">
      <span>{start}</span>
      {/* A dimension line between the two dates. */}
      <svg aria-hidden="true" width="44" height="9" viewBox="0 0 44 9" className="text-pencil">
        <path d="M0.5 0.5 V8.5 M43.5 0.5 V8.5 M1 4.5 H43" stroke="currentColor" fill="none" />
        <path d="M1 4.5 l5 -2 v4 z M43 4.5 l-5 -2 v4 z" fill="currentColor" />
      </svg>
      <span className={end === "Present" ? "font-medium text-redline" : undefined}>{end}</span>
    </p>
  );
}

export function ExperienceSection() {
  const listRef = useRef<HTMLOListElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start 75%", "end 55%"] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });

  return (
    <section id="experience" aria-labelledby="experience-heading" className="py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading id="experience" title="Experience" />

        <ol ref={listRef} className="relative ml-1.5 max-w-3xl">
          {/* Rail, with a redline that fills as the reader scrolls. */}
          <span aria-hidden="true" className="absolute top-2 bottom-2 left-0 w-px bg-rule" />
          <motion.span
            aria-hidden="true"
            className="absolute top-2 bottom-2 left-0 w-px origin-top bg-redline"
            style={{ scaleY: reduceMotion ? 1 : progress }}
          />

          {experience.map((job, index) => (
            <li key={`${job.company}-${job.start}`} className="relative pb-14 pl-8 last:pb-0 sm:pl-12">
              <span
                aria-hidden="true"
                className={
                  "absolute top-1.5 -left-[5px] h-[11px] w-[11px] rounded-full border-2 border-redline " +
                  (index === 0 ? "bg-redline" : "bg-paper")
                }
              />
              <DateRange start={job.start} end={job.end} />
              <h3 className="mt-2 font-display text-3xl font-semibold leading-tight">{job.role}</h3>
              <p className="mt-0.5 text-lg">
                {job.company}
                <span className="text-pencil">, {job.location}</span>
              </p>
              <p className="mt-4 max-w-[60ch] text-lg text-pencil">{job.summary}</p>
              <ul className="mt-4 max-w-[68ch] space-y-2.5">
                {job.points.map((point) => (
                  <li key={point} className="relative pl-5 leading-relaxed">
                    <span aria-hidden="true" className="absolute top-[0.7em] left-0 h-px w-2.5 bg-pencil" />
                    {point}
                  </li>
                ))}
              </ul>
              <ul aria-label="Technologies" className="mt-5 flex flex-wrap gap-x-4 gap-y-1 text-sm text-pencil">
                {job.stack.map((tech) => (
                  <li key={tech}>{tech}</li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
