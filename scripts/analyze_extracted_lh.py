import json

with open('pagespeed_extracted.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Traverse structure to find lighthouseResult or audits
def find_keys(obj, target):
    if isinstance(obj, dict):
        for k, v in obj.items():
            if k == target:
                yield v
            yield from find_keys(v, target)
    elif isinstance(obj, list):
        for item in obj:
            yield from find_keys(item, target)

# Search for 'categories' or 'audits'
cats = list(find_keys(data, 'categories'))
print(f"Found {len(cats)} categories dicts")
for c in cats:
    if isinstance(c, dict):
        for k, v in c.items():
            if isinstance(v, dict) and 'title' in v and 'score' in v:
                score = v.get('score')
                score_str = f"{score * 100:.0f}" if score is not None else "N/A"
                print(f"Category: {v.get('title')} ({k}) -> {score_str}/100")

audits_list = list(find_keys(data, 'audits'))
print(f"Found {len(audits_list)} audits dicts")
if audits_list:
    audits = audits_list[0]
    print("\n=== AUDITS WITH ISSUES (Score < 0.9 or not None) ===")
    for aid, a in audits.items():
        if isinstance(a, dict):
            score = a.get('score')
            if score is not None and score < 0.9:
                print(f"[{score}] {aid}: {a.get('title')}")
                if 'displayValue' in a:
                    print(f"    DisplayValue: {a.get('displayValue')}")
                if 'explanation' in a:
                    print(f"    Explanation: {a.get('explanation')}")

