import json

with open('src/data/products.js', 'r', encoding='utf-8') as f:
    orig_content = f.read()

prefix = orig_content[:orig_content.index('export const PRODUCTS = [')]

# Extract current products JSON
json_start = orig_content.index('export const PRODUCTS = [') + len('export const PRODUCTS = ')
json_str = orig_content[json_start:].strip()
if json_str.endswith(';'):
    json_str = json_str[:-1]

products = json.loads(json_str)

new_colors_map = {
    'H14': [{'id': 'AMARILLO', 'name': 'Amarillo', 'hex': '#EAB308', 'border': '#CA8A04'}],
    'H15': [{'id': 'ROJO', 'name': 'Rojo', 'hex': '#EF4444', 'border': '#DC2626'}],
    'H16': [{'id': 'VERDE', 'name': 'Verde', 'hex': '#22C55E', 'border': '#16A34A'}],
    'H17': [{'id': 'AZUL', 'name': 'Azul', 'hex': '#3B82F6', 'border': '#2563EB'}],
    'H18': [{'id': 'GRIS', 'name': 'Gris', 'hex': '#64748B', 'border': '#475569'}],
    'L28': [{'id': 'PLATA', 'name': 'Plata', 'hex': '#CBD5E1', 'border': '#94A3B8'}],
    'L35': [{'id': 'CROMADO', 'name': 'Cromado', 'hex': '#CBD5E1', 'border': '#94A3B8'}],
    'L37': [{'id': 'PLATA', 'name': 'Plata', 'hex': '#CBD5E1', 'border': '#94A3B8'}],
}

added_count = 0
untouched_count = 0

for p in products:
    code = p['code']
    if p.get('colors') and len(p['colors']) > 0:
        untouched_count += 1
        # DO NOT MODIFY: preserve 100% as requested
        continue
    if code in new_colors_map:
        p['colors'] = new_colors_map[code]
        added_count += 1

print(f"Untouched existing products with colors: {untouched_count}")
print(f"Newly added colors: {added_count}")
total_with_colors = sum(1 for p in products if p.get('colors'))
print(f"Total products now with colors: {total_with_colors}/180")

# Write back to src/data/products.js
new_products_js = json.dumps(products, ensure_ascii=False, indent=2)
final_js = prefix + "export const PRODUCTS = " + new_products_js + ";\n"

with open('src/data/products.js', 'w', encoding='utf-8') as f:
    f.write(final_js)

print("Saved updated src/data/products.js successfully!")
