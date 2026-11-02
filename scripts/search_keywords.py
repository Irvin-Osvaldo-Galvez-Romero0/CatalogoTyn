import json

with open('c:/Users/User/Documents/GitHub/CatalogoTyn/scripts/raw_words.json', 'r', encoding='utf-8') as f:
    raw_data = json.load(f)

# Search for substrings in words across all pdfs
keywords = [
    'subrotuliano', 'dedos', 'correa', 'camiseta', 'delgada', 'muleta', 'skipper', 'ajustable'
]

for kw in keywords:
    print(f"=== Keyword '{kw}' ===")
    for pdf_name, pages in raw_data.items():
        for p in pages:
            for w in p['words']:
                if kw in w['text'].lower():
                    print(f"  {pdf_name} p.{p['page']}: {w['text']} at x={w['x']}, y={w['y']}")

