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

console.log(`[generate_migrations] Loaded ${CATEGORIES.length} categories, ${BODY_PARTS.length} body parts, ${PRODUCTS.length} products.`);

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

// =====================================================================
// 1. Generate Supabase PostgreSQL Seed
// =====================================================================
function generatePostgresSeed() {
  let sql = `-- =====================================================================\n`;
  sql += `-- CatalogoTyn: Supabase PostgreSQL Seed Script\n`;
  sql += `-- Categories: ${CATEGORIES.length} | Body Parts: ${BODY_PARTS.length} | Products: ${PRODUCTS.length}\n`;
  sql += `-- Generated at: ${new Date().toISOString()}\n`;
  sql += `-- =====================================================================\n\n`;
  sql += `BEGIN;\n\n`;

  // 1. Categories
  sql += `-- 1. Insert Categories (${CATEGORIES.length} items)\n`;
  sql += `INSERT INTO public.categories (id, label, icon, sort_order) VALUES\n`;
  const catRows = CATEGORIES.map((c, i) =>
    `  (${escapeSql(c.id)}, ${escapeSql(c.label)}, ${escapeSql(c.icon)}, ${(i + 1) * 10})`
  );
  sql += catRows.join(',\n') + `\nON CONFLICT (id) DO UPDATE SET label = EXCLUDED.label, icon = EXCLUDED.icon, sort_order = EXCLUDED.sort_order;\n\n`;

  // 2. Body Parts
  sql += `-- 2. Insert Anatomical Body Parts (${BODY_PARTS.length} items)\n`;
  sql += `INSERT INTO public.body_parts (id, name, hotspot_id, position, normal, zoom_target, zoom_orbit, label, description) VALUES\n`;
  const bodyRows = BODY_PARTS.map(bp => {
    return `  (${escapeSql(bp.id)}, ${escapeSql(bp.name)}, ${escapeSql(bp.hotspotId)}, ` +
           `${escapeSql(bp.position)}, ${escapeSql(bp.normal)}, ${escapeSql(bp.zoomTarget)}, ` +
           `${escapeSql(bp.zoomOrbit)}, ${escapeSql(bp.label)}, ${escapeSql(bp.desc)})`;
  });
  sql += bodyRows.join(',\n') + `\nON CONFLICT (id) DO UPDATE SET\n` +
         `  name = EXCLUDED.name, hotspot_id = EXCLUDED.hotspot_id, position = EXCLUDED.position,\n` +
         `  normal = EXCLUDED.normal, zoom_target = EXCLUDED.zoom_target, zoom_orbit = EXCLUDED.zoom_orbit,\n` +
         `  label = EXCLUDED.label, description = EXCLUDED.description;\n\n`;

  // 3. Products
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

// =====================================================================
// 2. Generate Cloudflare D1 SQLite Seed
// =====================================================================
function generateSqliteSeed() {
  let sql = `-- =====================================================================\n`;
  sql += `-- CatalogoTyn: Cloudflare D1 Serverless SQLite Seed Script\n`;
  sql += `-- Categories: ${CATEGORIES.length} | Body Parts: ${BODY_PARTS.length} | Products: ${PRODUCTS.length}\n`;
  sql += `-- Generated at: ${new Date().toISOString()}\n`;
  sql += `-- =====================================================================\n\n`;

  // 1. Categories
  sql += `-- 1. Insert Categories (${CATEGORIES.length} items)\n`;
  sql += `INSERT INTO categories (id, label, icon, sort_order) VALUES\n`;
  const catRows = CATEGORIES.map((c, i) =>
    `  (${escapeSql(c.id)}, ${escapeSql(c.label)}, ${escapeSql(c.icon)}, ${(i + 1) * 10})`
  );
  sql += catRows.join(',\n') + `\nON CONFLICT (id) DO UPDATE SET label = EXCLUDED.label, icon = EXCLUDED.icon, sort_order = EXCLUDED.sort_order;\n\n`;

  // 2. Body Parts
  sql += `-- 2. Insert Anatomical Body Parts (${BODY_PARTS.length} items)\n`;
  sql += `INSERT INTO body_parts (id, name, hotspot_id, position, normal, zoom_target, zoom_orbit, label, description) VALUES\n`;
  const bodyRows = BODY_PARTS.map(bp => {
    return `  (${escapeSql(bp.id)}, ${escapeSql(bp.name)}, ${escapeSql(bp.hotspotId)}, ` +
           `${escapeSql(bp.position)}, ${escapeSql(bp.normal)}, ${escapeSql(bp.zoomTarget)}, ` +
           `${escapeSql(bp.zoomOrbit)}, ${escapeSql(bp.label)}, ${escapeSql(bp.desc)})`;
  });
  sql += bodyRows.join(',\n') + `\nON CONFLICT (id) DO UPDATE SET\n` +
         `  name = EXCLUDED.name, hotspot_id = EXCLUDED.hotspot_id, position = EXCLUDED.position,\n` +
         `  normal = EXCLUDED.normal, zoom_target = EXCLUDED.zoom_target, zoom_orbit = EXCLUDED.zoom_orbit,\n` +
         `  label = EXCLUDED.label, description = EXCLUDED.description;\n\n`;

  // 3. Products
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

// Generate SQL outputs
const pgSql = generatePostgresSeed();
const sqliteSql = generateSqliteSeed();

// Target output locations
const outDirs = [
  path.resolve(__dirname),
  path.resolve(__dirname, '../.agents/teamwork/worker_remediation'),
  path.resolve(__dirname, '../.agents/teamwork/worker_deliverables')
];

outDirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(path.join(dir, 'supabase_seed.sql'), pgSql, 'utf8');
  fs.writeFileSync(path.join(dir, 'd1_seed.sql'), sqliteSql, 'utf8');
  console.log(`[generate_migrations] Wrote supabase_seed.sql (${(pgSql.length / 1024).toFixed(1)} KB) and d1_seed.sql (${(sqliteSql.length / 1024).toFixed(1)} KB) to ${dir}`);
});

module.exports = { generatePostgresSeed, generateSqliteSeed };
