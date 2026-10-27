import React, { useState, useRef, useEffect } from 'react';
import { X, ArrowRight, ShieldAlert, Sparkles, Activity, Bone } from 'lucide-react';
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
  const [showGuide, setShowGuide] = useState(false);
  const [viewMode, setViewMode] = useState('body'); // 'body' | 'skeleton'
  const [isTransforming, setIsTransforming] = useState(false);
  const [currentOrbit, setCurrentOrbit] = useState(null);
  const [currentTarget, setCurrentTarget] = useState(null);
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
      if (model && !selectedPart) {
        model.autoRotate = true;
      }
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
      // Zoom cinemático y preciso hacia la articulación seleccionada
      modelRef.current.cameraTarget = part.zoomTarget || part.position;
      modelRef.current.cameraOrbit = part.zoomOrbit || 'auto auto 0.65m';
    }
  };

  const handleClosePanel = () => {
    setSelectedPart(null);
    if (modelRef.current) {
      // Regreso suave a vista completa del cuerpo y reanudación de rotación automática continua
      modelRef.current.cameraTarget = 'auto auto auto';
      modelRef.current.cameraOrbit = '0deg 75deg 105%';
      modelRef.current.autoRotate = true;
    }
  };

  const handleToggleMode = (newMode) => {
    if (newMode === viewMode || isTransforming) return;
    const model = modelRef.current;
    if (model) {
      try {
        const orbit = model.getCameraOrbit();
        const target = model.getCameraTarget();
        if (orbit) {
          setCurrentOrbit(`${orbit.theta}rad ${orbit.phi}rad ${orbit.radius}m`);
        }
        if (target) {
          setCurrentTarget(`${target.x}m ${target.y}m ${target.z}m`);
        }
      } catch (e) {
        console.warn('Could not read camera:', e);
      }
    }

    setIsTransforming(true);

    // Transición cinemática: destello de rayos X y cambio de modelo manteniendo rotación automática
    setTimeout(() => {
      setViewMode(newMode);
      if (modelRef.current && !selectedPart) {
        modelRef.current.autoRotate = true;
      }
      setTimeout(() => {
        setIsTransforming(false);
      }, 550);
    }, 380);
  };

  const partProducts = selectedPart
    ? products.filter((p) => {
        if (!p.bodyPart) return false;
        if (Array.isArray(p.bodyPart)) {
          return p.bodyPart.includes(selectedPart.id);
        }
        return p.bodyPart === selectedPart.id;
      })
    : [];

  return (
    <div className={`anatomy-container ${viewMode === 'skeleton' ? 'mode-skeleton-active' : ''}`}>
      <div className="model-wrapper-kiosk">
        <model-viewer
          ref={modelRef}
          src={viewMode === 'body' ? '/assets/Model_Human.glb' : '/assets/Model_Skeleton.glb'}
          alt={viewMode === 'body' ? 'Modelo Humano Anatómico Tynor' : 'Sistema Esquelético Humano 3D Tynor'}
          shadow-intensity="0"
          shadow-softness="0"
          environment-image="neutral"
          tone-mapping="neutral"
          exposure={viewMode === 'skeleton' ? '1.08' : '1'}
          interpolation-decay="100"
          min-scale="0.25"
          power-preference="high-performance"
          camera-controls
          auto-rotate
          auto-rotate-delay="1500"
          rotation-per-second="18deg"
          interaction-prompt="none"
          loading="eager"
          reveal="auto"
          camera-orbit={currentOrbit || undefined}
          camera-target={currentTarget || undefined}
          className={`model-viewer-elem ${isTransforming ? 'transforming-xray' : ''} ${viewMode === 'skeleton' ? 'mode-skeleton' : ''}`}
          style={{ width: '100%', height: '100%', display: 'block' }}
        >
          <div slot="progress-bar" className={`model-loading-indicator ${isLoaded ? 'hide' : ''}`}>
            <div className="model-spinner" />
            <div className="model-loading-text">
              <span>Cargando Modelo 3D...</span>
              <span className="model-loading-pct">{loadProgress}%</span>
            </div>
          </div>

          {BODY_PARTS.map((part) => {
            const isSelected = selectedPart?.id === part.id;
            return (
              <button
                key={part.id}
                className={`Hotspot ${isSelected ? 'active-hotspot' : ''}`}
                slot={part.hotspotId}
                data-position={part.position}
                data-normal={part.normal}
                onClick={() => handleHotspotClick(part)}
                aria-label={`Explorar soluciones para ${part.name}`}
                title={`Ver productos para ${part.name}`}
              >
                {part.label}
              </button>
            );
          })}
        </model-viewer>

        {isTransforming && (
          <div className="xray-scanner-effect">
            <div className="xray-laser-beam" />
            <div className="xray-flash-glare" />
            <div className="xray-scan-hud">
              <span className="xray-hud-text">
                {viewMode === 'body' ? '⚡ ESCANEANDO SISTEMA ÓSEO...' : '🧬 RECONSTRUYENDO TEJIDO MUSCULAR...'}
              </span>
            </div>
          </div>
        )}

        <div className="anatomy-layer-toggle-container">
          <div className="anatomy-layer-switch" role="group" aria-label="Modo de visualización anatómica">
            <button
              className={`anatomy-layer-btn ${viewMode === 'body' ? 'active' : ''}`}
              onClick={() => handleToggleMode('body')}
              disabled={isTransforming}
              title="Ver masa muscular y superficie anatómica"
            >
              <Activity size={14} />
              <span>Cuerpo 3D</span>
            </button>
            <button
              className={`anatomy-layer-btn ${viewMode === 'skeleton' ? 'active' : ''}`}
              onClick={() => handleToggleMode('skeleton')}
              disabled={isTransforming}
              title="Transformar al sistema esquelético óseo"
            >
              <Bone size={14} />
              <span>Esqueleto</span>
            </button>
          </div>
        </div>

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
              Toca los números para zoom en cada articulación. Usa el selector superior para transformar entre el Cuerpo 3D y el Esqueleto con efecto Rayos X.
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--brand)', textTransform: 'uppercase' }}>
                Zona Anatómica {selectedPart ? `#${selectedPart.label}` : ''}
              </span>
              {partProducts.length > 0 && (
                <span className="badge-count" style={{ position: 'static' }}>
                  {partProducts.length}
                </span>
              )}
            </div>
            <h3>{selectedPart ? selectedPart.name : ''}</h3>
            {selectedPart?.desc && (
              <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.78rem', color: 'var(--ink-secondary)' }}>
                {selectedPart.desc}
              </p>
            )}
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
                  <div style={{ fontSize: '0.8rem', color: 'var(--brand)', fontWeight: 600 }}>
                    Consultar Precio
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
