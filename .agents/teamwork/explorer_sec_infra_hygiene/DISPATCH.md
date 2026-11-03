# Task Assignment: Infra, Headers, Dependencies & Asset Integrity Exploration

- Working Directory: c:\Users\User\Documents\GitHub\CatalogoTyn\.agents\teamwork\explorer_sec_infra_hygiene
- Original Request: c:\Users\User\Documents\GitHub\CatalogoTyn\.agents\teamwork\ORIGINAL_REQUEST.md
- Plan Context: c:\Users\User\.gemini\antigravity\brain\23b868c2-8b12-4d48-9720-e9e2af9378f8\plan_seguridad_integral_ecc.md

## Objective
Investigate infrastructure security, dependency hygiene, and asset integrity:
1. Read ORIGINAL_REQUEST.md and the plan context thoroughly.
2. Inspect root configuration for Vercel deployment:
   - Check if `vercel.json` exists or needs to be created.
   - Specify OWASP security headers: `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `Permissions-Policy`, `Strict-Transport-Security`, and an accurate `Content-Security-Policy` that allows necessary domains (Supabase, Google Fonts, Unpkg if used, Vercel).
3. Inspect `src/data/products.js.bak`:
   - Verify whether any file in the project imports or references `.bak`.
   - Confirm safe deletion requirements.
4. Inspect dependencies and `package.json`:
   - Analyze current `npm audit` report (31 vulnerabilities reported in plan).
   - Check which fixes are non-breaking (`npm audit fix`) vs risky for Vite / Electron / React.
5. Inspect `docs/TynorManuales.docx` and `docs/TynorManuales.pdf`:
   - Verify presence, exact size, and state to ensure preservation instructions are respected.
6. Document findings and recommendations in `c:\Users\User\Documents\GitHub\CatalogoTyn\.agents\teamwork\explorer_sec_infra_hygiene\handoff.md`.

## 2026-11-03T20:46:04Z
[Message from parent: 1b8e06ed-5cec-498d-83c5-ecafc361fb21]
You are explorer_sec_infra_hygiene. Your working directory is c:\Users\User\Documents\GitHub\CatalogoTyn\.agents\teamwork\explorer_sec_infra_hygiene.
You must read:
1. c:\Users\User\Documents\GitHub\CatalogoTyn\.agents\teamwork\ORIGINAL_REQUEST.md
2. c:\Users\User\.gemini\antigravity\brain\23b868c2-8b12-4d48-9720-e9e2af9378f8\plan_seguridad_integral_ecc.md
3. c:\Users\User\Documents\GitHub\CatalogoTyn\.agents\teamwork\explorer_sec_infra_hygiene\DISPATCH.md

Execute your task as defined in DISPATCH.md:
- Analyze root configurations and design vercel.json with OWASP security headers (X-Frame-Options: DENY, X-Content-Type-Options: nosniff, Referrer-Policy, Permissions-Policy, HSTS, Content-Security-Policy accommodating Supabase, Google Fonts, etc.).
- Inspect src/data/products.js.bak to confirm it is safe to delete and has no imports.
- Analyze package.json, package-lock.json, and audit vulnerabilities; assess npm audit fix impact on build and dependencies.
- Inspect docs/TynorManuales.docx and docs/TynorManuales.pdf; record their exact state/size and verify preservation requirements.
- Write your findings and recommendations to c:\Users\User\Documents\GitHub\CatalogoTyn\.agents\teamwork\explorer_sec_infra_hygiene\handoff.md.
- Send a completion message back to parent.
