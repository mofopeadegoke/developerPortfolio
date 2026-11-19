"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight, Check, Copy } from "lucide-react";
import { LinkButton } from "@/components/link-button";
import { SectionHead } from "@/components/section-parts";
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

  const links = [
    { label: "GitHub", href: profile.github },
    { label: "LinkedIn", href: profile.linkedin },
  ];

  return (
    <section id="contact" aria-labelledby="contact-heading" className="section flex min-h-[100svh] flex-col pb-10">
      <div className="wrap flex flex-1 flex-col">
        <SectionHead id="contact">Email is the fastest way to reach me, for a role, a contract or a question about the work.</SectionHead>

        <div className="my-auto py-10">
          <p className="mono mb-5 text-faint" data-reveal>
            Write to
          </p>
          <p data-reveal style={{ ["--d" as string]: "100ms" }}>
            <a href={`mailto:${profile.email}`} className="mega-email link-grow pb-[0.06em] transition-colors hover:text-amber">
              {profile.email}
            </a>
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-3" data-reveal style={{ ["--d" as string]: "220ms" }}>
            <button type="button" onClick={copyEmail} className="btn btn-outline">
              {copied ? <Check className="h-4 w-4" aria-hidden="true" /> : <Copy className="h-4 w-4" aria-hidden="true" />}
              {copied ? "Copied" : "Copy email"}
            </button>
            <LinkButton href={profile.resume} download={profile.resumeFileName} magnetic>
              Download CV
            </LinkButton>
            <span role="status" className="sr-only">
              {copied ? "Email address copied" : ""}
            </span>
          </div>
        </div>

        <div className="grid gap-6 border-t border-rule pt-6 sm:grid-cols-3" data-reveal>
          <p className="mono text-faint">
            {profile.city},{" "}
            <time data-clock={profile.timeZone} data-clock-relative>
              --:--
            </time>
          </p>
          <p className="max-w-[24rem] text-sm text-faint sm:col-span-1">{profile.availability}.</p>
          <ul className="flex gap-6 sm:justify-end">
            {links.map((link) => (
              <li key={link.label}>
                <a href={link.href} target="_blank" rel="noopener noreferrer" className="link inline-flex items-center gap-1">
                  {link.label}
                  <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
