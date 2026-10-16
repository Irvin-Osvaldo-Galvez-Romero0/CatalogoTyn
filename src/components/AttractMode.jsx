import React from 'react';
import { Touchpad, Sparkles, Activity } from 'lucide-react';

export default function AttractMode({ onDismiss, theme }) {
  return (
    <div className="attract-overlay" onClick={onDismiss}>
      <div className="attract-logo-wrap">
        <img
          src={theme === 'dark' ? '/assets/logo1.png' : '/assets/logo1.png'}
          alt="Tynor Medical"
          className="attract-logo"
        />
        <div className="attract-expo-tag">EXPOMEDICAL 2026 • STAND OFICIAL</div>
      </div>

      <div className="attract-touch-prompt">
        <Touchpad size={36} />
        <span>Toca la pantalla para explorar</span>
      </div>

      <div className="attract-subtext">
        Catálogo Interactivo de Ortopedia y Rehabilitación • Soluciones Médicas Avanzadas
      </div>
    </div>
  );
}
