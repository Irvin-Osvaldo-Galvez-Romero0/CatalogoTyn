import json, re

with open('c:/Users/User/Documents/GitHub/CatalogoTyn/scripts/raw_words.json', 'r', encoding='utf-8') as f:
    raw_data = json.load(f)

# The columns on page 1 are roughly separated by boundaries:
# x center: 111.3, 185.0, 258.6, 332.3, 406.0, 479.7
# Column bounds:
# col 0: [70, 148]
# col 1: [148, 222]
# col 2: [222, 295]
# col 3: [295, 369]
# col 4: [369, 443]
# col 5: [443, 530]

# Rows are around y=212, 330, 447, 558, 662
# Let's inspect all items in col 0 between y=200 and y=325:
ort_p1 = raw_data['LISTA DE PRECIOS TYNOR ORTOPEDIA 2026. .pdf'][0]['words']

for r_start, r_end in [(200, 320), (320, 440), (440, 550), (550, 655), (655, 760)]:
    cell_words = [w for w in ort_p1 if 70 <= w['x'] < 148 and r_start <= w['y'] < r_end]
    print(f"--- Cell (col 0, y {r_start}-{r_end}) ---")
    sorted_words = sorted(cell_words, key=lambda w: (w['y'], w['x']))
    for w in sorted_words:
        print(f"  {w['text']} (x={w['x']}, y={w['y']})")

