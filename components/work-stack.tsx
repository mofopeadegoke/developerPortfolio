"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Project cards pin one after another on desktop; each one under the newest
 * shrinks a little, like a deck being dealt. Videos play only while their card
 * is on screen.
 */
export function WorkStack({ count, children }: { count: number; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stack = ref.current;
    if (!stack) return;
    const cards = [...stack.querySelectorAll<HTMLElement>(".card")];
    const slots = [...stack.querySelectorAll<HTMLElement>(".stack-slot")];
    const desktop = window.matchMedia("(min-width: 1024px)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

    const videos = [...stack.querySelectorAll<HTMLVideoElement>("video[data-autoplay]")];
    const videoObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const video = entry.target as HTMLVideoElement;
          if (entry.isIntersecting && !reduced.matches) {
            video.preload = "auto";
            video.play().catch(() => {});
          } else video.pause();
        }
      },
      { threshold: 0.25 },
    );
    videos.forEach((video) => {
      video.removeAttribute("autoplay");
      video.pause();
      videoObserver.observe(video);
    });

    let frame = 0;
    const update = () => {
      frame = 0;
      if (!desktop.matches || reduced.matches) {
        cards.forEach((card) => (card.style.transform = ""));
        return;
      }
      const viewport = window.innerHeight;
      cards.forEach((card, i) => {
        // How far the next cards have travelled over this one.
        const next = slots[i + 1];
        if (!next) {
          card.style.transform = "";
          return;
        }
        const top = slots[i].getBoundingClientRect().top;
        const nextTop = next.getBoundingClientRect().top;
        const covered = Math.min(1, Math.max(0, 1 - (nextTop - top) / viewport));
        const depth = Math.min(count - 1 - i, 3);
        const scale = 1 - covered * 0.025 * depth - covered * 0.02;
        card.style.transform = `scale(${scale.toFixed(4)})`;
        card.style.filter = covered > 0.02 ? `brightness(${(1 - covered * 0.35).toFixed(3)})` : "";
      });
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      videoObserver.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [count]);

  return (
    <div ref={ref} className="stack" style={{ ["--count" as string]: count }}>
      {children}
    </div>
  );
}
