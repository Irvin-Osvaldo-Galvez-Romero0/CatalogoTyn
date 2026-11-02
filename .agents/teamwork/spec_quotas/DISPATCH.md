# Dispatch Log

## 2026-11-02T15:55:40Z
You are a teamwork_spec_miner: Free Tier Quotas & Limits Spec Miner.
Working directory: c:\Users\User\Documents\GitHub\CatalogoTyn\.agents\teamwork\spec_quotas\

Mandatory inputs to read:
- c:\Users\User\Documents\GitHub\CatalogoTyn\.agents\teamwork\ORIGINAL_REQUEST.md
- c:\Users\User\Documents\GitHub\CatalogoTyn\.agents\teamwork\orchestrator\DISPATCH.md

Objective:
Perform an authoritative, rigorous investigation of the Free Tier quotas, policies, and operational constraints for online databases and image storage solutions suitable for a medium-scale catalog (100 to 1,000 products, up to 5 GB of images):
1. Candidate solutions to evaluate:
   - Supabase Free Tier: Postgres database storage limits (500 MB), file storage / bucket limits (1 GB), bandwidth/egress quota (2 GB or 5 GB per month), image transformations (if any or paid add-on), API requests limit, and crucially: PROJECT PAUSE / INACTIVITY POLICIES (e.g., 7 days of inactivity pausing free projects, cold starts, waking paused projects).
   - Firebase (Spark Free Plan): Cloud Firestore limits (1 GB DB storage, 50k reads/day, 20k writes/day, 20k deletes/day), Firebase Storage limits (5 GB total storage, 1 GB/day download bandwidth, 20k uploads/day, 50k downloads/day), project pause rules.
   - Cloudflare D1 + R2: D1 limits (5 GB storage, 5M row reads/day, 100k row writes/day), R2 limits (10 GB storage, 10M Class A ops/month, 10M Class B ops/month, ZERO egress fees!), Workers free tier (100k requests/day), custom domains / CDN caching integration.
   - Cloudinary Free Tier: Free plan credits (25 monthly credits = 25 GB storage or 25 GB net viewing bandwidth or 25k transformations), auto-optimization (f_auto, q_auto), rate limits.
   - PocketBase: Self-hosted SQLite + files on free PaaS (e.g. Fly.io free tier changes, Render free tier spun-down after 15 min, Railway free trials, Oracle Cloud free tier VM, or running locally on the kiosk as an embedded server syncable to cloud).
2. For each platform, provide verified metrics:
   - Database storage limit (MB/GB)
   - Image/File storage limit (MB/GB)
   - Monthly or daily egress/bandwidth limit
   - API / read / write operations quotas
   - Pause / inactivity / sleep policies & impact on an interactive kiosk
   - Pricing triggers / overage handling (hard block vs surprise credit card bill)
3. Scope boundaries: Specification mining and quota research only. No modifications to codebase.
4. Output requirements:
   - c:\Users\User\Documents\GitHub\CatalogoTyn\.agents\teamwork\spec_quotas\report.md
   - c:\Users\User\Documents\GitHub\CatalogoTyn\.agents\teamwork\spec_quotas\handoff.md
5. Send a message to the orchestrator when completed referencing your reports.
