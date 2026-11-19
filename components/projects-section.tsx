import { ArrowUpRight } from "lucide-react";
import { SectionHead } from "@/components/section-parts";
import { WorkStack } from "@/components/work-stack";
import { WormholeButton } from "@/components/wormhole-button";
import { projects, type Project } from "@/lib/content";

/** The project's own picture: a real capture, or its number set as type. */
function Media({ project }: { project: Project }) {
  if (project.media) {
    const { poster, video, alt } = project.media;
    return (
      <div className="card-media">
        {video ? (
          <video src={video} poster={poster} muted loop playsInline autoPlay preload="none" aria-label={alt} data-autoplay />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={poster} alt={alt} loading="lazy" decoding="async" />
        )}
      </div>
    );
  }
  // No capture: the project's own number, set as type over a fine grid.
  return (
    <div className="card-media card-glyph">
      <div>
        <span aria-hidden={!project.metric}>{project.metric?.figure ?? project.stack[0]}</span>
        {project.metric && <p className="mono mt-4 max-w-[18rem] text-faint">{project.metric.label}</p>}
      </div>
    </div>
  );
}

export function ProjectsSection() {
  return (
    <section id="work" data-stop="field" aria-labelledby="work-heading" className="section">
      <div className="wrap">
        <SectionHead id="work">
          Things I built outside the day job: an open-source AI plugin, a full-stack Claude app, a browser extension people keep installing, and C++ that goes
          below the UI.
        </SectionHead>

        <WorkStack count={projects.length}>
          {projects.map((project, index) => (
            <div key={project.key} className="stack-slot" style={{ ["--i" as string]: index }}>
              <article aria-labelledby={`project-${project.key}`} className={project.key === "wormhole" ? "card card-clear" : "card"}>
                <div className="card-body">
                  <div className="mono flex justify-between gap-4 text-faint">
                    <span>
                      {String(index + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}
                    </span>
                    <span>{project.years}</span>
                  </div>
                  <h3 id={`project-${project.key}`} className="title mt-5">
                    {project.title}
                  </h3>
                  <p className="mt-2 text-sm text-quiet">{project.role}</p>
                  <p className="lead mt-5">{project.result}</p>

                  {/* Cards without a capture show the number as the media panel on
                      desktop; phones drop that panel and keep the number here. */}
                  {project.metric && (
                    <div className={project.media ? "mt-6 flex items-end gap-4" : "mt-6 flex items-end gap-4 lg:hidden"}>
                      <span className="card-metric">{project.metric.figure}</span>
                      <span className="mono max-w-[13rem] pb-1 text-faint">{project.metric.label}</span>
                    </div>
                  )}

                  <ul className="dash-list mt-6 space-y-1.5 text-sm text-quiet sm:text-[0.9375rem]">
                    {project.points.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>

                  <div className="mt-auto pt-6">
                    <ul aria-label="Technologies" className="tech-list mono">
                      {project.stack.map((tech) => (
                        <li key={tech}>{tech}</li>
                      ))}
                    </ul>
                    <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3">
                      {project.links.map((link) => (
                        <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer" className="link inline-flex items-center gap-1 font-medium">
                          {link.label}
                          <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                        </a>
                      ))}
                      {project.key === "wormhole" && <WormholeButton />}
                    </div>
                  </div>
                </div>
                <Media project={project} />
              </article>
            </div>
          ))}
        </WorkStack>
      </div>
    </section>
  );
}
