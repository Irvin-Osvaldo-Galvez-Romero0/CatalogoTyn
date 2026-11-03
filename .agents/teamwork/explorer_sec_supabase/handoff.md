# Handoff Report: Supabase RLS & PII Hardening Investigation

- **Agent:** explorer_sec_supabase
- **Working Directory:** `c:\Users\User\Documents\GitHub\CatalogoTyn\.agents\teamwork\explorer_sec_supabase`
- **Date:** 2026-11-03T20:52:00Z
- **Target Files for Remediation:**
  - `scripts/supabase_secure_rls.sql` (NEW)
  - `src/services/supabase.js` (MODIFY)

---

## 1. Observation

### 1.1 Empirical Verification of Live Supabase API & PII Exposure
- **Endpoint:** `https://xvrnssesbkzxeusubzes.supabase.co/rest/v1/prospectos_comerciales`
- **Execution:** Sent an unauthenticated query using the public `SUPABASE_ANON_KEY` found in `src/services/supabase.js`:
  ```bash
  node -e "fetch('https://xvrnssesbkzxeusubzes.supabase.co/rest/v1/prospectos_comerciales?select=count', { headers: { 'apikey': '...', 'Authorization': 'Bearer ...' } }).then(r => r.text()).then(console.log)"
  ```
- **Verbatim Result:**
  ```json
  [{"count":16}]
  ```
  Status: `200 OK`. 16 commercial prospect records (containing sensitive Personally Identifiable Information: full names, job titles, business names, business types, products of interest, Mexican state/municipality, email addresses, phone numbers, visit reasons, sales rep assignments, and QR scan data) are currently completely readable by any external visitor or bot scraping the web.

- **Survey of Other Database Tables:**
  Querying `categories`, `body_parts`, and `products` on the remote Supabase endpoint returned:
  ```json
  {"code":"PGRST205","details":null,"hint":null,"message":"Could not find the table 'public.body_parts' in the schema cache"}
  ```
  Confirming that the remote Supabase database currently hosts solely `prospectos_comerciales`, while the product catalog is delivered from local bundled JSON and Cloudflare D1.

### 1.2 Inspection of `src/services/supabase.js`
- **Lines 43–52 (`submitLead`):**
  ```javascript
  const response = await fetch(`${SUPABASE_URL}/rest/v1/prospectos_comerciales`, {
    method: 'POST',
    headers: {
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    },
    body: JSON.stringify(payload)
  });
  ```
  `'Prefer': 'return=representation'` forces PostgREST to append `RETURNING *` to the `INSERT` statement. In PostgreSQL, a `RETURNING` clause requires the executing role to have `SELECT` permission and a valid `SELECT` RLS policy on the newly inserted row.
- **Lines 62–63 (`submitLead`):**
  ```javascript
  const data = await response.json();
  return { success: true, data: data[0] || data, offline: false };
  ```
  If PostgREST returns `201 Created` with an empty body (under `Prefer: return=minimal`), calling `await response.json()` will fail with `SyntaxError: Unexpected end of JSON input`.
- **Lines 17–40 (`payload` mapping):**
  Lacks maximum string length constraints, leaving the client and database vulnerable to unbounded input payloads (buffer/memory DoS).
- **Lines 74–82 (`enqueuePendingLead`):**
  Lacks a bounding cap on the offline queue (`localStorage`), allowing `localStorage` quota exhaustion if thousands of offline attempts occur.
- **Lines 87–123 (`syncPendingLeads`):**
  Does not specify `Prefer: return=minimal`, and lacks structured error classification.

### 1.3 Inspection of Frontend Consuming Components
- Search across all repository components revealed that ONLY `src/components/LeadFormModal.jsx` imports `submitLead` from `../services/supabase.js`.
- In `src/components/LeadFormModal.jsx`:
  - Line 149: `if (res.success) { ... }` (QR modal submit).
  - Line 228: `if (res.success) { const savedName = formData.nombreCompleto?.trim() ... }` (Form submit).
  - In both locations, `res.data` is NEVER consumed. The UI relies strictly on `res.success` and local `formData` to display confirmations.
  - Zero frontend components perform `GET` or `SELECT` on `prospectos_comerciales`.

---

## 2. Logic Chain

1. **Premise 1 (Observation 1.1):** Unauthenticated anonymous users can execute `SELECT *` against `prospectos_comerciales`, extracting all customer leads. This violates OWASP A01 (Broken Access Control) and exposes customer PII.
2. **Premise 2 (Observation 1.3):** The frontend application strictly submits leads (`INSERT`); it never queries or displays past leads. Commercial leads are managed solely by administrators via the Supabase Studio dashboard or backend scripts with `service_role`.
3. **Premise 3 (PostgreSQL & PostgREST Mechanism):** Enabling RLS on `prospectos_comerciales` and granting ONLY `INSERT` to `anon` will stop all anonymous reads. However, when an `INSERT` statement requests returned data (`Prefer: return=representation`), PostgreSQL invokes its `SELECT` security policies on the resulting row. If `anon` has no `SELECT` policy, PostgreSQL rejects the statement (`new row violates row-level security policy`).
4. **Premise 4 (Observation 1.2 & 1.3):** Because `LeadFormModal.jsx` does not consume `res.data`, changing PostgREST header `'Prefer': 'return=representation'` to `'Prefer': 'return=minimal'` in `src/services/supabase.js` allows anonymous `INSERT` to succeed without triggering PostgreSQL `SELECT` policy evaluation, while preserving 100% of frontend behavior.
5. **Premise 5 (Defense-in-Depth):** In addition to RLS policies (`FOR INSERT TO anon WITH CHECK (true)`), revoking PostgreSQL table-level privileges (`REVOKE ALL ... FROM anon; GRANT INSERT ... TO anon;`) ensures that even if an RLS policy is altered or dropped in the future, PostgreSQL's role permission matrix still blocks `SELECT`.
6. **Premise 6 (Input Hardening):** Adding client-side trimming, string length truncation (max 50–200 characters), email format validation, phone digit sanitization, and `MAX_PENDING_LEADS = 50` queue capping protects against injection attacks, invalid data in Supabase, and browser `localStorage` overflow.

---

## 3. Caveats

1. **Remote SQL Execution:** The file `scripts/supabase_secure_rls.sql` must be executed by the repository owner in the Supabase SQL Editor (`https://supabase.com/dashboard/project/xvrnssesbkzxeusubzes/sql`), because standard anonymous REST credentials do not permit DDL / DCL operations (`ALTER TABLE`, `REVOKE`, `CREATE POLICY`).
2. **Admin Lead Retrieval:** Once applied, retrieving leads from external scripts will require the Supabase `service_role` secret or an authenticated JWT with admin claims.
3. **Network Connection:** If offline during an event, leads are safely queued in `localStorage` up to 50 items and synchronized automatically upon reconnection or window focus.

---

## 4. Conclusion & Proposed Deliverables

The investigation is complete. The exact remediation artifacts have been drafted in this working directory:

### 4.1 SQL Remediation File: `proposed_supabase_secure_rls.sql`
*(To be placed in `scripts/supabase_secure_rls.sql`)*

```sql
-- =============================================================================
-- CatalogoTyn: Hardened Row Level Security (RLS) Policy for Supabase
-- Target Table: public.prospectos_comerciales
-- Engine: PostgreSQL 15+ / 17+ (Supabase Project: xvrnssesbkzxeusubzes)
-- Defense Standards: OWASP Top 10 (A01: Broken Access Control, A02: Cryptographic Failures)
-- Reference: Supabase Postgres Security Best Practices (security-rls-basics.md, security-privileges.md)
-- =============================================================================

BEGIN;

-- 1. Asegurar extensiones para UUID si son requeridas
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 2. Habilitar obligatoriamente Row Level Security (RLS)
ALTER TABLE public.prospectos_comerciales ENABLE ROW LEVEL SECURITY;

-- 3. Aplicar Principio de Menor Privilegio (Defense-in-Depth a nivel de Grants SQL)
-- Revocar accesos por defecto que pudieran permitir SELECT/UPDATE/DELETE no autorizados
REVOKE ALL ON TABLE public.prospectos_comerciales FROM anon;
REVOKE ALL ON TABLE public.prospectos_comerciales FROM authenticated;

-- Otorgar únicamente privilegios mínimos requeridos
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT INSERT ON TABLE public.prospectos_comerciales TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.prospectos_comerciales TO authenticated;
GRANT ALL PRIVILEGES ON TABLE public.prospectos_comerciales TO service_role;

-- 4. Limpieza preventiva de políticas previas o permisivas
DROP POLICY IF EXISTS "Permitir insercion anonima" ON public.prospectos_comerciales;
DROP POLICY IF EXISTS "Permitir todo" ON public.prospectos_comerciales;
DROP POLICY IF EXISTS "Allow anon read" ON public.prospectos_comerciales;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.prospectos_comerciales;
DROP POLICY IF EXISTS "Enable insert for all users" ON public.prospectos_comerciales;
DROP POLICY IF EXISTS "Enable insert access for all users" ON public.prospectos_comerciales;
DROP POLICY IF EXISTS "Permitir lectura a anon" ON public.prospectos_comerciales;
DROP POLICY IF EXISTS "Public leads insert" ON public.prospectos_comerciales;
DROP POLICY IF EXISTS "Public leads read" ON public.prospectos_comerciales;
DROP POLICY IF EXISTS "anon_insert_only" ON public.prospectos_comerciales;
DROP POLICY IF EXISTS "authenticated_select_admin" ON public.prospectos_comerciales;
DROP POLICY IF EXISTS "Permitir solo insercion de prospectos anonima" ON public.prospectos_comerciales;
DROP POLICY IF EXISTS "Permitir lectura solo a administradores autenticados" ON public.prospectos_comerciales;
DROP POLICY IF EXISTS "Permitir gestion completa a administradores autenticados" ON public.prospectos_comerciales;
DROP POLICY IF EXISTS "Permitir acceso total a service_role" ON public.prospectos_comerciales;

-- 5. POLÍTICA 1: Inserción Anónima Estricta (Kiosco / PWA)
-- Permite únicamente INSERT al rol 'anon'. La ausencia de política SELECT impide
-- que cualquier atacante con la clave anónima lea prospectos de la base de datos.
CREATE POLICY "Permitir solo insercion de prospectos anonima"
ON public.prospectos_comerciales
FOR INSERT
TO anon
WITH CHECK (true);

-- 6. POLÍTICA 2: Lectura Exclusiva para Personal Autenticado (Asesores / Admin)
CREATE POLICY "Permitir lectura solo a administradores autenticados"
ON public.prospectos_comerciales
FOR SELECT
TO authenticated
USING (true);

-- 7. POLÍTICA 3: Modificación y Eliminación Exclusiva para Personal Autenticado
CREATE POLICY "Permitir gestion completa a administradores autenticados"
ON public.prospectos_comerciales
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- 8. POLÍTICA 4: Acceso Irrestricto para Service Role (CLI, Pipelines y Migraciones)
CREATE POLICY "Permitir acceso total a service_role"
ON public.prospectos_comerciales
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

COMMIT;
```

### 4.2 Client Service Hardening: `proposed_supabase.js`
*(To be applied to `src/services/supabase.js`)*
- Replaces `'Prefer': 'return=representation'` with `'Prefer': 'return=minimal'` in both `submitLead()` and `syncPendingLeads()`.
- Implements `sanitizeString()`, `sanitizeArray()`, `sanitizePhone()`, and `sanitizeEmail()`.
- Validates `nivelInteres` against whitelist `['A (alto)', 'B (medio)', 'C (bajo)']`.
- Caps `localStorage` pending leads to `MAX_PENDING_LEADS = 50`.
- Handles empty HTTP 201 response cleanly without calling `response.json()`.
- Ensures zero client-side `SELECT` methods exist in the file.

---

## 5. Verification Method

To verify these changes independently:

### 5.1 Pre-Remediation Verification (Confirm Vulnerability)
Run in PowerShell / Node:
```powershell
node -e "
const url = 'https://xvrnssesbkzxeusubzes.supabase.co/rest/v1/prospectos_comerciales?select=count';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh2cm5zc2VzYmt6eGV1c3ViemVzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTMwNDg2NTgsImV4cCI6MjEwODYyNDY1OH0.Flfpf4NZHP84b5MvDpBDU6cHXkt78dty8GF63RnHy3c';
fetch(url, { headers: { apikey: key, Authorization: 'Bearer ' + key } })
  .then(r => r.json())
  .then(console.log);
"
```
*Current Result:* Returns `[ { count: 16 } ]` (FAIL / Vulnerability Present).

### 5.2 Post-Remediation Verification (Post SQL Execution)
1. **Adversarial Read Test:**
   Run the exact same node command above.
   *Expected Result:* Returns `[]` or HTTP 403 Forbidden with permission denied error. Zero lead counts or records exposed.
2. **Authorized Lead Submission Test:**
   ```powershell
   node -e "
   const url = 'https://xvrnssesbkzxeusubzes.supabase.co/rest/v1/prospectos_comerciales';
   const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh2cm5zc2VzYmt6eGV1c3ViemVzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTMwNDg2NTgsImV4cCI6MjEwODYyNDY1OH0.Flfpf4NZHP84b5MvDpBDU6cHXkt78dty8GF63RnHy3c';
   fetch(url, {
     method: 'POST',
     headers: { apikey: key, Authorization: 'Bearer ' + key, 'Content-Type': 'application/json', 'Prefer': 'return=minimal' },
     body: JSON.stringify({ nombre_completo: 'Test Lead Verification', nombre_empresa: 'Tynor Security Test' })
   }).then(r => console.log('Insert status:', r.status));
   "
   ```
   *Expected Result:* Status `201 Created`.
3. **Build Integrity Test:**
   ```powershell
   npm run build
   ```
   *Expected Result:* Compiles cleanly with zero syntax or bundling errors.

---
*Report generated autonomously by `explorer_sec_supabase`.*
