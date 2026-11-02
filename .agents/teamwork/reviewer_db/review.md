# Deep Technical & Adversarial Review: Database Schema & Migration Specification

**Reviewer:** Database & Schema Reviewer (`reviewer_db`)  
**Target Deliverables:**
- `docs/DATABASE_SCHEMA_AND_MIGRATION.md`
- `.agents/teamwork/worker_deliverables/supabase_seed.sql`
- `.agents/teamwork/worker_deliverables/generate_migration.cjs`
- Relational schema vs `src/data/products.js` (180 products, 10 categories, 9 body parts)
- Live Database Engine: Supabase PostgreSQL 17.11 (`xvrnssesbkzxeusubzes`)
**Verdict:** **REQUEST_CHANGES**

---

## 1. Executive Summary

A comprehensive forensic and adversarial review was conducted across the database schema design, DDL scripts, migration generation tooling, and SQL seed files for both Supabase (PostgreSQL 17) and Cloudflare D1 (SQLite).

### Key Positive Validations
- **100% Data Fidelity on 180 Products:** Automated verification confirmed that all 180 products from `src/data/products.js` are accurately extracted and represented in `supabase_seed.sql` with zero field truncations, zero missing SKUs, accurate line classification (132 ORTOPEDIA, 27 Deportiva, 21 REHABILITACION), 172 PDF links, 1 video link, and 180 dual-tier WebP CDN URLs.
- **Syntactic & DDL Execution Success on Postgres 17:** The PostgreSQL DDL, check constraints, GIN indexes, timestamp triggers, and RLS policies were executed and validated on the live Supabase project (`xvrnssesbkzxeusubzes`, Postgres 17.11) within a transactional sandbox (`BEGIN; ... ROLLBACK;`).
- **SQL Escaping & Robustness:** Single-quote escaping (e.g. product `C05` with `''D''` in features) and newline preservation (e.g. product `C01` with `\n\n` in description) were verified to parse cleanly without SQL injection or syntax breakage.
- **Zero Orphaned Foreign Keys:** All 180 products map to valid category IDs in `public.categories`.

### Critical & Major Deficiencies Requiring Changes
1. **Omission of `body_parts` Entity & Foreign Key (Major):** While `categories` has an authoritative relational table, `body_parts` was completely omitted from the schema. In `src/data/products.js`, `BODY_PARTS` contains 9 anatomical regions with 3D model hotspot coordinates (`position`, `normal`, `zoomTarget`, `zoomOrbit`). In `products`, `body_part` is an unconstrained `VARCHAR(50)` without a foreign key or CHECK constraint.
2. **Missing Full-Text Search (FTS) & Missing GIN on `uses` (Major):** The indexing strategy omits full-text search capabilities entirely (no `tsvector` column/index, no `pg_trgm` trigram index, and no SQLite `FTS5` virtual table). Furthermore, `uses` (medical indications) lacks a GIN index despite `sizes` and `features` having GIN indexes.
3. **Cloudflare D1 Discrepancies & Missing `d1_seed.sql` Deliverable (Major):**
   - `generate_migration.cjs` defines an unused function `escapeJsonSqlite` but never generates `d1_seed.sql`, contradicting the claim in `docs/DATABASE_SCHEMA_AND_MIGRATION.md` Section 4.
   - The SQLite DDL in Section 3 omits `UPDATE` triggers for `updated_at`, leaving timestamps permanently stale upon row modification.
   - Section 5.2 references non-existent files `./scripts/d1_schema.sql` and `./scripts/d1_seed.sql`.
4. **RLS Administrative Lockout Risk (Moderate):** RLS policies allow `SELECT` for `anon` and `authenticated` where `is_active = true`, but restrict all writes to `service_role`. Authenticated dashboard users (e.g. store administrators) will be unable to view inactive products or update catalog entries without leaking the `service_role` key to client apps.

---

## 2. Review Findings by Dimension

### Finding 1 [Major]: Missing `body_parts` Table and Relational Constraint
- **What:** In `docs/DATABASE_SCHEMA_AND_MIGRATION.md` and `supabase_seed.sql`, there is no `public.body_parts` table. In `public.products`, `body_part` is declared simply as `VARCHAR(50) NOT NULL` (Postgres) / `TEXT NOT NULL` (SQLite).
- **Where:** `docs/DATABASE_SCHEMA_AND_MIGRATION.md` (Lines 39, 99, 218), `PROJECT.md` (Line 85), `src/data/products.js` (Lines 54–150).
- **Why it matters:**
  - In `src/data/products.js`, `BODY_PARTS` is an authoritative entity containing 9 items (`hombro`, `mano`, `rodilla`, `cuello`, `clavicula`, `brazo`, `espalda`, `pierna`, `tobillo`) with 3D model coordinates (`position`, `normal`, `zoomTarget`, `zoomOrbit`, `label`, `desc`) used by `AnatomyView.jsx` and `AttractMode.jsx`.
  - Without a foreign key constraint or `CHECK (body_part IN ('hombro', 'mano', 'rodilla', 'cuello', 'clavicula', 'brazo', 'espalda', 'pierna', 'tobillo'))`, any typo or invalid string inserted into `products.body_part` breaks the 3D anatomical viewer.
  - Migrating the catalog to an online database leaves the 3D anatomical coordinates orphaned in client code.
- **Required Fix:**
  1. Add `CREATE TABLE IF NOT EXISTS public.body_parts (...)` with columns `id VARCHAR(50) PRIMARY KEY`, `name VARCHAR(100) NOT NULL`, `hotspot_id VARCHAR(50) NOT NULL`, `position VARCHAR(50) NOT NULL`, `normal VARCHAR(50) NOT NULL`, `zoom_target VARCHAR(50)`, `zoom_orbit VARCHAR(50)`, `label VARCHAR(10)`, `description TEXT`.
  2. Add foreign key `REFERENCES public.body_parts(id) ON UPDATE CASCADE ON DELETE RESTRICT` on `public.products(body_part)`.
  3. Include `body_parts` seed insertion in `generate_migration.cjs` and `supabase_seed.sql`.

---

### Finding 2 [Major]: Complete Absence of Full-Text Search (FTS) & Missing GIN on `uses`
- **What:** The indexing strategy in Section 2 & 3 does not include any full-text search index, and fails to index the `uses` JSONB column with GIN.
- **Where:** `docs/DATABASE_SCHEMA_AND_MIGRATION.md` (Lines 125–135, 238–244).
- **Why it matters:**
  - Objective 2 explicitly specifies: *"Verify indexing strategy: B-tree indexes for lookups (cat_id, body_part, is_active), GIN indexes for JSONB search/filter, and full-text search capabilities."*
  - The kiosk UI in `src/components/CatalogView.jsx` (Line 25) performs search: `p.name.toLowerCase().includes(q) || p.code.toLowerCase().includes(q)`.
  - In PostgreSQL, standard B-tree indexes cannot accelerate substring searches (`ILIKE '%term%'`). Querying without a trigram (`pg_trgm`) index results in full table sequential scans.
  - Furthermore, `uses` contains medical indications (e.g. *"Tratamiento conservador de fracturas de clavícula"*, *"Esguinces de rodilla"*). Clinicians and kiosk users search by pathology. Having GIN on `features` and `sizes` while omitting `uses` is an architectural inconsistency.
- **Required Fix:**
  1. Add GIN index on `uses`:
     ```sql
     CREATE INDEX IF NOT EXISTS idx_products_uses_gin ON public.products USING gin(uses);
     ```
  2. Enable `pg_trgm` extension and create trigram indexes for fast substring search on `name` and `code`:
     ```sql
     CREATE EXTENSION IF NOT EXISTS pg_trgm;
     CREATE INDEX IF NOT EXISTS idx_products_name_trgm ON public.products USING gin(name gin_trgm_ops);
     CREATE INDEX IF NOT EXISTS idx_products_code_trgm ON public.products USING gin(code gin_trgm_ops);
     ```
  3. Optionally, add full-text search generated column for Spanish stemming:
     ```sql
     ALTER TABLE public.products ADD COLUMN IF NOT EXISTS fts tsvector 
       GENERATED ALWAYS AS (to_tsvector('spanish', name || ' ' || coalesce(short_desc, '') || ' ' || coalesce(description, ''))) STORED;
     CREATE INDEX IF NOT EXISTS idx_products_fts ON public.products USING gin(fts);
     ```
  4. For Cloudflare D1, document an FTS5 virtual table (`CREATE VIRTUAL TABLE products_fts USING fts5(...)`).

---

### Finding 3 [Major]: Cloudflare D1 Discrepancies, Missing Trigger & Missing Seed File
- **What:**
  1. `generate_migration.cjs` does NOT generate `d1_seed.sql`, despite the documentation claiming it outputs both PostgreSQL and SQLite seeds.
  2. `DATABASE_SCHEMA_AND_MIGRATION.md` Section 5.2 instructs executing `./scripts/d1_schema.sql` and `./scripts/d1_seed.sql`, which do not exist.
  3. The D1 SQLite schema in Section 3 lacks an `AFTER UPDATE` trigger for `updated_at`.
- **Where:** `docs/DATABASE_SCHEMA_AND_MIGRATION.md` (Lines 200–244, 250, 360–374), `.agents/teamwork/worker_deliverables/generate_migration.cjs` (Lines 17–20, 66).
- **Why it matters:**
  - Teams following the Sovereign Edge architecture (Cloudflare D1) have no ready-to-run seed script.
  - Tested on Python SQLite 3.49.1 (`.agents/teamwork/reviewer_db/test_sqlite_ddl.py`): executing `UPDATE products SET name = 'X' WHERE code = '101'` left `updated_at` unchanged because no trigger exists.
  - In SQLite, default `(datetime('now'))` outputs `YYYY-MM-DD HH:MM:SS` rather than standard ISO 8601 UTC strings `YYYY-MM-DDTHH:MM:SSZ`.
- **Required Fix:**
  1. Add SQLite `AFTER UPDATE` triggers in D1 DDL:
     ```sql
     CREATE TRIGGER IF NOT EXISTS trigger_categories_updated_at
     AFTER UPDATE ON categories FOR EACH ROW
     BEGIN
         UPDATE categories SET updated_at = (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')) WHERE id = NEW.id;
     END;

     CREATE TRIGGER IF NOT EXISTS trigger_products_updated_at
     AFTER UPDATE ON products FOR EACH ROW
     BEGIN
         UPDATE products SET updated_at = (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')) WHERE code = NEW.code;
     END;
     ```
  2. Use `(strftime('%Y-%m-%dT%H:%M:%SZ', 'now'))` as the default for `created_at` and `updated_at` in SQLite.
  3. Update `generate_migration.cjs` to emit `d1_seed.sql` alongside `supabase_seed.sql`.
  4. Place the generated scripts in a standardized directory (e.g. `scripts/` or `worker_deliverables/`) matching the documentation paths.

---

### Finding 4 [Minor]: RLS Administrative Policy Recommendation
- **What:** PostgreSQL RLS policies restrict all non-service role access (including `authenticated`) to read-only on `is_active = true`.
- **Where:** `docs/DATABASE_SCHEMA_AND_MIGRATION.md` (Lines 160–186).
- **Why it matters:** If an administrator logs into a web-based CMS via Supabase Auth (`supabase.auth.signInWithPassword`), their session is assigned the `authenticated` role. They will receive permission denied errors when trying to insert, update, or view inactive products. Developers might be tempted to embed the `service_role` key in frontend code to bypass this, causing a critical security vulnerability.
- **Required Fix:** Add an administrative RLS policy checking user claims or roles:
  ```sql
  CREATE POLICY "Allow authenticated staff to manage products"
      ON public.products FOR ALL
      TO authenticated
      USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
      WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
  ```

---

## 3. Verified Claims Matrix

| Claim / Requirement | Verification Method | Result | Evidence / Notes |
|---|---|---|---|
| Total Products = 180 | Script `verify_seed_fidelity.cjs` | **PASS** | Exactly 180 products extracted from `src/data/products.js` into SQL. |
| Category FK Integrity | Node script & Postgres DDL check | **PASS** | 10 categories inserted; all 180 products reference valid category IDs. Zero orphan FKs. |
| Commercial Lines Distribution | Group by query on source and seed | **PASS** | ORTOPEDIA: 132, Deportiva: 27, REHABILITACION: 21. Matches check constraint. |
| Media Asset URL Generation | Field-by-field verification script | **PASS** | 172 PDF URLs, 8 NULLs; 1 MP4 video URL (L04), 179 NULLs; 180 thumb/detail WebP URLs. |
| Price & Stock Nullability | Python & Node field inspection | **PASS** | 9 products with numeric prices (125–420); 171 products with `NULL`. Stock defaults to 0. |
| Special Character Escaping | String parsing & PostgreSQL test | **PASS** | Escaped single quotes (`''D''` in C05) and literal newlines (in C01) parsed without error. |
| Live PostgreSQL 17 Execution | Supabase MCP `execute_sql` | **PASS** | DDL and sample seed statements executed cleanly in live Supabase Postgres 17.11. |
| Live SQLite D1 Execution | Python `sqlite3` test script | **PASS** | Table creation, FK validation, and `json_valid()` constraints passed in SQLite 3.49.1. |
| `body_parts` Entity Presence | Grep and AST inspection | **FAIL** | `body_parts` table omitted; FK constraint missing on `products.body_part`. |
| Full-Text Search Indexing | DDL inspection | **FAIL** | No `tsvector`, `pg_trgm`, or `FTS5` indexes implemented. |
| Cloudflare D1 Seed Generation | File existence & script inspection | **FAIL** | `generate_migration.cjs` does not write `d1_seed.sql`. Script files missing. |

---

## 4. Adversarial Stress Test & Failure Modes

### Stress Test 1: Single Quote Injection via Product Features
- **Attack Scenario:** Product `C05` features string contains: `"Hebillas de anillo en 'D' con amortiguador axilar suave"`. If unescaped, this breaks SQL string literal parsing or enables SQL injection.
- **Result:** **PASSED.** `escapeSql` and `escapePgJson` correctly replaced `'` with `''`, producing `'["Hebillas de anillo en ''D'' con amortiguador axilar suave",...]'::jsonb`. Validated against PostgreSQL 17 engine.

### Stress Test 2: Multi-line String Preservation
- **Attack Scenario:** Product `C01` and `C06` contain literal `\n\n` escape sequences in their `desc` field. In PostgreSQL with `standard_conforming_strings = on` (default in Postgres 9.1+), literal newlines must not cause parser syntax errors.
- **Result:** **PASSED.** Verified on live Supabase Postgres 17. The parser accepted multi-line text cleanly.

### Stress Test 3: Foreign Key Integrity Violation on Invalid Category
- **Attack Scenario:** Attempting to insert a product with an invalid `cat_id` (e.g. `'ortopedia_general'`).
- **Result:** **PASSED.** Both PostgreSQL and SQLite (`PRAGMA foreign_keys = ON`) rejected the insert with an integrity error: `FOREIGN KEY constraint failed`.

### Stress Test 4: Invalid JSON Array in `sizes` / `colors` (SQLite D1)
- **Attack Scenario:** Inserting malformed JSON text (e.g. `'[CH, M, G]'` unquoted) into `sizes` on Cloudflare D1.
- **Result:** **PASSED.** SQLite CHECK constraint `CHECK (json_valid(sizes))` immediately raised `CHECK constraint failed: json_valid(sizes)`.

### Stress Test 5: Update Trigger Stagnation on SQLite D1
- **Attack Scenario:** Updating a product's price or description on SQLite D1.
- **Result:** **FAILED (Failure Mode Confirmed).** Because no trigger was defined in D1 DDL, `updated_at` remained identical to `created_at` after the update.

---

## 5. Required Action Items to Reach Approval

To transition this deliverable to **APPROVED**, the implementation team must address the following:

1. **Implement `body_parts` Table & Foreign Key:**
   - Add `public.body_parts` table in Postgres and SQLite DDL.
   - Add foreign key `REFERENCES public.body_parts(id)` on `products.body_part`.
   - Seed the 9 body parts from `src/data/products.js` (`BODY_PARTS`).
2. **Implement Full-Text & Substring Search Indexing:**
   - Add GIN index on `uses`: `idx_products_uses_gin`.
   - Add `pg_trgm` extension and GIN trigram indexes on `products.name` and `products.code`.
   - Add Spanish FTS index on `(name || ' ' || coalesce(short_desc, ''))`.
3. **Generate Complete Cloudflare D1 Artifacts:**
   - Extend `generate_migration.cjs` to produce both `supabase_seed.sql` and `d1_seed.sql`.
   - Add `AFTER UPDATE` triggers for `updated_at` in the SQLite DDL.
   - Use `strftime('%Y-%m-%dT%H:%M:%SZ', 'now')` for SQLite timestamps.
4. **Clarify RLS Administration Strategy:**
   - Add administrative RLS policy for authenticated staff based on Supabase JWT claims.
