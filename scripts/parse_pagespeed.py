import re
import json

with open('pagespeed_raw.html', 'r', encoding='utf-8') as f:
    text = f.read()

# Search for JSON data structures
# Often pagespeed embeds JSON in window.__INITIAL_DATA__ or similar, or data-initial-state
m = re.search(r'data-initial-state="([^"]+)"', text)
if m:
    print('Found data-initial-state')

# Let's search for "score" or audits
found_cats = re.findall(r'"(performance|accessibility|best-practices|seo|pwa)":\{"id":"\1","title":"([^"]+)","score":([0-9\.]+)', text)
print('Direct cat regex:', found_cats)

# Let's search for categories in general
for cat in ['performance', 'accessibility', 'best-practices', 'seo']:
    pos = 0
    while True:
        idx = text.find(f'"{cat}":', pos)
        if idx == -1:
            break
        print(f'Match for {cat} at {idx}:', text[idx:idx+200])
        pos = idx + 200
        if pos > idx + 1000:
            break
