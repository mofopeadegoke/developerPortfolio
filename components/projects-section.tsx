import { ArrowUpRight } from "lucide-react";
import { Room } from "@/components/room";
import { WormholeButton } from "@/components/wormhole-button";
import { projects } from "@/lib/content";

export function ProjectsSection() {
  return (
    <div id="projects">
      {projects.map((project, index) => (
        <Room key={project.key} stop={project.key} aria-labelledby={`project-${project.key}`}>
          {index === 0 && (
            <div className="mb-8 border-b border-rule pb-6">
              <h2 className="font-display text-4xl font-extrabold tracking-[-0.02em] [font-stretch:115%]">Projects</h2>
              <p className="mt-3 text-quiet">
                Things I built outside the day job, from an open-source AI plugin and a bookmarking app to robotics software and a browser extension people rely on.
              </p>
            </div>
          )}
          <h3 id={`project-${project.key}`} className="font-display text-3xl font-bold leading-tight tracking-[-0.01em]">
            {project.title}
          </h3>
          <p className="mt-1 text-quiet">{project.role}</p>
          <p className="mt-0.5 text-sm text-quiet [font-variant-numeric:tabular-nums]">{project.years}</p>
          <p className="mt-4 text-lg leading-snug">{project.result}</p>
          <ul className="dash-list mt-4 space-y-2">
            {project.points.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
          <ul aria-label="Technologies" className="tech-list mt-4">
            {project.stack.map((tech) => (
              <li key={tech}>{tech}</li>
            ))}
          </ul>
          <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2">
            {project.links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-medium underline decoration-copper transition-colors hover:text-amber"
              >
                {link.label}
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </a>
            ))}
          </div>
          {project.key === "wormhole" && <WormholeButton />}
        </Room>
      ))}
    </div>
  );
}
