"use client";

import { motion, useReducedMotion } from "motion/react";
import { involuteGear } from "@/lib/gear";
import type { ProjectKey } from "@/lib/content";

// Small line drawings, one per project, drawn in when a project row opens.

const smallGear = involuteGear(14, 7.5);

function Stroke({ d, delay = 0, accent = false }: { d: string; delay?: number; accent?: boolean }) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.path
      d={d}
      fill="none"
      className={accent ? "stroke-redline" : "stroke-ink"}
      strokeWidth={1.25}
      strokeLinecap="round"
      strokeLinejoin="round"
      initial={reduceMotion ? false : { pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ delay: 0.15 + delay, duration: 0.9, ease: [0.65, 0, 0.35, 1] }}
    />
  );
}

const drawings: Record<ProjectKey, React.ReactNode> = {
  // A hardware module feeding a control panel that lays itself out.
  omniplexus: (
    <>
      <Stroke d="M14 44 h34 v32 h-34 z M20 76 v6 M42 76 v6 M22 52 h18 M22 60 h12" />
      <Stroke d="M48 60 H70" accent delay={0.3} />
      <Stroke d="M66 56 l4 4 -4 4" accent delay={0.4} />
      <Stroke d="M76 22 h72 v76 h-72 z" delay={0.2} />
      <Stroke d="M86 36 h52 M86 52 h52 M86 68 h30" delay={0.45} />
      <Stroke d="M126 64 a4 4 0 1 0 0.01 0 M100 32 v8 M114 48 v8" accent delay={0.6} />
      <Stroke d="M86 82 h14 v8 h-14 z M108 82 h14 v8 h-14 z" delay={0.7} />
    </>
  ),
  // A browser page with a highlighted passage and a tag.
  inscribe: (
    <>
      <Stroke d="M16 18 h128 v84 h-128 z M16 30 h128" />
      <Stroke d="M22 24 h2 M28 24 h2 M34 24 h2" delay={0.2} />
      <Stroke d="M28 44 h92 M28 54 h100 M28 74 h84 M28 84 h60" delay={0.3} />
      <Stroke d="M26 60 h86 v8 h-86 z" accent delay={0.55} />
      <Stroke d="M118 62 l10 -10 h14 v12 h-14 z M131 58 h0.01" accent delay={0.8} />
    </>
  ),
  gear: (
    <>
      <Stroke d="M20 60 H140 M80 10 V110" delay={0} />
      <g transform="translate(80 60)">
        <Stroke d={smallGear.outline} delay={0.15} />
        <Stroke d="M 0 -9 A 9 9 0 1 0 0.01 -9" accent delay={0.6} />
      </g>
    </>
  ),
  // Rings receding into a tunnel.
  wormhole: (
    <>
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const rx = 64 - i * 11;
        const ry = 44 - i * 8;
        const cx = 80 + i * 2.5;
        return (
          <Stroke
            key={i}
            d={`M ${cx - rx} 60 a ${rx} ${ry} 0 1 0 ${rx * 2} 0 a ${rx} ${ry} 0 1 0 ${-rx * 2} 0`}
            accent={i === 5}
            delay={i * 0.1}
          />
        );
      })}
      <Stroke d="M16 60 H40 M144 60 H120" delay={0.6} />
    </>
  ),
};

export function ProjectDrawing({ project }: { project: ProjectKey }) {
  return (
    <svg viewBox="0 0 160 120" aria-hidden="true" className="h-auto w-full">
      {drawings[project]}
    </svg>
  );
}
