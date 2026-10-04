Save the following content directly as **`BACKEND_API_SPEC.md`** in your project root or `docs/` folder:

```markdown
# VIGIL: Backend API & Integration Specification for Front-End Agents

This document defines the backend interfaces, database entities, authentication flows, and operational lifecycles required to build, bind, and style the front-end interface for **Vigil**.

---

## 1. System Constants & Environment Configuration

Front-end components must derive external references and callbacks using these environment definitions:

```env
NEXT_PUBLIC_SITE_URL=[https://vigil.shaaf.me](https://vigil.shaaf.me)     # Root application origin
NEXT_PUBLIC_SUPABASE_URL=https://<ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon_key>

```

> **Warning:** Never append paths to `NEXT_PUBLIC_SITE_URL`. It must remain an origin URL without trailing slashes.

---

## 2. Core Data Models & Schemas

### 2.1 The Switch Object (`switches` table)

| Field | Type | Description |
| --- | --- | --- |
| `id` | `BigInt` / `Number` | Unique switch identifier (e.g., `37`). |
| `usr_id` | `UUID` | Supabase user ID referencing `auth.users.id`. |
| `name` | `String` | Human-readable identifier (e.g., `"Primary Infra Kill-Switch"`). |
| `description` | `String?` | Optional operator notes. |
| `status` | `String` | `'ARMED'`, `'EXHAUSTED'`, `'ACKNOWLEDGED'`, `'PAUSED'`. |
| `criticality` | `String` | `'OPERATIONAL'`, `'CRITICAL'`, `'SENTINEL'`. |
| `purpose` | `String` | `'INFRASTRUCTURE'`, `'LEGAL'`, `'PERSONAL'`, `'ENTERPRISE'`. |
| `last_check_in` | `TIMESTAMPTZ` | Timestamp of the most recent heartbeat. |
| `check_in_interval` | `JSON / Object` | Normalized duration string/object. |
| `actions` | `JSONB` | Execution configuration (see schema below). |
| `created_at` | `TIMESTAMPTZ` | Record creation timestamp. |

#### `check_in_interval` JSON Schema

```json
{
  "months": 0,
  "days": 0,
  "hours": 12,
  "minutes": 0
}

```

#### `actions` JSONB Structure

```json
{
  "email": true,
  "modules": {
    "beacon": true,
    "data_release": false,
    "purge": false,
    "lockdown": true
  },
  "lockdown_config": {
    "webhook_url": "[https://api.yourdomain.com/v1/revoke-all](https://api.yourdomain.com/v1/revoke-all)",
    "http_method": "POST",
    "auth_header": "Bearer secret-token-xyz",
    "payload_json": "{\"action\":\"TERMINATE_ALL_KEYS\"}"
  },
  "lockdown_executed": false,
  "lockdown_executed_at": null,
  "data_releases": []
}

```

### 2.2 Beacon Row / Payload Entity (`switch_payloads` or form payload array)

```typescript
interface BeaconRow {
  trust_required: number; // -1 indicates explicit contact exception; 0 to 100 defines general trust tier
  target_contact_id: string | null; // UUID if trust_required === -1; otherwise null
  title?: string;
  notes: string;
  file_metadata: Array<{
    id: string; // Google Drive File ID
    name: string;
    mimeType: string;
    size?: string;
    iconUrl?: string;
  }>;
}

```

### 2.3 Contacts (`contacts` table)

| Field | Type | Description |
| --- | --- | --- |
| `id` | `UUID` | Unique contact ID. |
| `usr_id` | `UUID` | References `auth.users.id`. |
| `name` | `String` | Recipient display name. |
| `email` | `String` | Recipient email address. |
| `phone` | `String?` | Optional phone number. |
| `priority_score` | `Number` | **1 to 10** (1 = Primary Tier, 10 = Deep Reserve). Used by the waterfall cascade. |
| `trust_score` | `Number` | **0 to 100** (Security clearance tier). Used by tiered payload filtering. |

---

## 3. Route Handlers & API Reference

### 3.1 Google OAuth Delegation

#### `GET /api/auth/google`

Initiates the OAuth 2.0 consent flow with full Drive access (`https://www.googleapis.com/auth/drive`).

* **Client Invocation:** Redirect user navigation directly to this endpoint via `<a href="/api/auth/google">` or `window.location.href`.
* **Behavior:**
1. Generates a cryptographic CSRF `state` UUID.
2. Sets an HTTP-only cookie: `google_oauth_state=<state>; Max-Age=600; Path=/; SameSite=Lax`.
3. Redirects to `https://accounts.google.com/o/oauth2/v2/auth` with `access_type=offline`, `prompt=consent`, and the encoded `state`.



#### `GET /api/auth/callback`

Handles OAuth callback, exchanges authorization code for tokens, and persists credentials.

* **Query Parameters:**
* `code`: `string`
* `state`: `string`


* **Responses:**
* **Success:** Redirects to `/dashboard?oauth=success`.
* **Failure:** Redirects to `/dashboard?error=csrf_mismatch` or `/dashboard?error=oauth_rejected`.


* **UI Action:** Display a toast notification on the dashboard reading `"Google Drive integration connected successfully."` if `oauth=success` exists in search parameters.

---

### 3.2 Google Drive Asset Indexing

#### `GET /api/drive/files`

Fetches a list of accessible files from the operator's linked Google Drive to populate file pickers.

* **Headers:** Standard Supabase session cookies.
* **Success Response (200 OK):**
```json
{
  "files": [
    {
      "id": "1AFzbueqVnK-4pQ7LWG07BpKleFWE_eoisLGKBGCnwg4",
      "name": "Production_Database_Encryption_Keys.pdf",
      "mimeType": "application/pdf",
      "size": "204857",
      "modifiedTime": "2026-09-28T12:00:00.000Z"
    }
  ]
}

```


* **Error Response (403 Forbidden - Missing/Expired Link):**
```json
{
  "error": "OAUTH_UNLINKED",
  "message": "Google account not connected or refresh token expired."
}

```


* **UI Action:** When receiving a `403` or `OAUTH_UNLINKED`, display a **"Connect Google Drive"** button linking directly to `/api/auth/google`.

---

### 3.3 Heartbeat Check-in

#### Server Action / Route: `pulseCheckIn(switchId)`

Updates the switch pulse to reset the trip timer.

* **Target:** Supabase client update on table `switches`.
* **Query:**
```javascript
const { data, error } = await supabase
  .from('switches')
  .update({ 
    last_check_in: new Date().toISOString(),
    status: 'ARMED' 
  })
  .eq('id', switchId);

```


* **Expected UI Response:**
* Immediate visual reset of the countdown progress bar.
* Status badge switches to `ARMED` (green).
* Toast: `"Heartbeat acknowledged. Timer reset."`



---

### 3.4 Revalidation & Trip Engine Daemon

#### `GET /api/revalidate`

Public or Cron-authenticated trigger that evaluates expired switches, fires kill-switch webhooks, shares Google Drive files, and dispatches Resend notification emails.

* **Query / Header Options:** Open trigger or secured via `Authorization: Bearer <CRON_SECRET>`.
* **Success Response (200 OK):**
```json
{
  "timestamp": "2026-10-02T06:00:00.000Z",
  "processed_switches": 1,
  "results": [
    {
      "switch_id": 37,
      "status": "EXHAUSTED",
      "lockdown": "EXECUTED",
      "dispatches": 2
    }
  ]
}

```


* **UI Use Case:** Provide a **"Simulate Pulse Expiration"** button in test environments that triggers `fetch('/api/revalidate')` followed by `router.refresh()`.

---

### 3.5 Recipient Acknowledgment Link

#### `GET /api/ack/[token]`

Landing endpoint delivered via email to recipients.

* **Route:** `/api/ack/[token]/route.js`
* **Behavior:** Validates the cryptographic token. If valid:
1. Updates the corresponding switch to `status = 'ACKNOWLEDGED'`.
2. Commits an audit record to `escalation_logs`.
3. Displays an acknowledgment confirmation screen to the recipient.



---

## 4. Front-End Workflow Specifications

```
  ┌──────────────────────────────────────────────────────────┐
  │                 Switch Builder Interface                 │
  └────────────────────────────┬─────────────────────────────┘
                               │
            ┌──────────────────┴──────────────────┐
            ▼                                     ▼
┌───────────────────────────────┐   ┌───────────────────────────────┐
│ Section 1: General & Interval │   │ Section 2: Lockdown Webhook   │
├───────────────────────────────┤   ├───────────────────────────────┤
│ • Name, Purpose, Criticality  │   │ • HTTP Method Selector        │
│ • Custom Interval Spinners:   │   │ • Target URL                  │
│   [Days] [Hours] [Minutes]    │   │ • Bearer Auth Header          │
│                               │   │ • JSON Payload Editor         │
└───────────────────────────────┘   └───────────────────────────────┘
                               │
            ┌──────────────────┴──────────────────┐
            ▼                                     ▼
┌───────────────────────────────┐   ┌───────────────────────────────┐
│ Section 3: Waterfall Escalation│  │ Section 4: Google Drive Vault │
├───────────────────────────────┤   ├───────────────────────────────┤
│ • Contact Multi-Select        │   │ • Launch Drive Picker Modal   │
│ • Clearance Slider (0 - 100)  │   │ • Bind file IDs to disclosure │
│ • Specific Contact Exception  │   │ • Store metadata in row array │
│   Toggle (sets trust to -1)   │   │                               │
└───────────────────────────────┘   └───────────────────────────────┘
                               │
                               ▼
        ┌──────────────────────────────────────────────┐
        │ Atomic Validation & Supabase Insert / Update │
        └──────────────────────────────────────────────┘

```

### 4.1 Switch Creation & State Handling (`CreateSwitchForm.jsx`)

When assembling the submission payload, apply the following state transformations:

1. **Calculate Interval Object:**
Extract numerical inputs for `days`, `hours`, and `minutes`. Serialize into:
```json
{ "months": 0, "days": Number(days), "hours": Number(hours), "minutes": Number(minutes) }

```


2. **Prevent Beacon Row Overwrite:**
When the Google Drive Picker modal returns selected files, use `getValues` (never rely solely on partial `watch` snapshots) to prevent wiping the selected contact or resetting `trust_required` to default values:
```javascript
const handleDriveFilesConfirmed = (selectedFiles) => {
  const currentValues = getValues(`beacon_rows.${activeRowIndex}`);
  update(activeRowIndex, {
    ...currentValues,
    trust_required: Number(currentValues.trust_required ?? 50),
    target_contact_id: currentValues.target_contact_id || null,
    file_metadata: selectedFiles,
  });
};

```


3. **Handle Exceptions vs. Clearance:**
* If the UI switch **"Designated Contact Only"** is toggled **ON**: Set `trust_required = -1` and force user selection of `target_contact_id`.
* If toggled **OFF**: Set `trust_required` to the slider value (0–100) and set `target_contact_id = null`.



---

### 4.2 Dashboard & Status Cards (`/dashboard/switches`)

Display the switch status badge using these mappings:

| Status Code | Badge Color | Label | Interaction Available |
| --- | --- | --- | --- |
| `ARMED` | Emerald / Green | `ARMED` | **Check In**, **Edit**, **Pause** |
| `EXHAUSTED` | Rose / Red | `TRIPPED` | **Re-arm**, **View Audit Logs** |
| `ACKNOWLEDGED` | Amber / Yellow | `HALTED (ACK)` | **Re-arm**, **View Response** |
| `PAUSED` | Slate / Gray | `STANDBY` | **Resume** |

#### Countdown Calculation Logic

The remaining time must be calculated in the UI client using:

```javascript
const tripDeadline = new Date(last_check_in).getTime() + 
  (interval.days * 86400000) + 
  (interval.hours * 3600000) + 
  (interval.minutes * 60000);

const msRemaining = Math.max(0, tripDeadline - Date.now());

```

---

### 4.3 Audit Logging View (`/dashboard/logs`)

Query `escalation_logs` joined with `switches.name`. Render records using a monospaced terminal aesthetic:

* **Columns:**
1. `Timestamp` (`created_at`, formatted to local time).
2. `Switch` (`switch_name` or `switch_id`).
3. `Channel` (`EMAIL`, `WEBHOOK`, `DRIVE`, `SYSTEM`).
4. `Status` (`SUCCESS` = Green, `FAILURE` = Red, `PENDING` = Amber).
5. `Details` (Render expandable JSON viewer or single-line message).



---

## 5. UI Error Handling & Validation Rules

1. **Lockdown Webhook Payload:**
Validate custom payload inputs through `JSON.parse()` before allowing form submission. Reject malformed JSON with an inline error: `"Payload must be valid JSON."`
2. **Lockdown URL:**
Reject URLs matching `http://localhost` or plain HTTP in production. URLs must begin with `https://`.
3. **Contact Exception Integrity:**
If `trust_required === -1`, block form submission unless `target_contact_id` is selected. Prevent orphaned targeted disclosures.
4. **Resend Sender Rule:**
Do not allow users to customize the outbound sender email address in client forms. Dispatches are strictly handled by the backend through `sentinel@shaaf.me`.

```

```