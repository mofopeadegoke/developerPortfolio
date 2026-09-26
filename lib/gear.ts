// Involute spur gear profile, generated from the standard gear parameters.
// Same construction as github.com/mofopeadegoke/gearGeneration, in 2D.

export type Gear = {
  /** Outline of the whole gear as an SVG path, centred on the origin. */
  outline: string;
  /** Closed outline of the tooth centred on angle 0, for highlighting. */
  tooth: string;
  pitchRadius: number;
  baseRadius: number;
  tipRadius: number;
  rootRadius: number;
};

const involute = (angle: number) => Math.tan(angle) - angle;

const polar = (radius: number, angle: number) =>
  `${(radius * Math.cos(angle)).toFixed(3)} ${(radius * Math.sin(angle)).toFixed(3)}`;

/**
 * @param teeth number of teeth (z)
 * @param module module in drawing units (m); pitch diameter = m * z
 * @param pressureAngleDeg pressure angle (α), 20° is the modern standard
 */
export function involuteGear(teeth: number, module: number, pressureAngleDeg = 20, samples = 10): Gear {
  const alpha = (pressureAngleDeg * Math.PI) / 180;
  const pitchRadius = (module * teeth) / 2;
  const baseRadius = pitchRadius * Math.cos(alpha);
  const tipRadius = pitchRadius + module;
  const rootRadius = pitchRadius - 1.25 * module;
  const pitchAngle = (2 * Math.PI) / teeth;

  // Half the tooth's angular thickness at the base circle. At the pitch circle
  // the tooth is exactly half the circular pitch thick.
  const halfBase = Math.PI / (2 * teeth) + involute(alpha);
  // Half-thickness at radius r along the involute flank.
  const halfAt = (r: number) => halfBase - involute(Math.acos(Math.min(1, baseRadius / r)));

  const flankStart = Math.max(baseRadius, rootRadius);
  const radii = Array.from(
    { length: samples + 1 },
    (_, i) => flankStart + ((tipRadius - flankStart) * i) / samples,
  );

  // Points for one tooth centred on `centre`, going counter-clockwise from the
  // root on the leading side to the root on the trailing side.
  const toothPoints = (centre: number) => {
    const rising = radii.map((r) => polar(r, centre - halfAt(r)));
    const falling = [...radii].reverse().map((r) => polar(r, centre + halfAt(r)));
    const leadingRoot = polar(rootRadius, centre - halfAt(flankStart));
    const trailingRoot = polar(rootRadius, centre + halfAt(flankStart));
    return { rising, falling, leadingRoot, trailingRoot };
  };

  let outline = "";
  for (let i = 0; i < teeth; i++) {
    const { rising, falling, leadingRoot, trailingRoot } = toothPoints(i * pitchAngle);
    outline += i === 0 ? `M ${leadingRoot} ` : `A ${rootRadius} ${rootRadius} 0 0 1 ${leadingRoot} `;
    outline += `L ${rising.join(" L ")} `;
    outline += `A ${tipRadius} ${tipRadius} 0 0 1 ${falling[0]} `;
    outline += `L ${falling.slice(1).join(" L ")} L ${trailingRoot} `;
  }
  outline += `A ${rootRadius} ${rootRadius} 0 0 1 ${toothPoints(0).leadingRoot} Z`;

  const t = toothPoints(0);
  const tooth =
    `M ${t.leadingRoot} L ${t.rising.join(" L ")} ` +
    `A ${tipRadius} ${tipRadius} 0 0 1 ${t.falling[0]} ` +
    `L ${t.falling.slice(1).join(" L ")} L ${t.trailingRoot} ` +
    `A ${rootRadius} ${rootRadius} 0 0 0 ${t.leadingRoot} Z`;

  return { outline, tooth, pitchRadius, baseRadius, tipRadius, rootRadius };
}
