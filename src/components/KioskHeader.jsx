import React from 'react';
import { Layers, User, Moon, Sun, Bookmark, WifiOff, Play, UserPlus, UserCheck, ShieldCheck } from 'lucide-react';
import { Capacitor } from '@capacitor/core';

// Detección de entorno APK nativo (Capacitor Android o parámetro ?apk=true de prueba)
const isApk = typeof window !== 'undefined' && (
  Capacitor.isNativePlatform() ||
  Capacitor.getPlatform() === 'android' ||
  Boolean(window.Capacitor?.isNativePlatform?.()) ||
  new URLSearchParams(window.location.search).get('apk') === 'true'
);

export default function KioskHeader({
  view,
  setView,
  theme,
  setTheme,
  interestCount,
  onOpenDrawer,
  onStartDemo,
  onOpenForm,
  fixedRepName,
  onOpenFixedRepModal
}) {
  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
  };

  return (
    <header className="kiosk-header">
      <div className="kiosk-brand">
        <div className="kiosk-brand-card" title="Tynor — Ortopedia y Rehabilitación">
          <img
            src="/assets/logo.png"
            alt="Tynor"
            className="kiosk-logo"
          />
        </div>

        {/* Botón para Fijar Asesor Responsable (Sin mostrar número) */}
        <button
          type="button"
          className={`kiosk-advisor-pin-btn ${fixedRepName ? 'has-advisor' : ''}`}
          onClick={onOpenFixedRepModal}
          title={fixedRepName ? `Asesor fijado: ${fixedRepName}` : 'Fijar Asesor para este dispositivo'}
          aria-label="Fijar asesor de ventas para este dispositivo"
        >
          <div className="advisor-pin-icon-wrap">
            <UserCheck size={16} />
          </div>
          <div className="advisor-pin-info">
            <span className="advisor-pin-tag">Asesor</span>
            <strong className="advisor-pin-name" title={fixedRepName || 'Fijar Asesor'}>
              {fixedRepName ? fixedRepName.trim().split(/\s+/)[0] : 'Fijar Asesor'}
            </strong>
          </div>
        </button>

        <div className="kiosk-brand-badge">
          <div className="brand-status-line">
            <span className="brand-live-pulse" />
            <span className="brand-expo-tag">EXPOMEDICAL 2026</span>
          </div>
          <span className="brand-subtitle">Ortopedia & Biomecánica</span>
        </div>
      </div>

      <div className="kiosk-tabs">
        <button
          className={`kiosk-tab-btn ${view === 'catalog' ? 'active' : ''}`}
          onClick={() => setView('catalog')}
          aria-label="Ver Catálogo General"
        >
          <Layers size={20} />
          <span>Catálogo</span>
        </button>
        <button
          className={`kiosk-tab-btn ${view === 'anatomy' ? 'active' : ''}`}
          onClick={() => setView('anatomy')}
          aria-label="Ver Cuerpo Anatómico 3D"
        >
          <User size={20} />
          <span>Cuerpo 3D</span>
        </button>
      </div>

      <div className="kiosk-actions">
        {/* Botón de Registro Comercial (Formulario para Usuarios conectado a Supabase) */}
        <button
          className="kiosk-register-btn"
          onClick={onOpenForm}
          aria-label="Abrir Formulario de Registro Comercial"
          title="Registrar prospecto o cliente comercial"
        >
          <UserPlus size={18} />
        </button>

        <button
          className="kiosk-demo-pill-btn"
          onClick={onStartDemo}
          aria-label="Iniciar Modo Demostración de Pantalla"
          title="Iniciar Modo Demostración"
        >
          <Play size={18} fill="currentColor" style={{ marginLeft: '2px' }} />
        </button>

        {/* Botón de Mi Lista de Interés: Ocultado en UI sin eliminar el módulo */}
        <button
          className="kiosk-icon-btn"
          onClick={onOpenDrawer}
          aria-label="Ver Lista de Interés"
          title="Ver mi lista de productos seleccionados"
          style={{ display: 'none' }}
        >
          <Bookmark size={22} />
          {interestCount > 0 && (
            <span className="badge-count">{interestCount}</span>
          )}
        </button>
      </div>
    </header>
  );
}
