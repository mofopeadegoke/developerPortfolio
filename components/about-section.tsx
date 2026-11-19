import { ArrowUpRight } from "lucide-react";
import { ProofFigure, SectionHead } from "@/components/section-parts";
import { about, achievements } from "@/lib/content";

export function AboutSection() {
  const { education } = about;

  return (
    <section id="about" aria-labelledby="about-heading" className="section">
      <div className="wrap">
        <SectionHead id="about" />
        <div className="grid gap-12 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-16">
          <div className="space-y-6" data-stagger="120">
            {about.paragraphs.map((paragraph) => (
              <p key={paragraph} data-reveal className="text-[clamp(1.25rem,2vw,1.75rem)] leading-[1.35] tracking-[-0.015em]">
                {paragraph}
              </p>
            ))}
          </div>
          <div data-reveal style={{ ["--d" as string]: "200ms" }}>
            <ProofFigure id="about" compact />
            <div className="border-t border-rule pt-6">
              <h3 className="font-display text-2xl leading-tight font-bold tracking-[-0.02em]">{education.degree}</h3>
              <p className="mt-2">{education.school}</p>
              <p className="mono mt-2 text-faint">Graduated {education.graduated}</p>
              <p className="mt-4 text-quiet">{education.standing}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function AwardsSection() {
  return (
    <section id="awards" aria-labelledby="awards-heading" className="section">
      <div className="wrap">
        <SectionHead id="awards">Teknofest is Türkiye&apos;s national technology competition; each result is out of thousands of teams.</SectionHead>
        <ProofFigure id="awards" />
        <table className="w-full text-left">
          <caption className="sr-only">Competition results</caption>
          <thead className="sr-only">
            <tr>
              <th scope="col">Result</th>
              <th scope="col">Competition</th>
              <th scope="col">Year</th>
            </tr>
          </thead>
          <tbody data-stagger="90">
            {achievements.map((item) => (
              <tr key={`${item.result}-${item.event}`} data-reveal className="border-t border-rule align-baseline last:border-b">
                <td className="w-[7.5rem] py-5 pr-4 font-display text-[clamp(1.25rem,2vw,1.75rem)] font-bold tracking-[-0.02em] whitespace-nowrap sm:w-[11rem]">
                  {item.result}
                </td>
                <td className="py-5 pr-4 text-[1.0625rem]">
                  {item.href ? (
                    <a href={item.href} target="_blank" rel="noopener noreferrer" className="link inline-flex items-center gap-1">
                      {item.event}
                      <ArrowUpRight className="h-4 w-4 flex-none" aria-label="(opens the project on GitHub)" />
                    </a>
                  ) : (
                    item.event
                  )}
                </td>
                <td className="mono py-5 text-right text-faint">{item.year}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
