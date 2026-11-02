import type { ComponentProps, CSSProperties, ReactNode } from "react";
import { roomColors, stops } from "@/lib/gallery";
import { cn } from "@/lib/utils";

type RoomProps = ComponentProps<"section"> & {
  stop: string;
  mark?: string;
  size?: "wide";
  children: ReactNode;
};

/** One stop on the walk: a wall label over the fixed scene. */
export function Room({ stop, mark, size, className, children, ...props }: RoomProps) {
  const entry = stops.find((item) => item.id === stop)!;
  return (
    <section
      data-stop={stop}
      data-label={entry.label}
      data-size={size}
      className={cn("room", className)}
      style={{ "--room-color": roomColors[entry.room], "--room-still": `url(/rooms/${stop}.jpg)`, "--room-still-phone": `url(/rooms/phone-${stop}.jpg)` } as CSSProperties}
      {...props}
    >
      <div aria-hidden="true" className="room-still" />
      <div className="wall-label">
        {children}
        {mark && <p className="room-mark">{mark}</p>}
      </div>
    </section>
  );
}
