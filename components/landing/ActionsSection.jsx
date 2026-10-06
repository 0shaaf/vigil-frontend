"use client";

import { useEffect, useRef, useState } from "react";
import { BellRing, FileKey2, ShieldBan, Mail, ArrowRight, CheckCircle2 } from "lucide-react";

const ACTIONS = [
  {
    icon: BellRing,
    title: "Multi-Channel Emergency Alerts",
    subtitle: "SMS, Phone Calls & Email",
    description:
      "Dispatches instant alerts to your designated family members, colleagues, or neighbors with custom instructions and emergency details.",
    badge: "Immediate Dispatch",
  },
  {
    icon: FileKey2,
    title: "Encrypted Google Drive Vault",
    subtitle: "Selective File Sharing",
    description:
      "Instantly grants read or download access to pre-selected files in your Google Drive—from legal wills and deeds to password databases.",
    badge: "Zero-Knowledge",
  },
  {
    icon: ShieldBan,
    title: "Automated API Lockdown",
    subtitle: "Webhook Execution",
    description:
      "Sends a secure, authenticated webhook to your cloud or infrastructure to terminate API keys, revoke active sessions, and freeze access.",
    badge: "Instant Revocation",
  },
  {
    icon: Mail,
    title: "Sealed Personal Letters",
    subtitle: "Private Directives",
    description:
      "Delivers deeply personal letters, family videos, or vital instructions prepared for your children and spouse, delivered only when silence is confirmed.",
    badge: "Confidential",
  },
];

export default function ActionsSection() {
  const sectionRef = useRef(null);
  const gridRef = useRef(null);
  const cardRefs = useRef([]);
  const [offsets, setOffsets] = useState([]);
  const [animationPhase, setAnimationPhase] = useState("offscreen"); // "offscreen" | "stacked" | "dispersed"
  const [isFullySettled, setIsFullySettled] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(false);

  const stackTimeoutRef = useRef(null);
  const settleTimeoutRef = useRef(null);

  // Compute relative layout coordinates from each card to Card 0
  const updateOffsets = () => {
    if (!gridRef.current || cardRefs.current.length < 4) return;
    const card0 = cardRefs.current[0];
    if (!card0) return;

    const card0Left = card0.offsetLeft;
    const card0Top = card0.offsetTop;
    const offscreenShift = -(typeof window !== "undefined" ? window.innerWidth + 400 : 1600);

    const calculated = cardRefs.current.map((card) => {
      if (!card) return { dx: 0, dy: 0, offscreenShift };
      return {
        dx: card0Left - card.offsetLeft,
        dy: card0Top - card.offsetTop,
        offscreenShift,
      };
    });
    setOffsets(calculated);
  };

  useEffect(() => {
    updateOffsets();
    window.addEventListener("resize", updateOffsets);
    return () => window.removeEventListener("resize", updateOffsets);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsHeaderVisible(true);
          updateOffsets();

          if (stackTimeoutRef.current) clearTimeout(stackTimeoutRef.current);
          if (settleTimeoutRef.current) clearTimeout(settleTimeoutRef.current);

          setIsFullySettled(false);
          setAnimationPhase("offscreen");

          // Double rAF ensures offscreen state is committed before beginning translation
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              setAnimationPhase("stacked");

              // After arriving and pausing as a stack, disperse cards to their grid positions
              stackTimeoutRef.current = setTimeout(() => {
                setAnimationPhase("dispersed");

                settleTimeoutRef.current = setTimeout(() => {
                  setIsFullySettled(true);
                }, 1200);
              }, 950);
            });
          });
        } else {
          // Reset when scrolling away
          setIsHeaderVisible(false);
          setIsFullySettled(false);
          setAnimationPhase("offscreen");
          if (stackTimeoutRef.current) clearTimeout(stackTimeoutRef.current);
          if (settleTimeoutRef.current) clearTimeout(settleTimeoutRef.current);
        }
      },
      {
        threshold: 0.15,
        rootMargin: "-20px 0px -20px 0px",
      }
    );

    const currentEl = sectionRef.current;
    if (currentEl) {
      observer.observe(currentEl);
    }

    return () => {
      if (currentEl) observer.unobserve(currentEl);
      if (stackTimeoutRef.current) clearTimeout(stackTimeoutRef.current);
      if (settleTimeoutRef.current) clearTimeout(settleTimeoutRef.current);
    };
  }, []);

  const getCardStyle = (idx) => {
    if (isFullySettled) {
      return {};
    }

    if (offsets.length < 4) {
      return { opacity: 0 };
    }

    const offset = offsets[idx] || { dx: 0, dy: 0, offscreenShift: -1600 };
    const rotations = [0, 2, -2.5, 3];
    const zIndices = [40, 30, 20, 10];

    if (animationPhase === "offscreen") {
      return {
        transform: `translate3d(${offset.dx + offset.offscreenShift}px, ${offset.dy}px, 0px) rotate(${rotations[idx]}deg)`,
        opacity: 0,
        zIndex: zIndices[idx],
        transition: "none",
        willChange: "transform, opacity",
      };
    }

    if (animationPhase === "stacked") {
      return {
        transform: `translate3d(${offset.dx}px, ${offset.dy}px, 0px) rotate(${rotations[idx]}deg)`,
        opacity: 1,
        zIndex: zIndices[idx],
        transition: "transform 800ms cubic-bezier(0.16, 1, 0.3, 1), opacity 400ms ease-out",
        willChange: "transform, opacity",
      };
    }

    // "dispersed": Card 0 stays in place while Cards 1-3 translate to their slots with staggered delays
    const delay = idx * 120;
    return {
      transform: "translate3d(0px, 0px, 0px) rotate(0deg)",
      opacity: 1,
      zIndex: 1,
      transition: `transform 750ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, opacity 400ms ease-out`,
      willChange: "transform, opacity",
    };
  };

  return (
    <section
      id="actions"
      ref={sectionRef}
      className="relative py-28 bg-white text-black border-t-2 border-black overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Section Header with smooth fade-in animation */}
        <div
          className={`text-center max-w-3xl mx-auto mb-16 transition-opacity duration-1000 ease-out ${
            isHeaderVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          <h2 className="font-['Space_Grotesk'] text-3xl sm:text-5xl font-bold tracking-tight text-black uppercase leading-tight">
            When you go silent, <br />
            <span className="text-[#ff3b19]">Vigil executes your chosen actions.</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-black/70 font-medium">
            You are always in total control. Choose exactly what happens if you miss a check-in, who gets notified, and which documents unlock.
          </p>
        </div>

        {/* 4 Action Cards: Stack in from left offscreen, then disperse across grid */}
        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {ACTIONS.map((action, idx) => {
            const Icon = action.icon;
            return (
              <div
                key={idx}
                ref={(el) => {
                  cardRefs.current[idx] = el;
                }}
                style={getCardStyle(idx)}
                className="p-6 rounded-3xl bg-white text-black border-2 border-black flex flex-col justify-between shadow-sm transition-shadow duration-300 hover:shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-10 h-10 rounded-xl bg-black text-[#ff3b19] flex items-center justify-center font-bold">
                      <Icon size={20} />
                    </div>
                    <span className="text-[10px] font-bold text-black/60 border border-black/20 px-2 py-0.5 rounded-full uppercase">
                      {action.badge}
                    </span>
                  </div>

                  <h3 className="font-['Space_Grotesk'] text-lg font-bold text-black mb-1">
                    {action.title}
                  </h3>
                  <div className="text-xs font-semibold text-[#ff3b19] mb-3">
                    {action.subtitle}
                  </div>
                  <p className="text-xs text-black/70 leading-relaxed">
                    {action.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-black/10 flex items-center gap-1.5 text-[11px] text-black/60 font-medium">
                  <CheckCircle2 size={13} className="text-[#ff3b19]" />
                  <span>Configured in seconds</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* High Conversion Final CTA Banner */}
        <div className="mt-20 p-8 sm:p-12 rounded-3xl bg-black text-white border-2 border-black text-center max-w-4xl mx-auto flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#ff3b19]/20 text-[#ff3b19] text-xs font-bold uppercase tracking-wider mb-4 border border-[#ff3b19]/30">
            Protect What Matters Most
          </div>

          <h3 className="font-['Space_Grotesk'] text-3xl sm:text-5xl font-bold text-white uppercase tracking-tight">
            Never leave your silence to chance.
          </h3>

          <p className="mt-4 text-base sm:text-lg text-white/70 max-w-lg leading-relaxed">
            Whether for your field shift, your aging family, or your company’s survival, setting up your first automated check-in takes less than two minutes.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center gap-4">
            <button
              onClick={() => alert("Check-in setup initiated! Connecting to secure Sentinel.")}
              className="inline-flex items-center gap-2.5 px-8 py-4 rounded-xl text-sm font-bold uppercase tracking-wider text-black bg-[#ff3b19] hover:bg-[#ff5233] transition-colors"
            >
              <span>Arm Your First Check-In</span>
              <ArrowRight size={16} />
            </button>
            <span className="text-xs text-white/60">100% Free to get started • No credit card required</span>
          </div>
        </div>
      </div>
    </section>
  );
}

