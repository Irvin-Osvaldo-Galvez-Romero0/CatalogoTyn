import json
import re

with open('c:/Users/User/Documents/GitHub/CatalogoTyn/scripts/raw_words.json', 'r', encoding='utf-8') as f:
    raw_data = json.load(f)

# Let's inspect products.js to see what codes we currently have
with open('c:/Users/User/Documents/GitHub/CatalogoTyn/src/data/products.js', 'r', encoding='utf-8') as f:
    prod_text = f.read()

# Match all codes in products.js
prod_codes = re.findall(r'"code":\s*"([^"]+)"', prod_text)
print(f"Total products in products.js: {len(prod_codes)}")
print(f"Sample codes: {prod_codes[:20]}")
