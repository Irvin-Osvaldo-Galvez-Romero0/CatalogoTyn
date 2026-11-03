# Handoff Report: Infra Security, Headers, Dependencies & Asset Integrity

> **Agent:** `explorer_sec_infra_hygiene`  
> **Working Directory:** `c:\Users\User\Documents\GitHub\CatalogoTyn\.agents\teamwork\explorer_sec_infra_hygiene`  
> **Timestamp:** 2026-11-03T20:53:00Z  
> **Milestone:** Comprehensive AppSec & Hygiene Investigation

---

## 1. Observation

### 1.1 Root Deployment & Vercel Configuration
- **File Presence:** `vercel.json` does NOT exist in the repository root (`c:\Users\User\Documents\GitHub\CatalogoTyn\vercel.json` returned file not found).
- **Vercel Project Link:** `.vercel/project.json` exists with content:
  ```json
  {"projectId":"prj_Fgyn2Wv124jBIxA0Ch89yBlaMRv4","orgId":"team_i8EGpalG83dnaqz8eH9qbv8X","projectName":"catalogotyn"}
  ```
- **External Network Assets & Endpoints Identified Across Codebase:**
  - `src/services/supabase.js:6`:
    ```javascript
    const SUPABASE_URL = 'https://xvrnssesbkzxeusubzes.supabase.co';
    ```
  - `src/components/KioskImage.jsx:4`:
    ```javascript
    const CDN_BASE = 'https://media.tynorcatalog.com/images';
    ```
  - `src/components/QrExportModal.jsx:8`:
    ```javascript
    const VERCEL_PUBLIC_DOMAIN = 'https://catalogotyn.vercel.app';
    ```
  - `index.html:18-23`:
    ```html
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
    ```
  - `src/components/QrScannerModal.jsx:2, 33-35`:
    ```javascript
    import { Html5Qrcode } from 'html5-qrcode';
    ...
    html5QrCode.start({ facingMode: 'environment' }, config, ...)
    ```
  - `src/components/PdfViewer.jsx:2, 7`:
    ```javascript
    import * as pdfjsLib from 'pdfjs-dist';
    pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdfjs/pdf.worker.min.js';
    ```
  - `vite.config.js:8-36`: Uses `VitePWA` generating service workers (`sw.js`, `workbox-*.js`).
  - `npm run build` output:
    ```
    node_modules/pdfjs-dist/build/pdf.js (1982:23): Use of eval in "node_modules/pdfjs-dist/build/pdf.js" is strongly discouraged as it poses security risks and may cause issues with minification.
    ✓ built in 25.11s
    PWA v0.21.2: dist/sw.js, dist/workbox-9c191d2f.js generated.
    ```

### 1.2 Legacy File `src/data/products.js.bak`
- **File Metadata:**
  - Path: `src/data/products.js.bak`
  - Size: 206,383 bytes (4,452 lines)
  - LastWriteTime: `22/10/2026 10:05:35 a. m.`
- **Active Counterpart:**
  - Path: `src/data/products.js`
  - Size: 242,430 bytes
  - LastWriteTime: `02/11/2026 01:40:04 p. m.`
- **Grep Search:**
  - Search query `products.js.bak`: **0 occurrences** across entire repository.
  - Active imports in `src/components/admin/AdminDashboardModal.jsx`, `src/components/CatalogView.jsx`, `src/components/AnatomyView.jsx`, `src/components/AttractMode.jsx`, and `src/services/productManager.js` all resolve to `../data/products` (`products.js`).

### 1.3 Dependency Vulnerability Audit (`npm audit`)
- **Initial Audit Summary:**
  - Total: 31 vulnerabilities (3 low, 22 moderate, 5 high, 1 critical).
  - Critical: `tar <=7.5.20` (GHSA-34x7-hfp2-rc4v) under `@mapbox/node-pre-gyp` -> `canvas` -> `pdfjs-dist`.
  - High: `electron 44.0.0-alpha.1 - 44.9.0` (Mitigation for compromised eMudhra intermediate certificates, GHSA-jr5w-w6x2-84p9).
  - Moderate: `serialize-javascript <7.1.3` (GHSA-m5mm-p8h7-m29v), `fast-uri 3.0.0 - 3.1.8` (GHSA-w74x-v6f9-j3xg), `uuid <11.1.1` in `xcode` / `@capacitor/cli`, `esbuild <=0.24.2` in `vite <=6.4.3`.
- **Dry-run (`npm audit fix --dry-run`):**
  - Safely modifies 26 packages without breaking changes:
    - Upgrades `electron`: `44.9.0 => 44.10.2` (remediates high-severity eMudhra advisory).
    - Upgrades `serialize-javascript`: `7.1.2 => 7.1.4` (remediates XSS).
    - Upgrades `fast-uri`: `3.1.8 => 3.1.9` (remediates URI spoofing).
    - Upgrades `@capacitor/cli`: `8.5.3 => 8.6.0`, `xcode`: `3.0.1 => 4.0.0`.
    - Upgrades `electron-builder`: `26.15.3 => 26.18.1`.
- **Forced Fix Assessment (`npm audit fix --force`):**
  - Would force breaking upgrades: `vite` to `8.3.5` (current: 5.4.11), `pdfjs-dist` to `6.5.438` (current: 3.11.174), and downgrade `electron-builder` to `20.23.1`.
- **Baseline Build Verification:**
  - Command: `npm run build`
  - Result: Exit code 0, 2099 modules transformed, complete PWA bundle in `dist/`.

### 1.4 Documentation Asset Integrity (`docs/TynorManuales.*`)
- Exact filesystem and cryptographic state:
  - **`docs/TynorManuales.docx`:**
    - Size: 6,378,250 bytes (~6.08 MB)
    - LastWriteTime: `03/11/2026 01:04:02 p. m.`
    - SHA-256: `F08D714719810F749392E5DFCA06ACE02A7C38B20C3D87ACA63B3017BD5C85C5`
  - **`docs/TynorManuales.pdf`:**
    - Size: 1,737,644 bytes (~1.66 MB)
    - LastWriteTime: `03/11/2026 01:04:24 p. m.`
    - SHA-256: `48608DFD343A7671D3040CD9DD82298EDF21B2DB3748FE867F96C7E52863BE29`
- Origin: Generated by `scripts/build_tynor_manual_docx.py`. Not imported by runtime frontend code.

---

## 2. Logic Chain

1. **Permissions-Policy Correction:**
   - *Observation:* `plan_seguridad_integral_ecc.md` suggested `camera=()`.
   - *Observation:* `src/components/QrScannerModal.jsx` imports `html5-qrcode` and invokes `html5QrCode.start({ facingMode: 'environment' })` to scan QR badges and medical prescriptions.
   - *Inference:* Setting `camera=()` would trigger a browser permission policy violation, preventing the QR scanner from opening the camera.
   - *Conclusion:* The policy MUST be `camera=(self)` to permit the application's first-party origin while blocking all third-party frames, alongside `microphone=(), geolocation=()`.

2. **CSP Tuning for Real Runtime Components:**
   - *Observation:* `node_modules/pdfjs-dist/build/pdf.js` uses `eval` internally for PDF stream decompilation; `PdfViewer.jsx` uses Web Worker `/pdfjs/pdf.worker.min.js`.
   - *Observation:* `vite-plugin-pwa` generates Service Workers (`dist/sw.js`).
   - *Observation:* `KioskImage.jsx` fetches images from `https://media.tynorcatalog.com/images`.
   - *Observation:* `index.html` loads Google Fonts from `fonts.googleapis.com` and `fonts.gstatic.com`.
   - *Inference:* A rigid CSP without `worker-src 'self' blob:`, `'unsafe-eval'` in `script-src`, or `https://media.tynorcatalog.com` in `img-src` / `connect-src` will break PDF rendering, image delivery, and offline caching.
   - *Conclusion:* CSP must explicitly include all verified origin directives.

3. **Safe Deletion of `products.js.bak`:**
   - *Observation:* `products.js.bak` has timestamp Oct 22, 2026 (older than `products.js` dated Nov 2, 2026) and 0 references in the codebase.
   - *Inference:* It is an unversioned manual backup lingering in source control.
   - *Conclusion:* Deleting `src/data/products.js.bak` removes 206 KB of dead code without any functional impact.

4. **Dependency Hardening Boundary:**
   - *Observation:* `npm audit fix` without `--force` remediates 5 advisories (including high-severity Electron intermediate cert flaw) without changing major semver.
   - *Observation:* `npm audit fix --force` would bump Vite from 5 to 8 and pdfjs-dist from 3 to 6, which are breaking changes for Vite plugins and the PDF canvas viewer.
   - *Observation:* The critical `tar` issue resides in an optional dev dependency of `canvas` inside `pdfjs-dist`, which is never bundled in browser runtime.
   - *Conclusion:* Execute only safe `npm audit fix`. DO NOT run `npm audit fix --force`.

5. **Document Asset Protection:**
   - *Observation:* User request explicitly demanded preserving `docs/TynorManuales.docx` and `docs/TynorManuales.pdf`.
   - *Conclusion:* Documented exact SHA-256 hashes as a cryptographic baseline to verify they remain unaltered after implementation.

---

## 3. Caveats

- **External CDN Availability:** If `media.tynorcatalog.com` is unreachable during offline kiosk mode, `KioskImage.jsx` correctly falls back to `/assets/placeholder-product.svg`. CSP allowing `media.tynorcatalog.com` does not cause failures if the domain is offline.
- **Node-canvas on Serverless:** `tar` vulnerability is non-exploitable in the Vercel serverless environment because `api/send-email.js` only imports `nodemailer`, not `pdfjs-dist` or `canvas`.
- **Electron Production Packaging:** Upgrading Electron from `44.9.0` to `44.10.2` via `npm audit fix` is a patch bump and keeps Electron builder configs fully compatible.

---

## 4. Conclusion & Proposed Deliverables

### 4.1 Proposed `vercel.json` Specification
Create `c:\Users\User\Documents\GitHub\CatalogoTyn\vercel.json` with the following configuration:

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "cleanUrls": true,
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" },
        { "key": "Permissions-Policy", "value": "camera=(self), microphone=(), geolocation=()" },
        { "key": "Strict-Transport-Security", "value": "max-age=63072000; includeSubDomains; preload" },
        {
          "key": "Content-Security-Policy",
          "value": "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://unpkg.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: blob: https: https://media.tynorcatalog.com; media-src 'self' blob: data: https:; connect-src 'self' https://xvrnssesbkzxeusubzes.supabase.co wss://xvrnssesbkzxeusubzes.supabase.co https://catalogotyn.vercel.app https://media.tynorcatalog.com; worker-src 'self' blob:; child-src 'self' blob:; object-src 'none'; base-uri 'self'; frame-ancestors 'none';"
        }
      ]
    }
  ]
}
```

### 4.2 Cleanup Action
- Run `rm src/data/products.js.bak` (or PowerShell `Remove-Item 'src/data/products.js.bak'`).

### 4.3 Dependency Remediation Action
- Run `npm audit fix` (strict prohibition on `--force`).

### 4.4 Asset Preservation Target
- Ensure `docs/TynorManuales.docx` (SHA-256: `F08D714719810F749392E5DFCA06ACE02A7C38B20C3D87ACA63B3017BD5C85C5`) and `docs/TynorManuales.pdf` (SHA-256: `48608DFD343A7671D3040CD9DD82298EDF21B2DB3748FE867F96C7E52863BE29`) remain untouched.

---

## 5. Verification Method

To independently verify the implementation:

1. **Verify `vercel.json` syntax & schema:**
   ```bash
   node -e "JSON.parse(require('fs').readFileSync('vercel.json', 'utf8')); console.log('vercel.json valid')"
   ```
2. **Verify removal of backup file:**
   ```bash
   powershell -Command "Test-Path 'src/data/products.js.bak'"
   # Must output: False
   ```
3. **Verify document preservation against baseline hashes:**
   ```bash
   powershell -Command "Get-FileHash 'docs/TynorManuales.docx', 'docs/TynorManuales.pdf' -Algorithm SHA256"
   # Hashes must match F08D714719810F74... and 48608DFD343A7671...
   ```
4. **Verify production compilation:**
   ```bash
   npm run build
   # Must complete with exit code 0
   ```
