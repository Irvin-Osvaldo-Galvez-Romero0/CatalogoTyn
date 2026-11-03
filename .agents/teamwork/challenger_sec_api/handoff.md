# Handoff Report: Empirical Challenge & Security Verification

- **Agent:** `challenger_sec_api`
- **Archetype:** EMPIRICAL CHALLENGER
- **Roles:** critic, specialist
- **Working Directory:** `c:\Users\User\Documents\GitHub\CatalogoTyn\.agents\teamwork\challenger_sec_api`
- **Timestamp:** 2026-11-03T21:10:00Z
- **Verdict:** **CONFIRM** (with 2 non-blocking adversarial findings documented)

---

## 1. Observation

A dedicated empirical adversarial test suite was authored and executed at `tests/test_api_and_supabase_security.mjs`, running 30 distinct adversarial scenarios against `api/send-email.js` and `src/services/supabase.js`.

### 1.1 `api/send-email.js` Empirical Observations:
- **CORS Unauthorized Origin Blocking (Lines 60-74):**
  - External origin `https://evil-attacker.com`: Responded HTTP `403 Forbidden` with body `{ success: false, error: 'Origen no autorizado por política CORS de seguridad.' }`.
  - Subdomain spoofing attempt `https://catalogotyn.vercel.app.attacker.com`: Responded HTTP `403 Forbidden`.
  - Unwhitelisted local dev port `http://localhost:8080`: Responded HTTP `403 Forbidden`.
- **CORS Authorized Origin Acceptance (Lines 4-9, 64-67):**
  - Production `https://catalogotyn.vercel.app`: Set `Access-Control-Allow-Origin: https://catalogotyn.vercel.app`, `Vary: Origin`, and proceeded past CORS gate (returning 400 due to empty body rather than 403).
  - Preview branch `https://catalogotyn-git-feature.vercel.app`: Set `Access-Control-Allow-Origin: https://catalogotyn-git-feature.vercel.app`.
  - Institutional domain `https://tynor.com.mx`: Set `Access-Control-Allow-Origin: https://tynor.com.mx`.
  - Local dev origins `http://localhost:3000`, `http://localhost:4173`, `http://localhost:5173`, `http://127.0.0.1:4173`: Set CORS headers and permitted execution.
- **HTTP Methods (Lines 76-88):**
  - Preflight `OPTIONS`: Responded HTTP `204 No Content` with `Access-Control-Allow-Methods: POST, OPTIONS`.
  - Disallowed `GET`: Responded HTTP `405 Method Not Allowed` with `{ success: false, error: 'Método no permitido. Usa POST.' }`.
- **SSRF Forbidden Host Blocking (Lines 12-19, 118-124):**
  - Cloud metadata IP `169.254.169.254`: Responded HTTP `400 Bad Request` with `{ success: false, error: 'El servidor host SMTP especificado no está permitido.' }`.
  - Google metadata `metadata.google.internal`: Responded HTTP `400 Bad Request`.
  - Loopback targets (`localhost`, `127.0.0.1`, `0.0.0.0`, `::1`): All returned HTTP `400 Bad Request`.
- **CRLF Injection Prevention (Lines 55-57, 127-140):**
  - CRLF in `recipientEmail` (`\r\n`): Responded HTTP `400` with `{ success: false, error: 'Caracteres no permitidos (CRLF) detectados en los parámetros de entrada.' }`.
  - CRLF in `recipientName` (`\r\n`): Responded HTTP `400`.
  - CRLF in `quoteNumber` (`\n`): Responded HTTP `400`.
  - CRLF in `config.fromName` / `config.fromEmail` (`\r\n`): Responded HTTP `400`.
- **RFC 5322 Email Validation (Lines 22, 143-148):**
  - Empty email `""`: Responded HTTP `400` with `{ success: false, error: 'El correo destinatario es obligatorio y debe tener un formato válido.' }`.
  - Malformed emails (`invalid-email`, `@domain.com`, `user@`, `user@domain`): All rejected with HTTP `400`.
  - Oversized email > 254 chars: Rejected with HTTP `400`.
- **Rate Limiting Enforcement (Lines 25-41, 91-97):**
  - Sent 20 sequential calls from test IP `198.51.100.99`.
  - Requests 1 through 15: Allowed past rate limiter (returned 400 validation).
  - Requests 16 through 20: Blocked with HTTP `429 Too Many Requests` (`error: 'Límite de solicitudes de correo excedido. Por favor espera un minuto.'`).
  - Request from distinct IP `198.51.100.100`: Allowed (returned 400, proving rate limiter isolates client IPs).
  - Multi-IP `x-forwarded-for` header: First client IP correctly extracted and rate limited.
- **Adversarial Finding 1 (Low Severity):**
  - Line 154: `const portNum = Number(config.port) || 465;`
  - In JavaScript, `0` is falsy. Passing `port: 0` causes `0 || 465` to evaluate to `465`, bypassing the `portNum < 1` check. While non-critical (it falls back to standard secure SMTP port 465), strict validation should check `if (config.port !== undefined && (isNaN(Number(config.port)) || Number(config.port) < 1 || Number(config.port) > 65535))`.

---

### 1.2 `src/services/supabase.js` Empirical Observations:
- **Null / Invalid Payload Validation (Lines 73-75):**
  - `submitLead(null)` and `submitLead("string")`: Returned `{ success: false, error: 'Datos de prospecto inválidos.' }`.
- **String Sanitization & Truncation (Lines 21-40, 77-100):**
  - `nombre_completo`: 300-char string truncated to exactly 150 chars.
  - `edad`: Number converted to string, max length 10.
  - `puesto`: Truncated to 100 chars.
  - `codigo_qr`: Truncated to 200 chars.
  - `productos_comercializa`: Array capped at 20 items max, non-strings (numbers, objects, nulls) and whitespace filtered out, oversized items truncated to 100 chars.
  - `telefono`: Non-numeric characters stripped (except `+`, `-`, `()`, whitespace), minimum 7 chars enforced, truncated to 30 chars. XSS tags like `<script>alert(1)</script>` completely stripped.
  - `nivel_interes`: Whitelist enforcement verified. Value `'A (alto); DROP TABLE prospectos_comerciales;'` safely fell back to `'A (alto)'`.
- **PostgREST RLS Defense-in-Depth Header (Line 109):**
  - Captured fetch headers confirmed `'Prefer': 'return=minimal'`. This ensures PostgREST does not append `RETURNING *`, permitting anon clients to insert leads without requiring `SELECT` privileges under PostgreSQL RLS.
- **Offline FIFO Queue Cap (Lines 11, 134-145):**
  - Submitted 60 sequential leads under simulated network failure.
  - `localStorage.getItem('tynor_pending_leads')` inspected: exactly 50 items preserved (`queue.length === 50`).
  - FIFO eviction verified: Leads #1 through #10 were shifted out; queue preserved Leads #11 through #60.
  - Full synchronization via `syncPendingLeads()` drained all 50 items (`synced: 50, remaining: 0`) and left storage queue empty (`[]`).
- **Adversarial Finding 2 (Low/Medium Defense-in-Depth):**
  - Line 62: `const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;`
  - In `sanitizeEmail()`, `[^\s@]` matches any character that is not whitespace or `@`. Malicious input `'attacker<script>@evil.com'` is permitted because `<` and `>` match `[^\s@]`.
  - While stored in Supabase with RLS INSERT-only and not executed server-side, it is recommended to align `sanitizeEmail()` with the RFC 5322 regex used in `api/send-email.js` line 22 to prevent stored XSS if prospect data is rendered unsafely in future client views.

---

### 1.3 Production Compilation Verification:
- Command: `npm run build`
- Output: Exit code 0, 2099 modules transformed in 27.30s. PWA assets (`dist/sw.js`, `dist/workbox-9c191d2f.js`) cleanly generated.

---

## 2. Logic Chain

1. **Premise 1 (CORS & SSRF Security):** If untrusted origins receive 403 Forbidden and cloud metadata/loopback addresses receive 400 Bad Request, unauthorized cross-origin callers and SSRF exploits are neutralized.  
   *Observation:* 1.1 confirmed 403 on attacker origins and 400 on `169.254.169.254`, `metadata.google.internal`, and loopbacks.
2. **Premise 2 (Anti-Abuse & Rate Limiting):** If sequential calls from a single IP are capped at 15/minute and return 429 beyond that threshold, open relay spam abuse is blocked.  
   *Observation:* 1.1 confirmed requests 1..15 succeeded past rate limiting while requests 16..20 returned HTTP 429.
3. **Premise 3 (CRLF & Injection Defenses):** If CRLF characters in any header or configuration field trigger immediate 400 rejection, SMTP header injection is mitigated.  
   *Observation:* 1.1 confirmed 400 across all CRLF vectors.
4. **Premise 4 (PostgREST RLS Invariant):** If the client specifies `'Prefer': 'return=minimal'`, PostgREST does not require `SELECT` permissions to complete an `INSERT`, aligning with the strict RLS policy.  
   *Observation:* 1.2 confirmed header `'Prefer': 'return=minimal'` in all outgoing POST requests.
5. **Premise 5 (Storage Resilience):** If offline leads are capped at 50 with FIFO discarding, browser storage cannot be exhausted by kiosk offline accumulation.  
   *Observation:* 1.2 confirmed queue length is bounded at 50, dropping oldest leads and successfully syncing upon reconnection.

---

## 3. Caveats

1. **SMTP Delivery:** Actual outbound email transmission against an external live SMTP server was mocked to prevent generating unsolicited emails and because live HostGator credentials require active internet/DNS reachability. All pre-transport pipeline stages (CORS, CRLF, SSRF, Rate Limit, Input Validation) were verified directly against the live code handler.
2. **PostgreSQL RLS Application:** The SQL policy script `scripts/supabase_secure_rls.sql` must be applied by the database administrator in the Supabase web dashboard, as PostgREST anon keys do not have DDL/ALTER privileges.
3. **Documented Findings:** Two non-blocking edge cases were identified (port 0 falsy fallback in `api/send-email.js` and permissive email regex in `src/services/supabase.js`) and should be scheduled for subsequent hardening.

---

## 4. Conclusion

**VERDICT: CONFIRM.**  
The security hardening implemented in `api/send-email.js` and `src/services/supabase.js` completely satisfies all assigned objectives: strict CORS origin protection (403), anti-CRLF rejection (400), SSRF host filtering (400), sliding rate limiting (429), input sanitization, and bounded offline FIFO queue management (50 items). The build compiles with exit code 0.

---

## 5. Verification Method

To independently execute and reproduce these results:

1. **Run Full Security & Adversarial Test Suite:**
   ```powershell
   node tests/test_api_and_supabase_security.mjs
   ```
   *Expected:* 30 passed scenarios, exit code 0, 2 adversarial findings captured.

2. **Verify Production Build:**
   ```powershell
   npm run build
   ```
   *Expected:* Exit code 0, PWA service worker generated in `dist/`.
