# Task Assignment: AppSec Hardening Implementation (Worker)

- Working Directory: c:\Users\User\Documents\GitHub\CatalogoTyn\.agents\teamwork\worker_sec_implementation
- Original Request: c:\Users\User\Documents\GitHub\CatalogoTyn\.agents\teamwork\ORIGINAL_REQUEST.md
- Plan Context: c:\Users\User\.gemini\antigravity\brain\23b868c2-8b12-4d48-9720-e9e2af9378f8\plan_seguridad_integral_ecc.md

## Reference Reports
The three Explorers have synthesized exact code implementations in:
1. c:\Users\User\Documents\GitHub\CatalogoTyn\.agents\teamwork\explorer_sec_supabase\handoff.md
2. c:\Users\User\Documents\GitHub\CatalogoTyn\.agents\teamwork\explorer_sec_auth_email\handoff.md
3. c:\Users\User\Documents\GitHub\CatalogoTyn\.agents\teamwork\explorer_sec_infra_hygiene\handoff.md

## Exclusive Write Ownership
You exclusively own and will modify/create:
1. `scripts/supabase_secure_rls.sql` (NEW - write the comprehensive SQL script)
2. `src/services/supabase.js` (MODIFY - sanitize strings, return=minimal, handle 201 cleanly, cap pending queue to 50, ensure zero client-side SELECT)
3. `api/send-email.js` (MODIFY - strict CORS whitelist, rejectUnauthorized: true, TLS 1.2, RFC 5322 regex, anti-CRLF, HTML escaping, SSRF host block, rate limiter)
4. `src/services/productManager.js` (MODIFY - Web Crypto SHA-256 salted hash, async methods, transparent localStorage migration)
5. `src/components/admin/AdminAuthModal.jsx` (MODIFY - async verifyCredentials, remove NIP leak in placeholder)
6. `src/components/admin/AdminDashboardModal.jsx` (MODIFY - await verifyNip, deleteProduct, updateCredentials)
7. `vercel.json` (NEW - OWASP security headers with camera=(self))
8. Delete `src/data/products.js.bak` (Safe deletion)
9. Run `npm audit fix` (safe fix, STRICTLY WITHOUT --force)
10. Ensure `docs/TynorManuales.docx` and `docs/TynorManuales.pdf` remain 100% untouched and match their SHA-256 hashes:
    - DOCX: `F08D714719810F749392E5DFCA06ACE02A7C38B20C3D87ACA63B3017BD5C85C5`
    - PDF: `48608DFD343A7671D3040CD9DD82298EDF21B2DB3748FE867F96C7E52863BE29`
11. Run `npm run build` and verify that exit code is 0 and compilation succeeds.

## Deliverables
- Execute all code changes.
- Verify build with `npm run build`.
- Document every file created/modified/deleted and the build/verification output in `c:\Users\User\Documents\GitHub\CatalogoTyn\.agents\teamwork\worker_sec_implementation\handoff.md`.


## 2026-11-03T20:52:57Z
From: 1b8e06ed-5cec-498d-83c5-ecafc361fb21
Task: Implement comprehensive security hardening according to Explorer handoffs and plan.
Target tasks:
1. Write 'scripts/supabase_secure_rls.sql'
2. Modify 'src/services/supabase.js'
3. Modify 'api/send-email.js'
4. Modify 'src/services/productManager.js'
5. Modify 'src/components/admin/AdminAuthModal.jsx'
6. Modify 'src/components/admin/AdminDashboardModal.jsx'
7. Create 'vercel.json'
8. Delete 'src/data/products.js.bak'
9. Execute 'npm audit fix'
10. Verify 'docs/TynorManuales.*' intact
11. Run 'npm run build'
12. Write handoff.md and send message to parent.
