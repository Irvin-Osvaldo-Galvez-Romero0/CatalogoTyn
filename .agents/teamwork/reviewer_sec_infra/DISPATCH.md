# Task Assignment: Infrastructure, Headers & Hygiene Review

- Working Directory: c:\Users\User\Documents\GitHub\CatalogoTyn\.agents\teamwork\reviewer_sec_infra
- Original Request: c:\Users\User\Documents\GitHub\CatalogoTyn\.agents\teamwork\ORIGINAL_REQUEST.md
- Plan Context: c:\Users\User\.gemini\antigravity\brain\23b868c2-8b12-4d48-9720-e9e2af9378f8\plan_seguridad_integral_ecc.md
- Worker Handoff: c:\Users\User\Documents\GitHub\CatalogoTyn\.agents\teamwork\worker_sec_implementation\handoff.md

## Objective
Review infrastructure, headers, dependency hygiene, and asset preservation:
1. `vercel.json`: Validate JSON syntax and structure. Verify OWASP headers: X-Frame-Options: DENY, X-Content-Type-Options: nosniff, Referrer-Policy, Strict-Transport-Security, and Content-Security-Policy. Verify Permissions-Policy explicitly allows camera=(self) to support html5-qrcode.
2. `src/data/products.js.bak`: Confirm file is deleted and no dangling imports remain.
3. `package.json` & dependencies: Verify npm audit status and that no breaking updates were forced.
4. `docs/TynorManuales.*`: Verify both files are 100% intact by checking their SHA-256 hashes against baselines:
   - DOCX: `F08D714719810F749392E5DFCA06ACE02A7C38B20C3D87ACA63B3017BD5C85C5`
   - PDF:  `48608DFD343A7671D3040CD9DD82298EDF21B2DB3748FE867F96C7E52863BE29`
5. Execute `npm run build` to verify production compilation.
6. Issue verdict: APPROVE or REQUEST_CHANGES in your handoff.md.

## 2026-11-03T21:04:43Z
You are reviewer_sec_infra. Your working directory is c:\Users\User\Documents\GitHub\CatalogoTyn\.agents\teamwork\reviewer_sec_infra.
You must read:
1. c:\Users\User\Documents\GitHub\CatalogoTyn\.agents\teamwork\ORIGINAL_REQUEST.md
2. c:\Users\User\.gemini\antigravity\brain\23b868c2-8b12-4d48-9720-e9e2af9378f8\plan_seguridad_integral_ecc.md
3. c:\Users\User\Documents\GitHub\CatalogoTyn\.agents\teamwork\worker_sec_implementation\handoff.md
4. c:\Users\User\Documents\GitHub\CatalogoTyn\.agents\teamwork\reviewer_sec_infra\DISPATCH.md

Execute your task per DISPATCH.md:
- Review vercel.json (OWASP headers, camera=(self) in Permissions-Policy, CSP).
- Verify removal of src/data/products.js.bak.
- Verify npm audit status.
- Verify cryptographic SHA-256 hashes of docs/TynorManuales.docx and docs/TynorManuales.pdf.
- Run 'npm run build' to verify compilation.
- Issue your verdict: APPROVE or REQUEST_CHANGES in handoff.md and send a completion message to parent.
