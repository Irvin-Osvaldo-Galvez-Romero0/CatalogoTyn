# Handoff Report: Free Tier Quotas & Limits Specification

**Agent**: `teamwork_spec_miner` (Free Tier Quotas & Limits Spec Miner)  
**Task**: Specification mining of Free Tier quotas, policies, and operational constraints for online databases and image storage solutions.  
**Destination**: `.agents/teamwork/spec_quotas/handoff.md`  
**Date**: 2026-11-02  

---

## 1. Observation

1. **Existing Codebase Integration**:
   - In `c:\Users\User\Documents\GitHub\CatalogoTyn\src\services\supabase.js` (lines 6–7), Supabase is currently configured with `SUPABASE_URL = 'https://xvrnssesbkzxeusubzes.supabase.co'` and a public anonymous key. It manages commercial lead submissions to `prospectos_comerciales` with offline caching in `localStorage`.
   - In `src/data/products.js` (lines 156–220), there are 186 products containing fields: `code`, `name`, `cat`, `price`, `bodyPart`, `badge`, `linea`, `sizes`, `colors`, `hasPdf`, `hasVideo`, `shortDesc`, `desc`, `uses`, and `features`.
   - In `src/components/InterestDrawer.jsx` (line 101) and `src/components/AnatomyView.jsx` (line 284), product images are currently loaded locally via `<img src={'/assets/' + p.code + '.png'} />`.
   - PowerShell inspection of `public/assets` showed: `Count: 186`, `Sum: 65,926,401 bytes (~65.9 MB)`.

2. **Supabase Free Tier Quotas**:
   - Postgres Database: 500 MB (shared compute, 1 GB RAM, 2 active projects).
   - Storage Buckets: 1 GB total storage limit.
   - Egress: 5 GB standard + 5 GB cached outbound data transfer per month.
   - Image Transformations: Not included on Free Tier (only available on Pro plan, $25/mo, with 100 origin images included, then $5/1,000 origin images).
   - Inactivity Pause: Automatically pauses after 7 days of zero SQL queries. Waking up requires manual login to the Supabase Web Dashboard to click "Resume Project" (takes 1–3 minutes).

3. **Firebase Spark Plan Quotas**:
   - Cloud Firestore: 1 GiB total storage, 50,000 reads/day, 20,000 writes/day, 20,000 deletes/day, 10 GiB/month egress. Resets at midnight PT.
   - Cloud Storage for Firebase: Policy update requires a Blaze billing account (credit card) to provision storage buckets on new projects. (Always Free allowance on Blaze: 5 GB storage, 1 GB/day egress, 20k uploads, 50k downloads in US multi-region).
   - Inactivity: Never pauses. Zero cold starts.
   - Overages: Hard stop on Spark (`RESOURCE_EXHAUSTED`).

4. **Cloudflare D1 + R2 + Workers Quotas**:
   - Cloudflare D1: 5 GB total database storage (up to 10 DBs, 500 MB max per DB), 5,000,000 row reads/day, 100,000 row writes/day.
   - Cloudflare R2: 10 GB standard storage per month, 10,000,000 Class B reads/month, 1,000,000 Class A writes/month. **$0.00 egress fees** (completely unlimited outbound bandwidth).
   - Cloudflare Workers: 100,000 requests/day, 10 ms CPU execution time per request.
   - Inactivity: Never pauses. Distributed edge execution across 300+ PoPs worldwide.
   - Overages: Hard limit on free tier (HTTP 429/1015). Zero billing risk.

5. **Cloudinary Free Tier Quotas**:
   - Unified credit pool: 25 monthly credits calculated on a rolling 30-day window.
   - 1 credit = 1 GB managed storage OR 1 GB viewing bandwidth OR 1,000 transformations.
   - For 5 GB images: 5 credits for storage + 2 credits for ~2,000 transforms (`f_auto, q_auto`) leaves 18 credits = 18 GB viewing bandwidth (~240,000 optimized image impressions).
   - Database: No database capability.

6. **PocketBase Hosting Quotas & Constraints**:
   - Single Go binary (< 25 MB) with embedded SQLite and file uploads.
   - Render Free: Ephemeral disk wipes `pb_data` (SQLite DB and files) on sleep or restart (15-min idle spin down).
   - Fly.io: Free hobby tier discontinued; persistent volumes incur recurring monthly fees (~$0.15/GB/mo).
   - Oracle Cloud (OCI) Always Free: 200 GB block storage, 4 ARM cores, 24 GB RAM. Free and persistent, but registration requires credit card and has high fraud filter rejection rates; idle VMs (< 20% CPU over 7 days) subject to reclamation.
   - Local Kiosk Host: 100% free, unlimited storage on local SSD, 0 ms latency, 100% offline resilient, but requires local or peer-to-peer sync mechanisms.

---

## 2. Logic Chain

1. **Premise 1**: The user requires a solution for 100 to 1,000 products and up to 5 GB of images under an online-only kiosk model with browser caching.
2. **Premise 2**: 1,000 structured product records (with prices, stock, sizes, colors, body parts, descriptions) require approximately 5 MB to 10 MB of database storage.
3. **Inference 1 (Database Feasibility)**:
   - Supabase (500 MB Postgres), Firebase Firestore (1 GiB), and Cloudflare D1 (5 GB SQLite) all provide between 50x and 500x the capacity needed for product data. Database storage is not a bottleneck on any of these three platforms.
4. **Premise 3**: Image storage requires up to 5 GB.
5. **Inference 2 (Storage Feasibility & Elimination)**:
   - Supabase Free Tier has a hard limit of 1 GB for storage buckets. Storing 5 GB of images will fail with quota exceeded errors (500% over limit). Therefore, **Supabase Free Tier CANNOT be used as a unified solution for both database and images**.
   - Cloudflare R2 provides 10 GB standard storage for free with $0 egress fees. 5 GB of images fits comfortably with a 2x safety buffer.
   - Cloudinary provides 25 credits. Allocating 5 credits for 5 GB storage leaves 18 credits for viewing bandwidth, which is sufficient when paired with `f_auto, q_auto` and browser caching.
6. **Premise 4**: An interactive kiosk at medical conferences (e.g. EXPOMEDICAL) or clinics operates intermittently and may sit powered down or unused for days or weeks between events.
7. **Inference 3 (Inactivity & Operational Reliability)**:
   - Supabase automatically pauses projects after 7 days of inactivity. If a kiosk is idle for a week, all catalog queries and lead submissions will fail until an admin manually logs into the web console.
   - Cloudflare (D1/R2) and Firebase (Firestore) never pause, ensuring that whenever the kiosk is booted up, it functions instantly with 0 ms cold start.
8. **Inference 4 (Optimal Recommendation)**:
   - **Best Overall Unified Free Stack**: **Cloudflare D1 + R2 + Workers**. 5 GB SQLite DB + 10 GB image storage + $0 egress + 0 inactivity pauses + 100% free with zero billing risk.
   - **Best Incremental Hybrid Stack**: **Existing Supabase (Postgres for Products & Leads + 72h keep-alive ping) + Cloudflare R2 (for 5 GB images)**. Preserves the current codebase in `src/services/supabase.js` while solving the 1 GB image barrier.

---

## 3. Caveats

1. **Firebase Storage Provisioning**: While Google Cloud offers an Always Free allowance of 5 GB storage and 1 GB/day egress, Google updated its console in 2024 to require a credit card (Blaze plan) before a project can create a Cloud Storage bucket. Teams requiring a strictly credit-card-free registration cannot use Cloud Storage for Firebase.
2. **Cloudflare D1 Query Scanning**: D1’s daily quota of 5,000,000 row reads counts all rows scanned by SQLite during query execution, not just rows returned. Unindexed full table scans across 1,000 products could deplete the daily quota faster if queries are unoptimized. Appropriate indexes on `cat` and `bodyPart` are required.
3. **Cloudinary Credit Rolling Window**: Cloudinary uses a rolling 30-day window rather than a calendar month reset. A massive sudden spike in uncached image requests within a 48-hour window could consume all 25 credits and cause soft-throttling until older days roll off.

---

## 4. Conclusion

1. **Supabase Free Tier cannot serve as a single unified solution** because its 1 GB storage limit cannot accommodate 5 GB of images, and its 7-day inactivity pause creates an unacceptable failure mode for an intermittent kiosk.
2. **Cloudflare D1 + R2 is the superior technical solution**: It provides 5 GB of database storage, 10 GB of image storage, **zero egress fees**, zero inactivity pauses, and zero risk of unexpected billing.
3. **A hybrid architecture is also highly viable**: Retaining Supabase for product records and lead capture while offloading all image assets to Cloudflare R2 (or Cloudinary for on-the-fly optimization) provides the lowest migration friction for the existing codebase.

---

## 5. Verification Method

To independently verify the observations, limits, and behavior documented in this report:

1. **Supabase Storage and Pause Limits**:
   - Inspect official Supabase pricing documentation at `https://supabase.com/pricing` and docs at `https://supabase.com/docs/guides/platform/pausing`.
   - In a test Supabase free project, check bucket upload limits via the Supabase Storage API. Verify that projects without database activity for 7 days show "Paused" status in the management console.
2. **Cloudflare R2 and D1 Quotas**:
   - Inspect Cloudflare D1 limits at `https://developers.cloudflare.com/d1/platform/limits/` and Cloudflare R2 pricing at `https://developers.cloudflare.com/r2/pricing/`.
   - Verify that R2 lists "Egress: $0 / GB" and D1 lists 5,000,000 row reads/day on the Free plan.
3. **Firebase Spark Quotas**:
   - Inspect Firebase pricing at `https://firebase.google.com/pricing` and test creating a new Cloud Storage bucket on a newly created Spark project to confirm the Blaze upgrade prompt.
4. **Cloudinary Credits**:
   - Inspect Cloudinary pricing at `https://cloudinary.com/pricing` and verify the 25 monthly credit conversion formulas.
5. **Report Artifact**:
   - Read full report at: `c:\Users\User\Documents\GitHub\CatalogoTyn\.agents\teamwork\spec_quotas\report.md`.
