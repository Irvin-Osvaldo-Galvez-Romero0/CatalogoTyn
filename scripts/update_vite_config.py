with open('vite.config.js', 'r', encoding='utf-8') as f:
    c = f.read()

c = c.replace("registerType: 'autoUpdate',", "registerType: 'autoUpdate',\n      injectRegister: 'inline',")
c = c.replace("minify: false,", "minify: true,")

with open('vite.config.js', 'w', encoding='utf-8') as f:
    f.write(c)

print('Updated vite.config.js successfully')
