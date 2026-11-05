import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('scripts/tablet3_000003.log', 'rb') as f:
    raw = f.read()

print(f"Total bytes en tablet 3: {len(raw)}")

text_utf16 = raw.decode('utf-16le', errors='ignore')
text_utf8 = raw.decode('utf-8', errors='ignore')

# Buscar términos clave
for term in ['pending_leads', 'tynor', 'lead', 'prospecto', 'edgar', 'elizabeth', 'saul', 'gabriel', 'ricardo', 'armando', 'sandra', 'ramon']:
    c16 = text_utf16.lower().count(term)
    c8 = text_utf8.lower().count(term)
    print(f"Termino '{term}': UTF-16LE={c16}, UTF-8={c8}")

# Buscar ocurrencias de sales_rep
import re
print("\n--- Sales rep y claves encontradas ---")
for line in text_utf16.split('\n'):
    for k in ['sales_rep', 'interest', 'theme', 'pending_leads']:
        if k in line:
            print(f"  [{k}] -> {line[:150]}")

# Buscar todos los JSON arrays
json_matches = re.findall(r'\[\{.*?\}\]', text_utf16)
print(f"\nJSON arrays encontrados: {len(json_matches)}")
for j in json_matches:
    print("Array:", j[:300])

# Extraer cualquier lead individual
lead_pattern = r'\{"nombre_completo":.*?"queued_at":".*?"\}'
leads = re.findall(lead_pattern, text_utf16)
print(f"Leads individuales encontrados: {len(leads)}")
for l in leads:
    print("Lead:", l)

