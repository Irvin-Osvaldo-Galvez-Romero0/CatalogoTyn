import json, re

with open('c:/Users/User/Documents/GitHub/CatalogoTyn/scripts/extracted_catalog_prices.json', 'r', encoding='utf-8') as f:
    prices_map = json.load(f)

with open('c:/Users/User/Documents/GitHub/CatalogoTyn/src/data/products.js', 'r', encoding='utf-8') as f:
    prod_text = f.read()

prod_codes = re.findall(r'"code":\s*"([^"]+)"', prod_text)

matched = []
missing = []

for c in prod_codes:
    if c in prices_map:
        matched.append((c, prices_map[c]))
    else:
        # try without leading zeros or with prefix
        missing.append(c)

print(f"Matched: {len(matched)} / {len(prod_codes)}")
print(f"Missing count: {len(missing)}")
print(f"Missing codes: {missing}")

# Sample matched
for c, data in matched[:15]:
    print(f"{c}: default=${data['default_price']}, by_size={data['prices_by_size']}")
