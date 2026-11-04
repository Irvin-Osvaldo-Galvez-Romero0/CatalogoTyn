with open('pagespeed_raw.html', 'r', encoding='utf-8') as f:
    text = f.read()

print('Length of html:', len(text))
keywords = ['Lighthouse', 'Rendimiento', 'Accesibilidad', 'Prácticas', 'SEO', 'PWA', 'Performance', 'score', '0z8qgsurnn']
for kw in keywords:
    print(f'Occurrences of "{kw}": {text.count(kw)}')

import re
scripts = re.findall(r'<script.*?</script>', text, re.DOTALL)
print('Number of scripts:', len(scripts))
for i, s in enumerate(scripts):
    if len(s) > 1000:
        print(f'Script {i} length: {len(s)}, preview: {s[:100]}...')

