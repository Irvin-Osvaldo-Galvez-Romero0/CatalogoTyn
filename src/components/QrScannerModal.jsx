import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { X, Camera, AlertCircle, RefreshCw, Check } from 'lucide-react';

export default function QrScannerModal({ isOpen, onClose, onScanSuccess }) {
  const [scannerError, setScannerError] = useState(null);
  const [manualText, setManualText] = useState('');
  const [isStarting, setIsStarting] = useState(true);
  const scannerRef = useRef(null);
  const isStoppedRef = useRef(false);

  useEffect(() => {
    if (!isOpen) return;

    isStoppedRef.current = false;
    setIsStarting(true);
    setScannerError(null);

    const elementId = 'tynor-qr-reader-region';

    // Pequeño timeout para asegurar que el DOM esté listo
    const timer = setTimeout(() => {
      try {
        const html5QrCode = new Html5Qrcode(elementId);
        scannerRef.current = html5QrCode;

        const config = {
          fps: 15,
          qrbox: { width: 260, height: 260 },
          aspectRatio: 1.0
        };

        html5QrCode
          .start(
            { facingMode: 'environment' },
            config,
            (decodedText) => {
              if (isStoppedRef.current) return;
              isStoppedRef.current = true;

              try {
                if (navigator.vibrate) navigator.vibrate([60, 40, 60]);
              } catch {}

              html5QrCode
                .stop()
                .then(() => {
                  html5QrCode.clear();
                  onScanSuccess(decodedText);
                  onClose();
                })
                .catch(() => {
                  onScanSuccess(decodedText);
                  onClose();
                });
            },
            () => {
              // Ignorar errores de frames sin QR
            }
          )
          .then(() => {
            setIsStarting(false);
          })
          .catch((err) => {
            console.warn('Error iniciando cámara QR:', err);
            setIsStarting(false);
            setScannerError(
              'No se pudo acceder a la cámara. Por favor autoriza los permisos de cámara o ingresa el código manualmente.'
            );
          });
      } catch (err) {
        setIsStarting(false);
        setScannerError('Error al inicializar el escáner de cámara.');
      }
    }, 150);

    return () => {
      clearTimeout(timer);
      isStoppedRef.current = true;
      if (scannerRef.current) {
        try {
          if (scannerRef.current.isScanning) {
            scannerRef.current.stop().catch(() => {});
          }
          scannerRef.current.clear();
        } catch {}
      }
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (!manualText.trim()) return;
    onScanSuccess(manualText.trim());
    onClose();
  };

  return (
    <div className="qr-scanner-overlay" onClick={onClose}>
      <div className="qr-scanner-card" onClick={(e) => e.stopPropagation()}>
        <div className="qr-scanner-header">
          <div className="qr-scanner-title">
            <Camera size={20} className="qr-scanner-cam-icon" />
            <h3>Escanear Código QR</h3>
          </div>
          <button className="qr-scanner-close-btn" onClick={onClose} aria-label="Cerrar escáner">
            <X size={20} />
          </button>
        </div>

        <div className="qr-scanner-viewport-wrap">
          {isStarting && (
            <div className="qr-scanner-loading">
              <RefreshCw size={28} className="qr-spin-icon" />
              <span>Iniciando visor de cámara...</span>
            </div>
          )}

          <div id="tynor-qr-reader-region" className="qr-video-container" />

          {!scannerError && (
            <div className="qr-target-guide">
              <div className="qr-target-corner top-left" />
              <div className="qr-target-corner top-right" />
              <div className="qr-target-corner bottom-left" />
              <div className="qr-target-corner bottom-right" />
              <div className="qr-scan-laser" />
            </div>
          )}
        </div>

        <p className="qr-scanner-instruction">
          Apunta la cámara al código QR del gafete o credencial para escanearlo automáticamente.
        </p>

        {scannerError && (
          <div className="qr-scanner-err-box">
            <AlertCircle size={18} />
            <span>{scannerError}</span>
          </div>
        )}

        <form onSubmit={handleManualSubmit} className="qr-manual-input-box">
          <label>O captura la cadena del código manualmente:</label>
          <div className="qr-manual-input-row">
            <input
              type="text"
              className="lead-input"
              placeholder="Ej. TYN-VISIT-2026-9812..."
              value={manualText}
              onChange={(e) => setManualText(e.target.value)}
            />
            <button type="submit" className="qr-manual-btn" disabled={!manualText.trim()}>
              <Check size={18} />
              <span>Aplicar</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
