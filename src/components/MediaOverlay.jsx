import React, { useState } from 'react';
import { X, Moon, Sun, Download, FileText, Video } from 'lucide-react';

export default function MediaOverlay({ mediaType, src, title, onClose }) {
  const [cinemaMode, setCinemaMode] = useState(false);

  if (!mediaType || !src) return null;

  return (
    <div
      className="media-kiosk-overlay"
      style={{
        backgroundColor: cinemaMode ? 'rgba(0, 0, 0, 0.98)' : 'rgba(0, 0, 0, 0.85)'
      }}
      onClick={onClose}
    >
      <div
        className="media-kiosk-panel"
        style={{
          boxShadow: cinemaMode ? '0 0 50px rgba(0, 0, 0, 0.9)' : undefined
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="media-kiosk-head">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            {mediaType === 'pdf' ? <FileText size={20} color="var(--brand)" /> : <Video size={20} color="var(--brand)" />}
            <h3>{title}</h3>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {mediaType === 'video' && (
              <button
                className="cinema-toggle-btn"
                onClick={() => setCinemaMode(!cinemaMode)}
                title="Modo Cine (Atenuar luces del stand)"
              >
                {cinemaMode ? <Sun size={18} /> : <Moon size={18} />}
                <span>{cinemaMode ? 'Luces Normales' : 'Modo Cine'}</span>
              </button>
            )}

            <button
              className="kiosk-icon-btn"
              style={{ width: 44, height: 44 }}
              onClick={onClose}
              aria-label="Cerrar reproductor"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="media-kiosk-body">
          {mediaType === 'pdf' ? (
            <iframe src={src} title={title} />
          ) : (
            <video src={src} controls autoPlay playsInline />
          )}
        </div>
      </div>
    </div>
  );
}
