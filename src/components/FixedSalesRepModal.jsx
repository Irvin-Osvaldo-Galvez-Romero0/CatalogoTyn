import React from 'react';
import { X, Check, UserCheck, ShieldCheck } from 'lucide-react';
import { DEFAULT_SALES_REPS } from '../data/salesReps';

export default function FixedSalesRepModal({
  isOpen,
  onClose,
  fixedRepId,
  onSelectRep
}) {
  if (!isOpen) return null;

  const getInitials = (name) => {
    if (!name) return 'TY';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  };

  return (
    <div className="fixed-rep-modal-overlay" onClick={onClose}>
      <div
        className="fixed-rep-modal-card"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="fixed-rep-title"
      >
        <div className="fixed-rep-header">
          <div className="fixed-rep-header-info">
            <h3 id="fixed-rep-title">Fijar Asesor para este Dispositivo</h3>
            <p>
              Selecciona el asesor responsable de este kiosco/tableta. Todos los prospectos y cotizaciones se vincularán automáticamente a su nombre.
            </p>
          </div>
          <button
            type="button"
            className="fixed-rep-close-btn"
            onClick={onClose}
            aria-label="Cerrar modal"
          >
            <X size={20} />
          </button>
        </div>

        <div className="fixed-rep-list">
          {DEFAULT_SALES_REPS.map((rep) => {
            const isSelected = fixedRepId === rep.id;
            return (
              <button
                key={rep.id}
                type="button"
                className={`fixed-rep-item ${isSelected ? 'selected' : ''}`}
                onClick={() => {
                  onSelectRep(rep.id, rep.name);
                  onClose();
                }}
              >
                <div className="fixed-rep-avatar">
                  {getInitials(rep.name)}
                </div>
                <div className="fixed-rep-name-wrap">
                  <span className="fixed-rep-name">{rep.name}</span>
                  <span className="fixed-rep-dept">{rep.department || 'Ventas'}</span>
                </div>
                <div className="fixed-rep-radio">
                  {isSelected ? (
                    <div className="fixed-rep-check-dot">
                      <Check size={14} />
                    </div>
                  ) : (
                    <div className="fixed-rep-empty-dot" />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        <div className="fixed-rep-footer">
          <span className="fixed-rep-hint">
            * Nota: Los números de teléfono permanecen ocultos y protegidos para los usuarios.
          </span>
          <button
            type="button"
            className="fixed-rep-btn-done"
            onClick={onClose}
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
