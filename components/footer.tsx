import { profile } from "@/lib/content";

export function Footer() {
  return (
    <footer className="relative z-[1] border-t border-rule bg-ground px-[var(--gutter)] py-6">
      <div className="wrap mono flex flex-col justify-between gap-3 text-faint sm:flex-row">
        <p>
          {profile.fullName}, {profile.role}. Revised {profile.revised}.
        </p>
        <a href="#top" className="link-grow self-start py-1 text-quiet hover:text-text sm:self-auto">
          Back to top
        </a>
      </div>
    </footer>
  );
}
