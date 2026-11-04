with open('vite.config.js', 'r', encoding='utf-8') as f:
    c = f.read()

c = c.replace("build: {", "build: {\n    minify: false,")
with open('vite.config.js', 'w', encoding='utf-8') as f:
    f.write(c)

print("Set minify: false")
