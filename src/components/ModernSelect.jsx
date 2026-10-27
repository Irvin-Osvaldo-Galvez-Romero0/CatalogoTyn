import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, Phone, UserCheck } from 'lucide-react';

/**
 * ModernSelect: Selector desplegable moderno con estética Glassmorphism / iOS
 * Diseñado con estándares de agency-ui-designer y agency-ux-architect
 * Reemplaza los menús nativos del sistema operativo por una experiencia fluida, translúcida y con micro-animaciones.
 */
export default function ModernSelect({
  options = [],
  value,
  onChange,
  placeholder = 'Selecciona una opción',
  className = '',
  dropUp = false,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [effectiveDropUp, setEffectiveDropUp] = useState(dropUp);
  const containerRef = useRef(null);
  const optionsListRef = useRef(null);

  const selectedOption = options.find((opt) => opt.id === value) || options[0] || null;

  // Detectar si debe abrirse hacia arriba (drop-up) para no salirse de la pantalla
  useEffect(() => {
    if (dropUp) {
      setEffectiveDropUp(true);
      return;
    }
    if (isOpen && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      if (spaceBelow < 280 && spaceAbove > spaceBelow) {
        setEffectiveDropUp(true);
      } else {
        setEffectiveDropUp(false);
      }
    }
  }, [isOpen, dropUp]);

  // Al abrir, asegurar que la lista comience en el primer elemento
  useEffect(() => {
    if (isOpen && optionsListRef.current) {
      optionsListRef.current.scrollTop = 0;
    }
  }, [isOpen]);

  // Cerrar al hacer clic fuera
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen]);

  // Cerrar con tecla Escape
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Extraer iniciales para el avatar
  const getInitials = (name) => {
    if (!name) return 'TY';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  };

  const handleSelect = (option) => {
    if (onChange) {
      onChange(option.id);
    }
    setIsOpen(false);
  };

  return (
    <div
      className={`modern-select-root ${className} ${isOpen ? 'is-open' : ''} ${effectiveDropUp ? 'is-drop-up' : ''}`}
      ref={containerRef}
      style={{ position: 'relative', zIndex: isOpen ? 99999 : 5 }}
    >
      {/* Botón Disparador Estilo iPhone / Glassmorphism */}
      <button
        type="button"
        className="modern-select-trigger"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <div className="modern-select-trigger-content">
          <div className="modern-select-avatar">
            {selectedOption ? getInitials(selectedOption.name) : <UserCheck size={16} />}
          </div>
          <div className="modern-select-text">
            <span className="modern-select-name">
              {selectedOption ? selectedOption.name : placeholder}
            </span>
            {selectedOption?.displayPhone && (
              <span className="modern-select-phone-hint">
                <Phone size={11} style={{ verticalAlign: 'middle', marginRight: 3 }} />
                {selectedOption.displayPhone}
              </span>
            )}
          </div>
        </div>

        <div className={`modern-select-chevron ${isOpen ? 'rotated' : ''}`}>
          <ChevronDown size={18} />
        </div>
      </button>

      {/* Menú Desplegable Flotante con Glassmorphism y Micro-animación */}
      {isOpen && (
        <div
          className={`modern-select-dropdown ${effectiveDropUp ? 'drop-up' : ''}`}
          role="listbox"
          style={{ zIndex: 999999 }}
        >
          <div className="modern-select-header-hint">
            <span>Elige un asesor para WhatsApp ({options.length} disponibles)</span>
          </div>
          <div className="modern-select-options-list" ref={optionsListRef}>
            {options.map((opt) => {
              const isSelected = selectedOption?.id === opt.id;
              return (
                <div
                  key={opt.id}
                  className={`modern-select-option ${isSelected ? 'selected' : ''}`}
                  onClick={() => handleSelect(opt)}
                  role="option"
                  aria-selected={isSelected}
                >
                  <div className={`modern-option-avatar ${isSelected ? 'active' : ''}`}>
                    {getInitials(opt.name)}
                  </div>
                  <div className="modern-option-info">
                    <span className="modern-option-name">{opt.name}</span>
                    <span className="modern-option-phone">
                      <Phone size={11} style={{ verticalAlign: 'middle', marginRight: 4 }} />
                      {opt.displayPhone || opt.phone}
                    </span>
                  </div>
                  {isSelected && (
                    <div className="modern-option-check">
                      <Check size={16} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
