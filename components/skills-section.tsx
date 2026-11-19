import { ArrowUpRight } from "lucide-react";
import { ProofFigure, SectionHead } from "@/components/section-parts";
import { aiFluency, skillGroups } from "@/lib/content";

export function SkillsSection() {
  return (
    <section id="skills" aria-labelledby="skills-heading" className="section">
      <div className="wrap">
        <SectionHead id="skills">
          <a href={aiFluency.href} target="_blank" rel="noopener noreferrer" className="link text-text">
            <span className="font-semibold">{aiFluency.result}</span> {aiFluency.text}
            <ArrowUpRight className="ml-1 inline h-4 w-4 align-[-0.125em]" aria-label="(opens my certifications on LinkedIn)" />
          </a>
          <span className="mt-3 block">Each note says where I used the skill in production or in a shipped project.</span>
        </SectionHead>
        <ProofFigure id="skills" />
        <div className="grid gap-x-8 gap-y-8 border-t border-rule pt-8 sm:grid-cols-2 sm:gap-y-12 sm:pt-10 xl:grid-cols-4" data-stagger="110">
          {skillGroups.map((group) => (
            <section key={group.name} aria-label={group.name} data-reveal>
              <h3 className="mono text-faint">{group.name}</h3>
              <ul className="mt-3 grid grid-cols-2 gap-x-4 sm:mt-4 sm:block">
                {group.skills.map((skill) => (
                  <li key={skill.name} className="border-b border-rule py-2.5 sm:py-3">
                    <span className="block font-medium">{skill.name}</span>
                    {skill.usedIn && <span className="mt-0.5 block text-sm text-faint">{skill.usedIn}</span>}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </section>
  );
}
