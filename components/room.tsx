import type { ComponentProps, ReactNode } from "react";
import { proofs } from "@/lib/content";
import { stops } from "@/lib/gallery";
import { cn } from "@/lib/utils";

type RoomProps = ComponentProps<"section"> & {
  stop: string;
  size?: "wide";
  children: ReactNode;
};

/**
 * One stop on the walk: the words, opposite the fixed form. Where the form
 * takes a number, the same number is set as type for pages without the form.
 * It repeats a fact already in the words, so assistive technology skips it.
 */
export function Room({ stop, size, className, children, ...props }: RoomProps) {
  const entry = stops.find((item) => item.id === stop)!;
  const proof = proofs[stop];
  return (
    <section data-stop={stop} data-label={entry.label} data-size={size} className={cn("room", className)} {...props}>
      {proof && (
        <div aria-hidden="true" className="room-proof">
          <div className="proof">
            <span className="proof-figure">{proof.figure}</span>
            <span className="proof-caption">{proof.caption}</span>
          </div>
        </div>
      )}
      <div className="plate">{children}</div>
    </section>
  );
}
