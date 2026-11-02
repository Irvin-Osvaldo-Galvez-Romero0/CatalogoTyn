import json
import re

with open('c:/Users/User/Documents/GitHub/CatalogoTyn/scripts/raw_words.json', 'r', encoding='utf-8') as f:
    raw_data = json.load(f)

# Inspect MEDIVARIC
pages = raw_data['LISTA DE PRECIOS TYNOR MEDIVARIC 2026.pdf']
for p_data in pages:
    print(f"=== MEDIVARIC PAGE {p_data['page']} ===")
    words = p_data['words']
    for w in sorted(words, key=lambda item: (item['y'], item['x'])):
        if re.search(r'\$|\d{4}|CH|M|G|XL|UNITALLA', w['text'], re.IGNORECASE):
            print(f"y={w['y']:<6} x={w['x']:<6} {w['text']}")
