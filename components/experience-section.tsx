"use client";

const experiences = [
  {
    title: "Full-Stack Developer",
    company: "Technolink Software",
    location: "Remote",
    period: "2025 – Present",
    description: [
      "Developing and maintaining backend services using PHP and Node.js for AI-driven automation systems",
      "Designing and consuming RESTful APIs with authentication and role-based access control",
      "Building responsive frontend interfaces using React and modern CSS utility frameworks",
      "Using Docker for containerized development and deployment workflows",
    ],
    technologies: ["PHP", "Node.js", "React", "Docker", "REST APIs"],
  },
  {
    title: "Software Developer Intern",
    company: "Ozbul Software",
    location: "Remote",
    period: "Jun 2025 – Aug 2025",
    description: [
      "Built reusable UI components using React and TypeScript",
      "Integrated frontend applications with C# backend services and REST APIs",
      "Improved UI consistency and maintainability using MUI, Tailwind CSS, and SCSS",
      "Contributed to architectural refactoring from monolithic to API-driven systems",
    ],
    technologies: ["React", "TypeScript", "C#", "MUI", "Tailwind"],
  },
  {
    title: "Frontend Developer",
    company: "Mensa Philosophical Circle",
    location: "",
    period: "Jul 2023 – Dec 2023",
    description: [
      "Developed and maintained dynamic web applications using HTML, CSS, JavaScript, and React",
      "Collaborated with cross-functional teams to implement responsive designs",
      "Contributed to reduced bounce rates and increased user engagement",
    ],
    technologies: ["React", "JavaScript", "HTML", "CSS"],
  },
  {
    title: "Founder & Product Engineer",
    company: "Inscribe (Startup)",
    location: "",
    period: "2022 – Present",
    description: [
      "Founded and built a browser-based productivity platform for web note-taking and sketching",
      "Implemented features including inline web annotations, tagging, search, and multi-format exports",
      "Focused on accessibility, performance, and progressive web app (PWA) principles",
    ],
    technologies: ["React", "Node.js", "PWA", "Accessibility"],
  },
];

export function ExperienceSection() {
  return (
    <section id="experience" className="py-24 px-6 bg-card/50">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-primary text-sm font-medium tracking-wider uppercase">
            Career
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mt-2">
            Work Experience
          </h2>
        </div>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-border md:-translate-x-1/2" />

          {/* Experience items */}
          <div className="space-y-12">
            {experiences.map((exp, index) => (
              <div
                key={index}
                className={`relative flex flex-col md:flex-row gap-8 ${
                  index % 2 === 0 ? "md:flex-row-reverse" : ""
                }`}
              >
                {/* Timeline dot */}
                <div className="absolute left-0 md:left-1/2 w-4 h-4 bg-primary rounded-full -translate-x-1/2 border-4 border-background z-10" />

                {/* Content */}
                <div className={`md:w-1/2 ${index % 2 === 0 ? "md:pr-12" : "md:pl-12"} pl-8 md:pl-0`}>
                  <div className="p-6 bg-card rounded-xl border border-border hover:border-primary/50 transition-all duration-300">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                      <span className="text-sm text-primary font-medium">
                        {exp.period}
                      </span>
                      {exp.location && (
                        <span className="text-xs text-muted-foreground">
                          {exp.location}
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl font-semibold text-foreground">
                      {exp.title}
                    </h3>
                    <p className="text-muted-foreground font-medium mb-4">
                      {exp.company}
                    </p>
                    <ul className="space-y-2 mb-4">
                      {exp.description.map((item, i) => (
                        <li
                          key={i}
                          className="text-sm text-muted-foreground flex items-start gap-2"
                        >
                          <span className="text-primary mt-1.5">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="flex flex-wrap gap-2">
                      {exp.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="px-2 py-1 bg-primary/10 text-primary rounded text-xs font-medium"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Spacer for alternating layout */}
                <div className="hidden md:block md:w-1/2" />
              </div>
            ))}
          </div>
        </div>

        {/* Education */}
        <div className="mt-16 p-6 bg-card rounded-xl border border-border">
          <h3 className="text-xl font-semibold text-foreground mb-2">
            Education
          </h3>
          <p className="text-muted-foreground font-medium">
            Bachelor of Science in Software Engineering
          </p>
          <p className="text-sm text-muted-foreground">
            European University of Lefke, Northern Cyprus
          </p>
          <p className="text-sm text-primary mt-1">
            Expected Graduation: June 2026
          </p>
        </div>
      </div>
    </section>
  );
}
