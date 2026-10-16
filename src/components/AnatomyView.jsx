import React, { useState, useRef, useEffect } from 'react';
import { X, ArrowRight, Eye, ShieldAlert, Sparkles } from 'lucide-react';
import { BODY_PARTS } from '../data/products';

export default function AnatomyView({
  products,
  onSelectProduct,
  interestList,
  onToggleInterest
}) {
  const [selectedPart, setSelectedPart] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);
  const [showGuide, setShowGuide] = useState(true);
  const modelRef = useRef(null);

  useEffect(() => {
    const model = modelRef.current;
    if (!model) return;

    // Si ya cargó previamente (ej. persistencia o caché en memoria)
    if (model.loaded) {
      setIsLoaded(true);
    }

    const handleProgress = (event) => {
      const p = Math.min(100, Math.round((event.detail?.totalProgress || 0) * 100));
      setLoadProgress(p);
      if (p >= 100) {
        // Breve retraso para transición visual suave
        setTimeout(() => setIsLoaded(true), 150);
      }
    };

    const handleLoad = () => {
      setIsLoaded(true);
    };

    model.addEventListener('progress', handleProgress);
    model.addEventListener('load', handleLoad);

    return () => {
      model.removeEventListener('progress', handleProgress);
      model.removeEventListener('load', handleLoad);
    };
  }, []);

  const handleHotspotClick = (part) => {
    setSelectedPart(part);
    if (modelRef.current) {
      modelRef.current.autoRotate = false;
      modelRef.current.cameraTarget = part.position;
      modelRef.current.cameraOrbit = 'auto auto 2m';
    }
  };

  const handleClosePanel = () => {
    setSelectedPart(null);
    if (modelRef.current) {
      modelRef.current.cameraTarget = 'auto auto auto';
      modelRef.current.cameraOrbit = '0deg 75deg 105%';
      modelRef.current.autoRotate = true;
    }
  };

  const partProducts = selectedPart
    ? products.filter((p) => p.bodyPart.includes(selectedPart.id))
    : [];

  return (
    <div className="anatomy-container">
      <div className="model-wrapper-kiosk">
        <model-viewer
          ref={modelRef}
          src="/assets/Model_Human.glb"
          alt="Modelo Humano Anatómico Tynor"
          shadow-intensity="0.8"
          shadow-softness="0.5"
          power-preference="high-performance"
          interpolation-decay="200"
          camera-controls
          auto-rotate
          rotation-per-second="4deg"
          interaction-prompt="none"
          loading="eager"
          reveal="auto"
          style={{ width: '100%', height: '100%', display: 'block' }}
        >
          <div slot="progress-bar" className={`model-loading-indicator ${isLoaded ? 'hide' : ''}`}>
            <div className="model-spinner" />
            <div className="model-loading-text">
              <span>Cargando Modelo 3D...</span>
              <span className="model-loading-pct">{loadProgress}%</span>
            </div>
          </div>

          {BODY_PARTS.map((part) => (
            <button
              key={part.id}
              className="Hotspot"
              slot={part.hotspotId}
              data-position={part.position}
              data-normal={part.normal}
              onClick={() => handleHotspotClick(part)}
              aria-label={`Explorar soluciones para ${part.name}`}
            >
              {part.label}
            </button>
          ))}
        </model-viewer>

        {showGuide ? (
          <div className="anatomy-hud-guide">
            <div className="anatomy-hud-guide-head">
              <div className="anatomy-hud-guide-title">
                <Sparkles size={16} />
                <h4>Exploración Anatómica 3D</h4>
              </div>
              <button
                className="kiosk-icon-btn-xs"
                onClick={() => setShowGuide(false)}
                aria-label="Ocultar guía"
                title="Ocultar información"
              >
                <X size={15} />
              </button>
            </div>
            <p>
              Toca los números intermitentes en el cuerpo para descubrir los soportes y
              ortesis diseñados para esa zona. Arrastra para rotar en 360°.
            </p>
          </div>
        ) : (
          <button
            className="anatomy-hud-toggle"
            onClick={() => setShowGuide(true)}
            aria-label="Mostrar guía de exploración 3D"
            title="Mostrar guía de exploración 3D"
          >
            <Sparkles size={16} />
            <span>Guía 3D</span>
          </button>
        )}
      </div>

      <div className={`anatomy-panel-drawer ${selectedPart ? 'open' : ''}`}>
        <div className="anatomy-panel-head">
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--brand)', textTransform: 'uppercase' }}>
              Zona Anatómica
            </span>
            <h3>{selectedPart ? selectedPart.name : ''}</h3>
          </div>
          <button
            className="kiosk-icon-btn"
            style={{ width: 44, height: 44 }}
            onClick={handleClosePanel}
            aria-label="Cerrar panel"
          >
            <X size={20} />
          </button>
        </div>

        <div className="anatomy-panel-content">
          {partProducts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--ink-secondary)' }}>
              <ShieldAlert size={36} style={{ opacity: 0.4, marginBottom: '0.75rem' }} />
              <p>No se encontraron productos asignados a esta área.</p>
            </div>
          ) : (
            partProducts.map((p) => (
              <div
                key={p.code}
                className="drawer-item"
                style={{ cursor: 'pointer' }}
                onClick={() => onSelectProduct(p)}
              >
                <div className="drawer-item-img">
                  <img src={`/assets/${p.code}.png`} alt={p.name} />
                </div>
                <div className="drawer-item-details">
                  <div className="drawer-item-code">Ref. {p.code}</div>
                  <div className="drawer-item-name">{p.name}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--ink-secondary)' }}>
                    {p.price == null ? 'Consultar precio' : `$${p.price.toFixed(2)}`}
                  </div>
                </div>
                <button
                  className="kiosk-icon-btn"
                  style={{ width: 40, height: 40, flexShrink: 0 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectProduct(p);
                  }}
                  title="Ver detalle"
                >
                  <ArrowRight size={18} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
