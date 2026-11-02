import React, { useState } from 'react';
import { ShieldCheck, Lock, User, X, KeyRound, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { productManager } from '../../services/productManager';

export default function AdminAuthModal({ isOpen, onClose, onSuccess }) {
  const [username, setUsername] = useState('admin');
  const [nip, setNip] = useState('');
  const [showNip, setShowNip] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [activeInput, setActiveInput] = useState('nip'); // 'username' | 'nip'

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    setErrorMsg('');

    if (!username.trim()) {
      setErrorMsg('Por favor ingresa el nombre de usuario.');
      return;
    }
    if (!nip.trim()) {
      setErrorMsg('Por favor ingresa el NIP de acceso.');
      return;
    }

    const isValid = productManager.verifyCredentials(username, nip);
    if (isValid) {
      onSuccess(nip);
      onClose();
    } else {
      setErrorMsg('Usuario o NIP incorrectos. Verifica tus credenciales.');
    }
  };

  const handleNumpadPress = (num) => {
    setErrorMsg('');
    if (activeInput === 'nip') {
      if (nip.length < 8) setNip((prev) => prev + num);
    } else {
      setUsername((prev) => prev + num);
    }
  };

  const handleNumpadBackspace = () => {
    if (activeInput === 'nip') {
      setNip((prev) => prev.slice(0, -1));
    } else {
      setUsername((prev) => prev.slice(0, -1));
    }
  };

  const handleNumpadClear = () => {
    if (activeInput === 'nip') {
      setNip('');
    } else {
      setUsername('');
    }
  };

  return (
    <div className="modal-overlay open" onClick={onClose} style={{ zIndex: 1100 }}>
      <div
        className="modal-card"
        style={{
          width: 'min(460px, 94vw)',
          background: 'var(--bg-surface)',
          borderRadius: '24px',
          boxShadow: 'var(--shadow-modal)',
          border: '1px solid var(--border-strong)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabecera Segura */}
        <div
          style={{
            padding: '1.25rem 1.5rem',
            background: 'var(--bg-surface-raised)',
            borderBottom: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: '12px',
                background: 'var(--brand-soft)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--brand)'
              }}
            >
              <ShieldCheck size={22} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: 'var(--ink)' }}>
                Acceso Administrativo
              </h3>
              <span style={{ fontSize: '0.78rem', color: 'var(--ink-faint)' }}>
                Panel de control y gestión del quiosco
              </span>
            </div>
          </div>
          <button
            className="kiosk-icon-btn"
            style={{ width: 36, height: 36 }}
            onClick={onClose}
            aria-label="Cerrar modal de acceso"
          >
            <X size={18} />
          </button>
        </div>

        {/* Formulario de Acceso */}
        <form onSubmit={handleSubmit} style={{ padding: '1.5rem' }}>
          {errorMsg && (
            <div
              style={{
                padding: '0.75rem 1rem',
                borderRadius: '12px',
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.25)',
                color: '#DC2626',
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '1.25rem'
              }}
            >
              <AlertCircle size={18} />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Campo Usuario */}
          <div style={{ marginBottom: '1rem' }}>
            <label
              style={{
                display: 'block',
                fontSize: '0.8rem',
                fontWeight: 700,
                color: 'var(--ink-secondary)',
                marginBottom: '0.4rem'
              }}
            >
              Usuario Administrador
            </label>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                background: activeInput === 'username' ? 'var(--brand-soft)' : 'var(--bg-surface-raised)',
                border: activeInput === 'username' ? '2px solid var(--brand)' : '1px solid var(--border)',
                borderRadius: '14px',
                padding: '0.65rem 0.9rem',
                gap: '0.6rem',
                cursor: 'pointer'
              }}
              onClick={() => setActiveInput('username')}
            >
              <User size={18} color="var(--brand)" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onFocus={() => setActiveInput('username')}
                placeholder="Ej. admin"
                style={{
                  border: 'none',
                  background: 'transparent',
                  outline: 'none',
                  fontSize: '1rem',
                  fontWeight: 600,
                  color: 'var(--ink)',
                  width: '100%'
                }}
              />
            </div>
          </div>

          {/* Campo NIP */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label
              style={{
                display: 'block',
                fontSize: '0.8rem',
                fontWeight: 700,
                color: 'var(--ink-secondary)',
                marginBottom: '0.4rem'
              }}
            >
              NIP de Seguridad
            </label>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                background: activeInput === 'nip' ? 'var(--brand-soft)' : 'var(--bg-surface-raised)',
                border: activeInput === 'nip' ? '2px solid var(--brand)' : '1px solid var(--border)',
                borderRadius: '14px',
                padding: '0.65rem 0.9rem',
                gap: '0.6rem',
                cursor: 'pointer'
              }}
              onClick={() => setActiveInput('nip')}
            >
              <KeyRound size={18} color="var(--brand)" />
              <input
                type={showNip ? 'text' : 'password'}
                value={nip}
                onChange={(e) => setNip(e.target.value)}
                onFocus={() => setActiveInput('nip')}
                placeholder="Ingresa tu NIP (ej. 9824)"
                style={{
                  border: 'none',
                  background: 'transparent',
                  outline: 'none',
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  letterSpacing: showNip ? 'normal' : '0.2em',
                  color: 'var(--ink)',
                  width: '100%'
                }}
              />
              <button
                type="button"
                onClick={() => setShowNip(!showNip)}
                style={{ background: 'none', border: 'none', color: 'var(--ink-faint)', cursor: 'pointer' }}
              >
                {showNip ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Teclado Numérico Táctil Rápido */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '0.5rem',
              marginBottom: '1.25rem'
            }}
          >
            {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', '⌫'].map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => {
                  if (k === 'C') handleNumpadClear();
                  else if (k === '⌫') handleNumpadBackspace();
                  else handleNumpadPress(k);
                }}
                style={{
                  height: 48,
                  fontSize: '1.15rem',
                  fontWeight: 700,
                  borderRadius: '12px',
                  border: '1px solid var(--border)',
                  background: k === 'C' ? 'rgba(239, 68, 68, 0.08)' : 'var(--bg-surface-raised)',
                  color: k === 'C' ? '#EF4444' : 'var(--ink)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.15s ease'
                }}
              >
                {k}
              </button>
            ))}
          </div>

          {/* Botón de Acceso */}
          <button
            type="submit"
            style={{
              width: '100%',
              height: 52,
              borderRadius: 'var(--radius-pill)',
              background: 'var(--brand)',
              color: '#FFFFFF',
              border: 'none',
              fontSize: '1rem',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.6rem',
              cursor: 'pointer',
              boxShadow: 'var(--shadow-glow)'
            }}
          >
            <Lock size={18} />
            <span>Ingresar al Panel</span>
          </button>
        </form>
      </div>
    </div>
  );
}

