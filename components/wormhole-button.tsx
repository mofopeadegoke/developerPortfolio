"use client";

import { useGalleryView } from "@/components/gallery/gallery-stage";

/** The fly-through never plays on its own: visitors choose it here. */
export function WormholeButton() {
  const { canTunnel, tunnel, setTunnel } = useGalleryView();
  if (!canTunnel) return null;
  return (
    <button
      type="button"
      onClick={() => setTunnel(!tunnel)}
      aria-pressed={tunnel}
      className="mt-5 inline-flex items-center gap-2 border border-copper px-4 py-2.5 text-sm font-medium transition-colors hover:bg-copper hover:text-ground"
    >
      {tunnel ? "Leave the wormhole" : "Enter the wormhole"}
    </button>
  );
}
