import type { AnchorHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & {
  variant?: "solid" | "outline";
};

export function LinkButton({ variant = "solid", className, ...props }: Props) {
  return (
    <a
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-[3px] px-5 py-2.5 text-[0.95rem] font-medium transition-[background-color,color,transform] duration-200 active:translate-y-px",
        variant === "solid"
          ? "bg-redline text-redline-ink hover:bg-ink hover:text-paper"
          : "border border-ink text-ink hover:bg-ink hover:text-paper",
        className,
      )}
      {...props}
    />
  );
}
