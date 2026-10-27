import React, { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { X, Smartphone, Check, UserCheck, Phone } from 'lucide-react';
import { DEFAULT_SALES_REPS, buildWhatsAppMessage, getWhatsAppUrl } from '../data/salesReps';
import ModernSelect from './ModernSelect';

export default function QrExportModal({ items, initialRepId, onRepChange, onClose }) {
  const canvasRef = useRef(null);
  const [repId, setRepId] = useState(initialRepId || DEFAULT_SALES_REPS[0]?.id || '');

  const currentRep = DEFAULT_SALES_REPS.find((r) => r.id === repId) || DEFAULT_SALES_REPS[0];
  const message = buildWhatsAppMessage(currentRep?.name || 'Asesor Tynor', items);
  const whatsappUrl = getWhatsAppUrl(currentRep?.phone || '', message);

  const handleSelectRep = (newId) => {
    setRepId(newId);
    if (onRepChange) {
      onRepChange(newId);
    }
  };

  useEffect(() => {
    if (!canvasRef.current || items.length === 0) return;

    QRCode.toCanvas(
      canvasRef.current,
      whatsappUrl,
      {
        width: 220,
        margin: 2,
        color: {
          dark: '#0f172a',
          light: '#FFFFFF'
        },
        errorCorrectionLevel: 'M'
      },
      (err) => {
        if (err) console.error('Error generating WhatsApp QR:', err);
      }
    );
  }, [whatsappUrl, items]);

  return (
    <div className="modal-overlay open" onClick={onClose}>
      <div
        className="modal-card qr-whatsapp-modal-card"
        style={{ width: 'min(480px, 94vw)', maxHeight: '92dvh', overflowY: 'auto' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="qr-modal-body" style={{ width: '100%', padding: 'clamp(1rem, 2.5vw, 1.5rem)', boxSizing: 'border-box' }}>
          {/* Header */}
          <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <div className="whatsapp-icon-badge" style={{ width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', background: '#25D366' }}>
                <Phone size={18} color="#FFFFFF" />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: 'var(--ink)' }}>
                  Enviar Pedido a WhatsApp
                </h3>
                <span style={{ fontSize: '0.78rem', color: 'var(--ink-secondary)' }}>
                  {items.length} {items.length === 1 ? 'producto seleccionado' : 'productos seleccionados'}
                </span>
              </div>
            </div>
            <button
              className="kiosk-icon-btn"
              style={{ width: 36, height: 36 }}
              onClick={onClose}
              aria-label="Cerrar modal QR"
            >
              <X size={18} />
            </button>
          </div>

          {/* Vendedor Asignado con ModernSelect Estilo iPhone */}
          <div className="modal-sales-rep-box" style={{ marginBottom: '1rem', position: 'relative', zIndex: 100 }}>
            <div className="modal-sales-rep-header">
              <span className="modal-sales-rep-tag">Vendedor Asignado</span>
            </div>
            <ModernSelect
              options={DEFAULT_SALES_REPS}
              value={repId}
              onChange={handleSelectRep}
            />
          </div>

          {/* Canvas QR con URL wa.me */}
          <div className="qr-canvas-wrap whatsapp-qr-wrap" style={{ margin: '0.5rem auto 1rem auto', position: 'relative', zIndex: 1 }}>
            <canvas ref={canvasRef} style={{ maxWidth: '100%', height: 'auto' }} />
            <div className="qr-badge-overlay">
              <span className="whatsapp-qr-tag">Escanear para WhatsApp</span>
            </div>
          </div>

          <p className="qr-instruction" style={{ marginBottom: '1rem', fontSize: '0.85rem', lineHeight: '1.4', textAlign: 'center' }}>
            <Smartphone size={16} style={{ verticalAlign: 'middle', marginRight: 6, color: 'var(--brand)' }} />
            Apunta la cámara de tu teléfono al código QR. Se abrirá WhatsApp con el pedido y la cotización lista para enviar a <strong>{currentRep?.name}</strong>.
          </p>

          {/* Acción única y limpia de cierre */}
          <div className="qr-action-buttons" style={{ width: '100%', marginTop: '0.5rem' }}>
            <button
              className="drawer-btn-secondary"
              style={{
                width: '100%',
                height: 48,
                fontSize: '0.95rem',
                fontWeight: 700,
                borderRadius: 'var(--radius-pill)',
                background: 'var(--bg-surface-raised)',
                border: '1px solid var(--border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                cursor: 'pointer'
              }}
              onClick={onClose}
            >
              <Check size={18} color="var(--brand)" />
              <span>Listo / Cerrar</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

