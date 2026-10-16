import React, { useState, useRef } from 'react';
import '@google/model-viewer';
import { X, ArrowRight, Eye, ShieldAlert } from 'lucide-react';
import { BODY_PARTS } from '../data/products';

export default function AnatomyView({
  products,
  onSelectProduct,
  interestList,
  onToggleInterest
}) {
  const [selectedPart, setSelectedPart] = useState(null);
  const modelRef = useRef(null);

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
          shadow-intensity="1"
          camera-controls
          auto-rotate
          rotation-per-second="5deg"
          interaction-prompt="none"
          loading="eager"
          style={{ width: '100%', height: '100%', display: 'block' }}
        >
          <div slot="progress-bar" className="model-loading-indicator">
            <div className="model-spinner" />
            <span>Cargando Modelo 3D...</span>
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

        <div className="anatomy-hud-guide">
          <h4>💡 Exploración Anatómica 3D</h4>
          <p>
            Toca cualquiera de los números intermitentes en el cuerpo para descubrir los soportes y
            ortesis diseñados para esa articulación. Puedes arrastrar para rotar el modelo.
          </p>
        </div>
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
