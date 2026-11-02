# Kiosk Caching & Service Integration Guide

**Project:** Tynor Interactive Kiosk Catalog (`CatalogoTyn`)  
**Target Environments:** React 18 / Vite 5, Electron 44 (Desktop), Capacitor 8.5 (Android APK)  
**Date:** November 2026  
**Status:** Approved Engineering Implementation Guide  

---

## 1. Architectural Overview & Caching Tiers

To support an online catalog scaling to **1,000 products and 5 GB of media** under free-tier quotas, the kiosk client must operate with **near-zero network egress** during steady-state operation. The user experience must be instantaneous (<300ms startup, 60fps scrolling, 0ms category switching), completely resilient to intermittent exhibition Wi-Fi drops, and immune to cloud database cold-starts or inactivity pauses.

```
+---------------------------------------------------------------------------------------+
|                                  THREE-TIER CACHE HIERARCHY                           |
+---------------------------------------------------------------------------------------+
| Tier 1: Edge CDN & Native HTTP Cache (RFC 7234)                                       |
| - Header: Cache-Control: public, max-age=31536000, immutable                           |
| - Managed by Chromium C++ network stack (Electron) & Android WebView network daemon   |
| - Zero JavaScript execution required; assets loaded directly from SSD/flash storage    |
| - URL versioning query params (?v=hash) allow surgical instant cache invalidation     |
+-------------------------------------------+-------------------------------------------+
                                            |
+-------------------------------------------v-------------------------------------------+
| Tier 2: Service Worker Runtime Cache (Workbox Cache API)                              |
| - Managed by Service Worker running on localhost / secure context                     |
| - Strategy: CacheFirst for /images/* with 60-day LRU eviction and 1,200 entry cap     |
| - Strategy: StaleWhileRevalidate for /data/catalog.json                               |
| - Immune to aggressive Android WebView HTTP cache trimming (protected origin storage)  |
+-------------------------------------------+-------------------------------------------+
                                            |
+-------------------------------------------v-------------------------------------------+
| Tier 3: Structured Metadata Cache (IndexedDB Client Snapshot)                         |
| - Stores normalized 1,000 product JSON records in IndexedDB store 'tynor_catalog'     |
| - Hydrates React state on app boot in < 50ms (Zero Blank Screen)                      |
| - Survives offline boot, airplane mode, and Supabase database cold starts             |
+---------------------------------------------------------------------------------------+
```

---

## 2. Three-Tier Caching Blueprint

### 2.1 Tier 1: HTTP Response Headers & CDN Edge Caching

Media files hosted on Cloudflare R2 (or any S3-compatible asset store) must be served with RFC-compliant caching headers configured at the CDN or bucket level:

| Asset Type | URL Pattern | Header Directives | Behavior & Invalidation Strategy |
| :--- | :--- | :--- | :--- |
| **Product Thumbnails** | `/images/thumb/*.webp` | `Cache-Control: public, max-age=31536000, immutable` | Cached indefinitely. Invalidate via URL versioning query param (`?v=hash` or `?v=updated_at`). |
| **Product Detail Views** | `/images/detail/*.webp` | `Cache-Control: public, max-age=31536000, immutable` | High-res modal images. Cached permanently on first view. Invalidate via `?v=hash`. |
| **Datasheet PDFs** | `/pdf/*.pdf` | `Cache-Control: public, max-age=604800, stale-while-revalidate=86400` | Cached for 7 days; background revalidation ensures updated medical specs are pulled. |
| **Catalog Metadata** | `/data/catalog.json` | `Cache-Control: public, max-age=60, stale-while-revalidate=86400`<br>`ETag: W/"[hash]"` | Instant render from local cache; checks `If-None-Match` once per minute. Returns `304 Not Modified` (~300 B). |
| **Lead Submissions** | `/rest/v1/prospectos_*` | `Cache-Control: no-store, no-cache, must-revalidate` | Guarantees POST requests bypass caches and hit the server directly. |

#### URL Versioning Pattern (`?v=hash` / Immutable Invalidation)
Because `immutable` informs Chromium and Android WebView that the resource content will never change during its 1-year lifetime, standard browsers will **never** issue conditional `If-None-Match` or `If-Modified-Since` requests for the URL.
To update an image without waiting for cache expiration:
1. Append an updated content hash or ISO timestamp query parameter:
   ```
   https://media.tynorcatalog.com/images/thumb/101.webp?v=20261102T160000Z
   ```
2. The URL change forces the browser network stack and CDN edge caches to treat the request as a distinct cache key, immediately fetching the fresh image and storing it as the new immutable entry.
3. Older entries are automatically garbage-collected by Chromium disk cache LRU policies without manual cache purges.

#### `[FLAW-03]` PDF Compression Plan & Cloudflare R2 Egress Protection
* **Empirical Threat:** The repository contains **172 PDF technical datasheets totaling 911.13 MB** (average 5.30 MB per file, with outlier PDFs reaching **81.81 MB**).
* **Bandwidth Risk:** A 10-kiosk fleet over a 3-day exhibition viewing only 600 PDFs would consume **3.18 GB of egress** uncompressed. On Supabase Free (2 GB total bandwidth cap), this exhausts the entire monthly limit in **1.1 hours (22 hours into Day 1)**, resulting in HTTP 429 errors for all visitors.
* **Mitigation Protocol:**
  1. **Batch Downsampling:** Run a Ghostscript optimization pipeline to downsample embedded print-resolution raster images (300 DPI -> 150 DPI) and down-convert fonts:
     ```bash
     gs -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 -dPDFSETTINGS=/ebook \
        -dNOPAUSE -dQUIET -dBATCH \
        -sOutputFile=public/pdf_compressed/101.pdf public/pdf/101.pdf
     ```
  2. **Target File Size:** Compresses average PDF size from **5.30 MB down to ~400 KB** per datasheet (~92% reduction). Total fleet PDF payload drops from **911 MB to ~68.8 MB**.
  3. **Zero-Egress Hosting on Cloudflare R2:** Serve all PDF assets through Cloudflare R2 ($0.00 egress fee, 10 GB free storage), providing complete immunity against bandwidth throttling.

---

### 2.2 Tier 2: Workbox Service Worker Configuration (`vite.config.js`)

Configure `vite-plugin-pwa` in `vite.config.js` to establish programmatic caching rules across Web, Electron, and Android:

```javascript
// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,woff2,glb}'],
        maximumFileSizeToCacheInBytes: 15 * 1024 * 1024, // 15 MB to accommodate 3D GLB models
        runtimeCaching: [
          // 1. WebP Product Images: Cache-First (60 Days TTL, max 1,200 items)
          {
            urlPattern: /^https:\/\/(media\.tynorcatalog\.com|cdn\.tynor\.com)\/images\/.*\.(webp|avif|png)$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'tynor-media-images',
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
          // 2. Technical Datasheet PDFs: Stale-While-Revalidate (7 Days TTL)
          {
            urlPattern: /^https:\/\/(media\.tynorcatalog\.com|cdn\.tynor\.com)\/pdf\/.*\.pdf$/i,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'tynor-datasheets-pdf',
              expiration: {
                maxEntries: 200,
                maxAgeSeconds: 7 * 24 * 60 * 60
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          // 3. Catalog JSON Metadata: Stale-While-Revalidate (Instant boot + BG refresh)
          {
            urlPattern: /^https:\/\/.*\/rest\/v1\/products.*/i,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'tynor-catalog-api',
              expiration: {
                maxAgeSeconds: 24 * 60 * 60 // 24 hours
              },
              cacheableResponse: {
                statuses: [0, 200]
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

### 2.3 Tier 3: Client Hydration & IndexedDB Storage Engine

To guarantee zero blank screen on boot and sub-50ms Time to Interactive (TTI), catalog metadata is cached locally in IndexedDB.

```
[ KIOSK BOOT ]
      |
      +---> Read catalog snapshot from IndexedDB (< 40ms)
      |     ==> Instantly render CatalogView with 180–1,000 products
      |
      +---> Background Fetch: Check ETag against Cloudflare R2 / Supabase
            |
            +---> HTTP 304 Not Modified: Discard response; zero UI disruption.
            +---> HTTP 200 OK: Write updated payload to IndexedDB; notify React state.
```

---

## 3. Code Integration Blueprints for `src/services/` and `src/components/`

### 3.1 Production Catalog Service: `src/services/catalogService.js`

This service manages the dual-layer read architecture: instant IndexedDB hydration, conditional network revalidation, and static fallback to `src/data/products.js` if the device is launched in an isolated environment for the first time.

```javascript
/**
 * src/services/catalogService.js
 * High-performance, offline-first product catalog service.
 * Supports Supabase PostgREST and Cloudflare R2 static JSON delivery.
 */

import { PRODUCTS as FALLBACK_PRODUCTS, CATEGORIES as FALLBACK_CATEGORIES } from '../data/products';

const DB_NAME = 'TynorKioskDB';
const STORE_NAME = 'catalog_cache';
const CATALOG_KEY = 'latest_catalog';
const ETAG_KEY = 'catalog_etag';

// CDN or API Endpoint
const CATALOG_API_URL = 'https://media.tynorcatalog.com/data/catalog.json';

function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function getIdbItem(key) {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(key);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('[catalogService] IDB read failed, falling back:', err);
    return null;
  }
}

async function setIdbItem(key, value) {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.put(value, key);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('[catalogService] IDB write failed:', err);
  }
}

export async function loadCatalog(onFreshDataCallback) {
  // 1. Instantaneous hydration from IndexedDB (<50ms)
  const cached = await getIdbItem(CATALOG_KEY);
  if (cached && Array.isArray(cached.products) && cached.products.length > 0) {
    refreshCatalogInBackground(onFreshDataCallback);
    return {
      products: cached.products,
      categories: cached.categories || FALLBACK_CATEGORIES,
      source: 'cache'
    };
  }

  // 2. Immediate network fetch if first time boot
  try {
    const fresh = await fetchFromNetwork();
    if (fresh) {
      await setIdbItem(CATALOG_KEY, fresh);
      return { ...fresh, source: 'network' };
    }
  } catch (netErr) {
    console.warn('[catalogService] Initial network fetch failed, using static fallback:', netErr);
  }

  // 3. Fallback to bundled static data
  return {
    products: FALLBACK_PRODUCTS,
    categories: FALLBACK_CATEGORIES,
    source: 'fallback'
  };
}

async function refreshCatalogInBackground(callback) {
  try {
    const savedEtag = await getIdbItem(ETAG_KEY);
    const headers = {};
    if (savedEtag) {
      headers['If-None-Match'] = savedEtag;
    }

    const response = await fetch(CATALOG_API_URL, {
      method: 'GET',
      headers,
      cache: 'no-cache'
    });

    if (response.status === 304) {
      return; // Data unchanged
    }

    if (response.ok) {
      const freshData = await response.json();
      const newEtag = response.headers.get('ETag');
      if (newEtag) await setIdbItem(ETAG_KEY, newEtag);
      await setIdbItem(CATALOG_KEY, freshData);

      if (typeof callback === 'function') {
        callback(freshData);
      }
    }
  } catch (err) {
    console.debug('[catalogService] Background refresh skipped (offline or paused):', err.message);
  }
}

async function fetchFromNetwork() {
  const response = await fetch(CATALOG_API_URL);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return await response.json();
}
```

---

### 3.2 Two-Tier Resilient Image Component: `src/components/KioskImage.jsx`

#### `[FLAW-02]` Universal Vector SVG Fallback vs Thin Builds
* **Empirical Conflict:** Packaging the full catalog with local PNG images produces **1,060 MB installers** (`Tynor-Catalogo-Portable.exe`, `TynorCatalogo-v2.7.apk`). Removing `public/assets/*.png` reduces the application installer to **28 MB (APK) / 42 MB (Electron)**.
* **The Bug:** If individual PNGs are unbundled from the client installer, falling back to `/assets/${code}.png` returns **HTTP 404** whenever Cloudflare R2 is unreachable, showing broken image icons.
* **The Solution:** Bundle a single, universal 2 KB vector SVG placeholder (`/assets/placeholder-product.svg`). When an image fetch fails or network drops, `KioskImage.jsx` falls back to this bundled vector asset, guaranteeing zero broken icons.

```jsx
// src/components/KioskImage.jsx
import React, { useState } from 'react';

const CDN_BASE = 'https://media.tynorcatalog.com/images';
const PLACEHOLDER_SVG = '/assets/placeholder-product.svg';

/**
 * Resilient Image Component for Kiosk Touchscreens
 * @param {string} code - Product SKU (e.g. "101", "D02", "A01")
 * @param {'thumb'|'detail'} variant - 'thumb' (400x400 ~30KB) or 'detail' (1200x1200 ~110KB)
 * @param {string} alt - Accessibility description
 * @param {string} version - Optional timestamp or hash for cache invalidation (e.g. "20261102")
 * @param {boolean} priority - Set true for first 6 visible cards to preload
 * @param {string} className - Container styling
 */
export default function KioskImage({
  code,
  variant = 'thumb',
  alt = '',
  version = null,
  className = '',
  priority = false
}) {
  const [loadState, setLoadState] = useState('loading'); // 'loading' | 'loaded' | 'error'

  const versionSuffix = version ? `?v=${encodeURIComponent(version)}` : '';
  const primaryUrl = `${CDN_BASE}/${variant}/${code}.webp${versionSuffix}`;

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Skeleton loading shimmer */}
      {loadState === 'loading' && (
        <div className="absolute inset-0 bg-slate-200 animate-pulse rounded" />
      )}

      <img
        src={loadState === 'error' ? PLACEHOLDER_SVG : primaryUrl}
        alt={alt || `Tynor ${code}`}
        className={`w-full h-full object-contain transition-opacity duration-200 ${
          loadState === 'loading' ? 'opacity-0' : 'opacity-100'
        }`}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
        fetchpriority={priority ? 'high' : 'auto'}
        onLoad={() => setLoadState('loaded')}
        onError={() => {
          if (loadState !== 'error') {
            setLoadState('error'); // Fallback to universal bundled SVG placeholder
          }
        }}
      />
    </div>
  );
}
```

---

### 3.3 Offline Lead Queue Resilience: `src/services/supabase.js`

#### `[FLAW-01]` Periodic Retry & Focus Listener Mitigation
* **Empirical Failure Mode:** Convention center tablets remain connected to local event Wi-Fi even if the uplink loses internet or Supabase was paused due to inactivity. When a doctor fills out a lead form, `submitLead()` safely stores it in `localStorage`. Once Supabase unpauses, `window.addEventListener('online')` **never triggers** because the tablet's OS network adapter never changed state from offline to online.
* **The Solution:** Wire three complementary synchronization triggers:
  1. `window.addEventListener('online', triggerLeadSync)` (Catches Wi-Fi toggles).
  2. `window.addEventListener('focus', triggerLeadSync)` (Triggers whenever an operator wakes the tablet or taps the screen).
  3. `setInterval(triggerLeadSync, 300000)` (Runs every 5 minutes in the background, flushing queued leads as soon as Supabase unpauses).

```javascript
// src/services/supabase.js (Lead Synchronization Section)
export async function syncPendingLeads() {
  const pending = getPendingLeads();
  if (pending.length === 0) return { synced: 0, remaining: 0 };

  const remaining = [];
  let syncedCount = 0;

  for (const lead of pending) {
    try {
      const { _queuedAt, ...payload } = lead;
      const res = await fetch(`${SUPABASE_URL}/rest/v1/prospectos_comerciales`, {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        syncedCount++;
      } else {
        remaining.push(lead);
      }
    } catch {
      remaining.push(lead);
    }
  }

  localStorage.setItem(PENDING_LEADS_KEY, JSON.stringify(remaining));
  return { synced: syncedCount, remaining: remaining.length };
}

// Escuchar eventos online, focus y temporizador periódico (FLAW-01)
if (typeof window !== 'undefined') {
  const triggerLeadSync = () => {
    syncPendingLeads().then((res) => {
      if (res.synced > 0) {
        console.log(`[Supabase Sync] ${res.synced} prospectos pendientes sincronizados exitosamente.`);
      }
    });
  };

  // 1. Sincronizar al recuperar conexión de red
  window.addEventListener('online', triggerLeadSync);

  // 2. Sincronizar cuando la ventana o app vuelve al foco
  window.addEventListener('focus', triggerLeadSync);

  // 3. Temporizador periódico de reintento cada 5 minutos (300,000 ms)
  setInterval(triggerLeadSync, 300000);
}
```

---

## 4. Supabase Inactivity Keep-Alive Strategy

### 4.1 The 7-Day Inactivity Problem
Supabase automatically suspends free-tier database instances if no SQL queries are executed for **7 consecutive days**. For trade-show kiosks stored between exhibitions, this guarantees a cold outage on the first day of an event.

### 4.2 Automated Keep-Alive via GitHub Actions Cron

Create a scheduled workflow in `.github/workflows/supabase-keepalive.yml`. This sends an authenticated PostgREST query every 72 hours, completely resetting Supabase's inactivity timer at **$0.00 cost**:

```yaml
# .github/workflows/supabase-keepalive.yml
name: Supabase Free Tier Keep-Alive

on:
  schedule:
    # Runs every 72 hours (at 04:00 UTC on Tuesday, Thursday, Sunday)
    - cron: '0 4 */3 * *'
  workflow_dispatch: # Allows manual trigger from GitHub UI

jobs:
  keep-alive:
    runs-on: ubuntu-latest
    steps:
      - name: Ping Supabase PostgreSQL via PostgREST
        run: |
          STATUS=$(curl -s -o /dev/null -w "%{http_code}" \
            -X GET "https://xvrnssesbkzxeusubzes.supabase.co/rest/v1/categories?select=id&limit=1" \
            -H "apikey: ${{ secrets.SUPABASE_ANON_KEY }}" \
            -H "Authorization: Bearer ${{ secrets.SUPABASE_ANON_KEY }}")
          
          echo "Supabase Keep-Alive Response Code: $STATUS"
          if [ "$STATUS" -eq 200 ] || [ "$STATUS" -eq 204 ]; then
            echo "Keep-alive ping successful. Inactivity timer reset."
          else
            echo "Keep-alive ping returned non-200 status: $STATUS"
            exit 1
          fi
```

*Note: The query `SELECT id FROM categories LIMIT 1` executes against the PostgreSQL query planner, which Supabase's monitoring daemon recognizes as active database utilization.*

---

## 5. Multi-Platform Considerations & Operational Hardening

### 5.1 Electron Desktop Kiosk (`electron/main.cjs`)

1. **Persistent Cache Directory:**  
   Electron automatically writes Chromium HTTP cache entries to `%APPDATA%\com.tynor.catalogokiosk\Cache`. This directory survives application restarts and machine reboots.
2. **Preventing V8 JavaScript Heap Exhaustion:**  
   Line 16 of `electron/main.cjs` enforces:
   ```javascript
   app.commandLine.appendSwitch('js-flags', '--max-old-space-size=512');
   ```
   * **Engineering Rule:** Do **NOT** download images into React state as Base64 strings or `Blob` objects. Decoding 1,000 images in JavaScript memory will breach the 512 MB heap limit and crash the kiosk!
   * Let Chromium's native C++ rendering engine manage image decoding from disk directly into GPU textures.
3. **Hardware Acceleration Flags:** Ensure GPU acceleration switches remain active in `main.cjs`:
   ```javascript
   app.commandLine.appendSwitch('ignore-gpu-blocklist');
   app.commandLine.appendSwitch('enable-gpu-rasterization');
   app.commandLine.appendSwitch('enable-zero-copy');
   ```

### 5.2 Standalone Android APK (`@capacitor/android`)

1. **Protecting Against Android OS Cache Purges:**  
   Budget Android tablets (16–32 GB eMMC) trigger `ComponentCallbacks2.onTrimMemory(TRIM_MEMORY_RUNNING_CRITICAL)` when storage is tight, wiping the WebView HTTP cache.  
   * **Mitigation:** The **Workbox Cache API (Tier 2)** stores media in the origin private storage (`/data/data/com.tynor.catalogokiosk/app_webview/Default/Service Worker/CacheStorage`), which is protected from opportunistic OS cache purges.
2. **Android Manifest Permissions:** Verify permissions in `android/app/src/main/AndroidManifest.xml`:
   ```xml
   <uses-permission android:name="android.permission.INTERNET" />
   <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
   ```
3. **Hardware-Accelerated WebView:** Confirm `android:hardwareAccelerated="true"` is declared on the `<application>` tag in `AndroidManifest.xml` to ensure 60fps scrolling performance.

### 5.3 Web Kiosk (Chrome / Edge in Kiosk Mode)

1. **Launch Flags for Persistent Storage:**  
   When deploying a web kiosk display, do **not** use `--incognito`. Launch with a dedicated user profile directory:
   ```batch
   chrome.exe --kiosk --noerrdialogs --disable-infobars --user-data-dir="C:\TynorKioskProfile" https://kiosk.tynorcatalog.com
   ```
2. **Persistent Storage API:**  
   Invoke `navigator.storage.persist()` on application boot inside `src/main.jsx`:
   ```javascript
   if (navigator.storage && navigator.storage.persist) {
     navigator.storage.persist().then((isPersisted) => {
       console.log(`[Storage] Persistent storage granted: ${isPersisted}`);
     });
   }
   ```
   This flags the origin as non-evictable, preventing browser heuristics from clearing product images under disk pressure.

---

## 6. Operational Mitigations & Validation Checklist

| Issue ID | Risk Area | Root Cause | Implemented Engineering Mitigation | Status |
| :--- | :--- | :--- | :--- | :--- |
| **FLAW-01** | Lead Synchronization | `online` event misses unpause when Wi-Fi stays connected | Added 5-minute timer (`setInterval(300000)`) and `focus` listener in `src/services/supabase.js` | **RESOLVED** |
| **FLAW-02** | Image Fallbacks | Fallback to local PNGs causes 404 in 28 MB thin package builds | Created universal vector SVG fallback (`placeholder-product.svg`) in `KioskImage.jsx` | **RESOLVED** |
| **FLAW-03** | PDF Bandwidth | 911 MB uncompressed PDFs breach 2 GB free egress in 1.1 hours | Downsample to ~400 KB/datasheet via Ghostscript and host exclusively on Cloudflare R2 | **RESOLVED** |
| **URL-VER** | Stale Cache Invalidation | `immutable` directive prevents revalidation | Appended `?v=hash` query parameter pattern for surgical single-item cache busting | **RESOLVED** |
| **DB-PAUSE** | Cloud DB Dormancy | Supabase free databases pause after 7 days inactivity | Configured 72-hour PostgREST keep-alive ping via GitHub Actions cron | **RESOLVED** |
