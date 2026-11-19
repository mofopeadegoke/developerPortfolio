import { ArrowUpRight } from "lucide-react";
import { ProofFigure, SectionHead } from "@/components/section-parts";
import { openSource } from "@/lib/content";

export function OpenSourceSection() {
  return (
    <section id="open-source" aria-labelledby="open-source-heading" className="section">
      <div className="wrap">
        <SectionHead id="open-source">Fixes merged into other people&apos;s projects, both backed by Y Combinator, found by building real things with them.</SectionHead>
        <ProofFigure id="open-source" />
        <ol data-stagger="140">
          {openSource.map((item) => (
            <li key={item.project} data-reveal className="row lg:grid-cols-[minmax(0,4fr)_minmax(0,5fr)_minmax(0,3fr)]">
              <div>
                <h3 className="title">{item.project}</h3>
                <p className="mt-2 text-sm text-quiet">{item.org}</p>
                <p className="mono mt-1 text-faint">{item.year}</p>
              </div>
              <div>
                <p className="lead">{item.result}</p>
                <ul className="dash-list mt-4 space-y-1.5 text-quiet">
                  {item.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </div>
              <ul className="flex flex-col gap-3 lg:items-end lg:text-right">
                {item.links.map((link) => (
                  <li key={link.href}>
                    <a href={link.href} target="_blank" rel="noopener noreferrer" className="link inline-flex items-start gap-1 text-[0.9375rem]">
                      {link.label}
                      <ArrowUpRight className="mt-0.5 h-4 w-4 flex-none" aria-hidden="true" />
                    </a>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
