import { useState, useEffect } from 'react';
import { Capacitor } from '@capacitor/core';

/**
 * Hook para detectar si el dispositivo actual cuenta con un teclado físico.
 * - Dispositivos con teclado físico (PC, laptops, quioscos con teclado USB/Bluetooth):
 *   NO despliegan automáticamente el teclado táctil en pantalla al enfocar el buscador.
 * - Dispositivos táctiles puros (tablets, quioscos táctiles totémicos sin teclado, pantallas táctiles):
 *   Activan automáticamente el teclado táctil en pantalla para permitir la escritura.
 */
export function usePhysicalKeyboardDetector() {
  const [hasPhysicalKeyboard, setHasPhysicalKeyboard] = useState(() => {
    if (typeof window === 'undefined') return true;

    // 1. Revisar si ya fue detectado en la sesión
    try {
      const cached = sessionStorage.getItem('tynor_has_physical_keyboard');
      if (cached !== null) {
        return cached === 'true';
      }
    } catch (_) {}

    // 2. Si es una aplicación móvil nativa (Capacitor Android / iOS) -> usa teclado nativo del SO
    if (Capacitor.isNativePlatform()) {
      return false;
    }

    const ua = navigator.userAgent || '';
    const isMobileDevice = /Android|iPhone|iPad|iPod|Mobile/i.test(ua);
    if (isMobileDevice) {
      return false;
    }

    // 3. Si la pantalla no tiene soporte táctil (maxTouchPoints = 0), es 100% PC/Laptop con teclado físico
    if (navigator.maxTouchPoints === 0) {
      return true;
    }

    // 4. Evaluar capacidades de puntero fino (ratón / trackpad) vs táctil grueso (pantalla táctil pura)
    const hasFinePointer = window.matchMedia && window.matchMedia('(pointer: fine) and (hover: hover)').matches;
    const isCoarseTouchOnly = window.matchMedia && window.matchMedia('(pointer: coarse) and (hover: none)').matches;

    if (isCoarseTouchOnly) {
      return false;
    }

    if (hasFinePointer) {
      return true;
    }

    // Quiosco táctil interactivo por defecto sin ratón: asumir táctil para asegurar usabilidad
    return false;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Listener para detectar pulsación física real de teclas
    const handleKeyDown = (e) => {
      // Ignorar eventos artificiales no confiables
      if (e.isTrusted === false) return;

      // Teclas físicas reales (letras, números, símbolos, backspace, tab, enter)
      const isRealKey = e.key && e.key !== 'Unidentified' && !['Shift', 'Control', 'Alt', 'Meta'].includes(e.key);
      if (isRealKey && !hasPhysicalKeyboard) {
        setHasPhysicalKeyboard(true);
        try {
          sessionStorage.setItem('tynor_has_physical_keyboard', 'true');
        } catch (_) {}
      }
    };

    // Listener para detección de mouse / puntero fino
    const handlePointerDown = (e) => {
      if (e.pointerType === 'mouse' && navigator.maxTouchPoints === 0 && !hasPhysicalKeyboard) {
        setHasPhysicalKeyboard(true);
        try {
          sessionStorage.setItem('tynor_has_physical_keyboard', 'true');
        } catch (_) {}
      }
    };

    window.addEventListener('keydown', handleKeyDown, { passive: true });
    window.addEventListener('pointerdown', handlePointerDown, { passive: true });

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('pointerdown', handlePointerDown);
    };
  }, [hasPhysicalKeyboard]);

  return { hasPhysicalKeyboard, setHasPhysicalKeyboard };
}

export default usePhysicalKeyboardDetector;
