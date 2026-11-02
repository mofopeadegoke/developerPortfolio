import type { ComponentProps, CSSProperties, ReactNode } from "react";
import { stops } from "@/lib/gallery";
import { cn } from "@/lib/utils";

type RoomProps = ComponentProps<"section"> & {
  stop: string;
  size?: "wide";
  children: ReactNode;
};

/** One stop on the walk: the words, opposite the fixed form. */
export function Room({ stop, size, className, children, ...props }: RoomProps) {
  const entry = stops.find((item) => item.id === stop)!;
  return (
    <section
      data-stop={stop}
      data-label={entry.label}
      data-size={size}
      className={cn("room", className)}
      style={{ "--room-still": `url(/rooms/${stop}.jpg)`, "--room-still-phone": `url(/rooms/phone-${stop}.jpg)` } as CSSProperties}
      {...props}
    >
      <div aria-hidden="true" className="room-still" />
      <div className="plate">{children}</div>
    </section>
  );
}
