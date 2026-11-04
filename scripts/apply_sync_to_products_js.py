import json
import re

with open('src/data/products.js', 'r', encoding='utf-8') as f:
    orig_content = f.read()

# Load updated sizes and prices
with open('scripts/all_synced_products_preview.json', 'r', encoding='utf-8') as f:
    synced = json.load(f)

synced_by_code = {p['code']: p for p in synced}

# Split file into header (before export const PRODUCTS = [) and JSON array
prefix = orig_content[:orig_content.index('export const PRODUCTS = [')]

# Load catalog via temp_products.json to get exact objects
with open('temp_products.json', 'r', encoding='utf-8') as f:
    products = json.load(f)

for p in products:
    code = p['code']
    if code in synced_by_code:
        info = synced_by_code[code]
        p['sizes'] = info['sizes']
        if info['price'] is not None:
            p['price'] = info['price']
        if info['priceBySize'] is not None:
            p['priceBySize'] = info['priceBySize']

# Format nicely into JS
new_products_js = json.dumps(products, ensure_ascii=False, indent=2)

final_js = prefix + "export const PRODUCTS = " + new_products_js + ";\n"

with open('src/data/products.js', 'w', encoding='utf-8') as f:
    f.write(final_js)

print("Updated src/data/products.js successfully!")
