import React from 'react';
import { Search, X, Plus, Check, FileText, Video } from 'lucide-react';
import { CATEGORIES } from '../data/products';

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
  const filteredProducts = products.filter((p) => {
    const matchesCat = category === 'todos' || p.cat === category;
    const q = query.trim().toLowerCase();
    const matchesQuery = !q || p.name.toLowerCase().includes(q) || p.code.toLowerCase().includes(q);
    return matchesCat && matchesQuery;
  });

  const formatPrice = (v) => (v == null ? 'Consultar precio' : `$${v.toFixed(2)}`);

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
            type="text"
            placeholder="Buscar por nombre o código…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query && (
            <button
              className="kiosk-search-clear"
              onClick={() => setQuery('')}
              aria-label="Limpiar búsqueda"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

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
                  onClick={() => onSelectProduct(p)}
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
