import React, { useState, useEffect } from 'react';
import { Download, Phone, CheckCircle, Package, ArrowLeft, ExternalLink, Loader2, FileText } from 'lucide-react';
import { pdfGenerator } from '../services/pdfGenerator';
import { brandingService } from '../services/brandingService';
import { getWhatsAppUrl, buildWhatsAppMessage, DEFAULT_SALES_REPS } from '../data/salesReps';

export default function MobileQuoteLanding({ quoteData, onBackToKiosk }) {
  const [downloadStarted, setDownloadStarted] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [whatsappSent, setWhatsappSent] = useState(false);

  const { items = [], salesRep = null, folio = '', brandColor = '#10B4C1' } = quoteData || {};

  const currentRep = salesRep || DEFAULT_SALES_REPS[0];
  const message = buildWhatsAppMessage(currentRep?.name || 'Asesor', items);
  const whatsappUrl = getWhatsAppUrl(currentRep?.phone || '', message);

  // Auto-descargar el PDF en el móvil al montar la pantalla
  useEffect(() => {
    let isMounted = true;
    const triggerAutoDownload = async () => {
      if (items.length === 0) return;
      setIsGenerating(true);
      try {
        await pdfGenerator.downloadQuote({
          items,
          salesRep: currentRep,
          brandColor: brandColor || brandingService.getBrandColor()
        });
        if (isMounted) {
          setDownloadStarted(true);
        }
      } catch (err) {
        console.error('Error auto-downloading quote PDF on mobile:', err);
      } finally {
        if (isMounted) {
          setIsGenerating(false);
        }
      }
    };

    const timer = setTimeout(() => {
      triggerAutoDownload();
    }, 600);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, []);

  const handleManualDownload = async () => {
    setIsGenerating(true);
    try {
      await pdfGenerator.downloadQuote({
        items,
        salesRep: currentRep,
        brandColor: brandColor || brandingService.getBrandColor()
      });
      setDownloadStarted(true);
    } catch (err) {
      console.error('Error generating PDF:', err);
      alert('Hubo un error al generar el PDF.');
    } finally {
      setIsGenerating(false);
    }
  };

  const totalPiezas = items.reduce((sum, item) => {
    if (item.variants && item.variants.length > 0) {
      return sum + item.variants.reduce((vSum, v) => vSum + (v.quantity || 1), 0);
    }
    return sum + (item.quantity || 1);
  }, 0);

  const totalCost = items.reduce((sum, item) => {
    const itemPrice = Number(item.price) || 0;
    if (item.variants && item.variants.length > 0) {
      return sum + item.variants.reduce((vSum, v) => vSum + (itemPrice * (v.quantity || 1)), 0);
    }
    return sum + (itemPrice * (item.quantity || 1));
  }, 0);

  const formattedTotal = new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN'
  }).format(totalCost);

  return (
    <div style={{
      minHeight: '100dvh',
      background: 'linear-gradient(180deg, #F8FAFC 0%, #EFF6FF 100%)',
      padding: '1.25rem 1rem 3rem 1rem',
      fontFamily: 'Inter, system-ui, sans-serif',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      color: '#0F172A',
      boxSizing: 'border-box'
    }}>
      {/* Barra superior de regreso al quiosco si se ve en desktop */}
      {onBackToKiosk && (
        <div style={{ width: '100%', maxWidth: 480, marginBottom: '0.75rem' }}>
          <button
            onClick={onBackToKiosk}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--brand, #10B4C1)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontWeight: 700,
              fontSize: '0.88rem',
              cursor: 'pointer'
            }}
          >
            <ArrowLeft size={16} />
            <span>Volver al Catálogo</span>
          </button>
        </div>
      )}

      {/* Tarjeta Principal Móvil */}
      <div style={{
        width: '100%',
        maxWidth: 480,
        background: '#FFFFFF',
        borderRadius: 24,
        padding: '1.75rem 1.4rem',
        boxShadow: '0 20px 40px -15px rgba(0,0,0,0.08), 0 0 1px 1px rgba(0,0,0,0.04)',
        boxSizing: 'border-box'
      }}>
        {/* Encabezado con estado de descarga */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            background: downloadStarted ? '#ECFDF5' : '#EFF6FF',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '0.75rem',
            transition: 'all 0.3s ease'
          }}>
            {downloadStarted ? (
              <CheckCircle size={36} color="#059669" />
            ) : isGenerating ? (
              <Loader2 size={36} color="#0284C7" className="spin-animate" />
            ) : (
              <FileText size={36} color="#0284C7" />
            )}
          </div>

          <h1 style={{ margin: '0 0 0.35rem 0', fontSize: '1.35rem', fontWeight: 900, color: '#0F172A' }}>
            {downloadStarted ? '¡Cotización Oficial Descargada!' : 'Preparando tu Cotización...'}
          </h1>
          <p style={{ margin: 0, fontSize: '0.86rem', color: '#64748B', lineHeight: 1.45 }}>
            {downloadStarted
              ? 'El archivo PDF ya se encuentra en las descargas de tu celular. Ahora envíalo por WhatsApp a tu asesor.'
              : 'Se está descargando automáticamente el documento PDF oficial en tu dispositivo.'}
          </p>
        </div>

        {/* Resumen del Pedido y Asesor */}
        <div style={{
          background: '#F8FAFC',
          border: '1px solid #E2E8F0',
          borderRadius: 16,
          padding: '1rem',
          marginBottom: '1.5rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748B' }}>Asesor Comercial:</span>
            <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0F172A' }}>{currentRep?.name}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748B' }}>Piezas Totales:</span>
            <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0F172A' }}>{totalPiezas} piezas ({items.length} modelos)</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.5rem', borderTop: '1px dashed #CBD5E1' }}>
            <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0F172A' }}>Total Estimado:</span>
            <span style={{ fontSize: '1.25rem', fontWeight: 900, color: '#059669' }}>{formattedTotal}</span>
          </div>
        </div>

        {/* Lista de Artículos y Variantes Desglosadas */}
        <div style={{ marginBottom: '1.5rem' }}>
          <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '0.65rem' }}>
            Desglose de Variantes Cotizadas
          </span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', maxHeight: 220, overflowY: 'auto' }}>
            {items.map((item, idx) => (
              <div key={item.code || idx} style={{ padding: '0.65rem 0.75rem', background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0284C7' }}>Ref. {item.code}</span>
                    <h4 style={{ margin: '0.1rem 0 0.25rem 0', fontSize: '0.88rem', fontWeight: 800, color: '#0F172A' }}>{item.name}</h4>
                  </div>
                  {item.marca && (
                    <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#64748B', background: '#F1F5F9', padding: '0.15rem 0.4rem', borderRadius: 6 }}>
                      {item.marca}
                    </span>
                  )}
                </div>

                {/* Sub-variantes */}
                {item.variants && item.variants.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', marginTop: '0.35rem' }}>
                    {item.variants.map((v, vIdx) => (
                      <div key={vIdx} style={{ fontSize: '0.78rem', color: '#475569', display: 'flex', justifyContent: 'space-between', background: '#F8FAFC', padding: '0.25rem 0.45rem', borderRadius: 6 }}>
                        <span>
                          <strong>{v.quantity || 1} pz{(v.quantity || 1) > 1 ? 's' : ''}</strong> • Medida: {v.size} {v.colorName ? `• Color: ${v.colorName}` : ''}
                        </span>
                        {Number(item.price) > 0 && (
                          <span style={{ fontWeight: 700, color: '#059669' }}>
                            {new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(Number(item.price) * (v.quantity || 1))}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ fontSize: '0.78rem', color: '#475569', marginTop: '0.2rem' }}>
                    <strong>{item.quantity || 1} pz{(item.quantity || 1) > 1 ? 's' : ''}</strong> • {item.selectedSizes?.join(', ') || 'Universal'}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Botón Principal: Abrir WhatsApp y Enviar */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => setWhatsappSent(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.65rem',
            width: '100%',
            height: 54,
            background: '#25D366',
            color: '#FFFFFF',
            textDecoration: 'none',
            borderRadius: 16,
            fontWeight: 900,
            fontSize: '1rem',
            boxShadow: '0 8px 20px -4px rgba(37, 211, 102, 0.45)',
            marginBottom: '0.85rem',
            transition: 'transform 0.15s ease',
            boxSizing: 'border-box'
          }}
        >
          <Phone size={22} color="#FFFFFF" />
          <span>Enviar Precotización por WhatsApp</span>
        </a>

        {/* Botón Secundario: Re-descargar PDF */}
        <button
          type="button"
          onClick={handleManualDownload}
          disabled={isGenerating}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            width: '100%',
            height: 46,
            background: '#F1F5F9',
            border: '1px solid #CBD5E1',
            borderRadius: 14,
            color: '#334155',
            fontWeight: 700,
            fontSize: '0.86rem',
            cursor: 'pointer'
          }}
        >
          {isGenerating ? <Loader2 size={16} className="spin-animate" /> : <Download size={16} />}
          <span>{downloadStarted ? 'Volver a descargar PDF' : 'Descargar PDF ahora'}</span>
        </button>
      </div>

      <p style={{ marginTop: '1.25rem', fontSize: '0.75rem', color: '#94A3B8', textAlign: 'center' }}>
        Kiosco Digital • Cotización Electrónica Oficial
      </p>
    </div>
  );
}

