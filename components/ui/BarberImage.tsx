"use client";

import { useState, useEffect, useRef } from "react";

interface BarberImageProps {
  src: string | null | undefined;
  alt: string;
  /** Classes applied to the <img> tag (e.g. hover animations) */
  imgClassName?: string;
  /** Classes applied to both the img and the fallback div so the container always matches */
  className?: string;
}

/** Pull 1–2 uppercase initials from a shop name */
function getInitials(name: string): string {
  const words = name.split(/\s+/).filter(w => w.length > 2);
  if (words.length === 0) return name.slice(0, 2).toUpperCase();
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

/** Pick an accent color deterministically from the shop name */
function getAccent(name: string): string {
  const palette = ["#CE1126", "#0072C6", "#B8860B", "#8B1A1A"];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = ((hash << 5) - hash) + name.charCodeAt(i);
    hash |= 0;
  }
  return palette[Math.abs(hash) % palette.length];
}

function ScissorsIcon() {
  return (
    <svg
      width="36"
      height="36"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="6" cy="6" r="3" />
      <circle cx="6" cy="18" r="3" />
      <line x1="20" y1="4" x2="8.12" y2="15.88" />
      <line x1="14.47" y1="14.48" x2="20" y2="20" />
      <line x1="8.12" y1="8.12" x2="12" y2="12" />
    </svg>
  );
}

/** Branded fallback shown when the barbershop photo fails to load */
function BarberFallback({ name, className }: { name: string; className?: string }) {
  const initials = getInitials(name);
  const accent = getAccent(name);

  return (
    <div
      className={`relative flex flex-col items-center justify-center overflow-hidden ${className ?? "w-full h-full"}`}
      style={{ background: "linear-gradient(135deg, #111 0%, #1e1e1e 100%)" }}
    >
      {/* Subtle diagonal stripe texture */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "repeating-linear-gradient(-45deg, transparent, transparent 18px, rgba(255,255,255,0.025) 18px, rgba(255,255,255,0.025) 36px)",
        }}
      />

      {/* Accent bar along the left edge */}
      <div
        className="absolute left-0 top-0 bottom-0 w-[3px]"
        style={{ background: accent }}
      />

      {/* Icon */}
      <div className="text-white/20 mb-3">
        <ScissorsIcon />
      </div>

      {/* Initials */}
      <span
        className="font-black tracking-tighter leading-none select-none"
        style={{ fontSize: "clamp(2rem, 8cqw, 4rem)", color: "rgba(255,255,255,0.85)" }}
      >
        {initials}
      </span>

      {/* Subtle name strip at bottom */}
      <div
        className="absolute bottom-0 left-0 right-0 px-3 py-2 text-[9px] font-bold uppercase tracking-[0.18em] truncate text-center"
        style={{ background: accent, color: "#fff" }}
      >
        {name}
      </div>
    </div>
  );
}

/**
 * Route Google Places photo URLs through our server-side proxy so the API key
 * referrer restrictions never block the image (works on localhost and production).
 */
function toProxiedSrc(src: string): string {
  if (src.startsWith("https://maps.googleapis.com/maps/api/place/photo")) {
    return `/api/photo?url=${encodeURIComponent(src)}`;
  }
  return src;
}

/**
 * Drop-in replacement for <img> that:
 * - Routes Google Places photos through a server-side proxy (fixes referrer blocks)
 * - Gracefully falls back to a branded Antigua Barbers placeholder on any error
 *
 * Usage:
 *   <BarberImage src={barber.images?.[0]} alt={barber.name} className="w-full h-full object-cover" />
 */
export function BarberImage({ src, alt, imgClassName, className }: BarberImageProps) {
  const [failed, setFailed] = useState(!src);
  const imgRef = useRef<HTMLImageElement>(null);

  // Catch images that failed before React hydration attached the onError handler.
  // If the img is already `complete` with naturalWidth === 0, the load failed silently.
  useEffect(() => {
    const el = imgRef.current;
    if (el && el.complete && el.naturalWidth === 0) {
      setFailed(true);
    }
  }, []);

  if (failed) {
    return <BarberFallback name={alt} className={className} />;
  }

  const proxiedSrc = toProxiedSrc(src!);

  return (
    <img
      ref={imgRef}
      src={proxiedSrc}
      alt={alt}
      className={imgClassName ?? className}
      onError={() => setFailed(true)}
    />
  );
}
