import React, { useState } from 'react';
import { RotateCcw, Check } from 'lucide-react';

export default function KioskResetFab({ onReset }) {
  const [confirming, setConfirming] = useState(false);

  const handleClick = () => {
    if (confirming) {
      onReset();
      setConfirming(false);
    } else {
      setConfirming(true);
      setTimeout(() => setConfirming(false), 3500);
    }
  };

  return (
    <button
      className="fab-reset-kiosk"
      onClick={handleClick}
      aria-label="Reiniciar Kiosco para el próximo visitante"
      style={{
        backgroundColor: confirming ? '#EF4444' : undefined,
        color: confirming ? '#FFFFFF' : undefined,
        borderColor: confirming ? '#EF4444' : undefined
      }}
    >
      {confirming ? <Check size={18} /> : <RotateCcw size={18} />}
      <span>{confirming ? '¿Confirmar reinicio?' : 'Reiniciar Kiosco'}</span>
    </button>
  );
}
