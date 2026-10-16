import React from 'react';
import { Layers, User, Moon, Sun, Bookmark, WifiOff } from 'lucide-react';

export default function KioskHeader({
  view,
  setView,
  theme,
  setTheme,
  interestCount,
  onOpenDrawer
}) {
  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
  };

  return (
    <header className="kiosk-header">
      <div className="kiosk-brand">
        <img
          src={theme === 'dark' ? '/assets/logo1.png' : '/assets/logo.png'}
          alt="Tynor Recupera"
          className="kiosk-logo"
        />
        <span className="brand-tag-simple">Catálogo de exhibición</span>
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
        <button
          className="kiosk-icon-btn"
          onClick={toggleTheme}
          aria-label="Cambiar modo de color"
          title={`Cambiar a ${theme === 'dark' ? 'Modo Claro' : 'Modo Oscuro'}`}
        >
          {theme === 'dark' ? <Sun size={22} color="#FBBF24" /> : <Moon size={22} />}
        </button>

        <button
          className="kiosk-icon-btn"
          onClick={onOpenDrawer}
          aria-label="Ver Lista de Interés"
          title="Ver mi lista de productos seleccionados"
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
