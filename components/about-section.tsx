"use client";

import { Code2, Lightbulb, Rocket, Users } from "lucide-react";

const journeySteps = [
  {
    icon: Lightbulb,
    title: "The Beginning",
    description:
      "Started my journey into software development driven by curiosity and a passion for creating things that make a difference.",
  },
  {
    icon: Code2,
    title: "Building Foundations",
    description:
      "Mastered C/C++ systems programming, laying a solid foundation for understanding how software works at its core.",
  },
  {
    icon: Rocket,
    title: "Founder Experience",
    description:
      "Built Inscribe from the ground up - a browser-based productivity platform that taught me the full product lifecycle.",
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description:
      "Gained experience in fast-paced engineering teams, collaborating with product, design, and DevOps professionals.",
  },
];

export function AboutSection() {
  return (
    <section id="about" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-primary text-sm font-medium tracking-wider uppercase">
            About Me
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mt-2">
            My Journey
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Story */}
          <div className="space-y-6">
            <p className="text-lg text-muted-foreground leading-relaxed">
              I&apos;m a Software Developer currently pursuing my Bachelor&apos;s in
              Software Engineering at the European University of Lefke. My
              journey spans across frontend and backend development, with a
              specialization in modern JavaScript frameworks and scalable APIs.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              What sets me apart is my founder experience - building Inscribe, a
              real-world startup product, has given me a unique perspective on
              product development. I understand not just how to write code, but
              why we write it and who we&apos;re writing it for.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              I&apos;m a strong believer in clean code, continuous learning, and
              building software that genuinely helps people. When I&apos;m not
              coding, you&apos;ll find me exploring new technologies or competing in
              hackathons.
            </p>

            <div className="flex flex-wrap gap-3 pt-4">
              <span className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm">
                English (Fluent)
              </span>
              <span className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm">
                Turkish (Beginner)
              </span>
              <span className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm">
                Yoruba (Native)
              </span>
            </div>
          </div>

          {/* Journey Steps */}
          <div className="grid sm:grid-cols-2 gap-6">
            {journeySteps.map((step, index) => (
              <div
                key={index}
                className="group p-6 rounded-xl bg-card border border-border hover:border-primary/50 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <step.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
