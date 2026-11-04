with open('src/components/CatalogView.jsx', 'r', encoding='utf-8') as f:
    text = f.read()

old_block = """                    <img
                      src={p.customImage || `/assets/${p.code}.png`}
                      alt={p.name}
                      className="kiosk-card-img"
                      loading="lazy"
                      onError={(e) => { e.currentTarget.src = '/assets/logo.png'; }}
                    />"""

new_block = """                    <img
                      src={p.customImage || `/assets/${p.code}.png`}
                      alt={p.name}
                      className="kiosk-card-img"
                      width="240"
                      height="240"
                      loading="lazy"
                      decoding="async"
                      onError={(e) => { e.currentTarget.src = '/assets/logo.png'; }}
                    />"""

text_crlf = text.replace('\r\n', '\n')
old_crlf = old_block.replace('\r\n', '\n')
new_crlf = new_block.replace('\r\n', '\n')

if old_crlf in text_crlf:
    text_crlf = text_crlf.replace(old_crlf, new_crlf)
    with open('src/components/CatalogView.jsx', 'w', encoding='utf-8', newline='\r\n') as f:
        f.write(text_crlf)
    print("SUCCESS updating CatalogView.jsx")
else:
    print("Could not find old_block in CatalogView.jsx")

