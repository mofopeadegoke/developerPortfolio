"use client";

import { useEffect, useRef } from "react";
import { useGalleryView } from "@/components/gallery/gallery-stage";

/** The fly-through never plays on its own: visitors choose it here. */
export function WormholeButton() {
  const { canTunnel, tunnel, setTunnel } = useGalleryView();
  const button = useRef<HTMLButtonElement>(null);

  // The tunnel belongs to the card that offers it: once the button scrolls out
  // of view, the tunnel ends.
  useEffect(() => {
    const element = button.current;
    if (!tunnel || !element) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) setTunnel(false);
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, [tunnel, setTunnel]);

  if (!canTunnel) return null;
  return (
    <button ref={button} type="button" onClick={() => setTunnel(!tunnel)} aria-pressed={tunnel} className="btn btn-outline">
      {tunnel ? "Leave the wormhole" : "Enter the wormhole"}
    </button>
  );
}
