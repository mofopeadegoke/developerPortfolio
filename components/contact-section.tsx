"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, Copy, Download, Github, Linkedin } from "lucide-react";
import { SectionHeading } from "@/components/section-heading";
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
    <section id="contact" aria-labelledby="contact-heading" className="py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading id="contact" title="Contact" intro={`${profile.availability}. Email is the fastest way to reach me.`} />

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
          <a
            href={`mailto:${profile.email}`}
            className="font-display text-[clamp(2rem,6.5vw,4.5rem)] font-semibold leading-none tracking-tight break-all underline decoration-redline decoration-2 underline-offset-[0.12em] transition-colors hover:text-redline sm:break-normal"
          >
            {profile.email}
          </a>
          <button
            type="button"
            onClick={copyEmail}
            className="inline-flex w-fit items-center gap-2 rounded-[3px] border border-ink px-4 py-2 text-sm font-medium transition-colors hover:bg-ink hover:text-paper"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={copied ? "copied" : "copy"}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.15 }}
                className="inline-flex items-center gap-2"
              >
                {copied ? <Check className="h-4 w-4 text-redline" /> : <Copy className="h-4 w-4" />}
                {copied ? "Copied" : "Copy email"}
              </motion.span>
            </AnimatePresence>
          </button>
          <span role="status" className="sr-only">
            {copied ? "Email address copied" : ""}
          </span>
        </div>

        <ul className="mt-12 flex flex-wrap gap-x-8 gap-y-3 border-t border-rule pt-6">
          {secondaryLinks.map(({ label, href, icon: Icon, external }) => (
            <li key={label}>
              <a
                href={href}
                {...(external
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : { download: profile.resumeFileName })}
                className="inline-flex items-center gap-2 text-lg text-pencil transition-colors hover:text-redline"
              >
                <Icon className="h-5 w-5" />
                {label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
