import { profile } from "@/lib/content";

export function Footer() {
  return (
    <footer className="relative z-[1] bg-ground px-[var(--gutter)] py-5 text-sm text-quiet">
      <p>
        {profile.fullName}, {profile.role}. {profile.location}. Revised {profile.revised}.
      </p>
    </footer>
  );
}
