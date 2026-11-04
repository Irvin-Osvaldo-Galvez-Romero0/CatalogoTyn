with open('src/components/CatalogView.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Extract the filteredProducts block
target_block = '''  const filteredProducts = products.filter((p) => {
    const matchesCat = category === 'todos' || p.cat === category;
    const q = query.trim().toLowerCase();
    const matchesQuery = !q || p.name.toLowerCase().includes(q) || p.code.toLowerCase().includes(q);
    return matchesCat && matchesQuery;
  });'''

content = content.replace(target_block, "")

# Insert filteredProducts right above PAGE_CHUNK
insertion_point = "  const isNativeMobile = typeof window !== 'undefined' && (Capacitor.isNativePlatform() || /Android|iPhone|iPad|iPod/i.test(navigator.userAgent));"
replacement = insertion_point + "\n\n" + target_block

content = content.replace(insertion_point, replacement)

with open('src/components/CatalogView.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Moved filteredProducts declaration above sentinelRef successfully")
