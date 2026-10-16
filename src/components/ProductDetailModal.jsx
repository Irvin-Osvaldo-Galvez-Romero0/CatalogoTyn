import React from 'react';
import { X, Check, Plus, FileText, Video, Sparkles, CheckCircle2 } from 'lucide-react';

export default function ProductDetailModal({
  product,
  onClose,
  interestList,
  onToggleInterest,
  onOpenMedia
}) {
  if (!product) return null;

  const inList = interestList.includes(product.code);
  const formatPrice = (v) => (v == null ? 'Consultar precio con asesor' : `$${v.toFixed(2)} MXN`);

  return (
    <div className="modal-overlay open" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-visual">
          {product.badge && <span className="card-badge">{product.badge}</span>}
          <img
            src={`/assets/${product.code}.png`}
            alt={product.name}
            className="modal-visual-img"
          />
        </div>

        <div className="modal-content">
          <div className="modal-top">
            <div>
              <span className="modal-ref">Referencia: {product.code}</span>
              <span style={{ marginLeft: '0.6rem', fontSize: '0.8rem', color: 'var(--ink-secondary)', textTransform: 'uppercase', fontWeight: 700 }}>
                {product.cat}
              </span>
            </div>
            <button
              className="kiosk-icon-btn"
              style={{ width: 44, height: 44 }}
              onClick={onClose}
              aria-label="Cerrar ventana"
            >
              <X size={20} />
            </button>
          </div>

          <h2 className="modal-title">{product.name}</h2>
          <div className="modal-price">{formatPrice(product.price)}</div>

          {product.sizes && (
            <div style={{ marginBottom: '1rem', display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--ink-secondary)' }}>Tallas:</span>
              {product.sizes.map((s) => (
                <span
                  key={s}
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    padding: '0.2rem 0.5rem',
                    background: 'var(--bg-surface-raised)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-sm)'
                  }}
                >
                  {s}
                </span>
              ))}
            </div>
          )}

          <div className="modal-section-title">Descripción Clínica</div>
          <p className="modal-text">{product.desc}</p>

          {product.uses && product.uses.length > 0 && (
            <>
              <div className="modal-section-title">Usos y Aplicaciones</div>
              <ul className="modal-list">
                {product.uses.map((use, idx) => (
                  <li key={idx}>{use}</li>
                ))}
              </ul>
            </>
          )}

          {product.features && product.features.length > 0 && (
            <>
              <div className="modal-section-title">Características Destacadas</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginBottom: '1.5rem' }}>
                {product.features.map((feat, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.88rem', color: 'var(--ink-secondary)' }}>
                    <CheckCircle2 size={16} color="var(--brand)" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </>
          )}

          <div className="modal-actions">
            <button
              className="btn-primary-kiosk"
              style={{
                backgroundColor: inList ? 'var(--brand-soft)' : 'var(--brand)',
                color: inList ? 'var(--brand)' : 'var(--brand-ink)',
                border: inList ? '2px solid var(--brand)' : 'none'
              }}
              onClick={() => onToggleInterest(product.code)}
            >
              {inList ? <Check size={20} /> : <Plus size={20} />}
              <span>{inList ? 'En tu lista de interés' : 'Agregar a mi lista'}</span>
            </button>

            {product.hasPdf && (
              <button
                className="btn-action-icon"
                onClick={() => onOpenMedia('pdf', `/pdf/${product.code}.pdf`, `Ficha Técnica: ${product.name}`)}
                title="Ver Ficha Técnica PDF"
              >
                <FileText size={22} color="var(--brand)" />
              </button>
            )}

            {product.hasVideo && (
              <button
                className="btn-action-icon"
                onClick={() => onOpenMedia('video', `/video/${product.code}.mp4`, `Video: ${product.name}`)}
                title="Ver Video Demostrativo"
              >
                <Video size={22} color="var(--brand)" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
