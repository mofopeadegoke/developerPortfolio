"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import dynamic from "next/dynamic";
import { detectTier, STAGE_QUERY, type Tier } from "@/lib/gallery";
import { Starfield } from "@/components/starfield";

// The page's words are all server-rendered; the 3D stage only ever sits behind
// them, so it loads after the content and nobody waits for it.
const GalleryCanvas = dynamic(() => import("@/components/gallery/gallery-canvas"), { ssr: false });

type GalleryState = { canTunnel: boolean; tunnel: boolean; setTunnel: (on: boolean) => void };

const GalleryContext = createContext<GalleryState>({ canTunnel: false, tunnel: false, setTunnel: () => {} });

export const useGalleryView = () => useContext(GalleryContext);

export function GalleryProvider({ children }: { children: ReactNode }) {
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
    // A window resized below desktop, or a change to the motion setting,
    // switches the form on or off without a reload.
    const queries = [window.matchMedia(STAGE_QUERY), window.matchMedia("(prefers-reduced-motion: reduce)")];
    for (const query of queries) query.addEventListener("change", apply);
    return () => {
      for (const query of queries) query.removeEventListener("change", apply);
    };
  }, []);

  const fallBack = useCallback(() => {
    struggled.current = true;
    document.documentElement.dataset.tier = "still";
    setTier("still");
    setTunnel(false);
  }, []);

  const markReady = useCallback(() => {
    document.documentElement.dataset.stage = "ready";
    setReady(true);
  }, []);

  const canTunnel = tier === "full";
  const value = useMemo(() => ({ canTunnel, tunnel: canTunnel && tunnel, setTunnel }), [canTunnel, tunnel]);

  return (
    <GalleryContext.Provider value={value}>
      <div aria-hidden="true" className="gallery-stage" data-ready={ready || undefined}>
        {canTunnel && <GalleryCanvas tunnel={tunnel} onTunnelEnd={endTunnel} onFallback={fallBack} onReady={markReady} />}
      </div>
      <Starfield />
      {children}
    </GalleryContext.Provider>
  );
}
