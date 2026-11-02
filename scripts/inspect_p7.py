import json

with open('c:/Users/User/Documents/GitHub/CatalogoTyn/scripts/raw_words.json', 'r', encoding='utf-8') as f:
    raw_data = json.load(f)

# Ortopedia p.7 words
p7_words = raw_data['LISTA DE PRECIOS TYNOR ORTOPEDIA 2026. .pdf'][6]['words']
for w in sorted(p7_words, key=lambda w: (w['y'], w['x'])):
    print(f"p7: {w['text']} x={w['x']} y={w['y']}")

