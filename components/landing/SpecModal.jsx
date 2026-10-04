"use client";

import { X, Copy, Check, FileCode, ExternalLink } from "lucide-react";
import { useState } from "react";
import { sound } from "@/lib/sound";

export default function SpecModal({ isOpen, onClose }) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopyEnv = () => {
    sound.playClick();
    navigator.clipboard.writeText(
      `NEXT_PUBLIC_SITE_URL=https://vigil.shaaf.me\nNEXT_PUBLIC_SUPABASE_URL=https://<ref>.supabase.co\nNEXT_PUBLIC_SUPABASE_ANON_KEY=<anon_key>`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-4xl max-h-[85vh] bg-[#0c0d14] border border-[#ff3b19]/40 rounded-3xl shadow-[0_0_60px_rgba(255,59,25,0.3)] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-[#11121d] border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <FileCode size={18} className="text-[#ff7700]" />
            <h3 className="font-mono text-sm font-bold text-white tracking-wider uppercase">
              VIGIL // BACKEND_API_SPEC.md (ACTIVE CONTRACT)
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyEnv}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white font-mono text-xs border border-white/10 transition-colors"
            >
              {copied ? (
                <>
                  <Check size={13} className="text-emerald-400" />
                  <span className="text-emerald-400">COPIED ENV</span>
                </>
              ) : (
                <>
                  <Copy size={13} />
                  <span>COPY ENV</span>
                </>
              )}
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 font-mono text-xs text-white/80">
          {/* Section 1 */}
          <div className="p-4 rounded-xl bg-black/60 border border-white/10">
            <h4 className="text-sm font-bold text-[#ffaa00] uppercase mb-2">
              1. System Constants &amp; Environment
            </h4>
            <pre className="text-emerald-400 bg-[#07070a] p-3 rounded border border-white/5 overflow-x-auto">
{`NEXT_PUBLIC_SITE_URL=https://vigil.shaaf.me
NEXT_PUBLIC_SUPABASE_URL=https://<ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon_key>`}
            </pre>
            <p className="text-[11px] text-white/50 mt-2">
              Warning: Never append paths to NEXT_PUBLIC_SITE_URL. Must remain an origin URL without trailing slashes.
            </p>
          </div>

          {/* Section 2 */}
          <div className="p-4 rounded-xl bg-black/60 border border-white/10">
            <h4 className="text-sm font-bold text-[#ff3b19] uppercase mb-2">
              2. Core Data Models: Switches &amp; Beacons
            </h4>
            <p className="text-white/70 leading-relaxed mb-3">
              Switches table supports statuses: ARMED, EXHAUSTED, ACKNOWLEDGED, PAUSED.
              Check-in interval serializes to: {"{ months: 0, days: N, hours: N, minutes: N }"}.
            </p>
            <pre className="text-cyan-300 bg-[#07070a] p-3 rounded border border-white/5 overflow-x-auto">
{`// Actions JSONB Structure
{
  "email": true,
  "modules": { "beacon": true, "data_release": false, "purge": false, "lockdown": true },
  "lockdown_config": {
    "webhook_url": "https://api.yourdomain.com/v1/revoke-all",
    "http_method": "POST",
    "auth_header": "Bearer secret-token-xyz",
    "payload_json": "{\\"action\\":\\"TERMINATE_ALL_KEYS\\"}"
  }
}`}
            </pre>
          </div>

          {/* Section 3 & 4 */}
          <div className="p-4 rounded-xl bg-black/60 border border-white/10">
            <h4 className="text-sm font-bold text-emerald-400 uppercase mb-2">
              3. Endpoints &amp; 4. Front-End Rules
            </h4>
            <ul className="space-y-1.5 list-disc list-inside text-white/70">
              <li><strong className="text-white">GET /api/auth/google:</strong> Initiates OAuth consent with full Drive access.</li>
              <li><strong className="text-white">GET /api/drive/files:</strong> Populates Drive file pickers. Handles 403 OAUTH_UNLINKED.</li>
              <li><strong className="text-white">pulseCheckIn(switchId):</strong> Supabase update on switches, status ARMED, last_check_in now().</li>
              <li><strong className="text-white">GET /api/revalidate:</strong> Cron-authenticated trip daemon evaluating expired switches.</li>
              <li><strong className="text-white">GET /api/ack/[token]:</strong> Recipient acknowledgment link setting status to ACKNOWLEDGED.</li>
            </ul>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-[#11121d] border-t border-white/10 flex items-center justify-between text-xs font-mono">
          <span className="text-white/40">File: /home/shaaf/repos/Vigil FrontEnd/BACKEND_API_SPEC.md</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-white font-semibold transition-colors"
          >
            CLOSE SPEC
          </button>
        </div>
      </div>
    </div>
  );
}
