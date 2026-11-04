import sys
import json

sys.stdout.reconfigure(encoding='utf-8')

with open('lighthouse_parsed.json', 'r', encoding='utf-8') as f:
    lh = json.load(f)

print(f"Requested URL: {lh.get('requestedUrl')}")
print(f"Final URL: {lh.get('finalUrl')}")
print(f"Lighthouse Version: {lh.get('lighthouseVersion')}")

print("\n" + "="*50)
print("CATEGORY SCORES")
print("="*50)
categories = lh.get('categories', {})
for cat_id, cat in categories.items():
    score = cat.get('score')
    score_pct = f"{score * 100:.0f}" if score is not None else "N/A"
    print(f"  * {cat.get('title')} ({cat_id}): {score_pct}/100")

print("\n" + "="*50)
print("FAILED / OPPORTUNITY AUDITS (score < 1.0)")
print("="*50)
audits = lh.get('audits', {})
failed = []
for aid, a in audits.items():
    score = a.get('score')
    if score is not None and score < 1.0:
        failed.append((score, aid, a))

failed.sort(key=lambda x: x[0])

for score, aid, a in failed:
    title = a.get('title')
    display = a.get('displayValue', '')
    print(f"[{score * 100:3.0f}] {aid} -- {title}")
    if display:
        print(f"    Valor: {display}")
    details = a.get('details', {})
    items = details.get('items', [])
    if items:
        for it in items[:2]:
            summary = {k: v for k, v in it.items() if k in ['url', 'wastedBytes', 'wastedMs', 'totalBytes', 'source', 'label']}
            if summary:
                print(f"      - {summary}")
