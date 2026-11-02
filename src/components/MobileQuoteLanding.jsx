import React, { useState, useEffect } from 'react';
import { Download, Phone, CheckCircle, ArrowLeft, Loader2, FileText, ArrowRight, ShieldCheck } from 'lucide-react';
import { pdfGenerator } from '../services/pdfGenerator';
import { brandingService } from '../services/brandingService';
import { getWhatsAppUrl, buildWhatsAppMessage, DEFAULT_SALES_REPS } from '../data/salesReps';

export default function MobileQuoteLanding({ quoteData }) {
  const [downloadStarted, setDownloadStarted] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const { items = [], salesRep = null, brandColor = '#10B4C1' } = quoteData || {};

  const currentRep = salesRep || DEFAULT_SALES_REPS[0];
  // Mensaje conciso sin texto largo ni precotizaciones redundantes
  const message = buildWhatsAppMessage(currentRep?.name || 'Asesor', items);
  const whatsappUrl = getWhatsAppUrl(currentRep?.phone || '', message);

  // Auto-descargar el PDF en el celular al cargar (compatible con Safari / iPhone y Chrome / Android)
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
    }, 700);

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

  return (
    <div style={{
      minHeight: '100dvh',
      background: 'linear-gradient(180deg, #F0FDF4 0%, #F8FAFC 100%)',
      padding: '2rem 1rem 3rem 1rem',
      fontFamily: 'Inter, system-ui, sans-serif',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#0F172A',
      boxSizing: 'border-box'
    }}>
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
        <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
          <div style={{
            width: 68,
            height: 68,
            borderRadius: '50%',
            background: downloadStarted ? '#DCFCE7' : '#EFF6FF',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '0.75rem',
            transition: 'all 0.3s ease'
          }}>
            {downloadStarted ? (
              <CheckCircle size={40} color="#16A34A" />
            ) : isGenerating ? (
              <Loader2 size={38} color="#0284C7" className="spin-animate" />
            ) : (
              <FileText size={38} color="#0284C7" />
            )}
          </div>

          <h1 style={{ margin: '0 0 0.35rem 0', fontSize: '1.35rem', fontWeight: 900, color: '#0F172A' }}>
            {downloadStarted ? '¡PDF Descargado con Éxito!' : 'Descargando tu Cotización...'}
          </h1>
          <p style={{ margin: 0, fontSize: '0.88rem', color: '#64748B', lineHeight: 1.5 }}>
            {downloadStarted
              ? 'El documento PDF oficial ya se descargó en tu dispositivo. Ahora toca el botón de abajo para abrir WhatsApp y adjuntarlo a tu asesor.'
              : 'Se está guardando automáticamente el archivo PDF oficial en las descargas de tu celular.'}
          </p>
        </div>

        {/* Resumen del Asesor y Piezas */}
        <div style={{
          background: '#F8FAFC',
          border: '1px solid #E2E8F0',
          borderRadius: 16,
          padding: '0.9rem 1.1rem',
          marginBottom: '1.25rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748B' }}>Asesor Comercial:</span>
            <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0F172A' }}>{currentRep?.name}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748B' }}>Piezas Cotizadas en PDF:</span>
            <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0F172A' }}>{totalPiezas} piezas ({items.length} modelos)</span>
          </div>
        </div>

        {/* Botón Principal: Abrir WhatsApp con el Asesor */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
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
            boxSizing: 'border-box'
          }}
        >
          <Phone size={22} color="#FFFFFF" />
          <span>Abrir WhatsApp y Adjuntar PDF</span>
        </a>

        {/* Instrucción visual para adjuntar el PDF descargado */}
        <div style={{
          background: '#F0FDF4',
          border: '1px dashed #86EFAC',
          borderRadius: 12,
          padding: '0.65rem 0.85rem',
          marginBottom: '1rem',
          fontSize: '0.8rem',
          color: '#166534',
          lineHeight: 1.45,
          textAlign: 'center'
        }}>
          💡 <strong>Paso final:</strong> En WhatsApp toca el ícono del clip 📎 (o signo <strong>+</strong> en iPhone), selecciona <strong>Documento</strong> y elige el PDF que se acaba de descargar.
        </div>

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
            height: 44,
            background: '#F1F5F9',
            border: '1px solid #CBD5E1',
            borderRadius: 12,
            color: '#334155',
            fontWeight: 700,
            fontSize: '0.84rem',
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
