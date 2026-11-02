import json, re

with open('c:/Users/User/Documents/GitHub/CatalogoTyn/scripts/raw_words.json', 'r', encoding='utf-8') as f:
    raw_data = json.load(f)

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

results = {}

for prod in products:
    code = prod['code']
    # search in raw_words
    matched_cells = []
    for pdf_name, pages in raw_data.items():
        for p in pages:
            words = p['words']
            matching = [w for w in words if re.match(r'^' + re.escape(code) + r'[NV]?$', w['text'])]
            for mw in matching:
                if mw['text'] in ['2026', '15-20', '20-30', '8-15']: continue
                cw = [w for w in words if (mw['x'] - 28) <= w['x'] <= (mw['x'] + 45) and mw['y'] <= w['y'] <= (mw['y'] + 115)]
                cw_sorted = sorted(cw, key=lambda w: (w['y'], w['x']))
                matched_cells.append({
                    'pdf': pdf_name,
                    'page': p['page'],
                    'words': cw_sorted,
                    'raw': " ".join([w['text'] for w in cw_sorted])
                })
                
    if not matched_cells:
        continue
        
    best = None
    for c in matched_cells:
        if any('$' in w['text'] for w in c['words']):
            if 'PEDIATRICO' in c['raw'] and len(matched_cells) > 1:
                continue
            best = c
            break
    if not best:
        best = matched_cells[0]
        
    words_list = best['words']
    raw_str = best['raw']
    
    # Parse pairs of (size_pattern, price)
    # Examples:
    # "CH|M|G $344 XL|XXL $392"
    # "CH|M|G|XL $474 XXL $516 XXXL $550 XXXXL $584"
    # "CH - M $1,025 G - XL XXL - XXL $1,175"
    # "UNITALLA $285"
    # "CH|M|G|XL $185"
    
    # Regex find all: ([A-Za-z0-9|,\- ]+?)\s*\$([\d,.]+)
    matches = re.findall(r'([A-Za-z0-9|/\- ]+?)\$([\d,]+(?:\.\d{2})?)', raw_str)
    
    prices_by_size = {}
    base_price = None
    
    for size_part, price_str in matches:
        pval = clean_num(price_str)
        if pval is None: continue
        if base_price is None: base_price = pval
        
        # Clean size_part: only look at trailing tokens that represent size
        s_tokens = size_part.strip().split()
        if not s_tokens:
            prices_by_size['UNITALLA'] = pval
            continue
            
        last_tok = s_tokens[-1]
        # check if last_tok or last two tokens are sizes
        # e.g. "CH - M", "G - XL", "XXL - XXL", "CH|M|G", "XL|XXL", "UNITALLA"
        size_cand = last_tok
        if len(s_tokens) >= 3 and s_tokens[-2] == '-' and s_tokens[-3] in ['CH', 'G', 'XXL']:
            size_cand = f"{s_tokens[-3]}-{s_tokens[-1]}"
            
        # Extract individual size codes
        parts = re.split(r'[|/,]', size_cand)
        valid_sizes = []
        for pt in parts:
            pt = pt.strip()
            if pt in ['CH', 'M', 'G', 'XL', 'XXL', 'XXXL', 'XXXXL', 'UNITALLA', 'REGULAR', 'PEDIATRICO', 'PEDIATRICA', 'CH-M', 'G-XL', 'XXL-XXL', 'PLATA', 'NEGRO']:
                valid_sizes.append(pt)
                
        if valid_sizes:
            for vs in valid_sizes:
                prices_by_size[vs] = pval
        else:
            if not prices_by_size:
                prices_by_size['UNITALLA'] = pval

    # If product has defined sizes in products.js, map composite sizes (like CH-M, G-XL) or apply base_price to missing
    prod_sizes = prod.get('sizes') or []
    if 'CH-M' in prices_by_size:
        p_val = prices_by_size.pop('CH-M')
        prices_by_size['CH'] = p_val
        prices_by_size['M'] = p_val
    if 'G-XL' in prices_by_size:
        p_val = prices_by_size.pop('G-XL')
        prices_by_size['G'] = p_val
        prices_by_size['XL'] = p_val
    if 'XXL-XXL' in prices_by_size:
        p_val = prices_by_size.pop('XXL-XXL')
        prices_by_size['XXL'] = p_val

    # Fill in sizes from prod['sizes'] if any is missing but fits in the base tier
    for sz in prod_sizes:
        if sz not in prices_by_size and base_price is not None:
            # If it's a standard size not explicitly in a higher tier, assign base_price
            prices_by_size[sz] = base_price

    results[code] = {
        'code': code,
        'base_price': base_price,
        'price_by_size': prices_by_size
    }

print(f"Mapped {len(results)} products.")

# Verify coverage of D06, A29, A05, etc.
for test_c in ['A01', 'A05', 'A11', 'A29', 'A30', 'D01', 'D04', 'D06', '101', '104', 'L07']:
    if test_c in results:
        print(f"{test_c}: base={results[test_c]['base_price']}, sizes={results[test_c]['price_by_size']}")

with open('c:/Users/User/Documents/GitHub/CatalogoTyn/scripts/accurate_price_map.json', 'w', encoding='utf-8') as f:
    json.dump(results, f, ensure_ascii=False, indent=2)

print("Saved accurate_price_map.json")

