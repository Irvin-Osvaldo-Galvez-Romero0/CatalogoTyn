# Handoff Report — Codebase Architecture Exploration

**Agent:** `explorer_codebase` (Teamwork Explorer)  
**Parent / Recipient:** `orchestrator` (`8013adfb-364d-4208-a097-112f6d91567e`)  
**Mission:** Codebase architecture and catalog exploration for online database and storage evaluation  
**Date:** 2026-11-02  
**Handoff Type:** Hard (Task complete)

---

## 1. Observation

1. **Supabase Integration Code:**
   - File: `src/services/supabase.js`, lines 6-8:
     ```javascript
     const SUPABASE_URL = 'https://xvrnssesbkzxeusubzes.supabase.co';
     const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
     ```
   - Target endpoint: `fetch(`${SUPABASE_URL}/rest/v1/prospectos_comerciales`, ...)` at lines 43 and 98.
   - Offline handling: `localStorage.getItem('tynor_pending_leads')` at lines 76 and 89; auto-sync triggered on `window.addEventListener('online', ...)` at line 127.
   - Dependency check: `@supabase/supabase-js` is completely absent from `package.json` dependencies (lines 23-33). Only standard `fetch` is used.

2. **Live Supabase Project State (Verified via Supabase MCP):**
   - Project: `CatalogoTyn` (Ref: `xvrnssesbkzxeusubzes`, Postgres 17.11, region `us-east-1`, status `ACTIVE_HEALTHY`).
   - Tables: `public.prospectos_comerciales` (16 rows), `public.codia_leads_inbound` (1 row), `public.codia_prospectos_outbound` (16 rows).
   - Storage buckets: Executing `SELECT * FROM storage.buckets;` via MCP returned `[]` (0 buckets configured).

3. **Catalog Data Structure:**
   - File: `src/data/products.js` (224 KB, 5,594 lines).
   - Quantitative breakdown (verified with Node.js):
     - `PRODUCTS.length`: exactly `180` products.
     - Distribution: 132 ORTOPEDIA, 27 Deportiva, 21 REHABILITACION.
     - Attributes present: `code`, `name`, `cat`, `price`, `bodyPart`, `badge`, `linea`, `sizes`, `colors`, `hasPdf`, `hasVideo`, `shortDesc`, `desc`, `uses`, `features`.
     - `price`: `null` across all 180 products.
     - `sizes`: Array of strings (`["CH", "M", "G", "XL"]` or `["Universal"]`).
     - `colors`: Optional array of `{ id, name, hex, border }` (e.g., product `101`).
     - Categories: `CATEGORIES` array (10 items).
     - Body parts: `BODY_PARTS` array (9 items) mapped to 3D hotspots.

4. **Static Media Footprint & Binary Bloat:**
   - Measured directory sizes in `public/`:
     - `public/pdf/`: 172 files, **911.13 MB**.
     - `public/assets/`: 186 files, **62.87 MB** (includes `Model_Human.glb` 1.45 MB and `Model_Skeleton.glb` 4.82 MB).
     - `public/video/`: 2 files, **8.18 MB**.
     - `public/pdfjs/`: 2 files, **1.04 MB**.
   - Resulting artifact sizes in repository root:
     - `Tynor-Catalogo-Portable.exe`: **1,060,897,042 bytes (1.06 GB)**.
     - `TynorCatalogo-v2.7.apk`: **1,036,657,970 bytes (1.03 GB)**.

5. **Multi-Platform & Networking Architecture:**
   - **Vite & PWA (`vite.config.js`):** `VitePWA` configured with `maximumFileSizeToCacheInBytes: 120MB` and globbing `**/*.{js,css,html,png,svg,glb,pdf,mp4}`.
   - **Electron (`electron/main.cjs`):** Custom embedded HTTP server on dynamic port `127.0.0.1:<port>` with HTTP Range Requests (206) for media streaming, GPU acceleration flags, fullscreen kiosk mode (`mainWindow.setKiosk(true)`).
   - **Capacitor (`android/app/src/main/AndroidManifest.xml`):** Permissions `android.permission.INTERNET`, `android.permission.ACCESS_NETWORK_STATE`, and `android:usesCleartextTraffic="true"`.
   - Test execution: `node --test tests/catalog_tdd.test.js` passes 13/15 tests. The 2 failures are due to an uninitialized variable `details` in `src/data/salesReps.js:79-105`.

---

## 2. Logic Chain

1. **From Observation 1 & 2:** Supabase is already partially integrated into the project for lead capture without any client SDK overhead (`fetch` only). Because the project `xvrnssesbkzxeusubzes` is active on Postgres 17 in `us-east-1` under the user's organization, expanding this exact instance to store the product catalog (`products`, `categories`) requires zero new infrastructure setup and preserves the existing zero-dependency PostgREST client architecture.
2. **From Observation 3:** The catalog schema is completely homogeneous and relational. The 180 products map directly to a standard relational table (`products`) with foreign key to `categories` and jsonb columns for `sizes`, `colors`, `uses`, and `features`.
3. **From Observation 4:** The 1.06 GB portable `.exe` and 1.03 GB `.apk` are overwhelmingly caused by the 911 MB of PDFs in `public/pdf/` and 63 MB of images in `public/assets/`. If these assets are moved to cloud object storage (e.g., Supabase Storage, Cloudflare R2, Cloudinary, or Firebase Storage) and referenced via CDN URLs, the packaged application binaries will shrink by >96% (down to ~30-40 MB).
4. **From Observation 5:** All three target platforms (Electron on loopback HTTP, Capacitor on localhost WebView, and standard Web/PWA) support native HTTPS `fetch()` and standard HTTP caching. An online-first catalog with browser caching will function reliably across all deployment targets without requiring heavy offline sync engines.

---

## 3. Caveats

- **Supabase Free Tier Inactivity Policy:** Free-tier Supabase projects are paused after 7 days of inactivity. Because the kiosk is used for specific events (e.g. EXPOMEDICAL), an unpausing mechanism or ping strategy (or an alternative like Cloudflare D1/R2 or Firebase) must be evaluated to ensure kiosk availability during exhibitions.
- **Supabase Storage Free Tier Limits:** Supabase free tier provides 1 GB of storage and 2 GB of monthly egress. With 911 MB of uncompressed PDFs, hosting both PDFs and images on Supabase Storage alone would consume ~97% of the 1 GB quota and could quickly breach the 2 GB egress limit if multiple kiosks download PDFs simultaneously. Optimizing PDF compression or using Cloudflare R2 (10 GB free storage, zero egress fees) must be strongly weighed by the comparative evaluation.
- **Existing bug in `salesReps.js`:** Variable `details` error in `buildWhatsAppMessage` was noted but not modified, honoring the read-only constraint.

---

## 4. Conclusion

1. Expanding the existing Supabase instance (`xvrnssesbkzxeusubzes`) for **product structured data** is technically seamless: it requires creating two tables (`categories`, `products`), uses the existing PostgREST `fetch()` pattern, and easily fits within Supabase's 500 MB database free quota (180 products will consume < 2 MB).
2. For **image and PDF media hosting**, the existing 983 MB asset collection (specifically 911 MB of PDFs) exceeds the comfortable safety margin of Supabase's 1 GB storage and 2 GB/month egress limits. Therefore, a hybrid solution (Supabase database + Cloudflare R2 / Cloudinary / dedicated CDN) or aggressive asset compression (reducing PDFs from 911 MB to < 200 MB and converting PNGs to WebP) is essential for free-tier sustainability.
3. Network and storage capabilities in Electron, Capacitor Android, and Vite PWA are fully compatible with online CDN loading and client-side HTTP caching.

---

## 5. Verification Method

To independently verify the observations and data in this report:

1. **Verify Supabase Integration:**
   ```bash
   grep -n "SUPABASE_" src/services/supabase.js
   ```
2. **Verify Product Catalog Count and Schema:**
   ```bash
   node -e "import('./src/data/products.js').then(m => console.log('Count:', m.PRODUCTS.length, 'Keys:', Object.keys(m.PRODUCTS[0])))"
   ```
3. **Verify Asset Directory Sizes:**
   ```bash
   node -e "const fs = require('fs'), path = require('path'); ['public/assets', 'public/pdf', 'public/video'].forEach(d => { const files = fs.readdirSync(d); let size = files.reduce((acc, f) => acc + fs.statSync(path.join(d, f)).size, 0); console.log(d, files.length, 'files', (size/(1024*1024)).toFixed(2), 'MB'); });"
   ```
4. **Verify Existing Tests:**
   ```bash
   node --test tests/catalog_tdd.test.js
   ```
5. **Verify Supabase Live Database via MCP:**
   Call `list_tables` on project `xvrnssesbkzxeusubzes`.
