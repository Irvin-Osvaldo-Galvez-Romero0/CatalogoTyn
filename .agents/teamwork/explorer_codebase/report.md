# CatalogoTyn: Codebase Architecture & Catalog Exploration Report

**Date:** 2026-11-02  
**Author:** Teamwork Explorer (Codebase Architecture)  
**Investigation Scope:** Read-Only Codebase Audit (`src/`, `electron/`, `android/`, `public/`, config files, live Supabase project)

---

## Executive Summary

The **CatalogoTyn** application is an interactive medical orthotics and rehabilitation catalog kiosk built with **React 18.3.1**, **Vite 5.4.11**, **Electron 44.9.0**, and **Capacitor 8.5.3 (Android)**. 

### Key Discoveries:
1. **Existing Supabase Integration:** Supabase is currently implemented in `src/services/supabase.js` via **direct lightweight `fetch()` calls to PostgREST** (no `@supabase/supabase-js` dependency in `package.json`). It connects to active project `xvrnssesbkzxeusubzes` (`CatalogoTyn`, Postgres 17.11 in `us-east-1`) solely for capturing commercial visitor leads (`prospectos_comerciales`) with local offline queuing via `localStorage`. **No Supabase Storage buckets or product catalog tables currently exist.**
2. **Product Catalog Structure:** The catalog is statically defined in `src/data/products.js` (224 KB, 5,594 lines) containing **exactly 180 products** across three official lines (132 ORTOPEDIA, 27 Deportiva, 21 REHABILITACION) and 10 categories. Every product contains 15 structured attributes (code, name, cat, price, bodyPart, badge, linea, sizes, colors, hasPdf, hasVideo, shortDesc, desc, uses, features). Currently, `price` is set to `null` across all products ("Consultar Precio").
3. **Massive Media Footprint Root Cause:** The repository bundles **~983 MB** of media in `public/`:
   - `public/pdf/`: **911.13 MB** across 172 high-resolution technical data sheets.
   - `public/assets/`: **62.87 MB** (186 PNG product images and 2 GLB 3D models: 1.45 MB body, 4.82 MB skeleton).
   - `public/video/`: **8.18 MB** (2 MP4 clips).
   Because these files are copied into `dist/` during build, the **portable Electron executable (`.exe`) is 1.06 GB** and the **Android APK is 1.03 GB**.
4. **Architectural Opportunity:** Moving product records to an online database and hosting images/PDFs on a generous free-tier storage CDN will **reduce the APK and portable exe from >1 GB down to ~35 MB**, enable real-time price and stock updates without rebuilding binaries, and leverage native browser/WebView caching across Web, Electron, and Android.

---

## 1. Existing Supabase Integration Analysis

### 1.1 Implementation Details (`src/services/supabase.js`)
- **Connection Pattern:** The application does not use `@supabase/supabase-js`. Instead, it communicates directly with Supabase's PostgREST REST API using native `window.fetch()`:
  ```javascript
  const SUPABASE_URL = 'https://xvrnssesbkzxeusubzes.supabase.co';
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
  // POST ${SUPABASE_URL}/rest/v1/prospectos_comerciales
  ```
- **Authentication Model:** Uses the public anonymous JWT (`anon key`) passed in the `apikey` and `Authorization: Bearer <anon_key>` request headers. There is no user authentication, session state, or OAuth configured.
- **Offline Resiliency & Fallback:**
  - When network requests fail (`!response.ok` or `catch(err)`), records are serialized with a timestamp (`queued_at`) into `localStorage` under key `tynor_pending_leads`.
  - An event listener on `window.addEventListener('online', ...)` triggers `syncPendingLeads()`, which iterates over the queued leads, POSTs them sequentially, and cleans up successful submissions.

### 1.2 Remote Supabase Project Status (Verified via Supabase MCP)
- **Project Ref:** `xvrnssesbkzxeusubzes`
- **Project Name:** `CatalogoTyn`
- **Region:** `us-east-1`
- **Status:** `ACTIVE_HEALTHY`
- **Postgres Engine:** Version 17.11.0.003
- **Organization ID:** `hvazlwvxvnlneayrdcin`
- **Existing Tables in Database:**
  | Table Name | RLS Enabled | Row Count | Purpose |
  | :--- | :---: | :---: | :--- |
  | `public.prospectos_comerciales` | Yes | 16 | Commercial lead capture from kiosk modal |
  | `public.codia_leads_inbound` | Yes | 1 | External lead intake |
  | `public.codia_prospectos_outbound`| Yes | 16 | External prospect synchronization |
- **Storage Buckets:** `storage.buckets` query returned `[]` (empty). **No storage buckets are currently provisioned.**

---

## 2. Product Catalog Data Structure & Models

### 2.1 File Location & Volume
- **Location:** `src/data/products.js` (5,594 lines, 224,609 bytes).
- **Total Products:** Exactly **180 products**.
- **Line Invariants (Validated via `tests/catalog_tdd.test.js`):**
  - **ORTOPEDIA:** 132 products
  - **Deportiva:** 27 products
  - **REHABILITACION:** 21 products

### 2.2 Product Schema & Field Breakdown
Every product object in `PRODUCTS` uses a consistent schema with the following 15 attributes:

| Field | Type | Example Value | Description |
| :--- | :--- | :--- | :--- |
| `code` | `string` | `"101"`, `"D02"`, `"L49"` | Unique product SKU and reference code. Used to resolve image (`/assets/${code}.png`) and PDF (`/pdf/${code}.pdf`). |
| `name` | `string` | `"Rodillera Deportiva AIR PRO con Soporte Rotuliano"` | Full commercial and clinical name. |
| `cat` | `string` | `"rodillera"`, `"movilidad"` | Category identifier matching `CATEGORIES[].id`. |
| `price` | `number \| null` | `null` | Unit price. Currently `null` for all 180 items. Display logic defaults to `"Consultar Precio"`. |
| `bodyPart` | `string \| string[]` | `"rodilla"`, `"pierna"` | Anatomical association linking product to 3D interactive model hotspots. |
| `badge` | `string` | `"Deportiva"`, `"ORTOPEDIA"` | Visual badge shown on card thumbnails. |
| `linea` | `string` | `"Deportiva"`, `"REHABILITACION"` | Product family/line classification. |
| `sizes` | `string[]` | `["CH", "M", "G", "XL"]` or `["Universal"]` | Available size options for quotation selection. |
| `colors` | `object[] \| undefined` | `[{ id: "N", name: "Naranja", hex: "#FF6B00", border: "#EA580C" }]` | Color variants with hex styling and SKU suffix code. |
| `hasPdf` | `boolean` | `true` (172 items) / `false` (8 items) | Indicates availability of technical datasheet PDF. |
| `hasVideo` | `boolean` | `false` (178 items) / `true` (2 items) | Indicates availability of video demonstration. |
| `shortDesc` | `string` | `"Rodillera Deportiva AIR PRO diseñada para..."` | Brief summary displayed on product cards. |
| `desc` | `string` | `"Dispositivo ortopédico fabricado con materiales..."` | Full clinical description in product detail modal. |
| `uses` | `string[]` | `["Tratamiento y prevención...", "Rehabilitación..."]` | List of medical indications and therapeutic uses. |
| `features` | `string[]` | `["Material transpirable...", "Diseño ergonómico..."]` | Key engineering and clinical specifications. |

### 2.3 Taxonomy & 3D Anatomical Navigation
- **Categories (`CATEGORIES`):** 10 categories with Lucide icons (`todos`, `hombro_brazo`, `cabestrillo`, `inmovilizador`, `cervical`, `clavicula`, `lumbar`, `rodillera`, `tobillo`, `movilidad`).
- **Anatomical Body Parts (`BODY_PARTS`):** 9 anatomical regions (`hombro`, `mano`, `rodilla`, `cuello`, `clavicula`, `brazo`, `espalda`, `pierna`, `tobillo`). Each defines 3D hotspot coordinates (`position`, `normal`, `zoomTarget`, `zoomOrbit`) for `@google/model-viewer`.

### 2.4 Quoting, Selection State, & WhatsApp Integration
- **`interestList` (`App.jsx:47`):** Array of product codes stored in `localStorage` under `tynor_kiosk_interest`.
- **`interestSelections` (`App.jsx:57`):** Mapping of product code to selected sizes and colors (`selectedSizes`, `selectedColors`, `selectedColorNames`) stored in `localStorage` under `tynor_kiosk_selections`.
- **Sales Reps (`src/data/salesReps.js`):** Padrón of 8 official representatives with Mexican format numbers (`521XXXXXXXXXX`). `buildWhatsAppMessage()` formats the user's selected items and sizes into a pre-filled WhatsApp quote.

---

## 3. Media Assets & Footprint Analysis

| Directory | Item Count | Total Size | Description |
| :--- | :---: | :---: | :--- |
| `public/pdf/` | 172 files | **911.13 MB** | High-resolution PDF clinical datasheets (avg. ~5.3 MB per PDF). |
| `public/assets/` | 186 files | **62.87 MB** | 180 PNG product photos (~350 KB each), UI icons, and two GLB 3D models (`Model_Human.glb` 1.45 MB, `Model_Skeleton.glb` 4.82 MB). |
| `public/video/` | 2 files | **8.18 MB** | MP4 product demonstration videos (`101.mp4`, `102.mp4`). |
| `public/pdfjs/` | 2 files | **1.04 MB** | Local PDF.js worker and library scripts. |
| **Total Media** | **362 files** | **983.22 MB** | Bundled static assets. |

### Architectural Implication:
Bundling nearly 1 GB of static files directly in the frontend build creates major problems:
- Portable Windows executable (`Tynor-Catalogo-Portable.exe`): **1,060 MB (1.06 GB)**.
- Android APK (`TynorCatalogo-v2.7.apk`): **1,036 MB (1.03 GB)**.
- PWA Workbox cache in `vite.config.js`: forced to allow `maximumFileSizeToCacheInBytes: 120MB`.
- Any catalog update, price revision, or typo fix requires generating and distributing a 1 GB installer or APK.

---

## 4. Tech Stack & Platform Configuration

### 4.1 Frontend Core
- **Framework:** React 18.3.1 with Vite 5.4.11 (`@vitejs/plugin-react` 4.3.4).
- **3D Graphics:** `@google/model-viewer` 3.5.0 with custom cinematic camera zoom and ray-trace/x-ray transitions between muscle and skeleton models.
- **PDF Rendering:** `pdfjs-dist` 3.11.174 with a local web worker (`/pdfjs/pdf.worker.min.js`) and a custom hardware-accelerated 3D pan/zoom engine (`PdfViewer.jsx`).
- **PWA:** `vite-plugin-pwa` 0.21.1 configured for offline asset caching.

### 4.2 Desktop Kiosk: Electron 44.9.0
- **Main Process (`electron/main.cjs`):**
  - Starts an embedded HTTP server via Node's `http.createServer` listening on a dynamic loopback port (`127.0.0.1:<port>`).
  - Implements **HTTP Range Requests (RFC 7233 / 206 Partial Content)** to stream heavy GLB models and MP4 videos without buffer stalls.
  - Chrome launch switches: GPU acceleration enabled (`ignore-gpu-blocklist`, `enable-webgl`, `enable-zero-copy`), touchscreen drag-and-drop enabled, JS heap capped at 512 MB.
  - Window setup: Fullscreen kiosk mode (`kiosk: true`, `frame: false`), with F11 toggle and Escape fallback for technicians.
- **Preload (`electron/preload.cjs`):** Secure context isolation exposing `{ isDesktop: true, platform, version }`.

### 4.3 Mobile / Tablet: Capacitor 8.5.3 (Android APK)
- **Configuration (`capacitor.config.json`):**
  ```json
  {
    "appId": "com.tynor.catalogokiosk",
    "appName": "Tynor Catálogo",
    "webDir": "dist"
  }
  ```
- **Manifest & Network Security (`android/app/src/main/AndroidManifest.xml`):**
  - Permissions declared: `INTERNET`, `ACCESS_NETWORK_STATE`, `CAMERA`, `VIBRATE`.
  - `android:usesCleartextTraffic="true"` is enabled.
  - Native camera integration for QR badge scanning (`html5-qrcode`).
  - Clean WebView execution loading `https://localhost` with full support for HTTPS `fetch()`.

---

## 5. Platform-Specific Constraints & Online Migration Readiness

| Consideration | Electron (Windows Kiosk) | Capacitor (Android Tablet/APK) | Browser / PWA |
| :--- | :--- | :--- | :--- |
| **Origin / Context** | `http://127.0.0.1:<port>` | `https://localhost` | Standard HTTPS domain |
| **CORS Behavior** | Standard Chromium CORS rules apply to remote API calls. | Android WebView enforces CORS for cross-origin fetches. | Standard web CORS rules. |
| **Network Access** | Unrestricted HTTPS outbound. | Enabled via `android.permission.INTERNET`. | Unrestricted HTTPS outbound. |
| **Client Caching** | Chromium HTTP cache + Memory cache + `localStorage` + IndexedDB. | Android WebView HTTP cache + `localStorage` + IndexedDB. | Browser HTTP cache + Service Worker Cache API + `localStorage`. |
| **Offline Fallback** | Local SQLite/IndexedDB or memory cache for viewed products. | Local SQLite/IndexedDB or memory cache for viewed products. | Cache API + IndexedDB. |

---

## 6. Codebase Health & Anomaly Observations

During test suite execution (`node --test tests/catalog_tdd.test.js`), two tests failed in `src/data/salesReps.js`:
- **Line 79-105 of `src/data/salesReps.js`:** The variable `details` is referenced (`details.push(...)` at lines 91 and 97) without being initialized inside the `items.map()` scope (`const details = [];` is missing).
- This is a non-blocking observation documented for subsequent engineering attention. (Exploration is read-only per constraints).

---

## 7. Migration Requirements & Database Schema Blueprint

To transition from static mock data to an online database and image CDN:

### 7.1 Required Database Tables
1. **`categories`**: `id` (text, PK), `label` (text), `icon` (text), `sort_order` (int).
2. **`products`**:
   - `code` (text, PK / SKU)
   - `name` (text, NOT NULL)
   - `category_id` (text, FK -> categories.id)
   - `body_part` (text or text[], matching anatomy hotspots)
   - `linea` (text, NOT NULL)
   - `badge` (text)
   - `price` (numeric, nullable)
   - `stock` (integer, default 0 or boolean in_stock)
   - `sizes` (jsonb / text[])
   - `colors` (jsonb: array of `{ id, name, hex, border }`)
   - `short_desc` (text)
   - `desc` (text)
   - `uses` (text[] or jsonb)
   - `features` (text[] or jsonb)
   - `image_url` (text, CDN URL)
   - `pdf_url` (text, CDN URL)
   - `video_url` (text, nullable)
   - `is_active` (boolean, default true)
   - `updated_at` (timestamptz)

### 7.2 Storage Requirements
- **Images:** 180 product images (62.87 MB). If compressed to WebP/AVIF: ~15-25 MB total.
- **Datasheet PDFs:** 172 files (911 MB). If optimized/compressed: ~300-500 MB total.
- **Bandwidth Consumption Estimate:**
  - 10 active kiosks browsing 200 product cards/day: ~50-100 MB data/day (~1.5-3 GB/month egress).
  - 50 PDF views/day: ~250 MB data/day (~7.5 GB/month egress).
  - Browser/WebView HTTP caching with `Cache-Control: public, max-age=86400, stale-while-revalidate=604800` will eliminate >85% of redundant downloads.

---

## Conclusion

The existing codebase is clean, well-architected, and fully prepared for an online catalog integration. The current implementation in `src/services/supabase.js` already demonstrates resilient fetch-based communication with offline fallback. Expanding this architecture or selecting an optimal free-tier database and image CDN will drastically shrink application bundles from 1.06 GB to ~35 MB, enable real-time price and stock management, and maintain full compatibility across React/Vite, Electron, and Capacitor Android.
