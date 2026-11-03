# Task Assignment: Supabase RLS & PII Security Exploration

- Working Directory: c:\Users\User\Documents\GitHub\CatalogoTyn\.agents\teamwork\explorer_sec_supabase
- Original Request: c:\Users\User\Documents\GitHub\CatalogoTyn\.agents\teamwork\ORIGINAL_REQUEST.md
- Plan Context: c:\Users\User\.gemini\antigravity\brain\23b868c2-8b12-4d48-9720-e9e2af9378f8\plan_seguridad_integral_ecc.md

## Objective
Investigate the Supabase integration and PII exposure in Catálogo Tynor:
1. Read ORIGINAL_REQUEST.md and the plan context thoroughly.
2. Inspect `src/services/supabase.js` and all components referencing Supabase (e.g., contact/lead capture forms).
3. Identify all queries touching `prospectos_comerciales`.
4. Determine the exact requirements for `scripts/supabase_secure_rls.sql` to enforce:
   - RLS enabled on `prospectos_comerciales`.
   - `anon` allowed ONLY `INSERT` (with check true).
   - Strict prohibition of `SELECT`, `UPDATE`, `DELETE` for `anon`.
   - Admin/authenticated read policy.
5. Identify required client modifications in `src/services/supabase.js` (e.g. disabling any client-side `SELECT` for leads, adding input sanitization/trimming/length limits).
6. Document findings and clear recommendations in `c:\Users\User\Documents\GitHub\CatalogoTyn\.agents\teamwork\explorer_sec_supabase\handoff.md`.


## 2026-11-03T20:45:51Z
You are explorer_sec_supabase. Your working directory is c:\Users\User\Documents\GitHub\CatalogoTyn\.agents\teamwork\explorer_sec_supabase.
You must read:
1. c:\Users\User\Documents\GitHub\CatalogoTyn\.agents\teamwork\ORIGINAL_REQUEST.md
2. c:\Users\User\.gemini\antigravity\brain\23b868c2-8b12-4d48-9720-e9e2af9378f8\plan_seguridad_integral_ecc.md
3. c:\Users\User\Documents\GitHub\CatalogoTyn\.agents\teamwork\explorer_sec_supabase\DISPATCH.md

Execute your task as defined in DISPATCH.md:
- Analyze Supabase usage in src/services/supabase.js and frontend components.
- Inspect how prospectos_comerciales is used.
- Formulate the exact SQL for scripts/supabase_secure_rls.sql (enabling RLS, dropping old permissive policies, creating INSERT-only policy for anon, restricting SELECT to authenticated/service_role).
- Recommend exact client sanitization and lockdown in src/services/supabase.js.
- Write your findings and recommendations to c:\Users\User\Documents\GitHub\CatalogoTyn\.agents\teamwork\explorer_sec_supabase\handoff.md.
- Send a completion message back to parent.
