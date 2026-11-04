import re
import json

with open('pagespeed_raw.html', 'r', encoding='utf-8') as f:
    text = f.read()

scripts = re.findall(r'<script class="ds:0"[^>]*>(.*?)</script>', text, re.DOTALL)
if scripts:
    s = scripts[0]
    # Match AF_initDataCallback({key: 'ds:0', hash: '1', data: ... , sideChannel: {}});
    m = re.search(r'data:\s*(\[.+\])\s*,\s*sideChannel:', s, re.DOTALL)
    if m:
        data_str = m.group(1)
        try:
            data = json.loads(data_str)
            with open('pagespeed_extracted.json', 'w', encoding='utf-8') as out:
                json.dump(data, out, ensure_ascii=False, indent=2)
            print("SUCCESS extracting JSON from AF_initDataCallback!")
        except Exception as e:
            print("JSON parse error:", e)
            # Maybe it contains js literals or needs parsing
            with open('data_snippet.js', 'w', encoding='utf-8') as out:
                out.write(data_str[:5000])
    else:
        print("Regex for data: didn't match, dumping start of script 16")
        with open('script16_snippet.js', 'w', encoding='utf-8') as out:
            out.write(s[:2000])
else:
    print("Script class ds:0 not found")
