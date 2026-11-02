"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import dynamic from "next/dynamic";
import { detectTier, type Tier } from "@/lib/gallery";

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

  const markReady = useCallback(() => {
    document.documentElement.dataset.stage = "ready";
    setReady(true);
  }, []);

  const value = useMemo(() => ({ view, toggleView }), [view, toggleView]);
  const showCanvas = view === "gallery" && tier !== null && tier !== "still";

  return (
    <GalleryContext.Provider value={value}>
      <div aria-hidden="true" className="gallery-stage" data-ready={ready || undefined}>
        {showCanvas && <GalleryCanvas tier={tier} onFallback={fallBack} onReady={markReady} />}
      </div>
      {children}
    </GalleryContext.Provider>
  );
}
