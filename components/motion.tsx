"use client";

import { useEffect } from "react";

/**
 * The page's motion layer. Everything it animates is already visible in the
 * server-rendered HTML; this only hides things once it is running (the `js`
 * class), so a failed script never leaves a blank page.
 *
 * - Reveals: `[data-reveal]` rises in once when it enters the viewport.
 *   `[data-split]` headings rise word by word out of a mask.
 * - Count-up: `[data-count]` rolls up from zero to the value already in the HTML.
 * - Smooth wheel: momentum on wheel scrolling, desktop with a fine pointer only.
 * - Magnetic: `[data-magnetic]` drifts a few pixels toward the cursor.
 * - Clocks: `[data-clock]` shows the time in Famagusta.
 */
export function Motion() {
  useEffect(() => {
    const root = document.documentElement;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const cleanups: (() => void)[] = [];

    // Split headings into masked words before anything is hidden.
    document.querySelectorAll<HTMLElement>("[data-split]").forEach((el) => {
      if (el.dataset.splitDone) return;
      el.dataset.splitDone = "1";
      const label = el.textContent?.replace(/\s+/g, " ").trim() ?? "";
      let i = 0;
      const walk = (node: Node) => {
        [...node.childNodes].forEach((child) => {
          if (child.nodeType === Node.ELEMENT_NODE) return walk(child);
          if (child.nodeType !== Node.TEXT_NODE) return;
          const frag = document.createDocumentFragment();
          (child.textContent ?? "").split(/(\s+)/).forEach((part) => {
            if (!part) return;
            if (/^\s+$/.test(part)) return frag.append(" ");
            const outer = document.createElement("span");
            outer.className = "sw-o";
            const inner = document.createElement("span");
            inner.className = "sw-i";
            inner.textContent = part;
            inner.style.setProperty("--i", String(i++));
            outer.append(inner);
            frag.append(outer);
          });
          child.replaceWith(frag);
        });
      };
      walk(el);
      if (!el.getAttribute("aria-label") && el.tagName !== "H1") el.setAttribute("aria-label", label);
    });

    root.classList.add("js");

    // Stagger groups: each [data-reveal] child gets its own delay.
    document.querySelectorAll<HTMLElement>("[data-stagger]").forEach((group) => {
      const step = Number(group.dataset.stagger) || 90;
      const base = Number(group.dataset.staggerBase) || 0;
      group.querySelectorAll<HTMLElement>(":scope > [data-reveal]").forEach((el, i) => {
        el.style.setProperty("--d", `${base + i * step}ms`);
      });
    });

    const countUp = (el: HTMLElement) => {
      const to = Number(el.dataset.count);
      const decimals = Number(el.dataset.decimals || 0);
      const prefix = el.dataset.prefix ?? "";
      const suffix = el.dataset.suffix ?? "";
      const grouping = to >= 10000;
      const format = (value: number) =>
        prefix + value.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals, useGrouping: grouping }) + suffix;
      if (reduced) return;
      // Years count from a nearby year, not from zero.
      const from = to > 1900 && to < 2100 ? to - 12 : 0;
      const start = performance.now();
      const duration = 1600;
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - t, 3);
        el.textContent = format(from + (to - from) * eased);
        if (t < 1) requestAnimationFrame(tick);
      };
      el.textContent = format(from);
      requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const el = entry.target as HTMLElement;
          el.classList.add("is-in");
          if (el.dataset.count) countUp(el);
          observer.unobserve(el);
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
    );
    document.querySelectorAll("[data-reveal], [data-split], [data-count]").forEach((el) => {
      // The hero plays on load instead, from CSS.
      if (el.closest(".hero")) return;
      observer.observe(el);
    });
    cleanups.push(() => observer.disconnect());

    // Hero headline: masked words rise once the first frame has painted.
    requestAnimationFrame(() => requestAnimationFrame(() => document.querySelectorAll(".hero [data-split]").forEach((el) => el.classList.add("is-in"))));

    // Famagusta clock, minute precision.
    const clocks = [...document.querySelectorAll<HTMLElement>("[data-clock]")];
    if (clocks.length) {
      const zone = clocks[0].dataset.clock || "Europe/Nicosia";
      const formatter = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: zone });
      const offset = () => {
        const now = new Date();
        const there = new Date(now.toLocaleString("en-US", { timeZone: zone }));
        const here = new Date(now.toLocaleString("en-US"));
        return Math.round((there.getTime() - here.getTime()) / 3600000);
      };
      const update = () => {
        const time = formatter.format(new Date());
        const diff = offset();
        for (const clock of clocks) {
          const relative = clock.dataset.clockRelative !== undefined;
          clock.textContent =
            relative && diff !== 0 ? `${time}, ${Math.abs(diff)} hour${Math.abs(diff) === 1 ? "" : "s"} ${diff > 0 ? "ahead of" : "behind"} you` : time;
        }
      };
      update();
      const timer = window.setInterval(update, 15000);
      cleanups.push(() => window.clearInterval(timer));
    }

    // Scroll progress for the hairline under the navigation.
    let progressFrame = 0;
    const progress = () => {
      progressFrame = 0;
      const max = root.scrollHeight - window.innerHeight;
      root.style.setProperty("--progress", String(max > 0 ? window.scrollY / max : 0));
      root.toggleAttribute("data-scrolled", window.scrollY > 24);
    };
    const onScroll = () => {
      if (!progressFrame) progressFrame = requestAnimationFrame(progress);
    };
    progress();
    window.addEventListener("scroll", onScroll, { passive: true });
    cleanups.push(() => window.removeEventListener("scroll", onScroll));

    if (!reduced && fine) {
      // Magnetic buttons.
      document.querySelectorAll<HTMLElement>("[data-magnetic]").forEach((el) => {
        const strength = Number(el.dataset.magnetic) || 0.25;
        const move = (event: PointerEvent) => {
          const box = el.getBoundingClientRect();
          const x = event.clientX - (box.left + box.width / 2);
          const y = event.clientY - (box.top + box.height / 2);
          el.style.transform = `translate3d(${x * strength}px, ${y * strength}px, 0)`;
        };
        const leave = () => {
          el.style.transform = "";
        };
        el.addEventListener("pointermove", move);
        el.addEventListener("pointerleave", leave);
        cleanups.push(() => {
          el.removeEventListener("pointermove", move);
          el.removeEventListener("pointerleave", leave);
        });
      });

      // Smooth wheel: the page glides toward where the wheel points.
      let target = window.scrollY;
      let current = window.scrollY;
      let frame = 0;
      const step = () => {
        current += (target - current) * 0.12;
        if (Math.abs(target - current) < 0.5) current = target;
        window.scrollTo({ top: current, behavior: "instant" });
        frame = current === target ? 0 : requestAnimationFrame(step);
      };
      const onWheel = (event: WheelEvent) => {
        if (event.ctrlKey || event.defaultPrevented) return;
        // Let anything that scrolls on its own keep the wheel.
        const scroller = (event.target as Element).closest?.("[data-native-scroll]");
        if (scroller) return;
        event.preventDefault();
        if (!frame) current = target = window.scrollY;
        const unit = event.deltaMode === 1 ? 40 : event.deltaMode === 2 ? window.innerHeight : 1;
        const max = root.scrollHeight - window.innerHeight;
        target = Math.max(0, Math.min(max, target + event.deltaY * unit));
        if (!frame) frame = requestAnimationFrame(step);
      };
      // Keyboard, scrollbar and anchor jumps take over from the glide.
      const sync = () => {
        if (!frame) current = target = window.scrollY;
      };
      const stop = () => {
        cancelAnimationFrame(frame);
        frame = 0;
        sync();
      };
      window.addEventListener("wheel", onWheel, { passive: false });
      window.addEventListener("scroll", sync, { passive: true });
      window.addEventListener("keydown", stop);
      window.addEventListener("pointerdown", stop);
      document.addEventListener("click", (event) => {
        if ((event.target as Element).closest?.('a[href^="#"]')) stop();
      });
      root.dataset.smooth = "";
      cleanups.push(() => {
        cancelAnimationFrame(frame);
        window.removeEventListener("wheel", onWheel);
        window.removeEventListener("scroll", sync);
        window.removeEventListener("keydown", stop);
        window.removeEventListener("pointerdown", stop);
        delete root.dataset.smooth;
      });
    }

    return () => cleanups.forEach((cleanup) => cleanup());
  }, []);

  return null;
}
