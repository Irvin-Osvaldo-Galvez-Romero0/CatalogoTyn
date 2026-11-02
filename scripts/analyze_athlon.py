import json
import re

with open('c:/Users/User/Documents/GitHub/CatalogoTyn/scripts/raw_words.json', 'r', encoding='utf-8') as f:
    raw_data = json.load(f)

# Inspect ATHLON
pages = raw_data['LISTA DE PRECIOS TYNOR ATHLON 2026.pdf']
for p_data in pages:
    print(f"=== ATHLON PAGE {p_data['page']} ===")
    words = p_data['words']
    for w in sorted(words, key=lambda item: (item['y'], item['x'])):
        if re.search(r'\$|[A-Z]{2}\d+|\d{3}|CH|M|G|XL|UNITALLA', w['text'], re.IGNORECASE):
            print(f"y={w['y']:<6} x={w['x']:<6} {w['text']}")

