import json

with open('c:/Users/User/Documents/GitHub/CatalogoTyn/scripts/full_parsed_prices.json', 'r', encoding='utf-8') as f:
    full_prices = json.load(f)

# Inspect first 10
for k, v in list(full_prices.items())[:15]:
    print(f"Code {k}: default={v['default_price']}, by_size={v['prices_by_size']}")
    print(f"   raw: {v['raw']}")

