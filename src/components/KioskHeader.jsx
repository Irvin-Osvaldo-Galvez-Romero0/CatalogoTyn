import React, { useState, useEffect, useRef } from 'react';
import { Layers, User, Bookmark, Play, UserPlus, UserCheck } from 'lucide-react';
import { Capacitor } from '@capacitor/core';
import { brandingService } from '../services/brandingService';

// Detección de entorno APK nativo
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
  onOpenFixedRepModal,
  onOpenAdminAuth
}) {
  const [logo, setLogo] = useState(() => brandingService.getLogo());

  // Suscribirse a cambios de branding dinámico
  useEffect(() => {
    const unsub = brandingService.subscribe((data) => {
      setLogo(data.logo);
    });
    return unsub;
  }, []);

  // Trigger Oculto de Administrador en el Logo (Triple Clic o Pulsación Continua de 2.5s)
  const clickCountRef = useRef(0);
  const clickTimeoutRef = useRef(null);
  const longPressTimerRef = useRef(null);

  const handleLogoClick = () => {
    clickCountRef.current += 1;
    if (clickTimeoutRef.current) clearTimeout(clickTimeoutRef.current);

    if (clickCountRef.current >= 3) {
      clickCountRef.current = 0;
      if (onOpenAdminAuth) onOpenAdminAuth();
      return;
    }

    clickTimeoutRef.current = setTimeout(() => {
      clickCountRef.current = 0;
    }, 700);
  };

  const handleLogoPointerDown = () => {
    if (longPressTimerRef.current) clearTimeout(longPressTimerRef.current);
    longPressTimerRef.current = setTimeout(() => {
      if (onOpenAdminAuth) onOpenAdminAuth();
    }, 2500);
  };

  const handleLogoPointerUp = () => {
    if (longPressTimerRef.current) clearTimeout(longPressTimerRef.current);
  };

  return (
    <header className="kiosk-header">
      <div className="kiosk-brand">
        {/* Logo con trigger oculto */}
        <div
          className="kiosk-brand-card"
          title="Tynor — Ortopedia y Rehabilitación"
          onClick={handleLogoClick}
          onPointerDown={handleLogoPointerDown}
          onPointerUp={handleLogoPointerUp}
          onPointerLeave={handleLogoPointerUp}
          style={{ cursor: 'pointer', userSelect: 'none' }}
        >
          <img
            src={logo}
            alt="Tynor"
            className="kiosk-logo"
            onError={(e) => { e.currentTarget.src = '/assets/logo.png'; }}
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

        {/* Insignia Institucional Limpia */}
        <div className="kiosk-brand-badge">
          <div className="brand-status-line">
            <span className="brand-live-pulse" />
            <span className="brand-expo-tag">Catálogo Oficial</span>
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
        {/* Botón de Registro Comercial (Formulario de prospectos conectado a Supabase) */}
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

        {/* Botón de Mi Lista de Deseos / Cotizador: REACTIVADO Y VISIBLE */}
        <button
          className="kiosk-icon-btn"
          onClick={onOpenDrawer}
          aria-label="Ver Mi Lista de Deseos"
          title="Ver mi lista de deseos y cotización"
          style={{ position: 'relative' }}
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
