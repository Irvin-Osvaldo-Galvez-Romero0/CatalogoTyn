import json
import re
import pdfplumber

def parse_all_ortopedia_cards():
    col_bounds = [
        (75, 148),
        (148, 222),
        (222, 296),
        (296, 370),
        (370, 444),
        (444, 530),
    ]
    
    cards = {}
    with pdfplumber.open("MasFichas/PRECIOS/LISTA DE PRECIOS TYNOR ORTOPEDIA 2026. .pdf") as pdf:
        for p_idx, page in enumerate(pdf.pages):
            words = page.extract_words()
            
            # Find codes
            code_pattern = r'^(?:[A-L]\d{2}[A-Za-z]?|[A-Z]{2,5}\d{0,4}|\d{3}\s+[A-Z]+)$'
            code_words = []
            for w in words:
                txt = w['text'].strip()
                if 170 < w['top'] < 750:
                    if re.match(r'^[A-L]\d{2}[A-Za-z]?$', txt) or txt in ['IHDO', 'FS899', 'FS20A', 'ER150', 'L12A']:
                        code_words.append(w)
            
            # Cluster code words into rows
            rows_by_top = []
            for cw in code_words:
                top = cw['top']
                found = False
                for r in rows_by_top:
                    if abs(r['avg_top'] - top) < 25:
                        r['words'].append(cw)
                        r['avg_top'] = sum(w['top'] for w in r['words']) / len(r['words'])
                        found = True
                        break
                if not found:
                    rows_by_top.append({'avg_top': top, 'words': [cw]})
            
            rows_by_top.sort(key=lambda r: r['avg_top'])
            for r_idx, r in enumerate(rows_by_top):
                y_start = r['avg_top'] - 8
                y_end = rows_by_top[r_idx + 1]['avg_top'] - 8 if r_idx + 1 < len(rows_by_top) else 760
                
                for col_idx, (xmin, xmax) in enumerate(col_bounds):
                    cw = [w for w in words if xmin <= w['x0'] < xmax and y_start <= w['top'] < y_end]
                    if not cw: continue
                    
                    # Group words into horizontal lines
                    lines = []
                    for w in cw:
                        found_l = False
                        for l in lines:
                            if abs(l['top'] - w['top']) < 3.0:
                                l['words'].append(w)
                                found_l = True
                                break
                        if not found_l:
                            lines.append({'top': w['top'], 'words': [w]})
                    
                    lines.sort(key=lambda l: l['top'])
                    line_texts = []
                    for l in lines:
                        l['words'].sort(key=lambda w: w['x0'])
                        line_texts.append(" ".join([w['text'] for w in l['words']]))
                    
                    if not line_texts: continue
                    
                    # Detect code
                    m = re.search(r'([A-L]\d{2}[A-Za-z]?|IHDO|FS899|FS20A|ER150|L12A)', line_texts[0])
                    if not m and len(line_texts) > 1:
                        m = re.search(r'([A-L]\d{2}[A-Za-z]?|IHDO|FS899|FS20A|ER150|L12A)', line_texts[1])
                    
                    if m:
                        code = m.group(1)
                        if code not in cards:
                            cards[code] = []
                        cards[code].append({
                            'page': p_idx + 1,
                            'lines': line_texts
                        })

    return cards

cards = parse_all_ortopedia_cards()
print(f"Parsed {len(cards)} Ortopedia product cards from PDF")

# Save to json for quick inspection
with open('scripts/ortopedia_cards.json', 'w', encoding='utf-8') as f:
    json.dump(cards, f, ensure_ascii=False, indent=2)
