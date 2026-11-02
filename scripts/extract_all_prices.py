import json
import re

with open('c:/Users/User/Documents/GitHub/CatalogoTyn/scripts/raw_words.json', 'r', encoding='utf-8') as f:
    raw_data = json.load(f)

# PDF list
pdf_keys = [
    ('ORTOPEDIA', 'LISTA DE PRECIOS TYNOR ORTOPEDIA 2026. .pdf'),
    ('DEPORTIVA', 'LISTA DE PRECIOS TYNOR DEPORTIVA 2026.pdf'),
    ('ATHLON', 'LISTA DE PRECIOS TYNOR ATHLON 2026.pdf'),
    ('MEDIVARIC', 'LISTA DE PRECIOS TYNOR MEDIVARIC 2026.pdf')
]

col_boundaries = [70, 148, 222, 295, 369, 443, 530]
# rows on pages:
# Ortopedia typically has up to 5 rows of items per page:
# row approx tops: ~212, ~320, ~440, ~550, ~650
# But let's detect cells dynamically based on where codes appear!

catalog_extracted = {}

def parse_price(val_str):
    clean = re.sub(r'[^\d.]', '', val_str)
    try:
        return float(clean)
    except:
        return None

for label, fname in pdf_keys:
    pages = raw_data[fname]
    for p in pages:
        p_num = p['page']
        words = p['words']
        # Find all codes in this page
        # In Ortopedia: ^[A-Z]\d{2}[A-Z]?$
        # In Deportiva: ^(101|102|103|104|105|107|108|201|202|301|302|303|304|401|402|403|404|405|406|407|408|414|702|703|704|706|911)$
        # In Athlon: CH106, CA001, CA002, CDL300, CMO200, CMO203, CMO208, CMO209, CFP500, TVP300, TVP400
        # In Medivaric: 1113, 1111, 1129, 1123, 1223, 3723, 1723, 4313, 532G, 5323, 1122, 5222, 1121, 1221, 1127, 1233, 5232, 1437
        
        # General code regex:
        code_candidates = []
        for w in words:
            txt = w['text'].strip()
            # Check pattern
            if re.match(r'^[A-Z]\d{2}[A-Z]?$', txt) or re.match(r'^\d{3}[NV]?$', txt) or re.match(r'^(CH|CA|CDL|CMO|CFP|TVP)\d{3,4}$', txt) or re.match(r'^\d{4}[A-Z]?$', txt):
                # Filter out numbers that look like year 2026 or mmHg
                if txt not in ['2026', '15-20', '20-30', '8-15']:
                    code_candidates.append(w)
        
        # Sort candidates
        code_candidates = sorted(code_candidates, key=lambda w: (w['y'], w['x']))
        
        # For each code, find its bounding box or nearby words below it until next code
        for idx, code_w in enumerate(code_candidates):
            c_text = code_w['text']
            # Base code without N/V
            base_code = c_text
            if re.match(r'^\d{3}[NV]$', c_text):
                base_code = c_text[:3]
                
            cx = code_w['x']
            cy = code_w['y']
            
            # Find words that belong to this product cell:
            # roughly within [cx - 30, cx + 45] and [cy, cy + 115]
            cell_words = [
                w for w in words 
                if (cx - 28) <= w['x'] <= (cx + 45) and cy <= w['y'] <= (cy + 115)
            ]
            cell_words_sorted = sorted(cell_words, key=lambda w: (w['y'], w['x']))
            
            # Look for price pairs: e.g. "CH|M|G", "$344", "XL|XXL", "$392"
            prices_by_size = {}
            default_price = None
            
            # Find all dollar signs and words with $
            dollar_words = [w for w in cell_words_sorted if '$' in w['text']]
            
            for dw in dollar_words:
                price_val = parse_price(dw['text'])
                if price_val is None:
                    continue
                # Look for size text preceding dw (same y or slightly above/below)
                size_candidates = [
                    w for w in cell_words_sorted 
                    if abs(w['y'] - dw['y']) <= 8 and w['x'] < dw['x'] and w != dw
                ]
                if not size_candidates:
                    # check slightly above
                    size_candidates = [
                        w for w in cell_words_sorted 
                        if -15 <= (dw['y'] - w['y']) <= 0 and w != dw and ('|' in w['text'] or w['text'] in ['CH', 'M', 'G', 'XL', 'XXL', 'UNITALLA', 'REGULAR', 'PEDIATRICO'])
                    ]
                
                if size_candidates:
                    size_str = size_candidates[-1]['text']
                    # split sizes by | or -
                    sizes = re.split(r'[|\-,]', size_str)
                    for s in sizes:
                        s_clean = s.strip()
                        if s_clean:
                            prices_by_size[s_clean] = price_val
                if default_price is None:
                    default_price = price_val

            if base_code not in catalog_extracted or len(prices_by_size) > len(catalog_extracted[base_code].get('prices_by_size', {})):
                catalog_extracted[base_code] = {
                    'code': base_code,
                    'pdf': label,
                    'page': p_num,
                    'default_price': default_price,
                    'prices_by_size': prices_by_size,
                    'raw_cell': [w['text'] for w in cell_words_sorted]
                }

print(f"Total extracted codes from all PDFs: {len(catalog_extracted)}")
with open('c:/Users/User/Documents/GitHub/CatalogoTyn/scripts/extracted_catalog_prices.json', 'w', encoding='utf-8') as f:
    json.dump(catalog_extracted, f, ensure_ascii=False, indent=2)

print("Saved extracted_catalog_prices.json")
