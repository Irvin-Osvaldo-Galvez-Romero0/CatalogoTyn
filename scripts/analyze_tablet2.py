with open('scripts/tablet2_000003.log', 'rb') as f:
    raw = f.read()

print(f"Total bytes en tablet 2: {len(raw)}")

text_utf16 = raw.decode('utf-16le', errors='ignore')
text_utf8 = raw.decode('utf-8', errors='ignore')

# Buscar términos clave
for term in ['pending_leads', 'tynor', 'lead', 'prospecto', 'edgar', 'elizabeth', 'saul', 'gabriel', 'ricardo', 'armando', 'sandra', 'ramon']:
    c16 = text_utf16.lower().count(term)
    c8 = text_utf8.lower().count(term)
    print(f"Termino '{term}': UTF-16LE={c16}, UTF-8={c8}")

# Buscar ocurrencias de pending_leads
idx = 0
needle = 'pending_leads'.encode('utf-16le')
while True:
    pos = raw.find(needle, idx)
    if pos == -1:
        break
    print(f"\n>>> Encontrado 'pending_leads' en byte {pos}:")
    chunk = raw[pos-20 : pos+2000]
    print(chunk.decode('utf-16le', errors='replace').encode('ascii', errors='backslashreplace').decode('ascii'))
    idx = pos + len(needle)

# Extraer todos los objetos JSON en el archivo
import re
print("\n--- Buscando JSONs en UTF-16LE ---")
json_matches = re.findall(r'\[\{.*?\}\]', text_utf16)
print(f"JSON arrays encontrados: {len(json_matches)}")
for j in json_matches:
    print("Array:", j[:300].encode('ascii', errors='backslashreplace').decode('ascii'))

# Extraer asesores
print("\n--- Asesor en tablet 2 ---")
for line in text_utf16.split('\n'):
    if 'sales_rep' in line:
        print("Sales rep line:", line.encode('ascii', errors='backslashreplace').decode('ascii'))

