import urllib.request
import re
import json

url = 'https://pagespeed.web.dev/analysis/https-catalogotyn-vercel-app/7u31qbpjqf?form_factor=desktop&category=performance&category=accessibility&category=best-practices&category=seo&category=agentic-browsing&hl=es-419&utm_source=lh-chrome-ext'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
try:
    with urllib.request.urlopen(req, timeout=15) as resp:
        text = resp.read().decode('utf-8', errors='ignore')

    scripts = re.findall(r'<script class="ds:0"[^>]*>(.*?)</script>', text, re.DOTALL)
    if scripts:
        m = re.search(r'data:\s*(\[.+\])\s*,\s*sideChannel:', scripts[0], re.DOTALL)
        if m:
            raw_data = json.loads(m.group(1))
            def search_nested(obj):
                if isinstance(obj, str) and 'lighthouseResult' in obj:
                    return json.loads(obj)
                elif isinstance(obj, list):
                    for item in obj:
                        res = search_nested(item)
                        if res: return res
                elif isinstance(obj, dict):
                    for v in obj.values():
                        res = search_nested(v)
                        if res: return res
                return None
            lh = search_nested(raw_data)
            if lh:
                with open('lh_latest.json', 'w', encoding='utf-8') as f:
                    json.dump(lh, f, ensure_ascii=False, indent=2)
                print('SUCCESS: Extracted latest Lighthouse JSON')
            else:
                print('Lighthouse JSON not found in raw_data')
        else:
            print('data regex not matched')
    else:
        print('Script ds:0 not found')
except Exception as e:
    print('Error:', e)

