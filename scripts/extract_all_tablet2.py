import re
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('scripts/tablet2_000003.log', 'rb') as f:
    raw = f.read()

text = raw.decode('utf-16le', errors='ignore')

# Buscar todos los bloques de prospecto
pattern = r'\{"nombre_completo":.*?"queued_at":".*?"\}'
matches = re.findall(pattern, text)

leads_by_phone = {}
for m in matches:
    try:
        data = json.loads(m)
        phone = data.get('telefono')
        name = data.get('nombre_completo')
        key = (name, phone)
        leads_by_phone[key] = data
    except Exception as e:
        pass

all_leads = list(leads_by_phone.values())
with open('scripts/prospectos_rescatados_tablet2.json', 'w', encoding='utf-8') as f:
    json.dump(all_leads, f, ensure_ascii=False, indent=2)

print(f"Total prospectos únicos rescatados de Tablet 2: {len(all_leads)}\n")

for i, lead in enumerate(all_leads, 1):
    def safe(val):
        if val is None: return "None"
        if isinstance(val, list): return ", ".join(val)
        return str(val)
    
    print(f"=== PROSPECTO #{i} ===")
    print(f"  Nombre: {safe(lead.get('nombre_completo'))}")
    print(f"  Empresa: {safe(lead.get('nombre_empresa'))}")
    print(f"  Puesto: {safe(lead.get('puesto'))}")
    print(f"  Tipo Negocio: {safe(lead.get('tipo_negocio'))}")
    print(f"  Email: {safe(lead.get('email'))}")
    print(f"  Teléfono: {safe(lead.get('telefono'))}")
    print(f"  Ubicación: {safe(lead.get('estado'))} / {safe(lead.get('municipio'))}")
    print(f"  Interés: {safe(lead.get('productos_interes'))}")
    print(f"  Nivel Interés: {safe(lead.get('nivel_interes'))}")
    print(f"  Asesor: {safe(lead.get('asesor_asignado'))}")
    print(f"  Fecha: {safe(lead.get('queued_at'))}\n")
