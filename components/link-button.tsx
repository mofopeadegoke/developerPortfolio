import type { AnchorHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type LinkButtonProps = AnchorHTMLAttributes<HTMLAnchorElement> & { variant?: "solid" | "outline" };

export function LinkButton({ variant = "solid", className, ...props }: LinkButtonProps) {
  return (
    <a
      className={cn(
        "inline-flex items-center justify-center gap-2 border px-5 py-3 font-medium transition-colors duration-200",
        variant === "solid"
          ? "border-copper bg-copper text-ground hover:border-amber hover:bg-amber"
          : "border-copper bg-transparent text-text hover:bg-copper hover:text-ground",
        className,
      )}
      {...props}
    />
  );
}
