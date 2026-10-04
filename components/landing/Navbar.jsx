"use client";

import { useState, useEffect } from "react";
import { Menu, X, ArrowRight } from "lucide-react";

export default function Navbar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Trigger collapse when the user scrolls just a few units (e.g., 40px)
      const shouldCollapse = window.scrollY > 40;
      setIsCollapsed(shouldCollapse);
      if (!shouldCollapse) {
        setMenuOpen(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  return (
    <div
      id="vigil-unified-navbar"
      className="fixed top-4 sm:top-6 left-1/2 z-50 pointer-events-none"
      style={{
        transform: isCollapsed
          ? "translateX(calc(50vw - var(--dock-right-offset, 1.5rem) - 100%))"
          : "translateX(-50%)",
        width: isCollapsed
          ? "236px"
          : "min(calc(100vw - 2rem), 1280px)",
        transition:
          "transform 500ms cubic-bezier(0.16, 1, 0.3, 1), width 500ms cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      <header
        className={`pointer-events-auto relative w-full rounded-full flex items-center transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] backdrop-blur-xl backdrop-saturate-150 ${
          isCollapsed
            ? "bg-black/65 text-white border border-white/25 shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.25)] pl-2 pr-2.5 py-1.5 justify-end gap-2.5"
            : "bg-black/60 text-white border border-white/20 shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.2)] px-5 sm:px-8 py-3.5 justify-between"
        }`}
      >
        {/* Brand (Visible only when expanded - doubled size) */}
        <a
          href="#"
          className={`flex items-center gap-3.5 group shrink-0 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            isCollapsed
              ? "opacity-0 max-w-0 pointer-events-none overflow-hidden"
              : "opacity-100 max-w-[300px]"
          }`}
        >
          <div className="w-5 h-5 sm:w-6 sm:h-6 bg-[#ff3b19] rotate-45 group-hover:scale-110 transition-transform shrink-0" />
          <span className="font-['Space_Grotesk'] text-2xl sm:text-3xl font-extrabold tracking-tight text-white whitespace-nowrap">
            VIGIL
          </span>
        </a>

        {/* Center Nav Links (Visible only when expanded on desktop) */}
        <nav
          className={`hidden md:flex items-center gap-8 text-xs font-semibold uppercase tracking-wider text-white/80 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            isCollapsed
              ? "opacity-0 max-w-0 pointer-events-none overflow-hidden"
              : "opacity-100 max-w-xl"
          }`}
        >
          <a
            href="#lone-worker"
            className="hover:text-[#ff3b19] transition-colors whitespace-nowrap"
          >
            Lone Workers
          </a>
          <a
            href="#seniors"
            className="hover:text-[#ff3b19] transition-colors whitespace-nowrap"
          >
            Family &amp; Seniors
          </a>
          <a
            href="#business"
            className="hover:text-[#ff3b19] transition-colors whitespace-nowrap"
          >
            Business
          </a>
          <a
            href="#actions"
            className="hover:text-[#ff3b19] transition-colors whitespace-nowrap"
          >
            Actions
          </a>
        </nav>

        {/* Right Section: Dock items or Full CTA */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Item 1 of Collapsed Dock: Hamburger Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle navigation menu"
            className={`w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 backdrop-blur-md text-white flex items-center justify-center transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] shrink-0 ${
              isCollapsed
                ? "opacity-100 scale-100 pointer-events-auto"
                : "opacity-0 scale-75 w-0 pointer-events-none overflow-hidden"
            }`}
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>

          {/* Item 2 of Collapsed Dock / Full CTA: "Set Up Check-In" Button */}
          <a
            href="#actions"
            onClick={() => setMenuOpen(false)}
            className={`inline-flex items-center gap-1.5 font-bold uppercase tracking-wider text-white bg-[#ff3b19] hover:bg-[#ff5233] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] shrink-0 rounded-full ${
              isCollapsed
                ? "px-3.5 py-2 text-[11px] sm:text-xs"
                : "px-4 sm:px-5 py-2 text-xs"
            }`}
          >
            <span>Set Up Check-In</span>
            <ArrowRight size={13} className="shrink-0" />
          </a>
        </div>

        {/* Hamburger Dropdown Drawer (Only when collapsed and open) */}
        {isCollapsed && menuOpen && (
          <div className="absolute top-14 right-0 w-60 bg-black/70 backdrop-blur-2xl backdrop-saturate-150 border border-white/20 shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.15)] rounded-2xl p-4 flex flex-col gap-2.5 animate-fadeIn text-xs font-semibold uppercase tracking-wider z-50">
            <a
              href="#lone-worker"
              onClick={() => setMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-white/10 border border-transparent hover:border-white/10 text-white/80 hover:text-white transition-all"
            >
              Lone Workers
            </a>
            <a
              href="#seniors"
              onClick={() => setMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-white/10 border border-transparent hover:border-white/10 text-white/80 hover:text-white transition-all"
            >
              Family &amp; Seniors
            </a>
            <a
              href="#business"
              onClick={() => setMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-white/10 border border-transparent hover:border-white/10 text-white/80 hover:text-white transition-all"
            >
              Business Custody
            </a>
            <a
              href="#actions"
              onClick={() => setMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-white/10 border border-transparent hover:border-white/10 text-white/80 hover:text-white transition-all"
            >
              Actions &amp; Features
            </a>
          </div>
        )}
      </header>
    </div>
  );
}
