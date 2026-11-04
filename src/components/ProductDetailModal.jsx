import React, { useState, useEffect, useMemo } from 'react';
import { normalizeColor } from '../utils/colorUtils';
import { X, Check, Plus, Minus, FileText, Video, Sparkles, CheckCircle2, Layers, Palette, Trash2, AlertCircle } from 'lucide-react';

export default function ProductDetailModal({
  product,
  onClose,
  interestList = [],
  interestSelections = {},
  onToggleInterest,
  onOpenMedia
}) {
  if (!product) return null;

  const inList = interestList.includes(product.code);
  const currentSaved = interestSelections[product.code] || {};

  const productColors = useMemo(() => {
    return Array.isArray(product.colors) ? product.colors.map(normalizeColor).filter(Boolean) : [];
  }, [product.colors]);

  const hasColors = productColors.length > 0;
  const hasSizes = product.sizes && product.sizes.length > 0;

  // Variantes compuestas configuradas: inicia VACÍO si no ha sido configurado previamente
  const [variantsList, setVariantsList] = useState(() => {
    if (currentSaved.variants && currentSaved.variants.length > 0) {
      return currentSaved.variants;
    }
    return [];
  });

  // Selector activo: VACÍO por defecto para obligar al usuario a elegir su talla / color
  const [activeSize, setActiveSize] = useState(() => (!hasSizes ? 'Universal' : ''));
  const [activeColorId, setActiveColorId] = useState('');
  const [activeQty, setActiveQty] = useState(1);
  const [validationError, setValidationError] = useState('');

  // Sincronizar si cambia el producto
  useEffect(() => {
    const saved = interestSelections[product.code] || {};
    if (saved.variants && saved.variants.length > 0) {
      setVariantsList(saved.variants);
    } else {
      setVariantsList([]);
    }
    setActiveSize(!hasSizes ? 'Universal' : '');
    setActiveColorId('');
    setActiveQty(1);
    setValidationError('');
  }, [product.code, interestSelections]);

  const activeColorObj = productColors.find((c) => c.id === activeColorId);

  // Agregar una nueva variante a la lista
  const handleAddVariant = () => {
    // Validar selección de talla si el producto maneja tallas
    if (hasSizes && !activeSize) {
      setValidationError('Por favor selecciona una medida / talla antes de agregar.');
      return;
    }

    // Validar selección de color si el producto tiene colores
    if (hasColors && !activeColorId) {
      setValidationError('Por favor selecciona un color antes de agregar.');
      return;
    }

    setValidationError('');

    const targetSize = activeSize || 'Universal';
    const targetColorId = activeColorId || null;
    const variantId = `${product.code}-${targetSize}-${targetColorId || 'def'}`;

    setVariantsList((prev) => {
      const existingIdx = prev.findIndex((v) => v.id === variantId || (v.size === targetSize && v.colorId === targetColorId));
      if (existingIdx >= 0) {
        const updated = [...prev];
        updated[existingIdx] = {
          ...updated[existingIdx],
          quantity: updated[existingIdx].quantity + activeQty
        };
        return updated;
      }
      return [
        ...prev,
        {
          id: variantId,
          size: targetSize,
          colorId: targetColorId,
          colorName: activeColorObj?.name || null,
          colorHex: activeColorObj?.hex || null,
          quantity: activeQty
        }
      ];
    });

    // Resetear selectores a vacío para la siguiente variante
    setActiveSize(!hasSizes ? 'Universal' : '');
    setActiveColorId('');
    setActiveQty(1);
  };

  // Modificar cantidad de una variante existente
  const handleUpdateVariantQty = (idx, delta) => {
    setVariantsList((prev) => {
      const updated = [...prev];
      const target = updated[idx];
      const newQty = target.quantity + delta;
      if (newQty <= 0) {
        return prev.filter((_, i) => i !== idx);
      }
      updated[idx] = { ...target, quantity: newQty };
      return updated;
    });
  };

  // Eliminar una variante
  const handleRemoveVariant = (idx) => {
    setVariantsList((prev) => prev.filter((_, i) => i !== idx));
  };

  // Totales de piezas y subtotal del producto con tarifas dinamicas por talla
  const totalProductPieces = variantsList.reduce((sum, v) => sum + (v.quantity || 1), 0);
  const totalProductCost = variantsList.reduce((sum, v) => {
    const vPrice = product.priceBySize?.[v.size] ?? (Number(product.price) || 0);
    return sum + (vPrice * (v.quantity || 1));
  }, 0);

  const handleAddToCartOrUpdate = () => {
    if (variantsList.length === 0) {
      setValidationError('Debes configurar y agregar al menos una combinación (talla, color y piezas) antes de cotizar.');
      return;
    }

    const allSizes = Array.from(new Set(variantsList.map((v) => v.size)));
    const allColorIds = Array.from(new Set(variantsList.map((v) => v.colorId).filter(Boolean)));
    const allColorNames = Array.from(new Set(variantsList.map((v) => v.colorName).filter(Boolean)));

    const selection = {
      quantity: totalProductPieces,
      variants: variantsList,
      selectedSizes: allSizes.length > 0 ? allSizes : ['Universal'],
      selectedColors: allColorIds,
      selectedColorNames: allColorNames,
      selectedColor: allColorIds[0] || null,
      selectedColorName: allColorNames[0] || null
    };

    onToggleInterest(product.code, selection);
  };

  const handleRemoveFromList = () => {
    onToggleInterest(product.code, null);
  };

  const formatPrice = (price) => {
    if (price != null && Number(price) > 0) {
      return new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN'
      }).format(Number(price));
    }
    return 'Precio Especial';
  };

  return (
    <div className="modal-overlay open" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-visual">
          {product.badge && <span className="card-badge">{product.badge}</span>}
          <img
            src={product.customImage || `/assets/${product.code}.png`}
            alt={product.name}
            className="modal-visual-img"
            onError={(e) => { e.currentTarget.src = '/assets/logo.png'; }}
          />
        </div>

        <div className="modal-content">
          <div className="modal-top">
            <div>
              <span className="modal-ref">Referencia: {product.code}</span>
              <span style={{ marginLeft: '0.6rem', fontSize: '0.8rem', color: 'var(--brand)', textTransform: 'uppercase', fontWeight: 800 }}>
                {product.marca || 'Tynor'}
              </span>
              <span style={{ marginLeft: '0.4rem', fontSize: '0.8rem', color: 'var(--ink-secondary)', textTransform: 'uppercase', fontWeight: 700 }}>
                • {product.cat}
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
          <div className="modal-price">
            {activeSize && product.priceBySize?.[activeSize] != null
              ? formatPrice(product.priceBySize[activeSize])
              : formatPrice(product.price)}
            {product.priceBySize && Object.keys(product.priceBySize).length > 0 && !activeSize && (
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--ink-secondary)', marginLeft: '0.5rem' }}>
                (Precio varía según medida)
              </span>
            )}
          </div>

          {/* CREADOR Y CONFIGURADOR DE VARIANTES (Talla + Color + Piezas) */}
          <div style={{
            background: 'var(--bg-surface-raised)',
            border: '1px solid var(--border)',
            borderRadius: '16px',
            padding: '1.1rem',
            marginBottom: '1.25rem'
          }}>
            <span style={{ fontSize: '0.86rem', fontWeight: 800, color: 'var(--ink)', display: 'block', marginBottom: '0.6rem' }}>
              Configurar Variantes para Cotización:
            </span>

            {/* Selector de Talla para la variante */}
            {hasSizes && (
              <div style={{ marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--ink-secondary)', display: 'block', marginBottom: '0.35rem' }}>
                  1. Selecciona Medida / Talla: {!activeSize && <span style={{ color: '#EF4444', fontWeight: 500 }}>(Elige una opción)</span>}
                </span>
                <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                  {product.sizes.map((s) => {
                    const isSelected = activeSize === s;
                    const sizeTariff = product.priceBySize?.[s];
                    return (
                      <button
                        key={s}
                        type="button"
                        onClick={() => {
                          setActiveSize(s);
                          setValidationError('');
                        }}
                        style={{
                          padding: '0.4rem 0.85rem',
                          borderRadius: '8px',
                          border: isSelected ? '2px solid var(--brand)' : '1px solid var(--border)',
                          background: isSelected ? 'var(--brand-muted, rgba(16,180,193,0.12))' : 'var(--bg-surface)',
                          color: isSelected ? 'var(--brand)' : 'var(--ink)',
                          fontWeight: isSelected ? 800 : 600,
                          fontSize: '0.82rem',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem'
                        }}
                      >
                        <span>{s}</span>
                        {sizeTariff != null && (
                          <span style={{
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            color: isSelected ? 'var(--brand)' : '#059669',
                            background: isSelected ? 'rgba(255,255,255,0.7)' : 'rgba(5, 150, 105, 0.08)',
                            padding: '1px 5px',
                            borderRadius: '4px'
                          }}>
                            {formatPrice(sizeTariff)}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Selector de Color para la variante */}
            {hasColors && (
              <div style={{ marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--ink-secondary)', display: 'block', marginBottom: '0.35rem' }}>
                  2. Selecciona Color: {!activeColorId && <span style={{ color: '#EF4444', fontWeight: 500 }}>(Elige un color)</span>}
                </span>
                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                  {productColors.map((c) => {
                    const isSel = activeColorId === c.id;
                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => {
                          setActiveColorId(c.id);
                          setValidationError('');
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          padding: '0.35rem 0.75rem',
                          borderRadius: '8px',
                          border: isSel ? '2px solid var(--brand)' : '1px solid var(--border)',
                          background: isSel ? 'var(--brand-muted, rgba(16,180,193,0.12))' : 'var(--bg-surface)',
                          color: isSel ? 'var(--brand)' : 'var(--ink)',
                          fontWeight: isSel ? 800 : 600,
                          fontSize: '0.8rem',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: c.hex, border: '1px solid rgba(0,0,0,0.15)' }} />
                        <span>{c.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Alerta de validación en caso de faltar selección */}
            {validationError && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                color: '#EF4444',
                fontSize: '0.78rem',
                fontWeight: 700,
                marginTop: '0.4rem',
                marginBottom: '0.4rem'
              }}>
                <AlertCircle size={15} />
                <span>{validationError}</span>
              </div>
            )}

            {/* Selector de Cantidad de piezas a sumar y Botón de Añadir */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem', marginTop: '0.85rem', paddingTop: '0.75rem', borderTop: '1px dashed var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--ink-secondary)' }}>Piezas:</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', background: 'var(--bg-surface)', padding: '0.2rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
                  <button
                    type="button"
                    onClick={() => setActiveQty((prev) => Math.max(1, prev - 1))}
                    disabled={activeQty <= 1}
                    style={{ width: 28, height: 28, borderRadius: '50%', border: 'none', background: 'transparent', cursor: activeQty <= 1 ? 'not-allowed' : 'pointer', color: 'var(--ink)' }}
                  >
                    <Minus size={14} />
                  </button>
                  <span style={{ minWidth: 26, textAlign: 'center', fontWeight: 800, fontSize: '0.95rem', color: 'var(--ink)' }}>{activeQty}</span>
                  <button
                    type="button"
                    onClick={() => setActiveQty((prev) => prev + 1)}
                    style={{ width: 28, height: 28, borderRadius: '50%', border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--brand)' }}
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={handleAddVariant}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '10px',
                  background: 'var(--brand)',
                  color: '#FFFFFF',
                  border: 'none',
                  fontWeight: 800,
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  boxShadow: 'var(--shadow-glow)'
                }}
              >
                <Plus size={16} />
                <span>+ Agregar Combinación</span>
              </button>
            </div>

            {/* Lista de Combinaciones Agregadas a la Cotización */}
            <div style={{ marginTop: '1rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--ink-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: '0.4rem' }}>
                Combinaciones Agregadas ({totalProductPieces} piezas en total):
              </span>

              {variantsList.length === 0 ? (
                <div style={{
                  padding: '0.85rem',
                  borderRadius: '10px',
                  background: 'var(--bg-surface)',
                  border: '1px dashed var(--border)',
                  textAlign: 'center',
                  color: 'var(--ink-secondary)',
                  fontSize: '0.8rem'
                }}>
                  Ninguna combinación agregada todavía. Selecciona tu talla/color arriba y toca "+ Agregar Combinación".
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  {variantsList.map((v, idx) => (
                    <div
                      key={v.id || idx}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        background: 'var(--bg-surface)',
                        border: '1px solid var(--border)',
                        borderRadius: '10px',
                        padding: '0.35rem 0.65rem',
                        fontSize: '0.82rem'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        {v.colorHex && (
                          <span style={{ width: 9, height: 9, borderRadius: '50%', backgroundColor: v.colorHex, border: '1px solid rgba(0,0,0,0.2)' }} />
                        )}
                        <span style={{ fontWeight: 800, color: 'var(--ink)' }}>{v.size}</span>
                        {v.colorName && <span style={{ color: 'var(--ink-secondary)' }}>• {v.colorName}</span>}
                        {product.priceBySize?.[v.size] && (
                          <span style={{ fontSize: '0.74rem', fontWeight: 700, color: '#059669', background: 'rgba(5, 150, 105, 0.08)', padding: '1px 6px', borderRadius: '4px', marginLeft: '0.2rem' }}>
                            {formatPrice(product.priceBySize[v.size])} c/u
                          </span>
                        )}
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                          <button
                            type="button"
                            onClick={() => handleUpdateVariantQty(idx, -1)}
                            style={{ width: 22, height: 22, borderRadius: '50%', border: 'none', background: 'var(--bg-surface-raised)', cursor: 'pointer', color: 'var(--ink)' }}
                          >
                            <Minus size={12} />
                          </button>
                          <span style={{ minWidth: 20, textAlign: 'center', fontWeight: 800, color: 'var(--brand)' }}>{v.quantity}</span>
                          <button
                            type="button"
                            onClick={() => handleUpdateVariantQty(idx, 1)}
                            style={{ width: 22, height: 22, borderRadius: '50%', border: 'none', background: 'var(--bg-surface-raised)', cursor: 'pointer', color: 'var(--brand)' }}
                          >
                            <Plus size={12} />
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemoveVariant(idx)}
                          style={{ border: 'none', background: 'none', color: '#EF4444', cursor: 'pointer', padding: '0 0.2rem' }}
                          title="Eliminar combinación"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Subtotal del producto */}
            {Number(product.price) > 0 && variantsList.length > 0 && (
              <div style={{ marginTop: '0.75rem', paddingTop: '0.6rem', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--ink-secondary)' }}>
                  Subtotal ({totalProductPieces} piezas):
                </span>
                <span style={{ fontSize: '1.05rem', fontWeight: 900, color: '#059669' }}>
                  {new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(totalProductCost)}
                </span>
              </div>
            )}
          </div>

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
              className={`btn-primary-kiosk ${inList ? 'in-list' : ''}`}
              onClick={handleAddToCartOrUpdate}
              disabled={variantsList.length === 0}
              style={{
                opacity: variantsList.length === 0 ? 0.6 : 1,
                cursor: variantsList.length === 0 ? 'not-allowed' : 'pointer'
              }}
            >
              {inList ? <Check size={20} strokeWidth={2.8} /> : <Plus size={20} strokeWidth={2.5} />}
              <span>
                {variantsList.length === 0
                  ? 'Configura tu combinación'
                  : inList
                    ? `Actualizar cotización (${totalProductPieces} pz${totalProductPieces > 1 ? 's' : ''})`
                    : `Agregar a cotización (${totalProductPieces} pz${totalProductPieces > 1 ? 's' : ''})`}
              </span>
            </button>

            {inList && (
              <button
                className="btn-action-icon"
                onClick={handleRemoveFromList}
                title="Quitar de mi lista"
                style={{ color: '#EF4444' }}
              >
                <X size={20} />
              </button>
            )}

            {(product.hasPdf || product.customPdfUrl) && (
              <button
                className="btn-action-icon"
                onClick={() => onOpenMedia('pdf', product.customPdfUrl || `/pdf/${product.code}.pdf`, `Ficha Técnica: ${product.name}`)}
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
