import json

with open('c:/Users/User/Documents/GitHub/CatalogoTyn/scripts/raw_words.json', 'r', encoding='utf-8') as f:
    raw_data = json.load(f)

# Ortopedia p.3 y=310-360
words_p3 = [w for w in raw_data['LISTA DE PRECIOS TYNOR ORTOPEDIA 2026. .pdf'][2]['words'] if 300 <= w['y'] <= 370]
for w in sorted(words_p3, key=lambda w: (w['y'], w['x'])):
    print(f"p3: {w['text']} x={w['x']} y={w['y']}")

# Ortopedia p.2 y=640-700
words_p2 = [w for w in raw_data['LISTA DE PRECIOS TYNOR ORTOPEDIA 2026. .pdf'][1]['words'] if 640 <= w['y'] <= 700]
for w in sorted(words_p2, key=lambda w: (w['y'], w['x'])):
    print(f"p2: {w['text']} x={w['x']} y={w['y']}")

