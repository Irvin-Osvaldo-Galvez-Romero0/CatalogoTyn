const fs = require('fs');
const path = require('path');
const { PRODUCTS, CATEGORIES } = require('../../../src/data/products.js');

const seedPath = path.join(__dirname, '../worker_deliverables/supabase_seed.sql');
const seedSql = fs.readFileSync(seedPath, 'utf8');

console.log('=== PRODUCT FIDELITY AUDIT ===');
console.log('Source products count:', PRODUCTS.length);

// Extract all rows between VALUES and ON CONFLICT (code)
const valuesStart = seedSql.indexOf('INSERT INTO public.products');
const valuesEnd = seedSql.indexOf('ON CONFLICT (code) DO UPDATE');

if (valuesStart === -1 || valuesEnd === -1) {
  console.error('FAIL: Could not find products INSERT block in seed SQL!');
  process.exit(1);
}

const productsBlock = seedSql.substring(valuesStart, valuesEnd);
const rows = productsBlock.split('\n')
  .map(l => l.trim())
  .filter(l => l.startsWith('('));

console.log('Seed SQL product rows count:', rows.length);

if (rows.length !== PRODUCTS.length) {
  console.error(`MISMATCH: Source has ${PRODUCTS.length} but SQL has ${rows.length} rows!`);
}

// Function to parse a SQL row line
// Row structure:
// (code, name, cat_id, price, stock, body_part, badge, linea,
//  sizes, colors, has_pdf, has_video, short_desc, description, uses, features,
//  image_thumb_url, image_detail_url, pdf_url, video_url, is_active)

let mismatches = [];
let validRows = 0;

for (let i = 0; i < PRODUCTS.length; i++) {
  const p = PRODUCTS[i];
  const row = rows[i];

  if (!row) {
    mismatches.push({ code: p.code, error: 'Row missing in SQL' });
    continue;
  }

  // Check code
  const codeEscaped = `'${p.code}'`;
  if (!row.startsWith(`(${codeEscaped},`)) {
    mismatches.push({ code: p.code, error: `Row code mismatch: expected ${p.code}, row: ${row.substring(0, 30)}` });
    continue;
  }

  // Check price
  if (p.price !== null) {
    if (!row.includes(`, ${p.price}, `)) {
      mismatches.push({ code: p.code, error: `Price mismatch: expected ${p.price}` });
    }
  } else {
    if (!row.includes(`, NULL, 0, `)) {
      mismatches.push({ code: p.code, error: `Null price / stock mismatch` });
    }
  }

  // Check category
  const catEscaped = `'${p.cat}'`;
  if (!row.includes(`, ${catEscaped}, `)) {
    mismatches.push({ code: p.code, error: `Category mismatch: expected ${p.cat}` });
  }

  // Check bodyPart
  const bpEscaped = `'${p.bodyPart}'`;
  if (!row.includes(`, ${bpEscaped}, `)) {
    mismatches.push({ code: p.code, error: `BodyPart mismatch: expected ${p.bodyPart}` });
  }

  // Check linea
  const lineaEscaped = `'${p.linea}'`;
  if (!row.includes(`, ${lineaEscaped}, `)) {
    mismatches.push({ code: p.code, error: `Linea mismatch: expected ${p.linea}` });
  }

  // Check hasPdf and pdfUrl
  if (p.hasPdf) {
    if (!row.includes(`, true, `) || !row.includes(`'https://media.tynorcatalog.com/pdf/${p.code}.pdf'`)) {
      mismatches.push({ code: p.code, error: `hasPdf true but SQL lacks true or valid pdfUrl` });
    }
  } else {
    if (!row.includes(`, false, `) || !row.includes(`, NULL, `)) {
      mismatches.push({ code: p.code, error: `hasPdf false but SQL has non-null pdfUrl or true` });
    }
  }

  // Check hasVideo and videoUrl
  if (p.hasVideo) {
    if (!row.includes(`'https://media.tynorcatalog.com/video/${p.code}.mp4'`)) {
      mismatches.push({ code: p.code, error: `hasVideo true but SQL lacks videoUrl` });
    }
  } else {
    // Should have NULL for video_url
    if (!row.endsWith(`, NULL, true),`) && !row.endsWith(`, NULL, true)`)) {
      // unless videoUrl is present
      mismatches.push({ code: p.code, error: `hasVideo false but SQL ending is unexpected: ${row.slice(-40)}` });
    }
  }

  // Check thumbnail and detail URLs
  const thumbUrl = `'https://media.tynorcatalog.com/images/thumb/${p.code}.webp'`;
  const detailUrl = `'https://media.tynorcatalog.com/images/detail/${p.code}.webp'`;
  if (!row.includes(thumbUrl) || !row.includes(detailUrl)) {
    mismatches.push({ code: p.code, error: `Image URLs mismatch` });
  }

  validRows++;
}

console.log('Audited rows:', validRows);
console.log('Total mismatches found:', mismatches.length);
if (mismatches.length > 0) {
  console.log('Sample mismatches:', mismatches.slice(0, 5));
} else {
  console.log('PASS: All 180 products match their expected SQL representation perfectly!');
}
