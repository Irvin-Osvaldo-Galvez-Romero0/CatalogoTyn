import json, re

with open('c:/Users/User/Documents/GitHub/CatalogoTyn/scripts/raw_words.json', 'r', encoding='utf-8') as f:
    raw_data = json.load(f)

# Load the 180 products from products.js
with open('c:/Users/User/Documents/GitHub/CatalogoTyn/src/data/products.js', 'r', encoding='utf-8') as f:
    text = f.read()

start_idx = text.find('export const PRODUCTS = [')
end_idx = text.rfind('];')
products = json.loads(text[start_idx + len('export const PRODUCTS = '):end_idx + 1])

def clean_num(s):
    try:
        return float(re.sub(r'[^\d.]', '', s))
    except:
        return None

# Dictionary to hold final clean price mapping:
# code -> {
#    "price": float (base / default price),
#    "priceBySize": { "CH": 344, "M": 344, "G": 344, "XL": 392, "XXL": 392 },
#    "availableSizes": [...]
# }
final_prices = {}

# We will parse raw string of each cell
# For each product in products.js, let's find all occurrences in raw_words across all PDFs
for prod in products:
    code = prod['code']
    target_pattern = r'\b' + re.escape(code) + r'\b'
    
    # Collect all cells where this code is the header
    matched_cells = []
    
    for pdf_name, pages in raw_data.items():
        for p in pages:
            words = p['words']
            # Find code word
            matching_words = [w for w in words if re.match(r'^' + re.escape(code) + r'[NV]?$', w['text'])]
            for mw in matching_words:
                # filter out false positives: e.g. year 2026, 15-20
                if mw['text'] in ['2026', '15-20', '20-30', '8-15']:
                    continue
                # Take words in cell: x within [x-30, x+45], y within [y, y+110]
                cw = [w for w in words if (mw['x'] - 28) <= w['x'] <= (mw['x'] + 45) and mw['y'] <= w['y'] <= (mw['y'] + 115)]
                cw_sorted = sorted(cw, key=lambda w: (w['y'], w['x']))
                matched_cells.append({
                    'pdf': pdf_name,
                    'page': p['page'],
                    'words': cw_sorted,
                    'raw_text': " ".join([w['text'] for w in cw_sorted])
                })
                
    if not matched_cells:
        print(f"Product {code} ({prod['name']}) NOT found in matched cells.")
        continue
        
    # Pick the best cell (prefer non-pediatrico unless that's the only one, or highest word count)
    best_cell = None
    for c in matched_cells:
        # Check if it has prices ($)
        if any('$' in w['text'] for w in c['words']):
            if 'PEDIATRICO' in c['raw_text'] and len(matched_cells) > 1:
                continue
            best_cell = c
            break
    if not best_cell:
        best_cell = matched_cells[0]
        
    # Parse sizes and prices from best_cell['raw_text']
    # Example raw_texts:
    # "A01 SOPORTE ABDOMINAL CH|M|G $344 XL|XXL $392"
    # "A29 FAJA TRACCION LUMBAR REFORZADA CH - M $1,025 G - XL XXL - XXL $1,175"
    # "101 N RODILLERA DEPORTIVA AIR PRO CON SOPORTE ROTULIANO (PZA) NARANJA NEON CH|M|G|XL $185"
    # "104 N RODILLERA PARA HALTEROFILIA LEVANTAMIENTO PESAS (PAR) NARANJA NEON UNITALLA $285"
    raw_str = best_cell['raw_text']
    
    # Extract size-price chunks using regex:
    # Match patterns like: (CH\|M\|G\|XL|UNITALLA|XL\|XXL|CH|M|G|XL|XXL|XXXL|CR\|LG|REGULAR|PEDIATRICO)\s*\$([\d,]+)
    # Also handle multiple lines
    tokens = [w['text'] for w in best_cell['words']]
    
    price_by_size = {}
    base_price = None
    
    # Iterate through tokens looking for $
    for i, t in enumerate(tokens):
        if '$' in t:
            p_val = clean_num(t)
            if p_val is None:
                continue
            if base_price is None:
                base_price = p_val
                
            # Look backwards for size specification
            # Check token i-1, i-2, i-3
            size_found = []
            for back_idx in range(i - 1, max(-1, i - 4), -1):
                prev_tok = tokens[back_idx]
                if any(k in prev_tok for k in ['CH', 'M', 'G', 'XL', 'XXL', 'XXXL', 'UNITALLA', 'REGULAR', 'PEDIATRICO', 'PEDIATRICA']):
                    # Parse sizes from prev_tok
                    sub_sizes = re.split(r'[|\-,]', prev_tok)
                    size_found = [s.strip() for s in sub_sizes if s.strip()]
                    break
            
            if size_found:
                for sz in size_found:
                    price_by_size[sz] = p_val
            else:
                price_by_size['UNITALLA'] = p_val
                
    # If base_price is still None, try to find any $ in raw_str
    if base_price is None:
        m = re.search(r'\$([\d,]+)', raw_str)
        if m:
            base_price = clean_num(m.group(1))
            price_by_size['UNITALLA'] = base_price

    final_prices[code] = {
        'code': code,
        'name': prod['name'],
        'base_price': base_price,
        'price_by_size': price_by_size,
        'raw_text': raw_str
    }

print(f"Total processed: {len(final_prices)} / {len(products)}")
with open('c:/Users/User/Documents/GitHub/CatalogoTyn/scripts/parsed_final_prices.json', 'w', encoding='utf-8') as f:
    json.dump(final_prices, f, ensure_ascii=False, indent=2)

print("Saved parsed_final_prices.json")
