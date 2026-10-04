"use client";

import { useState } from "react";
import { Clock, Shield, Flame, CheckCircle2, ChevronRight, Send, Lock, FileCode, Users } from "lucide-react";
import { sound } from "@/lib/sound";

const STAGES = [
  {
    step: "01",
    phase: "PHASE 01 // SENTINEL CADENCE",
    title: "Cryptographic Heartbeat & Interval Clock",
    description:
      "Configure your switch pulse with flexible precision (from 12 hours up to 6 months). The operator checks in via one-tap web UI, command-line token pulse, or automated webhook heartbeat.",
    badge: "STATE: ARMED",
    badgeColor: "emerald",
    specDetails: [
      { label: "Check-in Cadence", value: '{"days": 0, "hours": 12, "minutes": 0}' },
      { label: "Trigger Daemon", value: "GET /api/revalidate (Cron Heartbeat Engine)" },
      { label: "Operator Authentication", value: "Supabase JWT + Ephemeral Cryptographic Secret" },
    ],
  },
  {
    step: "02",
    phase: "PHASE 02 // GRACE WINDOW",
    title: "Waterfall Warning & Recipient Escalation",
    description:
      "When the pulse deadline lapses, Vigil enters a secured grace sequence. Before unleashing catastrophic actions, it cascades multi-channel alerts across Priority 1 to 10 designated contact tiers.",
    badge: "STATE: GRACE CASCADE",
    badgeColor: "amber",
    specDetails: [
      { label: "Waterfall Hierarchy", value: "Tier 1 (Inner Circle) ➔ Tier 10 (Deep Reserve)" },
      { label: "Ack Verification", value: "GET /api/ack/[token] (Single-use token halts trip)" },
      { label: "Outbound Sender", value: "sentinel@shaaf.me (Hardened Resend dispatch)" },
    ],
  },
  {
    step: "03",
    phase: "PHASE 03 // CALAMITY EXECUTION",
    title: "Autonomous Lockdown & Drive Vault Release",
    description:
      "If the grace period expires without operator check-in or valid acknowledgment, the switch trips to EXHAUSTED. Vigil immediately executes the automated lockdown webhook and selectively decrypts Drive assets.",
    badge: "STATE: EXHAUSTED / TRIPPED",
    badgeColor: "rose",
    specDetails: [
      { label: "Lockdown Webhook", value: "POST /v1/revoke-all [Bearer Token Auth]" },
      { label: "Google Drive Vault", value: "OAuth-delegated instant permission sharing" },
      { label: "Audit Ledger", value: "escalation_logs committed with immutable timestamp" },
    ],
  },
];

export default function ProtocolEngine() {
  const [activeStage, setActiveStage] = useState(0);

  const setStage = (idx) => {
    sound.playClick();
    setActiveStage(idx);
  };

  const current = STAGES[activeStage];

  return (
    <section id="protocol" className="relative py-28 bg-[#07070a] text-white border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ff7700]/10 border border-[#ff7700]/30 text-[#ffaa00] text-xs font-mono tracking-widest uppercase mb-4">
            <Clock size={14} className="text-[#ff7700]" />
            SPECIFICATION WORKFLOW
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight uppercase leading-tight">
            THE THREE-STAGE <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ffaa00] via-[#ff3b19] to-[#d62828]">
              CONTINGENCY PROTOCOL.
            </span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-white/60 font-light">
            Engineered precisely against the backend API specification. Every heartbeat, grace window, and trip execution is cryptographically validated.
          </p>
        </div>

        {/* Interactive 3-Tab Stepper */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Step Selection */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            {STAGES.map((stg, idx) => {
              const isActive = activeStage === idx;
              return (
                <button
                  key={stg.step}
                  onClick={() => setStage(idx)}
                  className={`text-left p-6 rounded-2xl transition-all duration-300 relative border ${
                    isActive
                      ? "bg-[#11121b] border-[#ff3b19] shadow-[0_0_25px_rgba(255,59,25,0.25)] translate-x-1"
                      : "bg-[#09090e]/80 border-white/10 hover:border-white/20 hover:bg-[#0c0d14]"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs text-[#ffaa00] font-bold tracking-widest uppercase">
                      {stg.phase}
                    </span>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded border uppercase ${
                        stg.badgeColor === "emerald"
                          ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                          : stg.badgeColor === "amber"
                          ? "bg-amber-500/10 border-amber-500/30 text-amber-400"
                          : "bg-rose-500/10 border-rose-500/30 text-rose-400"
                      }`}
                    >
                      {stg.badge}
                    </span>
                  </div>
                  <h4 className="text-lg font-bold text-white mb-2">{stg.title}</h4>
                  <p className="text-xs text-white/60 line-clamp-2 leading-relaxed">
                    {stg.description}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Right Live Stage Deep-Dive Card */}
          <div className="lg:col-span-7">
            <div className="p-8 rounded-3xl bg-[#0e0f17] border border-[#ff3b19]/30 relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
              {/* Corner Watermark */}
              <div className="absolute top-4 right-6 font-mono text-7xl font-black text-white/[0.04] pointer-events-none select-none">
                STAGE {current.step}
              </div>

              <div className="relative z-10">
                <div className="flex items-center gap-2 text-xs font-mono text-[#ff7700] mb-3">
                  <span className="w-2 h-2 rounded-full bg-[#ff3b19] animate-pulse" />
                  DETAILED SPECIFICATION ARCHITECTURE
                </div>

                <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                  {current.title}
                </h3>

                <p className="text-sm sm:text-base text-white/70 leading-relaxed mb-6">
                  {current.description}
                </p>

                {/* Key Spec Parameters Table */}
                <div className="p-4 rounded-xl bg-black/60 border border-white/10 mb-6">
                  <div className="text-[11px] font-mono text-white/40 uppercase tracking-widest mb-3">
                    // BACKEND DATA BINDING SCHEMA
                  </div>
                  <div className="space-y-2.5">
                    {current.specDetails.map((item, i) => (
                      <div
                        key={i}
                        className="flex flex-col sm:flex-row sm:items-center justify-between text-xs font-mono py-1 border-b border-white/5 last:border-0"
                      >
                        <span className="text-white/60">{item.label}</span>
                        <span className="text-emerald-400 font-semibold truncate sm:max-w-xs">
                          {item.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action CTA */}
                <div className="flex flex-wrap items-center gap-4">
                  <a
                    href="#simulator"
                    onClick={() => sound.playClick()}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider text-black bg-gradient-to-r from-[#ffaa00] to-[#ff3b19] hover:from-[#ffbb11] hover:to-[#ff5533] shadow-[0_0_20px_rgba(255,119,0,0.4)] transition-all"
                  >
                    <span>SIMULATE THIS STAGE</span>
                    <ChevronRight size={14} />
                  </a>
                  <span className="text-[11px] font-mono text-white/40">
                    Complies with SECTION 4.1 BUILDER WORKFLOW
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
