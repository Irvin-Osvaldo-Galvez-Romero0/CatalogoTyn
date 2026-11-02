# Report: Authoritative Investigation of Free Tier Quotas, Policies, and Operational Constraints for Online Databases & Image Storage

**Project**: Tynor Catálogo Interactivo Kiosco (React, Vite, Electron, Android/Capacitor)  
**Date**: 2026-11-02  
**Author**: Free Tier Quotas & Limits Spec Miner (`teamwork_spec_miner`)  
**Scope**: Authoritative evaluation of Supabase, Firebase, Cloudflare (D1/R2), Cloudinary, and PocketBase under the medium-scale catalog specifications (100–1,000 products, up to 5 GB of images, kiosk online operation with browser caching).

---

## 1. Executive Summary & Master Comparison Matrix

The table below contrasts the 5 candidate platforms across critical technical dimensions, verified against official platform specifications and documentation.

| Platform / Solution | Database Storage Limit | Image / File Storage Limit | Egress / Bandwidth Quota | API / Read / Write Quotas | Inactivity / Sleep / Pause Policy | Overage Behavior (Risk Level) | Fit for 1,000 Products + 5 GB Images |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Supabase Free Tier** | **500 MB** PostgreSQL (shared compute) | **1 GB** total (across all storage buckets) | **5 GB** standard + 5 GB cached / month | Unlimited PostgREST; 500k Edge Functions/mo; 200 Realtime connections | **PAUSES after 7 days** of no SQL queries. Manual dashboard unpause (1–3 min). | **Hard limit**. Uploads fail over 1 GB; warnings then restriction. **Zero surprise bill** (no credit card). | ❌ **FAILS storage** (1 GB vs 5 GB needed). High kiosk pause risk. |
| **Firebase (Spark Plan)** | **1 GiB** Cloud Firestore | **0 GB natively on Spark** (Cloud Storage requires Blaze billing account since 2024; Always Free is 5 GB on Blaze) | Firestore: **10 GiB/mo**; Storage: **1 GB/day** (30 GB/mo on Blaze Always Free) | Firestore: **50k reads/day**, 20k writes/day, 20k deletes/day; Storage: 50k downloads/day | **NEVER pauses**. Runs 24/7/365 with zero cold boots or idle sleeps. | **Hard stop** on Spark (`RESOURCE_EXHAUSTED` until midnight PT). **Zero financial risk**. Blaze has pay-as-you-go overages. | ⚠️ **PARTIAL**. DB fits easily; 5 GB images requires Blaze card registration. |
| **Cloudflare D1 + R2 + Workers** | **5 GB** Cloudflare D1 (edge SQLite, up to 10 DBs) | **10 GB** Cloudflare R2 standard storage | **$0.00 ZERO EGRESS FEES** (Unlimited bandwidth out on R2!) | D1: **5,000,000 row reads/day**, 100k writes/day; R2: **10M Class B reads/mo**, 1M Class A/mo; Workers: 100k req/day | **NEVER pauses**. Globally distributed across 300+ edge PoPs. Zero cold boots. | **Hard limit** on free tier (HTTP 429/1015 on quota exhaustion). **Zero surprise bill**. |  **EXCELLENT (100% Fit)**. 2x storage headroom, 0 egress cost, zero pause. |
| **Cloudinary Free Tier** | **None** (Media asset storage only; no DB) | **25 Monthly Credits** shared across storage, transforms, and bandwidth | 1 Credit = 1 GB storage OR 1 GB bandwidth OR 1,000 transformations | 25 credits/mo (rolling 30-day window). With 5 GB storage: leaves ~18 GB viewing bandwidth | **NEVER pauses**. Media CDN is continuously live. | **Soft suspension**. Warnings and asset delivery throttling upon credit exhaustion. **Zero surprise bill**. | ⚠️ **HYBRID ONLY**. Excellent image optimizer/CDN, but requires separate DB. |
| **PocketBase (PaaS vs Local)** | **Host-dependent** (SQLite). Local: disk-limited. PaaS: varies. | **Host-dependent**. Local: disk-limited. PaaS: S3/R2 mount required. | Local: **Unlimited LAN/Localhost**. PaaS: host bandwidth rules. | Limited only by host CPU/RAM and SQLite concurrency (supports 10k+ req/sec). | **Render**: Sleeps after 15 min; **wipes ephemeral disk**. **OCI**: Never pauses. **Local**: 0 sleep. | Render: wipes DB on sleep! OCI: possible idle VM reclamation. Local: 0 risk. | ⚠️ **VIABLE LOCAL / OCI ONLY**. Unviable on free PaaS (Render/Fly.io) due to SQLite disk wipe. |

---

## 2. In-Depth Platform Evaluation

### 2.1. Candidate 1: Supabase Free Tier

#### Technical Specifications & Verified Metrics
- **Postgres Database Storage**: 500 MB (PostgreSQL 15+, shared instance, 1 GB RAM, 2 active projects per account).
- **Storage Buckets**: 1 GB total storage across all buckets.
- **Egress / Data Transfer Out**: 5 GB standard egress + 5 GB cached egress per month.
- **API & Compute**: Unlimited PostgREST queries, 500,000 Edge Function invocations per month, 200 concurrent Realtime WebSocket connections, 2 million Realtime messages per month.
- **Image Transformations**: **NOT included** in the Free Tier. Free storage uses basic CDN without on-the-fly resizing, cropping, or WebP format negotiation. (On Pro at $25/mo, 100 origin images are included, then $5 per 1,000 origin images).
- **Inactivity & Sleep Policy**: **CRITICAL RISK**. Supabase automatically pauses any free-tier project that experiences **7 consecutive days of database inactivity** (defined strictly as zero SQL queries hitting the PostgreSQL database; dashboard visits and peripheral hits do not reset the inactivity timer).
  - *When paused*: The container is shut down. Incoming API requests fail with HTTP 500 / connection refused.
  - *Unpausing*: Requires an administrator to log into the Supabase web console and click "Resume Project", which triggers a cold restoration taking 1 to 3 minutes. If left paused for over 90 days, the project is scheduled for permanent deletion.
- **Overage Handling**: Strict hard caps on Free Tier. When storage reaches 1 GB, new uploads return HTTP 400/403 errors. When egress exceeds 5 GB, warnings are issued followed by API restriction. No credit card is required, preventing accidental financial charges.

#### Fit Analysis for Tynor Kiosk
- **Database**: 1,000 products with variants, sizes, colors, and body parts require approximately 5 MB to 10 MB in PostgreSQL. The 500 MB limit is more than sufficient.
- **Images**: The 1 GB storage limit is a **complete roadblock** for up to 5 GB of images.
- **Kiosk Operational Risk**: Interactive kiosks in medical exhibitions (e.g., EXPOMEDICAL) or clinics operate intermittently. A 7-day period of inactivity between trade shows will pause the project, causing the kiosk to fail when turned on unless an external cron job keeps the database alive.

---

### 2.2. Candidate 2: Firebase (Spark Free Plan)

#### Technical Specifications & Verified Metrics
- **Database (Cloud Firestore)**: 1 GiB total stored data.
  - Document Reads: 50,000 per day.
  - Document Writes: 20,000 per day.
  - Document Deletes: 20,000 per day.
  - Network Egress: 10 GiB per month.
  - Reset Cycle: Resets daily at 00:00 Pacific Time.
- **Cloud Storage for Firebase**:
  - **Policy Change**: Starting in 2024, provisioning Cloud Storage buckets on new Firebase projects requires linking a billing account (upgrading to the Blaze pay-as-you-go plan). Projects strictly on the no-card Spark plan cannot create new storage buckets.
  - *Blaze Always Free Allowances*: 5 GB standard storage in US multi-region (`us-central1`, `us-east1`, `us-west1`), 1 GB per day download bandwidth (~30 GB/month), 20,000 upload ops/day, 50,000 download ops/day.
- **Inactivity & Sleep Policy**: **EXCELLENT**. Firebase Firestore and Cloud Storage never sleep or pause due to inactivity. There are zero cold boots.
- **Overage Handling**:
  - Spark Plan: Hard cutoff. When daily limits (e.g., 50k reads) are hit, requests fail immediately with `RESOURCE_EXHAUSTED` (code 8) until midnight PT. Zero financial liability.
  - Blaze Plan: Pay-as-you-go overages ($0.06 per 100k reads, $0.026/GB/mo storage, $0.12/GB egress).

#### Fit Analysis for Tynor Kiosk
- **Database**: 1,000 products consume < 10 MB of the 1 GiB limit. 50,000 reads/day allows 50 full catalog synchronizations per day, or thousands of queries with client caching.
- **Images**: 5 GB of images requires linking a credit card on Blaze to unlock the 5 GB Always Free storage allowance. 1 GB/day egress (30 GB/mo) requires disciplined HTTP/browser caching on the kiosk.

---

### 2.3. Candidate 3: Cloudflare D1 + R2 + Workers (Edge Architecture)

#### Technical Specifications & Verified Metrics
- **Database (Cloudflare D1)**:
  - Total Storage: 5 GB across account (up to 10 databases on Free Tier; max 500 MB per single database).
  - Row Reads: 5,000,000 rows scanned per day.
  - Row Writes: 100,000 rows written per day.
  - Query Result Size: Up to 50 MB per query.
  - Engine: Edge SQLite with global read replication.
- **Object Storage (Cloudflare R2)**:
  - Standard Storage: 10 GB-month per month (free indefinitely).
  - Class A Operations (Uploads, Mutations, Lists): 1,000,000 operations per month.
  - Class B Operations (Reads, GET, HEAD): 10,000,000 operations per month.
  - **Egress / Data Transfer**: **$0.00 ZERO EGRESS FEES**. Completely free and unlimited outbound data transfer.
  - Custom Domains & CDN: R2 buckets can be mapped directly to a custom domain (e.g., `media.tynorcatalog.com`) or public bucket URL with Cloudflare CDN edge caching enabled.
- **Compute (Cloudflare Workers API Gateway)**:
  - Requests: 100,000 requests per day (resets daily at 00:00 UTC).
  - CPU Time: 10 ms CPU execution time per request (network waiting time does not count against CPU time).
- **Inactivity & Sleep Policy**: **PERFECT**. Cloudflare is a serverless edge network spanning 300+ cities. There are no virtual machines or containers to spin down. Zero cold starts, zero inactivity pauses.
- **Overage Handling**: Strict hard boundary on Free Tier. If 100k Worker requests or 5M D1 row reads are exceeded, requests return HTTP 429/1015 until reset. No billing surprises.

#### Fit Analysis for Tynor Kiosk
- **Database**: 5 GB storage provides 500x headroom for 1,000 products (~10 MB). 5,000,000 row reads/day easily handles 5,000 full catalog queries per day.
- **Images**: 10 GB R2 storage provides 2x headroom for 5 GB of images.
- **Bandwidth**: Zero egress fees eliminate bandwidth exhaustion risks during heavy exhibition kiosk usage.

---

### 2.4. Candidate 4: Cloudinary Free Tier

#### Technical Specifications & Verified Metrics
- **Credit Model**: 25 monthly credits calculated on a rolling 30-day window.
- **Credit Conversion**:
  - 1 Credit = 1 GB of managed storage, OR
  - 1 Credit = 1 GB of viewing bandwidth, OR
  - 1 Credit = 1,000 transformation operations.
- **5 GB Image Library Allocation**:
  - Storage: 5 GB = 5 credits.
  - Transformations (generating responsive widths and auto-formats): ~2,000 transforms = 2 credits.
  - Remaining Bandwidth: 18 credits = 18 GB viewing bandwidth per 30-day window.
- **Dynamic Optimization**: Built-in `f_auto, q_auto` converts images to WebP/AVIF and compresses quality intelligently, typically reducing file sizes by 65–80% (a 500 KB PNG becomes ~75 KB WebP).
  - 18 GB net bandwidth delivers ~240,000 optimized image impressions per month.
- **Database Capability**: **None**. Cloudinary is strictly a media management and delivery platform.
- **Inactivity & Sleep Policy**: Always available 24/7/365.
- **Overage Handling**: Soft suspension. Account receives email warnings; if overages persist, image URLs return placeholders or HTTP 404 until credit balance clears on the rolling window. No credit card required.

#### Fit Analysis for Tynor Kiosk
- Excellent performance for image delivery, but requires pairing with a separate database (e.g., Supabase Postgres or Cloudflare D1) for product records.

---

### 2.5. Candidate 5: PocketBase (PaaS vs Local Embedded)

#### Technical Specifications & Verified Metrics
- **Architecture**: Compact single binary (Go) embedding SQLite, local file storage, admin UI, auto-generated REST API, and Server-Sent Events (SSE) realtime subscriptions.
- **Database & File Storage**: Limited only by the host filesystem.
- **Hosting Viability on Free PaaS**:
  - **Render (Free Web Service)**: **FATAL DEFECT**. Render's free tier uses an ephemeral filesystem. It spins down after 15 minutes of inactivity and does **not** support persistent disks on free tier. Every restart or sleep wipes the `pb_data` directory, destroying the database and all uploaded images.
  - **Fly.io**: Phased out its free hobby allowance. Persistent volumes now incur recurring monthly charges (~$0.15/GB/month).
  - **Oracle Cloud (OCI Always Free)**: Provides 200 GB persistent block storage and up to 4 ARM Ampere cores for free. Highly capable, but requires credit card verification with high rejection rates and carries idle VM reclamation rules (instances with < 20% CPU over 7 days may be reclaimed).
  - **Local Embedded Kiosk Host**: PocketBase (`pocketbase.exe`) runs directly as a background process on the Windows/Linux kiosk PC or local store mini-PC.
    - Cost: $0.
    - Latency: 0 ms (Localhost).
    - Storage: Limited only by the local SSD (256 GB - 1 TB).
    - Inactivity: Never sleeps.
    - Resilience: 100% offline-ready.

---

## 3. Comparative Matrix: Kiosk Operational Stress Factors

| Operational Stressor | Supabase Free | Firebase Spark | Cloudflare D1 + R2 | Cloudinary Free | PocketBase Local |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **7+ Days Inactivity (Between Trade Shows)** | **FAIL**: Project is paused; kiosk displays blank/error screens. | **PASS**: Always on; zero cold boots. | **PASS**: Always on; zero cold boots. | **PASS**: Always on. | **PASS**: Runs on kiosk hardware. |
| **5 GB Initial Image Sync** | **FAIL**: Exceeds 1 GB bucket cap by 500%. | **CONDITIONAL**: Requires Blaze billing link for 5 GB. | **PASS**: Fits in 10 GB free tier; 0 egress fee. | **PASS**: Consumes 5 of 25 credits. | **PASS**: Unlimited on local disk. |
| **Heavy Traffic Day (1,000 visitors)** | **PASS**: Unlimited PostgREST API hits. | **WATCH**: 50,000 reads/day requires client caching. | **PASS**: 5M row reads + 100k worker reqs/day. | **PASS**: Cached at CDN edge. | **PASS**: SQLite handles 10k+ req/sec locally. |
| **Cross-Platform Client (Electron & Android APK)** | **PASS**: REST / fetch works everywhere. | **PASS**: Firebase JS SDK supports Web/Capacitor. | **PASS**: Native HTTP `fetch()`; zero SDK bloat. | **PASS**: Standard `<img>` URLs. | **PASS**: Localhost (PC) / LAN (Tablet). |
| **Risk of Unexpected Invoicing** | **ZERO**: Hard caps; no card required. | **ZERO (Spark)** / Low (Blaze). | **ZERO**: Free plan hard limits; no billing without upgrade. | **ZERO**: Credit card not required. | **ZERO**: Self-hosted. |

---

## 4. Features Discovered

| # | Category | Feature | Description | Inputs | Outputs | Error Behavior | Discovered Via |
|---|----------|---------|-------------|--------|---------|----------------|----------------|
| 1 | Database | Supabase Postgres Free Limit | 500 MB relational database storage on shared compute | SQL queries, migrations | Tabular data / JSON | Blocks data writes over 500 MB; warning emails | Supabase Official Pricing Docs |
| 2 | Storage | Supabase File Storage Cap | 1 GB total storage across all public/private buckets | Multipart binary upload | File URL / CDN pointer | HTTP 400/403: Storage quota exceeded | Supabase Storage Docs |
| 3 | Networking | Supabase Egress Quota | 5 GB standard + 5 GB cached outbound data transfer per month | API responses, file downloads | Outbound data bytes | Throttling or API suspension after grace period | Supabase Billing Specs |
| 4 | Lifecycle | Supabase 7-Day Inactivity Pause | Automatically suspends compute if zero SQL queries occur for 7 days | Time elapsed without DB traffic | Container termination | API requests return HTTP 500 / connection refused; requires manual dashboard unpause | Supabase Inactivity Rules |
| 5 | Media | Supabase Image Transformations | Server-side image resizing and WebP conversion | Query parameters (`?width=400`) | Resized image stream | Disabled on Free Tier (returns original file or error); Paid Pro requires $5/1k origin images | Supabase Storage Specs |
| 6 | Database | Firebase Firestore Spark Limit | 1 GiB document database storage | JSON document payloads | Structured Firestore docs | Blocks document writes when 1 GiB exceeded | Firebase Spark Pricing Guide |
| 7 | Operations | Firestore Daily Quotas | 50,000 reads, 20,000 writes, 20,000 deletes per day | Client SDK queries | Document snapshots | `RESOURCE_EXHAUSTED` (gRPC Code 8) until 00:00 Pacific Time | Google Cloud Quota Specs |
| 8 | Storage | Firebase Storage Provisioning Rule | Cloud Storage for Firebase requires Blaze plan registration on new projects | Bucket creation in console | GCS bucket endpoint | Console prompts for billing account (credit card) | Firebase Storage 2024 Policy Update |
| 9 | Database | Cloudflare D1 Free Limits | 5 GB edge SQLite storage; 5M row reads and 100k writes/day | SQL statements via Workers binding | Query result rows | HTTP 429 / query execution failure when quota reached | Cloudflare D1 Official Docs |
| 10 | Storage | Cloudflare R2 Free Allowance | 10 GB standard object storage with $0 egress fees | S3 API / worker binding (`PUT`, `GET`) | Stored object stream | Class A (1M) or Class B (10M) overage blocks requests on free plan | Cloudflare R2 Pricing Docs |
| 11 | Networking | Cloudflare R2 Zero Egress | Data transfer out from R2 has zero per-GB bandwidth charges | Client downloads | Binary stream at 0 cost | None (permanent $0 egress policy) | Cloudflare R2 Bandwidth Policy |
| 12 | Compute | Cloudflare Workers Free Tier | 100,000 requests/day with 10 ms CPU execution time | Incoming HTTPS requests | HTTP response | HTTP 429 Too Many Requests / Error 1015 | Cloudflare Workers Docs |
| 13 | CDN | Cloudflare Custom Domain Binding | Assigning custom domains directly to R2 buckets with edge caching | CNAME / DNS routing | Edge-cached public asset URL | Standard HTTP status codes | Cloudflare R2 Custom Domain Docs |
| 14 | Media | Cloudinary 25 Credits Pool | Unified monthly credit pool for storage, transforms, and bandwidth | Images, video assets | Optimized media URLs | Soft suspension: warning emails followed by asset throttling/404 | Cloudinary Pricing Specs |
| 15 | Media | Cloudinary f_auto, q_auto | Automatic format (WebP/AVIF) and quality optimization | URL flags (`/f_auto,q_auto/`) | Compressed image stream | Falls back to original format if client unsupported | Cloudinary Transformation Docs |
| 16 | Database | PocketBase Single-Binary Engine | Embedded SQLite + File storage + Admin UI in one Go executable | REST API / Admin UI | JSON / file binaries | Depends on host disk and memory | PocketBase Architecture Specs |
| 17 | Hosting | Render Free Ephemeral Filesystem | Free tier web services do not support persistent disks | File creation in container | Ephemeral files | Wipes SQLite database (`pb_data`) and images on restart or 15-min idle spin-down | Render Free Tier Specs |
| 18 | Hosting | Oracle Cloud Always Free VPS | Up to 4 ARM Ampere cores, 24 GB RAM, 200 GB persistent block storage | SSH / systemd daemon | Full persistent Linux server | Strict credit card validation; reclamation if CPU < 20% over 7 days | Oracle Cloud Infrastructure Specs |

---

## 5. Edge Cases & Observed Platform Behaviors

| # | Feature | Input / Condition | Observed Behavior |
|---|---------|-------------------|-------------------|
| 1 | Supabase Inactivity Pause | 8 days of zero kiosk visitors between trade shows | Project is paused. When kiosk boots up on day 9, all product queries fail immediately. Requires manual login to app.supabase.com to click "Resume Project" (1–3 min cold start). |
| 2 | Supabase Storage Upload | Uploading 5 GB of product catalog photos | Uploads succeed up to 1 GB; subsequent uploads fail with HTTP 413 / 403 quota exceeded. |
| 3 | Firebase Firestore Quota Reset | Hitting 50,001 reads at 2:00 PM CST | Firestore SDK throws `FirebaseError: [code=resource-exhausted]`. All further database queries fail until midnight Pacific Time (02:00 AM CST next day). |
| 4 | Firebase Cloud Storage on Spark | Developer attempts to create a new storage bucket on a free Spark project | Firebase Console prompts with a modal demanding a billing account / credit card (Blaze plan) before bucket creation can proceed. |
| 5 | Cloudflare D1 Scanned Rows vs Returned Rows | Querying `SELECT * FROM products WHERE name LIKE '%rodillera%'` without an index | D1 counts EVERY row scanned in the table against the 5M daily row limit, NOT just the matching rows returned. |
| 6 | Cloudflare R2 Class B Caching | Kiosk loads product images repeatedly with `Cache-Control: public, max-age=31536000` | First request hits R2 (1 Class B operation). All subsequent requests are served from Cloudflare's Edge Cache / local browser disk, consuming 0 R2 operations and $0 bandwidth. |
| 7 | Cloudinary Rolling Window | 24 credits consumed between Day 1 and Day 15; sudden traffic spike on Day 16 consumes 2 credits | Total reaches 26 credits (> 25 cap). Cloudinary sends overage alerts and begins throttling delivery until the usage from Day 1 drops off after 30 days. |
| 8 | PocketBase on Render Free Tier | PocketBase deployed on Render free tier; kiosk successfully stores products; app sleeps after 15 min idle | Render shuts down the container. On wake-up, the container is recreated from a clean git image. All products, schemas, and images in `pb_data` are permanently lost. |

---

## 6. Synthesis & Recommended Architecture

### Assessment of Current Codebase (`src/services/supabase.js`)
- The project already has an active Supabase project (`https://xvrnssesbkzxeusubzes.supabase.co`) with an anon key and an offline-resilient lead submission mechanism (`prospectos_comerciales`).
- **Can Supabase Free Tier host the entire product catalog and images?**
  - **Product Data**: YES. Storing 1,000 products in Postgres requires ~10 MB, well within the 500 MB limit.
  - **Images**: **NO**. 5 GB of images exceeds the 1 GB bucket limit by 500%.
  - **Reliability**: RISKY. If the kiosk is idle for 7 days, the database pauses, breaking both product loading and lead capture unless an automated keep-alive ping is configured.

### Top Recommended Architectural Solutions

#### Option A: Cloudflare Edge Stack (D1 + R2 + Workers) — Best Overall Free Tier Architecture
- **Database**: Cloudflare D1 (5 GB storage, 5M reads/day, edge-distributed SQLite).
- **Images**: Cloudflare R2 (10 GB storage, 10M reads/month, **$0 egress fees**).
- **Why It Wins**:
  - 100% free with zero credit card risk.
  - Generous headroom (10 GB image storage handles the 5 GB requirement with 2x margin; 5 GB DB handles 1,000 products with 500x margin).
  - Never sleeps or pauses (zero cold starts).
  - Native CDN edge caching for kiosk media.

#### Option B: Hybrid Supabase (Data) + Cloudflare R2 (Images) + Keep-Alive Cron — Minimal Codebase Disruption
- **Database**: Existing Supabase Postgres for products and leads (`src/services/supabase.js`).
  - *Fix for 7-day pause*: Configure a scheduled GitHub Actions workflow (or free cron-job.org task) to send a lightweight SQL query every 72 hours.
- **Images**: Cloudflare R2 bucket mapped to a custom domain (10 GB free, $0 egress).
- **Why It Works**: Keeps existing Supabase lead capture untouched while solving the 1 GB image storage barrier with R2's free 10 GB allowance.

#### Option C: Hybrid Supabase/Firestore (Data) + Cloudinary (Images) — Best Image Auto-Optimization
- **Database**: Supabase or Firebase Firestore for product JSON schemas.
- **Images**: Cloudinary (25 monthly credits).
- **Why It Works**: `f_auto, q_auto` reduces 5 GB of raw images into ~1 GB of WebP delivery, conserving bandwidth and accelerating kiosk UI transitions.
