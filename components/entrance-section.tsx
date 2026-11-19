import { ArrowUpRight } from "lucide-react";
import { LinkButton } from "@/components/link-button";
import { hero, profile } from "@/lib/content";

const delay = (ms: number) => ({ ["--d" as string]: `${ms}ms` });

/**
 * First screen, four corners: the role and local time along the top, the name
 * (in particles where the form runs, in type elsewhere) across the middle,
 * the headline and actions at the foot.
 */
export function EntranceSection() {
  return (
    <section id="top" data-stop="top" aria-label="Introduction" className="hero">
      <div className="hero-corners mono">
        <p className="enter-fade" style={delay(250)}>
          {profile.role}
          <span className="hidden sm:inline"> · frontend, full-stack, C++</span>
        </p>
        <p className="enter-fade text-right" style={delay(350)}>
          {profile.city} <time data-clock={profile.timeZone}>--:--</time>
        </p>
      </div>

      <h1 className="hero-name">
        <span className="block enter" style={delay(150)}>
          Daniel
        </span>
        <span className="block enter" style={delay(260)}>
          Adegoke
        </span>
      </h1>

      <div className="hero-foot">
        <div>
          <p className="hero-headline">
            <span className="block enter" style={delay(450)}>
              {hero.headline[0]}
            </span>
            <span className="muted block enter" style={delay(560)}>
              {hero.headline[1]}
            </span>
          </p>
          <p className="lead mt-6 max-w-[38rem] text-quiet enter" style={delay(700)}>
            {hero.detail}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3 enter" style={delay(820)}>
            <LinkButton href={profile.resume} download={profile.resumeFileName} magnetic>
              Download CV
            </LinkButton>
            <LinkButton href="#work" variant="outline" icon={<ArrowUpRight aria-hidden="true" className="arrow h-4 w-4 rotate-90" />}>
              See the work
            </LinkButton>
          </div>
        </div>

        <div className="flex flex-col gap-6 lg:items-end lg:text-right">
          <p className="mono flex items-center gap-2.5 text-quiet enter-fade lg:justify-end" style={delay(950)}>
            <span className="status-dot" aria-hidden="true" />
            {profile.status}
          </p>
          <p className="max-w-[22rem] text-sm leading-relaxed text-faint enter-fade" style={delay(1020)}>
            {profile.availability}.
          </p>
          <div className="hidden items-center gap-5 lg:flex enter-fade" style={delay(1100)}>
            <a href={profile.github} target="_blank" rel="noopener noreferrer" className="mono link-grow py-1 text-quiet hover:text-text">
              GitHub
            </a>
            <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="mono link-grow py-1 text-quiet hover:text-text">
              LinkedIn
            </a>
            <a href="#work" className="scroll-cue mono" aria-label="Scroll to the work">
              <i aria-hidden="true" />
              Scroll
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
