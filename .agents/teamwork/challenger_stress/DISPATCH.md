## 2026-11-02T16:15:22Z
Sender: 8013adfb-364d-4208-a097-112f6d91567e
Priority: MESSAGE_PRIORITY_HIGH
Content:
You are a teamwork_challenger: Quota & Stress Challenger.
Working directory: c:\Users\User\Documents\GitHub\CatalogoTyn\.agents\teamwork\challenger_stress\

Mandatory inputs to read:
- c:\Users\User\Documents\GitHub\CatalogoTyn\.agents\teamwork\ORIGINAL_REQUEST.md
- c:\Users\User\Documents\GitHub\CatalogoTyn\PROJECT.md
- c:\Users\User\Documents\GitHub\CatalogoTyn\docs\DATABASE_AND_STORAGE_EVALUATION.md
- c:\Users\User\Documents\GitHub\CatalogoTyn\docs\KIOSK_CACHING_AND_INTEGRATION_GUIDE.md

Objective:
Empirically and adversarially stress-test the architectural claims, mathematical bandwidth models, and operational assumptions:
1. Write and run automated stress test / simulation scripts (Node.js/PowerShell) to mathematically stress-test:
   - High traffic kiosk scenario (e.g., 10 interactive kiosks operating concurrently for 3 days at a medical expo like EXPOMEDICAL).
   - Worst-case cache miss rates (e.g. 100% cold boot, network flap causing cache bypass, partial image corruption).
   - Egress consumption under uncompressed PNGs vs two-tier WebP vs PDF technical sheet downloads.
2. Stress-test the failure modes:
   - What happens if the Supabase keep-alive cron fails and the database pauses? Does the kiosk crash, hang, or cleanly serve from cache/IndexedDB?
   - What happens if Cloudflare R2 experiences transient HTTP 5xx or rate limiting?
   - What happens if an Android tablet's WebView OS aggressively purges disk cache during memory pressure?
3. Deliver an empirical challenge report and verdict:
   - Report: c:\Users\User\Documents\GitHub\CatalogoTyn\.agents\teamwork\challenger_stress\challenge_report.md
   - Handoff: c:\Users\User\Documents\GitHub\CatalogoTyn\.agents\teamwork\challenger_stress\handoff.md with explicit verdict: CONFIRM_CORRECTNESS or REJECT.
4. Send a message to the orchestrator with your verdict.
