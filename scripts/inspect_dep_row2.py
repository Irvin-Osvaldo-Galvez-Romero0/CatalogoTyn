import json

with open('c:/Users/User/Documents/GitHub/CatalogoTyn/scripts/raw_words.json', 'r', encoding='utf-8') as f:
    raw_data = json.load(f)

# Deportiva p.1 y=290-360
words_dep = [w for w in raw_data['LISTA DE PRECIOS TYNOR DEPORTIVA 2026.pdf'][0]['words'] if 290 <= w['y'] <= 360]
for w in sorted(words_dep, key=lambda w: (w['y'], w['x'])):
    print(f"dep: {w['text']} x={w['x']} y={w['y']}")
