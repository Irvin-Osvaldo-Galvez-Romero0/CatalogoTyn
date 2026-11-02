import json, re

with open('c:/Users/User/Documents/GitHub/CatalogoTyn/scripts/raw_words.json', 'r', encoding='utf-8') as f:
    raw_data = json.load(f)

# Let's inspect page words grouped by columns (x) and rows (y)
# In Tynor Ortopedia, there are 6 columns per page!
# Let's see the x positions of the columns in Ortopedia:
ort_words = raw_data['LISTA DE PRECIOS TYNOR ORTOPEDIA 2026. .pdf'][0]['words']
# Find codes on page 1
codes_p1 = [w for w in ort_words if re.match(r'^[A-Z]\d{2}$', w['text'])]
for c in codes_p1:
    print(f"Code {c['text']} at x={c['x']}, y={c['y']}")
