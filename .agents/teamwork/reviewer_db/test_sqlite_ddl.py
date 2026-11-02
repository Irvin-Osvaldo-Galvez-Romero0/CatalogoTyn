import sqlite3
import json

db = sqlite3.connect(":memory:")
db.execute("PRAGMA foreign_keys = ON;")

ddl = """
-- 1. Create Categories Table
CREATE TABLE IF NOT EXISTS categories (
    id TEXT PRIMARY KEY,
    label TEXT NOT NULL,
    icon TEXT NOT NULL DEFAULT 'Grid',
    sort_order INTEGER NOT NULL DEFAULT 0,
    is_active INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- 2. Create Products Table
CREATE TABLE IF NOT EXISTS products (
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

-- 3. High-Performance Query Indexes
CREATE INDEX IF NOT EXISTS idx_d1_products_cat_id ON products(cat_id);
CREATE INDEX IF NOT EXISTS idx_d1_products_linea ON products(linea);
CREATE INDEX IF NOT EXISTS idx_d1_products_body_part ON products(body_part);
CREATE INDEX IF NOT EXISTS idx_d1_products_is_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_d1_products_price ON products(price);
"""

try:
    db.executescript(ddl)
    print("DDL executescript successful!")
except Exception as e:
    print("DDL Failed:", e)

# Test 1: Insert category
try:
    db.execute("INSERT INTO categories (id, label) VALUES ('rodillera', 'Rodilleras');")
    print("Test 1 (Category insert): PASS")
except Exception as e:
    print("Test 1 FAIL:", e)

# Test 2: Insert product with valid JSON and data
try:
    db.execute("""
        INSERT INTO products (
            code, name, cat_id, price, stock, body_part, badge, linea,
            sizes, colors, has_pdf, has_video, short_desc, description, uses, features,
            image_thumb_url, image_detail_url, pdf_url, video_url, is_active
        ) VALUES (
            '101', 'Inmovilizador de Rodilla 19"', 'rodillera', NULL, 0, 'rodilla', 'ORTOPEDIA', 'ORTOPEDIA',
            '["CH", "M", "G", "XL"]', '[{"id": "N", "name": "Naranja", "hex": "#FF6B00"}]',
            1, 0, 'Inmovilizador rígido', 'Descripción completa', '["Esguinces"]', '["Aluminio"]',
            'https://cdn/thumb.webp', 'https://cdn/detail.webp', 'https://cdn/101.pdf', NULL, 1
        );
    """)
    print("Test 2 (Product insert): PASS")
except Exception as e:
    print("Test 2 FAIL:", e)

# Test 3: Foreign Key Constraint Violation (Invalid category)
try:
    db.execute("""
        INSERT INTO products (
            code, name, cat_id, price, stock, body_part, linea,
            image_thumb_url, image_detail_url
        ) VALUES (
            'ERR1', 'Bad Cat', 'nonexistent_cat', NULL, 0, 'rodilla', 'ORTOPEDIA',
            'thumb.webp', 'detail.webp'
        );
    """)
    print("Test 3 (FK Violation): FAILED TO REJECT!")
except sqlite3.IntegrityError as e:
    print("Test 3 (FK Violation properly rejected): PASS ->", e)

# Test 4: Invalid JSON in sizes
try:
    db.execute("""
        INSERT INTO products (
            code, name, cat_id, price, stock, body_part, linea, sizes,
            image_thumb_url, image_detail_url
        ) VALUES (
            'ERR2', 'Bad JSON', 'rodillera', NULL, 0, 'rodilla', 'ORTOPEDIA', 'not valid json',
            'thumb.webp', 'detail.webp'
        );
    """)
    print("Test 4 (Invalid JSON): FAILED TO REJECT!")
except sqlite3.IntegrityError as e:
    print("Test 4 (Invalid JSON properly rejected): PASS ->", e)

# Test 5: Check trigger for updated_at
cursor = db.execute("SELECT updated_at FROM products WHERE code = '101'")
print("Initial updated_at:", cursor.fetchone()[0])
db.execute("UPDATE products SET name = 'Updated Name' WHERE code = '101'")
cursor = db.execute("SELECT updated_at FROM products WHERE code = '101'")
print("After update updated_at:", cursor.fetchone()[0])
