import json

with open('pagespeed_extracted.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

print('Type:', type(data))
if isinstance(data, list):
    print('Length:', len(data))
    for i, item in enumerate(data[:10]):
        print(f"Item {i} type: {type(item)}")
        if isinstance(item, str) and ('{' in item or 'Lighthouse' in item or 'performance' in item):
            print(f"  Item {i} is string with length {len(item)}: {item[:200]}")
        elif isinstance(item, list):
            print(f"  Item {i} is list of length {len(item)}")

# Search for any string that parses as JSON containing lighthouseResult
def search_nested(obj, path=""):
    if isinstance(obj, str):
        if 'lighthouseResult' in obj or 'categories' in obj or 'fetchTime' in obj:
            print(f"Found match at {path}, len={len(obj)}")
            try:
                parsed = json.loads(obj)
                print(f"  Successfully parsed JSON at {path}! Keys: {list(parsed.keys())[:10]}")
                with open('lighthouse_parsed.json', 'w', encoding='utf-8') as out:
                    json.dump(parsed, out, ensure_ascii=False, indent=2)
            except Exception as e:
                print(f"  Could not parse JSON: {e}")
    elif isinstance(obj, list):
        for idx, val in enumerate(obj):
            search_nested(val, f"{path}[{idx}]")
    elif isinstance(obj, dict):
        for k, val in obj.items():
            search_nested(val, f"{path}.{k}")

search_nested(data)
