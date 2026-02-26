"use client";

import { ExternalLink, Github, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";

const projects = [
  {
    title: "Inscribe",
    description:
      "A browser-based productivity platform for web note-taking, sketching, reminders, and exports. Features inline web annotations, tagging, search, and multi-format exports (PDF, PNG, Markdown).",
    technologies: ["React", "Node.js", "PWA", "Accessibility"],
    image: "/projects/inscribe.jpg",
    github: "#",
    live: "#",
    featured: false,
  },
  {
    title: "Parametric Gear Library",
    description:
      "A C++ library for programmatic generation of customizable 3D gear models. Exports directly in STL format, supporting extensive parameterization for rapid prototyping and 3D printing.",
    technologies: ["C++", "3D Modeling", "STL Export", "OpenSCAD"],
    image: "/projects/gear-library.jpg",
    github: "https://github.com/mofopeadegoke/gearGeneration",
    featured: true,
  },
  {
    title: "Wormhole 3D Simulation",
    description:
      "Real-time WebGL visualization simulating wormhole distortion effects using custom shaders, HTML Canvas, and Three.js.",
    technologies: ["Three.js", "WebGL", "Shaders", "JavaScript"],
    image: "/projects/wormhole.jpg",
    github: "https://github.com/mofopeadegoke/threeJsTUnnel",
    live: "https://three-js-t-unnel.vercel.app/",
    featured: true,
  },
  {
    title: "AI Automation Server",
    description:
      "Backend automation platform built at Technolink using PHP, Node.js, and Dockerized microservices for AI-driven automation systems.",
    technologies: ["PHP", "Node.js", "Docker", "Microservices"],
    image: "/projects/ai-server.jpg",
    featured: false,
  },
  {
    title: "Hackathon Winner Project",
    description:
      "Led a 3-person team to first place at Codespace x Couchbase Hackathon by building a scalable data visualization platform within 48 hours.",
    technologies: ["React", "Couchbase", "Data Visualization"],
    image: "/projects/hackathon.jpg",
    github: "https://github.com/mofopeadegoke/TechSpace-Project-Organik",
    award: "1st Place - Codespace x Couchbase 2023",
    featured: false,
  },
];

export function ProjectsSection() {
  return (
    <section id="projects" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-primary text-sm font-medium tracking-wider uppercase">
            Portfolio
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mt-2">
            Featured Projects
          </h2>
        </div>

        {/* Featured Projects */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {projects
            .filter((p) => p.featured)
            .map((project) => (
              <div
                key={project.title}
                className="group relative bg-card rounded-xl border border-border overflow-hidden hover:border-primary/50 transition-all duration-300"
              >
                <div className="aspect-video bg-secondary/50 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-6xl font-bold text-primary/20">
                      {project.title.charAt(0)}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-1 bg-secondary text-secondary-foreground rounded text-xs"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-3">
                    {project.github && (
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                        className="border-border hover:bg-secondary bg-transparent"
                      >
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Github className="h-4 w-4 mr-2" />
                          Code
                        </a>
                      </Button>
                    )}
                    {project.live && (
                      <Button size="sm" asChild>
                        <a
                          href={project.live}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Live Demo
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
        </div>

        {/* Other Projects */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects
            .filter((p) => !p.featured)
            .map((project) => (
              <div
                key={project.title}
                className="group p-6 bg-card rounded-xl border border-border hover:border-primary/50 transition-all duration-300"
              >
                {project.award && (
                  <div className="flex items-center gap-2 mb-3 text-primary">
                    <Trophy className="h-4 w-4" />
                    <span className="text-xs font-medium">{project.award}</span>
                  </div>
                )}
                <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {project.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.technologies.slice(0, 3).map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-1 bg-secondary text-secondary-foreground rounded text-xs"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                <div className="flex gap-3">
                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary transition-colors"
                      aria-label={`View ${project.title} on GitHub`}
                    >
                      <Github className="h-5 w-5" />
                    </a>
                  )}
                  {project.live && (
                    <a
                      href={project.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary transition-colors"
                      aria-label={`View ${project.title} live`}
                    >
                      <ExternalLink className="h-5 w-5" />
                    </a>
                  )}
                </div>
              </div>
            ))}
        </div>
      </div>
    </section>
  );
}
