import { SectionHeading } from "@/components/section-heading";
import { skillGroups } from "@/lib/content";

export function SkillsSection() {
  return (
    <section id="skills" aria-labelledby="skills-heading" className="py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading id="skills" title="Skills" intro="Where there's a note, it's where I used the skill in production or in a shipped project." />

        <div className="grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {skillGroups.map((group) => (
            <section key={group.name} aria-label={group.name} className="border-t border-ink pt-4">
              <h3 className="font-display text-2xl font-semibold">{group.name}</h3>
              <ul className="mt-4 space-y-2.5">
                {group.skills.map((skill) => (
                  <li key={skill.name} className="flex flex-wrap items-baseline justify-between gap-x-3 border-b border-dashed border-rule pb-2.5">
                    <span>{skill.name}</span>
                    {skill.usedIn && <span className="text-sm text-pencil">{skill.usedIn}</span>}
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
