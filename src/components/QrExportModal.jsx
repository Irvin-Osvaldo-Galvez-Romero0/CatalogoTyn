import React, { useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { X, QrCode as QrIcon, Smartphone, Check } from 'lucide-react';

export default function QrExportModal({ items, onClose }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current || items.length === 0) return;

    const summaryText = [
      '--- TYNOR EXPOMEDICAL 2026 ---',
      'Mi Lista de Productos Seleccionados:',
      ...items.map((it, i) => `${i + 1}. [${it.code}] ${it.name} - ${it.price ? `$${it.price.toFixed(2)}` : 'A cotizar'}`),
      '--------------------------------',
      'Consulta estos productos en nuestro stand o en tynor.com.mx'
    ].join('\n');

    QRCode.toCanvas(
      canvasRef.current,
      summaryText,
      {
        width: 260,
        margin: 2,
        color: {
          dark: '#007A78',
          light: '#FFFFFF'
        }
      },
      (err) => {
        if (err) console.error('Error generating offline QR:', err);
      }
    );
  }, [items]);

  return (
    <div className="modal-overlay open" onClick={onClose}>
      <div
        className="modal-card"
        style={{ width: 500, maxWidth: '90vw' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="qr-modal-body" style={{ width: '100%' }}>
          <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <QrIcon size={22} color="var(--brand)" />
              <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800 }}>Llevar a tu Celular</h3>
            </div>
            <button
              className="kiosk-icon-btn"
              style={{ width: 40, height: 40 }}
              onClick={onClose}
              aria-label="Cerrar modal QR"
            >
              <X size={18} />
            </button>
          </div>

          <div className="qr-canvas-wrap">
            <canvas ref={canvasRef} />
          </div>

          <p className="qr-instruction">
            <Smartphone size={18} style={{ verticalAlign: 'middle', marginRight: 6 }} />
            Apunta la cámara de tu teléfono al código QR. Tu teléfono leerá directamente la lista de productos
            seleccionados sin requerir conexión a internet en el stand.
          </p>

          <button
            className="btn-primary-kiosk"
            style={{ width: '100%' }}
            onClick={onClose}
          >
            <Check size={20} />
            <span>Listo, ya lo escaneé</span>
          </button>
        </div>
      </div>
    </div>
  );
}
