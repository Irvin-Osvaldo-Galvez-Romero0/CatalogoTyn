import json

with open('c:/Users/User/Documents/GitHub/CatalogoTyn/scripts/accurate_price_map.json', 'r', encoding='utf-8') as f:
    price_map = json.load(f)

with open('c:/Users/User/Documents/GitHub/CatalogoTyn/src/data/products.js', 'r', encoding='utf-8') as f:
    text = f.read()

start_idx = text.find('export const PRODUCTS = [')
end_idx = text.rfind('];')
products = json.loads(text[start_idx + len('export const PRODUCTS = '):end_idx + 1])

updated_count = 0
for p in products:
    code = p['code']
    if code in price_map:
        info = price_map[code]
        p['price'] = info['base_price']
        if info['price_by_size']:
            p['priceBySize'] = info['price_by_size']
        updated_count += 1
    else:
        # Default price if null
        p['price'] = None

print(f"Updated {updated_count} products with real prices and size breakdown!")

# Replace back into products.js
new_products_json = json.dumps(products, ensure_ascii=False, indent=2)
new_text = text[:start_idx + len('export const PRODUCTS = ')] + new_products_json + text[end_idx + 1:]

with open('c:/Users/User/Documents/GitHub/CatalogoTyn/src/data/products.js', 'w', encoding='utf-8') as f:
    f.write(new_text)

print("Updated src/data/products.js successfully.")
