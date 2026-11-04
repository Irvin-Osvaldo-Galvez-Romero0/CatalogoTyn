import json

with open('lighthouse_parsed.json', 'r', encoding='utf-8') as f:
    lh = json.load(f)

audits = lh.get('audits', {})

for key in ['llms-txt', 'webmcp-form-coverage', 'webmcp-registered-tools', 'webmcp-schema-validity', 'ard-schema', 'label-content-name-mismatch']:
    if key in audits:
        a = audits[key]
        print(f"=== {key} ===")
        print(f"Title: {a.get('title')}")
        print(f"Score: {a.get('score')}")
        print(f"Desc: {a.get('description')}")
        print(f"Details: {a.get('details')}")
