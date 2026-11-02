import json
import re

with open('c:/Users/User/Documents/GitHub/CatalogoTyn/scripts/raw_words.json', 'r', encoding='utf-8') as f:
    raw_data = json.load(f)

# Load 180 products
with open('c:/Users/User/Documents/GitHub/CatalogoTyn/src/data/products.js', 'r', encoding='utf-8') as f:
    prod_text = f.read()

products_180_codes = re.findall(r'"code":\s*"([^"]+)"', prod_text)
print(f"Products in products.js: {len(products_180_codes)}")

# Let's inspect each PDF to extract blocks:
# A block in the catalog typically has:
# - Code (e.g., A01, 101, etc.)
# - Description / Name
# - Sizes + Prices: e.g. "CH|M|G $344", "XL|XXL $392" or "UNITALLA $285"
# Or a single price.
