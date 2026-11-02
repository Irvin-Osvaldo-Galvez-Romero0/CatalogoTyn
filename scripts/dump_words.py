import pdfplumber
import os, json

base = r'c:\Users\User\Documents\GitHub\CatalogoTyn\MasFichas\PRECIOS'
files = [
    'LISTA DE PRECIOS TYNOR ATHLON 2026.pdf',
    'LISTA DE PRECIOS TYNOR DEPORTIVA 2026.pdf',
    'LISTA DE PRECIOS TYNOR MEDIVARIC 2026.pdf',
    'LISTA DE PRECIOS TYNOR ORTOPEDIA 2026. .pdf'
]

output = {}

for fname in files:
    path = os.path.join(base, fname)
    with pdfplumber.open(path) as pdf:
        all_pages_data = []
        for p_idx, page in enumerate(pdf.pages):
            words = page.extract_words()
            # Sort words by y (top), then x
            words_sorted = sorted(words, key=lambda w: (round(w['top'], -1), w['x0']))
            all_pages_data.append({
                'page': p_idx + 1,
                'words': [{'text': w['text'], 'x': round(w['x0'], 1), 'y': round(w['top'], 1)} for w in words]
            })
        output[fname] = all_pages_data

with open('c:/Users/User/Documents/GitHub/CatalogoTyn/scripts/raw_words.json', 'w', encoding='utf-8') as f:
    json.dump(output, f, ensure_ascii=False, indent=2)

print("Dumped raw_words.json successfully.")

