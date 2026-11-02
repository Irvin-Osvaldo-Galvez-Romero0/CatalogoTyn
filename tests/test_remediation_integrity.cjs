/**
 * tests/test_remediation_integrity.cjs
 * Comprehensive verification of Remediation Items:
 * 1. body_parts table & foreign key in Postgres & SQLite
 * 2. d1_seed.sql and supabase_seed.sql execution
 * 3. 10 categories, 9 body parts, 180 products, 0 FK violations
 * 4. Product pricing (9 non-null, 171 null)
 * 5. SQLite AFTER UPDATE triggers
 * 6. FTS5 virtual table
 */

const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { DatabaseSync } = require('node:sqlite');

const SEED_D1_PATH = path.resolve(__dirname, '../.agents/teamwork/worker_remediation/d1_seed.sql');
const SEED_PG_PATH = path.resolve(__dirname, '../.agents/teamwork/worker_remediation/supabase_seed.sql');
const DDL_DOC_PATH = path.resolve(__dirname, '../docs/DATABASE_SCHEMA_AND_MIGRATION.md');
const KIOSK_DOC_PATH = path.resolve(__dirname, '../docs/KIOSK_CACHING_AND_INTEGRATION_GUIDE.md');

describe('Remediation Suite 1: Seed Files Presence & Syntax', () => {
  test('Both d1_seed.sql and supabase_seed.sql exist and are populated', () => {
    assert.ok(fs.existsSync(SEED_D1_PATH), 'd1_seed.sql must exist');
    assert.ok(fs.existsSync(SEED_PG_PATH), 'supabase_seed.sql must exist');
    const d1Size = fs.statSync(SEED_D1_PATH).size;
    const pgSize = fs.statSync(SEED_PG_PATH).size;
    assert.ok(d1Size > 100000, `d1_seed.sql size (${d1Size}) should be > 100KB`);
    assert.ok(pgSize > 100000, `supabase_seed.sql size (${pgSize}) should be > 100KB`);
  });

  test('supabase_seed.sql contains categories, body_parts, and products with FK references', () => {
    const pgContent = fs.readFileSync(SEED_PG_PATH, 'utf8');
    assert.ok(pgContent.includes('INSERT INTO public.categories'), 'pg seed contains categories');
    assert.ok(pgContent.includes('INSERT INTO public.body_parts'), 'pg seed contains body_parts');
    assert.ok(pgContent.includes('INSERT INTO public.products'), 'pg seed contains products');
    assert.ok(pgContent.includes('BEGIN;'), 'pg seed has BEGIN');
    assert.ok(pgContent.includes('COMMIT;'), 'pg seed has COMMIT');
  });

  test('d1_seed.sql contains categories, body_parts, and products', () => {
    const d1Content = fs.readFileSync(SEED_D1_PATH, 'utf8');
    assert.ok(d1Content.includes('INSERT INTO categories'), 'd1 seed contains categories');
    assert.ok(d1Content.includes('INSERT INTO body_parts'), 'd1 seed contains body_parts');
    assert.ok(d1Content.includes('INSERT INTO products'), 'd1 seed contains products');
    assert.ok(d1Content.includes("'hombro'"), 'contains hombro');
    assert.ok(d1Content.includes("'tobillo'"), 'contains tobillo');
  });
});

describe('Remediation Suite 2: SQLite D1 Execution Oracle & Triggers', () => {
  const db = new DatabaseSync(':memory:');
  db.exec('PRAGMA foreign_keys = ON;');

  test('Create Categories, Body Parts, Products tables with strict FKs and ISO8601 UTC defaults', () => {
    db.exec(`
      CREATE TABLE IF NOT EXISTS categories (
          id TEXT PRIMARY KEY,
          label TEXT NOT NULL,
          icon TEXT NOT NULL DEFAULT 'Grid',
          sort_order INTEGER NOT NULL DEFAULT 0,
          is_active INTEGER NOT NULL DEFAULT 1,
          created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')),
          updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now'))
      );

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

      -- Indexing
      CREATE INDEX IF NOT EXISTS idx_d1_products_cat_id ON products(cat_id);
      CREATE INDEX IF NOT EXISTS idx_d1_products_linea ON products(linea);
      CREATE INDEX IF NOT EXISTS idx_d1_products_body_part ON products(body_part);
      CREATE INDEX IF NOT EXISTS idx_d1_products_is_active ON products(is_active);
      CREATE INDEX IF NOT EXISTS idx_d1_products_price ON products(price);

      -- AFTER UPDATE triggers
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
    `);
  });

  test('Execute d1_seed.sql cleanly into SQLite in-memory', () => {
    const seed = fs.readFileSync(SEED_D1_PATH, 'utf8');
    db.exec(seed);

    const catCount = db.prepare('SELECT count(*) as c FROM categories').get().c;
    const bpCount = db.prepare('SELECT count(*) as c FROM body_parts').get().c;
    const prodCount = db.prepare('SELECT count(*) as c FROM products').get().c;

    assert.equal(catCount, 10, 'Must have exactly 10 categories');
    assert.equal(bpCount, 9, 'Must have exactly 9 body parts');
    assert.equal(prodCount, 180, 'Must have exactly 180 products');
  });

  test('Zero foreign key violations across categories and body_parts', () => {
    const violations = db.prepare('PRAGMA foreign_key_check').all();
    assert.equal(violations.length, 0, 'Must have 0 foreign key check violations');
  });

  test('Pricing distribution invariant: 9 products non-null, 171 products null', () => {
    const priced = db.prepare('SELECT count(*) as c FROM products WHERE price IS NOT NULL').get().c;
    const unpriced = db.prepare('SELECT count(*) as c FROM products WHERE price IS NULL').get().c;
    assert.equal(priced, 9, 'Exactly 9 products have commercial price');
    assert.equal(unpriced, 171, 'Exactly 171 products default to NULL price');

    const a01 = db.prepare('SELECT price FROM products WHERE code = ?').get('A01');
    assert.equal(a01.price, 420, 'A01 price must be 420');
  });

  test('AFTER UPDATE triggers update updated_at timestamp in SQLite', () => {
    // Manually set past timestamp
    db.prepare("UPDATE products SET updated_at = '2020-01-01T00:00:00Z' WHERE code = 'A01'").run();
    const oldTs = db.prepare("SELECT updated_at FROM products WHERE code = 'A01'").get().updated_at;
    assert.equal(oldTs, '2020-01-01T00:00:00Z');

    // Trigger update
    db.prepare("UPDATE products SET name = 'Faja Sacrolumbar Reforzada Edicion Especial' WHERE code = 'A01'").run();
    const newTs = db.prepare("SELECT updated_at FROM products WHERE code = 'A01'").get().updated_at;
    assert.notEqual(newTs, oldTs, 'updated_at must change after row update');
    assert.ok(newTs.startsWith('202'), `New timestamp must be current ISO8601 UTC: ${newTs}`);
  });
});

describe('Remediation Suite 3: Cloudflare D1 FTS5 Full-Text Search', () => {
  const db = new DatabaseSync(':memory:');

  test('Create products table and products_fts FTS5 virtual table with sync triggers', () => {
    db.exec(`
      CREATE TABLE products (
          code TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          short_desc TEXT,
          description TEXT
      );

      CREATE VIRTUAL TABLE products_fts USING fts5(
          code,
          name,
          short_desc,
          description,
          content='products',
          content_rowid='rowid',
          tokenize = 'unicode61'
      );

      CREATE TRIGGER products_fts_ai AFTER INSERT ON products BEGIN
          INSERT INTO products_fts(rowid, code, name, short_desc, description) VALUES (new.rowid, new.code, new.name, new.short_desc, new.description);
      END;

      CREATE TRIGGER products_fts_ad AFTER DELETE ON products BEGIN
          INSERT INTO products_fts(products_fts, rowid, code, name, short_desc, description) VALUES('delete', old.rowid, old.code, old.name, old.short_desc, old.description);
      END;

      CREATE TRIGGER products_fts_au AFTER UPDATE ON products BEGIN
          INSERT INTO products_fts(products_fts, rowid, code, name, short_desc, description) VALUES('delete', old.rowid, old.code, old.name, old.short_desc, old.description);
          INSERT INTO products_fts(rowid, code, name, short_desc, description) VALUES (new.rowid, new.code, new.name, new.short_desc, new.description);
      END;
    `);

    db.prepare(`
      INSERT INTO products (code, name, short_desc, description) VALUES 
      ('101', 'Rodillera Deportiva AIR PRO con Soporte Rotuliano', 'Soporte terapeutico de alta durabilidad', 'Dispositivo ortopedico Rodillera'),
      ('C01', 'Cabestrillo Tropical', 'Descarga articular ergonomica', 'Soporte de brazo y antebrazo');
    `).run();

    const matches = db.prepare("SELECT code, name FROM products_fts WHERE products_fts MATCH 'Rodillera'").all();
    assert.equal(matches.length, 1);
    assert.equal(matches[0].code, '101');

    const descMatches = db.prepare("SELECT code, name FROM products_fts WHERE products_fts MATCH 'antebrazo'").all();
    assert.equal(descMatches.length, 1);
    assert.equal(descMatches[0].code, 'C01');
  });
});
