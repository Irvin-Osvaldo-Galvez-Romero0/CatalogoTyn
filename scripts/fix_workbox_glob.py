with open('vite.config.js', 'r', encoding='utf-8') as f:
    c = f.read()

c = c.replace(
    "globPatterns: ['**/*.{js,css,html,svg,ico,woff2}', 'assets/logo*.*'],",
    "globPatterns: ['**/*.{js,css,html,svg,ico,woff2}'],"
)

with open('vite.config.js', 'w', encoding='utf-8') as f:
    f.write(c)

print('Updated workbox globPatterns in vite.config.js')
