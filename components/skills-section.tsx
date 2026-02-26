"use client";

import { useEffect, useRef, useState } from "react";

const skillCategories = [
  {
    name: "Languages",
    skills: [
      { name: "JavaScript/TypeScript", level: 95 },
      { name: "PHP", level: 85 },
      { name: "C/C++", level: 80 },
      { name: "Python", level: 75 },
      { name: "C#", level: 70 },
      { name: "SQL", level: 85 },
    ],
  },
  {
    name: "Frontend",
    skills: [
      { name: "React", level: 95 },
      { name: "Vue.js 3", level: 85 },
      { name: "Three.js", level: 75 },
      { name: "Tailwind CSS", level: 95 },
      { name: "SCSS", level: 85 },
      { name: "PWA", level: 80 },
    ],
  },
  {
    name: "Backend & Tools",
    skills: [
      { name: "Node.js", level: 90 },
      { name: "REST APIs", level: 90 },
      { name: "Docker", level: 75 },
      { name: "Git", level: 95 },
      { name: "CI/CD", level: 70 },
      { name: "Microservices", level: 75 },
    ],
  },
];

const techStack = [
  "React",
  "Vue.js",
  "TypeScript",
  "Node.js",
  "PHP",
  "Three.js",
  "Tailwind",
  "Docker",
  "Git",
  "REST APIs",
  "MUI",
  "Shadcn",
  "Vite",
  "Webpack",
];

function SkillBar({
  name,
  level,
  isVisible,
}: {
  name: string;
  level: number;
  isVisible: boolean;
}) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-foreground">{name}</span>
        <span className="text-muted-foreground">{level}%</span>
      </div>
      <div className="h-2 bg-secondary rounded-full overflow-hidden">
        <div
          className="h-full bg-primary rounded-full transition-all duration-1000 ease-out"
          style={{ width: isVisible ? `${level}%` : "0%" }}
        />
      </div>
    </div>
  );
}

export function SkillsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section id="skills" ref={sectionRef} className="py-24 px-6 bg-card/50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-primary text-sm font-medium tracking-wider uppercase">
            Expertise
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mt-2">
            Technical Skills
          </h2>
        </div>

        {/* Skill Bars */}
        <div className="grid md:grid-cols-3 gap-12 mb-16">
          {skillCategories.map((category) => (
            <div key={category.name} className="space-y-6">
              <h3 className="text-xl font-semibold text-foreground border-b border-border pb-2">
                {category.name}
              </h3>
              <div className="space-y-4">
                {category.skills.map((skill) => (
                  <SkillBar
                    key={skill.name}
                    name={skill.name}
                    level={skill.level}
                    isVisible={isVisible}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Tech Stack Pills */}
        <div className="text-center">
          <h3 className="text-lg font-medium text-muted-foreground mb-6">
            Technologies I work with
          </h3>
          <div className="flex flex-wrap justify-center gap-3">
            {techStack.map((tech) => (
              <span
                key={tech}
                className="px-4 py-2 bg-secondary text-secondary-foreground rounded-full text-sm font-medium hover:bg-primary/10 hover:text-primary transition-colors cursor-default"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
