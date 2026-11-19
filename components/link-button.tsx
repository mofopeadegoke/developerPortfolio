import type { AnchorHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type LinkButtonProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "children"> & {
  variant?: "solid" | "outline";
  size?: "sm";
  /** Drifts toward the cursor on desktop. */
  magnetic?: boolean;
  icon?: ReactNode;
  children: string;
};

/** A square button whose label rolls on hover. */
export function LinkButton({ variant = "solid", size, magnetic, icon, className, children, ...props }: LinkButtonProps) {
  return (
    <a
      data-magnetic={magnetic ? "0.22" : undefined}
      className={cn("btn", variant === "solid" ? "btn-solid" : "btn-outline", size === "sm" && "btn-sm", className)}
      {...props}
    >
      <span className="roll">
        <span>{children}</span>
        <span aria-hidden="true">{children}</span>
      </span>
      {icon}
    </a>
  );
}
