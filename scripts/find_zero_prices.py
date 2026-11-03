import re

with open('src/data/products.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Match each object { code: '...', ... }
# Let's split on "  {\n    code:"
chunks = content.split("    code:")
no_price = []
has_price = []

for c in chunks[1:]:
    # first line or quotes is the code
    code_match = re.match(r"\s*['\"]([^'\"]+)['\"]", c)
    if not code_match:
        continue
    code = code_match.group(1)

    name_match = re.search(r"name:\s*['\"]([^'\"]+)['\"]", c)
    name = name_match.group(1) if name_match else 'Desconocido'

    marca_match = re.search(r"marca:\s*['\"]([^'\"]+)['\"]", c)
    marca = marca_match.group(1) if marca_match else 'Tynor'

    price_match = re.search(r"price:\s*([0-9\.]+)", c)
    price = float(price_match.group(1)) if price_match else 0.0

    cat_match = re.search(r"cat:\s*['\"]([^'\"]+)['\"]", c)
    cat = cat_match.group(1) if cat_match else ''

    if price == 0.0:
        no_price.append((code, name, marca, cat))
    else:
        has_price.append((code, name, marca, price))

print(f"Total productos con precio: {len(has_price)}")
print(f"Total productos SIN PRECIO: {len(no_price)}")
print("\n--- LISTA DE PRODUCTOS SIN PRECIO (Precio: $0.00 / Sin cotizar) ---")
for code, name, marca, cat in no_price:
    print(f"- Código: {code:8} | Marca: {marca:10} | Categoría: {cat:15} | Nombre: {name}")

