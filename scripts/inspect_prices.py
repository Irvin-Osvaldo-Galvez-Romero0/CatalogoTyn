import pdfplumber
import os

base = r'c:\Users\User\Documents\GitHub\CatalogoTyn\MasFichas\PRECIOS'
files = [
    'LISTA DE PRECIOS TYNOR ATHLON 2026.pdf',
    'LISTA DE PRECIOS TYNOR DEPORTIVA 2026.pdf',
    'LISTA DE PRECIOS TYNOR MEDIVARIC 2026.pdf',
    'LISTA DE PRECIOS TYNOR ORTOPEDIA 2026. .pdf'
]

for fname in files:
    path = os.path.join(base, fname)
    with pdfplumber.open(path) as pdf:
        print(f"=== {fname} ({len(pdf.pages)} pages) ===")
        page = pdf.pages[0]
        words = page.extract_words()
        print(f"Total words on page 1: {len(words)}")
        for w in words[:25]:
            print(f"  {w['text']} [x={w['x0']:.1f}, y={w['top']:.1f}]")
