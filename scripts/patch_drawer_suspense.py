with open('src/App.jsx', 'r', encoding='utf-8') as f:
    text = f.read()

old_drawer = """      <InterestDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        interestList={interestList}
        interestSelections={interestSelections}
        products={allProducts}
        onToggleInterest={handleToggleInterest}
        onClearInterest={handleClearInterest}
        onSelectProduct={(p) => setSelectedProduct(p)}
      />"""

new_drawer = """      <React.Suspense fallback={null}>
        {isDrawerOpen && (
          <InterestDrawer
            isOpen={isDrawerOpen}
            onClose={() => setIsDrawerOpen(false)}
            interestList={interestList}
            interestSelections={interestSelections}
            products={allProducts}
            onToggleInterest={handleToggleInterest}
            onClearInterest={handleClearInterest}
            onSelectProduct={(p) => setSelectedProduct(p)}
          />
        )}
      </React.Suspense>"""

text_norm = text.replace('\r\n', '\n')
old_drawer_norm = old_drawer.replace('\r\n', '\n')

if old_drawer_norm in text_norm:
    text_norm = text_norm.replace(old_drawer_norm, new_drawer)
    with open('src/App.jsx', 'w', encoding='utf-8', newline='\r\n') as f:
        f.write(text_norm)
    print("SUCCESS wrapping InterestDrawer in Suspense")
else:
    print("old_drawer_norm not found")

