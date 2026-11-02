"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import dynamic from "next/dynamic";
import { caseLayout, detectTier, stops, type Tier } from "@/lib/gallery";

// The page's words are all server-rendered; the 3D stage only ever sits behind
// them, so it loads after the content and nobody waits for it.
const GalleryCanvas = dynamic(() => import("@/components/gallery/gallery-canvas"), { ssr: false });

type View = "gallery" | "list";

const GalleryContext = createContext<{ view: View; toggleView: () => void }>({ view: "gallery", toggleView: () => {} });

export const useGalleryView = () => useContext(GalleryContext);

export function GalleryProvider({ children }: { children: ReactNode }) {
  const [view, setView] = useState<View>("gallery");
  const [tier, setTier] = useState<Tier | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const detected = detectTier();
    const initial = document.documentElement.dataset.view === "list" ? "list" : "gallery";
    document.documentElement.dataset.tier = detected;
    setTier(detected);
    setView(initial);
  }, []);

  // Still images have no scene to measure, so the hairlines are placed from the
  // same layout the images were captured with.
  useEffect(() => {
    if (tier !== "still") return;
    const place = () => {
      for (const stop of stops) {
        const { tie } = caseLayout(stop, window.innerWidth, window.innerHeight, false);
        document.querySelector<HTMLElement>(`[data-stop="${stop.id}"]`)?.style.setProperty("--tie", `${tie}px`);
      }
    };
    place();
    window.addEventListener("resize", place);
    return () => window.removeEventListener("resize", place);
  }, [tier]);

  const toggleView = useCallback(() => {
    setView((current) => {
      const next = current === "list" ? "gallery" : "list";
      document.documentElement.dataset.view = next;
      try {
        localStorage.setItem("gallery-view", next);
      } catch {
        // Storage can be blocked; the view still changes for this visit.
      }
      return next;
    });
  }, []);

  const fallBack = useCallback(() => {
    document.documentElement.dataset.tier = "still";
    setTier("still");
  }, []);

  const value = useMemo(() => ({ view, toggleView }), [view, toggleView]);
  const showCanvas = view === "gallery" && tier !== null && tier !== "still";

  return (
    <GalleryContext.Provider value={value}>
      <div aria-hidden="true" className="gallery-stage" data-ready={ready || undefined}>
        {showCanvas && <GalleryCanvas tier={tier} onFallback={fallBack} onReady={() => setReady(true)} />}
      </div>
      {children}
    </GalleryContext.Provider>
  );
}
