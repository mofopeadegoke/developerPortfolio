"use client";

import { useId, useMemo, useRef, useState } from "react";
import { motion, useAnimationFrame, useInView, useReducedMotion } from "motion/react";
import { involuteGear } from "@/lib/gear";

// Drawing units: the tip circle has radius 100 and represents an 80 mm gear.
const TIP_RADIUS = 100;
const TIP_DIAMETER_MM = 80;
const MM_PER_UNIT = TIP_DIAMETER_MM / (2 * TIP_RADIUS);
const PRESSURE_ANGLE = 20;
const MIN_TEETH = 12;
const MAX_TEETH = 40;

const draw = (delay: number, duration = 1.2) => ({
  hidden: { pathLength: 0, opacity: 0 },
  shown: {
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { delay, duration, ease: [0.65, 0, 0.35, 1] as const },
      opacity: { delay, duration: 0.01 },
    },
  },
});

const fadeIn = (delay: number) => ({
  hidden: { opacity: 0 },
  shown: { opacity: 1, transition: { delay, duration: 0.5 } },
});

const polar = (r: number, deg: number) => {
  const a = (deg * Math.PI) / 180;
  return { x: r * Math.cos(a), y: r * Math.sin(a) };
};

export function GearDrawing() {
  const [teeth, setTeeth] = useState(24);
  const reduceMotion = useReducedMotion();
  const svgRef = useRef<SVGSVGElement>(null);
  const rotorRef = useRef<SVGGElement>(null);
  const angle = useRef(0);
  const inView = useInView(svgRef);
  const sliderId = useId();

  // Tip diameter stays fixed, so the module shrinks as teeth are added.
  const module = (2 * TIP_RADIUS) / (teeth + 2);
  const gear = useMemo(() => involuteGear(teeth, module, PRESSURE_ANGLE), [teeth, module]);
  const moduleMm = module * MM_PER_UNIT;
  const pitchDiameterMm = moduleMm * teeth;

  // Idle rotation. Angular speed is inversely proportional to tooth count, as
  // if the gear were meshed with a fixed-speed driver.
  useAnimationFrame((_, delta) => {
    if (reduceMotion || !inView || !rotorRef.current) return;
    angle.current = (angle.current + (delta / 1000) * (96 / teeth)) % 360;
    rotorRef.current.setAttribute("transform", `rotate(${angle.current.toFixed(3)})`);
  });

  const initial = reduceMotion ? false : "hidden";
  const teethLeader = polar(TIP_RADIUS, -38);
  const pitchLeader = polar(gear.pitchRadius, 228);
  const baseLeader = polar(gear.baseRadius, 196);

  return (
    <figure className="relative">
      <svg
        ref={svgRef}
        viewBox="-160 -128 320 272"
        className="w-full h-auto overflow-visible tabular"
        role="img"
        aria-label={`Technical drawing of an involute spur gear with ${teeth} teeth, module ${moduleMm.toFixed(2)} millimetres and a ${PRESSURE_ANGLE} degree pressure angle.`}
      >
        <motion.g initial={initial} animate="shown" className="fill-none" strokeLinecap="round">
          {/* Centre lines */}
          <motion.path
            d="M -122 0 H 122 M 0 -118 V 118"
            className="stroke-construct"
            strokeWidth={0.75}
            strokeDasharray="14 3 2 3"
            variants={fadeIn(0)}
          />

          {/* Construction circles: pitch, base, root */}
          <motion.circle
            r={gear.pitchRadius}
            className="stroke-construct"
            strokeWidth={0.9}
            strokeDasharray="6 3"
            variants={draw(0.1, 0.9)}
          />
          <motion.circle
            r={gear.baseRadius}
            className="stroke-construct"
            strokeWidth={0.6}
            strokeDasharray="1.5 2.5"
            variants={draw(0.25, 0.9)}
          />

          {/* The gear itself */}
          <g ref={rotorRef}>
            <motion.path
              d={gear.outline}
              className="stroke-ink"
              strokeWidth={1.35}
              strokeLinejoin="round"
              variants={draw(0.45, 1.4)}
            />
            <motion.path
              d={gear.tooth}
              className="fill-redline/15 stroke-redline"
              strokeWidth={1.35}
              strokeLinejoin="round"
              variants={fadeIn(1.6)}
            />
            <motion.path
              d="M -5 -15.2 A 16 16 0 1 0 5 -15.2 V -20 H -5 Z"
              className="stroke-ink"
              strokeWidth={1.1}
              variants={draw(1.1, 0.7)}
            />
          </g>

          {/* Callouts */}
          <motion.g variants={fadeIn(1.8)} className="stroke-pencil" strokeWidth={0.6}>
            {/* Tooth count */}
            <path d={`M ${teethLeader.x} ${teethLeader.y} L 116 -104 H 156`} />
            <circle cx={teethLeader.x} cy={teethLeader.y} r={1.6} className="fill-pencil" />
            {/* Pitch diameter */}
            <path d={`M ${pitchLeader.x} ${pitchLeader.y} L -116 -100 H -156`} />
            <circle cx={pitchLeader.x} cy={pitchLeader.y} r={1.6} className="fill-pencil" />
            {/* Pressure angle */}
            <path d={`M ${baseLeader.x} ${baseLeader.y} L -122 -34 H -156`} />
            <circle cx={baseLeader.x} cy={baseLeader.y} r={1.6} className="fill-pencil" />
            {/* Tip diameter dimension */}
            <path d="M -100 6 V 132 M 100 6 V 132" strokeDasharray="2 2" />
            <path d="M -100 126 H 100" className="stroke-ink" />
            <path d="M -100 126 l 7 -2.5 v 5 z M 100 126 l -7 -2.5 v 5 z" className="fill-ink stroke-none" />
          </motion.g>

          <motion.g
            variants={fadeIn(1.8)}
            className="fill-ink stroke-none font-sans"
            fontSize={10.5}
          >
            <text x={156} y={-108} textAnchor="end">
              z = <tspan className="fill-redline font-semibold">{teeth}</tspan> teeth
            </text>
            <text x={-156} y={-104}>
              d = {pitchDiameterMm.toFixed(1)}
            </text>
            <text x={-156} y={-38}>
              α = {PRESSURE_ANGLE}°
            </text>
            <text x={0} y={121} textAnchor="middle">
              ⌀ {TIP_DIAMETER_MM}
            </text>
            <text x={156} y={-92} textAnchor="end" className="fill-pencil" fontSize={9}>
              m = {moduleMm.toFixed(2)}
            </text>
          </motion.g>
        </motion.g>
      </svg>

      <motion.figcaption
        className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1"
        initial={reduceMotion ? false : { opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, duration: 0.5 }}
      >
        <label htmlFor={sliderId} className="shrink-0 text-sm text-pencil">
          Teeth
        </label>
        <input
          id={sliderId}
          type="range"
          min={MIN_TEETH}
          max={MAX_TEETH}
          value={teeth}
          onChange={(e) => setTeeth(Number(e.target.value))}
          className="gear-slider min-w-0 flex-1 sm:max-w-44"
        />
        <p className="w-full text-sm leading-snug text-pencil sm:w-auto sm:flex-1">
          Generated live with the involute maths from my{" "}
          <a
            href="https://github.com/mofopeadegoke/gearGeneration"
            target="_blank"
            rel="noopener noreferrer"
            className="text-ink underline decoration-redline underline-offset-4 hover:text-redline"
          >
            C++ gear library
          </a>
        </p>
      </motion.figcaption>
    </figure>
  );
}
