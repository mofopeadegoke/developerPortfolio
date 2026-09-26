"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, Plus } from "lucide-react";
import { SectionHeading } from "@/components/section-heading";
import { ProjectDrawing } from "@/components/project-drawings";
import { projects } from "@/lib/content";

export function ProjectsSection() {
  const [open, setOpen] = useState<Set<string>>(() => new Set([projects[0].key]));

  const toggle = (key: string) =>
    setOpen((current) => {
      const next = new Set(current);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });

  return (
    <section
      id="projects"
      aria-labelledby="projects-heading"
      className="border-t border-rule bg-paper-raised py-24 md:py-32"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading id="projects" title="Projects" intro="Things I built outside the day job, from robotics software to a browser extension people rely on." />

        <ul className="border-t border-ink">
          {projects.map((project) => {
            const isOpen = open.has(project.key);
            const panelId = `project-${project.key}`;
            return (
              <li key={project.key} className="border-b border-rule">
                <h3>
                  <button
                    type="button"
                    onClick={() => toggle(project.key)}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    className="group grid w-full grid-cols-[1fr_auto] items-baseline gap-x-6 gap-y-1 py-6 text-left md:grid-cols-[7rem_1fr_1fr_auto] md:py-7"
                  >
                    <span className="order-3 text-sm text-pencil tabular md:order-none">{project.years}</span>
                    <span className="order-1 md:order-none">
                      <span className="block font-display text-3xl font-semibold leading-tight transition-colors group-hover:text-redline md:text-4xl">
                        {project.title}
                      </span>
                      <span className="mt-1 block text-pencil">{project.role}</span>
                    </span>
                    <span className="order-4 col-span-2 text-lg md:order-none md:col-span-1">{project.result}</span>
                    <motion.span
                      aria-hidden="true"
                      animate={{ rotate: isOpen ? 45 : 0 }}
                      transition={{ type: "spring", stiffness: 400, damping: 28 }}
                      className="order-2 grid h-9 w-9 place-items-center self-start rounded-full border border-rule transition-colors group-hover:border-redline group-hover:text-redline md:order-none md:self-center"
                    >
                      <Plus className="h-4 w-4" />
                    </motion.span>
                  </button>
                </h3>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={panelId}
                      key="panel"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="grid gap-8 pb-10 md:grid-cols-[7rem_1fr_16rem] md:gap-x-6">
                        <div className="hidden md:block" />
                        <div>
                          <ul className="max-w-[64ch] space-y-3">
                            {project.points.map((point) => (
                              <li key={point} className="relative pl-5 leading-relaxed">
                                <span aria-hidden="true" className="absolute top-[0.7em] left-0 h-px w-2.5 bg-pencil" />
                                {point}
                              </li>
                            ))}
                          </ul>
                          <ul aria-label="Technologies" className="mt-5 flex flex-wrap gap-x-4 gap-y-1 text-sm text-pencil">
                            {project.stack.map((tech) => (
                              <li key={tech}>{tech}</li>
                            ))}
                          </ul>
                          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
                            {project.links.map((link) => (
                              <a
                                key={link.href}
                                href={link.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group/link inline-flex items-center gap-1 font-medium underline decoration-redline underline-offset-4 hover:text-redline"
                              >
                                {link.label}
                                <ArrowUpRight className="h-4 w-4 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
                              </a>
                            ))}
                          </div>
                        </div>
                        <div className="max-w-56 self-start border border-rule bg-paper p-3 md:max-w-none">
                          <ProjectDrawing project={project.key} />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
