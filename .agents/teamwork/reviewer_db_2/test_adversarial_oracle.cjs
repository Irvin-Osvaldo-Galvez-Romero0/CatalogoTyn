const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const { DatabaseSync } = require('node:sqlite');
const fs = require('node:fs');
const path = require('node:path');

const SEED_D1_PATH = path.resolve(__dirname, '../worker_remediation/d1_seed.sql');
const SEED_PG_PATH = path.resolve(__dirname, '../worker_remediation/supabase_seed.sql');

describe('Adversarial Oracle 1: SQLite FTS5 Full Lifecycle', () => {
  const db = new DatabaseSync(':memory:');
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

  test('FTS5 correctly syncs INSERT', () => {
    db.prepare("INSERT INTO products (code, name, short_desc, description) VALUES ('101', 'Rodillera Rotuliana', 'Desc corta', 'Desc clinica')").run();
    const rows = db.prepare("SELECT code, name FROM products_fts WHERE products_fts MATCH 'Rotuliana'").all();
    assert.equal(rows.length, 1);
    assert.equal(rows[0].code, '101');
  });

  test('FTS5 correctly syncs UPDATE', () => {
    db.prepare("UPDATE products SET name = 'Tobillera Reforzada' WHERE code = '101'").run();
    const oldRows = db.prepare("SELECT code, name FROM products_fts WHERE products_fts MATCH 'Rotuliana'").all();
    assert.equal(oldRows.length, 0, 'Old term must not match after update');
    const newRows = db.prepare("SELECT code, name FROM products_fts WHERE products_fts MATCH 'Tobillera'").all();
    assert.equal(newRows.length, 1, 'New term must match after update');
  });

  test('FTS5 correctly syncs DELETE', () => {
    db.prepare("DELETE FROM products WHERE code = '101'").run();
    const rows = db.prepare("SELECT code, name FROM products_fts WHERE products_fts MATCH 'Tobillera'").all();
    assert.equal(rows.length, 0, 'Term must not match after delete');
  });
});

describe('Adversarial Oracle 2: Trigger Loop Prevention and Timestamps', () => {
  const db = new DatabaseSync(':memory:');
  db.exec(`
    CREATE TABLE categories (
        id TEXT PRIMARY KEY,
        label TEXT NOT NULL,
        updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now'))
    );

    CREATE TRIGGER trigger_categories_updated_at
    AFTER UPDATE ON categories FOR EACH ROW
    WHEN NEW.updated_at = OLD.updated_at
    BEGIN
        UPDATE categories SET updated_at = (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')) WHERE id = NEW.id;
    END;
  `);

  test('Trigger updates timestamp on row change without infinite recursion', () => {
    db.prepare("INSERT INTO categories (id, label, updated_at) VALUES ('c1', 'Cat 1', '2020-01-01T00:00:00Z')").run();
    
    // Update label (updated_at does not change in the UPDATE statement itself, so WHEN condition fires)
    db.prepare("UPDATE categories SET label = 'Cat 1 Renamed' WHERE id = 'c1'").run();
    
    const row = db.prepare("SELECT updated_at FROM categories WHERE id = 'c1'").get();
    assert.notEqual(row.updated_at, '2020-01-01T00:00:00Z');
    assert.ok(row.updated_at.startsWith('202'));
  });

  test('Manual updated_at modification does NOT re-trigger', () => {
    // If an application sets updated_at explicitly to a new value, WHEN NEW.updated_at = OLD.updated_at evaluates to FALSE
    db.prepare("UPDATE categories SET updated_at = '2025-05-05T12:00:00Z' WHERE id = 'c1'").run();
    const row = db.prepare("SELECT updated_at FROM categories WHERE id = 'c1'").get();
    assert.equal(row.updated_at, '2025-05-05T12:00:00Z');
  });
});

describe('Adversarial Oracle 3: Full Seed Execution & Integrity in SQLite', () => {
  const db = new DatabaseSync(':memory:');
  db.exec('PRAGMA foreign_keys = ON;');

  test('Full schema and d1_seed.sql execution', () => {
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
    `);

    const seed = fs.readFileSync(SEED_D1_PATH, 'utf8');
    db.exec(seed);

    // Foreign key check
    const fkViolations = db.prepare('PRAGMA foreign_key_check').all();
    assert.equal(fkViolations.length, 0, 'Zero FK violations');

    // Counts
    const cats = db.prepare('SELECT count(*) as c FROM categories').get().c;
    const bps = db.prepare('SELECT count(*) as c FROM body_parts').get().c;
    const prods = db.prepare('SELECT count(*) as c FROM products').get().c;
    assert.equal(cats, 10);
    assert.equal(bps, 9);
    assert.equal(prods, 180);

    // ISO 8601 UTC regex check on created_at and updated_at
    const sample = db.prepare('SELECT created_at, updated_at FROM products LIMIT 5').all();
    const isoUtcRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/;
    for (const s of sample) {
      assert.ok(isoUtcRegex.test(s.created_at), `created_at ${s.created_at} must be ISO8601 UTC`);
      assert.ok(isoUtcRegex.test(s.updated_at), `updated_at ${s.updated_at} must be ISO8601 UTC`);
    }
  });
});
