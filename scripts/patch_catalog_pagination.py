with open('src/components/CatalogView.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update imports
content = content.replace(
    "import React, { useState, useRef } from 'react';",
    "import React, { useState, useRef, useCallback, useEffect } from 'react';"
)

# 2. Add visibleCount state and observer logic
pagination_logic = '''
  const PAGE_CHUNK = 24;
  const [visibleCount, setVisibleCount] = useState(PAGE_CHUNK);

  useEffect(() => {
    setVisibleCount(PAGE_CHUNK);
  }, [category, query]);

  const observerRef = useRef(null);
  const sentinelRef = useCallback((node) => {
    if (observerRef.current) observerRef.current.disconnect();
    if (!node) return;
    observerRef.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setVisibleCount((prev) => Math.min(prev + PAGE_CHUNK, filteredProducts.length));
      }
    }, { rootMargin: '300px' });
    observerRef.current.observe(node);
  }, [filteredProducts.length]);
'''

content = content.replace(
    "const isNativeMobile = typeof window !== 'undefined' && (Capacitor.isNativePlatform() || /Android|iPhone|iPad|iPod/i.test(navigator.userAgent));",
    "const isNativeMobile = typeof window !== 'undefined' && (Capacitor.isNativePlatform() || /Android|iPhone|iPad|iPod/i.test(navigator.userAgent));" + pagination_logic
)

# 3. Replace {filteredProducts.map((p, idx) => { with {filteredProducts.slice(0, visibleCount).map((p, idx) => {
content = content.replace(
    "{filteredProducts.map((p, idx) => {",
    "{filteredProducts.slice(0, visibleCount).map((p, idx) => {"
)

# 4. Add sentinel div at end of products-grid
target_grid_end = '''              );
            })}
          </div>'''

replacement_grid_end = '''              );
            })}
          </div>
          {visibleCount < filteredProducts.length && (
            <div ref={sentinelRef} style={{ width: '100%', height: '30px', margin: '1rem 0', opacity: 0 }} />
          )}'''

content = content.replace(target_grid_end, replacement_grid_end)

with open('src/components/CatalogView.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("CatalogView.jsx patched successfully")

