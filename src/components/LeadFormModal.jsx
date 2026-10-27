import React, { useState, useRef } from 'react';
import confetti from 'canvas-confetti';
import { Capacitor } from '@capacitor/core';
import {
  X,
  User,
  Building2,
  Package,
  MapPin,
  Phone,
  Mail,
  Briefcase,
  CheckCircle2,
  Sparkles,
  Send,
  RotateCcw,
  AlertCircle,
  QrCode,
  Camera,
  ArrowRight
} from 'lucide-react';
import { submitLead } from '../services/supabase';
import QrScannerModal from './QrScannerModal';

// Detección de entorno APK nativo (Capacitor Android o parámetro ?apk=true de prueba)
const isApk = typeof window !== 'undefined' && (
  Capacitor.isNativePlatform() ||
  Capacitor.getPlatform() === 'android' ||
  Boolean(window.Capacitor?.isNativePlatform?.()) ||
  new URLSearchParams(window.location.search).get('apk') === 'true'
);

const ESTADOS_MEXICO = [
  'Aguascalientes', 'Baja California', 'Baja California Sur', 'Campeche', 'Chiapas',
  'Chihuahua', 'Ciudad de México', 'Coahuila', 'Colima', 'Durango',
  'Estado de México', 'Guanajuato', 'Guerrero', 'Hidalgo', 'Jalisco',
  'Michoacán', 'Morelos', 'Nayarit', 'Nuevo León', 'Oaxaca',
  'Puebla', 'Querétaro', 'Quintana Roo', 'San Luis Potosí', 'Sinaloa',
  'Sonora', 'Tabasco', 'Tamaulipas', 'Tlaxcala', 'Veracruz',
  'Yucatán', 'Zacatecas', 'Extranjero'
];

const TIPOS_NEGOCIO = [
  'Farmacia',
  'Distribuidor médico',
  'Distribuidor ortopédico',
  'Tienda de productos ortopédicos',
  'Clínica u hospital',
  'Consultorio médico',
  'Centro de fisioterapia o rehabilitación mayores',
  'Otro'
];

const PRODUCTOS_OPCIONES = [
  'Fajas y soportes',
  'Rodilleras, muñequeras y tobilleras',
  'Calzado y plantillas ortopédicas',
  'Sillas de ruedas y ayudas para movilidad',
  'Productos de rehabilitación',
  'Otro'
];

const TIPOS_OPERACION = [
  'Una sucursal',
  'Varias sucursales',
  'Venta en línea'
];

const COBERTURAS = [
  'Local',
  'Estatal',
  'Nacional'
];

const MOTIVOS_VISITA = [
  'Convertirse en distribuidor',
  'Clientes actual',
  'Otro'
];

const NIVELES_INTERES = [
  { value: 'A (alto)', label: 'A (Alto)', color: '#10B981', desc: 'Prioridad alta / Cierre inmediato' },
  { value: 'B (medio)', label: 'B (Medio)', color: '#0284C7', desc: 'Evaluando cotización' },
  { value: 'C (bajo)', label: 'C (Bajo)', color: '#F59E0B', desc: 'Solo información inicial' }
];

export default function LeadFormModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    nombreCompleto: '',
    edad: '',
    puesto: '',
    nombreEmpresa: '',
    tipoNegocio: '',
    tipoNegocioOtro: '',
    productosComercializa: [],
    productosComercializaOtro: '',
    marcasDistribuye: '',
    productosInteres: [],
    productosInteresOtro: '',
    estado: '',
    municipio: '',
    tipoOperacion: '',
    cobertura: '',
    email: '',
    telefono: '',
    motivoVisita: '',
    motivoVisitaOtro: '',
    nivelInteres: 'A (alto)',
    codigoQr: ''
  });

  const modalBodyRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [successNotice, setSuccessNotice] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [showScanner, setShowScanner] = useState(false);
  const [qrPromptCode, setQrPromptCode] = useState(null);
  const [savingQrOnly, setSavingQrOnly] = useState(false);

  if (!isOpen) return null;

  const toggleArrayItem = (key, item) => {
    setFormData((prev) => {
      const list = prev[key] || [];
      const exists = list.includes(item);
      const updated = exists ? list.filter((i) => i !== item) : [...list, item];
      return { ...prev, [key]: updated };
    });
  };

  // Función exclusiva APK: Finalizar y guardar únicamente el código QR escaneado en Supabase
  const handleSaveOnlyQr = async () => {
    if (!qrPromptCode) return;
    setSavingQrOnly(true);
    setErrorMsg('');

    try {
      const assignedRepName = localStorage.getItem('tynor_fixed_sales_rep_name') || null;
      const res = await submitLead({
        nombreCompleto: `Prospecto QR (${qrPromptCode.substring(0, 10)})`,
        nombreEmpresa: 'Registro Rápido QR',
        codigoQr: qrPromptCode,
        asesorAsignado: assignedRepName,
        nivelInteres: 'A (alto)'
      });
      setSavingQrOnly(false);
      setQrPromptCode(null);

      if (res.success) {
        setFormData({
          nombreCompleto: '',
          edad: '',
          puesto: '',
          nombreEmpresa: '',
          tipoNegocio: '',
          tipoNegocioOtro: '',
          productosComercializa: [],
          productosComercializaOtro: '',
          marcasDistribuye: '',
          productosInteres: [],
          productosInteresOtro: '',
          estado: '',
          municipio: '',
          tipoOperacion: '',
          cobertura: '',
          email: '',
          telefono: '',
          motivoVisita: '',
          motivoVisitaOtro: '',
          nivelInteres: 'A (alto)',
          codigoQr: ''
        });

        setSuccessNotice({
          name: `Código QR: ${qrPromptCode}`,
          offline: !!res.offline
        });

        setTimeout(() => {
          modalBodyRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
        }, 50);

        try {
          confetti({
            particleCount: 50,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#00A3B4', '#10B981', '#E16329', '#0284C7']
          });
        } catch {}
      } else {
        setErrorMsg('Ocurrió un error al guardar el QR. Intenta nuevamente.');
      }
    } catch (err) {
      setSavingQrOnly(false);
      setErrorMsg('Error de conexión al guardar el QR.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    // Validaciones básicas
    if (!formData.nombreCompleto.trim()) {
      setErrorMsg('Por favor ingresa el Nombre Completo.');
      return;
    }
    if (!formData.nombreEmpresa.trim()) {
      setErrorMsg('Por favor ingresa el Nombre de la Empresa o Establecimiento.');
      return;
    }
    if (!formData.telefono.trim() && !formData.email.trim()) {
      setErrorMsg('Por favor ingresa al menos un método de contacto (Teléfono o Email).');
      return;
    }

    setLoading(true);

    try {
      const assignedRepName = localStorage.getItem('tynor_fixed_sales_rep_name') || null;
      const res = await submitLead({
        ...formData,
        asesorAsignado: assignedRepName
      });
      setLoading(false);

      if (res.success) {
        const savedName = formData.nombreCompleto?.trim() || formData.nombreEmpresa?.trim() || 'Prospecto';

        // Limpiar formulario para dejarlo listo para el siguiente registro
        setFormData({
          nombreCompleto: '',
          edad: '',
          puesto: '',
          nombreEmpresa: '',
          tipoNegocio: '',
          tipoNegocioOtro: '',
          productosComercializa: [],
          productosComercializaOtro: '',
          marcasDistribuye: '',
          productosInteres: [],
          productosInteresOtro: '',
          estado: '',
          municipio: '',
          tipoOperacion: '',
          cobertura: '',
          email: '',
          telefono: '',
          motivoVisita: '',
          motivoVisitaOtro: '',
          nivelInteres: 'A (alto)',
          codigoQr: ''
        });

        setSuccessNotice({
          name: savedName,
          offline: !!res.offline
        });

        // Desplazar el scroll hacia arriba para visualizar confirmación y campos limpios
        setTimeout(() => {
          modalBodyRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
        }, 50);

        // Disparo festivo de confeti
        try {
          confetti({
            particleCount: 50,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#00A3B4', '#10B981', '#E16329', '#0284C7']
          });
        } catch {}
      } else {
        setErrorMsg('Ocurrió un error al guardar. Por favor intenta nuevamente.');
      }
    } catch (err) {
      setLoading(false);
      setErrorMsg('Error de conexión. Intenta de nuevo.');
    }
  };

  const handleResetForm = () => {
    setFormData({
      nombreCompleto: '',
      edad: '',
      puesto: '',
      nombreEmpresa: '',
      tipoNegocio: 'Distribuidor ortopédico',
      tipoNegocioOtro: '',
      productosComercializa: [],
      productosComercializaOtro: '',
      marcasDistribuye: '',
      productosInteres: [],
      productosInteresOtro: '',
      estado: 'Jalisco',
      municipio: '',
      tipoOperacion: 'Una sucursal',
      cobertura: 'Estatal',
      email: '',
      telefono: '',
      motivoVisita: 'Convertirse en distribuidor',
      motivoVisitaOtro: '',
      nivelInteres: 'A (alto)',
      codigoQr: ''
    });
    setSuccessNotice(null);
    setErrorMsg('');
  };

  return (
    <div className="lead-modal-overlay" onClick={onClose}>
      <div
        className="lead-modal-card"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-labelledby="lead-modal-title"
      >
        {/* Cabecera del Modal */}
        <div className="lead-modal-header">
          <div className="lead-modal-title-box">
            <h2 id="lead-modal-title">Formulario de Registro Comercial</h2>
            <p className="lead-modal-subtitle">
              Registro de prospectos, distribuidores y clientes Tynor México
            </p>
          </div>
          <button
            className="lead-modal-close-btn"
            onClick={onClose}
            aria-label="Cerrar formulario"
          >
            <X size={22} />
          </button>
        </div>

        {/* Contenido del Formulario */}
        <div className="lead-modal-body" ref={modalBodyRef}>
          <form onSubmit={handleSubmit} className="lead-form-grid">
            {/* Aviso de Éxito al Registrar */}
            {successNotice && (
              <div className="lead-inline-success-banner">
                <div className="lead-inline-success-icon">
                  <CheckCircle2 size={24} />
                </div>
                <div className="lead-inline-success-text">
                  <h4>¡Registro Guardado con Éxito!</h4>
                  <p>
                    Los datos de <strong>{successNotice.name}</strong> han sido registrados y sincronizados con <strong>Supabase</strong>.
                    El formulario está listo para el siguiente registro.
                  </p>
                  {successNotice.offline && (
                    <span className="lead-inline-offline-tag">
                      <AlertCircle size={14} /> Modo sin conexión: Guardado localmente, se transmitirá al recuperar internet.
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  className="lead-inline-close-btn"
                  onClick={() => setSuccessNotice(null)}
                  aria-label="Cerrar notificación"
                >
                  <X size={18} />
                </button>
              </div>
            )}

            {errorMsg && (
              <div className="lead-error-banner">
                <AlertCircle size={18} />
                <span>{errorMsg}</span>
              </div>
            )}

              {/* SECCIÓN DE ESCÁNER DE CÓDIGO QR / GAFETE */}
              <div className="lead-qr-apk-card">
                <div className="lead-qr-header">
                    <div className="lead-qr-icon-wrap">
                      <QrCode size={22} />
                    </div>
                    <div className="lead-qr-info">
                      <strong>Escanear Código QR (Gafete / Credencial)</strong>
                      <small>Escanee el código QR del visitante para vincular su identificador automáticamente.</small>
                    </div>
                  </div>

                  {formData.codigoQr ? (
                    <div className="lead-qr-scanned-box">
                      <div className="lead-qr-code-text">
                        <span className="lead-qr-label">Código QR Registrado:</span>
                        <code className="lead-qr-val">{formData.codigoQr}</code>
                      </div>
                      <div className="lead-qr-btn-group">
                        <button
                          type="button"
                          className="lead-qr-rescan-btn"
                          onClick={() => setShowScanner(true)}
                          title="Volver a escanear"
                        >
                          <Camera size={16} />
                          <span>Re-escanear</span>
                        </button>
                        <button
                          type="button"
                          className="lead-qr-clear-btn"
                          onClick={() => setFormData({ ...formData, codigoQr: '' })}
                          title="Quitar código QR"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      className="lead-qr-scan-btn"
                      onClick={() => setShowScanner(true)}
                    >
                      <Camera size={20} />
                      <span>Escanear Código QR</span>
                    </button>
                  )}
                </div>

              {/* SECCIÓN 1: DATOS PERSONALES */}
              <div className="lead-section-card">
                <div className="lead-section-title">
                  <User size={18} className="lead-sec-icon" />
                  <h4>1. Datos Personales del Contacto</h4>
                </div>
                <div className="lead-fields-row">
                  <div className="lead-field-group lead-col-6">
                    <label>
                      Nombre completo <span className="req">*</span>
                    </label>
                    <input
                      type="text"
                      className="lead-input"
                      placeholder="Ej. Dr. Carlos Mendoza Rodríguez"
                      value={formData.nombreCompleto}
                      onChange={(e) => setFormData({ ...formData, nombreCompleto: e.target.value })}
                      required
                    />
                  </div>

                  <div className="lead-field-group lead-col-3">
                    <label>Edad</label>
                    <input
                      type="number"
                      className="lead-input"
                      placeholder="Ej. 38"
                      min="18"
                      max="99"
                      value={formData.edad}
                      onChange={(e) => setFormData({ ...formData, edad: e.target.value })}
                    />
                  </div>

                  <div className="lead-field-group lead-col-3">
                    <label>Puesto o cargo</label>
                    <input
                      type="text"
                      className="lead-input"
                      placeholder="Ej. Director de Compras / Fisioterapeuta"
                      value={formData.puesto}
                      onChange={(e) => setFormData({ ...formData, puesto: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* SECCIÓN 2: INFORMACIÓN DEL NEGOCIO */}
              <div className="lead-section-card">
                <div className="lead-section-title">
                  <Building2 size={18} className="lead-sec-icon" />
                  <h4>2. Información del Negocio o Establecimiento</h4>
                </div>

                <div className="lead-field-group" style={{ marginBottom: '1rem' }}>
                  <label>
                    Nombre de la empresa o establecimiento <span className="req">*</span>
                  </label>
                  <input
                    type="text"
                    className="lead-input"
                    placeholder="Ej. Ortopedia y Salud del Bajío S.A. de C.V."
                    value={formData.nombreEmpresa}
                    onChange={(e) => setFormData({ ...formData, nombreEmpresa: e.target.value })}
                    required
                  />
                </div>

                <div className="lead-field-group">
                  <label>Tipo de negocio</label>
                  <div className="lead-pills-wrap">
                    {TIPOS_NEGOCIO.map((tipo) => (
                      <button
                        key={tipo}
                        type="button"
                        className={`lead-pill ${formData.tipoNegocio === tipo ? 'active' : ''}`}
                        onClick={() => setFormData({ ...formData, tipoNegocio: tipo })}
                      >
                        {tipo}
                      </button>
                    ))}
                  </div>

                  {formData.tipoNegocio === 'Otro' && (
                    <input
                      type="text"
                      className="lead-input"
                      style={{ marginTop: '0.65rem' }}
                      placeholder="Especifique el tipo de negocio..."
                      value={formData.tipoNegocioOtro}
                      onChange={(e) => setFormData({ ...formData, tipoNegocioOtro: e.target.value })}
                    />
                  )}
                </div>
              </div>

              {/* SECCIÓN 3: PRODUCTOS Y MARCAS */}
              <div className="lead-section-card">
                <div className="lead-section-title">
                  <Package size={18} className="lead-sec-icon" />
                  <h4>3. Catálogo de Productos y Marcas</h4>
                </div>

                <div className="lead-field-group" style={{ marginBottom: '1.25rem' }}>
                  <label>Productos que comercializa o utiliza actualmente (Selección múltiple):</label>
                  <div className="lead-pills-wrap">
                    {PRODUCTOS_OPCIONES.map((prod) => {
                      const isSelected = formData.productosComercializa.includes(prod);
                      return (
                        <button
                          key={prod}
                          type="button"
                          className={`lead-pill ${isSelected ? 'active' : ''}`}
                          onClick={() => toggleArrayItem('productosComercializa', prod)}
                        >
                          {isSelected && <CheckCircle2 size={14} style={{ marginRight: 4 }} />}
                          {prod}
                        </button>
                      );
                    })}
                  </div>
                  {formData.productosComercializa.includes('Otro') && (
                    <input
                      type="text"
                      className="lead-input"
                      style={{ marginTop: '0.65rem' }}
                      placeholder="¿Qué otros productos comercializa?"
                      value={formData.productosComercializaOtro}
                      onChange={(e) => setFormData({ ...formData, productosComercializaOtro: e.target.value })}
                    />
                  )}
                </div>

                <div className="lead-field-group" style={{ marginBottom: '1.25rem' }}>
                  <label>Marcas que distribuye actualmente (Comentario libre):</label>
                  <input
                    type="text"
                    className="lead-input"
                    placeholder="Ej. Tynor, Mueller, Oppo, DonJoy, Blunding..."
                    value={formData.marcasDistribuye}
                    onChange={(e) => setFormData({ ...formData, marcasDistribuye: e.target.value })}
                  />
                </div>

                <div className="lead-field-group">
                  <label>Productos de su interés en Tynor (Selección múltiple):</label>
                  <div className="lead-pills-wrap">
                    {PRODUCTOS_OPCIONES.map((prod) => {
                      const isSelected = formData.productosInteres.includes(prod);
                      return (
                        <button
                          key={prod}
                          type="button"
                          className={`lead-pill ${isSelected ? 'active' : ''}`}
                          onClick={() => toggleArrayItem('productosInteres', prod)}
                        >
                          {isSelected && <Sparkles size={14} style={{ marginRight: 4 }} />}
                          {prod}
                        </button>
                      );
                    })}
                  </div>
                  {formData.productosInteres.includes('Otro') && (
                    <input
                      type="text"
                      className="lead-input"
                      style={{ marginTop: '0.65rem' }}
                      placeholder="¿Qué otros productos le interesan?"
                      value={formData.productosInteresOtro}
                      onChange={(e) => setFormData({ ...formData, productosInteresOtro: e.target.value })}
                    />
                  )}
                </div>
              </div>

              {/* SECCIÓN 4: UBICACIÓN Y OPERACIÓN */}
              <div className="lead-section-card">
                <div className="lead-section-title">
                  <MapPin size={18} className="lead-sec-icon" />
                  <h4>4. Ubicación y Esquema Operativo</h4>
                </div>

                <div className="lead-fields-row" style={{ marginBottom: '1rem' }}>
                  <div className="lead-field-group lead-col-6">
                    <label>Estado de la República</label>
                    <select
                      className="lead-select"
                      value={formData.estado}
                      onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                    >
                      {ESTADOS_MEXICO.map((est) => (
                        <option key={est} value={est}>{est}</option>
                      ))}
                    </select>
                  </div>

                  <div className="lead-field-group lead-col-6">
                    <label>Localidad o municipio</label>
                    <input
                      type="text"
                      className="lead-input"
                      placeholder="Ej. Guadalajara / Zapopan"
                      value={formData.municipio}
                      onChange={(e) => setFormData({ ...formData, municipio: e.target.value })}
                    />
                  </div>
                </div>

                <div className="lead-fields-row">
                  <div className="lead-field-group lead-col-6">
                    <label>Tipo de operación</label>
                    <div className="lead-pills-wrap">
                      {TIPOS_OPERACION.map((op) => (
                        <button
                          key={op}
                          type="button"
                          className={`lead-pill ${formData.tipoOperacion === op ? 'active' : ''}`}
                          onClick={() => setFormData({ ...formData, tipoOperacion: op })}
                        >
                          {op}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="lead-field-group lead-col-6">
                    <label>Cobertura geográfica</label>
                    <div className="lead-pills-wrap">
                      {COBERTURAS.map((cob) => (
                        <button
                          key={cob}
                          type="button"
                          className={`lead-pill ${formData.cobertura === cob ? 'active' : ''}`}
                          onClick={() => setFormData({ ...formData, cobertura: cob })}
                        >
                          {cob}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* SECCIÓN 5: CONTACTO DIRECTO */}
              <div className="lead-section-card">
                <div className="lead-section-title">
                  <Phone size={18} className="lead-sec-icon" />
                  <h4>5. Canales de Contacto Directo</h4>
                </div>

                <div className="lead-fields-row">
                  <div className="lead-field-group lead-col-6">
                    <label>
                      Correo electrónico <span className="req">*</span>
                    </label>
                    <input
                      type="email"
                      className="lead-input"
                      placeholder="ejemplo@empresa.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>

                  <div className="lead-field-group lead-col-6">
                    <label>
                      Número telefónico o WhatsApp <span className="req">*</span>
                    </label>
                    <input
                      type="tel"
                      className="lead-input"
                      placeholder="Ej. 33 1234 5678"
                      value={formData.telefono}
                      onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* SECCIÓN 6: INTERÉS COMERCIAL */}
              <div className="lead-section-card">
                <div className="lead-section-title">
                  <Briefcase size={18} className="lead-sec-icon" />
                  <h4>6. Interés Comercial y Prioridad</h4>
                </div>

                <div className="lead-field-group" style={{ marginBottom: '1.25rem' }}>
                  <label>Motivo de su visita:</label>
                  <div className="lead-pills-wrap">
                    {MOTIVOS_VISITA.map((mot) => (
                      <button
                        key={mot}
                        type="button"
                        className={`lead-pill ${formData.motivoVisita === mot ? 'active' : ''}`}
                        onClick={() => setFormData({ ...formData, motivoVisita: mot })}
                      >
                        {mot}
                      </button>
                    ))}
                  </div>
                  {formData.motivoVisita === 'Otro' && (
                    <input
                      type="text"
                      className="lead-input"
                      style={{ marginTop: '0.65rem' }}
                      placeholder="Especifique el motivo de su visita..."
                      value={formData.motivoVisitaOtro}
                      onChange={(e) => setFormData({ ...formData, motivoVisitaOtro: e.target.value })}
                    />
                  )}
                </div>

                <div className="lead-field-group">
                  <label>Nivel de interés estimado:</label>
                  <div className="lead-priority-selector">
                    {NIVELES_INTERES.map((lvl) => {
                      const isSelected = formData.nivelInteres === lvl.value;
                      return (
                        <button
                          key={lvl.value}
                          type="button"
                          className={`lead-priority-btn ${isSelected ? 'active' : ''}`}
                          style={{
                            '--badge-color': lvl.color,
                            borderColor: isSelected ? lvl.color : undefined
                          }}
                          onClick={() => setFormData({ ...formData, nivelInteres: lvl.value })}
                        >
                          <span className="lead-priority-indicator" style={{ backgroundColor: lvl.color }} />
                          <div className="lead-priority-info">
                            <strong>{lvl.label}</strong>
                            <small>{lvl.desc}</small>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Botones de Acción */}
              <div className="lead-modal-footer">
                <button
                  type="button"
                  className="lead-btn-cancel"
                  onClick={onClose}
                  disabled={loading}
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="lead-btn-submit"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="lead-spinner" />
                      <span>Guardando...</span>
                    </>
                  ) : (
                    <>
                      <Send size={18} />
                      <span>Guardar Registro</span>
                    </>
                  )}
                </button>
              </div>
            </form>
        </div>
      </div>

      {/* Modal de escáner QR para APK */}
      <QrScannerModal
        isOpen={showScanner}
        onClose={() => setShowScanner(false)}
        onScanSuccess={(code) => {
          setFormData((prev) => ({ ...prev, codigoQr: code }));
          setQrPromptCode(code);
        }}
      />

      {/* Alerta/Modal de Decisión tras Escanear QR */}
      {qrPromptCode && (
        <div className="lead-qr-decision-overlay" onClick={() => setQrPromptCode(null)}>
          <div
            className="lead-qr-decision-card"
            onClick={(e) => e.stopPropagation()}
            role="alertdialog"
            aria-modal="true"
          >
            <div className="lead-qr-decision-icon-wrap">
              <QrCode size={36} />
            </div>

            <h3 className="lead-qr-decision-title">¡Código QR Escaneado!</h3>
            <p className="lead-qr-decision-subtitle">
              Se ha detectado el código del visitante:
            </p>

            <div className="lead-qr-decision-code-preview">
              <code>{qrPromptCode}</code>
            </div>

            <div className="lead-qr-decision-actions">
              <button
                type="button"
                className="lead-qr-btn-continue"
                onClick={() => {
                  setQrPromptCode(null);
                  setTimeout(() => {
                    modalBodyRef.current?.scrollTo({ top: 120, behavior: 'smooth' });
                  }, 50);
                }}
              >
                <div className="lead-qr-btn-icon">
                  <ArrowRight size={18} />
                </div>
                <div className="lead-qr-btn-text">
                  <strong>Seguir Capturando Datos</strong>
                  <small>Regresar al formulario para completar datos personales y de negocio</small>
                </div>
              </button>

              <button
                type="button"
                className="lead-qr-btn-save-only"
                onClick={handleSaveOnlyQr}
                disabled={savingQrOnly}
              >
                <div className="lead-qr-btn-icon save-icon">
                  {savingQrOnly ? <span className="lead-spinner" /> : <CheckCircle2 size={18} />}
                </div>
                <div className="lead-qr-btn-text">
                  <strong>{savingQrOnly ? 'Guardando en Supabase...' : 'Finalizar y Solo Guardar QR'}</strong>
                  <small>Registrar inmediatamente en Supabase con este código de gafete</small>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
