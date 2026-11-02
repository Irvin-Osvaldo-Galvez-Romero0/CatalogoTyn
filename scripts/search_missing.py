import json

with open('c:/Users/User/Documents/GitHub/CatalogoTyn/scripts/raw_words.json', 'r', encoding='utf-8') as f:
    raw_data = json.load(f)

targets = ['108', '414', '706', '911', 'D53', 'I70', 'I83', 'K13', 'L21']

for tgt in targets:
    print(f"=== Searching for {tgt} ===")
    found = False
    for pdf_name, pages in raw_data.items():
        for p in pages:
            for w in p['words']:
                if tgt.lower() in w['text'].lower():
                    print(f"  Found in {pdf_name} p.{p['page']}: {w['text']} at x={w['x']}, y={w['y']}")
                    found = True
    if not found:
        print(f"  NOT found in any PDF text")

