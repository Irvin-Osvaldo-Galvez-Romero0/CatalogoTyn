import React, { useState, useEffect } from 'react';
import { X, Mail, Send, CheckCircle2, User, Phone, Sparkles, AlertCircle, ExternalLink, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';
import { emailService } from '../services/emailService';
import { pdfGenerator } from '../services/pdfGenerator';

export default function EmailQuoteModal({
  isOpen,
  onClose,
  items = [],
  totalAmount = 0,
  salesRep = null,
  pdfDoc = null
}) {
  const [recipientEmail, setRecipientEmail] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [advisorEmail, setAdvisorEmail] = useState(salesRep?.email || 'ventas@tynor.com.mx');
  const [sendOption, setSendOption] = useState('both'); // 'both' | 'client' | 'rep'
  const [isSending, setIsSending] = useState(false);
  const [result, setResult] = useState(null); // { success: boolean, message: string, mailtoUrl?: string }

  // Sincronizar correo del asesor si cambia el asesor seleccionado
  useEffect(() => {
    if (salesRep?.email) {
      setAdvisorEmail(salesRep.email);
    } else {
      setAdvisorEmail('ventas@tynor.com.mx');
    }
  }, [salesRep]);

  if (!isOpen) return null;

  const emailConfig = emailService.getConfig();

  const handleSend = async (e) => {
    e.preventDefault();
    setIsSending(true);
    setResult(null);

    let targetEmail = '';
    let targetName = '';
    let ccEmail = null;

    if (sendOption === 'both') {
      targetEmail = recipientEmail.trim();
      targetName = recipientName.trim() || 'Cliente Estimado';
      ccEmail = advisorEmail.trim() || null;
    } else if (sendOption === 'client') {
      targetEmail = recipientEmail.trim();
      targetName = recipientName.trim() || 'Cliente Estimado';
      ccEmail = null;
    } else if (sendOption === 'rep') {
      targetEmail = advisorEmail.trim();
      targetName = salesRep?.name || 'Asesor Comercial';
      ccEmail = null;
    }

    const quoteFolio = `COT-${Date.now().toString().slice(-6)}`;

    // Generar PDF formal para adjuntar directamente a la cotización
    let pdfBlob = null;
    try {
      const { doc } = await pdfGenerator.createQuotePdf({
        items,
        salesRep,
        folio: quoteFolio
      });
      if (doc) {
        pdfBlob = doc.output('blob');
      }
    } catch (pdfErr) {
      console.warn('No se pudo generar PDF para adjuntar al correo:', pdfErr);
    }

    try {
      const res = await emailService.sendQuote({
        recipientEmail: targetEmail,
        recipientName: targetName,
        ccEmail,
        quoteNumber: quoteFolio,
        items,
        totalAmount,
        salesRep,
        pdfBlob
      });

      setIsSending(false);
      setResult({
        success: true,
        message: res.message || `Cotización enviada exitosamente desde ${res.from}.`,
        mailtoUrl: res.mailtoUrl
      });

      confetti({
        particleCount: 35,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#10B4C1', '#06B6D4', '#059669']
      });
    } catch (err) {
      setIsSending(false);
      setResult({
        success: false,
        message: `Error al procesar envío: ${err.message}`
      });
    }
  };

  return (
    <div className="modal-overlay open" onClick={onClose} style={{ zIndex: 1250 }}>
      <div
        className="modal-card"
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: 'min(520px, 94vw)',
          maxHeight: '90vh',
          background: 'var(--bg-surface)',
          borderRadius: '24px',
          boxShadow: 'var(--shadow-modal)',
          border: '1px solid var(--border)',
          overflow: 'hidden',
          boxSizing: 'border-box'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabecera */}
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
              <Mail size={22} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: 'var(--ink)' }}>
                Enviar Cotización por Correo
              </h3>
              <span style={{ fontSize: '0.78rem', color: 'var(--ink-secondary)' }}>
                Emisor: {emailConfig.fromEmail || emailConfig.user || 'Configuración predeterminada'}
              </span>
            </div>
          </div>
          <button
            className="kiosk-icon-btn"
            style={{ width: 36, height: 36 }}
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </div>

        {/* Contenido con scroll independiente */}
        <div style={{ padding: '1.5rem', overflowY: 'auto' }}>
          {result?.success ? (
            <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: '50%',
                  background: 'rgba(5, 150, 105, 0.1)',
                  color: '#059669',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1rem auto'
                }}
              >
                <CheckCircle2 size={32} />
              </div>
              <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1.2rem', fontWeight: 800, color: 'var(--ink)' }}>
                ¡Cotización Enviada!
              </h4>
              <p style={{ margin: '0 0 1.5rem 0', fontSize: '0.9rem', color: 'var(--ink-secondary)', lineHeight: 1.5 }}>
                {result.message}
              </p>

              {result.mailtoUrl && (
                <a
                  href={result.mailtoUrl}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                    padding: '0.8rem 1.6rem',
                    borderRadius: 'var(--radius-pill)',
                    background: 'var(--brand)',
                    color: '#FFFFFF',
                    fontWeight: 800,
                    textDecoration: 'none',
                    fontSize: '0.95rem',
                    marginBottom: '1rem',
                    boxShadow: 'var(--shadow-glow)'
                  }}
                >
                  <ExternalLink size={18} />
                  <span>Abrir en Aplicación de Correo</span>
                </a>
              )}

              <div>
                <button
                  onClick={onClose}
                  style={{
                    padding: '0.6rem 1.5rem',
                    borderRadius: 'var(--radius-pill)',
                    border: '1px solid var(--border)',
                    background: 'var(--bg-surface-raised)',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Cerrar
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSend}>
              {/* Opciones de Destinatario */}
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--ink-secondary)' }}>
                  ¿A quién deseas enviar la cotización?
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
                  <button
                    type="button"
                    onClick={() => setSendOption('both')}
                    style={{
                      padding: '0.6rem 0.4rem',
                      borderRadius: '12px',
                      border: sendOption === 'both' ? '2px solid var(--brand)' : '1px solid var(--border)',
                      background: sendOption === 'both' ? 'var(--brand-soft)' : 'var(--bg-surface-raised)',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      color: sendOption === 'both' ? 'var(--brand)' : 'var(--ink)'
                    }}
                  >
                    Cliente y Asesor
                  </button>
                  <button
                    type="button"
                    onClick={() => setSendOption('client')}
                    style={{
                      padding: '0.6rem 0.4rem',
                      borderRadius: '12px',
                      border: sendOption === 'client' ? '2px solid var(--brand)' : '1px solid var(--border)',
                      background: sendOption === 'client' ? 'var(--brand-soft)' : 'var(--bg-surface-raised)',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      color: sendOption === 'client' ? 'var(--brand)' : 'var(--ink)'
                    }}
                  >
                    Solo al Cliente
                  </button>
                  <button
                    type="button"
                    onClick={() => setSendOption('rep')}
                    style={{
                      padding: '0.6rem 0.4rem',
                      borderRadius: '12px',
                      border: sendOption === 'rep' ? '2px solid var(--brand)' : '1px solid var(--border)',
                      background: sendOption === 'rep' ? 'var(--brand-soft)' : 'var(--bg-surface-raised)',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      color: sendOption === 'rep' ? 'var(--brand)' : 'var(--ink)'
                    }}
                  >
                    Solo al Asesor
                  </button>
                </div>
                <div style={{ fontSize: '0.74rem', color: 'var(--ink-secondary)', marginTop: '0.4rem' }}>
                  {sendOption === 'both' && '• El cliente recibe la cotización (To) y el asesor comercial recibe copia (CC) para seguimiento inmediato.'}
                  {sendOption === 'client' && '• La cotización se enviará de forma exclusiva al correo del cliente.'}
                  {sendOption === 'rep' && '• La cotización se enviará directamente al correo del asesor comercial asignado.'}
                </div>
              </div>

              {/* Campos de Cliente (cuando aplica) */}
              {sendOption !== 'rep' && (
                <>
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.35rem', color: 'var(--ink-secondary)' }}>
                      Nombre del Cliente
                    </label>
                    <input
                      type="text"
                      value={recipientName}
                      onChange={(e) => setRecipientName(e.target.value)}
                      placeholder="Ej. Dr. Carlos Mendoza / Clínica San José"
                      style={{ width: '100%', height: 44, padding: '0 0.8rem', borderRadius: '10px', border: '1px solid var(--border)', fontSize: '0.92rem' }}
                    />
                  </div>

                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.35rem', color: 'var(--ink-secondary)' }}>
                      Correo Electrónico del Cliente *
                    </label>
                    <input
                      type="email"
                      required
                      value={recipientEmail}
                      onChange={(e) => setRecipientEmail(e.target.value)}
                      placeholder="cliente@ejemplo.com"
                      style={{ width: '100%', height: 44, padding: '0 0.8rem', borderRadius: '10px', border: '1px solid var(--border)', fontSize: '0.92rem' }}
                    />
                  </div>
                </>
              )}

              {/* Correo del Asesor (cuando es Both o Rep) */}
              {sendOption !== 'client' && (
                <div style={{ marginBottom: '1.25rem' }}>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.35rem', color: 'var(--ink-secondary)' }}>
                    {sendOption === 'both' ? 'Copia al Asesor Comercial (CC) *' : 'Correo Electrónico del Asesor *'}
                  </label>
                  <input
                    type="email"
                    required
                    value={advisorEmail}
                    onChange={(e) => setAdvisorEmail(e.target.value)}
                    placeholder="asesor@tynor.com.mx"
                    style={{ width: '100%', height: 44, padding: '0 0.8rem', borderRadius: '10px', border: '1px solid var(--border)', fontSize: '0.92rem' }}
                  />
                  <span style={{ fontSize: '0.72rem', color: 'var(--ink-secondary)' }}>
                    {sendOption === 'both' ? 'El asesor recibirá copia directa sin CCO oculto.' : 'Destinatario oficial de la cotización.'}
                  </span>
                </div>
              )}

              {/* Resumen de Asesor */}
              <div
                style={{
                  padding: '0.8rem 1rem',
                  borderRadius: '12px',
                  background: 'var(--bg-surface-raised)',
                  border: '1px solid var(--border)',
                  marginBottom: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--brand)', textTransform: 'uppercase' }}>
                    Asesor Asignado
                  </span>
                  <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--ink)' }}>
                    {salesRep?.name || 'Asesor Tynor Oficial'}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--ink-secondary)' }}>
                    {salesRep?.displayPhone || '+52 55 1080 5603'}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--ink-secondary)' }}>Total Cotizado</span>
                  <div style={{ fontSize: '1rem', fontWeight: 800, color: '#059669' }}>
                    {new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(totalAmount)}
                  </div>
                </div>
              </div>

              {/* Botón de Enviar */}
              <button
                type="submit"
                disabled={isSending}
                style={{
                  width: '100%',
                  height: 50,
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
                <Send size={18} />
                <span>{isSending ? 'Preparando y Despachando...' : 'Enviar Cotización'}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
