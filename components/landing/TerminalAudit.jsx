"use client";

import { useState, useEffect } from "react";
import { Terminal, RefreshCw, ChevronDown, ChevronRight, CheckCircle2, AlertCircle, Clock } from "lucide-react";
import { MOCK_LOGS } from "@/lib/types";
import { sound } from "@/lib/sound";

export default function TerminalAudit() {
  const [logs, setLogs] = useState(MOCK_LOGS);
  const [expandedLogId, setExpandedLogId] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleExpand = (id) => {
    sound.playClick();
    setExpandedLogId(expandedLogId === id ? null : id);
  };

  const handleRefresh = () => {
    sound.playClick();
    setIsRefreshing(true);
    setTimeout(() => {
      // Prepend a simulated newly generated log entry
      const newLog = {
        id: `log-${Date.now()}`,
        created_at: new Date().toISOString(),
        switch_name: "Primary Infra Kill-Switch",
        switch_id: 37,
        channel: "SYSTEM",
        status: "SUCCESS",
        details: "Heartbeat pulse ping acknowledged via operator dashboard. TTL renewed.",
      };
      setLogs((prev) => [newLog, ...prev]);
      setIsRefreshing(false);
      sound.playArmed();
    }, 450);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "SUCCESS":
        return { color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/30", label: "SUCCESS" };
      case "FAILURE":
        return { color: "text-rose-400", bg: "bg-rose-500/10 border-rose-500/30", label: "FAILURE" };
      case "PENDING":
        return { color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/30", label: "PENDING" };
      default:
        return { color: "text-white/60", bg: "bg-white/5 border-white/10", label: status };
    }
  };

  return (
    <section id="logs" className="relative py-28 bg-[#030305] text-white border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono tracking-widest uppercase mb-4">
            <Terminal size={14} className="text-emerald-400" />
            SECTION 4.3 SPECIFICATION
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight uppercase leading-tight">
            AUDIT TELEMETRY &amp; <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
              ESCALATION LOGS.
            </span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-white/60 font-light">
            Monospaced terminal stream verifying every heartbeat check-in, daemon revalidation, webhook invocation, and Drive vault disclosure.
          </p>
        </div>

        {/* Terminal Window Container */}
        <div className="rounded-3xl bg-[#08080d] border border-white/10 overflow-hidden shadow-[0_30px_70px_rgba(0,0,0,0.9)]">
          {/* Terminal Window Top Bar */}
          <div className="px-6 py-4 bg-[#0d0e16] border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#ff5f56]" />
              <span className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
              <span className="w-3 h-3 rounded-full bg-[#27c93f]" />
              <span className="ml-3 font-mono text-xs text-white/40 tracking-wider">
                root@sentinel-cluster:~# tail -f /var/log/vigil/escalation_logs.db
              </span>
            </div>

            <button
              onClick={handleRefresh}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white font-mono text-xs border border-white/10 transition-colors"
            >
              <RefreshCw size={12} className={isRefreshing ? "animate-spin" : ""} />
              <span>SYNC FEED</span>
            </button>
          </div>

          {/* Terminal Table */}
          <div className="overflow-x-auto p-4 sm:p-6 font-mono text-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-[11px] text-white/40 uppercase tracking-widest">
                  <th className="pb-3 pl-2">TIMESTAMP</th>
                  <th className="pb-3">SWITCH</th>
                  <th className="pb-3">CHANNEL</th>
                  <th className="pb-3">STATUS</th>
                  <th className="pb-3 pr-2">DETAILS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {logs.map((item) => {
                  const badge = getStatusBadge(item.status);
                  const isExpanded = expandedLogId === item.id;

                  return (
                    <tr
                      key={item.id}
                      onClick={() => toggleExpand(item.id)}
                      className="cursor-pointer hover:bg-white/[0.03] transition-colors group"
                    >
                      {/* Timestamp */}
                      <td
                        className="py-3.5 pl-2 text-white/60 whitespace-nowrap"
                        suppressHydrationWarning
                      >
                        {mounted
                          ? new Date(item.created_at).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                              second: "2-digit",
                            })
                          : item.created_at.slice(11, 19) + " UTC"}
                      </td>

                      {/* Switch Name */}
                      <td className="py-3.5 text-white/90 font-semibold whitespace-nowrap">
                        {item.switch_name}
                      </td>

                      {/* Channel */}
                      <td className="py-3.5">
                        <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] text-white/70">
                          {item.channel}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3.5">
                        <span
                          className={`px-2.5 py-0.5 rounded border text-[10px] font-bold ${badge.bg} ${badge.color}`}
                        >
                          {badge.label}
                        </span>
                      </td>

                      {/* Details / Expandable */}
                      <td className="py-3.5 pr-2 text-white/70 max-w-md">
                        <div className="flex items-center justify-between gap-2">
                          <span className="truncate">{item.details}</span>
                          {isExpanded ? (
                            <ChevronDown size={14} className="text-white/40 shrink-0" />
                          ) : (
                            <ChevronRight size={14} className="text-white/40 shrink-0 group-hover:text-white" />
                          )}
                        </div>

                        {/* Expanded Details JSON Drawer */}
                        {isExpanded && (
                          <div className="mt-2.5 p-3 rounded-lg bg-black/80 border border-white/10 text-[11px] text-emerald-400 font-mono animate-fadeIn">
                            <pre className="overflow-x-auto whitespace-pre-wrap">
                              {JSON.stringify(
                                {
                                  log_id: item.id,
                                  switch_id: item.switch_id,
                                  event_timestamp: item.created_at,
                                  channel: item.channel,
                                  verification_status: item.status,
                                  raw_payload: item.details,
                                },
                                null,
                                2
                              )}
                            </pre>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
