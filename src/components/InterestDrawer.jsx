import React, { useState, useEffect } from 'react';
import { X, Trash2, QrCode as QrIcon, BookmarkCheck, UserCheck, Phone, ChevronDown } from 'lucide-react';
import QrExportModal from './QrExportModal';
import { DEFAULT_SALES_REPS } from '../data/salesReps';
import ModernSelect from './ModernSelect';

export default function InterestDrawer({
  isOpen,
  onClose,
  interestList,
  interestSelections = {},
  products,
  onToggleInterest,
  onClearInterest,
  onSelectProduct
}) {
  const [showQrModal, setShowQrModal] = useState(false);
  const [selectedRepId, setSelectedRepId] = useState(() => {
    return localStorage.getItem('tynor_selected_sales_rep') || DEFAULT_SALES_REPS[0]?.id || '';
  });

  const selectedRep = DEFAULT_SALES_REPS.find((r) => r.id === selectedRepId) || DEFAULT_SALES_REPS[0];

  const handleRepChange = (newId) => {
    setSelectedRepId(newId);
    try {
      localStorage.setItem('tynor_selected_sales_rep', newId);
    } catch (e) {
      console.warn('Could not persist sales rep:', e);
    }
  };

  const selectedProducts = interestList
    .map((code) => {
      const p = products.find((prod) => prod.code === code);
      if (!p) return null;
      const sel = interestSelections[code] || {};
      const defaultColors = p.colors && p.colors.length > 0 ? [p.colors[0].id] : [];
      const defaultSizes = p.sizes && p.sizes.length === 1 ? p.sizes : (p.sizes?.slice(0, 1) || ['Universal']);

      const selectedColors = sel.selectedColors && sel.selectedColors.length > 0
        ? sel.selectedColors
        : (sel.selectedColor ? [sel.selectedColor] : defaultColors);

      const selectedColorObjs = p.colors?.filter((c) => selectedColors.includes(c.id)) || [];

      return {
        ...p,
        selectedSizes: sel.selectedSizes && sel.selectedSizes.length > 0 ? sel.selectedSizes : defaultSizes,
        selectedColors: selectedColors,
        selectedColorNames: selectedColorObjs.map((c) => c.name),
        selectedColor: selectedColors[0] || null,
        selectedColorName: selectedColorObjs[0]?.name || null
      };
    })
    .filter(Boolean);

  return (
    <>
      <div
        className={`drawer-backdrop ${isOpen ? 'open' : ''}`}
        onClick={onClose}
      />

      <aside className={`kiosk-drawer ${isOpen ? 'open' : ''}`}>
        <div className="drawer-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <BookmarkCheck size={22} color="var(--brand)" />
            <h2>Mi Lista de Interés</h2>
          </div>
          <button
            className="kiosk-icon-btn"
            style={{ width: 44, height: 44 }}
            onClick={onClose}
            aria-label="Cerrar panel lateral"
          >
            <X size={20} />
          </button>
        </div>

        <div className="drawer-items-list">
          {selectedProducts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 1.5rem', color: 'var(--ink-secondary)' }}>
              <BookmarkCheck size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
              <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--ink)' }}>Tu lista está vacía</h3>
              <p style={{ margin: 0, fontSize: '0.9rem', lineHeight: 1.5 }}>
                Toca "Agregar a mi lista" en cualquier producto o férula del catálogo para guardarlo aquí y cotizarlo en el stand.
              </p>
            </div>
          ) : (
            selectedProducts.map((p) => (
              <div key={p.code} className="drawer-item">
                <div
                  className="drawer-item-img"
                  style={{ cursor: 'pointer' }}
                  onClick={() => {
                    onClose();
                    onSelectProduct(p);
                  }}
                >
                  <img src={`/assets/${p.code}.png`} alt={p.name} />
                </div>

                <div
                  className="drawer-item-details"
                  style={{ cursor: 'pointer' }}
                  onClick={() => {
                    onClose();
                    onSelectProduct(p);
                  }}
                >
                  <div className="drawer-item-code">Ref. {p.code}</div>
                  <div className="drawer-item-name">{p.name}</div>
                  
                  {/* Badges de Colores y Tallas Seleccionadas */}
                  <div className="drawer-item-tags">
                    {p.selectedColors && p.selectedColors.length > 0 && (
                      <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
                        {p.selectedColors.map((cid) => {
                          const cObj = p.colors?.find((c) => c.id === cid);
                          return (
                            <span key={cid} className="drawer-tag-color" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                              <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: cObj?.hex || '#64748B', display: 'inline-block', border: '1px solid rgba(0,0,0,0.15)' }} />
                              <span>{cObj?.name || cid} ({p.code}{cid})</span>
                            </span>
                          );
                        })}
                      </div>
                    )}
                    {p.selectedSizes && p.selectedSizes.length > 0 && (
                      <span className="drawer-tag-size">
                        Tallas: {p.selectedSizes.join(', ')}
                      </span>
                    )}
                  </div>

                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--brand)', marginTop: '0.2rem' }}>
                    Consultar Precio
                  </div>
                </div>

                <button
                  className="drawer-item-remove"
                  onClick={() => onToggleInterest(p.code)}
                  aria-label={`Eliminar ${p.name}`}
                  title="Quitar de la lista"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))
          )}
        </div>

        {selectedProducts.length > 0 && (
          <div className="drawer-footer">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--ink-secondary)' }}>
                Total seleccionados:
              </span>
              <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--brand)' }}>
                {selectedProducts.length} {selectedProducts.length === 1 ? 'producto' : 'productos'}
              </span>
            </div>

            {/* Selector de Vendedor / Asesor para WhatsApp con ModernSelect */}
            <div className="sales-rep-selector-box" style={{ marginBottom: '1rem' }}>
              <label className="sales-rep-label" style={{ marginBottom: '0.45rem', display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.82rem', fontWeight: 700, color: '#10B4C1' }}>
                <UserCheck size={16} color="var(--brand)" />
                <span>Asignar Vendedor / Asesor:</span>
              </label>
              <ModernSelect
                options={DEFAULT_SALES_REPS}
                value={selectedRep?.id || ''}
                onChange={handleRepChange}
                dropUp={true}
              />
            </div>

            <button
              className="drawer-btn-qr"
              onClick={() => setShowQrModal(true)}
            >
              <QrIcon size={22} />
              <span>Enviar Pedido a WhatsApp (QR)</span>
            </button>

            <div className="drawer-footer-actions" style={{ gridTemplateColumns: '1fr' }}>
              <button
                className="drawer-btn-secondary"
                onClick={onClearInterest}
                style={{ color: '#EF4444', width: '100%', justifyContent: 'center' }}
              >
                <Trash2 size={18} />
                <span>Vaciar Lista de Interés</span>
              </button>
            </div>
          </div>
        )}
      </aside>

      {showQrModal && (
        <QrExportModal
          items={selectedProducts}
          initialRepId={selectedRep?.id}
          onRepChange={handleRepChange}
          onClose={() => setShowQrModal(false)}
        />
      )}
    </>
  );
}
