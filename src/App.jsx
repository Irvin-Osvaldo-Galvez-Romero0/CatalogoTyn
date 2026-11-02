import React, { useState, useEffect, useCallback, useRef } from 'react';
import confetti from 'canvas-confetti';
import KioskHeader from './components/KioskHeader';
import CatalogView from './components/CatalogView';
import AnatomyView from './components/AnatomyView';
import ProductDetailModal from './components/ProductDetailModal';
import MediaOverlay from './components/MediaOverlay';
import InterestDrawer from './components/InterestDrawer';
import AttractMode from './components/AttractMode';
import ErrorBoundary from './components/ErrorBoundary';
import LeadFormModal from './components/LeadFormModal';
import FixedSalesRepModal from './components/FixedSalesRepModal';
import AdminAuthModal from './components/admin/AdminAuthModal';
import AdminDashboardModal from './components/admin/AdminDashboardModal';
import MobileQuoteLanding from './components/MobileQuoteLanding';
import { productManager } from './services/productManager';
import { brandingService } from './services/brandingService';
import { DEFAULT_SALES_REPS } from './data/salesReps';

const INACTIVITY_TIMEOUT_MS = 60000; // 60 segundos de inactividad para modo demo automático

export default function App() {
  // Detección de Parámetro Móvil QR (?q=...)
  const [mobileQuoteData, setMobileQuoteData] = useState(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const qParam = urlParams.get('q');
      if (qParam) {
        const decodedStr = decodeURIComponent(escape(atob(qParam)));
        const parsed = JSON.parse(decodedStr);
        const rep = DEFAULT_SALES_REPS.find((r) => r.id === parsed.r) || DEFAULT_SALES_REPS[0];
        const reconstructedItems = (parsed.i || []).map((item) => ({
          code: item.c,
          name: item.n,
          marca: item.m,
          price: item.p,
          variants: (item.v || []).map((v) => ({
            size: v.s,
            colorName: v.cn,
            quantity: v.q
          }))
        }));
        return {
          salesRep: rep,
          items: reconstructedItems
        };
      }
    } catch (e) {
      console.warn('Could not decode mobile quote parameter:', e);
    }
    return null;
  });

  const [view, setView] = useState('catalog');
  const [category, setCategory] = useState('todos');
  const [query, setQuery] = useState('');
  const [theme] = useState('light');

  // Catálogo Unificado y Dinámico (Base + Custom desde la Nube/LocalStorage)
  const [allProducts, setAllProducts] = useState(() => productManager.getAllProducts());

  useEffect(() => {
    brandingService.initBranding();
    const unsub = productManager.subscribe((prods) => {
      setAllProducts(prods);
    });
    return unsub;
  }, []);

  // Estados de Administración Oculta
  const [isAdminAuthOpen, setIsAdminAuthOpen] = useState(false);
  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState(false);
  const [adminNip, setAdminNip] = useState('');

  const handleAdminAuthSuccess = (nip) => {
    setAdminNip(nip);
    setIsAdminAuthOpen(false);
    setIsAdminDashboardOpen(true);
  };

  // Persistencia del asesor fijado en este APK / dispositivo
  const [fixedRepId, setFixedRepId] = useState(() => {
    return localStorage.getItem('tynor_fixed_sales_rep_id') || '';
  });
  const [fixedRepName, setFixedRepName] = useState(() => {
    return localStorage.getItem('tynor_fixed_sales_rep_name') || '';
  });
  const [isFixedRepModalOpen, setIsFixedRepModalOpen] = useState(false);

  const handleSelectFixedRep = (repId, repName) => {
    setFixedRepId(repId);
    setFixedRepName(repName);
    try {
      localStorage.setItem('tynor_fixed_sales_rep_id', repId);
      localStorage.setItem('tynor_fixed_sales_rep_name', repName);
      localStorage.setItem('tynor_selected_sales_rep', repId);
    } catch (e) {
      console.warn('Could not save fixed rep:', e);
    }
  };

  // Persistencia de Lista de Interés / Deseos
  const [interestList, setInterestList] = useState(() => {
    try {
      const saved = localStorage.getItem('tynor_kiosk_interest');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [interestSelections, setInterestSelections] = useState(() => {
    try {
      const saved = localStorage.getItem('tynor_kiosk_selections');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [mediaState, setMediaState] = useState({ type: null, src: null, title: '' });
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isAttractMode, setIsAttractMode] = useState(false);
  const [isLeadFormOpen, setIsLeadFormOpen] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'light');
    localStorage.setItem('tynor_kiosk_theme', 'light');
  }, []);

  useEffect(() => {
    localStorage.setItem('tynor_kiosk_interest', JSON.stringify(interestList));
  }, [interestList]);

  useEffect(() => {
    localStorage.setItem('tynor_kiosk_selections', JSON.stringify(interestSelections));
  }, [interestSelections]);

  // Inactivity Timer (Watchdog para Kiosco)
  const inactivityTimerRef = useRef(null);
  const lastActivityTimestamp = useRef(Date.now());

  const resetInactivityTimer = useCallback(() => {
    if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
    inactivityTimerRef.current = setTimeout(() => {
      if (isAdminDashboardOpen || isAdminAuthOpen || mobileQuoteData) return;
      setSelectedProduct(null);
      setMediaState({ type: null, src: null, title: '' });
      setIsDrawerOpen(false);
      setIsAttractMode(true);
    }, INACTIVITY_TIMEOUT_MS);
  }, [isAdminDashboardOpen, isAdminAuthOpen, mobileQuoteData]);

  useEffect(() => {
    if (mobileQuoteData) return; // En modo landing móvil no correr attract mode

    const handleUserActivity = () => {
      if (isAttractMode) return;
      const now = Date.now();
      if (now - lastActivityTimestamp.current > 350) {
        lastActivityTimestamp.current = now;
        resetInactivityTimer();
      }
    };

    window.addEventListener('pointerdown', handleUserActivity, { passive: true });
    window.addEventListener('touchstart', handleUserActivity, { passive: true });
    window.addEventListener('pointermove', handleUserActivity, { passive: true });
    window.addEventListener('keydown', handleUserActivity, { passive: true });

    resetInactivityTimer();

    return () => {
      if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
      window.removeEventListener('pointerdown', handleUserActivity);
      window.removeEventListener('touchstart', handleUserActivity);
      window.removeEventListener('pointermove', handleUserActivity);
      window.removeEventListener('keydown', handleUserActivity);
    };
  }, [resetInactivityTimer, isAttractMode, mobileQuoteData]);

  const handleDismissAttract = () => {
    setIsAttractMode(false);
    resetInactivityTimer();
  };

  const handleToggleInterest = (code, customSelection = null) => {
    setInterestList((prev) => {
      const exists = prev.includes(code);
      if (!exists) {
        confetti({
          particleCount: 25,
          spread: 45,
          origin: { y: 0.85 },
          colors: ['#10B4C1', '#06B6D4', '#0EA5E9']
        });
        if (customSelection) {
          setInterestSelections((s) => ({ ...s, [code]: customSelection }));
        }
        return [...prev, code];
      } else {
        if (customSelection) {
          setInterestSelections((s) => ({ ...s, [code]: customSelection }));
          return prev;
        }
        setInterestSelections((s) => {
          const next = { ...s };
          delete next[code];
          return next;
        });
        return prev.filter((c) => c !== code);
      }
    });
  };

  const handleClearInterest = () => {
    setInterestList([]);
    setInterestSelections({});
  };

  const handleOpenMedia = (type, src, title) => {
    setMediaState({ type, src, title });
  };

  const handleCloseMedia = () => {
    setMediaState({ type: null, src: null, title: '' });
  };

  // Si se abrió desde el QR en el celular, mostrar la Landing de Auto-Descarga Móvil
  if (mobileQuoteData) {
    return (
      <MobileQuoteLanding
        quoteData={mobileQuoteData}
        onBackToKiosk={() => {
          window.history.replaceState({}, document.title, window.location.pathname);
          setMobileQuoteData(null);
        }}
      />
    );
  }

  return (
    <div className="app-kiosk-root">
      <KioskHeader
        view={view}
        setView={setView}
        theme={theme}
        interestCount={interestList.length}
        onOpenDrawer={() => setIsDrawerOpen(true)}
        onStartDemo={() => setIsAttractMode(true)}
        onOpenForm={() => setIsLeadFormOpen(true)}
        fixedRepName={fixedRepName}
        onOpenFixedRepModal={() => setIsFixedRepModalOpen(true)}
        onOpenAdminAuth={() => setIsAdminAuthOpen(true)}
      />

      <main className="kiosk-main">
        <div style={{ display: view === 'catalog' ? 'flex' : 'none', width: '100%', height: '100%', flex: 1, minHeight: 0, flexDirection: 'column' }}>
          <CatalogView
            products={allProducts}
            category={category}
            setCategory={setCategory}
            query={query}
            setQuery={setQuery}
            interestList={interestList}
            onToggleInterest={handleToggleInterest}
            onSelectProduct={(p) => setSelectedProduct(p)}
          />
        </div>

        <div style={{ display: view === 'anatomy' ? 'flex' : 'none', width: '100%', height: '100%', flex: 1, minHeight: 0, flexDirection: 'column' }}>
          <AnatomyView
            products={allProducts}
            onSelectProduct={(p) => setSelectedProduct(p)}
            interestList={interestList}
            onToggleInterest={handleToggleInterest}
          />
        </div>
      </main>

      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          interestList={interestList}
          interestSelections={interestSelections}
          onToggleInterest={handleToggleInterest}
          onOpenMedia={handleOpenMedia}
        />
      )}

      {mediaState.type && (
        <MediaOverlay
          mediaType={mediaState.type}
          src={mediaState.src}
          title={mediaState.title}
          onClose={handleCloseMedia}
        />
      )}

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

      <LeadFormModal
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
      />

      {isAttractMode && (
        <ErrorBoundary onReset={handleDismissAttract}>
          <AttractMode
            onDismiss={handleDismissAttract}
            theme={theme}
            onSelectProduct={(product) => {
              handleDismissAttract();
              setSelectedProduct(product);
            }}
            onGoToAnatomy={() => {
              handleDismissAttract();
              setView('anatomy');
            }}
            onGoToCatalog={() => {
              handleDismissAttract();
              setView('catalog');
            }}
          />
        </ErrorBoundary>
      )}
    </div>
  );
}
