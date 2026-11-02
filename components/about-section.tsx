import { ArrowUpRight } from "lucide-react";
import { Room } from "@/components/room";
import { about, achievements } from "@/lib/content";

export function AboutSection() {
  const { education } = about;

  return (
    <Room stop="about" id="about" aria-labelledby="about-heading" mark="Room 5 of 6. The sculpture is the degree's CGPA." size="wide">
      <h2 id="about-heading" className="font-display text-4xl font-extrabold tracking-[-0.02em] [font-stretch:115%]">
        About
      </h2>
      <div className="mt-6 space-y-4 text-lg leading-relaxed">
        {about.paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>

      <h3 className="mt-9 font-display text-2xl font-bold">{education.degree}</h3>
      <p className="mt-1">{education.school}</p>
      <p className="text-quiet">Graduated {education.graduated}</p>
      <p className="mt-2 text-quiet">{education.standing}</p>

      <h3 className="mt-9 font-display text-2xl font-bold">Competitions</h3>
      <table className="mt-3 w-full text-left">
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
              <td className="w-24 py-2.5 pr-3 font-semibold whitespace-nowrap [font-variant-numeric:tabular-nums]">{item.result}</td>
              <td className="py-2.5 pr-3">
                {item.href ? (
                  <a href={item.href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 underline decoration-ultramarine hover:text-ultramarine">
                    {item.event}
                    <ArrowUpRight className="h-4 w-4" aria-label="(opens project on GitHub)" />
                  </a>
                ) : (
                  item.event
                )}
              </td>
              <td className="py-2.5 text-right text-sm text-quiet [font-variant-numeric:tabular-nums]">{item.year}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Room>
  );
}
