with open('src/services/productManager.js', 'r', encoding='utf-8') as f:
    text = f.read()

old_block = """  getAllProducts() {
    const custom = this.getCustomProducts();
    // Mapa con los productos custom reemplazando o sumándose a los base
    const customCodes = new Set(custom.map((p) => String(p.code)));
    const filteredBase = BASE_PRODUCTS.filter((p) => !customCodes.has(String(p.code)));
    const unified = [...custom, ...filteredBase];
    return unified.map((p) => ({
      ...p,
      colors: Array.isArray(p.colors) ? p.colors.map(normalizeColor).filter(Boolean) : []
    }));
  },"""

new_block = """  getAllProducts() {
    const custom = this.getCustomProducts();
    // Mapa con los productos custom reemplazando o sumándose a los base
    const customCodes = new Set(custom.map((p) => String(p.code)));
    const filteredBase = BASE_PRODUCTS.filter((p) => !customCodes.has(String(p.code)));
    const unified = [...custom, ...filteredBase];
    // Ordenamiento determinista estable por código para evitar Cumulative Layout Shift (CLS)
    unified.sort((a, b) => String(a.code).localeCompare(String(b.code), undefined, { numeric: true, sensitivity: 'base' }));
    return unified.map((p) => ({
      ...p,
      colors: Array.isArray(p.colors) ? p.colors.map(normalizeColor).filter(Boolean) : []
    }));
  },"""

text_norm = text.replace('\r\n', '\n')
old_norm = old_block.replace('\r\n', '\n')

if old_norm in text_norm:
    text_norm = text_norm.replace(old_norm, new_block)
    with open('src/services/productManager.js', 'w', encoding='utf-8', newline='\r\n') as f:
        f.write(text_norm)
    print("SUCCESS patching productManager.js with deterministic sort")
else:
    print("old_block not found in productManager.js")

