import json

with open('lighthouse_parsed.json', 'r', encoding='utf-8') as f:
    lh = json.load(f)

audit = lh.get('audits', {}).get('color-contrast', {})
items = audit.get('details', {}).get('items', [])
for i, item in enumerate(items):
    node = item.get('node', {})
    print(f"Item {i}:")
    print(f"  Snippet: {node.get('snippet')}")
    print(f"  Selector: {node.get('selector')}")
    print(f"  Explanation: {node.get('explanation')}")
