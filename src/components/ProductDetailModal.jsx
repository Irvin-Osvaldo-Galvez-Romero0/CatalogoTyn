import React, { useState, useEffect } from 'react';
import { X, Check, Plus, FileText, Video, Sparkles, CheckCircle2, Layers, Palette } from 'lucide-react';

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

  // Multi-color selection state
  const hasColors = product.colors && product.colors.length > 0;
  const initialColors = currentSaved.selectedColors && currentSaved.selectedColors.length > 0
    ? currentSaved.selectedColors
    : (currentSaved.selectedColor ? [currentSaved.selectedColor] : (hasColors ? [product.colors[0].id] : []));
  const [selectedColors, setSelectedColors] = useState(initialColors);

  // Multi-size selection state
  const hasSizes = product.sizes && product.sizes.length > 0;
  const initialSizes = currentSaved.selectedSizes && currentSaved.selectedSizes.length > 0
    ? currentSaved.selectedSizes
    : (hasSizes ? [product.sizes[0]] : ['Universal']);
  const [selectedSizes, setSelectedSizes] = useState(initialSizes);

  // Reset or sync when product changes
  useEffect(() => {
    const saved = interestSelections[product.code] || {};
    const colors = saved.selectedColors && saved.selectedColors.length > 0
      ? saved.selectedColors
      : (saved.selectedColor ? [saved.selectedColor] : (product.colors && product.colors.length > 0 ? [product.colors[0].id] : []));
    setSelectedColors(colors);

    const sizes = saved.selectedSizes && saved.selectedSizes.length > 0
      ? saved.selectedSizes
      : (product.sizes && product.sizes.length > 0 ? [product.sizes[0]] : ['Universal']);
    setSelectedSizes(sizes);
  }, [product.code, interestSelections]);

  const handleToggleColor = (colorId) => {
    setSelectedColors((prev) => {
      if (prev.includes(colorId)) {
        if (prev.length === 1) return prev; // Mantener al menos un color seleccionado
        return prev.filter((id) => id !== colorId);
      } else {
        return [...prev, colorId];
      }
    });
  };

  const handleToggleAllColors = () => {
    if (!product.colors) return;
    if (selectedColors.length === product.colors.length) {
      setSelectedColors([product.colors[0].id]);
    } else {
      setSelectedColors(product.colors.map((c) => c.id));
    }
  };

  const handleToggleSize = (size) => {
    setSelectedSizes((prev) => {
      if (prev.includes(size)) {
        if (prev.length === 1) return prev; // Mantener al menos una talla seleccionada
        return prev.filter((s) => s !== size);
      } else {
        return [...prev, size];
      }
    });
  };

  const handleToggleAllSizes = () => {
    if (!product.sizes) return;
    if (selectedSizes.length === product.sizes.length) {
      setSelectedSizes([product.sizes[0]]);
    } else {
      setSelectedSizes([...product.sizes]);
    }
  };

  const handleAddToCartOrUpdate = () => {
    const selectedColorObjs = product.colors?.filter((c) => selectedColors.includes(c.id)) || [];
    const selection = {
      selectedSizes: selectedSizes.length > 0 ? selectedSizes : ['Universal'],
      selectedColors: selectedColors,
      selectedColorNames: selectedColorObjs.map((c) => c.name),
      selectedColor: selectedColors[0] || null,
      selectedColorName: selectedColorObjs[0]?.name || null
    };
    onToggleInterest(product.code, selection);
  };

  const handleRemoveFromList = () => {
    onToggleInterest(product.code, null); // remove
  };

  const formatPrice = () => 'Consultar Precio';

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

          {/* Selector de Colores Múltiples (ej. Naranja y Verde) */}
          {hasColors && (
            <div className="product-modal-selector-group">
              <div className="product-modal-group-header">
                <span className="product-modal-group-title" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Palette size={16} color="var(--brand)" />
                  <span>Colores Disponibles:</span>
                </span>
                <div className="product-modal-group-actions">
                  <span className="product-modal-selected-count">
                    {selectedColors.length} {selectedColors.length === 1 ? 'color seleccionado' : 'colores seleccionados'}
                  </span>
                  {product.colors.length > 1 && (
                    <button
                      type="button"
                      className="product-modal-quick-btn"
                      onClick={handleToggleAllColors}
                    >
                      {selectedColors.length === product.colors.length ? 'Limpiar' : 'Seleccionar todos'}
                    </button>
                  )}
                </div>
              </div>
              <div className="product-modal-color-pills">
                {product.colors.map((c) => {
                  const isSel = selectedColors.includes(c.id);
                  return (
                    <button
                      key={c.id}
                      type="button"
                      className={`product-color-pill ${isSel ? 'selected' : ''}`}
                      onClick={() => handleToggleColor(c.id)}
                      aria-pressed={isSel}
                    >
                      <span className="product-color-dot" style={{ backgroundColor: c.hex, border: c.border ? `1px solid ${c.border}` : '1px solid rgba(0,0,0,0.2)' }} />
                      <span className="product-color-name">{c.name}</span>
                      <span className="product-color-sku">({product.code}{c.id})</span>
                      {isSel && <Check size={14} className="product-color-check" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Selector de Tallas Múltiples para Cotización */}
          {hasSizes && (
            <div className="product-modal-selector-group">
              <div className="product-modal-group-header">
                <span className="product-modal-group-title" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Layers size={16} color="var(--brand)" />
                  <span>Tallas para Cotización:</span>
                </span>
                <div className="product-modal-group-actions">
                  <span className="product-modal-selected-count">
                    {selectedSizes.length} {selectedSizes.length === 1 ? 'talla seleccionada' : 'tallas seleccionadas'}
                  </span>
                  {product.sizes.length > 1 && (
                    <button
                      type="button"
                      className="product-modal-quick-btn"
                      onClick={handleToggleAllSizes}
                    >
                      {selectedSizes.length === product.sizes.length ? 'Limpiar' : 'Seleccionar todas'}
                    </button>
                  )}
                </div>
              </div>
              <div className="product-modal-sizes-grid">
                {product.sizes.map((s) => {
                  const isSelected = selectedSizes.includes(s);
                  return (
                    <button
                      key={s}
                      type="button"
                      className={`product-size-chip ${isSelected ? 'selected' : ''}`}
                      onClick={() => handleToggleSize(s)}
                      aria-pressed={isSelected}
                    >
                      <div className="product-size-check-box">
                        {isSelected ? <Check size={14} strokeWidth={3} /> : null}
                      </div>
                      <span className="product-size-label">{s}</span>
                    </button>
                  );
                })}
              </div>
              <p className="product-modal-size-hint">
                * Toca las tallas que desees para incluirlas en tu cotización por WhatsApp o código QR.
              </p>
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
              className={`btn-primary-kiosk ${inList ? 'in-list' : ''}`}
              onClick={handleAddToCartOrUpdate}
            >
              {inList ? <Check size={20} strokeWidth={2.8} /> : <Plus size={20} strokeWidth={2.5} />}
              <span>
                {inList
                  ? `Actualizar cotización (${selectedSizes.length} ${selectedSizes.length === 1 ? 'talla' : 'tallas'})`
                  : `Agregar a cotización (${selectedSizes.length} ${selectedSizes.length === 1 ? 'talla' : 'tallas'})`}
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
