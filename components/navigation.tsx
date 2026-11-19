"use client";

import { useEffect, useState } from "react";
import { LinkButton } from "@/components/link-button";
import { profile, sections } from "@/lib/content";

const links = sections.map((section, index) => ({ ...section, number: String(index + 1).padStart(2, "0") })).filter((section) => section.id !== "awards");

export function Navigation() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    const onResize = () => {
      if (window.innerWidth >= 1024) setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [menuOpen]);

  return (
    <header className="nav enter-fade" data-open={menuOpen || undefined} style={{ ["--d" as string]: "0ms" }}>
      <nav aria-label="Main" className="flex h-full items-center justify-between gap-6 px-[var(--gutter)]">
        <a href="#top" className="flex items-baseline gap-2 font-display text-lg font-extrabold tracking-[-0.02em] [font-variation-settings:'wdth'_112]">
          {profile.name}
        </a>

        <div className="hidden items-center gap-8 lg:flex">
          <ul className="flex items-center gap-7">
            {links.map((link) => (
              <li key={link.id}>
                <a href={`#${link.id}`} className="nav-link">
                  {link.label}
                  <sup>{link.number}</sup>
                </a>
              </li>
            ))}
          </ul>
          <LinkButton href={profile.resume} download={profile.resumeFileName} size="sm">
            Download CV
          </LinkButton>
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          className="mono -mr-2 grid h-11 min-w-11 place-items-center px-2 text-[0.8125rem] text-text lg:hidden"
        >
          {menuOpen ? "Close" : "Menu"}
        </button>
      </nav>
      <span aria-hidden="true" className="nav-progress" />

      {menuOpen && (
        <div id="mobile-menu" className="menu-panel lg:hidden">
          <ul className="flex flex-col">
            {links.map((link, index) => (
              <li key={link.id} style={{ ["--i" as string]: index }} className="border-b border-rule">
                <a
                  href={`#${link.id}`}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-baseline justify-between py-3 font-display text-[clamp(2rem,9vw,3rem)] font-extrabold leading-none tracking-[-0.04em] [font-variation-settings:'wdth'_112]"
                >
                  {link.label}
                  <span className="mono text-faint">{link.number}</span>
                </a>
              </li>
            ))}
          </ul>
          <ul>
            <li style={{ ["--i" as string]: links.length }}>
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
