"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import dynamic from "next/dynamic";
import { detectTier, STAGE_QUERY, type Tier } from "@/lib/gallery";

// The page's words are all server-rendered; the 3D stage only ever sits behind
// them, so it loads after the content and nobody waits for it.
const GalleryCanvas = dynamic(() => import("@/components/gallery/gallery-canvas"), { ssr: false });

type View = "gallery" | "list";

type GalleryState = { view: View; toggleView: () => void; canTunnel: boolean; tunnel: boolean; setTunnel: (on: boolean) => void };

const GalleryContext = createContext<GalleryState>({ view: "gallery", toggleView: () => {}, canTunnel: false, tunnel: false, setTunnel: () => {} });

export const useGalleryView = () => useContext(GalleryContext);

export function GalleryProvider({ children }: { children: ReactNode }) {
  const [view, setView] = useState<View>("gallery");
  const [tier, setTier] = useState<Tier | null>(null);
  const [ready, setReady] = useState(false);
  const [tunnel, setTunnel] = useState(false);
  // Once the device has struggled, the form stays off for the rest of the visit.
  const struggled = useRef(false);

  useEffect(() => {
    if (!tunnel) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setTunnel(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [tunnel]);

  const endTunnel = useCallback(() => setTunnel(false), []);

  useEffect(() => {
    const apply = () => {
      const detected = struggled.current ? "still" : detectTier();
      document.documentElement.dataset.tier = detected;
      setTier(detected);
    };
    apply();
    setView(document.documentElement.dataset.view === "list" ? "list" : "gallery");
    // A window resized below desktop, or a change to the motion setting,
    // switches the form on or off without a reload.
    const queries = [window.matchMedia(STAGE_QUERY), window.matchMedia("(prefers-reduced-motion: reduce)")];
    for (const query of queries) query.addEventListener("change", apply);
    return () => {
      for (const query of queries) query.removeEventListener("change", apply);
    };
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
    struggled.current = true;
    document.documentElement.dataset.tier = "still";
    setTier("still");
  }, []);

  const markReady = useCallback(() => {
    document.documentElement.dataset.stage = "ready";
    setReady(true);
  }, []);

  const canTunnel = view === "gallery" && tier === "full";
  const value = useMemo(() => ({ view, toggleView, canTunnel, tunnel, setTunnel }), [view, toggleView, canTunnel, tunnel]);
  const showCanvas = view === "gallery" && tier === "full";

  return (
    <GalleryContext.Provider value={value}>
      <div aria-hidden="true" className="gallery-stage" data-ready={ready || undefined}>
        {showCanvas && <GalleryCanvas tunnel={tunnel} onTunnelEnd={endTunnel} onFallback={fallBack} onReady={markReady} />}
      </div>
      {children}
    </GalleryContext.Provider>
  );
}
