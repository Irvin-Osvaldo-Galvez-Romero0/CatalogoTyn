import React, { useState, useEffect, useCallback, useRef } from 'react';
import confetti from 'canvas-confetti';
import { PRODUCTS } from './data/products';
import KioskHeader from './components/KioskHeader';
import CatalogView from './components/CatalogView';
import AnatomyView from './components/AnatomyView';
import ProductDetailModal from './components/ProductDetailModal';
import MediaOverlay from './components/MediaOverlay';
import InterestDrawer from './components/InterestDrawer';
import AttractMode from './components/AttractMode';
import KioskResetFab from './components/KioskResetFab';

const INACTIVITY_TIMEOUT_MS = 75000; // 75 segundos de inactividad para modo descanso

export default function App() {
  const [view, setView] = useState('catalog');
  const [category, setCategory] = useState('todos');
  const [query, setQuery] = useState('');
  const [theme, setTheme] = useState(() => localStorage.getItem('tynor_kiosk_theme') || 'light');
  
  // Persistencia sin pérdida de datos en LocalStorage
  const [interestList, setInterestList] = useState(() => {
    try {
      const saved = localStorage.getItem('tynor_kiosk_interest');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [mediaState, setMediaState] = useState({ type: null, src: null, title: '' });
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isAttractMode, setIsAttractMode] = useState(false);

  // Sincronizar tema con elemento raíz
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('tynor_kiosk_theme', theme);
  }, [theme]);

  // Persistir lista de interés automáticamente
  useEffect(() => {
    localStorage.setItem('tynor_kiosk_interest', JSON.stringify(interestList));
  }, [interestList]);

  // Inactivity Timer (Watchdog para Kiosco EXPO)
  const inactivityTimerRef = useRef(null);

  const resetInactivityTimer = useCallback(() => {
    if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
    inactivityTimerRef.current = setTimeout(() => {
      // Activar protector de pantalla
      setSelectedProduct(null);
      setMediaState({ type: null, src: null, title: '' });
      setIsDrawerOpen(false);
      setIsAttractMode(true);
    }, INACTIVITY_TIMEOUT_MS);
  }, []);

  useEffect(() => {
    const handleUserActivity = () => {
      if (isAttractMode) return;
      resetInactivityTimer();
    };

    window.addEventListener('pointerdown', handleUserActivity, { passive: true });
    window.addEventListener('touchstart', handleUserActivity, { passive: true });
    window.addEventListener('keydown', handleUserActivity, { passive: true });

    resetInactivityTimer();

    return () => {
      if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
      window.removeEventListener('pointerdown', handleUserActivity);
      window.removeEventListener('touchstart', handleUserActivity);
      window.removeEventListener('keydown', handleUserActivity);
    };
  }, [resetInactivityTimer, isAttractMode]);

  const handleDismissAttract = () => {
    setIsAttractMode(false);
    resetInactivityTimer();
  };

  const handleToggleInterest = (code) => {
    setInterestList((prev) => {
      const exists = prev.includes(code);
      if (!exists) {
        // Disparo sutil de confeti táctil
        confetti({
          particleCount: 25,
          spread: 45,
          origin: { y: 0.85 },
          colors: ['#007A78', '#0284C7', '#10B981']
        });
        return [...prev, code];
      } else {
        return prev.filter((c) => c !== code);
      }
    });
  };

  const handleClearInterest = () => {
    setInterestList([]);
  };

  const handleResetKiosk = () => {
    setView('catalog');
    setCategory('todos');
    setQuery('');
    setInterestList([]);
    setSelectedProduct(null);
    setMediaState({ type: null, src: null, title: '' });
    setIsDrawerOpen(false);
    resetInactivityTimer();
  };

  const handleOpenMedia = (type, src, title) => {
    setMediaState({ type, src, title });
  };

  const handleCloseMedia = () => {
    setMediaState({ type: null, src: null, title: '' });
  };

  return (
    <div className="app-kiosk-root">
      <KioskHeader
        view={view}
        setView={setView}
        theme={theme}
        setTheme={setTheme}
        interestCount={interestList.length}
        onOpenDrawer={() => setIsDrawerOpen(true)}
      />

      <main className="kiosk-main">
        {view === 'catalog' ? (
          <CatalogView
            products={PRODUCTS}
            category={category}
            setCategory={setCategory}
            query={query}
            setQuery={setQuery}
            interestList={interestList}
            onToggleInterest={handleToggleInterest}
            onSelectProduct={(p) => setSelectedProduct(p)}
          />
        ) : (
          <AnatomyView
            products={PRODUCTS}
            onSelectProduct={(p) => setSelectedProduct(p)}
            interestList={interestList}
            onToggleInterest={handleToggleInterest}
          />
        )}
      </main>

      <KioskResetFab onReset={handleResetKiosk} />

      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          interestList={interestList}
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
        products={PRODUCTS}
        onToggleInterest={handleToggleInterest}
        onClearInterest={handleClearInterest}
        onSelectProduct={(p) => setSelectedProduct(p)}
      />

      {isAttractMode && (
        <AttractMode onDismiss={handleDismissAttract} theme={theme} />
      )}
    </div>
  );
}
