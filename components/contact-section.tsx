"use client";

import { useEffect, useState } from "react";
import { Check, Copy, Download, Github, Linkedin } from "lucide-react";
import { Room } from "@/components/room";
import { profile } from "@/lib/content";

export function ContactSection() {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [copied]);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  };

  const secondaryLinks = [
    { label: "GitHub", href: profile.github, icon: Github, external: true },
    { label: "LinkedIn", href: profile.linkedin, icon: Linkedin, external: true },
    { label: "Download CV", href: profile.resume, icon: Download, external: false },
  ];

  return (
    <Room stop="contact" id="contact" aria-labelledby="contact-heading">
      <h2 id="contact-heading" className="font-display text-4xl font-extrabold tracking-[-0.02em] [font-stretch:115%]">
        Contact
      </h2>
      <p className="mt-3 text-quiet">{profile.availability}. Email is the fastest way to reach me.</p>
      <a href={`mailto:${profile.email}`} className="mt-6 block font-display text-[clamp(1.25rem,2.4vw,1.625rem)] font-bold break-all underline decoration-copper decoration-2 transition-colors hover:text-amber">
        {profile.email}
      </a>
      <button type="button" onClick={copyEmail} className="mt-4 inline-flex items-center gap-2 border border-copper px-4 py-2.5 text-sm font-medium transition-colors hover:bg-copper hover:text-ground">
        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        {copied ? "Copied" : "Copy email"}
      </button>
      <span role="status" className="sr-only">
        {copied ? "Email address copied" : ""}
      </span>
      <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
        {secondaryLinks.map(({ label, href, icon: Icon, external }) => (
          <li key={label}>
            <a
              href={href}
              {...(external ? { target: "_blank", rel: "noopener noreferrer" } : { download: profile.resumeFileName })}
              className="inline-flex items-center gap-2 text-quiet transition-colors hover:text-amber"
            >
              <Icon className="h-5 w-5" />
              {label}
            </a>
          </li>
        ))}
      </ul>
    </Room>
  );
}
