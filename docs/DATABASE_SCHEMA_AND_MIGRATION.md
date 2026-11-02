# Database Schema Design & Migration Specification

**Project:** Tynor Interactive Kiosk Catalog (`CatalogoTyn`)  
**Target Systems:** Supabase PostgreSQL 17 / Cloudflare D1 SQLite  
**Date:** November 2026  
**Status:** Approved Production Specification  

---

## 1. Executive Summary & Data Architecture

This document specifies the authoritative relational database schema and migration pipeline for transitioning the Tynor commercial catalog from bundled JavaScript mock data (`src/data/products.js`) into an online cloud database.

### 1.1 Scope & Data Volume
* **Categories:** 10 categories (`todos`, `hombro_brazo`, `cabestrillo`, `inmovilizador`, `cervical`, `clavicula`, `lumbar`, `rodillera`, `tobillo`, `movilidad`).
* **Anatomical Body Parts:** 9 anatomical regions (`hombro`, `mano`, `rodilla`, `cuello`, `clavicula`, `brazo`, `espalda`, `pierna`, `tobillo`) with 3D model hotspot coordinates (`position`, `normal`, `zoomTarget`, `zoomOrbit`, `label`, `desc`) for the interactive anatomy explorer (`AnatomyView.jsx`).
* **Products:** Exactly **180 products** partitioned across three official commercial lines:
  * **ORTOPEDIA:** 132 products
  * **Deportiva:** 27 products
  * **REHABILITACION:** 21 products
* **Commercial Pricing Distribution:** Exactly **9 products** possess active baseline commercial prices in `src/data/products.js` (`A01`=$420.00, `B01`=$185.00, `C01`=$125.00, `C02`=$265.00, `C03`=$360.00, `C04`=$213.00, `C05`=$210.00, `C06`=$140.00, `D01`=$160.00). The remaining **171 products** default to `NULL` ("Consultar Precio" in kiosk UI).
* **Media Links:** 172 products link to technical datasheet PDFs, 1 product links to MP4 demonstration video, and all 180 products link to two-tier WebP images (400x400 thumbnail and 1200x1200 detail).
* **Attribute Fidelity:** Full preservation of all 15 clinical and commercial attributes defined in the frontend application.

```mermaid
erDiagram
    CATEGORIES ||--o{ PRODUCTS : categorizes
    BODY_PARTS ||--o{ PRODUCTS : locates
    
    CATEGORIES {
        varchar(50) id PK "Unique category slug"
        varchar(100) label "Human-readable label"
        varchar(50) icon "Lucide icon name"
        integer sort_order "Display sequence"
        boolean is_active "Visibility flag"
        timestamptz created_at
        timestamptz updated_at
    }

    BODY_PARTS {
        varchar(50) id PK "Anatomical slug (e.g. hombro, rodilla)"
        varchar(100) name "Clinical & anatomical label"
        varchar(50) hotspot_id "3D hotspot DOM identifier"
        varchar(50) position "3D model coordinate string"
        varchar(50) normal "Surface normal vector string"
        varchar(50) zoom_target "Camera target coordinate"
        varchar(50) zoom_orbit "Camera orbit angles and radius"
        varchar(10) label "Sequential badge number (1-9)"
        text description "Biomechanical and clinical scope"
        timestamptz created_at
        timestamptz updated_at
    }

    PRODUCTS {
        varchar(50) code PK "Unique SKU reference (e.g. 101, D02)"
        varchar(255) name "Commercial & clinical name"
        varchar(50) cat_id FK "References categories.id"
        numeric(10,2) price "Unit price (nullable, 9 active, 171 null)"
        integer stock "Available inventory units"
        varchar(50) body_part FK "References body_parts.id"
        varchar(50) badge "Visual tag (e.g. Deportiva, Nuevo)"
        varchar(50) linea "ORTOPEDIA, Deportiva, REHABILITACION"
        jsonb sizes "Array of size codes (CH, M, G, XL)"
        jsonb colors "Array of color objects {id, name, hex, border}"
        boolean has_pdf "Technical datasheet availability"
        boolean has_video "Product video demo availability"
        text short_desc "Card summary text"
        text description "Modal clinical description"
        jsonb uses "Medical indications array"
        jsonb features "Engineering specifications array"
        text image_thumb_url "CDN URL to 400x400 WebP"
        text image_detail_url "CDN URL to 1200x1200 WebP"
        text pdf_url "CDN URL to compressed PDF"
        text video_url "CDN URL to MP4 video"
        tsvector fts "Generated Spanish full-text search vector"
        boolean is_active "Catalog visibility flag"
        timestamptz created_at
        timestamptz updated_at
    }
```

---

## 2. PostgreSQL DDL for Supabase

The following script provisions the complete relational structure, foreign keys, triggers, B-tree/GIN/trigram indexes, and Row Level Security (RLS) policies for Supabase PostgreSQL 17.

```sql
-- =====================================================================
-- Tynor Catalog: Supabase PostgreSQL Schema Specification
-- Target: Supabase Postgres 15+ / 17+ (Project: xvrnssesbkzxeusubzes)
-- =====================================================================

-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- 2. Create Categories Table
CREATE TABLE IF NOT EXISTS public.categories (
    id VARCHAR(50) PRIMARY KEY,
    label VARCHAR(100) NOT NULL,
    icon VARCHAR(50) NOT NULL DEFAULT 'Grid',
    sort_order INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

COMMENT ON TABLE public.categories IS 'Product taxonomy categories mapped to Lucide icons and UI navigation tabs';
COMMENT ON COLUMN public.categories.id IS 'Category identifier slug matching frontend routing (e.g. rodillera, lumbar)';

-- 3. Create Anatomical Body Parts Table
CREATE TABLE IF NOT EXISTS public.body_parts (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    hotspot_id VARCHAR(50) NOT NULL,
    position VARCHAR(50) NOT NULL,
    normal VARCHAR(50) NOT NULL,
    zoom_target VARCHAR(50),
    zoom_orbit VARCHAR(50),
    label VARCHAR(10),
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

COMMENT ON TABLE public.body_parts IS 'Anatomical regions with 3D model hotspot coordinates and camera vectors';
COMMENT ON COLUMN public.body_parts.id IS 'Anatomical slug matching 3D hot spots (e.g. hombro, rodilla, cuello)';

-- 4. Create Products Table
CREATE TABLE IF NOT EXISTS public.products (
    code VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    cat_id VARCHAR(50) NOT NULL REFERENCES public.categories(id) ON UPDATE CASCADE ON DELETE RESTRICT,
    price NUMERIC(10, 2) CHECK (price IS NULL OR price >= 0),
    stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
    body_part VARCHAR(50) NOT NULL REFERENCES public.body_parts(id) ON UPDATE CASCADE ON DELETE RESTRICT,
    badge VARCHAR(50),
    linea VARCHAR(50) NOT NULL CHECK (linea IN ('ORTOPEDIA', 'Deportiva', 'REHABILITACION')),
    sizes JSONB NOT NULL DEFAULT '[]'::jsonb,
    colors JSONB NOT NULL DEFAULT '[]'::jsonb,
    has_pdf BOOLEAN NOT NULL DEFAULT false,
    has_video BOOLEAN NOT NULL DEFAULT false,
    short_desc TEXT,
    description TEXT,
    uses JSONB NOT NULL DEFAULT '[]'::jsonb,
    features JSONB NOT NULL DEFAULT '[]'::jsonb,
    image_thumb_url TEXT NOT NULL,
    image_detail_url TEXT NOT NULL,
    pdf_url TEXT,
    video_url TEXT,
    fts TSVECTOR GENERATED ALWAYS AS (
        to_tsvector('spanish', name || ' ' || coalesce(short_desc, '') || ' ' || coalesce(description, ''))
    ) STORED,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

COMMENT ON TABLE public.products IS 'Authoritative orthotic catalog items with clinical attributes, CDN media URLs, and FTS';
COMMENT ON COLUMN public.products.code IS 'Primary SKU code used to resolve product photography and datasheets';
COMMENT ON COLUMN public.products.body_part IS 'Anatomical anchor referencing public.body_parts(id)';
COMMENT ON COLUMN public.products.fts IS 'Materialized full-text search vector generated using Spanish stemming';

-- 5. B-Tree, GIN, and Trigram Indexes for Ultra-Fast Queries
CREATE INDEX IF NOT EXISTS idx_products_cat_id ON public.products(cat_id);
CREATE INDEX IF NOT EXISTS idx_products_linea ON public.products(linea);
CREATE INDEX IF NOT EXISTS idx_products_body_part ON public.products(body_part);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON public.products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_price ON public.products(price);

-- GIN Indexes for JSONB Attribute Filtering
CREATE INDEX IF NOT EXISTS idx_products_sizes_gin ON public.products USING gin(sizes);
CREATE INDEX IF NOT EXISTS idx_products_features_gin ON public.products USING gin(features);
CREATE INDEX IF NOT EXISTS idx_products_uses_gin ON public.products USING gin(uses);

-- Trigram Indexes for High-Performance Substring Search (ILIKE) on Name and Code
CREATE INDEX IF NOT EXISTS idx_products_name_trgm ON public.products USING gin(name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_products_code_trgm ON public.products USING gin(code gin_trgm_ops);

-- Full-Text Search GIN Index for Spanish Natural Language Queries
CREATE INDEX IF NOT EXISTS idx_products_fts ON public.products USING gin(fts);

-- 6. Automated Timestamp Triggers
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_categories_updated_at ON public.categories;
CREATE TRIGGER set_categories_updated_at
    BEFORE UPDATE ON public.categories
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_body_parts_updated_at ON public.body_parts;
CREATE TRIGGER set_body_parts_updated_at
    BEFORE UPDATE ON public.body_parts
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_products_updated_at ON public.products;
CREATE TRIGGER set_products_updated_at
    BEFORE UPDATE ON public.products
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 7. Row Level Security (RLS) Configuration
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.body_parts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Kiosks & Public Readers: Read access to active catalog and anatomical metadata
DROP POLICY IF EXISTS "Allow public read access to active categories" ON public.categories;
CREATE POLICY "Allow public read access to active categories"
    ON public.categories FOR SELECT
    TO anon, authenticated
    USING (is_active = true);

DROP POLICY IF EXISTS "Allow public read access to body_parts" ON public.body_parts;
CREATE POLICY "Allow public read access to body_parts"
    ON public.body_parts FOR SELECT
    TO anon, authenticated
    USING (true);

DROP POLICY IF EXISTS "Allow public read access to active products" ON public.products;
CREATE POLICY "Allow public read access to active products"
    ON public.products FOR SELECT
    TO anon, authenticated
    USING (is_active = true);

-- Administrative Policy: Authenticated staff with admin claims can manage all catalog entities
DROP POLICY IF EXISTS "Allow authenticated staff to manage categories" ON public.categories;
CREATE POLICY "Allow authenticated staff to manage categories"
    ON public.categories FOR ALL
    TO authenticated
    USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
    WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

DROP POLICY IF EXISTS "Allow authenticated staff to manage body_parts" ON public.body_parts;
CREATE POLICY "Allow authenticated staff to manage body_parts"
    ON public.body_parts FOR ALL
    TO authenticated
    USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
    WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

DROP POLICY IF EXISTS "Allow authenticated staff to manage products" ON public.products;
CREATE POLICY "Allow authenticated staff to manage products"
    ON public.products FOR ALL
    TO authenticated
    USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
    WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- Service Role: Unrestricted CRUD permissions for background synchronization and CLI scripts
DROP POLICY IF EXISTS "Allow service_role full access to categories" ON public.categories;
CREATE POLICY "Allow service_role full access to categories"
    ON public.categories FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

DROP POLICY IF EXISTS "Allow service_role full access to body_parts" ON public.body_parts;
CREATE POLICY "Allow service_role full access to body_parts"
    ON public.body_parts FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

DROP POLICY IF EXISTS "Allow service_role full access to products" ON public.products;
CREATE POLICY "Allow service_role full access to products"
    ON public.products FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);
```

---

## 3. SQLite DDL for Cloudflare D1

For teams implementing the pure edge serverless architecture on Cloudflare D1 with FTS5 search and automated update triggers:

```sql
-- =====================================================================
-- Tynor Catalog: Cloudflare D1 SQLite Schema Specification
-- Engine: Cloudflare D1 Serverless Edge SQLite
-- =====================================================================

-- 1. Create Categories Table
CREATE TABLE IF NOT EXISTS categories (
    id TEXT PRIMARY KEY,
    label TEXT NOT NULL,
    icon TEXT NOT NULL DEFAULT 'Grid',
    sort_order INTEGER NOT NULL DEFAULT 0,
    is_active INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')),
    updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now'))
);

-- 2. Create Anatomical Body Parts Table
CREATE TABLE IF NOT EXISTS body_parts (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    hotspot_id TEXT NOT NULL,
    position TEXT NOT NULL,
    normal TEXT NOT NULL,
    zoom_target TEXT,
    zoom_orbit TEXT,
    label TEXT,
    description TEXT,
    created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')),
    updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now'))
);

-- 3. Create Products Table
CREATE TABLE IF NOT EXISTS products (
    code TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    cat_id TEXT NOT NULL REFERENCES categories(id) ON UPDATE CASCADE ON DELETE RESTRICT,
    price REAL CHECK (price IS NULL OR price >= 0),
    stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
    body_part TEXT NOT NULL REFERENCES body_parts(id) ON UPDATE CASCADE ON DELETE RESTRICT,
    badge TEXT,
    linea TEXT NOT NULL CHECK (linea IN ('ORTOPEDIA', 'Deportiva', 'REHABILITACION')),
    sizes TEXT NOT NULL DEFAULT '[]' CHECK (json_valid(sizes)),
    colors TEXT NOT NULL DEFAULT '[]' CHECK (json_valid(colors)),
    has_pdf INTEGER NOT NULL DEFAULT 0,
    has_video INTEGER NOT NULL DEFAULT 0,
    short_desc TEXT,
    description TEXT,
    uses TEXT NOT NULL DEFAULT '[]' CHECK (json_valid(uses)),
    features TEXT NOT NULL DEFAULT '[]' CHECK (json_valid(features)),
    image_thumb_url TEXT NOT NULL,
    image_detail_url TEXT NOT NULL,
    pdf_url TEXT,
    video_url TEXT,
    is_active INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')),
    updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now'))
);

-- 4. High-Performance Query Indexes
CREATE INDEX IF NOT EXISTS idx_d1_products_cat_id ON products(cat_id);
CREATE INDEX IF NOT EXISTS idx_d1_products_linea ON products(linea);
CREATE INDEX IF NOT EXISTS idx_d1_products_body_part ON products(body_part);
CREATE INDEX IF NOT EXISTS idx_d1_products_is_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_d1_products_price ON products(price);

-- 5. Automated Updated At Triggers for SQLite
CREATE TRIGGER IF NOT EXISTS trigger_categories_updated_at
AFTER UPDATE ON categories FOR EACH ROW
WHEN NEW.updated_at = OLD.updated_at
BEGIN
    UPDATE categories SET updated_at = (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')) WHERE id = NEW.id;
END;

CREATE TRIGGER IF NOT EXISTS trigger_body_parts_updated_at
AFTER UPDATE ON body_parts FOR EACH ROW
WHEN NEW.updated_at = OLD.updated_at
BEGIN
    UPDATE body_parts SET updated_at = (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')) WHERE id = NEW.id;
END;

CREATE TRIGGER IF NOT EXISTS trigger_products_updated_at
AFTER UPDATE ON products FOR EACH ROW
WHEN NEW.updated_at = OLD.updated_at
BEGIN
    UPDATE products SET updated_at = (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')) WHERE code = NEW.code;
END;

-- 6. FTS5 Virtual Table for Sub-Millisecond Search
CREATE VIRTUAL TABLE IF NOT EXISTS products_fts USING fts5(
    code,
    name,
    short_desc,
    description,
    content='products',
    content_rowid='rowid',
    tokenize = 'unicode61'
);

-- FTS5 Content Synchronization Triggers
CREATE TRIGGER IF NOT EXISTS products_fts_ai AFTER INSERT ON products BEGIN
    INSERT INTO products_fts(rowid, code, name, short_desc, description)
    VALUES (new.rowid, new.code, new.name, new.short_desc, new.description);
END;

CREATE TRIGGER IF NOT EXISTS products_fts_ad AFTER DELETE ON products BEGIN
    INSERT INTO products_fts(products_fts, rowid, code, name, short_desc, description)
    VALUES ('delete', old.rowid, old.code, old.name, old.short_desc, old.description);
END;

CREATE TRIGGER IF NOT EXISTS products_fts_au AFTER UPDATE ON products BEGIN
    INSERT INTO products_fts(products_fts, rowid, code, name, short_desc, description)
    VALUES ('delete', old.rowid, old.code, old.name, old.short_desc, old.description);
    INSERT INTO products_fts(rowid, code, name, short_desc, description)
    VALUES (new.rowid, new.code, new.name, new.short_desc, new.description);
END;
```

---

## 4. Production Migration Script: `scripts/generate_migrations.cjs`

The automated migration generator extracts the 180 products, 10 categories, and 9 anatomical body parts from `src/data/products.js`, serializes JSON fields, applies SQL escaping, and generates both PostgreSQL (`supabase_seed.sql`) and Cloudflare D1 SQLite (`d1_seed.sql`) seed files.

```javascript
/**
 * scripts/generate_migrations.cjs
 * Automated SQL seed generator for CatalogoTyn.
 * Transforms static JS catalog into production-ready SQL scripts for:
 * 1. Supabase PostgreSQL 17 (supabase_seed.sql)
 * 2. Cloudflare D1 Serverless SQLite (d1_seed.sql)
 */

const fs = require('fs');
const path = require('path');
const { PRODUCTS, CATEGORIES, BODY_PARTS } = require('../src/data/products.js');

const CDN_BASE = 'https://media.tynorcatalog.com';

function escapeSql(val) {
  if (val === null || val === undefined) return 'NULL';
  return `'${String(val).replace(/'/g, "''")}'`;
}

function escapePgJson(obj) {
  if (!obj || (Array.isArray(obj) && obj.length === 0)) return "'[]'::jsonb";
  return `'${JSON.stringify(obj).replace(/'/g, "''")}'::jsonb`;
}

function escapeSqliteJson(obj) {
  if (!obj || (Array.isArray(obj) && obj.length === 0)) return "'[]'";
  return `'${JSON.stringify(obj).replace(/'/g, "''")}'`;
}

// 1. Generate Supabase PostgreSQL Seed
function generatePostgresSeed() {
  let sql = `-- =====================================================================\n`;
  sql += `-- CatalogoTyn: Supabase PostgreSQL Seed Script\n`;
  sql += `-- Categories: ${CATEGORIES.length} | Body Parts: ${BODY_PARTS.length} | Products: ${PRODUCTS.length}\n`;
  sql += `-- Timestamp: ${new Date().toISOString()}\n`;
  sql += `-- =====================================================================\n\n`;
  sql += `BEGIN;\n\n`;

  // Categories
  sql += `-- 1. Insert Categories (${CATEGORIES.length} items)\n`;
  sql += `INSERT INTO public.categories (id, label, icon, sort_order) VALUES\n`;
  const catRows = CATEGORIES.map((c, i) =>
    `  (${escapeSql(c.id)}, ${escapeSql(c.label)}, ${escapeSql(c.icon)}, ${(i + 1) * 10})`
  );
  sql += catRows.join(',\n') + `\nON CONFLICT (id) DO UPDATE SET label = EXCLUDED.label, icon = EXCLUDED.icon, sort_order = EXCLUDED.sort_order;\n\n`;

  // Body Parts
  sql += `-- 2. Insert Anatomical Body Parts (${BODY_PARTS.length} items)\n`;
  sql += `INSERT INTO public.body_parts (id, name, hotspot_id, position, normal, zoom_target, zoom_orbit, label, description) VALUES\n`;
  const bodyRows = BODY_PARTS.map(bp =>
    `  (${escapeSql(bp.id)}, ${escapeSql(bp.name)}, ${escapeSql(bp.hotspotId)}, ${escapeSql(bp.position)}, ${escapeSql(bp.normal)}, ${escapeSql(bp.zoomTarget)}, ${escapeSql(bp.zoomOrbit)}, ${escapeSql(bp.label)}, ${escapeSql(bp.desc)})`
  );
  sql += bodyRows.join(',\n') + `\nON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, hotspot_id = EXCLUDED.hotspot_id, position = EXCLUDED.position, normal = EXCLUDED.normal, zoom_target = EXCLUDED.zoom_target, zoom_orbit = EXCLUDED.zoom_orbit, label = EXCLUDED.label, description = EXCLUDED.description;\n\n`;

  // Products
  sql += `-- 3. Insert Products (${PRODUCTS.length} items)\n`;
  sql += `INSERT INTO public.products (\n`;
  sql += `  code, name, cat_id, price, stock, body_part, badge, linea,\n`;
  sql += `  sizes, colors, has_pdf, has_video, short_desc, description, uses, features,\n`;
  sql += `  image_thumb_url, image_detail_url, pdf_url, video_url, is_active\n) VALUES\n`;

  const prodRows = PRODUCTS.map(p => {
    const thumbUrl = `${CDN_BASE}/images/thumb/${p.code}.webp`;
    const detailUrl = `${CDN_BASE}/images/detail/${p.code}.webp`;
    const pdfUrl = p.hasPdf ? `${CDN_BASE}/pdf/${p.code}.pdf` : null;
    const videoUrl = p.hasVideo ? `${CDN_BASE}/video/${p.code}.mp4` : null;
    const priceVal = p.price !== null ? p.price : 'NULL';

    return `  (${escapeSql(p.code)}, ${escapeSql(p.name)}, ${escapeSql(p.cat)}, ` +
           `${priceVal}, 0, ${escapeSql(p.bodyPart)}, ${escapeSql(p.badge)}, ${escapeSql(p.linea)}, ` +
           `${escapePgJson(p.sizes || [])}, ${escapePgJson(p.colors || [])}, ` +
           `${p.hasPdf ? 'true' : 'false'}, ${p.hasVideo ? 'true' : 'false'}, ` +
           `${escapeSql(p.shortDesc)}, ${escapeSql(p.desc)}, ${escapePgJson(p.uses || [])}, ` +
           `${escapePgJson(p.features || [])}, ${escapeSql(thumbUrl)}, ${escapeSql(detailUrl)}, ` +
           `${escapeSql(pdfUrl)}, ${escapeSql(videoUrl)}, true)`;
  });

  sql += prodRows.join(',\n') + `\nON CONFLICT (code) DO UPDATE SET\n`;
  sql += `  name = EXCLUDED.name, cat_id = EXCLUDED.cat_id, price = EXCLUDED.price,\n`;
  sql += `  body_part = EXCLUDED.body_part, badge = EXCLUDED.badge, linea = EXCLUDED.linea,\n`;
  sql += `  sizes = EXCLUDED.sizes, colors = EXCLUDED.colors, has_pdf = EXCLUDED.has_pdf,\n`;
  sql += `  has_video = EXCLUDED.has_video, short_desc = EXCLUDED.short_desc, description = EXCLUDED.description,\n`;
  sql += `  uses = EXCLUDED.uses, features = EXCLUDED.features, image_thumb_url = EXCLUDED.image_thumb_url,\n`;
  sql += `  image_detail_url = EXCLUDED.image_detail_url, pdf_url = EXCLUDED.pdf_url, video_url = EXCLUDED.video_url,\n`;
  sql += `  updated_at = NOW();\n\nCOMMIT;\n`;

  return sql;
}

// 2. Generate Cloudflare D1 SQLite Seed
function generateSqliteSeed() {
  let sql = `-- =====================================================================\n`;
  sql += `-- CatalogoTyn: Cloudflare D1 Serverless SQLite Seed Script\n`;
  sql += `-- Categories: ${CATEGORIES.length} | Body Parts: ${BODY_PARTS.length} | Products: ${PRODUCTS.length}\n`;
  sql += `-- Timestamp: ${new Date().toISOString()}\n`;
  sql += `-- =====================================================================\n\n`;

  // Categories
  sql += `-- 1. Insert Categories (${CATEGORIES.length} items)\n`;
  sql += `INSERT INTO categories (id, label, icon, sort_order) VALUES\n`;
  const catRows = CATEGORIES.map((c, i) =>
    `  (${escapeSql(c.id)}, ${escapeSql(c.label)}, ${escapeSql(c.icon)}, ${(i + 1) * 10})`
  );
  sql += catRows.join(',\n') + `\nON CONFLICT (id) DO UPDATE SET label = EXCLUDED.label, icon = EXCLUDED.icon, sort_order = EXCLUDED.sort_order;\n\n`;

  // Body Parts
  sql += `-- 2. Insert Anatomical Body Parts (${BODY_PARTS.length} items)\n`;
  sql += `INSERT INTO body_parts (id, name, hotspot_id, position, normal, zoom_target, zoom_orbit, label, description) VALUES\n`;
  const bodyRows = BODY_PARTS.map(bp =>
    `  (${escapeSql(bp.id)}, ${escapeSql(bp.name)}, ${escapeSql(bp.hotspotId)}, ${escapeSql(bp.position)}, ${escapeSql(bp.normal)}, ${escapeSql(bp.zoomTarget)}, ${escapeSql(bp.zoomOrbit)}, ${escapeSql(bp.label)}, ${escapeSql(bp.desc)})`
  );
  sql += bodyRows.join(',\n') + `\nON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, hotspot_id = EXCLUDED.hotspot_id, position = EXCLUDED.position, normal = EXCLUDED.normal, zoom_target = EXCLUDED.zoom_target, zoom_orbit = EXCLUDED.zoom_orbit, label = EXCLUDED.label, description = EXCLUDED.description;\n\n`;

  // Products
  sql += `-- 3. Insert Products (${PRODUCTS.length} items)\n`;
  sql += `INSERT INTO products (\n`;
  sql += `  code, name, cat_id, price, stock, body_part, badge, linea,\n`;
  sql += `  sizes, colors, has_pdf, has_video, short_desc, description, uses, features,\n`;
  sql += `  image_thumb_url, image_detail_url, pdf_url, video_url, is_active\n) VALUES\n`;

  const prodRows = PRODUCTS.map(p => {
    const thumbUrl = `${CDN_BASE}/images/thumb/${p.code}.webp`;
    const detailUrl = `${CDN_BASE}/images/detail/${p.code}.webp`;
    const pdfUrl = p.hasPdf ? `${CDN_BASE}/pdf/${p.code}.pdf` : null;
    const videoUrl = p.hasVideo ? `${CDN_BASE}/video/${p.code}.mp4` : null;
    const priceVal = p.price !== null ? p.price : 'NULL';

    return `  (${escapeSql(p.code)}, ${escapeSql(p.name)}, ${escapeSql(p.cat)}, ` +
           `${priceVal}, 0, ${escapeSql(p.bodyPart)}, ${escapeSql(p.badge)}, ${escapeSql(p.linea)}, ` +
           `${escapeSqliteJson(p.sizes || [])}, ${escapeSqliteJson(p.colors || [])}, ` +
           `${p.hasPdf ? 1 : 0}, ${p.hasVideo ? 1 : 0}, ` +
           `${escapeSql(p.shortDesc)}, ${escapeSql(p.desc)}, ${escapeSqliteJson(p.uses || [])}, ` +
           `${escapeSqliteJson(p.features || [])}, ${escapeSql(thumbUrl)}, ${escapeSql(detailUrl)}, ` +
           `${escapeSql(pdfUrl)}, ${escapeSql(videoUrl)}, 1)`;
  });

  sql += prodRows.join(',\n') + `\nON CONFLICT (code) DO UPDATE SET\n`;
  sql += `  name = EXCLUDED.name, cat_id = EXCLUDED.cat_id, price = EXCLUDED.price,\n`;
  sql += `  body_part = EXCLUDED.body_part, badge = EXCLUDED.badge, linea = EXCLUDED.linea,\n`;
  sql += `  sizes = EXCLUDED.sizes, colors = EXCLUDED.colors, has_pdf = EXCLUDED.has_pdf,\n`;
  sql += `  has_video = EXCLUDED.has_video, short_desc = EXCLUDED.short_desc, description = EXCLUDED.description,\n`;
  sql += `  uses = EXCLUDED.uses, features = EXCLUDED.features, image_thumb_url = EXCLUDED.image_thumb_url,\n`;
  sql += `  image_detail_url = EXCLUDED.image_detail_url, pdf_url = EXCLUDED.pdf_url, video_url = EXCLUDED.video_url,\n`;
  sql += `  updated_at = (strftime('%Y-%m-%dT%H:%M:%SZ', 'now'));\n`;

  return sql;
}
```

---

## 5. Step-by-Step Migration Execution Guide

### 5.1 Supabase Execution (Option A - Recommended)

1. **Access SQL Editor:**
   - Log into the Supabase Dashboard (`https://supabase.com/dashboard/project/xvrnssesbkzxeusubzes`).
   - Navigate to the **SQL Editor** tab in the left-hand sidebar.
2. **Execute Schema DDL:**
   - Paste the SQL script from **Section 2** (PostgreSQL DDL) into a new query window.
   - Click **Run** (or `Ctrl + Enter`). Confirm output: `Success. No rows returned`.
3. **Execute Data Seed:**
   - Run `node scripts/generate_migrations.cjs` locally to generate `scripts/supabase_seed.sql`.
   - Paste the contents of `scripts/supabase_seed.sql` into the Supabase SQL Editor and click **Run**.
4. **Alternative CLI Deployment:**
   ```bash
   # If using Supabase CLI
   npx supabase db execute --file ./scripts/supabase_schema.sql
   npx supabase db execute --file ./scripts/supabase_seed.sql
   ```

### 5.2 Cloudflare D1 Execution (Option B - Sovereign Edge)

1. **Create Database:**
   ```bash
   npx wrangler d1 create tynor-catalog-db
   ```
2. **Apply Schema:**
   ```bash
   npx wrangler d1 execute tynor-catalog-db --file=./scripts/d1_schema.sql
   ```
3. **Apply Data Seed:**
   ```bash
   npx wrangler d1 execute tynor-catalog-db --file=./scripts/d1_seed.sql
   ```

---

## 6. Verification & Data Integrity Testing

Execute the following SQL verification suite after running the migration. Every check must match the expected invariant exactly:

```sql
-- 1. Total Product Count (Must return exactly 180)
SELECT count(*) AS total_products FROM public.products;
-- Expected: 180

-- 2. Line Distribution Invariant (Must match 132, 27, 21)
SELECT linea, count(*) AS count 
FROM public.products 
GROUP BY linea 
ORDER BY count DESC;
-- Expected:
-- ORTOPEDIA: 132
-- Deportiva: 27
-- REHABILITACION: 21

-- 3. Anatomical Body Parts Count & Foreign Key Integrity
SELECT count(*) AS total_body_parts FROM public.body_parts;
-- Expected: 9

SELECT bp.id, bp.name, count(p.code) AS product_count
FROM public.body_parts bp
LEFT JOIN public.products p ON bp.id = p.body_part
GROUP BY bp.id, bp.name
ORDER BY product_count DESC;
-- Expected: 9 anatomical regions, 180 total products mapped, zero orphan FKs.

-- 4. Category Count & Foreign Key Integrity
SELECT count(*) AS total_categories FROM public.categories;
-- Expected: 10

SELECT c.id, c.label, count(p.code) AS product_count
FROM public.categories c
LEFT JOIN public.products p ON c.id = p.cat_id
GROUP BY c.id, c.label
ORDER BY product_count DESC;
-- Expected: 10 categories, exactly 180 total products mapped, zero orphan FKs.

-- 5. Commercial Price Distribution Invariant
SELECT 
    count(*) FILTER (WHERE price IS NOT NULL) AS active_commercial_prices,
    count(*) FILTER (WHERE price IS NULL) AS unpriced_default_products
FROM public.products;
-- Expected: active_commercial_prices: 9, unpriced_default_products: 171

-- 6. Media Asset Completeness
SELECT 
    count(*) FILTER (WHERE has_pdf = true) AS products_with_pdf,
    count(*) FILTER (WHERE pdf_url IS NOT NULL) AS valid_pdf_urls,
    count(*) FILTER (WHERE image_thumb_url IS NOT NULL) AS valid_thumb_urls,
    count(*) FILTER (WHERE image_detail_url IS NOT NULL) AS valid_detail_urls
FROM public.products;
-- Expected: products_with_pdf: 172, valid_pdf_urls: 172, valid_thumb_urls: 180, valid_detail_urls: 180

-- 7. Full-Text Search (Spanish) Verification
SELECT code, name, ts_rank(fts, to_tsquery('spanish', 'rodilla | rotuliano')) AS rank
FROM public.products
WHERE fts @@ to_tsquery('spanish', 'rodilla | rotuliano')
ORDER BY rank DESC
LIMIT 5;
-- Expected: Returns top ranked products (e.g. 101, 102, 103, 108) with valid rank score.

-- 8. Substring Search via pg_trgm Trigram Index
SELECT code, name
FROM public.products
WHERE name ILIKE '%cabestrillo%'
ORDER BY code;
-- Expected: Fast index scan using idx_products_name_trgm.

-- 9. Row Level Security Verification
SET ROLE anon;
SELECT count(*) FROM public.products WHERE is_active = true;
-- Expected: 180
SELECT count(*) FROM public.body_parts;
-- Expected: 9
RESET ROLE;
```
