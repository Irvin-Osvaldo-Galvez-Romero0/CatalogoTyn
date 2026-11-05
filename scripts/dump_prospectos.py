import urllib.request
import json
import csv
import sys

sys.stdout.reconfigure(encoding='utf-8')

url = 'https://xvrnssesbkzxeusubzes.supabase.co/rest/v1/prospectos_comerciales?select=*&order=created_at.asc'
headers = {
    'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh2cm5zc2VzYmt6eGV1c3ViemVzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTMwNDg2NTgsImV4cCI6MjEwODYyNDY1OH0.Flfpf4NZHP84b5MvDpBDU6cHXkt78dty8GF63RnHy3c',
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh2cm5zc2VzYmt6eGV1c3ViemVzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTMwNDg2NTgsImV4cCI6MjEwODYyNDY1OH0.Flfpf4NZHP84b5MvDpBDU6cHXkt78dty8GF63RnHy3c'
}

req = urllib.request.Request(url, headers=headers)
with urllib.request.urlopen(req) as resp:
    data = json.loads(resp.read().decode('utf-8'))
    print(f"Total registros encontrados en Supabase: {len(data)}\n")
    for i, r in enumerate(data, 1):
        print(f"[{i}] {r.get('nombre_completo')} | {r.get('nombre_empresa')} | Tel: {r.get('telefono')} | Email: {r.get('email')} | Asesor: {r.get('asesor_asignado')}")

    # Guardar en CSV para fácil exportación
    csv_file = 'scripts/prospectos_supabase_export.csv'
    if data:
        keys = list(data[0].keys())
        with open(csv_file, 'w', newline='', encoding='utf-8-sig') as f:
            writer = csv.DictWriter(f, fieldnames=keys)
            writer.writeheader()
            writer.writerows(data)
        print(f"\nExportado exitosamente a CSV: {csv_file}")
