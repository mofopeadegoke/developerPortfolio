import { profile } from "@/lib/content";

// The footer is a drafting title block: the box in the corner of every
// engineering drawing that says who drew it and when.
export function Footer() {
  const cells = [
    { label: "Drawn by", value: profile.fullName, wide: true },
    { label: "Title", value: `${profile.role}, portfolio` },
    { label: "Location", value: profile.location },
    { label: "Revised", value: profile.revised },
    { label: "Sheet", value: "1 of 1" },
  ];

  return (
    <footer className="pt-6 pb-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <dl className="grid grid-cols-2 border-t border-l border-ink text-sm md:grid-cols-[2fr_1.4fr_1.2fr_1fr_0.7fr]">
          {cells.map((cell) => (
            <div
              key={cell.label}
              className={`border-r border-b border-ink px-3 py-2.5 ${cell.wide ? "col-span-2 md:col-span-1" : ""}`}
            >
              <dt className="text-xs text-pencil">{cell.label}</dt>
              <dd className="mt-0.5 font-medium tabular">{cell.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </footer>
  );
}
