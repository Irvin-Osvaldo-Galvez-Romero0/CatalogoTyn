import React, { useState } from 'react';
import { normalizeColor } from '../utils/colorUtils';
import {
  X,
  Trash2,
  QrCode as QrIcon,
  BookmarkCheck,
  UserCheck,
  Mail,
  Plus,
  Minus
} from 'lucide-react';
import QrExportModal from './QrExportModal';
import EmailQuoteModal from './EmailQuoteModal';
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
  const [showEmailModal, setShowEmailModal] = useState(false);

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

  // Mapear productos seleccionados desglosando variantes compuestas
  const selectedProducts = interestList
    .map((code) => {
      const p = products.find((prod) => String(prod.code) === String(code));
      if (!p) return null;
      const sel = interestSelections[code] || {};

      let variants = sel.variants;
      if (!variants || variants.length === 0) {
        const fallbackSize = sel.selectedSizes?.[0] || (p.sizes?.[0] || 'Universal');
        const prodColors = (p.colors || []).map(normalizeColor).filter(Boolean);
        const fallbackColorId = sel.selectedColor || (prodColors?.[0]?.id || null);
        const fallbackColorObj = prodColors?.find((c) => c.id === fallbackColorId);
        const fallbackQty = Math.max(1, Number(sel.quantity) || 1);

        variants = [{
          id: `${p.code}-${fallbackSize}-${fallbackColorId || 'def'}`,
          size: fallbackSize,
          colorId: fallbackColorId,
          colorName: fallbackColorObj?.name || null,
          colorHex: fallbackColorObj?.hex || null,
          quantity: fallbackQty
        }];
      }

      const totalQty = variants.reduce((sum, v) => sum + (v.quantity || 1), 0);
      const allSizes = Array.from(new Set(variants.map((v) => v.size)));
      const allColors = Array.from(new Set(variants.map((v) => v.colorName).filter(Boolean)));

      return {
        ...p,
        quantity: totalQty,
        variants: variants,
        selectedSizes: allSizes,
        selectedColorNames: allColors
      };
    })
    .filter(Boolean);

  // Totales globales de piezas y dinero calculando precios dinámicos por talla (priceBySize)
  const totalPiezas = selectedProducts.reduce((sum, item) => sum + (item.quantity || 1), 0);
  const totalCost = selectedProducts.reduce((sum, item) => {
    if (item.variants && item.variants.length > 0) {
      const itemSum = item.variants.reduce((vSum, v) => {
        const variantPrice = item.priceBySize?.[v.size] ?? (Number(item.price) || 0);
        return vSum + (variantPrice * (v.quantity || 1));
      }, 0);
      return sum + itemSum;
    }
    const pPrice = Number(item.price) || 0;
    return sum + (pPrice * (item.quantity || 1));
  }, 0);

  const formattedTotal = new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN'
  }).format(totalCost);

  // Manejo de actualización de piezas de una variante específica dentro del drawer
  const handleUpdateVariantInDrawer = (productCode, variantIdx, delta) => {
    const currentSel = interestSelections[productCode] || {};
    const item = selectedProducts.find((p) => p.code === productCode);
    if (!item) return;

    let updatedVariants = [...item.variants];
    const target = updatedVariants[variantIdx];
    const newQty = (target.quantity || 1) + delta;

    if (newQty <= 0) {
      if (updatedVariants.length === 1) {
        onToggleInterest(productCode, null);
        return;
      }
      updatedVariants = updatedVariants.filter((_, i) => i !== variantIdx);
    } else {
      updatedVariants[variantIdx] = { ...target, quantity: newQty };
    }

    const newTotalQty = updatedVariants.reduce((sum, v) => sum + (v.quantity || 1), 0);
    const allSizes = Array.from(new Set(updatedVariants.map((v) => v.size)));
    const allColorNames = Array.from(new Set(updatedVariants.map((v) => v.colorName).filter(Boolean)));
    const allColorIds = Array.from(new Set(updatedVariants.map((v) => v.colorId).filter(Boolean)));

    onToggleInterest(productCode, {
      ...currentSel,
      quantity: newTotalQty,
      variants: updatedVariants,
      selectedSizes: allSizes,
      selectedColors: allColorIds,
      selectedColorNames: allColorNames
    });
  };

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
            <h2>Mi Lista de Deseos</h2>
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
                Toca "Agregar a cotización" en cualquier producto del catálogo para guardarlo aquí y cotizarlo en el stand.
              </p>
            </div>
          ) : (
            selectedProducts.map((p) => {
              const itemPriceNum = Number(p.price) || 0;
              const imgSrc = p.customImage || `/assets/${p.code}.png`;

              return (
                <div key={p.code} className="drawer-item" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', width: '100%' }}>
                    <div
                      className="drawer-item-img"
                      style={{ cursor: 'pointer' }}
                      onClick={() => {
                        onClose();
                        onSelectProduct(p);
                      }}
                    >
                      <img
                        src={imgSrc}
                        alt={p.name}
                        onError={(e) => { e.currentTarget.src = '/assets/logo.png'; }}
                      />
                    </div>

                    <div
                      className="drawer-item-details"
                      style={{ cursor: 'pointer', flex: 1 }}
                      onClick={() => {
                        onClose();
                        onSelectProduct(p);
                      }}
                    >
                      <div className="drawer-item-code">
                        Ref. {p.code} • <span style={{ color: 'var(--brand)', fontWeight: 800 }}>{p.marca || 'Tynor'}</span>
                      </div>
                      <div className="drawer-item-name">{p.name}</div>
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

                  {/* DESGLOSE DE VARIANTES COMPUESTAS */}
                  <div style={{ marginTop: '0.6rem', padding: '0.5rem', background: 'var(--bg-surface)', borderRadius: '12px', border: '1px solid var(--border)' }}>
                    <span style={{ fontSize: '0.74rem', fontWeight: 800, color: 'var(--ink-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: '0.35rem' }}>
                      Variantes Solicitadas:
                    </span>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                      {p.variants.map((v, vIdx) => {
                        const variantSubtotal = itemPriceNum * (v.quantity || 1);
                        return (
                          <div
                            key={v.id || vIdx}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              background: 'var(--bg-surface-raised)',
                              padding: '0.3rem 0.5rem',
                              borderRadius: '8px',
                              fontSize: '0.8rem'
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                              {v.colorHex && (
                                <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: v.colorHex, border: '1px solid rgba(0,0,0,0.2)' }} />
                              )}
                              <span style={{ fontWeight: 800, color: 'var(--ink)' }}>{v.size}</span>
                              {v.colorName && <span style={{ color: 'var(--ink-secondary)', fontSize: '0.76rem' }}>({v.colorName})</span>}
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                              {itemPriceNum > 0 && (
                                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#059669' }}>
                                  {new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(variantSubtotal)}
                                </span>
                              )}
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', background: 'var(--bg-surface)', padding: '0.1rem 0.25rem', borderRadius: '14px', border: '1px solid var(--border)' }}>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleUpdateVariantInDrawer(p.code, vIdx, -1);
                                  }}
                                  style={{ width: 20, height: 20, borderRadius: '50%', border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--ink)' }}
                                >
                                  <Minus size={11} />
                                </button>
                                <span style={{ minWidth: 18, textAlign: 'center', fontWeight: 800, fontSize: '0.78rem', color: 'var(--ink)' }}>
                                  {v.quantity || 1}
                                </span>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleUpdateVariantInDrawer(p.code, vIdx, 1);
                                  }}
                                  style={{ width: 20, height: 20, borderRadius: '50%', border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--brand)' }}
                                >
                                  <Plus size={11} />
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {selectedProducts.length > 0 && (
          <div className="drawer-footer">
            {/* Contador de Productos y Suma Total de Costos */}
            <div
              style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border)',
                borderRadius: '12px',
                padding: '0.6rem 0.85rem',
                marginBottom: '0.65rem'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--ink-secondary)' }}>
                  Total de artículos:
                </span>
                <span style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--ink)' }}>
                  {totalPiezas} {totalPiezas === 1 ? 'pieza' : 'piezas'} ({selectedProducts.length} {selectedProducts.length === 1 ? 'modelo' : 'modelos'})
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--ink)' }}>
                  Suma Total Estimada:
                </span>
                <span style={{ fontSize: '1.25rem', fontWeight: 900, color: '#059669' }}>
                  {formattedTotal}
                </span>
              </div>
            </div>

            {/* Selector de Asesor Asignado */}
            <div className="sales-rep-selector-box" style={{ marginBottom: '0.65rem' }}>
              <label className="sales-rep-label" style={{ marginBottom: '0.45rem', display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.82rem', fontWeight: 700, color: 'var(--brand)' }}>
                <UserCheck size={16} />
                <span>Asignar Vendedor / Asesor:</span>
              </label>
              <ModernSelect
                options={DEFAULT_SALES_REPS}
                value={selectedRep?.id || ''}
                onChange={handleRepChange}
                dropUp={true}
              />
            </div>

            {/* Botón Principal Destacado: Enviar Pedido a WhatsApp */}
            <button
              onClick={() => {
                setShowQrModal(true);
                if (onClose) onClose();
              }}
              style={{
                width: '100%',
                height: 52,
                borderRadius: 'var(--radius-pill)',
                background: '#25D366',
                color: '#FFFFFF',
                border: 'none',
                fontWeight: 900,
                fontSize: '0.98rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.6rem',
                cursor: 'pointer',
                boxShadow: '0 8px 20px -4px rgba(37, 211, 102, 0.45)',
                marginBottom: '0.65rem'
              }}
            >
              <QrIcon size={20} />
              <span>Enviar Pedido a WhatsApp</span>
            </button>

            {/* Acciones Secundarias */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem', marginBottom: '0.65rem' }}>
              <button
                onClick={() => {
                  setShowEmailModal(true);
                  if (onClose) onClose();
                }}
                style={{
                  height: 44,
                  borderRadius: 'var(--radius-pill)',
                  border: '1px solid var(--border)',
                  background: 'var(--bg-surface-raised)',
                  color: 'var(--ink)',
                  fontWeight: 700,
                  fontSize: '0.82rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.4rem',
                  cursor: 'pointer'
                }}
              >
                <Mail size={16} color="var(--brand)" />
                <span>Mandar a Correo</span>
              </button>

              <button
                className="drawer-btn-secondary"
                onClick={onClearInterest}
                style={{ color: '#EF4444', justifyContent: 'center', height: 44, fontSize: '0.82rem' }}
              >
                <Trash2 size={16} />
                <span>Vaciar Lista</span>
              </button>
            </div>
          </div>
        )}
      </aside>

      {/* Modal QR de WhatsApp */}
      {showQrModal && (
        <QrExportModal
          items={selectedProducts}
          initialRepId={selectedRep?.id}
          onRepChange={handleRepChange}
          onClose={() => setShowQrModal(false)}
        />
      )}

      {/* Modal de Envío de Cotización por Correo */}
      {showEmailModal && (
        <EmailQuoteModal
          isOpen={showEmailModal}
          onClose={() => setShowEmailModal(false)}
          items={selectedProducts}
          totalAmount={totalCost}
          salesRep={selectedRep}
        />
      )}
    </>
  );
}
