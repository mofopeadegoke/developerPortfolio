import { Room } from "@/components/room";
import { codingSince, experience } from "@/lib/content";

export function ExperienceSection() {
  return (
    <Room stop="experience" id="experience" aria-labelledby="experience-heading" size="wide">
      <h2 id="experience-heading" className="font-display text-4xl font-extrabold tracking-[-0.02em] [font-stretch:115%]">
        Experience
      </h2>
      <p className="mt-3 text-quiet">{codingSince}</p>
      <ol className="mt-8 space-y-10">
        {experience.map((job) => (
          <li key={`${job.company}-${job.start}`}>
            <h3 className="font-display text-2xl font-bold leading-tight">{job.role}</h3>
            <p className="mt-0.5 text-lg">
              {job.company}
              <span className="text-quiet">, {job.location}</span>
            </p>
            <p className="mt-0.5 text-sm text-quiet [font-variant-numeric:tabular-nums]">
              {job.start} to {job.end}
            </p>
            <p className="mt-3 text-quiet">{job.summary}</p>
            <ul className="dash-list mt-3 space-y-2">
              {job.points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
            <ul aria-label="Technologies" className="tech-list mt-4">
              {job.stack.map((tech) => (
                <li key={tech}>{tech}</li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </Room>
  );
}
