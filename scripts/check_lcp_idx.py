import re

with open('src/data/products.js', 'r', encoding='utf-8') as f:
    text = f.read()

codes = re.findall(r'code:\s*[\'"]([^\'"]+)[\'"]', text)
seen = []
for c in codes:
    if c not in seen:
        seen.append(c)

# If sorted alphabetically/numerically
sorted_codes = sorted(seen, key=lambda x: str(x))

print("Original order first 10:", seen[:10])
print("Position of '108' in original:", seen.index('108') if '108' in seen else -1)
print("Sorted order first 10:", sorted_codes[:10])
print("Position of '108' in sorted:", sorted_codes.index('108') if '108' in sorted_codes else -1)

