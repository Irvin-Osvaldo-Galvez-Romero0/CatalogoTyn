import json
import re

with open('c:/Users/User/Documents/GitHub/CatalogoTyn/scripts/raw_words.json', 'r', encoding='utf-8') as f:
    raw_data = json.load(f)

# Inspect ORTOPEDIA
pages = raw_data['LISTA DE PRECIOS TYNOR ORTOPEDIA 2026. .pdf']
for p_data in pages:
    print(f"=== ORTOPEDIA PAGE {p_data['page']} ===")
    words = p_data['words']
    for w in sorted(words, key=lambda item: (item['y'], item['x'])):
        # match codes like A01, B02, C03, D04, E05, etc. or $ prices
        if re.search(r'\$|^[A-Z]\d{2}$|^[A-Z]\d{2}[A-Z]$|CH|M|G|XL|UNITALLA', w['text'], re.IGNORECASE):
            print(f"y={w['y']:<6} x={w['x']:<6} {w['text']}")
