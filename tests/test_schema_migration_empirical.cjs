/**
 * tests/test_schema_migration_empirical.cjs
 * Empirical adversarial verification suite for Supabase & SQLite schema and migration.
 * Verifies 1:1 data fidelity, SQL escaping, constraints, JSONB integrity, and SQLite execution.
 */

const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { DatabaseSync } = require('node:sqlite');

const { PRODUCTS, CATEGORIES, BODY_PARTS } = require('../src/data/products.js');
const SEED_PATH = path.resolve(__dirname, '../.agents/teamwork/worker_deliverables/supabase_seed.sql');
const DDL_DOC_PATH = path.resolve(__dirname, '../docs/DATABASE_SCHEMA_AND_MIGRATION.md');

// Helper to parse SQL string literals, numbers, booleans, and JSONB from an SQL VALUES tuple
function parseSqlTuple(tupleStr) {
  // tupleStr is like "('101', 'Name', 'cat', NULL, 0, ...)"
  const trimmed = tupleStr.trim().replace(/^\(/, '').replace(/\)$/, '');
  const tokens = [];
  let current = '';
  let inString = false;
  let inJsonb = false;
  let i = 0;

  while (i < trimmed.length) {
    const ch = trimmed[i];

    if (!inString && ch === "'") {
      inString = true;
      current += ch;
      i++;
      continue;
    }

    if (inString && ch === "'") {
      if (trimmed[i + 1] === "'") {
        // Escaped single quote
        current += "''";
        i += 2;
        continue;
      } else {
        // End of string literal
        inString = false;
        current += ch;
        i++;
        // Check if immediately followed by ::jsonb
        if (trimmed.slice(i, i + 7) === '::jsonb') {
          current += '::jsonb';
          i += 7;
        }
        continue;
      }
    }

    if (!inString && ch === ',') {
      tokens.push(current.trim());
      current = '';
      i++;
      continue;
    }

    current += ch;
    i++;
  }
  if (current.trim()) {
    tokens.push(current.trim());
  }

  // Convert tokens into raw JS values
  return tokens.map(token => {
    if (token === 'NULL') return null;
    if (token === 'true') return true;
    if (token === 'false') return false;
    if (/^-?\d+(\.\d+)?$/.test(token)) return Number(token);

    if (token.endsWith('::jsonb')) {
      const innerStr = token.slice(1, token.length - 8).replace(/''/g, "'");
      return { isJsonb: true, raw: innerStr, parsed: JSON.parse(innerStr) };
    }

    if (token.startsWith("'") && token.endsWith("'")) {
      return token.slice(1, -1).replace(/''/g, "'");
    }

    return token;
  });
}

// Read seed file
const seedContent = fs.readFileSync(SEED_PATH, 'utf8');

describe('Suite 1: Seed File Structure and Statement Counts', () => {
  test('supabase_seed.sql exists, is non-empty, and wraps execution in a transaction', () => {
    assert.ok(seedContent.length > 50000, 'Seed file should be > 50KB');
    assert.ok(seedContent.includes('BEGIN;'), 'Seed must begin transaction with BEGIN;');
    assert.ok(seedContent.includes('COMMIT;'), 'Seed must commit transaction with COMMIT;');
  });

  test('supabase_seed.sql contains exactly 10 categories in INSERT statement', () => {
    const catMatch = seedContent.match(/INSERT INTO public\.categories\s*\([^)]+\)\s*VALUES\s*([\s\S]+?)\s*ON CONFLICT/);
    assert.ok(catMatch, 'Must contain INSERT INTO public.categories VALUES ... ON CONFLICT');
    const catRows = catMatch[1].trim().split(/\r?\n/).map(l => l.trim()).filter(l => l.startsWith('('));
    assert.equal(catRows.length, 10, `Expected 10 category rows, got ${catRows.length}`);
  });

  test('supabase_seed.sql contains exactly 180 products in INSERT statement', () => {
    const prodMatch = seedContent.match(/INSERT INTO public\.products\s*\([\s\S]+?\)\s*VALUES\s*([\s\S]+?)\s*ON CONFLICT/);
    assert.ok(prodMatch, 'Must contain INSERT INTO public.products VALUES ... ON CONFLICT');
    const prodRows = prodMatch[1].trim().split(/\r?\n/).map(l => l.trim()).filter(l => l.startsWith('('));
    assert.equal(prodRows.length, 180, `Expected 180 product rows, got ${prodRows.length}`);
  });

  test('All 9 anatomical body parts are represented across the product seed rows', () => {
    const prodMatch = seedContent.match(/INSERT INTO public\.products\s*\([\s\S]+?\)\s*VALUES\s*([\s\S]+?)\s*ON CONFLICT/);
    const prodRows = prodMatch[1].trim().split(/\r?\n/).map(l => l.trim().replace(/,$/, '')).filter(l => l.startsWith('('));
    const bodyPartsFound = new Set();
    
    for (const row of prodRows) {
      const tokens = parseSqlTuple(row);
      // Index 5 is body_part: code(0), name(1), cat_id(2), price(3), stock(4), body_part(5)
      bodyPartsFound.add(tokens[5]);
    }

    const expectedBodyParts = BODY_PARTS.map(b => b.id);
    assert.equal(bodyPartsFound.size, 9, `Expected 9 distinct body parts, got ${bodyPartsFound.size}`);
    for (const expected of expectedBodyParts) {
      assert.ok(bodyPartsFound.has(expected), `Expected body part '${expected}' to be in seed rows`);
    }
  });
});

describe('Suite 2: 1:1 Product Data Oracle Verification', () => {
  const prodMatch = seedContent.match(/INSERT INTO public\.products\s*\([\s\S]+?\)\s*VALUES\s*([\s\S]+?)\s*ON CONFLICT/);
  const prodRows = prodMatch[1].trim().split(/\r?\n/).map(l => l.trim().replace(/,$/, '')).filter(l => l.startsWith('('));

  const parsedProducts = prodRows.map(row => {
    const t = parseSqlTuple(row);
    assert.equal(t.length, 21, `Expected 21 columns in row, got ${t.length}: ${row.slice(0, 50)}...`);
    return {
      code: t[0],
      name: t[1],
      cat_id: t[2],
      price: t[3],
      stock: t[4],
      body_part: t[5],
      badge: t[6],
      linea: t[7],
      sizes: t[8].parsed,
      colors: t[9].parsed,
      has_pdf: t[10],
      has_video: t[11],
      short_desc: t[12],
      description: t[13],
      uses: t[14].parsed,
      features: t[15].parsed,
      image_thumb_url: t[16],
      image_detail_url: t[17],
      pdf_url: t[18],
      video_url: t[19],
      is_active: t[20]
    };
  });

  const parsedMap = new Map(parsedProducts.map(p => [p.code, p]));

  test('Every product in src/data/products.js exists in the seed script with exact code', () => {
    assert.equal(PRODUCTS.length, 180);
    assert.equal(parsedProducts.length, 180);
    for (const src of PRODUCTS) {
      assert.ok(parsedMap.has(src.code), `Product ${src.code} missing from seed SQL`);
    }
  });

  test('All commercial & clinical attributes match 1:1 between products.js and seed SQL', () => {
    for (const src of PRODUCTS) {
      const sql = parsedMap.get(src.code);
      assert.equal(sql.name, src.name, `Name mismatch on ${src.code}`);
      assert.equal(sql.cat_id, src.cat, `Category mismatch on ${src.code}`);
      assert.equal(sql.price, src.price, `Price mismatch on ${src.code}`);
      assert.equal(sql.stock, 0, `Initial stock should be 0 on ${src.code}`);
      assert.equal(sql.body_part, src.bodyPart, `Body part mismatch on ${src.code}`);
      assert.equal(sql.badge, src.badge || null, `Badge mismatch on ${src.code}`);
      assert.equal(sql.linea, src.linea, `Linea mismatch on ${src.code}`);
      assert.deepEqual(sql.sizes, src.sizes || [], `Sizes mismatch on ${src.code}`);
      assert.deepEqual(sql.colors, src.colors || [], `Colors mismatch on ${src.code}`);
      assert.equal(sql.has_pdf, Boolean(src.hasPdf), `hasPdf mismatch on ${src.code}`);
      assert.equal(sql.has_video, Boolean(src.hasVideo), `hasVideo mismatch on ${src.code}`);
      assert.equal(sql.short_desc, src.shortDesc || null, `shortDesc mismatch on ${src.code}`);
      assert.equal(sql.description, src.desc || null, `desc mismatch on ${src.code}`);
      assert.deepEqual(sql.uses, src.uses || [], `uses mismatch on ${src.code}`);
      assert.deepEqual(sql.features, src.features || [], `features mismatch on ${src.code}`);
      assert.equal(sql.is_active, true, `is_active mismatch on ${src.code}`);
    }
  });

  test('All media CDN URLs conform strictly to architecture specification', () => {
    for (const src of PRODUCTS) {
      const sql = parsedMap.get(src.code);
      assert.equal(sql.image_thumb_url, `https://media.tynorcatalog.com/images/thumb/${src.code}.webp`);
      assert.equal(sql.image_detail_url, `https://media.tynorcatalog.com/images/detail/${src.code}.webp`);

      if (src.hasPdf) {
        assert.equal(sql.pdf_url, `https://media.tynorcatalog.com/pdf/${src.code}.pdf`);
      } else {
        assert.equal(sql.pdf_url, null);
      }

      if (src.hasVideo) {
        assert.equal(sql.video_url, `https://media.tynorcatalog.com/video/${src.code}.mp4`);
      } else {
        assert.equal(sql.video_url, null);
      }
    }
  });
});

describe('Suite 3: SQL Safety, Constraints, and Escaping', () => {
  test('No single quotes break SQL string literal boundaries', () => {
    // Check that inside every string literal in seedContent, any internal single quote is doubled
    const lines = seedContent.split(/\r?\n/);
    for (let lineNo = 0; lineNo < lines.length; lineNo++) {
      const line = lines[lineNo].trim();
      if (!line.startsWith('(')) continue;

      let inString = false;
      let i = 0;
      while (i < line.length) {
        if (line[i] === "'") {
          if (!inString) {
            inString = true;
            i++;
          } else {
            if (line[i + 1] === "'") {
              // Properly escaped quote
              i += 2;
            } else {
              // Close quote
              inString = false;
              i++;
            }
          }
        } else {
          i++;
        }
      }
      assert.equal(inString, false, `Unterminated string literal on line ${lineNo + 1}: ${line.slice(0, 80)}`);
    }
  });

  test('All NOT NULL schema constraints are satisfied by seed records', () => {
    const prodMatch = seedContent.match(/INSERT INTO public\.products\s*\([\s\S]+?\)\s*VALUES\s*([\s\S]+?)\s*ON CONFLICT/);
    const prodRows = prodMatch[1].trim().split(/\r?\n/).map(l => l.trim().replace(/,$/, '')).filter(l => l.startsWith('('));

    for (const row of prodRows) {
      const t = parseSqlTuple(row);
      // code
      assert.ok(t[0] !== null && t[0] !== '', `code cannot be null/empty`);
      // name
      assert.ok(t[1] !== null && t[1] !== '', `name cannot be null/empty: ${t[0]}`);
      // cat_id
      assert.ok(t[2] !== null && t[2] !== '', `cat_id cannot be null/empty: ${t[0]}`);
      // stock
      assert.ok(t[4] !== null && t[4] >= 0, `stock cannot be null or negative: ${t[0]}`);
      // body_part
      assert.ok(t[5] !== null && t[5] !== '', `body_part cannot be null/empty: ${t[0]}`);
      // linea
      assert.ok(t[7] !== null && ['ORTOPEDIA', 'Deportiva', 'REHABILITACION'].includes(t[7]), `Invalid linea: ${t[7]} on ${t[0]}`);
      // sizes (JSONB)
      assert.ok(t[8] && t[8].isJsonb && Array.isArray(t[8].parsed), `sizes must be JSONB array: ${t[0]}`);
      // colors (JSONB)
      assert.ok(t[9] && t[9].isJsonb && Array.isArray(t[9].parsed), `colors must be JSONB array: ${t[0]}`);
      // has_pdf
      assert.equal(typeof t[10], 'boolean', `has_pdf must be boolean: ${t[0]}`);
      // has_video
      assert.equal(typeof t[11], 'boolean', `has_video must be boolean: ${t[0]}`);
      // uses (JSONB)
      assert.ok(t[14] && t[14].isJsonb && Array.isArray(t[14].parsed), `uses must be JSONB array: ${t[0]}`);
      // features (JSONB)
      assert.ok(t[15] && t[15].isJsonb && Array.isArray(t[15].parsed), `features must be JSONB array: ${t[0]}`);
      // image_thumb_url
      assert.ok(t[16] !== null && t[16].startsWith('https://'), `image_thumb_url required: ${t[0]}`);
      // image_detail_url
      assert.ok(t[17] !== null && t[17].startsWith('https://'), `image_detail_url required: ${t[0]}`);
      // is_active
      assert.equal(t[20], true, `is_active must be true: ${t[0]}`);
    }
  });

  test('All foreign keys map to existing valid category IDs', () => {
    const validCatIds = new Set(CATEGORIES.map(c => c.id));
    const prodMatch = seedContent.match(/INSERT INTO public\.products\s*\([\s\S]+?\)\s*VALUES\s*([\s\S]+?)\s*ON CONFLICT/);
    const prodRows = prodMatch[1].trim().split(/\r?\n/).map(l => l.trim().replace(/,$/, '')).filter(l => l.startsWith('('));

    for (const row of prodRows) {
      const t = parseSqlTuple(row);
      const catId = t[2];
      assert.ok(validCatIds.has(catId), `Foreign key violation: cat_id '${catId}' for product '${t[0]}' does not exist in categories`);
    }
  });
});

describe('Suite 4: In-Memory SQLite Execution Oracle (Cloudflare D1 & Relational Verification)', () => {
  const db = new DatabaseSync(':memory:');

  test('Executes D1 DDL statements from documentation', () => {
    db.exec('PRAGMA foreign_keys = ON;');

    // Create categories
    db.exec(`
      CREATE TABLE categories (
        id TEXT PRIMARY KEY,
        label TEXT NOT NULL,
        icon TEXT NOT NULL DEFAULT 'Grid',
        sort_order INTEGER NOT NULL DEFAULT 0,
        is_active INTEGER NOT NULL DEFAULT 1,
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        updated_at TEXT NOT NULL DEFAULT (datetime('now'))
      );
    `);

    // Create products
    db.exec(`
      CREATE TABLE products (
        code TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        cat_id TEXT NOT NULL REFERENCES categories(id) ON UPDATE CASCADE ON DELETE RESTRICT,
        price REAL CHECK (price IS NULL OR price >= 0),
        stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
        body_part TEXT NOT NULL,
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
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        updated_at TEXT NOT NULL DEFAULT (datetime('now'))
      );
    `);

    // Indexes
    db.exec(`
      CREATE INDEX idx_d1_products_cat_id ON products(cat_id);
      CREATE INDEX idx_d1_products_linea ON products(linea);
      CREATE INDEX idx_d1_products_body_part ON products(body_part);
      CREATE INDEX idx_d1_products_is_active ON products(is_active);
      CREATE INDEX idx_d1_products_price ON products(price);
    `);
  });

  test('Inserts categories and 180 products into SQLite database without error', () => {
    // Insert categories
    const insertCatStmt = db.prepare(`
      INSERT INTO categories (id, label, icon, sort_order) VALUES (?, ?, ?, ?)
    `);
    for (let i = 0; i < CATEGORIES.length; i++) {
      const c = CATEGORIES[i];
      insertCatStmt.run(c.id, c.label, c.icon, (i + 1) * 10);
    }

    // Insert products adapted from parseSqlTuple
    const prodMatch = seedContent.match(/INSERT INTO public\.products\s*\([\s\S]+?\)\s*VALUES\s*([\s\S]+?)\s*ON CONFLICT/);
    const prodRows = prodMatch[1].trim().split(/\r?\n/).map(l => l.trim().replace(/,$/, '')).filter(l => l.startsWith('('));

    const insertProdStmt = db.prepare(`
      INSERT INTO products (
        code, name, cat_id, price, stock, body_part, badge, linea,
        sizes, colors, has_pdf, has_video, short_desc, description, uses, features,
        image_thumb_url, image_detail_url, pdf_url, video_url, is_active
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const row of prodRows) {
      const t = parseSqlTuple(row);
      insertProdStmt.run(
        t[0],
        t[1],
        t[2],
        t[3],
        t[4],
        t[5],
        t[6],
        t[7],
        t[8].raw,
        t[9].raw,
        t[10] ? 1 : 0,
        t[11] ? 1 : 0,
        t[12],
        t[13],
        t[14].raw,
        t[15].raw,
        t[16],
        t[17],
        t[18],
        t[19],
        t[20] ? 1 : 0
      );
    }
  });

  test('Verification Query 1: Total Product Count is exactly 180', () => {
    const row = db.prepare('SELECT count(*) AS total FROM products;').get();
    assert.equal(row.total, 180);
  });

  test('Verification Query 2: Line Distribution is 132 ORTOPEDIA, 27 Deportiva, 21 REHABILITACION', () => {
    const rows = db.prepare('SELECT linea, count(*) AS count FROM products GROUP BY linea ORDER BY count DESC;').all();
    const map = Object.fromEntries(rows.map(r => [r.linea, r.count]));
    assert.equal(map['ORTOPEDIA'], 132);
    assert.equal(map['Deportiva'], 27);
    assert.equal(map['REHABILITACION'], 21);
  });

  test('Verification Query 3: Categories Count and Foreign Key Integrity', () => {
    const catCount = db.prepare('SELECT count(*) AS total FROM categories;').get();
    assert.equal(catCount.total, 10);

    const fkCheck = db.prepare('PRAGMA foreign_key_check;').all();
    assert.equal(fkCheck.length, 0, `Foreign key violations found: ${JSON.stringify(fkCheck)}`);
  });

  test('Verification Query 4: Media Asset Completeness (172 PDFs, 1 Video, 180 Images)', () => {
    const row = db.prepare(`
      SELECT 
        count(CASE WHEN has_pdf = 1 THEN 1 END) AS products_with_pdf,
        count(CASE WHEN pdf_url IS NOT NULL THEN 1 END) AS valid_pdf_urls,
        count(CASE WHEN has_video = 1 THEN 1 END) AS products_with_video,
        count(CASE WHEN video_url IS NOT NULL THEN 1 END) AS valid_video_urls,
        count(CASE WHEN image_thumb_url IS NOT NULL THEN 1 END) AS valid_thumb_urls,
        count(CASE WHEN image_detail_url IS NOT NULL THEN 1 END) AS valid_detail_urls
      FROM products;
    `).get();

    assert.equal(row.products_with_pdf, 172);
    assert.equal(row.valid_pdf_urls, 172);
    assert.equal(row.products_with_video, 1);
    assert.equal(row.valid_video_urls, 1);
    assert.equal(row.valid_thumb_urls, 180);
    assert.equal(row.valid_detail_urls, 180);
  });

  test('Verification Query 5: Anatomical Body Parts Coverage across 9 regions', () => {
    const rows = db.prepare('SELECT DISTINCT body_part FROM products ORDER BY body_part ASC;').all();
    assert.equal(rows.length, 9);
    const bodyParts = rows.map(r => r.body_part);
    assert.deepEqual(bodyParts.sort(), [
      'brazo', 'clavicula', 'cuello', 'espalda', 'hombro', 'mano', 'pierna', 'rodilla', 'tobillo'
    ].sort());
  });
});
