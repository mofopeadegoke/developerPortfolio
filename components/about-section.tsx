import { ArrowUpRight } from "lucide-react";
import { SectionHeading } from "@/components/section-heading";
import { about, achievements } from "@/lib/content";

export function AboutSection() {
  const { education } = about;

  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="border-t border-rule bg-paper-raised py-24 md:py-32"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading id="about" title="About" />

        <div className="grid gap-14 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
          <div>
            {about.paragraphs.map((paragraph) => (
              <p key={paragraph} className="mb-5 max-w-[58ch] text-xl leading-relaxed">
                {paragraph}
              </p>
            ))}

            <div className="mt-10 border-t border-ink pt-4">
              <h3 className="font-display text-2xl font-semibold">{education.degree}</h3>
              <p className="mt-1">{education.school}</p>
              <p className="text-pencil">Graduated {education.graduated}</p>
              <p className="mt-5 flex items-baseline gap-4">
                <span className="font-display text-6xl font-semibold leading-none text-redline tabular">3.81</span>
                <span className="max-w-[30ch] text-pencil">{education.standing}</span>
              </p>
            </div>
          </div>

          <div>
            <h3 className="border-t border-ink pt-4 font-display text-2xl font-semibold">Competitions</h3>
            <table className="mt-4 w-full text-left">
              <caption className="sr-only">Competition results</caption>
              <thead className="sr-only">
                <tr>
                  <th scope="col">Result</th>
                  <th scope="col">Competition</th>
                  <th scope="col">Year</th>
                </tr>
              </thead>
              <tbody>
                {achievements.map((item) => (
                  <tr key={`${item.result}-${item.event}`} className="border-b border-rule align-baseline">
                    <td className="w-28 py-3.5 pr-4 font-display text-xl font-semibold whitespace-nowrap tabular">
                      {item.result}
                    </td>
                    <td className="py-3.5 pr-4">
                      {item.href ? (
                        <a
                          href={item.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 underline decoration-redline underline-offset-4 hover:text-redline"
                        >
                          {item.event}
                          <ArrowUpRight className="h-4 w-4" aria-label="(opens project on GitHub)" />
                        </a>
                      ) : (
                        item.event
                      )}
                    </td>
                    <td className="py-3.5 text-right text-sm text-pencil tabular">{item.year}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
