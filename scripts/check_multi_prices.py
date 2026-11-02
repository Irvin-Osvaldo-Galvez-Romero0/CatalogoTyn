import json

with open('c:/Users/User/Documents/GitHub/CatalogoTyn/scripts/parsed_final_prices.json', 'r', encoding='utf-8') as f:
    prices = json.load(f)

# Check some multi-price products
test_codes = ['A01', 'A03', 'A04', 'A05', 'A06', 'A07', 'A08', 'A11', 'A29', 'A30', '101', '102', '103', '104', 'D01', 'D04', 'D06', 'D10', 'L07', 'L28', 'L35']

for c in test_codes:
    if c in prices:
        p = prices[c]
        print(f"[{c}] {p['name']}")
        print(f"  Base: ${p['base_price']}")
        print(f"  By Size: {p['price_by_size']}")
        print(f"  Raw: {p['raw_text']}")
        print()
