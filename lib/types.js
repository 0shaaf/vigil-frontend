// Vigil System Constants & Data Models according to BACKEND_API_SPEC.md

export const SYSTEM_CONSTANTS = {
  SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || "https://vigil.shaaf.me",
  SENDER_EMAIL: "sentinel@shaaf.me",
  DEFAULT_INTERVAL: {
    months: 0,
    days: 0,
    hours: 12,
    minutes: 0,
  },
};

export const STATUS_CODES = {
  ARMED: {
    label: "ARMED",
    color: "#10b981", // emerald
    bg: "rgba(16, 185, 129, 0.15)",
    border: "rgba(16, 185, 129, 0.4)",
    pulse: true,
  },
  EXHAUSTED: {
    label: "TRIPPED",
    color: "#f43f5e", // rose
    bg: "rgba(244, 63, 94, 0.15)",
    border: "rgba(244, 63, 94, 0.5)",
    pulse: true,
  },
  ACKNOWLEDGED: {
    label: "HALTED (ACK)",
    color: "#f59e0b", // amber
    bg: "rgba(245, 158, 11, 0.15)",
    border: "rgba(245, 158, 11, 0.4)",
    pulse: false,
  },
  PAUSED: {
    label: "STANDBY",
    color: "#94a3b8", // slate
    bg: "rgba(148, 163, 184, 0.15)",
    border: "rgba(148, 163, 184, 0.3)",
    pulse: false,
  },
};

export const MOCK_SWITCH = {
  id: 37,
  name: "Primary Infra Kill-Switch",
  description: "Protects AWS/GCP root clusters, rotates bastion keys, dispatches encrypted sovereign drive archives to legal counsel.",
  status: "ARMED",
  criticality: "SENTINEL",
  purpose: "INFRASTRUCTURE",
  last_check_in: "2026-10-02T06:00:00.000Z",
  check_in_interval: {
    months: 0,
    days: 0,
    hours: 12,
    minutes: 0,
  },
  actions: {
    email: true,
    modules: {
      beacon: true,
      data_release: true,
      purge: false,
      lockdown: true,
    },
    lockdown_config: {
      webhook_url: "https://api.sentinel-infra.internal/v1/revoke-all",
      http_method: "POST",
      auth_header: "Bearer sec_live_948f20b38ca1",
      payload_json: '{"action":"TERMINATE_ALL_KEYS","revoke_all_sessions":true,"purge_transient_cache":true}',
    },
    lockdown_executed: false,
    lockdown_executed_at: null,
    data_releases: [
      {
        id: "1AFzbueqVnK-4pQ7LWG07BpKleFWE_eoisLGKBGCnwg4",
        name: "Production_Database_Encryption_Keys.pdf",
        mimeType: "application/pdf",
        size: "204857",
      },
      {
        id: "2BKzcueqVmP-8rT9LWG12CpKleFWE_eoisLGKBGCnxj9",
        name: "Master_Sovereign_Deed_And_Tokens.kdbx",
        mimeType: "application/octet-stream",
        size: "419430",
      },
    ],
  },
};

export const MOCK_LOGS = [
  {
    id: "log-101",
    created_at: "2026-10-02T06:00:00.000Z",
    switch_name: "Primary Infra Kill-Switch",
    switch_id: 37,
    channel: "SYSTEM",
    status: "SUCCESS",
    details: "Pulse check-in verified via cryptographic mobile token. Countdown reset to 12h 00m.",
  },
  {
    id: "log-102",
    created_at: "2026-10-01T18:00:00.000Z",
    switch_name: "Primary Infra Kill-Switch",
    switch_id: 37,
    channel: "EMAIL",
    status: "SUCCESS",
    details: "Dispatched routine grace warning notification to sentinel@shaaf.me.",
  },
  {
    id: "log-103",
    created_at: "2026-09-30T12:00:00.000Z",
    switch_name: "Whistleblower Ledger #04",
    switch_id: 28,
    channel: "DRIVE",
    status: "PENDING",
    details: "Google Drive OAuth token refresh valid. 3 encrypted vault payloads verified.",
  },
  {
    id: "log-104",
    created_at: "2026-09-28T09:14:22.000Z",
    switch_name: "Bastion SSH Revocation Switch",
    switch_id: 19,
    channel: "WEBHOOK",
    status: "SUCCESS",
    details: 'Lockdown endpoint test verified: POST https://api.sentinel-infra.internal/v1/revoke-all [200 OK].',
  },
];
