import React, { useEffect, useRef, useState, useMemo } from 'react';
import QRCode from 'qrcode';
import { X, Smartphone, Check, UserCheck, Phone } from 'lucide-react';
import { DEFAULT_SALES_REPS, buildWhatsAppMessage, getWhatsAppUrl } from '../data/salesReps';
import ModernSelect from './ModernSelect';

export default function QrExportModal({ items, initialRepId, onRepChange, onClose }) {
  const canvasRef = useRef(null);
  const [repId, setRepId] = useState(initialRepId || DEFAULT_SALES_REPS[0]?.id || '');

  const currentRep = DEFAULT_SALES_REPS.find((r) => r.id === repId) || DEFAULT_SALES_REPS[0];

  const handleSelectRep = (newId) => {
    setRepId(newId);
    if (onRepChange) {
      onRepChange(newId);
    }
  };

  // URL del QR: Directo al WhatsApp del Asesor Oficial sin intermediarios ni descargas locales
  const qrTargetUrl = useMemo(() => {
    const directWaMsg = buildWhatsAppMessage(currentRep?.name || 'Asesor Tynor', items);
    return getWhatsAppUrl(currentRep?.phone || '', directWaMsg);
  }, [items, currentRep]);

  useEffect(() => {
    if (!canvasRef.current || items.length === 0) return;

    QRCode.toCanvas(
      canvasRef.current,
      qrTargetUrl,
      {
        width: 240,
        margin: 2,
        color: {
          dark: '#0f172a',
          light: '#FFFFFF'
        },
        errorCorrectionLevel: 'M'
      },
      (err) => {
        if (err) console.error('Error generating QR:', err);
      }
    );
  }, [qrTargetUrl, items]);

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
                  {items.length} {items.length === 1 ? 'modelo seleccionado' : 'modelos seleccionados'}
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

          {/* Vendedor Asignado con ModernSelect */}
          <div className="modal-sales-rep-box" style={{ marginBottom: '0.85rem', position: 'relative', zIndex: 100 }}>
            <div className="modal-sales-rep-header">
              <span className="modal-sales-rep-tag">Vendedor Asignado</span>
            </div>
            <ModernSelect
              options={DEFAULT_SALES_REPS}
              value={repId}
              onChange={handleSelectRep}
            />
          </div>

          {/* Canvas QR */}
          <div className="qr-canvas-wrap whatsapp-qr-wrap" style={{ margin: '0.4rem auto 0.85rem auto', position: 'relative', zIndex: 1 }}>
            <canvas ref={canvasRef} style={{ maxWidth: '100%', height: 'auto' }} />
            <div className="qr-badge-overlay">
              <span className="whatsapp-qr-tag">
                🟢 Abre WhatsApp Inmediatamente
              </span>
            </div>
          </div>

          <p className="qr-instruction" style={{ marginBottom: '1.25rem', fontSize: '0.86rem', lineHeight: '1.45', textAlign: 'center', color: 'var(--ink-secondary)' }}>
            <Smartphone size={16} style={{ verticalAlign: 'middle', marginRight: 6, color: '#25D366' }} />
            Apunta la cámara de tu teléfono móvil al código QR. <strong>Se abrirá WhatsApp directamente</strong> con tu pedido y cotización lista para enviar a <strong>{currentRep?.name}</strong> con el desglose exacto de tus piezas, medidas y colores.
          </p>

          {/* Acción de cierre */}
          <div className="qr-action-buttons" style={{ width: '100%', marginTop: '0.3rem' }}>
            <button
              className="drawer-btn-secondary"
              style={{
                width: '100%',
                height: 48,
                fontSize: '0.95rem',
                fontWeight: 800,
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
