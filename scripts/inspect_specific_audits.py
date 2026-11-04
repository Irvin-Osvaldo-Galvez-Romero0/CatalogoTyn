import json

with open('lighthouse_parsed.json', 'r', encoding='utf-8') as f:
    lh = json.load(f)

audits = lh.get('audits', {})

print("--- AGENTIC BROWSING AUDITS ---")
cat_ab = lh.get('categories', {}).get('agentic-browsing', {})
for audit_ref in cat_ab.get('auditRefs', []):
    aid = audit_ref.get('id')
    a = audits.get(aid, {})
    score = a.get('score')
    print(f"[{score}] {aid}: {a.get('title')}")
    if score is not None and score < 1.0:
        print(f"    Desc: {a.get('description')}")
        items = a.get('details', {}).get('items', [])
        if items:
            print(f"    Items: {items[:3]}")

print("\n--- ACCESSIBILITY AUDITS ---")
cat_a11y = lh.get('categories', {}).get('accessibility', {})
for audit_ref in cat_a11y.get('auditRefs', []):
    aid = audit_ref.get('id')
    a = audits.get(aid, {})
    score = a.get('score')
    if score is not None and score < 1.0:
        print(f"[{score}] {aid}: {a.get('title')}")
        items = a.get('details', {}).get('items', [])
        if items:
            for it in items[:3]:
                print(f"    Node: {it.get('node', {}).get('snippet')}")
                print(f"    Explanation: {it.get('node', {}).get('explanation') or it.get('subItems')}")
