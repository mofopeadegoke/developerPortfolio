import { ProofFigure, SectionHead } from "@/components/section-parts";
import { experience } from "@/lib/content";

export function ExperienceSection() {
  return (
    <section id="experience" aria-labelledby="experience-heading" className="section">
      <div className="wrap">
        <SectionHead id="experience">Writing code since 2020, shipping it since 2022, and 1.5+ years of it professionally.</SectionHead>
        <ProofFigure id="experience" />
        <ol>
          {experience.map((job) => (
            <li key={`${job.company}-${job.start}`} data-reveal className="row lg:grid-cols-[minmax(0,3fr)_minmax(0,4fr)_minmax(0,5fr)]">
              <p className="mono pt-1 text-faint">
                {job.start} – {job.end}
                <span className="mt-1 block">{job.location}</span>
              </p>
              <div>
                <h3 className="font-display text-[clamp(1.5rem,2.2vw,2rem)] leading-[1.05] font-bold tracking-[-0.025em]">{job.role}</h3>
                <p className="mt-1.5 text-lg">{job.company}</p>
                <p className="mt-3 text-quiet">{job.summary}</p>
              </div>
              <div>
                <ul className="dash-list space-y-2 text-[0.9375rem] sm:text-base">
                  {job.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
                <ul aria-label="Technologies" className="tech-list mono mt-4">
                  {job.stack.map((tech) => (
                    <li key={tech}>{tech}</li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
