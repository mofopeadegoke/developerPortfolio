import { involuteGear } from "@/lib/gear";

// Gear mark used for the favicon, touch icon and social card.
export function GearMark({ size, teeth = 12, stroke, fill }: { size: number; teeth?: number; stroke: string; fill: string }) {
  const gear = involuteGear(teeth, 200 / (teeth + 2));
  return (
    <svg width={size} height={size} viewBox="-110 -110 220 220">
      <path d={gear.outline} fill={fill} stroke={stroke} strokeWidth={10} strokeLinejoin="round" />
      <circle r={26} fill={stroke} />
    </svg>
  );
}
