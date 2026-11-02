Recommend an online database and image storage solution with a generous, reliable free tier for the Tynor interactive kiosk catalog (React, Vite, Electron, Android/Capacitor), taking into account product data, image hosting, and the existing Supabase integration.

Integrity mode: development

## Requirements

### R1. Technical Evaluation and Recommendation
Evaluate and compare viable online database and image hosting solutions operating on reliable free tiers for the Tynor interactive kiosk catalog. The team may decide the exact deliverable format (comparative analysis report alone, or accompanied by database schema design and integration guidance for the project).

### R2. Solution Architecture and Free Tier Feasibility
Assess both unified platforms (handling structured product data and media in one place) and hybrid architectures (e.g. database paired with dedicated image storage/CDN), determining the optimal architecture under free-tier quotas for a medium-scale catalog (100 to 1,000 products, up to 5 GB of images).

### R3. Kiosk Online Operation and Client Caching
The proposed solution must support online-only operation for the kiosk with standard client/browser caching across React/Vite, Electron, and Capacitor (Android APK), evaluating latency, image delivery performance, and bandwidth consumption.

## Acceptance Criteria

### Feasibility & Limits Verification
- [ ] Evaluates the existing Supabase integration in `src/services/supabase.js` and assesses whether expanding it covers product catalog storage and image hosting within its free tier.
- [ ] Compares viable alternative solutions (including Firebase, Cloudflare D1/R2, Cloudinary, and/or PocketBase) against the project's medium catalog scale (100–1,000 products, up to 5 GB images).
- [ ] Validates free-tier quotas against verified official documentation, explicitly documenting storage limits (GB), egress/bandwidth limits, read/write or API call quotas, and any project pause/inactivity policies.
- [ ] Verifies compatibility with the existing tech stack (React, Vite, Electron, Capacitor Android).
- [ ] Delivers a clear final recommendation with documented trade-offs, pros and cons, and actionable guidance for storing products (prices, stock, sizes, colors, body part, descriptions) and images.
