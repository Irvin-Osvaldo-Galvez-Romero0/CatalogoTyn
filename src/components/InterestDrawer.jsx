import React, { useState } from 'react';
import { X, Trash2, Printer, QrCode as QrIcon, BookmarkCheck } from 'lucide-react';
import QrExportModal from './QrExportModal';

export default function InterestDrawer({
  isOpen,
  onClose,
  interestList,
  products,
  onToggleInterest,
  onClearInterest,
  onSelectProduct
}) {
  const [showQrModal, setShowQrModal] = useState(false);

  const selectedProducts = interestList
    .map((code) => products.find((p) => p.code === code))
    .filter(Boolean);

  const handlePrint = () => {
    window.print();
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
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--ink)' }}>
                    {p.price == null ? 'Consultar precio' : `$${p.price.toFixed(2)}`}
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

            <button
              className="drawer-btn-qr"
              onClick={() => setShowQrModal(true)}
            >
              <QrIcon size={22} />
              <span>Llevar lista en Código QR</span>
            </button>

            <div className="drawer-footer-actions">
              <button className="drawer-btn-secondary" onClick={handlePrint}>
                <Printer size={18} />
                <span>Imprimir</span>
              </button>
              <button
                className="drawer-btn-secondary"
                onClick={onClearInterest}
                style={{ color: '#EF4444' }}
              >
                <Trash2 size={18} />
                <span>Vaciar</span>
              </button>
            </div>
          </div>
        )}
      </aside>

      {showQrModal && (
        <QrExportModal
          items={selectedProducts}
          onClose={() => setShowQrModal(false)}
        />
      )}
    </>
  );
}
