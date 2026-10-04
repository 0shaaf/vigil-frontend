"use client";

import { useState } from "react";
import { Sliders, Shield, FileText, Check, Lock, UserCheck, FolderGit2, AlertCircle } from "lucide-react";
import { sound } from "@/lib/sound";

const VAULT_ITEMS = [
  {
    id: "f-1",
    name: "Operational_Handover_Checklist.pdf",
    minTrust: 15,
    size: "142 KB",
    mime: "application/pdf",
    category: "OPERATIONAL",
  },
  {
    id: "f-2",
    name: "Staging_Infra_Access_Profiles.json",
    minTrust: 45,
    size: "86 KB",
    mime: "application/json",
    category: "DEVOPS",
  },
  {
    id: "f-3",
    name: "Corporate_Legal_Directives_2026.pdf",
    minTrust: 70,
    size: "520 KB",
    mime: "application/pdf",
    category: "LEGAL",
  },
  {
    id: "f-4",
    name: "Production_Database_Encryption_Keys.pdf",
    minTrust: 85,
    size: "204 KB",
    mime: "application/pdf",
    category: "CRITICAL INFRA",
  },
  {
    id: "f-5",
    name: "Sovereign_Cold_Storage_Vault.kdbx",
    minTrust: 95,
    size: "419 KB",
    mime: "application/octet-stream",
    category: "SENTINEL VAULT",
  },
];

export default function TrustMatrix() {
  const [clearanceSlider, setClearanceSlider] = useState(50);
  const [designatedOnly, setDesignatedOnly] = useState(false);
  const [designatedContact, setDesignatedContact] = useState("Elena Rostova (General Counsel)");

  const handleSliderChange = (e) => {
    setClearanceSlider(Number(e.target.value));
  };

  const handleToggleDesignated = () => {
    sound.playClick();
    setDesignatedOnly(!designatedOnly);
  };

  // Section 4.1 Rule:
  // If "Designated Contact Only" is toggled ON: trust_required = -1 and forced target_contact_id.
  // If OFF: trust_required = slider value (0-100) and target_contact_id = null.
  const trustRequiredCalculated = designatedOnly ? -1 : clearanceSlider;

  return (
    <section id="vault" className="relative py-28 bg-[#07070a] text-white border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ff3b19]/10 border border-[#ff3b19]/30 text-[#ffaa00] text-xs font-mono tracking-widest uppercase mb-4">
            <Sliders size={14} className="text-[#ff3b19]" />
            SECTION 2.2 &amp; 4.1 SPECIFICATION
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight uppercase leading-tight">
            TRUST CLEARANCE MATRIX <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ffaa00] via-[#ff3b19] to-[#d62828]">
              &amp; DRIVE VAULT WATERFALL.
            </span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-white/60 font-light">
            Granular access controls for catastrophic disclosure. Unlocks Google Drive payloads only to recipients who meet the cryptographic trust score, or routes strictly to a designated legal executor.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Interactive Clearance Controls */}
          <div className="lg:col-span-5 p-7 rounded-3xl bg-[#0e0f17] border border-white/10 space-y-6">
            <div>
              <div className="text-xs font-mono text-[#ff7700] uppercase tracking-wider mb-1">
                RULE ENGINE CONTROLS
              </div>
              <h3 className="text-xl font-bold text-white">
                Configure Recipient Clearance
              </h3>
            </div>

            {/* Toggle: Designated Contact Exception (trust_required = -1) */}
            <div className="p-4 rounded-2xl bg-black/60 border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-mono text-xs font-semibold text-white">
                    Designated Contact Only
                  </div>
                  <div className="text-[11px] font-mono text-white/50">
                    Bypasses general trust tiers (sets trust_required = -1)
                  </div>
                </div>

                <button
                  onClick={handleToggleDesignated}
                  className={`w-12 h-6 rounded-full transition-colors relative flex items-center p-1 ${
                    designatedOnly ? "bg-[#ff3b19]" : "bg-white/20"
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-transform ${
                      designatedOnly ? "translate-x-6" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              {designatedOnly && (
                <div className="pt-3 border-t border-white/10 animate-fadeIn">
                  <label className="text-[10px] font-mono text-[#ffaa00] uppercase tracking-wider block mb-1.5">
                    SPECIFIED TARGET CONTACT (MANDATORY)
                  </label>
                  <div className="p-2.5 rounded-lg bg-[#141622] border border-[#ff3b19]/40 flex items-center gap-2 font-mono text-xs text-white">
                    <UserCheck size={15} className="text-emerald-400" />
                    <span>{designatedContact}</span>
                  </div>
                  <p className="text-[10px] font-mono text-white/40 mt-1.5">
                    * Section 5 Rule 3: Form submission is blocked unless target_contact_id is selected.
                  </p>
                </div>
              )}
            </div>

            {/* Clearance Slider (0 to 100) */}
            <div
              className={`p-4 rounded-2xl bg-black/60 border border-white/10 space-y-3 transition-opacity ${
                designatedOnly ? "opacity-40 pointer-events-none" : "opacity-100"
              }`}
            >
              <div className="flex items-center justify-between font-mono text-xs">
                <span className="text-white/60">CLEARANCE TIER THRESHOLD</span>
                <span className="text-2xl font-bold text-[#ffaa00]">
                  {clearanceSlider}
                  <span className="text-xs text-white/40 font-normal"> / 100</span>
                </span>
              </div>

              <input
                type="range"
                min="0"
                max="100"
                value={clearanceSlider}
                onChange={handleSliderChange}
                className="w-full accent-[#ff7700] h-2 bg-white/10 rounded-lg cursor-pointer"
              />

              <div className="flex justify-between text-[10px] font-mono text-white/40">
                <span>0 (General Public)</span>
                <span>50 (Core Team)</span>
                <span>100 (Sovereign Level)</span>
              </div>
            </div>

            {/* Calculated State Payload Preview */}
            <div className="p-4 rounded-xl bg-black/80 border border-white/10 font-mono text-xs">
              <div className="text-[10px] text-white/40 uppercase tracking-widest mb-1.5">
                // ACTIVE STATE SERIALIZATION (CreateSwitchForm.jsx)
              </div>
              <div className="text-emerald-400">
                trust_required:{" "}
                <span className="text-white font-bold">{trustRequiredCalculated}</span>
              </div>
              <div className="text-emerald-400">
                target_contact_id:{" "}
                <span className="text-white">
                  {designatedOnly ? '"usr_8842c-elena-law"' : "null"}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Google Drive File Vault Simulation */}
          <div className="lg:col-span-7 p-7 rounded-3xl bg-[#0e0f17] border border-white/10">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
              <div>
                <div className="text-xs font-mono text-emerald-400 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                  <FolderGit2 size={15} />
                  GOOGLE DRIVE ENCRYPTED REPOSITORY
                </div>
                <h3 className="text-xl font-bold text-white">
                  Vault Disclosure Evaluation
                </h3>
              </div>
              <span className="text-xs font-mono px-2.5 py-1 rounded bg-white/5 border border-white/10 text-white/60">
                GET /api/drive/files
              </span>
            </div>

            {/* List of Drive Assets with dynamic clearance badges */}
            <div className="space-y-3">
              {VAULT_ITEMS.map((file) => {
                const isUnlocked = designatedOnly
                  ? true // designated contact receives all targeted files
                  : clearanceSlider >= file.minTrust;

                return (
                  <div
                    key={file.id}
                    className={`p-4 rounded-2xl border transition-all duration-200 flex items-center justify-between gap-4 ${
                      isUnlocked
                        ? "bg-[#11131e] border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.1)]"
                        : "bg-black/40 border-white/5 opacity-60"
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                          isUnlocked
                            ? "bg-emerald-500/20 text-emerald-400"
                            : "bg-white/5 text-white/40"
                        }`}
                      >
                        {isUnlocked ? <FileText size={18} /> : <Lock size={18} />}
                      </div>

                      <div>
                        <div className="font-mono text-xs font-semibold text-white flex items-center gap-2">
                          <span>{file.name}</span>
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/10 text-white/50">
                            {file.category}
                          </span>
                        </div>
                        <div className="text-[10px] font-mono text-white/40 mt-0.5">
                          Size: {file.size} • Required Trust: {file.minTrust}
                        </div>
                      </div>
                    </div>

                    {/* Status Seal */}
                    <div className="shrink-0">
                      {isUnlocked ? (
                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-[10px] font-bold">
                          <Check size={12} />
                          <span>DISCLOSED</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-white/40 font-mono text-[10px]">
                          <Lock size={12} />
                          <span>SEALED</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono text-white/50">
              <span>Section 3.2: OAuth 2.0 Drive Scopes</span>
              <span className="text-emerald-400">Zero-Knowledge Token Persistence</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
