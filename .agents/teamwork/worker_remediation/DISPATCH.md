## 2026-11-02T16:24:59Z
You are a teamwork_worker: Technical Architect & Remediation Specialist.
Working directory: c:\Users\User\Documents\GitHub\CatalogoTyn\.agents\teamwork\worker_remediation\

Mandatory inputs to read before starting:
- c:\Users\User\Documents\GitHub\CatalogoTyn\.agents\teamwork\ORIGINAL_REQUEST.md
- c:\Users\User\Documents\GitHub\CatalogoTyn\PROJECT.md
- c:\Users\User\Documents\GitHub\CatalogoTyn\docs\DATABASE_SCHEMA_AND_MIGRATION.md
- c:\Users\User\Documents\GitHub\CatalogoTyn\docs\KIOSK_CACHING_AND_INTEGRATION_GUIDE.md
- c:\Users\User\Documents\GitHub\CatalogoTyn\.agents\teamwork\reviewer_db\review.md
- c:\Users\User\Documents\GitHub\CatalogoTyn\.agents\teamwork\challenger_stress\handoff.md
- c:\Users\User\Documents\GitHub\CatalogoTyn\.agents\teamwork\challenger_schema\challenge_report.md
- c:\Users\User\Documents\GitHub\CatalogoTyn\src\data\products.js

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

Objective:
Implement the 4 required remediation items from Reviewer 2, plus the operational mitigations from Challenger 1 and clarification from Challenger 2:

1. In `docs/DATABASE_SCHEMA_AND_MIGRATION.md` and migration scripts:
   a. **`body_parts` Entity & Foreign Key**:
      - Add `CREATE TABLE IF NOT EXISTS public.body_parts (...)` in Postgres and SQLite D1 schemas:
        `id VARCHAR(50) PRIMARY KEY`, `name VARCHAR(100) NOT NULL`, `hotspot_id VARCHAR(50) NOT NULL`, `position VARCHAR(50) NOT NULL`, `normal VARCHAR(50) NOT NULL`, `zoom_target VARCHAR(50)`, `zoom_orbit VARCHAR(50)`, `label VARCHAR(10)`, `description TEXT`.
      - In `public.products`, change `body_part` to a foreign key:
        `body_part VARCHAR(50) NOT NULL REFERENCES public.body_parts(id) ON UPDATE CASCADE ON DELETE RESTRICT`.
      - Add seed insertion for the 9 anatomical body parts from `src/data/products.js` (`BODY_PARTS`).
   b. **Full-Text Search & Complete GIN Indexing**:
      - Add GIN index on `uses`: `CREATE INDEX IF NOT EXISTS idx_products_uses_gin ON public.products USING gin(uses);`.
      - Add `pg_trgm` extension and GIN trigram indexes for fast substring search on `name` and `code`:
        `CREATE EXTENSION IF NOT EXISTS pg_trgm;`
        `CREATE INDEX IF NOT EXISTS idx_products_name_trgm ON public.products USING gin(name gin_trgm_ops);`
        `CREATE INDEX IF NOT EXISTS idx_products_code_trgm ON public.products USING gin(code gin_trgm_ops);`
      - Add Spanish FTS generated column and index:
        `ALTER TABLE public.products ADD COLUMN IF NOT EXISTS fts tsvector GENERATED ALWAYS AS (to_tsvector('spanish', name || ' ' || coalesce(short_desc, '') || ' ' || coalesce(description, ''))) STORED;`
        `CREATE INDEX IF NOT EXISTS idx_products_fts ON public.products USING gin(fts);`
      - For Cloudflare D1 SQLite, define the FTS5 virtual table (`products_fts`).
   c. **Cloudflare D1 Updates & `d1_seed.sql` Generation**:
      - Update SQLite DDL with `AFTER UPDATE` triggers for `categories`, `body_parts`, and `products` updating `updated_at`.
      - Use `(strftime('%Y-%m-%dT%H:%M:%SZ', 'now'))` as the default timestamp.
      - Update `generate_migration.cjs` (or author `scripts/generate_migrations.cjs` / `.agents/teamwork/worker_remediation/generate_migrations.cjs`) so it generates BOTH `supabase_seed.sql` and `d1_seed.sql`.
   d. **Administrative RLS Policy**:
      - Add the policy allowing authenticated staff with admin claims to manage products:
        `CREATE POLICY "Allow authenticated staff to manage products" ON public.products FOR ALL TO authenticated USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin') WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');`
   e. Clarify that 9 products have non-null commercial prices in `src/data/products.js` (e.g. A01=$420, B01=$185, C01=$125, etc.), while the other 171 default to NULL ("Consultar Precio").

2. In `docs/KIOSK_CACHING_AND_INTEGRATION_GUIDE.md`:
   - Incorporate the 3 operational mitigations identified by Challenger 1:
     * `[FLAW-01]` Periodic lead sync timer (`setInterval(syncPendingLeads, 300000)`) and `focus` event listener.
     * `[FLAW-02]` Universal vector SVG fallback (`placeholder-product.svg`) in `KioskImage.jsx` instead of assuming individual PNGs are present in thin builds.
     * `[FLAW-03]` PDF compression plan down to ~400 KB per datasheet on Cloudflare R2.
   - Note the URL versioning query param pattern (e.g. `?v=hash` or immutable URLs) to allow instant cache invalidation upon image updates under `max-age=31536000, immutable`.

3. Output files:
   - Update `docs/DATABASE_SCHEMA_AND_MIGRATION.md`
   - Update `docs/KIOSK_CACHING_AND_INTEGRATION_GUIDE.md`
   - Generate `supabase_seed.sql` and `d1_seed.sql` in `.agents/teamwork/worker_remediation/` (and ensure they are tested).
   - Update Obsidian Second Brain note if needed.
   - Deliver handoff report in `c:\Users\User\Documents\GitHub\CatalogoTyn\.agents\teamwork\worker_remediation\handoff.md`.
   - Send completion message to orchestrator.
