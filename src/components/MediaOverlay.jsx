import React, { useState } from 'react';
import { ArrowLeft, Moon, Sun, FileText, Video } from 'lucide-react';
import PdfViewer from './PdfViewer';

export default function MediaOverlay({ mediaType, src, title, onClose }) {
  const [cinemaMode, setCinemaMode] = useState(false);

  if (!mediaType || !src) return null;

  const isPdf = mediaType === 'pdf';

  return (
    <div
      className={`media-kiosk-overlay ${isPdf ? 'media-overlay-pdf' : ''}`}
      style={{
        backgroundColor: cinemaMode ? 'rgba(0, 0, 0, 0.98)' : (isPdf ? '#F1F5F9' : 'rgba(0, 0, 0, 0.88)')
      }}
      onClick={onClose}
    >
      <div
        className={`media-kiosk-panel ${isPdf ? 'media-panel-pdf' : ''}`}
        style={{
          boxShadow: cinemaMode ? '0 0 50px rgba(0, 0, 0, 0.9)' : undefined,
          backgroundColor: isPdf ? '#F8FAFC' : undefined
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="media-kiosk-head">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <button
              className="kiosk-icon-btn kiosk-arrow-back-btn"
              style={{ width: 44, height: 44 }}
              onClick={onClose}
              aria-label="Volver atrás"
              title="Volver atrás"
            >
              <ArrowLeft size={22} />
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', minWidth: 0 }}>
              {isPdf ? <FileText size={22} color="var(--brand)" style={{ flexShrink: 0 }} /> : <Video size={22} color="var(--brand)" style={{ flexShrink: 0 }} />}
              <h3 className="media-kiosk-title">{title}</h3>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {!isPdf && mediaType === 'video' && (
              <button
                className="cinema-toggle-btn"
                onClick={() => setCinemaMode(!cinemaMode)}
                title="Modo Cine (Atenuar luces del stand)"
              >
                {cinemaMode ? <Sun size={18} /> : <Moon size={18} />}
                <span>{cinemaMode ? 'Luces Normales' : 'Modo Cine'}</span>
              </button>
            )}
          </div>
        </div>

        <div className={`media-kiosk-body ${isPdf ? 'media-body-pdf' : ''}`}>
          {isPdf ? (
            <PdfViewer src={src} title={title} />
          ) : (
            <video src={src} controls autoPlay playsInline />
          )}
        </div>
      </div>
    </div>
  );
}
