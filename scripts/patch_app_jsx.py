with open('src/App.jsx', 'r', encoding='utf-8') as f:
    text = f.read()

# Replace static imports with React.lazy
old_imports = """import AnatomyView from './components/AnatomyView';
import ProductDetailModal from './components/ProductDetailModal';
import MediaOverlay from './components/MediaOverlay';
import InterestDrawer from './components/InterestDrawer';
import AttractMode from './components/AttractMode';
import ErrorBoundary from './components/ErrorBoundary';
import LeadFormModal from './components/LeadFormModal';
import FixedSalesRepModal from './components/FixedSalesRepModal';
import AdminAuthModal from './components/admin/AdminAuthModal';
import AdminDashboardModal from './components/admin/AdminDashboardModal';"""

new_imports = """import ProductDetailModal from './components/ProductDetailModal';
import InterestDrawer from './components/InterestDrawer';
import ErrorBoundary from './components/ErrorBoundary';

const AnatomyView = React.lazy(() => import('./components/AnatomyView'));
const MediaOverlay = React.lazy(() => import('./components/MediaOverlay'));
const AttractMode = React.lazy(() => import('./components/AttractMode'));
const LeadFormModal = React.lazy(() => import('./components/LeadFormModal'));
const FixedSalesRepModal = React.lazy(() => import('./components/FixedSalesRepModal'));
const AdminAuthModal = React.lazy(() => import('./components/admin/AdminAuthModal'));
const AdminDashboardModal = React.lazy(() => import('./components/admin/AdminDashboardModal'));"""

text_norm = text.replace('\r\n', '\n')
old_norm = old_imports.replace('\r\n', '\n')

if old_norm in text_norm:
    text_norm = text_norm.replace(old_norm, new_imports)
    print("Imports replaced successfully")
else:
    print("Could not find imports in App.jsx")

# Also wrap the main return content or the lazy components in Suspense
# In App.jsx, let's wrap the lazy modals and AnatomyView in <React.Suspense fallback={null}>
# Let's find view === 'anatomy'
old_anatomy = "{view === 'anatomy' && ("
new_anatomy = """{view === 'anatomy' && (
          <React.Suspense fallback={<div className="kiosk-loading-spinner" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: 'var(--brand)' }}>Cargando Anatomía 3D...</div>}>"""

if old_anatomy in text_norm:
    # also close the Suspense
    old_anatomy_block = """          <ErrorBoundary onReset={() => setView('catalog')}>
            <AnatomyView
              products={allProducts}
              onSelectProduct={setSelectedProduct}
              interestList={interestList}
              onToggleInterest={toggleInterest}
            />
          </ErrorBoundary>
        )}"""
    new_anatomy_block = """          <ErrorBoundary onReset={() => setView('catalog')}>
            <React.Suspense fallback={<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh', color: 'var(--brand)', fontFamily: 'var(--font-display)', fontWeight: 700 }}>Cargando Entorno 3D...</div>}>
              <AnatomyView
                products={allProducts}
                onSelectProduct={setSelectedProduct}
                interestList={interestList}
                onToggleInterest={toggleInterest}
              />
            </React.Suspense>
          </ErrorBoundary>
        )}"""
    if old_anatomy_block in text_norm:
        text_norm = text_norm.replace(old_anatomy_block, new_anatomy_block)
        print("AnatomyView Suspense wrapped successfully")
    else:
        print("old_anatomy_block not found")

# Wrap lazy modals in Suspense
old_modals = """      <LeadFormModal
        isOpen={isLeadFormOpen}
        onClose={() => setIsLeadFormOpen(false)}
      />"""

new_modals = """      <React.Suspense fallback={null}>
        {isLeadFormOpen && (
          <LeadFormModal
            isOpen={isLeadFormOpen}
            onClose={() => setIsLeadFormOpen(false)}
          />
        )}
        {isFixedRepModalOpen && (
          <FixedSalesRepModal
            isOpen={isFixedRepModalOpen}
            onClose={() => setIsFixedRepModalOpen(false)}
            fixedRepId={fixedRepId}
            onSelectRep={handleSelectFixedRep}
          />
        )}
        {isAdminAuthOpen && (
          <AdminAuthModal
            isOpen={isAdminAuthOpen}
            onClose={() => setIsAdminAuthOpen(false)}
            onSuccess={handleAdminAuthSuccess}
          />
        )}
        {isAdminDashboardOpen && (
          <AdminDashboardModal
            isOpen={isAdminDashboardOpen}
            onClose={() => setIsAdminDashboardOpen(false)}
            initialNip={adminNip}
          />
        )}
      </React.Suspense>"""

old_modals_section = """      <LeadFormModal
        isOpen={isLeadFormOpen}
        onClose={() => setIsLeadFormOpen(false)}
      />

      <FixedSalesRepModal
        isOpen={isFixedRepModalOpen}
        onClose={() => setIsFixedRepModalOpen(false)}
        fixedRepId={fixedRepId}
        onSelectRep={handleSelectFixedRep}
      />

      {/* Modal de Autenticación de Administrador (Usuario + NIP) */}
      <AdminAuthModal
        isOpen={isAdminAuthOpen}
        onClose={() => setIsAdminAuthOpen(false)}
        onSuccess={handleAdminAuthSuccess}
      />

      {/* Panel de Control de Administración en Pantalla Completa */}
      <AdminDashboardModal
        isOpen={isAdminDashboardOpen}
        onClose={() => setIsAdminDashboardOpen(false)}
        initialNip={adminNip}
      />"""

if old_modals_section in text_norm:
    text_norm = text_norm.replace(old_modals_section, new_modals)
    print("Modals Suspense wrapped successfully")
else:
    print("old_modals_section not found")

# Wrap MediaOverlay
old_media = """      <MediaOverlay
        media={activeMedia}
        onClose={() => setActiveMedia(null)}
      />"""
new_media = """      <React.Suspense fallback={null}>
        {activeMedia && (
          <MediaOverlay
            media={activeMedia}
            onClose={() => setActiveMedia(null)}
          />
        )}
      </React.Suspense>"""

if old_media in text_norm:
    text_norm = text_norm.replace(old_media, new_media)
    print("MediaOverlay Suspense wrapped successfully")
else:
    print("old_media not found")

with open('src/App.jsx', 'w', encoding='utf-8', newline='\r\n') as f:
    f.write(text_norm)
print("Finished patching src/App.jsx")
