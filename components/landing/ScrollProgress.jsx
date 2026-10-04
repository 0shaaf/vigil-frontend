"use client";

import { useEffect, useState } from "react";

export default function ScrollProgress() {
  const [scrollPercent, setScrollPercent] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll <= 0) return;
      const current = window.scrollY;
      const pct = Math.min(100, Math.max(0, Math.round((current / totalScroll) * 100)));
      setScrollPercent(pct);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Determine atmospheric zone based on scroll
  let zone = "HORIZON : DUSK";
  let zoneColor = "#ff7700";
  if (scrollPercent > 20 && scrollPercent <= 45) {
    zone = "CALAMITY : TWILIGHT";
    zoneColor = "#ff3b19";
  } else if (scrollPercent > 45 && scrollPercent <= 75) {
    zone = "PROTOCOL : MIDNIGHT";
    zoneColor = "#ca1b00";
  } else if (scrollPercent > 75) {
    zone = "BREACH : OBSIDIAN";
    zoneColor = "#f43f5e";
  }

  return (
    <aside
      className="fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col items-center gap-3 select-none pointer-events-none"
      aria-hidden="true"
    >
      {/* Top Telemetry Tag */}
      <span
        className="text-[9px] font-mono tracking-widest uppercase transition-colors duration-500 origin-bottom-right -rotate-90 translate-y-8"
        style={{ color: zoneColor }}
      >
        {zone}
      </span>

      {/* Progress Track */}
      <div className="w-[2px] h-40 bg-white/10 rounded-full relative overflow-hidden backdrop-blur-sm mt-8">
        <div
          className="w-full bg-gradient-to-b from-[#ffaa00] via-[#ff3b19] to-[#990011] transition-all duration-150 rounded-full"
          style={{
            height: `${scrollPercent}%`,
            boxShadow: `0 0 12px ${zoneColor}`,
          }}
        />
      </div>

      {/* Numerical Coordinate */}
      <div className="font-mono text-[10px] text-white/50 tracking-tighter">
        {scrollPercent.toString().padStart(2, "0")}%
      </div>

      {/* Pulse Beacon Indicator */}
      <div className="relative flex items-center justify-center">
        <span
          className="w-2 h-2 rounded-full transition-colors duration-500"
          style={{ backgroundColor: zoneColor }}
        />
        <span
          className="absolute w-4 h-4 rounded-full animate-ping opacity-60 transition-colors duration-500"
          style={{ backgroundColor: zoneColor }}
        />
      </div>
    </aside>
  );
}
