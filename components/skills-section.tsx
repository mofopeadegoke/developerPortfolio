import { Room } from "@/components/room";
import { ArrowUpRight } from "lucide-react";
import { aiFluency, skillGroups } from "@/lib/content";

export function SkillsSection() {
  return (
    <Room stop="skills" id="skills" aria-labelledby="skills-heading" size="wide">
      <h2 id="skills-heading" className="font-display text-4xl font-extrabold tracking-[-0.02em] [font-stretch:115%]">
        Skills
      </h2>
      <p className="mt-4 text-lg leading-snug">
        <a href={aiFluency.href} target="_blank" rel="noopener noreferrer" className="underline decoration-copper transition-colors hover:text-amber">
          <span className="font-semibold">{aiFluency.result}</span> {aiFluency.text}
          <ArrowUpRight className="ml-1 inline h-4 w-4 align-[-0.125em]" aria-label="(opens my certifications on LinkedIn)" />
        </a>
      </p>
      <p className="mt-3 text-quiet">Where there&apos;s a note, it&apos;s where I used the skill in production or in a shipped project.</p>
      <div className="mt-8 grid gap-x-8 gap-y-9 sm:grid-cols-2">
        {skillGroups.map((group) => (
          <section key={group.name} aria-label={group.name}>
            <h3 className="font-display text-xl font-bold">{group.name}</h3>
            <ul className="mt-2">
              {group.skills.map((skill) => (
                <li key={skill.name} className="border-b border-rule py-1.5">
                  <span className="block">{skill.name}</span>
                  {skill.usedIn && <span className="block text-sm text-quiet">{skill.usedIn}</span>}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </Room>
  );
}
