# BRIEFING — 2026-11-02T15:56:00Z

## Mission
Investigate and design kiosk client caching, networking, and latency optimization for online-only kiosk operation across React/Vite, Electron, and Capacitor (Android APK), including bandwidth/quota modeling and resilience strategies.

## 🔒 My Identity
- Archetype: explorer
- Roles: Kiosk Client Architecture & Caching Explorer
- Working directory: c:\Users\User\Documents\GitHub\CatalogoTyn\.agents\teamwork\explorer_caching
- Original parent: 8013adfb-364d-4208-a097-112f6d91567e
- Milestone: Kiosk Client Architecture & Caching Investigation

## 🔒 Key Constraints
- Read-only investigation — do NOT implement / do NOT modify source code
- Multi-target coverage: React + Vite (Web), Electron (Desktop kiosk PC), Capacitor (Android tablet APK)
- Bandwidth and quota consumption model for 100-1,000 products & up to 5 GB images
- Concrete evaluations of free-tier egress quotas (Supabase, Firebase, Cloudflare R2)
- Self-contained handoff and comprehensive report in working directory

## Current Parent
- Conversation ID: 8013adfb-364d-4208-a097-112f6d91567e
- Updated: 2026-11-02T16:03:00Z

## Investigation State
- **Explored paths**: `public/assets/`, `electron/main.cjs`, `capacitor.config.json`, `vite.config.js`, `src/services/supabase.js`, `src/components/CatalogView.jsx`, `src/components/ProductDetailModal.jsx`, `src/components/AttractMode.jsx`, `tests/catalog_tdd.test.js`.
- **Key findings**:
  - Image assets currently unoptimized PNGs up to 3.08 MB (`401.png`); both grid cards and detail modals load the identical asset.
  - High-intensity tradeshow kiosk (EXPOMEDICAL) burns ~38 GB/day without caching, violating Supabase's monthly 2 GB egress limit in under 2 hours.
  - Two-tier WebP pipeline (400x400 thumb @ ~30 KB, 1200x1200 detail @ ~110 KB) cuts grid transfer by 96.25%.
  - Standard HTTP caching + Service Worker reduces monthly egress per kiosk to ~75 MB/month.
  - Cloudflare R2 provides 10 GB storage with $0.00 unlimited egress, making it the superior media host.
  - Decoupling read-heavy catalog viewing (Cloudflare R2/CDN) from write-heavy lead capture (Supabase REST) provides 100% immunity against Supabase 7-day inactivity pause and database cold starts.
- **Unexplored areas**: None within the assigned caching and architecture scope.

## Key Decisions Made
- Recommended Cloudflare R2 + CDN for image storage and catalog static JSON.
- Recommended maintaining Supabase exclusively for transactional commercial lead capture (`submitLead`).
- Formulated two-tier WebP image component specification (`<KioskImage>`).
- Configured Workbox runtime caching specification (`CacheFirst` for images, `StaleWhileRevalidate` for catalog JSON).

## Artifact Index
- `DISPATCH.md` — Incoming dispatch log
- `BRIEFING.md` — Working memory and persistent state
- `progress.md` — Liveness and task execution tracking
- `report.md` — Comprehensive Kiosk Client Architecture & Caching Report (Completed)
- `handoff.md` — 5-component self-contained handoff report (Completed)

