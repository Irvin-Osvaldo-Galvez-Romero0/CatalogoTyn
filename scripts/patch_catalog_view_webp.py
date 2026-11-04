with open('src/components/CatalogView.jsx', 'r', encoding='utf-8') as f:
    text = f.read()

old_block = """            {filteredProducts.map((p) => {
              const inList = interestList.includes(p.code);
              return (
                <div
                  key={p.code}
                  className="kiosk-card"
                  onClick={() => {
                    setIsKeyboardOpen(false);
                    onSelectProduct(p);
                  }}
                >
                  <div className="kiosk-card-img-wrap">
                    {p.badge && <span className="card-badge">{p.badge}</span>}
                    <img
                      src={p.customImage || `/assets/${p.code}.png`}
                      alt={p.name}
                      className="kiosk-card-img"
                      width="240"
                      height="240"
                      loading="lazy"
                      decoding="async"
                      onError={(e) => { e.currentTarget.src = '/assets/logo.png'; }}
                    />"""

new_block = """            {filteredProducts.map((p, idx) => {
              const inList = interestList.includes(p.code);
              const isPriorityLcp = idx < 4;
              return (
                <div
                  key={p.code}
                  className="kiosk-card"
                  onClick={() => {
                    setIsKeyboardOpen(false);
                    onSelectProduct(p);
                  }}
                >
                  <div className="kiosk-card-img-wrap">
                    {p.badge && <span className="card-badge">{p.badge}</span>}
                    <picture>
                      <source srcSet={p.customImage || `/assets/${p.code}.webp`} type="image/webp" />
                      <img
                        src={p.customImage || `/assets/${p.code}.webp`}
                        alt={p.name}
                        className="kiosk-card-img"
                        width="240"
                        height="240"
                        loading={isPriorityLcp ? "eager" : "lazy"}
                        fetchpriority={isPriorityLcp ? "high" : "auto"}
                        decoding={isPriorityLcp ? "sync" : "async"}
                        onError={(e) => {
                          if (!e.currentTarget.src.endsWith('.png') && !e.currentTarget.src.includes('logo')) {
                            e.currentTarget.src = `/assets/${p.code}.png`;
                          } else {
                            e.currentTarget.src = '/assets/logo.png';
                          }
                        }}
                      />
                    </picture>"""

text_norm = text.replace('\r\n', '\n')
old_norm = old_block.replace('\r\n', '\n')

if old_norm in text_norm:
    text_norm = text_norm.replace(old_norm, new_block)
    with open('src/components/CatalogView.jsx', 'w', encoding='utf-8', newline='\r\n') as f:
        f.write(text_norm)
    print("SUCCESS patching CatalogView.jsx with WebP & LCP fetchpriority")
else:
    print("old_norm not found in CatalogView.jsx")

