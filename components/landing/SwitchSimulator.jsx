"use client";

import { useState, useEffect } from "react";
import {
  Activity,
  AlertOctagon,
  CheckCircle,
  Pause,
  Play,
  RotateCcw,
  Zap,
  Terminal,
  Shield,
  FileText,
  KeyRound,
  ExternalLink,
} from "lucide-react";
import { STATUS_CODES, MOCK_SWITCH } from "@/lib/types";
import { sound } from "@/lib/sound";

export default function SwitchSimulator() {
  const [status, setStatus] = useState("ARMED");
  const [lastCheckInDisplay, setLastCheckInDisplay] = useState("08:42:15 AM");
  const [msRemaining, setMsRemaining] = useState(12 * 3600 * 1000 - 3600000 * 3);
  const [feedbackToast, setFeedbackToast] = useState(null);
  const [webhookExecuted, setWebhookExecuted] = useState(false);
  const [showWebhookModal, setShowWebhookModal] = useState(false);

  // 12 hour cycle in ms
  const totalDurationMs = 12 * 3600 * 1000;

  // Countdown timer
  useEffect(() => {
    if (status !== "ARMED") return;

    const interval = setInterval(() => {
      setMsRemaining((prev) => {
        if (prev <= 1000) {
          setStatus("EXHAUSTED");
          setWebhookExecuted(true);
          sound.playWarning();
          setFeedbackToast({
            type: "danger",
            msg: "TRIP ENGINE FIRED: Status updated to EXHAUSTED. Lockdown webhook dispatched.",
          });
          return 0;
        }
        return prev - 1000;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [status]);

  // Format time remaining
  const formatTimer = (ms) => {
    const totalSec = Math.floor(ms / 1000);
    const hours = Math.floor(totalSec / 3600);
    const minutes = Math.floor((totalSec % 3600) / 60);
    const seconds = totalSec % 60;
    return `${hours.toString().padStart(2, "0")}h ${minutes
      .toString()
      .padStart(2, "0")}m ${seconds.toString().padStart(2, "0")}s`;
  };

  // 1. Action: Check In (pulseCheckIn)
  const handleCheckIn = () => {
    sound.playHeartbeat();
    setLastCheckInDisplay(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
    setMsRemaining(totalDurationMs);
    setStatus("ARMED");
    setWebhookExecuted(false);
    setFeedbackToast({
      type: "success",
      msg: "Heartbeat acknowledged. Timer reset.",
    });
    setTimeout(() => setFeedbackToast(null), 5000);
  };

  // 2. Action: Simulate Pulse Expiration (/api/revalidate)
  const handleSimulateExpiration = () => {
    sound.playWarning();
    setMsRemaining(0);
    setStatus("EXHAUSTED");
    setWebhookExecuted(true);
    setFeedbackToast({
      type: "danger",
      msg: "Daemon /api/revalidate triggered: Switch tripped to EXHAUSTED. Revocation webhook executed.",
    });
    setTimeout(() => setFeedbackToast(null), 6000);
  };

  // 3. Action: Recipient Acknowledgment (/api/ack/[token])
  const handleAcknowledge = () => {
    sound.playClick();
    setStatus("ACKNOWLEDGED");
    setFeedbackToast({
      type: "warning",
      msg: "Recipient token verified (/api/ack/[token]): Switch state set to HALTED (ACK).",
    });
    setTimeout(() => setFeedbackToast(null), 5000);
  };

  // 4. Action: Pause / Resume
  const handleTogglePause = () => {
    sound.playClick();
    if (status === "PAUSED") {
      setStatus("ARMED");
      setFeedbackToast({ type: "info", msg: "Sentinel resumed. Monitoring active." });
    } else {
      setStatus("PAUSED");
      setFeedbackToast({ type: "info", msg: "Sentinel paused. Countdown suspended." });
    }
    setTimeout(() => setFeedbackToast(null), 4000);
  };

  const currentStatusMeta = STATUS_CODES[status] || STATUS_CODES.ARMED;
  const progressPercent = Math.min(100, Math.max(0, (msRemaining / totalDurationMs) * 100));

  return (
    <section id="simulator" className="relative py-28 bg-[#030305] text-white border-t border-white/5">
      {/* Background ambient light */}
      <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-[#ff3b19]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-[#ff7700]/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#10b981]/10 border border-[#10b981]/30 text-emerald-400 text-xs font-mono tracking-widest uppercase mb-4">
            <Zap size={14} className="text-emerald-400" />
            LIVE DASHBOARD HUD SIMULATOR
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight uppercase leading-tight">
            THE SENTINEL COCKPIT.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-white/60 font-light">
            Directly modeled on Section 4.2 of the backend specification. Experience live state transitions between ARMED, TRIPPED, HALTED, and STANDBY.
          </p>
        </div>

        {/* The Live Switch Card */}
        <div className="rounded-3xl bg-[#09090f] border border-white/10 overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.85)]">
          {/* Card Top Banner with Status Badge */}
          <div className="p-6 sm:p-8 bg-[#0e0e16] border-b border-white/10 flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs px-2.5 py-1 rounded bg-white/10 text-white/70 border border-white/10">
                  SWITCH #37
                </span>
                <span className="font-mono text-xs px-2.5 py-1 rounded bg-[#ff3b19]/20 text-[#ff7700] border border-[#ff3b19]/30 font-semibold">
                  CRITICALITY: SENTINEL
                </span>
                <span className="font-mono text-xs text-white/40 hidden sm:inline">
                  PURPOSE: INFRASTRUCTURE
                </span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-white mt-2">
                Primary Infra Kill-Switch
              </h3>
              <p className="text-xs sm:text-sm text-white/60 mt-1 max-w-2xl">
                {MOCK_SWITCH.description}
              </p>
            </div>

            {/* Dynamic Status Badge (Section 4.2) */}
            <div
              className="px-4 py-2 rounded-xl flex items-center gap-2.5 border transition-all duration-300"
              style={{
                backgroundColor: currentStatusMeta.bg,
                borderColor: currentStatusMeta.border,
                color: currentStatusMeta.color,
              }}
            >
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  currentStatusMeta.pulse ? "animate-ping" : ""
                }`}
                style={{ backgroundColor: currentStatusMeta.color }}
              />
              <span className="font-mono text-sm font-black tracking-widest">
                {currentStatusMeta.label}
              </span>
            </div>
          </div>

          {/* Countdown & Heartbeat Visualizer */}
          <div className="p-6 sm:p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Metric 1: Time Remaining */}
              <div className="p-5 rounded-2xl bg-black/60 border border-white/10">
                <div className="text-[10px] font-mono text-white/40 uppercase tracking-widest mb-1">
                  COUNTDOWN DEADLINE
                </div>
                <div
                  className="text-2xl sm:text-3xl font-mono font-bold tracking-tight"
                  style={{ color: currentStatusMeta.color }}
                  suppressHydrationWarning
                >
                  {formatTimer(msRemaining)}
                </div>
                <div className="text-[10px] font-mono text-white/40 mt-1">
                  Interval: 12 Hours (Cadence)
                </div>
              </div>

              {/* Metric 2: Last Pulse Timestamp */}
              <div className="p-5 rounded-2xl bg-black/60 border border-white/10">
                <div className="text-[10px] font-mono text-white/40 uppercase tracking-widest mb-1">
                  LAST RECOGNIZED PULSE
                </div>
                <div
                  className="text-xl sm:text-2xl font-mono font-semibold text-white/90"
                  suppressHydrationWarning
                >
                  {lastCheckInDisplay}
                </div>
                <div className="text-[10px] font-mono text-emerald-400 mt-1 flex items-center gap-1">
                  <CheckCircle size={11} />
                  <span>Authenticated via Operator Session</span>
                </div>
              </div>

              {/* Metric 3: Active Modules */}
              <div className="p-5 rounded-2xl bg-black/60 border border-white/10">
                <div className="text-[10px] font-mono text-white/40 uppercase tracking-widest mb-1">
                  ARMED MODULES
                </div>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    LOCKDOWN WEBHOOK
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#ff7700]/10 text-[#ffaa00] border border-[#ff7700]/20">
                    DRIVE DISCLOSURE
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">
                    RESEND AUDIT
                  </span>
                </div>
              </div>
            </div>

            {/* Countdown Progress Bar (Section 4.2) */}
            <div>
              <div className="flex justify-between text-xs font-mono text-white/50 mb-2">
                <span>TRIP DEADLINE PROGRESS</span>
                <span>{progressPercent.toFixed(1)}% SECURE TIME REMAINING</span>
              </div>
              <div className="w-full h-3 rounded-full bg-white/10 overflow-hidden relative">
                <div
                  className="h-full transition-all duration-300 rounded-full"
                  style={{
                    width: `${progressPercent}%`,
                    backgroundColor: currentStatusMeta.color,
                    boxShadow: `0 0 15px ${currentStatusMeta.color}`,
                  }}
                />
              </div>
            </div>

            {/* Interactive Control Deck */}
            <div className="pt-4 border-t border-white/10 flex flex-wrap items-center gap-3">
              {/* Check In Button (pulseCheckIn) */}
              <button
                onClick={handleCheckIn}
                className="flex items-center gap-2 px-5 py-3 rounded-xl font-mono text-xs font-bold uppercase tracking-wider text-black bg-gradient-to-r from-emerald-400 to-emerald-500 hover:from-emerald-300 hover:to-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all"
              >
                <Activity size={15} />
                <span>CHECK IN (PULSE)</span>
              </button>

              {/* Simulate Pulse Expiration (/api/revalidate) */}
              <button
                onClick={handleSimulateExpiration}
                className="flex items-center gap-2 px-4 py-3 rounded-xl font-mono text-xs font-bold uppercase tracking-wider text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/40 transition-colors"
              >
                <AlertOctagon size={15} />
                <span>SIMULATE TRIP EXPIRE</span>
              </button>

              {/* Acknowledge Button (/api/ack/[token]) */}
              <button
                onClick={handleAcknowledge}
                className="flex items-center gap-2 px-4 py-3 rounded-xl font-mono text-xs font-bold uppercase tracking-wider text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/40 transition-colors"
              >
                <CheckCircle size={15} />
                <span>ACK RECIPIENT TOKEN</span>
              </button>

              {/* Pause / Resume Button */}
              <button
                onClick={handleTogglePause}
                className="flex items-center gap-2 px-4 py-3 rounded-xl font-mono text-xs font-bold uppercase tracking-wider text-white/80 bg-white/5 hover:bg-white/10 border border-white/15 transition-colors"
              >
                {status === "PAUSED" ? (
                  <>
                    <Play size={15} className="text-emerald-400" />
                    <span>RESUME</span>
                  </>
                ) : (
                  <>
                    <Pause size={15} className="text-white/60" />
                    <span>PAUSE</span>
                  </>
                )}
              </button>

              {/* Inspect Webhook Payload */}
              <button
                onClick={() => setShowWebhookModal(!showWebhookModal)}
                className="ml-auto flex items-center gap-1.5 px-3 py-3 text-xs font-mono text-white/50 hover:text-white transition-colors"
              >
                <Terminal size={14} />
                <span>{showWebhookModal ? "HIDE CONFIG" : "INSPECT LOCKDOWN JSON"}</span>
              </button>
            </div>

            {/* Optional Webhook Configuration Inspector */}
            {showWebhookModal && (
              <div className="p-4 rounded-xl bg-black/90 border border-white/15 font-mono text-xs animate-fadeIn">
                <div className="text-[10px] text-white/40 uppercase tracking-widest mb-2 flex items-center justify-between">
                  <span>SECTION 2.1 LOCKDOWN_CONFIG</span>
                  <span className="text-emerald-400">JSON VALIDATED</span>
                </div>
                <div className="space-y-1 text-white/80">
                  <div>
                    <span className="text-[#ff7700]">Target URL:</span>{" "}
                    {MOCK_SWITCH.actions.lockdown_config.webhook_url}
                  </div>
                  <div>
                    <span className="text-[#ff7700]">Method:</span>{" "}
                    {MOCK_SWITCH.actions.lockdown_config.http_method}
                  </div>
                  <div>
                    <span className="text-[#ff7700]">Auth Header:</span>{" "}
                    {MOCK_SWITCH.actions.lockdown_config.auth_header}
                  </div>
                  <div className="mt-2">
                    <span className="text-[#ff7700]">Payload:</span>
                    <pre className="mt-1 p-2 bg-[#09090f] rounded border border-white/10 text-emerald-400 text-[11px] overflow-x-auto">
                      {JSON.stringify(
                        JSON.parse(MOCK_SWITCH.actions.lockdown_config.payload_json),
                        null,
                        2
                      )}
                    </pre>
                  </div>
                </div>
              </div>
            )}

            {/* Feedback Toast Banner */}
            {feedbackToast && (
              <div
                className={`p-3.5 rounded-xl border flex items-center gap-3 font-mono text-xs animate-fadeIn ${
                  feedbackToast.type === "success"
                    ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-300"
                    : feedbackToast.type === "danger"
                    ? "bg-rose-500/15 border-rose-500/40 text-rose-300 shadow-[0_0_20px_rgba(244,63,94,0.3)]"
                    : feedbackToast.type === "warning"
                    ? "bg-amber-500/15 border-amber-500/40 text-amber-300"
                    : "bg-white/10 border-white/20 text-white"
                }`}
              >
                <div className="w-2 h-2 rounded-full bg-current animate-ping" />
                <span className="font-semibold">{feedbackToast.msg}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
