import json, re

with open('c:/Users/User/Documents/GitHub/CatalogoTyn/scripts/raw_words.json', 'r', encoding='utf-8') as f:
    raw_data = json.load(f)

# Load the 180 products
with open('c:/Users/User/Documents/GitHub/CatalogoTyn/src/data/products.js', 'r', encoding='utf-8') as f:
    text = f.read()

start_idx = text.find('export const PRODUCTS = [')
end_idx = text.rfind('];')
products = json.loads(text[start_idx + len('export const PRODUCTS = '):end_idx + 1])
prod_by_code = {p['code']: p for p in products}

# We want an exact parser for every cell in the 4 price PDFs:
# In each PDF:
# Every cell has:
# 1. Product code(s) (e.g. A01, 101 N, 101 V, CH106, 1113, etc.)
# 2. Product title / subtitle
# 3. Sizes & Prices:
#    e.g. "CH|M|G $344", "XL|XXL $392"
#    e.g. "UNITALLA $285"
#    e.g. "CH|M|G|XL $185"

results = {}

def parse_price_val(s):
    clean = re.sub(r'[^\d.]', '', s)
    try:
        return float(clean)
    except:
        return None

# Parse ORTOPEDIA
ort_pages = raw_data['LISTA DE PRECIOS TYNOR ORTOPEDIA 2026. .pdf']
# Page dimensions: roughly 595 x 842 pt
# 6 columns: centers ~ 111, 185, 258, 332, 406, 480
# column boundaries:
col_x_cuts = [70, 148, 222, 295, 369, 443, 530]

for p in ort_pages:
    p_num = p['page']
    words = p['words']
    
    # Group words into 6 vertical column slices
    for c_idx in range(6):
        min_x = col_x_cuts[c_idx]
        max_x = col_x_cuts[c_idx + 1]
        col_words = [w for w in words if min_x <= w['x'] < max_x]
        
        # In this column, find all code anchors:
        # Code pattern in Ortopedia: ^[A-Z]\d{2}[A-Z]?$ or special codes like L12A, FS899, etc.
        anchors = []
        for w in col_words:
            t = w['text'].strip()
            if re.match(r'^[A-Z]\d{2}[A-Z]?$', t) or t in ['L12A', 'IHDO', 'ER150', 'FS899', 'FS20A', '901']:
                # filter out 2026, MAS, IVA
                anchors.append(w)
        
        # Sort anchors by y
        anchors = sorted(anchors, key=lambda a: a['y'])
        
        for a_idx, anchor in enumerate(anchors):
            code_text = anchor['text']
            top_y = anchor['y'] - 5
            bot_y = anchors[a_idx + 1]['y'] - 5 if a_idx + 1 < len(anchors) else 750
            
            # Words in this cell
            cell_words = [w for w in col_words if top_y <= w['y'] < bot_y]
            cell_words_sorted = sorted(cell_words, key=lambda w: (w['y'], w['x']))
            
            # Extract prices and sizes
            # Pattern: pairs of size tokens and price tokens
            # Find all words with $
            dollar_words = [w for w in cell_words_sorted if '$' in w['text']]
            
            prices_by_size = {}
            default_price = None
            
            for dw in dollar_words:
                pval = parse_price_val(dw['text'])
                if pval is None:
                    continue
                if default_price is None:
                    default_price = pval
                    
                # Look for size token adjacent or above
                # Adjacent: within y +/- 8
                adj_sizes = [
                    w for w in cell_words_sorted 
                    if abs(w['y'] - dw['y']) <= 8 and w['x'] < dw['x'] and w != dw
                ]
                if not adj_sizes:
                    # Look slightly above (up to 18pt above)
                    adj_sizes = [
                        w for w in cell_words_sorted 
                        if 0 <= (dw['y'] - w['y']) <= 18 and w != dw and ('|' in w['text'] or w['text'] in ['CH', 'M', 'G', 'XL', 'XXL', 'XXXL', 'XXXXL', 'UNITALLA', 'REGULAR', 'PEDIATRICO', 'PEDIATRICA'])
                    ]
                
                if adj_sizes:
                    size_token = adj_sizes[-1]['text']
                    # split sizes
                    sizes = re.split(r'[|\-,]', size_token)
                    for s in sizes:
                        s_clean = s.strip()
                        if s_clean:
                            prices_by_size[s_clean] = pval
                else:
                    # If only 1 price and no size text found, or unitalla
                    prices_by_size['UNITALLA'] = pval
            
            results[code_text] = {
                'pdf': 'ORTOPEDIA',
                'page': p_num,
                'default_price': default_price,
                'prices_by_size': prices_by_size,
                'raw': " ".join([w['text'] for w in cell_words_sorted])
            }

print(f"Parsed {len(results)} items from ORTOPEDIA.")

# Parse DEPORTIVA
dep_pages = raw_data['LISTA DE PRECIOS TYNOR DEPORTIVA 2026.pdf']
# 6 columns: 101N, 101V, 102N, 102V, 103N, 103V ...
# col boundaries roughly same 6 columns!
for p in dep_pages:
    p_num = p['page']
    words = p['words']
    for c_idx in range(6):
        min_x = col_x_cuts[c_idx]
        max_x = col_x_cuts[c_idx + 1]
        col_words = [w for w in words if min_x <= w['x'] < max_x]
        
        anchors = []
        for w in col_words:
            t = w['text'].strip()
            if re.match(r'^\d{3}$', t):
                anchors.append(w)
        anchors = sorted(anchors, key=lambda a: a['y'])
        
        for a_idx, anchor in enumerate(anchors):
            code_text = anchor['text']
            top_y = anchor['y'] - 5
            bot_y = anchors[a_idx + 1]['y'] - 5 if a_idx + 1 < len(anchors) else 750
            
            cell_words = [w for w in col_words if top_y <= w['y'] < bot_y]
            cell_words_sorted = sorted(cell_words, key=lambda w: (w['y'], w['x']))
            
            dollar_words = [w for w in cell_words_sorted if '$' in w['text']]
            prices_by_size = {}
            default_price = None
            
            for dw in dollar_words:
                pval = parse_price_val(dw['text'])
                if pval is None: continue
                if default_price is None: default_price = pval
                
                adj_sizes = [
                    w for w in cell_words_sorted 
                    if abs(w['y'] - dw['y']) <= 8 and w['x'] < dw['x'] and w != dw
                ]
                if not adj_sizes:
                    adj_sizes = [
                        w for w in cell_words_sorted 
                        if 0 <= (dw['y'] - w['y']) <= 18 and w != dw and ('|' in w['text'] or w['text'] in ['CH', 'M', 'G', 'XL', 'XXL', 'UNITALLA'])
                    ]
                if adj_sizes:
                    size_token = adj_sizes[-1]['text']
                    sizes = re.split(r'[|\-,]', size_token)
                    for s in sizes:
                        s_clean = s.strip()
                        if s_clean:
                            prices_by_size[s_clean] = pval
                else:
                    prices_by_size['UNITALLA'] = pval
                    
            if code_text not in results or len(prices_by_size) > len(results[code_text].get('prices_by_size', {})):
                results[code_text] = {
                    'pdf': 'DEPORTIVA',
                    'page': p_num,
                    'default_price': default_price,
                    'prices_by_size': prices_by_size,
                    'raw': " ".join([w['text'] for w in cell_words_sorted])
                }

print(f"Total parsed with DEPORTIVA: {len(results)}")

with open('c:/Users/User/Documents/GitHub/CatalogoTyn/scripts/full_parsed_prices.json', 'w', encoding='utf-8') as f:
    json.dump(results, f, ensure_ascii=False, indent=2)

print("Saved full_parsed_prices.json")
