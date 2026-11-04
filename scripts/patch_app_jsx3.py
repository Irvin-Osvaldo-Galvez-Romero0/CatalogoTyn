with open('src/App.jsx', 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Update imports
old_imp = """import ProductDetailModal from './components/ProductDetailModal';
import InterestDrawer from './components/InterestDrawer';
import ErrorBoundary from './components/ErrorBoundary';

const AnatomyView = React.lazy(() => import('./components/AnatomyView'));"""

new_imp = """import ErrorBoundary from './components/ErrorBoundary';

const AnatomyView = React.lazy(() => import('./components/AnatomyView'));
const ProductDetailModal = React.lazy(() => import('./components/ProductDetailModal'));
const InterestDrawer = React.lazy(() => import('./components/InterestDrawer'));"""

# 2. Update AnatomyView condition
old_anatomy = """        <div style={{ display: view === 'anatomy' ? 'flex' : 'none', width: '100%', height: '100%', flex: 1, minHeight: 0, flexDirection: 'column' }}>
          <React.Suspense fallback={<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: 'var(--brand)', fontFamily: 'var(--font-display)', fontWeight: 700 }}>Cargando Anatomía 3D...</div>}>
            <AnatomyView
              products={allProducts}
              onSelectProduct={(p) => setSelectedProduct(p)}
              interestList={interestList}
              onToggleInterest={handleToggleInterest}
            />
          </React.Suspense>
        </div>"""

new_anatomy = """        {view === 'anatomy' && (
          <div style={{ display: 'flex', width: '100%', height: '100%', flex: 1, minHeight: 0, flexDirection: 'column' }}>
            <React.Suspense fallback={<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: 'var(--brand)', fontFamily: 'var(--font-display)', fontWeight: 700 }}>Cargando Anatomía 3D...</div>}>
              <AnatomyView
                products={allProducts}
                onSelectProduct={(p) => setSelectedProduct(p)}
                interestList={interestList}
                onToggleInterest={handleToggleInterest}
              />
            </React.Suspense>
          </div>
        )}"""

# 3. Wrap ProductDetailModal and InterestDrawer
old_pdm = """      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          interestList={interestList}
          interestSelections={interestSelections}
          onToggleInterest={handleToggleInterest}
          onOpenMedia={handleOpenMedia}
        />
      )}"""

new_pdm = """      {selectedProduct && (
        <React.Suspense fallback={null}>
          <ProductDetailModal
            product={selectedProduct}
            onClose={() => setSelectedProduct(null)}
            interestList={interestList}
            interestSelections={interestSelections}
            onToggleInterest={handleToggleInterest}
            onOpenMedia={handleOpenMedia}
          />
        </React.Suspense>
      )}"""

old_drawer = """      <InterestDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        interestList={interestList}
        interestSelections={interestSelections}
        products={allProducts}
        onToggleInterest={handleToggleInterest}
        onRemoveInterest={handleRemoveInterest}
        onUpdateQuantity={handleUpdateQuantity}
        onClearAll={handleClearAll}
        onSelectProduct={(product) => setSelectedProduct(product)}
        fixedRepName={fixedRepName}
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
            onRemoveInterest={handleRemoveInterest}
            onUpdateQuantity={handleUpdateQuantity}
            onClearAll={handleClearAll}
            onSelectProduct={(product) => setSelectedProduct(product)}
            fixedRepName={fixedRepName}
          />
        )}
      </React.Suspense>"""

text_norm = text.replace('\r\n', '\n')
old_imp_norm = old_imp.replace('\r\n', '\n')
old_anatomy_norm = old_anatomy.replace('\r\n', '\n')
old_pdm_norm = old_pdm.replace('\r\n', '\n')
old_drawer_norm = old_drawer.replace('\r\n', '\n')

replacements = 0

if old_imp_norm in text_norm:
    text_norm = text_norm.replace(old_imp_norm, new_imp)
    replacements += 1
else:
    print("old_imp_norm not found")

if old_anatomy_norm in text_norm:
    text_norm = text_norm.replace(old_anatomy_norm, new_anatomy)
    replacements += 1
else:
    print("old_anatomy_norm not found")

if old_pdm_norm in text_norm:
    text_norm = text_norm.replace(old_pdm_norm, new_pdm)
    replacements += 1
else:
    print("old_pdm_norm not found")

if old_drawer_norm in text_norm:
    text_norm = text_norm.replace(old_drawer_norm, new_drawer)
    replacements += 1
else:
    print("old_drawer_norm not found")

with open('src/App.jsx', 'w', encoding='utf-8', newline='\r\n') as f:
    f.write(text_norm)

print(f"App.jsx patched successfully ({replacements}/4 replacements)")

