with open('src/components/CatalogView.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    ') : (\n          <div className="products-grid">',
    ') : (\n          <>\n          <div className="products-grid">'
)

content = content.replace(
    '          {visibleCount < filteredProducts.length && (\n            <div ref={sentinelRef} style={{ width: \'100%\', height: \'30px\', margin: \'1rem 0\', opacity: 0 }} />\n          )}\n        )}',
    '          {visibleCount < filteredProducts.length && (\n            <div ref={sentinelRef} style={{ width: \'100%\', height: \'30px\', margin: \'1rem 0\', opacity: 0 }} />\n          )}\n          </>\n        )}'
)

with open('src/components/CatalogView.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("CatalogView.jsx fixed with Fragment")

