import sqlite3
import json
import re

# Read SQLite DDL from DATABASE_SCHEMA_AND_MIGRATION.md
with open('docs/DATABASE_SCHEMA_AND_MIGRATION.md', 'r', encoding='utf-8') as f:
    content = f.read()

# Extract SQLite DDL block
d1_ddl_match = re.search(r'```sql\n-- =+?\n-- Tynor Catalog: Cloudflare D1 SQLite Schema Specification.*?\n(.*?)```', content, re.DOTALL)
if not d1_ddl_match:
    print("FAILED to extract SQLite DDL from document")
    exit(1)

ddl = d1_ddl_match.group(1)

# Connect to in-memory SQLite
conn = sqlite3.connect(':memory:')
conn.execute("PRAGMA foreign_keys = ON;")
conn.executescript(ddl)

print("SQLite DDL executed successfully!")

# Now load products and categories from src/data/products.js
with open('src/data/products.js', 'r', encoding='utf-8') as f:
    js_data = f.read()

# Let's extract categories JSON/JS
import subprocess
result = subprocess.run(['node', '-e', '''
const { PRODUCTS, CATEGORIES } = require('./src/data/products.js');
console.log(JSON.stringify({ categories: CATEGORIES, products: PRODUCTS }));
'''], capture_output=True, text=True)

data = json.loads(result.stdout)
categories = data['categories']
products = data['products']

print(f"Loaded {len(categories)} categories and {len(products)} products from JS.")

cursor = conn.cursor()

# Insert Categories
for idx, cat in enumerate(categories):
    cursor.execute("""
        INSERT INTO categories (id, label, icon, sort_order)
        VALUES (?, ?, ?, ?)
    """, (cat['id'], cat['label'], cat['icon'], (idx + 1) * 10))

# Insert Products
for p in products:
    thumb_url = f"https://media.tynorcatalog.com/images/thumb/{p['code']}.webp"
    detail_url = f"https://media.tynorcatalog.com/images/detail/{p['code']}.webp"
    pdf_url = f"https://media.tynorcatalog.com/pdf/{p['code']}.pdf" if p.get('hasPdf') else None
    video_url = f"https://media.tynorcatalog.com/video/{p['code']}.mp4" if p.get('hasVideo') else None

    cursor.execute("""
        INSERT INTO products (
            code, name, cat_id, price, stock, body_part, badge, linea,
            sizes, colors, has_pdf, has_video, short_desc, description,
            uses, features, image_thumb_url, image_detail_url, pdf_url, video_url, is_active
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        p['code'],
        p['name'],
        p['cat'],
        p.get('price'),
        0,
        p['bodyPart'],
        p.get('badge'),
        p['linea'],
        json.dumps(p.get('sizes', [])),
        json.dumps(p.get('colors', [])),
        1 if p.get('hasPdf') else 0,
        1 if p.get('hasVideo') else 0,
        p.get('shortDesc'),
        p.get('desc'),
        json.dumps(p.get('uses', [])),
        json.dumps(p.get('features', [])),
        thumb_url,
        detail_url,
        pdf_url,
        video_url,
        1
    ))

conn.commit()

# Run SQL verification checks
cursor.execute("SELECT count(*) FROM categories")
cat_count = cursor.fetchone()[0]
cursor.execute("SELECT count(*) FROM products")
prod_count = cursor.fetchone()[0]

cursor.execute("SELECT linea, count(*) FROM products GROUP BY linea ORDER BY count(*) DESC")
linea_counts = dict(cursor.fetchall())

print(f"Verified in SQLite: {cat_count} categories, {prod_count} products.")
print(f"Verified line distribution: {linea_counts}")

assert cat_count == 10, f"Expected 10 categories, got {cat_count}"
assert prod_count == 180, f"Expected 180 products, got {prod_count}"
assert linea_counts == {'ORTOPEDIA': 132, 'Deportiva': 27, 'REHABILITACION': 21}, f"Unexpected distribution: {linea_counts}"

print("All SQLite relational schema integrity checks PASSED!")
