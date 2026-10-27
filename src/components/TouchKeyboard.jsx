import React, { useState, useEffect, useRef } from 'react';
import { Delete, X, CornerDownLeft, ChevronDown, Keyboard, Space, RotateCcw, Search } from 'lucide-react';

export default function TouchKeyboard({
  isOpen,
  value = '',
  onChange,
  onClose,
  placeholder = 'Buscar producto o código...'
}) {
  const [isUppercase, setIsUppercase] = useState(true);
  const keyboardRef = useRef(null);

  // Escuchar tecla Escape para cerrar
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleKeyPress = (char) => {
    const nextChar = isUppercase ? char.toUpperCase() : char.toLowerCase();
    onChange(value + nextChar);
  };

  const handleBackspace = () => {
    if (value.length > 0) {
      onChange(value.slice(0, -1));
    }
  };

  const handleClear = () => {
    onChange('');
  };

  const handleSpace = () => {
    onChange(value + ' ');
  };

  const numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
  const row1 = ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'];
  const row2 = ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Ñ'];
  const row3 = ['Z', 'X', 'C', 'V', 'B', 'N', 'M'];

  return (
    <div
      ref={keyboardRef}
      className="touch-keyboard-dock"
      role="region"
      aria-label="Teclado táctil en pantalla"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Barra superior de control y previsualización */}
      <div className="touch-keyboard-header">
        <div className="touch-keyboard-badge">
          <Keyboard size={15} className="touch-kb-icon" />
          <span>TECLADO TÁCTIL</span>
        </div>

        {/* Previsualización en tiempo real del texto escrito */}
        <div className="touch-keyboard-preview" title="Texto de búsqueda actual">
          <Search size={14} className="touch-preview-icon" />
          <span className="touch-preview-text">
            {value ? (
              <>
                {value}
                <span className="touch-blinking-cursor">|</span>
              </>
            ) : (
              <span className="touch-preview-placeholder">{placeholder}</span>
            )}
          </span>
          {value.length > 0 && (
            <button
              className="touch-preview-clear"
              onClick={handleClear}
              title="Borrar todo el texto"
              aria-label="Limpiar búsqueda"
            >
              <RotateCcw size={13} />
              <span>Limpiar</span>
            </button>
          )}
        </div>

        <button
          className="touch-keyboard-close-btn"
          onClick={onClose}
          aria-label="Ocultar teclado táctil"
          title="Ocultar teclado"
        >
          <ChevronDown size={18} />
          <span>Ocultar</span>
        </button>
      </div>

      {/* Cuadrícula de teclas táctiles */}
      <div className="touch-keyboard-grid">
        {/* Fila 1: Números */}
        <div className="touch-kb-row">
          {numbers.map((num) => (
            <button
              key={num}
              type="button"
              className="touch-key num-key"
              onClick={() => handleKeyPress(num)}
            >
              {num}
            </button>
          ))}
          <button
            type="button"
            className="touch-key func-key backspace-key"
            onClick={handleBackspace}
            aria-label="Borrar carácter"
            title="Borrar"
          >
            <Delete size={18} />
          </button>
        </div>

        {/* Fila 2: Letras Q - P */}
        <div className="touch-kb-row">
          {row1.map((char) => (
            <button
              key={char}
              type="button"
              className="touch-key char-key"
              onClick={() => handleKeyPress(char)}
            >
              {isUppercase ? char : char.toLowerCase()}
            </button>
          ))}
        </div>

        {/* Fila 3: Letras A - Ñ */}
        <div className="touch-kb-row">
          {row2.map((char) => (
            <button
              key={char}
              type="button"
              className="touch-key char-key"
              onClick={() => handleKeyPress(char)}
            >
              {isUppercase ? char : char.toLowerCase()}
            </button>
          ))}
        </div>

        {/* Fila 4: Mayús + Letras Z - M + Guión */}
        <div className="touch-kb-row">
          <button
            type="button"
            className={`touch-key func-key shift-key ${isUppercase ? 'active-shift' : ''}`}
            onClick={() => setIsUppercase(!isUppercase)}
            aria-label="Alternar Mayúsculas y Minúsculas"
            title="Mayúsculas"
          >
            <span>{isUppercase ? 'MAYÚS' : 'minús'}</span>
          </button>

          {row3.map((char) => (
            <button
              key={char}
              type="button"
              className="touch-key char-key"
              onClick={() => handleKeyPress(char)}
            >
              {isUppercase ? char : char.toLowerCase()}
            </button>
          ))}

          <button
            type="button"
            className="touch-key char-key"
            onClick={() => handleKeyPress('-')}
            title="Guión"
          >
            -
          </button>
        </div>

        {/* Fila 5: Espacio, Acciones principales */}
        <div className="touch-kb-row bottom-row">
          <button
            type="button"
            className="touch-key func-key clear-key"
            onClick={handleClear}
            title="Limpiar búsqueda"
          >
            Limpiar
          </button>

          <button
            type="button"
            className="touch-key spacebar-key"
            onClick={handleSpace}
            aria-label="Barra espaciadora"
            title="Espacio"
          >
            <Space size={18} />
            <span>Espacio</span>
          </button>

          <button
            type="button"
            className="touch-key submit-key"
            onClick={onClose}
            aria-label="Aceptar y ver resultados"
            title="Buscar y cerrar teclado"
          >
            <CornerDownLeft size={16} />
            <span>Listo</span>
          </button>
        </div>
      </div>
    </div>
  );
}
