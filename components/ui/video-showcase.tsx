"use client";

import { useRef, useState, useEffect } from "react";
import type { VideoAsset } from "@/lib/data/videos";

interface Props {
  videos: VideoAsset[];
  /** Dark background (navy) or light (cream). Defaults to light. */
  dark?: boolean;
}

export function VideoShowcase({ videos, dark = false }: Props) {
  const [active, setActive] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  const [playing, setPlaying] = useState(true);

  // Swap src when active index changes
  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    el.load();
    if (playing) el.play().catch(() => {});
  }, [active]); // eslint-disable-line react-hooks/exhaustive-deps

  function toggleMute() {
    if (!videoRef.current) return;
    videoRef.current.muted = !muted;
    setMuted(!muted);
  }

  function togglePlay() {
    const el = videoRef.current;
    if (!el) return;
    if (el.paused) { el.play(); setPlaying(true); }
    else { el.pause(); setPlaying(false); }
  }

  if (!videos.length) return null;
  const current = videos[active];

  return (
    <div className={dark ? "text-cream" : "text-navy"}>
      <p className={`text-[10px] font-semibold uppercase tracking-[0.32em] mb-6 ${dark ? "text-gold" : "text-gold"}`}>
        See it in motion
      </p>

      {/* Main video player */}
      <div className="relative overflow-hidden bg-black aspect-video w-full">
        <video
          ref={videoRef}
          key={current.src}
          autoPlay
          muted={muted}
          loop
          playsInline
          poster={current.poster}
          className="w-full h-full object-cover"
        >
          <source src={current.src} type="video/mp4" />
        </video>

        {/* Caption overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-5 pb-4 pt-10">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-gold">{current.title}</p>
          <p className="mt-0.5 text-[12px] text-cream/70">{current.location}</p>
        </div>

        {/* Controls */}
        <div className="absolute top-3 right-3 flex gap-2">
          <button
            onClick={togglePlay}
            aria-label={playing ? "Pause" : "Play"}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm hover:bg-black/70 transition-colors"
          >
            {playing ? (
              <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5">
                <rect x="3" y="2" width="3.5" height="12" rx="1" />
                <rect x="9.5" y="2" width="3.5" height="12" rx="1" />
              </svg>
            ) : (
              <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5">
                <path d="M4 2.5l10 5.5-10 5.5V2.5z" />
              </svg>
            )}
          </button>
          <button
            onClick={toggleMute}
            aria-label={muted ? "Unmute" : "Mute"}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm hover:bg-black/70 transition-colors"
          >
            {muted ? (
              <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5">
                <path d="M8 2L4 5.5H1v5h3l4 3.5V2zM11.5 6.5L14 9m0-2.5L11.5 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
              </svg>
            ) : (
              <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5">
                <path d="M8 2L4 5.5H1v5h3l4 3.5V2z"/>
                <path d="M11 5.5a4 4 0 010 5M13 3.5a7 7 0 010 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Thumbnail switcher — only shown when there are multiple videos */}
      {videos.length > 1 && (
        <div className="mt-3 grid gap-2" style={{ gridTemplateColumns: `repeat(${videos.length}, 1fr)` }}>
          {videos.map((v, i) => (
            <button
              key={v.id}
              onClick={() => setActive(i)}
              className={`group relative aspect-video overflow-hidden transition-all ${
                i === active ? "ring-2 ring-gold" : "opacity-60 hover:opacity-90"
              }`}
            >
              <video
                src={v.src}
                muted
                playsInline
                preload="metadata"
                poster={v.poster}
                className="w-full h-full object-cover pointer-events-none"
              />
              <div className="absolute inset-0 bg-black/20" />
              <p className="absolute bottom-1.5 left-2 text-[9px] font-semibold uppercase tracking-wider text-white leading-none">
                {v.title}
              </p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
