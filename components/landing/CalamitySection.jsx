"use client";

import { useState } from "react";
import { ServerCrash, LockKeyhole, UserX, ShieldAlert, Zap, FileSpreadsheet, KeyRound } from "lucide-react";
import { sound } from "@/lib/sound";

const CALAMITIES = [
  {
    id: "infra",
    tag: "CALAMITY 01 // CRITICAL INFRASTRUCTURE",
    title: "Orphaned Bastions & Root Key Exposure",
    icon: ServerCrash,
    accent: "#ff3b19",
    summary:
      "When solo founders or lead DevOps engineers vanish, production infrastructure becomes an undefended fortress with decaying credentials.",
    consequence:
      "Cloud instances run unpatched, stale API keys circulate in memory leaks, and malicious actors seize dormant clusters without detection.",
    defense:
      "Vigil dispatches an immediate automated lockdown webhook with cryptographic bearer authorization to revoke all active sessions and terminate master keys.",
    payloadSnippet: 'POST /v1/revoke-all\n{"action": "TERMINATE_ALL_KEYS", "status": "FORCE_REVOCATION"}',
  },
  {
    id: "coercion",
    tag: "CALAMITY 02 // SOVEREIGN COERCION",
    title: "Hostile Takeover & Physical Duress",
    icon: LockKeyhole,
    accent: "#ff7700",
    summary:
      "If you are detained, coerced, or forced to hand over terminal access under extortion, deliberate non-action becomes your greatest sovereign shield.",
    consequence:
      "Adversaries assume control of communication channels and extract institutional assets before stakeholders can react.",
    defense:
      "Silence activates the sentinel. Once the grace window expires without an authenticated heartbeat, the purge routine irreversibly destroys designated local state.",
    payloadSnippet: 'DAEMON: TRIP_INTERVAL_EXHAUSTED\nACTION: SECURE_WIPE_SCHEDULED\nNOTIFIED: SENTINEL_COUNCIL',
  },
  {
    id: "mortality",
    tag: "CALAMITY 03 // SUDDEN DISAPPEARANCE",
    title: "Unforeseen Absence & Lost Keys",
    icon: UserX,
    accent: "#ca1b00",
    summary:
      "Sudden medical emergencies or mortal absence can permanently freeze digital estates, zero-knowledge seed phrases, and legal directives.",
    consequence:
      "Years of intellectual property and family assets remain encrypted behind inaccessible hardware tokens and lost multi-factor authenticators.",
    defense:
      "Vigil executes the Google Drive Vault Waterfall, distributing cryptographic archive payloads according to precise trust clearance tiers.",
    payloadSnippet: 'VAULT_DISCLOSURE: 2 FILES RELEASED\nTARGET: legal-counsel@law.com\nCLEARANCE: TIER_100_RESTRICTED',
  },
];

export default function CalamitySection() {
  const [activeCalamity, setActiveCalamity] = useState(0);

  const selectCalamity = (index) => {
    sound.playClick();
    setActiveCalamity(index);
  };

  return (
    <section id="calamity" className="relative py-28 bg-[#030305] text-white overflow-hidden border-t border-white/5">
      {/* Background glow and horizon ember flare */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-80 bg-gradient-to-b from-[#ff3b19]/10 via-[#ff7700]/5 to-transparent blur-3xl pointer-events-none" />

      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ff3b19]/10 border border-[#ff3b19]/30 text-[#ffaa00] text-xs font-mono tracking-widest uppercase mb-4">
            <ShieldAlert size={14} className="text-[#ff3b19]" />
            THE THREAT HORIZON
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight uppercase leading-tight">
            THE CALAMITIES <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ffaa00] via-[#ff3b19] to-[#d62828]">
              THAT AWAIT IN THE DARK.
            </span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-white/60 font-light">
            When the sun dips below the ridge and your pulse goes silent, the night tests what you left unprotected.
            Vigil is architected for catastrophic resilience.
          </p>
        </div>

        {/* 3 Interactive Calamity Pillars */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {CALAMITIES.map((item, idx) => {
            const Icon = item.icon;
            const isSelected = activeCalamity === idx;

            return (
              <div
                key={item.id}
                onClick={() => selectCalamity(idx)}
                className={`group relative p-7 rounded-2xl cursor-pointer transition-all duration-300 flex flex-col justify-between ${
                  isSelected
                    ? "bg-[#0d0e14] border-2 border-[#ff3b19] shadow-[0_0_35px_rgba(255,59,25,0.3)] scale-[1.02]"
                    : "bg-[#09090e]/70 border border-white/10 hover:border-white/20 hover:bg-[#0c0d13]"
                }`}
              >
                {/* Glow pill behind icon */}
                <div className="flex items-center justify-between mb-5">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                      isSelected
                        ? "bg-[#ff3b19] text-black shadow-[0_0_20px_#ff3b19]"
                        : "bg-white/5 text-white/70 group-hover:text-white"
                    }`}
                  >
                    <Icon size={24} />
                  </div>
                  <span className="font-mono text-[10px] text-white/40 tracking-wider">
                    {item.tag.split(" // ")[0]}
                  </span>
                </div>

                <div>
                  <div className="font-mono text-[11px] text-[#ffaa00] tracking-widest uppercase mb-1">
                    {item.tag.split(" // ")[1]}
                  </div>
                  <h3 className="text-xl font-bold tracking-tight text-white mb-3">
                    {item.title}
                  </h3>
                  <p className="text-sm text-white/70 leading-relaxed mb-4">
                    {item.summary}
                  </p>

                  <div className="p-3 rounded-lg bg-black/60 border border-white/10 mb-4 font-mono text-[11px] text-red-300/80 leading-normal">
                    <span className="text-red-400 font-bold uppercase tracking-wider block mb-1">
                      [UNGUARDED FAILURE]
                    </span>
                    {item.consequence}
                  </div>
                </div>

                {/* Vigil Response Protocol */}
                <div className="mt-4 pt-4 border-t border-white/10">
                  <div className="flex items-center gap-1.5 font-mono text-xs font-semibold text-[#10b981] mb-1.5">
                    <Zap size={14} className="text-[#10b981]" />
                    VIGIL AUTOMATED COUNTERMEASURE
                  </div>
                  <p className="text-xs text-white/80 leading-relaxed mb-3">
                    {item.defense}
                  </p>

                  {/* Terminal snippet */}
                  <pre className="p-2.5 rounded bg-black/80 border border-white/10 text-[10px] font-mono text-emerald-400/90 overflow-x-auto">
                    <code>{item.payloadSnippet}</code>
                  </pre>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
