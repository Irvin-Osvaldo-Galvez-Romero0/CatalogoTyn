# Kiosk Client Architecture, Caching & Bandwidth Consumption Report

**Project:** Tynor Catálogo Interactivo Kiosco (React, Vite, Electron, Android/Capacitor)  
**Author:** Kiosk Client Architecture & Caching Explorer  
**Date:** 2026-11-02  
**Status:** Completed Analysis & Architectural Specification  

---

## 1. Executive Summary & Architectural Direction

The Tynor interactive medical catalog is deployed across three distinct kiosk runtimes:
1. **Web Kiosk (React + Vite)**: Running in Chromium kiosk mode on embedded web displays.
2. **Desktop Kiosk (Electron)**: Running on Windows/Linux kiosk terminals (`electron/main.cjs`).
3. **Android APK Kiosk (Capacitor)**: Running on standalone Android tablets (`@capacitor/android`).

The project is scaling from a bundled static product catalog of ~180 items to an online catalog of **100 to 1,000 products** with up to **5 GB of high-resolution images**, while operating strictly on **free-tier cloud infrastructure** and maintaining zero-latency touchscreen navigation.

### Core Findings & Strategic Recommendations:

| Dimension | Critical Finding | Strategic Architectural Recommendation |
| :--- | :--- | :--- |
| **Media Delivery** | Current assets are unoptimized PNGs up to 3.08 MB (e.g., `401.png` is 3.08 MB). Grid cards and detail modals both load the same heavy image file. | Implement a **Two-Tier Image Pipeline** with modern WebP/AVIF format: **Thumbnails (400x400, ~30 KB)** for grid cards and **Details (1200x1200, ~110 KB)** for modals. This cuts image weight by **92% - 96%**. |
| **Egress Quota Risk** | Supabase free tier imposes a strict **2 GB/month egress limit** and **1 GB storage cap**. Without caching, a single tradeshow kiosk burns **~38 GB/day**, breaching Supabase's monthly quota in less than 2 hours. | **Decoupled Architecture**: Use **Cloudflare R2** for image storage ($0 egress fees, 10 GB free storage) backed by Cloudflare CDN, while reserving Supabase strictly for transactional lead capture (`submitLead`). |
| **Multi-Platform Caching** | Electron and Web run standard Chromium with multi-gigabyte disk cache capacity; Android WebView has constrained cache size and is subject to aggressive OS memory eviction. | Deploy a **3-Tier Cache Strategy**: Tier 1 HTTP headers (`max-age=31536000, immutable`), Tier 2 Service Worker with Workbox `CacheFirst` for images and `StaleWhileRevalidate` for catalog JSON, and Tier 3 IndexedDB metadata hydration. |
| **Network Resilience & DB Pausing** | Supabase free projects sleep after 7 days of inactivity (taking 2–4 minutes to unpause). Network at medical trade shows (e.g. EXPOMEDICAL) is notoriously unstable. | Decouple read-heavy catalog viewing (static JSON on CDN/R2) from writes. Persist full catalog snapshots in IndexedDB so the kiosk boots instantly offline even if the remote DB is paused or unreachable. Use the existing local queue in `supabase.js` for offline lead capture. |

```
                                  +---------------------------------------+
                                  |         Cloudflare R2 + CDN           |
                                  |   (Catalog JSON + WebP Media, $0/GB)  |
                                  +-------------------+-------------------+
                                                      |
                                   HTTP Cache-Control: max-age=31536000
                                                      |
+-----------------------------------------------------v-----------------------------------------------------+
|                                          KIOSK RUNTIME ENVIRONMENT                                        |
|                                                                                                           |
|  +--------------------+         +-------------------------------------+         +----------------------+  |
|  | React/Vite (Web)   |         | Electron Desktop (main.cjs)         |         | Capacitor (Android)  |  |
|  | - Chromium Engine  |         | - http://127.0.0.1 Internal Server  |         | - Android WebView    |  |
|  | - Persistent Profile|        | - Chromium Session Disk Cache       |         | - ServiceWorker / IDB|  |
|  +---------+----------+         +------------------+------------------+         +----------+-----------+  |
|            |                                       |                                       |              |
|            +---------------------------------------+---------------------------------------+              |
|                                                    |                                                      |
|                                     +--------------v---------------+                                      |
|                                     |    Service Worker / Workbox  |                                      |
|                                     |  - CacheFirst: /images/*     |                                      |
|                                     |  - StaleWhileRevalidate: JSON|                                      |
|                                     +--------------+---------------+                                      |
|                                                    |                                                      |
|                                  +-----------------+-----------------+                                    |
|                                  |                                   |                                    |
|                         +--------v---------+               +---------v--------+                           |
|                         |  Cache API Disk  |               |    IndexedDB     |                           |
|                         |  (WebP Images)   |               | (Product Catalog)|                           |
|                         +------------------+               +------------------+                           |
+----------------------------------------------------+------------------------------------------------------+
                                                     |
                                            POST /rest/v1/prospectos_comerciales
                                                     |
                                  +------------------v--------------------+
                                  |         Supabase Database Free        |
                                  |      (Lead Capture & Sales Reps)      |
                                  |      Queue-protected offline sync     |
                                  +---------------------------------------+
```

---

## 2. Target Platforms Deep-Dive Analysis

### 2.1. Platform 1: React + Vite (Standard Web Browser / Web Kiosk)

* **Operating Context:** Chrome/Edge running in kiosk mode (e.g., `--kiosk --noerrdialogs --disable-infobars`).
* **Cache Architecture:**
  * **Chromium HTTP Disk Cache:** Managed automatically by the browser network stack based on HTTP response headers. Default disk cache size dynamically scales based on available storage, typically ranging from 320 MB to over 1 GB on modern systems.
  * **Cache API (`caches.open`):** Managed programmatically by Service Workers. Quota is governed by the Storage Foundation API: Chromium allocates up to **60% of free disk space** for origin storage.
  * **IndexedDB:** Co-located under origin storage quota. Excellent for holding 1,000 product JSON records (~1.5 MB).
  * **LocalStorage:** Hard cap of **5 MB**. Currently used for `PENDING_LEADS_KEY` and sales rep assignment. **Must NOT** be used to store base64 images or massive product lists.
* **Eviction Policies & Kiosk Flags:**
  * In standard browsers, low disk pressure triggers LRU eviction of HTTP cache entries.
  * **Critical Kiosk Vulnerability:** If a web kiosk is launched with `--incognito`, all disk caches and IndexedDB storage are in-memory and wiped completely when the browser process restarts or crashes.
  * **Operational Rule:** Web kiosks must be launched with a persistent user data directory flag:  
    `chrome.exe --kiosk --user-data-dir="C:\TynorKioskProfile" https://kiosk.tynor.com`
  * **Storage Persistence API:** The web app should invoke `navigator.storage.persist()` on boot to request durable storage, preventing the browser from evicting cached images under system disk pressure.

### 2.2. Platform 2: Electron Desktop Kiosk (`electron/main.cjs`)

* **Operating Context:** Packaged desktop application built with `electron-builder` (`Tynor Catálogo Kiosco Portable.exe` / NSIS installer).
* **Network & Cache Topology in Codebase:**
  * As verified in `electron/main.cjs` (lines 50–133), Electron spins up an internal Node.js HTTP server at `http://127.0.0.1:${port}` serving static SPA files from `dist/`.
  * External network requests (e.g. remote API calls, Supabase REST endpoints, CDN image URLs) bypass the local Node server and pass directly through Chromium’s native network stack on `session.defaultSession`.
  * **Cache Directory:** Chromium writes HTTP cache files directly to the application's persistent data directory:  
    `%APPDATA%\com.tynor.catalogokiosk\Cache\Cache_Data` on Windows, and  
    `~/.config/com.tynor.catalogokiosk/Cache` on Linux.
  * **Cache Persistence:** Fully persistent across restarts and power cycles without any special flags.
* **Low-Spec Hardware Constraints (Line 16 of `main.cjs`):**
  * Line 16 explicitly configures:  
    `app.commandLine.appendSwitch('js-flags', '--max-old-space-size=512');`
  * This limits the V8 JavaScript heap to **512 MB** to support low-cost kiosk PCs (Intel Atom, Celeron, legacy Intel HD Graphics).
  * **Severe Anti-Pattern Avoidance:** Do **NOT** download images as JavaScript `Blob` objects and store them in React state or an in-memory dictionary. 1,000 images decoded in JS heap will instantly trigger a V8 `Out of Memory` crash!
  * **Correct Pattern:** Let Chromium’s native C++ network disk cache handle the binary storage of images; React components simply render `<img src="https://cdn.../product.webp" />`.
* **Service Worker Support:** Fully functional because `http://127.0.0.1` is classified as a Secure Context by Chromium specification.

### 2.3. Platform 3: Capacitor (Android Tablet / Standalone APK)

* **Operating Context:** Android tablet running `@capacitor/android` inside `android.webkit.WebView`.
* **Cache Architecture:**
  * **Android System WebView HTTP Cache:** Located in app-internal cache:  
    `/data/data/com.tynor.catalogokiosk/cache/WebView/Default/HTTP Cache`.
  * **Android Storage Quota & Eviction Vulnerability:**  
    Unlike desktop PCs with hundreds of gigabytes of disk space, budget Android tablets (16 GB - 32 GB eMMC storage) face aggressive OS-level storage management. When free disk space drops below system thresholds, Android invokes `ComponentCallbacks2.onTrimMemory(TRIM_MEMORY_RUNNING_CRITICAL)` and automatically purges the WebView HTTP Cache without warning!
  * **Android WebView Cache Size:** Historically capped at 20 MB–50 MB in older Android versions; modern Android System WebView dynamically allocates up to 100 MB–250 MB. For a catalog of 1,000 products with multi-angle photos (500 MB+), older products will be evicted if relying solely on default WebView HTTP cache.
* **Architectural Decision for Android APK:**
  * **Option A: Standard WebView HTTP Cache.** Zero extra dependencies. If combined with optimized WebP thumbnails (1,000 products x 30 KB = 30 MB), the entire thumbnail set fits within the standard Android WebView cache limit!
  * **Option B: Workbox Service Worker with Cache API.** Supported in modern Android WebViews (`Android 7.0+` with modern WebView engine). Provides explicit cache quota control.
  * **Option C: Native Filesystem Caching (`@capacitor/filesystem`).** Stores images in `Directory.Data` (app internal storage, immune to OS cache trimming). Only necessary if tablets are operating in 100% offline environments for weeks at a time.
  * **Verdict for Online-Only Kiosk:** **Option B (Workbox Cache API)** backed by standard HTTP headers is the optimal balance: it prevents OS cache wipes, operates identically across Web, Electron, and Capacitor, and avoids the maintenance overhead of native filesystem plugin bindings.

---

## 3. Caching Strategies & Performance Optimization

### 3.1. Client HTTP Caching Headers Matrix

To maximize client caching and minimize network egress, remote storage services must return RFC-compliant HTTP caching headers:

| Header | Directive | Ideal Target | Client Behavior |
| :--- | :--- | :--- | :--- |
| `Cache-Control` | `public, max-age=31536000, immutable` | Product Images (`/images/*.webp`), 3D Models (`.glb`) | **Zero network round-trips.** Browser serves from local disk cache for 1 year without sending any HTTP request. |
| `Cache-Control` | `public, max-age=60, stale-while-revalidate=86400` | Product Catalog JSON (`/api/catalog.json`) | Serves cached catalog instantly (0ms), revalidates in background once per minute. |
| `ETag` | W/"[hash]" | Catalog JSON, Stock/Price updates | If cache expired, client sends `If-None-Match`. Server responds with `304 Not Modified` (~300 bytes), avoiding re-downloading data. |
| `Cache-Control` | `no-cache, no-store, must-revalidate` | Lead Submissions (`submitLead`) | Guarantees leads are always posted live to server, never cached. |

#### Provider Default Header Traps:
* **Supabase Storage Default:** Returns `Cache-Control: max-age=3600` (1 hour). If left default, every kiosk will re-download every viewed image every 60 minutes, multiplying egress by 10x!  
  *Fix:* When configuring Supabase Storage buckets or uploading files via JS SDK, explicitly pass `{ cacheControl: '31536000' }`.
* **Firebase Storage Default:** Returns `Cache-Control: max-age=3600`. Must be configured via upload metadata.
* **Cloudflare R2 + CDN:** Custom Edge and Browser Cache TTL can be set globally in Cloudflare Cache Rules (`Browser TTL: 1 year, Edge TTL: 1 month`).

### 3.2. Caching Tier Comparison

```
+---------------------------------------------------------------------------------------+
|                                    CACHING TIERS                                      |
+---------------------------------------------------------------------------------------+
| Tier 1: CDN Edge Cache (Cloudflare)                                                   |
| - Absorbs 99% of origin hits                                                          |
| - Worldwide PoPs, sub-20ms TTFB                                                       |
+---------------------------------------------------------------------------------------+
                                           |
+------------------------------------------v--------------------------------------------+
| Tier 2: Browser / Chromium Disk Cache (HTTP Stack)                                    |
| - Standard zero-code caching via Cache-Control: max-age=31536000, immutable           |
| - Fast binary retrieval from OS disk                                                  |
+---------------------------------------------------------------------------------------+
                                           |
+------------------------------------------v--------------------------------------------+
| Tier 3: Service Worker Runtime Cache (Workbox Cache API)                              |
| - CacheFirst strategy for /images/* with maxEntries: 1000                             |
| - StaleWhileRevalidate for catalog metadata                                           |
| - Pre-caches critical UI thumbnails on app boot                                       |
+---------------------------------------------------------------------------------------+
                                           |
+------------------------------------------v--------------------------------------------+
| Tier 4: Structured Data Cache (IndexedDB)                                             |
| - Hydrates catalog state in React instantly (<50ms on cold start)                     |
| - Survives offline drops, database cold-starts, and pause periods                     |
+---------------------------------------------------------------------------------------+
```

### 3.3. Image Format & Multi-Resolution Optimization

#### Problem in Current Codebase:
Inspection of `public/assets/` revealed that products are represented as unoptimized PNG files:
* `401.png` is **3.08 MB** (3,084,230 bytes)
* `K10.png` is **1.96 MB** (1,961,569 bytes)
* `108.png` is **1.88 MB** (1,884,294 bytes)
* `CatalogView.jsx` (grid card) and `ProductDetailModal.jsx` (full detail) **both load the identical image** (`/assets/${p.code}.png`).
* For 100 products, browsing the catalog grid downloads ~80 MB of images. For 1,000 products, this explodes to **800 MB - 3 GB** just to display the browsing grid!

#### Optimization Strategy:
1. **Format Conversion to WebP / AVIF:**
   * Modern orthotic products require transparent backgrounds (alpha channel).
   * WebP with alpha transparency achieves **75% to 85% compression** over PNG with no perceptual loss of clinical detail.
   * AVIF achieves **85% to 92% compression**, supported across all modern Chromium versions (Electron 44 has Chromium 128; modern Android WebView has Chromium 100+).
2. **Two-Tier Resolution Architecture:**
   * **Thumbnail Tier (`thumb`):** 400x400 px WebP (Quality 80). Average file size: **~25 KB – 35 KB**. Used in `CatalogView.jsx`, `AnatomyView.jsx`, and `InterestDrawer.jsx`.
   * **Detail Tier (`detail`):** 1200x1200 px WebP (Quality 85). Average file size: **~100 KB – 140 KB**. Loaded on-demand only when the customer taps a product to open `ProductDetailModal.jsx`.
3. **HTML5 Loading Attributes:**
   * Grid cards: `<img src={p.thumbUrl} loading="lazy" decoding="async" />`
   * Detail Modal: `<img src={p.detailUrl} fetchpriority="high" decoding="sync" />`
   * First 6 grid cards in viewport: `<img src={p.thumbUrl} loading="eager" fetchpriority="high" />`

---

## 4. Bandwidth and Quota Consumption Model

### 4.1. Modeling Parameters & Assumptions

* **Catalog Size Variations:**
  * **100 Products:** Small clinic or boutique line.
  * **500 Products:** Standard full catalog across all therapeutic categories.
  * **1,000 Products:** Comprehensive enterprise catalog with variants and accessories.
* **Image Size Assumptions:**
  * **Raw PNG (Current State):** Average 800 KB per product (up to 3 MB for complex items).
  * **Optimized WebP (Two-Tier):**
    * Thumbnail (400x400): 30 KB
    * Detail modal (1200x1200): 110 KB
    * Total footprint per product: 140 KB
* **Kiosk Usage Profiles:**
  * **Profile 1: Showroom / Medical Clinic (Moderate Traffic)**
    * 50 visitors / day.
    * 40 products viewed in grid per visitor (scroll depth).
    * 15 product detail modals opened per day.
    * Screen-saver Attract Mode: Cycles through 32 featured products 20 times/day (640 impressions).
  * **Profile 2: EXPOMEDICAL Convention Booth (High-Intensity Traffic)**
    * 300 visitors / day.
    * 150 products viewed in grid per visitor.
    * 500 product detail modals opened per day.
    * Screen-saver Attract Mode: Cycles through 32 featured products 50 times/day (1,600 impressions).

---

### 4.2. Mathematical Consumption Calculations

#### Scenario A: No Client Caching (Worst-Case / Incognito / Cache Disabled)
*Every image render fetches directly from the remote storage server over the network.*

$$\text{Daily Egress} = (\text{Visitors} \times \text{Grid Views} \times \text{Size}_{\text{card}}) + (\text{Detail Views} \times \text{Size}_{\text{detail}}) + (\text{Attract Views} \times \text{Size}_{\text{card}})$$

* **Moderate Kiosk (50 visitors/day):**
  * *Unoptimized PNG (800 KB / 1.5 MB):*
    $$\text{Grid} = 50 \times 40 \times 0.8\text{ MB} = 1,600\text{ MB}$$
    $$\text{Detail} = 15 \times 1.5\text{ MB} = 22.5\text{ MB}$$
    $$\text{Attract} = 640 \times 0.8\text{ MB} = 512\text{ MB}$$
    $$\mathbf{\text{Daily Total}} = \mathbf{2.13\text{ GB / day}} \quad\longrightarrow\quad \mathbf{\text{Monthly (30 days)}} = \mathbf{64.0\text{ GB / month}}$$
  * *Optimized WebP (30 KB / 110 KB):*
    $$\text{Grid} = 50 \times 40 \times 0.03\text{ MB} = 60\text{ MB}$$
    $$\text{Detail} = 15 \times 0.11\text{ MB} = 1.65\text{ MB}$$
    $$\text{Attract} = 640 \times 0.03\text{ MB} = 19.2\text{ MB}$$
    $$\mathbf{\text{Daily Total}} = \mathbf{80.85\text{ MB / day}} \quad\longrightarrow\quad \mathbf{\text{Monthly (30 days)}} = \mathbf{2.43\text{ GB / month}}$$

* **High-Intensity Kiosk (EXPOMEDICAL, 300 visitors/day):**
  * *Unoptimized PNG (800 KB / 1.5 MB):*
    $$\text{Grid} = 300 \times 150 \times 0.8\text{ MB} = 36,000\text{ MB (36 GB)}$$
    $$\text{Detail} = 500 \times 1.5\text{ MB} = 750\text{ MB}$$
    $$\text{Attract} = 1,600 \times 0.8\text{ MB} = 1,280\text{ MB}$$
    $$\mathbf{\text{Daily Total}} = \mathbf{38.03\text{ GB / day}} \quad\longrightarrow\quad \mathbf{\text{3-Day Expo}} = \mathbf{114.1\text{ GB}}$$
  * *Optimized WebP (30 KB / 110 KB):*
    $$\text{Grid} = 300 \times 150 \times 0.03\text{ MB} = 1,350\text{ MB (1.35 GB)}$$
    $$\text{Detail} = 500 \times 0.11\text{ MB} = 55\text{ MB}$$
    $$\text{Attract} = 1,600 \times 0.03\text{ MB} = 48\text{ MB}$$
    $$\mathbf{\text{Daily Total}} = \mathbf{1.45\text{ GB / day}} \quad\longrightarrow\quad \mathbf{\text{3-Day Expo}} = \mathbf{4.36\text{ GB}}$$

---

#### Scenario B: Standard HTTP Caching (Browser/WebView Disk Cache)
*Assets are fetched once upon first encounter and stored in the local disk cache with `max-age=31536000, immutable`. Subsequent impressions are served locally at 0 bytes network egress.*

* **Day 1 (Cache Warm-Up):**
  * In a 500-product catalog, visitors gradually browse through the catalog.
  * Grid thumbnails downloaded: 500 products $\times$ 30 KB = 15.0 MB.
  * Detail modals opened: ~150 distinct products $\times$ 110 KB = 16.5 MB.
  * Attract mode featured products (32 items): Already included in thumbnail set = 0 MB.
  * **Day 1 Total Egress:** **31.5 MB**.
* **Days 2 to 30 (Operational State, 98% Cache Hit Rate):**
  * All previously viewed products are served from disk. Egress is only incurred for the occasional un-cached detail view or catalog update (~1.5 MB / day).
  * Total Days 2–30 Egress: $29\text{ days} \times 1.5\text{ MB} = 43.5\text{ MB}$.
* **Monthly Total per Kiosk (500 Products, Optimized WebP):**  
  $$31.5\text{ MB} + 43.5\text{ MB} = \mathbf{75.0\text{ MB / month per kiosk}}$$
* **Monthly Total per Kiosk (500 Products, Unoptimized PNG):**  
  $$400\text{ MB (Day 1)} + (29 \times 12\text{ MB}) = \mathbf{748\text{ MB / month per kiosk}}$$

---

#### Scenario C: Pre-Caching / Aggressive Stale-While-Revalidate (Service Worker)
*On kiosk boot or idle background sync, the application downloads the entire catalog thumbnail bundle and catalog JSON.*

* **Initial Warm-up Synchronization (One-Time per deployment/update):**
  * 100 Products: $100 \times 30\text{ KB} + 0.3\text{ MB JSON} = \mathbf{3.3\text{ MB}}$
  * 500 Products: $500 \times 30\text{ KB} + 0.8\text{ MB JSON} = \mathbf{15.8\text{ MB}}$
  * 1,000 Products: $1,000 \times 30\text{ KB} + 1.5\text{ MB JSON} = \mathbf{31.5\text{ MB}}$
* **Ongoing Daily Operation:**
  * 100% of grid browsing, category switching, search filtering, and Attract Mode impressions consume **0 bytes** network egress.
  * Detail modals use `CacheFirst`: only downloaded on first click (~1.0 MB/day).
  * Catalog freshness check: Hourly `ETag` conditional check returns `304 Not Modified` (~300 bytes $\times$ 24 = 7.2 KB/day).
* **Monthly Total per Kiosk (1,000 Products, Optimized WebP):**  
  $$31.5\text{ MB (One-time)} + (30\text{ days} \times 1.0\text{ MB}) + 0.2\text{ MB ETag} = \mathbf{61.7\text{ MB / month per kiosk}}$$

---

### 4.3. Free-Tier Quota Comparison & Exhaustion Risk

| Cloud Provider | Storage Quota | Monthly Egress Quota | Scenario A (No Cache) | Scenario B (HTTP Cache) | Scenario C (Pre-Cache) | Feasibility Verdict |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Supabase Free** | 1 GB Storage, 500 MB DB | **2 GB / month** (project total) | **CRITICAL FAILURE** (Exhausted in 2 to 24 hours) | **MARGINAL** (1 kiosk OK; 3 kiosks breach 2 GB cap) | **VIABLE for 1-15 kiosks** (61 MB/kiosk $\times$ 15 = ~920 MB) | ⚠️ **High Risk:** Storage capped at 1 GB; projects pause after 7 days of inactivity. |
| **Firebase Spark** | 5 GB Storage, 1 GB Firestore | **1 GB / day** (~30 GB / month) | **FAIL** on EXPO booth (38 GB/day); pass on slow showroom | **PASS** (Consumes < 3% of daily quota) | **PASS** (Consumes < 1% of daily quota) | ⚠️ **Medium Risk:** 50,000 Firestore document reads/day can be exceeded if queries are not cached. |
| **Cloudflare R2 + CDN** | 10 GB Storage | **$0.00 / UNLIMITED** (Zero Egress Fees) | **PASS** (Unlimited egress, no overage fees) | **PASS** (Unlimited egress) | **PASS** (Unlimited egress) | 🏆 **BEST SOLUTION:** Zero egress cost, 10 GB storage, no inactivity sleep, global edge CDN. |
| **Cloudinary Free** | 25 Credits (~25 GB / mo) | Shared within 25 GB quota | **FAIL** on EXPO booth (Burns 25 GB on Day 1) | **PASS** for 10–20 kiosks | **PASS** for 50+ kiosks | ⚠️ **Medium Risk:** Hard monthly limit; account freezes if exceeded. |

---

## 5. Network Resilience & Online Operation

### 5.1. Handling Transient Network Drops in Kiosks

Medical kiosks at trade shows or retail clinics operate over shared Wi-Fi or cellular dongles with intermittent drops and packet loss. An interactive kiosk must **never** freeze, display browser error screens ("No Internet"), or fail to record interested customer leads.

#### Resilience Mechanisms:
1. **Zero-Failure Lead Capture:**  
   The project’s existing implementation in `src/services/supabase.js` (lines 58–68) already contains the ideal local offline queue:
   ```javascript
   // Fallback to LocalStorage if network fetch fails
   enqueuePendingLead(payload);
   return { success: true, offline: true, warning: 'Guardado localmente. Se sincronizará automáticamente.' };
   ```
   When connectivity returns, `window.addEventListener('online', ...)` automatically flushes pending leads via `syncPendingLeads()`.
2. **Graceful Image Loading (`<KioskImage>` Component):**  
   If an uncached detail image fails to download due to a network drop:
   * Show an animated skeleton placeholder.
   * Attempt 3 exponential retries with jitter (`1s`, `2s`, `4s`).
   * If all retries fail, fall back seamlessly to `/assets/default.png` with a subtle retry badge rather than a broken image icon.
3. **Non-Intrusive Offline Status:**  
   Instead of modal popups or blocking banners, show a minimal offline dot in `KioskHeader.jsx` (`Offline — Modo Catálogo Local`).

---

### 5.2. Latency Optimization: Initial Load vs. Catalog Navigation

To deliver a snappy, 60fps touchscreen kiosk experience:

```
[ KIOSK BOOT ]
      |
      +---> Read catalog snapshot from IndexedDB / LocalStorage (< 50ms)
      |     ==> UI renders full catalog immediately (Zero Blank Screen)
      |
      +---> Background: Check ETag against /api/catalog.json (Async)
            |
            +---> If 304 Not Modified: Keep current state (0ms UI impact)
            +---> If 200 OK: Update IndexedDB, trigger subtle React re-render
```

* **Initial Load Latency:**
  * In Electron and Capacitor, the core JavaScript/CSS bundle is served locally (`127.0.0.1` or `localhost`), loading in `< 150ms`.
  * Catalog data should be hydrated immediately from `IndexedDB` snapshot. Total Time to Interactive (TTI): **< 300ms**.
* **Navigation & Filtering Latency:**
  * With 1,000 products, searching by text or switching categories must **never make a network request**.
  * Keep the 1,000 products in a client-side array (~1.5 MB in memory).
  * Filter operations (`CatalogView.jsx`, `AnatomyView.jsx`) execute in memory via `useMemo` in `< 5ms`, delivering silky-smooth 60fps scrolling on touchscreen displays.

---

### 5.3. Mitigating Database Pause and Cold-Start (Supabase Free Tier)

#### The Problem:
* Supabase Free Tier projects enter **Inactivity Pause** if they receive no API requests for 7 consecutive days. Restoring a paused project requires manual intervention in the dashboard or up to 4 minutes of provisioning delay.
* Even when not paused, serverless database compute can exhibit a **cold start of 1.5s to 4.0s** on the first query.
* If a kiosk depends on Supabase SQL queries to render the product catalog on boot, a sleeping database will crash or freeze the kiosk.

#### Architectural Solution: Read/Write Decoupling
* **Decouple Catalog Browsing (Read) from Lead Submission (Write):**
  * **Catalog Data (Read-Only):** The product catalog does not require a live SQL query for every kiosk view. Export the product catalog to a static, compressed JSON file (`catalog.json`) hosted on **Cloudflare R2 / CDN**.
  * Cloudflare R2 has **99.99% uptime, zero cold starts, zero inactivity pauses, and zero egress fees**.
  * **Lead Capture (Write-Only):** Supabase is used exclusively for `submitLead`. If Supabase is paused or sleeping when a visitor submits their data, the kiosk's offline queue saves it to `localStorage` immediately. The visitor experiences zero delay, and the kiosk syncs the lead once the database is awake.

---

## 6. Implementation Architecture & Actionable Blueprint

### 6.1. Workbox Runtime Caching (`vite.config.js`)

Add runtime caching rules to the existing `vite-plugin-pwa` in `vite.config.js` to automatically handle Tier 2 and Tier 3 caching:

```javascript
// Enhancement to vite.config.js
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        maximumFileSizeToCacheInBytes: 10 * 1024 * 1024,
        globPatterns: ['**/*.{js,css,html,svg,woff2}'],
        runtimeCaching: [
          // 1. WebP Product Images: Cache-First, valid for 60 days
          {
            urlPattern: /^https:\/\/cdn\.tynor\.com\/images\/.*\.(webp|avif|png)$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'tynor-product-images',
              expiration: {
                maxEntries: 1200,
                maxAgeSeconds: 60 * 24 * 60 * 60, // 60 days
                purgeOnQuotaError: true
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          // 2. Catalog JSON Metadata: Stale-While-Revalidate
          {
            urlPattern: /^https:\/\/cdn\.tynor\.com\/data\/catalog\.json$/i,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'tynor-catalog-data',
              expiration: {
                maxAgeSeconds: 24 * 60 * 60 // 24 hours
              }
            }
          }
        ]
      }
    })
  ]
});
```

---

### 6.2. Two-Tier Product Image Component Pattern

Replace direct `<img>` tags in `CatalogView.jsx` and `ProductDetailModal.jsx` with an optimized, resilient image component:

```jsx
// src/components/KioskImage.jsx
import React, { useState } from 'react';

const CDN_BASE = 'https://cdn.tynor.com/images';

export default function KioskImage({ 
  code, 
  variant = 'thumb', // 'thumb' (400x400) | 'detail' (1200x1200)
  alt = '', 
  className = '', 
  priority = false 
}) {
  const [hasError, setHasError] = useState(false);
  const imageSrc = hasError 
    ? '/assets/default.png' 
    : `${CDN_BASE}/${variant}/${code}.webp`;

  return (
    <img
      src={imageSrc}
      alt={alt}
      className={className}
      loading={priority ? 'eager' : 'lazy'}
      decoding={priority ? 'sync' : 'async'}
      fetchpriority={priority ? 'high' : 'auto'}
      onError={() => setHasError(true)}
    />
  );
}
```

---

## 7. Synthesis & Strategic Conclusions

1. **Storage & Egress Winner: Cloudflare R2 + Cloudflare CDN.**
   * For storing up to 5 GB of images and serving 100 to 1,000 products across multiple kiosks, **Cloudflare R2 is the only provider that guarantees zero egress billing risk ($0.00/GB)**.
   * Supabase's 2 GB/month egress and 1 GB storage limit make it unsafe for hosting large image catalogs directly on the free tier.
2. **Format & Pipeline: WebP Two-Tier Delivery.**
   * Converting the existing PNG assets to WebP and splitting them into 400x400 thumbnails and 1200x1200 detail modals reduces network payload by **96%**, lowering high-intensity tradeshow daily traffic from **38 GB/day to 1.45 GB/day**.
3. **Platform Caching Alignment:**
   * **Web & Electron:** Leverage Chromium's multi-gigabyte disk cache with persistent profile directory (`--user-data-dir` for web, automatic in Electron).
   * **Android Capacitor:** Rely on Workbox Cache API with `CacheFirst` rules to protect against Android OS WebView cache trimming.
4. **Resilience & DB Decoupling:**
   * Decouple read-heavy catalog viewing (Cloudflare R2 static JSON) from write-heavy lead capture (Supabase REST API).
   * This architectural boundary makes the kiosk 100% immune to Supabase 7-day inactivity pausing and database cold starts.
