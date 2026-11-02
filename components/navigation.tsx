"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useGalleryView } from "@/components/gallery/gallery-stage";
import { LinkButton } from "@/components/link-button";
import { profile } from "@/lib/content";

const links = [
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" },
];

export function Navigation() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { view, toggleView } = useGalleryView();
  const viewLabel = view === "list" ? "Gallery view" : "List view";

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-rule bg-label">
      <nav aria-label="Main" className="flex h-14 items-center justify-between px-[var(--gutter)]">
        <a href="#top" className="font-display text-lg font-extrabold tracking-[-0.01em] [font-stretch:115%]">
          {profile.name}
        </a>

        <div className="hidden items-center gap-5 lg:flex">
          <ul className="flex items-center gap-5">
            {links.map((link) => (
              <li key={link.id}>
                <a href={`#${link.id}`} className="py-2 text-[0.95rem] text-quiet transition-colors hover:text-ink">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <button type="button" onClick={toggleView} className="py-2 text-[0.95rem] font-medium underline decoration-ultramarine underline-offset-4 transition-colors hover:text-ultramarine">
            {viewLabel}
          </button>
          <LinkButton href={profile.resume} download={profile.resumeFileName} className="px-4 py-2 text-sm">
            Download CV
          </LinkButton>
        </div>

        <div className="flex items-center gap-3 lg:hidden">
          <button type="button" onClick={toggleView} className="py-2 text-sm font-medium underline decoration-ultramarine underline-offset-4">
            {viewLabel}
          </button>
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className="grid h-11 w-11 place-items-center"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div id="mobile-menu" className="border-t border-rule lg:hidden">
          <ul className="flex flex-col px-[var(--gutter)] py-3">
            {links.map((link) => (
              <li key={link.id}>
                <a href={`#${link.id}`} onClick={() => setMenuOpen(false)} className="block py-2.5 font-display text-2xl font-bold">
                  {link.label}
                </a>
              </li>
            ))}
            <li className="pt-3 pb-2">
              <LinkButton href={profile.resume} download={profile.resumeFileName} className="w-full">
                Download CV
              </LinkButton>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
