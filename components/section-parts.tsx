import type { ReactNode } from "react";
import { proofs, sections, type SectionId } from "@/lib/content";

const total = String(sections.length).padStart(2, "0");

/** The numbered eyebrow and giant heading that open every section. */
export function SectionHead({ id, children }: { id: SectionId; children?: ReactNode }) {
  const index = sections.findIndex((section) => section.id === id);
  const label = sections[index].label;
  return (
    <header className="section-head">
      <div>
        <p className="mono eyebrow mb-5" data-reveal>
          {String(index + 1).padStart(2, "0")} / {total}
        </p>
        <h2 id={`${id}-heading`} className="display" data-split>
          {label}
        </h2>
      </div>
      {children && (
        <div className="section-intro" data-reveal style={{ ["--d" as string]: "150ms" }}>
          {children}
        </div>
      )}
    </header>
  );
}

/**
 * A section's number, set as giant type and counted up as it arrives. The
 * words beside it always state the same fact, so it is hidden from assistive
 * technology.
 */
export function ProofFigure({ id, compact }: { id: SectionId; compact?: boolean }) {
  const proof = proofs[id];
  if (!proof) return null;
  const { count, decimals, prefix = "", suffix = "", figure, caption } = proof;
  const digits = count === undefined ? figure : figure.slice(prefix.length, figure.length - suffix.length);
  return (
    <div aria-hidden="true" className={compact ? "proof proof-compact" : "proof"}>
      <p className="proof-figure" data-reveal>
        {prefix && <span className="unit">{prefix}</span>}
        <span
          data-count={count}
          data-decimals={decimals}
          // The counter writes only the digits; the prefix and suffix stay put.
        >
          {digits}
        </span>
        {suffix && <span className="unit">{suffix}</span>}
      </p>
      <p className="mono proof-caption" data-reveal style={{ ["--d" as string]: "200ms" }}>
        {caption}
      </p>
    </div>
  );
}
