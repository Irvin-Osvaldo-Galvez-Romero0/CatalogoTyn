# Task Assignment: API & Security Adversarial Challenger

- Working Directory: c:\Users\User\Documents\GitHub\CatalogoTyn\.agents\teamwork\challenger_sec_api
- Original Request: c:\Users\User\Documents\GitHub\CatalogoTyn\.agents\teamwork\ORIGINAL_REQUEST.md
- Plan Context: c:\Users\User\.gemini\antigravity\brain\23b868c2-8b12-4d48-9720-e9e2af9378f8\plan_seguridad_integral_ecc.md
- Worker Handoff: c:\Users\User\Documents\GitHub\CatalogoTyn\.agents\teamwork\worker_sec_implementation\handoff.md

## Objective
Empirically stress-test API security and Supabase client:
1. `api/send-email.js` tests:
   - Call handler with unauthorized origin -> verify 403 Forbidden.
   - Call handler with authorized origin (`https://catalogotyn.vercel.app`) -> verify it proceeds past CORS check.
   - Call handler with CRLF injection in parameters -> verify 400 rejection.
   - Call handler with forbidden host (`169.254.169.254`) -> verify 400 rejection.
   - Call handler with invalid email format -> verify 400 rejection.
   - Stress rate limiter with 20 sequential calls from same IP -> verify HTTP 429 response when limit exceeded.
2. `src/services/supabase.js` tests:
   - Verify input sanitizers truncate strings longer than limits and escape/filter illegal characters.
   - Verify offline queue enforces FIFO cap of 50 items.
3. Document empirical test code and results in `c:\Users\User\Documents\GitHub\CatalogoTyn\.agents\teamwork\challenger_sec_api\handoff.md`.
4. Issue verdict: CONFIRM or REJECT in your handoff.md.


## 2026-11-03T21:04:49Z
You are challenger_sec_api. Your working directory is c:\Users\User\Documents\GitHub\CatalogoTyn\.agents\teamwork\challenger_sec_api.
You must read:
1. c:\Users\User\Documents\GitHub\CatalogoTyn\.agents\teamwork\ORIGINAL_REQUEST.md
2. c:\Users\User\.gemini\antigravity\brain\23b868c2-8b12-4d48-9720-e9e2af9378f8\plan_seguridad_integral_ecc.md
3. c:\Users\User\Documents\GitHub\CatalogoTyn\.agents\teamwork\worker_sec_implementation\handoff.md
4. c:\Users\User\Documents\GitHub\CatalogoTyn\.agents\teamwork\challenger_sec_api\DISPATCH.md

Execute your task per DISPATCH.md:
- Empirically test api/send-email.js (unauthorized origin -> 403, authorized origin, anti-CRLF, SSRF host block, rate limiter under 20 requests).
- Empirically test src/services/supabase.js (sanitizers, queue cap).
- Record all test commands and outputs in handoff.md.
- Issue your verdict: CONFIRM or REJECT in handoff.md and send a completion message to parent.
