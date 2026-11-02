import json
import re

with open('c:/Users/User/Documents/GitHub/CatalogoTyn/scripts/raw_words.json', 'r', encoding='utf-8') as f:
    raw_data = json.load(f)

# Inspect DEPORTIVA
deportiva_pages = raw_data['LISTA DE PRECIOS TYNOR DEPORTIVA 2026.pdf']

for p_data in deportiva_pages:
    print(f"=== DEPORTIVA PAGE {p_data['page']} ===")
    words = p_data['words']
    # find all code-like tokens and dollar-like tokens
    for w in sorted(words, key=lambda item: (item['y'], item['x'])):
        if re.search(r'\$|\d{3}|CH|M|G|XL|UNITALLA', w['text'], re.IGNORECASE):
            print(f"y={w['y']:<6} x={w['x']:<6} {w['text']}")

