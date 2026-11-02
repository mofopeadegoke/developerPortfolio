import { Github, Linkedin } from "lucide-react";
import { LinkButton } from "@/components/link-button";
import { Room } from "@/components/room";
import { hero, profile } from "@/lib/content";

export function EntranceSection() {
  return (
    <Room stop="top" id="top" aria-label="Introduction" mark="Room 1 of 6, Entrance" className="room-entrance">
      <h1 className="font-display text-[clamp(2.25rem,4vw,3.25rem)] font-extrabold leading-[1] tracking-[-0.02em] [font-stretch:115%]">
        {profile.name}
      </h1>
      <p className="mt-2 text-xl text-quiet">{profile.role}</p>
      <p className="mt-5 text-lg leading-snug">{hero.lead}</p>
      <p className="mt-3 text-quiet">{hero.detail}</p>
      <div className="mt-6 flex flex-wrap items-center gap-2">
        <LinkButton href={profile.resume} download={profile.resumeFileName}>
          Download CV
        </LinkButton>
        <LinkButton href={`mailto:${profile.email}`} variant="outline">
          Email me
        </LinkButton>
        <a href={profile.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="grid h-11 w-11 place-items-center text-quiet transition-colors hover:text-ultramarine">
          <Github className="h-5 w-5" />
        </a>
        <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="grid h-11 w-11 place-items-center text-quiet transition-colors hover:text-ultramarine">
          <Linkedin className="h-5 w-5" />
        </a>
      </div>
      <p className="mt-5 text-sm text-quiet">
        {profile.location}. {profile.availability}.
      </p>
    </Room>
  );
}
