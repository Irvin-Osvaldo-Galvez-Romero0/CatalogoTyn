# Task Assignment: Email API & Admin NIP Auth Security Exploration

- Working Directory: c:\Users\User\Documents\GitHub\CatalogoTyn\.agents\teamwork\explorer_sec_auth_email
- Original Request: c:\Users\User\Documents\GitHub\CatalogoTyn\.agents\teamwork\ORIGINAL_REQUEST.md
- Plan Context: c:\Users\User\.gemini\antigravity\brain\23b868c2-8b12-4d48-9720-e9e2af9378f8\plan_seguridad_integral_ecc.md

## Objective
Investigate Email API relay vulnerability and Kiosk NIP authentication:
1. Read ORIGINAL_REQUEST.md and the plan context thoroughly.
2. Inspect `api/send-email.js`:
   - Current CORS headers (replace `*` with strict origin allowlist: `catalogotyn.vercel.app`, `localhost:4173`, `127.0.0.1:4173`, etc.).
   - TLS configuration: analyze changing `rejectUnauthorized: false` to `rejectUnauthorized: true`.
   - Parameter validation (email regex, name length, text sanitization, CRLF prevention).
   - Rate limiting / session protection considerations.
3. Inspect `src/services/productManager.js` and `src/components/admin/AdminAuthModal.jsx`:
   - Trace how the admin credentials (`admin` / `9824`) are stored and verified.
   - Design the SHA-256 salted hashing function using standard browser `crypto.subtle`.
   - Ensure backward compatibility (e.g., automatic migration if plaintext NIP is found in localStorage).
4. Document findings and step-by-step recommendations in `c:\Users\User\Documents\GitHub\CatalogoTyn\.agents\teamwork\explorer_sec_auth_email\handoff.md`.


## 2026-11-03T20:45:57Z
You are explorer_sec_auth_email. Your working directory is c:\Users\User\Documents\GitHub\CatalogoTyn\.agents\teamwork\explorer_sec_auth_email.
You must read:
1. c:\Users\User\Documents\GitHub\CatalogoTyn\.agents\teamwork\ORIGINAL_REQUEST.md
2. c:\Users\User\.gemini\antigravity\brain\23b868c2-8b12-4d48-9720-e9e2af9378f8\plan_seguridad_integral_ecc.md
3. c:\Users\User\Documents\GitHub\CatalogoTyn\.agents\teamwork\explorer_sec_auth_email\DISPATCH.md

Execute your task as defined in DISPATCH.md:
- Analyze api/send-email.js (CORS origin restrictions, rejectUnauthorized: true, email regex, CRLF injection prevention, input sanitization).
- Analyze src/services/productManager.js and src/components/admin/AdminAuthModal.jsx.
- Formulate the SHA-256 salted hashing implementation using crypto.subtle.digest('SHA-256', ...) with static salt ('TYNOR_KIOSK_SALT_2026').
- Formulate safe backward-compatible migration for any legacy plaintext credentials in localStorage.
- Write your findings and recommendations to c:\Users\User\Documents\GitHub\CatalogoTyn\.agents\teamwork\explorer_sec_auth_email\handoff.md.
- Send a completion message back to parent.
