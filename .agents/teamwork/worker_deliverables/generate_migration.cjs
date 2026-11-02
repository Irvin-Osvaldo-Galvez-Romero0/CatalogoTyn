const fs = require('fs');
const path = require('path');
const { PRODUCTS, CATEGORIES, BODY_PARTS } = require('../../../src/data/products.js');

console.log(`Loaded ${CATEGORIES.length} categories, ${BODY_PARTS.length} body parts, ${PRODUCTS.length} products.`);

function escapeSql(str) {
  if (str === null || str === undefined) return 'NULL';
  return `'${String(str).replace(/'/g, "''")}'`;
}

function escapeJson(obj) {
  if (obj === null || obj === undefined) return "'[]'::jsonb";
  return `'${JSON.stringify(obj).replace(/'/g, "''")}'::jsonb`;
}

function escapeJsonSqlite(obj) {
  if (obj === null || obj === undefined) return "'[]'";
  return `'${JSON.stringify(obj).replace(/'/g, "''")}'`;
}

// Generate Postgres SQL
let pgSql = `-- =====================================================================
-- CatalogoTyn: Supabase PostgreSQL Seed Data
-- Total Categories: ${CATEGORIES.length}
-- Total Products: ${PRODUCTS.length}
-- Generated at: ${new Date().toISOString()}
-- =====================================================================

BEGIN;

-- 1. Insert Categories
INSERT INTO public.categories (id, label, icon, sort_order) VALUES
`;

const catRows = CATEGORIES.map((cat, idx) => {
  return `  (${escapeSql(cat.id)}, ${escapeSql(cat.label)}, ${escapeSql(cat.icon)}, ${(idx + 1) * 10})`;
});
pgSql += catRows.join(',\n') + '\nON CONFLICT (id) DO UPDATE SET label = EXCLUDED.label, icon = EXCLUDED.icon, sort_order = EXCLUDED.sort_order;\n\n';

// 2. Insert Products
pgSql += `-- 2. Insert Products (${PRODUCTS.length} items)\nINSERT INTO public.products (\n`;
pgSql += `  code, name, cat_id, price, stock, body_part, badge, linea,\n`;
pgSql += `  sizes, colors, has_pdf, has_video, short_desc, description, uses, features,\n`;
pgSql += `  image_thumb_url, image_detail_url, pdf_url, video_url, is_active\n) VALUES\n`;

const prodRows = PRODUCTS.map(p => {
  const code = p.code;
  const thumbUrl = `https://media.tynorcatalog.com/images/thumb/${code}.webp`;
  const detailUrl = `https://media.tynorcatalog.com/images/detail/${code}.webp`;
  const pdfUrl = p.hasPdf ? `https://media.tynorcatalog.com/pdf/${code}.pdf` : null;
  const videoUrl = p.hasVideo ? `https://media.tynorcatalog.com/video/${code}.mp4` : null;

  return `  (${escapeSql(p.code)}, ${escapeSql(p.name)}, ${escapeSql(p.cat)}, ${p.price !== null ? p.price : 'NULL'}, 0, ${escapeSql(p.bodyPart)}, ${escapeSql(p.badge)}, ${escapeSql(p.linea)}, ${escapeJson(p.sizes || [])}, ${escapeJson(p.colors || [])}, ${p.hasPdf ? 'true' : 'false'}, ${p.hasVideo ? 'true' : 'false'}, ${escapeSql(p.shortDesc)}, ${escapeSql(p.desc)}, ${escapeJson(p.uses || [])}, ${escapeJson(p.features || [])}, ${escapeSql(thumbUrl)}, ${escapeSql(detailUrl)}, ${escapeSql(pdfUrl)}, ${escapeSql(videoUrl)}, true)`;
});

pgSql += prodRows.join(',\n') + '\nON CONFLICT (code) DO UPDATE SET\n';
pgSql += `  name = EXCLUDED.name, cat_id = EXCLUDED.cat_id, price = EXCLUDED.price,\n`;
pgSql += `  body_part = EXCLUDED.body_part, badge = EXCLUDED.badge, linea = EXCLUDED.linea,\n`;
pgSql += `  sizes = EXCLUDED.sizes, colors = EXCLUDED.colors, has_pdf = EXCLUDED.has_pdf,\n`;
pgSql += `  has_video = EXCLUDED.has_video, short_desc = EXCLUDED.short_desc, description = EXCLUDED.description,\n`;
pgSql += `  uses = EXCLUDED.uses, features = EXCLUDED.features, image_thumb_url = EXCLUDED.image_thumb_url,\n`;
pgSql += `  image_detail_url = EXCLUDED.image_detail_url, pdf_url = EXCLUDED.pdf_url, video_url = EXCLUDED.video_url,\n`;
pgSql += `  updated_at = NOW();\n\nCOMMIT;\n`;

fs.writeFileSync(path.join(__dirname, 'supabase_seed.sql'), pgSql);
console.log(`Generated supabase_seed.sql (${(pgSql.length / 1024).toFixed(1)} KB)`);
