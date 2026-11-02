import json, re

# Inspect all products in products.js to see which ones have price: null
with open('c:/Users/User/Documents/GitHub/CatalogoTyn/src/data/products.js', 'r', encoding='utf-8') as f:
    text = f.read()

# Let's write a python parser for products.js to load the products array accurately
# Find `export const PRODUCTS = [`
start_idx = text.find('export const PRODUCTS = [')
end_idx = text.rfind('];')
products_json_str = text[start_idx + len('export const PRODUCTS = '):end_idx + 1]

# In JS, it's valid JSON if keys and values are double quoted
# Let's test if json.loads works
try:
    products = json.loads(products_json_str)
    print(f"Successfully loaded {len(products)} products as JSON!")
except Exception as e:
    print(f"JSON load failed: {e}")

