import json
import re

with open('c:/Users/User/Documents/GitHub/CatalogoTyn/src/data/products.js', 'r', encoding='utf-8') as f:
    prod_text = f.read()

# Load all product objects
# Quick parse of product blocks
products_json_start = prod_text.find('export const PRODUCTS = [')
# Let's extract json-like content
# Or parse via JS / regex
prod_matches = re.findall(r'\{\s*"code":\s*"([^"]+)",\s*"name":\s*"([^"]+)"', prod_text)
print(f"Parsed {len(prod_matches)} products.")
for code, name in prod_matches:
    print(f"{code}: {name}")
