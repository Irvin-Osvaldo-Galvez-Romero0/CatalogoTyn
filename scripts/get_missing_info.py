import re

with open('c:/Users/User/Documents/GitHub/CatalogoTyn/src/data/products.js', 'r', encoding='utf-8') as f:
    text = f.read()

codes = ['108', '414', '706', '911', 'D53', 'I70', 'I83', 'K13', 'L21']
for c in codes:
    pattern = r'\{\s*"code":\s*"' + c + r'",\s*"name":\s*"([^"]+)",\s*"cat":\s*"([^"]+)"'
    m = re.search(pattern, text)
    if m:
        print(f"Code {c}: {m.group(1)} (cat: {m.group(2)})")
