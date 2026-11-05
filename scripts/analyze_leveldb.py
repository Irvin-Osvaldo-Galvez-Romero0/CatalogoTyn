with open('scripts/tablet_000003.log', 'rb') as f:
    raw = f.read()

print(f"Total bytes: {len(raw)}")

# Decodificar buscando caracteres UTF-16 LE
# Convertir bytes a texto ignorando nulos comunes de UTF-16
text_utf8 = raw.decode('utf-8', errors='ignore')
text_utf16 = raw.decode('utf-16le', errors='ignore')

# Combinar busquedas
for term in ['tynor', 'saul', 'ramon', 'sahiba', 'gabriel', 'ricardo', 'armando', 'sandra', 'lead', 'prospecto', 'interes', 'pending']:
    c8 = text_utf8.lower().count(term)
    c16 = text_utf16.lower().count(term)
    print(f"Termino '{term}': UTF-8={c8}, UTF-16LE={c16}")

# Extraer todas las cadenas UTF-16LE de longitud >= 4
import re
utf16_strings = re.findall(r'[\x20-\x7E\u00C0-\u017F]{4,}', text_utf16)
print(f"\nTotal cadenas extraidas en UTF-16LE: {len(utf16_strings)}")
for s in utf16_strings[:40]:
    if any(k in s.lower() for k in ['tynor', 'saul', 'interes', 'lead', '101', 'a04', 'ramon', 'sahiba']):
        print(f"  -> {s}")

# Buscar cadenas UTF-8
utf8_strings = re.findall(r'[\x20-\x7E\u00C0-\u017F]{4,}', text_utf8)
print(f"\nTotal cadenas extraidas en UTF-8: {len(utf8_strings)}")
for s in utf8_strings:
    if any(k in s.lower() for k in ['tynor', 'saul', 'interes', 'lead', '101', 'a04', 'ramon', 'sahiba', 'prospecto']):
        print(f"  -> {s}")
