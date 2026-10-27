import React, { useState, useRef } from 'react';
import { Search, X, Plus, Check, FileText, Video, Keyboard } from 'lucide-react';
import { Capacitor } from '@capacitor/core';
import { CATEGORIES } from '../data/products';
import TouchKeyboard from './TouchKeyboard';

export default function CatalogView({
  products,
  category,
  setCategory,
  query,
  setQuery,
  interestList,
  onToggleInterest,
  onSelectProduct
}) {
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const searchInputRef = useRef(null);

  const isNativeMobile = typeof window !== 'undefined' && (Capacitor.isNativePlatform() || /Android|iPhone|iPad|iPod/i.test(navigator.userAgent));

  const filteredProducts = products.filter((p) => {
    const matchesCat = category === 'todos' || p.cat === category;
    const q = query.trim().toLowerCase();
    const matchesQuery = !q || p.name.toLowerCase().includes(q) || p.code.toLowerCase().includes(q);
    return matchesCat && matchesQuery;
  });

  const formatPrice = () => 'Consultar Precio';

  const handleOpenKeyboard = () => {
    if (isNativeMobile) return;
    setIsKeyboardOpen(true);
  };

  return (
    <div className="catalog-container">
      <div className="kiosk-filter-bar">
        <div className="filter-pills">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              className={`filter-pill ${category === cat.id ? 'active' : ''}`}
              onClick={() => setCategory(cat.id)}
            >
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        <div className="kiosk-search">
          <Search size={18} className="kiosk-search-icon" />
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Buscar por nombre o código…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={handleOpenKeyboard}
            onClick={handleOpenKeyboard}
          />
          <div className="kiosk-search-actions">
            {query && (
              <button
                type="button"
                className="kiosk-search-clear"
                onClick={() => setQuery('')}
                aria-label="Limpiar búsqueda"
                title="Limpiar texto"
              >
                <X size={16} />
              </button>
            )}
            {!isNativeMobile && (
              <button
                type="button"
                className={`kiosk-search-kb-btn ${isKeyboardOpen ? 'active' : ''}`}
                onClick={() => setIsKeyboardOpen((prev) => !prev)}
                aria-label="Alternar teclado en pantalla"
                title={isKeyboardOpen ? 'Ocultar teclado táctil' : 'Abrir teclado táctil'}
              >
                <Keyboard size={18} />
              </button>
            )}
          </div>
        </div>
      </div>

      {!isNativeMobile && (
        <TouchKeyboard
          isOpen={isKeyboardOpen}
          value={query}
          onChange={(val) => setQuery(val)}
          onClose={() => setIsKeyboardOpen(false)}
          placeholder="Buscar por nombre o código..."
        />
      )}

      <div className="products-scroll">
        {filteredProducts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 1rem', color: 'var(--ink-secondary)' }}>
            <Search size={48} style={{ opacity: 0.35, marginBottom: '1rem' }} />
            <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--ink)' }}>No se encontraron productos</h3>
            <p style={{ margin: 0 }}>Prueba con otro término o selecciona "Todos los productos".</p>
          </div>
        ) : (
          <div className="products-grid">
            {filteredProducts.map((p) => {
              const inList = interestList.includes(p.code);
              return (
                <div
                  key={p.code}
                  className="kiosk-card"
                  onClick={() => {
                    setIsKeyboardOpen(false);
                    onSelectProduct(p);
                  }}
                >
                  <div className="kiosk-card-img-wrap">
                    {p.badge && <span className="card-badge">{p.badge}</span>}
                    <img
                      src={`/assets/${p.code}.png`}
                      alt={p.name}
                      className="kiosk-card-img"
                      loading="lazy"
                    />
                    <div className="card-media-indicators">
                      {p.hasPdf && (
                        <span className="media-tag" title="Ficha Técnica PDF Disponible">
                          <FileText size={12} /> PDF
                        </span>
                      )}
                      {p.hasVideo && (
                        <span className="media-tag" title="Video Demostrativo Disponible">
                          <Video size={12} /> VIDEO
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="kiosk-card-body">
                    <span className="kiosk-card-cat">
                      Ref. {p.code} • {p.cat}
                    </span>
                    <h3 className="kiosk-card-title">{p.name}</h3>
                    <p className="kiosk-card-desc">{p.shortDesc}</p>

                    {/* Previsualización de Tallas y Colores Disponibles */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginTop: '0.25rem', marginBottom: '0.35rem', flexWrap: 'wrap' }}>
                      {p.colors && p.colors.length > 0 && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', background: 'var(--bg-surface-raised)', padding: '0.15rem 0.4rem', borderRadius: 'var(--radius-pill)', border: '1px solid var(--border)' }} title="Colores Disponibles">
                          {p.colors.map((c) => (
                            <span
                              key={c.id}
                              style={{
                                width: 10,
                                height: 10,
                                borderRadius: '50%',
                                backgroundColor: c.hex,
                                display: 'inline-block',
                                border: '1px solid rgba(0,0,0,0.15)'
                              }}
                            />
                          ))}
                          <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--ink-secondary)' }}>
                            {p.colors.length} col.
                          </span>
                        </div>
                      )}
                      {p.sizes && p.sizes.length > 0 && (
                        <span style={{ fontSize: '0.71rem', fontWeight: 700, color: 'var(--ink-secondary)', background: 'var(--bg-surface-raised)', padding: '0.15rem 0.45rem', borderRadius: 'var(--radius-pill)', border: '1px solid var(--border)' }}>
                          {p.sizes.length === 1 ? `Talla ${p.sizes[0]}` : `${p.sizes.length} tallas (${p.sizes.join(', ')})`}
                        </span>
                      )}
                    </div>

                    <div className="kiosk-card-footer">
                      <span className={`kiosk-card-price ${p.price == null ? 'consult' : ''}`}>
                        {formatPrice(p.price)}
                      </span>

                      <button
                        className={`kiosk-add-btn ${inList ? 'in-list' : ''}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleInterest(p.code);
                        }}
                      >
                        {inList ? <Check size={16} /> : <Plus size={16} />}
                        <span>{inList ? 'En lista' : 'Agregar'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
