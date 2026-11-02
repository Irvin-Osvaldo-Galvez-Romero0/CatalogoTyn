import json

with open('c:/Users/User/Documents/GitHub/CatalogoTyn/scripts/raw_words.json', 'r', encoding='utf-8') as f:
    raw_data = json.load(f)

# Look at p.6 of Ortopedia around x=179.7, y=329.8
p6_words = raw_data['LISTA DE PRECIOS TYNOR ORTOPEDIA 2026. .pdf'][5]['words']
nearby = [w for w in p6_words if 150 <= w['x'] <= 220 and 310 <= w['y'] <= 420]
for w in sorted(nearby, key=lambda w: (w['y'], w['x'])):
    print(f"{w['text']} (x={w['x']}, y={w['y']})")

