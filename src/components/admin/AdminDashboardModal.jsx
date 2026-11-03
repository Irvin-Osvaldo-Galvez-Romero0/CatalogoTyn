import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Package,
  Plus,
  Edit2,
  Trash2,
  Palette,
  Mail,
  Shield,
  Save,
  CheckCircle,
  AlertCircle,
  Upload,
  RefreshCw,
  Search,
  DollarSign,
  Layers,
  Send,
  Eye,
  KeyRound
} from 'lucide-react';
import { productManager } from '../../services/productManager';
import { brandingService } from '../../services/brandingService';
import { emailService, EMAIL_PRESETS } from '../../services/emailService';
import { CATEGORIES, BODY_PARTS } from '../../data/products';

export default function AdminDashboardModal({ isOpen, onClose, initialNip = '' }) {
  const [activeTab, setActiveTab] = useState('products'); // 'products' | 'branding' | 'email' | 'security'
  const [adminNip, setAdminNip] = useState(initialNip);

  // Estados de Productos
  const [products, setProducts] = useState(() => productManager.getAllProducts());
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditingProduct, setIsEditingProduct] = useState(false);
  const [editingCode, setEditingCode] = useState(null);
  const [productForm, setProductForm] = useState({
    code: '',
    name: '',
    marca: 'Tynor',
    cat: 'inmovilizador',
    price: '',
    stock: 10,
    bodyPart: 'rodilla',
    linea: 'Tynor Ortopedia',
    badge: 'Nuevo',
    sizes: 'CH, M, G, XL',
    hasColors: false,
    colors: [],
    hasPdf: true,
    customPdfUrl: null,
    shortDesc: '',
    desc: '',
    imageUrl: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [newColorHex, setNewColorHex] = useState('#10B4C1');
  const [newColorName, setNewColorName] = useState('');
  const [pdfFileName, setPdfFileName] = useState('');
  const [pdfFile, setPdfFile] = useState(null);

  // Modal de confirmación de NIP para acciones destructivas
  const [nipPromptOpen, setNipPromptOpen] = useState(false);
  const [nipInput, setNipInput] = useState('');
  const [nipActionCallback, setNipActionCallback] = useState(null);
  const [nipError, setNipError] = useState('');

  // Estados de Branding
  const [currentLogo, setCurrentLogo] = useState(() => brandingService.getLogo());
  const [brandColor, setBrandColor] = useState(() => brandingService.getBrandColor());
  const [brandingStatus, setBrandingStatus] = useState('');

  // Estados de Correo Emisor
  const [emailConfig, setEmailConfig] = useState(() => emailService.getConfig());
  const [testEmail, setTestEmail] = useState('');
  const [emailStatus, setEmailStatus] = useState({ type: '', message: '' });
  const [isTestingEmail, setIsTestingEmail] = useState(false);

  // Estados de Seguridad
  const [securityForm, setSecurityForm] = useState({
    currentNip: '',
    newUsername: '',
    newNip: '',
    confirmNip: ''
  });
  const [securityStatus, setSecurityStatus] = useState({ type: '', message: '' });

  useEffect(() => {
    const unsub = productManager.subscribe((prods) => setProducts(prods));
    return unsub;
  }, []);

  if (!isOpen) return null;

  // Filtrado de productos para la tabla
  const filteredProducts = products.filter((p) => {
    const term = searchTerm.toLowerCase();
    return (
      p.name?.toLowerCase().includes(term) ||
      p.code?.toLowerCase().includes(term) ||
      p.cat?.toLowerCase().includes(term)
    );
  });

  // Disparar acción con confirmación de NIP
  const requestNipVerification = (actionFn) => {
    setNipInput('');
    setNipError('');
    setNipActionCallback(() => actionFn);
    setNipPromptOpen(true);
  };

  const handleConfirmNip = async () => {
    const isValid = await productManager.verifyNip(nipInput);
    if (!isValid) {
      setNipError('NIP incorrecto. Acción cancelada por seguridad.');
      return;
    }
    setNipPromptOpen(false);
    if (nipActionCallback) {
      nipActionCallback(nipInput);
    }
  };

  // Guardar o Editar Producto
  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (!productForm.code || !productForm.name) {
      alert('Código y Nombre son obligatorios.');
      return;
    }

    requestNipVerification(async (verifiedNip) => {
      const parsedSizes = typeof productForm.sizes === 'string'
        ? productForm.sizes.split(',').map((s) => s.trim()).filter(Boolean)
        : productForm.sizes;

      const payload = {
        ...productForm,
        sizes: parsedSizes.length > 0 ? parsedSizes : ['Universal'],
        price: productForm.price != null && productForm.price !== '' ? Number(productForm.price) : 0,
        priceBySize: Object.keys(productForm.priceBySize || {}).length > 0 ? productForm.priceBySize : null
      };

      if (editingCode) {
        const res = await productManager.updateProduct(editingCode, payload, imageFile, pdfFile, verifiedNip);
        if (res.success) {
          setIsEditingProduct(false);
          setEditingCode(null);
          resetProductForm();
        } else {
          alert(`Error: ${res.error}`);
        }
      } else {
        const res = await productManager.addProduct(payload, imageFile, pdfFile, verifiedNip);
        if (res.success) {
          setIsEditingProduct(false);
          resetProductForm();
        } else {
          alert(`Error: ${res.error}`);
        }
      }
    });
  };

  const resetProductForm = () => {
    setProductForm({
      code: '',
      name: '',
      marca: 'Tynor',
      cat: 'inmovilizador',
      price: '',
      priceBySize: {},
      stock: 10,
      bodyPart: 'rodilla',
      linea: 'Tynor Ortopedia',
      badge: 'Nuevo',
      sizes: 'CH, M, G, XL',
      hasColors: false,
      colors: [],
      hasPdf: true,
      customPdfUrl: null,
      shortDesc: '',
      desc: '',
      imageUrl: ''
    });
    setImageFile(null);
    setImagePreview('');
    setPdfFileName('');
    setPdfFile(null);
    setNewColorName('');
  };

  const handleEditProductClick = (prod) => {
    setEditingCode(prod.code);
    const prodColors = prod.colors && prod.colors.length > 0 ? prod.colors : [];
    setProductForm({
      code: prod.code,
      name: prod.name,
      marca: prod.marca || 'Tynor',
      cat: prod.cat || 'inmovilizador',
      price: prod.price != null ? String(prod.price) : '',
      priceBySize: prod.priceBySize ? { ...prod.priceBySize } : {},
      stock: prod.stock != null ? prod.stock : 10,
      bodyPart: prod.bodyPart || 'rodilla',
      linea: prod.linea || 'Tynor Ortopedia',
      badge: prod.badge || '',
      sizes: Array.isArray(prod.sizes) ? prod.sizes.join(', ') : 'Universal',
      hasColors: prodColors.length > 0,
      colors: prodColors,
      hasPdf: Boolean(prod.hasPdf || prod.customPdfUrl),
      customPdfUrl: prod.customPdfUrl || null,
      shortDesc: prod.shortDesc || '',
      desc: prod.desc || '',
      imageUrl: prod.customImage || ''
    });
    setImagePreview(prod.customImage || `/assets/${prod.code}.png`);
    setPdfFileName(prod.customPdfUrl ? 'Ficha_Tecnica_Cargada.pdf' : '');
    setIsEditingProduct(true);
  };

  const handleAddColor = () => {
    if (!newColorName.trim()) return;
    const newColorObj = {
      id: newColorName.trim().slice(0, 3).toUpperCase(),
      name: newColorName.trim(),
      hex: newColorHex,
      border: newColorHex
    };
    setProductForm((prev) => ({
      ...prev,
      colors: [...(prev.colors || []), newColorObj]
    }));
    setNewColorName('');
  };

  const handleAddPresetColor = (name, hex) => {
    const newColorObj = {
      id: name.slice(0, 3).toUpperCase(),
      name,
      hex,
      border: hex
    };
    setProductForm((prev) => {
      const existing = prev.colors || [];
      if (existing.some((c) => c.name.toLowerCase() === name.toLowerCase() || c.hex.toLowerCase() === hex.toLowerCase())) {
        return prev;
      }
      return {
        ...prev,
        colors: [...existing, newColorObj]
      };
    });
  };

  const handleRemoveColor = (index) => {
    setProductForm((prev) => ({
      ...prev,
      colors: (prev.colors || []).filter((_, i) => i !== index)
    }));
  };

  const handlePdfFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setPdfFile(file);
      setPdfFileName(file.name);
      const reader = new FileReader();
      reader.onload = (ev) => {
        setProductForm((prev) => ({
          ...prev,
          hasPdf: true,
          customPdfUrl: ev.target?.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteProductClick = (code) => {
    requestNipVerification(async (verifiedNip) => {
      const res = await productManager.deleteProduct(code, verifiedNip);
      if (!res.success) {
        alert(res.error);
      }
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (ev) => setImagePreview(ev.target?.result);
      reader.readAsDataURL(file);
    }
  };

  // Manejadores de Branding
  const handleLogoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const dataUrl = ev.target?.result;
        brandingService.setLogo(dataUrl);
        setCurrentLogo(dataUrl);
        setBrandingStatus('Logotipo actualizado correctamente.');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleColorChange = (color) => {
    setBrandColor(color);
    brandingService.setBrandColor(color);
    setBrandingStatus(`Color principal actualizado a ${color}`);
  };

  const handleResetBranding = () => {
    brandingService.resetLogo();
    brandingService.resetBrandColor();
    setCurrentLogo(brandingService.getLogo());
    setBrandColor(brandingService.getBrandColor());
    setBrandingStatus('Branding restablecido a los valores oficiales de Tynor.');
  };

  // Manejadores de Correo
  const handleApplyEmailPreset = (presetKey) => {
    const preset = EMAIL_PRESETS[presetKey];
    if (!preset) return;
    setEmailConfig((prev) => ({
      ...prev,
      provider: presetKey.toLowerCase(),
      host: preset.host,
      port: preset.port,
      secure: preset.secure
    }));
    setEmailStatus({ type: 'info', message: `Preset cargado: ${preset.name}. ${preset.note}` });
  };

  const handleSaveEmailConfig = (e) => {
    e.preventDefault();
    const res = emailService.saveConfig(emailConfig);
    if (res.success) {
      setEmailStatus({ type: 'success', message: 'Configuración de correo emisor guardada exitosamente.' });
    } else {
      setEmailStatus({ type: 'error', message: `Error al guardar: ${res.error}` });
    }
  };

  const handleTestEmail = async () => {
    if (!testEmail.trim()) {
      setEmailStatus({ type: 'error', message: 'Ingresa un correo destinatario para la prueba.' });
      return;
    }
    setIsTestingEmail(true);
    setEmailStatus({ type: 'info', message: 'Verificando conexión con el servidor...' });
    const res = await emailService.testConnection(testEmail);
    setIsTestingEmail(false);
    if (res.success) {
      setEmailStatus({ type: 'success', message: res.message });
    } else {
      setEmailStatus({ type: 'error', message: res.error });
    }
  };

  // Manejador de Seguridad
  const handleUpdateSecurity = async (e) => {
    e.preventDefault();
    if (securityForm.newNip !== securityForm.confirmNip) {
      setSecurityStatus({ type: 'error', message: 'El nuevo NIP y su confirmación no coinciden.' });
      return;
    }
    const res = await productManager.updateCredentials(
      securityForm.currentNip,
      securityForm.newUsername,
      securityForm.newNip
    );
    if (res.success) {
      setSecurityStatus({ type: 'success', message: 'Usuario y NIP actualizados correctamente.' });
      setSecurityForm({ currentNip: '', newUsername: '', newNip: '', confirmNip: '' });
    } else {
      setSecurityStatus({ type: 'error', message: res.error });
    }
  };

  return (
    <div className="modal-overlay open" style={{ zIndex: 1200, padding: 0 }}>
      <div
        className="modal-card admin-dashboard-fullscreen"
        style={{
          width: '100vw',
          height: '100dvh',
          maxHeight: '100dvh',
          borderRadius: 0,
          background: 'var(--bg-kiosk)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Barra Superior del Panel */}
        <header
          style={{
            height: '68px',
            background: 'var(--bg-surface)',
            borderBottom: '1px solid var(--border)',
            padding: '0 2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexShrink: 0
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: '12px',
                background: 'var(--brand)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF'
              }}
            >
              <Shield size={24} />
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: 'var(--ink)' }}>
                Panel de Administración Kiosco
              </h2>
              <span style={{ fontSize: '0.8rem', color: 'var(--ink-faint)' }}>
                Gestión Centralizada • Tynor Ortopedia
              </span>
            </div>
          </div>

          {/* Navegación por Pestañas */}
          <nav style={{ display: 'flex', gap: '0.5rem', background: 'var(--bg-surface-raised)', padding: '0.3rem', borderRadius: 'var(--radius-pill)', border: '1px solid var(--border)' }}>
            <button
              className={`kiosk-tab-btn ${activeTab === 'products' ? 'active' : ''}`}
              onClick={() => { setActiveTab('products'); setIsEditingProduct(false); }}
              style={{ padding: '0.45rem 1.1rem', fontSize: '0.9rem', borderRadius: 'var(--radius-pill)' }}
            >
              <Package size={17} style={{ marginRight: 6 }} />
              <span>Productos ({products.length})</span>
            </button>
            <button
              className={`kiosk-tab-btn ${activeTab === 'branding' ? 'active' : ''}`}
              onClick={() => setActiveTab('branding')}
              style={{ padding: '0.45rem 1.1rem', fontSize: '0.9rem', borderRadius: 'var(--radius-pill)' }}
            >
              <Palette size={17} style={{ marginRight: 6 }} />
              <span>Branding & Logo</span>
            </button>
            <button
              className={`kiosk-tab-btn ${activeTab === 'email' ? 'active' : ''}`}
              onClick={() => setActiveTab('email')}
              style={{ padding: '0.45rem 1.1rem', fontSize: '0.9rem', borderRadius: 'var(--radius-pill)' }}
            >
              <Mail size={17} style={{ marginRight: 6 }} />
              <span>Correo Emisor</span>
            </button>
            <button
              className={`kiosk-tab-btn ${activeTab === 'security' ? 'active' : ''}`}
              onClick={() => setActiveTab('security')}
              style={{ padding: '0.45rem 1.1rem', fontSize: '0.9rem', borderRadius: 'var(--radius-pill)' }}
            >
              <KeyRound size={17} style={{ marginRight: 6 }} />
              <span>Seguridad NIP</span>
            </button>
          </nav>

          <button
            className="kiosk-icon-btn"
            style={{ width: 44, height: 44 }}
            onClick={onClose}
            aria-label="Cerrar panel de administración"
          >
            <X size={22} />
          </button>
        </header>

        {/* Cuerpo Principal del Panel */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '2rem' }}>
          {/* ================= PESTAÑA 1: PRODUCTOS ================= */}
          {activeTab === 'products' && (
            <div>
              {!isEditingProduct ? (
                <div>
                  {/* Barra de Búsqueda y Botón Agregar */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', gap: '1rem' }}>
                    <div style={{ position: 'relative', width: '380px' }}>
                      <Search size={18} style={{ position: 'absolute', left: 14, top: 14, color: 'var(--ink-faint)' }} />
                      <input
                        type="text"
                        placeholder="Buscar por nombre, código o categoría..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                          width: '100%',
                          height: 46,
                          paddingLeft: 42,
                          paddingRight: 16,
                          borderRadius: 'var(--radius-pill)',
                          border: '1px solid var(--border)',
                          background: 'var(--bg-surface)',
                          fontSize: '0.92rem',
                          color: 'var(--ink)',
                          outline: 'none'
                        }}
                      />
                    </div>

                    <button
                      onClick={() => {
                        resetProductForm();
                        setEditingCode(null);
                        setIsEditingProduct(true);
                      }}
                      style={{
                        height: 46,
                        padding: '0 1.5rem',
                        borderRadius: 'var(--radius-pill)',
                        background: 'var(--brand)',
                        color: '#FFFFFF',
                        border: 'none',
                        fontSize: '0.95rem',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.6rem',
                        cursor: 'pointer',
                        boxShadow: 'var(--shadow-glow)'
                      }}
                    >
                      <Plus size={20} />
                      <span>Agregar Nuevo Producto</span>
                    </button>
                  </div>

                  {/* Tabla de Productos */}
                  <div
                    style={{
                      background: 'var(--bg-surface)',
                      borderRadius: '16px',
                      border: '1px solid var(--border)',
                      overflow: 'hidden',
                      boxShadow: 'var(--shadow-sm)'
                    }}
                  >
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                      <thead>
                        <tr style={{ background: 'var(--bg-surface-raised)', borderBottom: '1px solid var(--border)' }}>
                          <th style={{ padding: '1rem', fontSize: '0.82rem', fontWeight: 800, color: 'var(--ink-secondary)' }}>FOTO</th>
                          <th style={{ padding: '1rem', fontSize: '0.82rem', fontWeight: 800, color: 'var(--ink-secondary)' }}>CÓDIGO</th>
                          <th style={{ padding: '1rem', fontSize: '0.82rem', fontWeight: 800, color: 'var(--ink-secondary)' }}>MARCA</th>
                          <th style={{ padding: '1rem', fontSize: '0.82rem', fontWeight: 800, color: 'var(--ink-secondary)' }}>NOMBRE DEL PRODUCTO</th>
                          <th style={{ padding: '1rem', fontSize: '0.82rem', fontWeight: 800, color: 'var(--ink-secondary)' }}>CATEGORÍA</th>
                          <th style={{ padding: '1rem', fontSize: '0.82rem', fontWeight: 800, color: 'var(--ink-secondary)' }}>PRECIO ($ MXN)</th>
                          <th style={{ padding: '1rem', fontSize: '0.82rem', fontWeight: 800, color: 'var(--ink-secondary)' }}>PDF</th>
                          <th style={{ padding: '1rem', fontSize: '0.82rem', fontWeight: 800, color: 'var(--ink-secondary)' }}>STOCK</th>
                          <th style={{ padding: '1rem', fontSize: '0.82rem', fontWeight: 800, color: 'var(--ink-secondary)', textAlign: 'right' }}>ACCIONES</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredProducts.slice(0, 50).map((p) => {
                          const imgSrc = p.customImage || `/assets/${p.code}.png`;
                          return (
                            <tr key={p.code} style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.15s ease' }}>
                              <td style={{ padding: '0.8rem 1rem' }}>
                                <div style={{ width: 44, height: 44, borderRadius: '8px', background: 'var(--bg-surface-raised)', overflow: 'hidden', border: '1px solid var(--border)' }}>
                                  <img
                                    src={imgSrc}
                                    alt={p.name}
                                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                                    onError={(e) => { e.currentTarget.src = '/assets/logo.png'; }}
                                  />
                                </div>
                              </td>
                              <td style={{ padding: '0.8rem 1rem', fontWeight: 800, color: 'var(--brand)', fontSize: '0.92rem' }}>
                                {p.code}
                                {p.isCustom && (
                                  <span style={{ marginLeft: 6, fontSize: '0.65rem', background: 'var(--brand-soft)', color: 'var(--brand)', padding: '2px 6px', borderRadius: '4px' }}>
                                    Custom
                                  </span>
                                )}
                              </td>
                              <td style={{ padding: '0.8rem 1rem', fontWeight: 800, color: 'var(--ink)', fontSize: '0.85rem' }}>
                                <span style={{ background: 'var(--bg-surface-raised)', border: '1px solid var(--border)', padding: '0.2rem 0.5rem', borderRadius: '6px' }}>
                                  {p.marca || 'Tynor'}
                                </span>
                              </td>
                              <td style={{ padding: '0.8rem 1rem', fontWeight: 700, color: 'var(--ink)', fontSize: '0.9rem' }}>
                                {p.name}
                              </td>
                              <td style={{ padding: '0.8rem 1rem', fontSize: '0.85rem', color: 'var(--ink-secondary)' }}>
                                {p.cat}
                              </td>
                              <td style={{ padding: '0.8rem 1rem', fontWeight: 800, color: '#059669', fontSize: '0.95rem' }}>
                                {p.price != null ? `$${Number(p.price).toFixed(2)}` : 'Consultar'}
                              </td>
                              <td style={{ padding: '0.8rem 1rem', fontSize: '0.85rem' }}>
                                {(p.hasPdf || p.customPdfUrl) ? (
                                  <span style={{ color: 'var(--brand)', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                                    ✓ PDF
                                  </span>
                                ) : (
                                  <span style={{ color: 'var(--ink-faint)' }}>—</span>
                                )}
                              </td>
                              <td style={{ padding: '0.8rem 1rem', fontSize: '0.85rem', color: 'var(--ink-secondary)' }}>
                                {p.stock ?? 'N/D'} uds.
                              </td>
                              <td style={{ padding: '0.8rem 1rem', textAlign: 'right' }}>
                                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                  <button
                                    onClick={() => handleEditProductClick(p)}
                                    title="Editar producto (requiere NIP)"
                                    style={{
                                      width: 36,
                                      height: 36,
                                      borderRadius: '8px',
                                      border: '1px solid var(--border)',
                                      background: 'var(--bg-surface-raised)',
                                      color: 'var(--ink)',
                                      cursor: 'pointer',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center'
                                    }}
                                  >
                                    <Edit2 size={16} />
                                  </button>
                                  {p.isCustom && (
                                    <button
                                      onClick={() => handleDeleteProductClick(p.code)}
                                      title="Eliminar producto (requiere NIP)"
                                      style={{
                                        width: 36,
                                        height: 36,
                                        borderRadius: '8px',
                                        border: '1px solid rgba(239, 68, 68, 0.2)',
                                        background: 'rgba(239, 68, 68, 0.08)',
                                        color: '#EF4444',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                      }}
                                    >
                                      <Trash2 size={16} />
                                    </button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                /* Formulario de Creación / Edición de Producto */
                <div style={{ maxWidth: '820px', margin: '0 auto', background: 'var(--bg-surface)', padding: '2rem', borderRadius: '24px', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
                    <div>
                      <h3 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 800, color: 'var(--ink)' }}>
                        {editingCode ? `Editar Producto [Ref. ${editingCode}]` : 'Agregar Nuevo Producto'}
                      </h3>
                      <span style={{ fontSize: '0.82rem', color: 'var(--ink-faint)' }}>
                        Los cambios requerirán confirmación de NIP antes de guardarse
                      </span>
                    </div>
                    <button
                      onClick={() => setIsEditingProduct(false)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-faint)' }}
                    >
                      <X size={20} />
                    </button>
                  </div>

                  <form onSubmit={handleSaveProduct} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.4rem', color: 'var(--ink-secondary)' }}>
                        Código de Referencia (Único) *
                      </label>
                      <input
                        type="text"
                        required
                        disabled={Boolean(editingCode)}
                        value={productForm.code}
                        onChange={(e) => setProductForm({ ...productForm, code: e.target.value })}
                        placeholder="Ej. 101, F-20, AR-01"
                        style={{ width: '100%', height: 44, padding: '0 0.8rem', borderRadius: '10px', border: '1px solid var(--border)', fontSize: '0.95rem' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.4rem', color: 'var(--ink-secondary)' }}>
                        Precio al Público ($ MXN) *
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        required
                        value={productForm.price}
                        onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                        placeholder="Ej. 650.00"
                        style={{ width: '100%', height: 44, padding: '0 0.8rem', borderRadius: '10px', border: '1px solid var(--border)', fontSize: '0.95rem' }}
                      />
                    </div>

                    <div style={{ gridColumn: 'span 2' }}>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.4rem', color: 'var(--ink-secondary)' }}>
                        Nombre Comercial del Producto *
                      </label>
                      <input
                        type="text"
                        required
                        value={productForm.name}
                        onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                        placeholder="Ej. Rodillera Articulada Neopreno de Alta Estabilidad"
                        style={{ width: '100%', height: 44, padding: '0 0.8rem', borderRadius: '10px', border: '1px solid var(--border)', fontSize: '0.95rem' }}
                      />
                    </div>

                    {/* Campo de Marca con Presets */}
                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.4rem', color: 'var(--ink-secondary)' }}>
                        Marca del Producto *
                      </label>
                      <input
                        type="text"
                        required
                        value={productForm.marca}
                        onChange={(e) => setProductForm({ ...productForm, marca: e.target.value })}
                        placeholder="Ej. Tynor, Body Armor, Ossur, Mueller"
                        style={{ width: '100%', height: 44, padding: '0 0.8rem', borderRadius: '10px', border: '1px solid var(--border)', fontSize: '0.95rem' }}
                      />
                      <div style={{ display: 'flex', gap: '0.35rem', marginTop: '0.35rem', flexWrap: 'wrap' }}>
                        {['Tynor', 'Body Armor', 'Ossur', 'Mueller', 'Futuro'].map((m) => (
                          <button
                            key={m}
                            type="button"
                            onClick={() => setProductForm({ ...productForm, marca: m })}
                            style={{
                              fontSize: '0.72rem',
                              padding: '0.2rem 0.55rem',
                              borderRadius: 'var(--radius-pill)',
                              border: productForm.marca === m ? '1.5px solid var(--brand)' : '1px solid var(--border)',
                              background: productForm.marca === m ? 'var(--brand-soft)' : 'var(--bg-surface-raised)',
                              color: productForm.marca === m ? 'var(--brand)' : 'var(--ink)',
                              cursor: 'pointer',
                              fontWeight: 700
                            }}
                          >
                            {m}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.4rem', color: 'var(--ink-secondary)' }}>
                        Categoría
                      </label>
                      <select
                        value={productForm.cat}
                        onChange={(e) => setProductForm({ ...productForm, cat: e.target.value })}
                        style={{ width: '100%', height: 44, padding: '0 0.8rem', borderRadius: '10px', border: '1px solid var(--border)', fontSize: '0.95rem', background: 'var(--bg-surface)' }}
                      >
                        {CATEGORIES.map((c) => (
                          <option key={c.id} value={c.id}>{c.label}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.4rem', color: 'var(--ink-secondary)' }}>
                        Parte del Cuerpo (Anatomía 3D)
                      </label>
                      <select
                        value={productForm.bodyPart}
                        onChange={(e) => setProductForm({ ...productForm, bodyPart: e.target.value })}
                        style={{ width: '100%', height: 44, padding: '0 0.8rem', borderRadius: '10px', border: '1px solid var(--border)', fontSize: '0.95rem', background: 'var(--bg-surface)' }}
                      >
                        {BODY_PARTS.map((bp) => (
                          <option key={bp.id} value={bp.id}>{bp.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.4rem', color: 'var(--ink-secondary)' }}>
                        Unidades Disponibles (Stock)
                      </label>
                      <input
                        type="number"
                        value={productForm.stock}
                        onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                        style={{ width: '100%', height: 44, padding: '0 0.8rem', borderRadius: '10px', border: '1px solid var(--border)', fontSize: '0.95rem' }}
                      />
                    </div>

                    <div style={{ gridColumn: 'span 2' }}>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.4rem', color: 'var(--ink-secondary)' }}>
                        Tallas Disponibles (separadas por coma)
                      </label>
                      <input
                        type="text"
                        value={productForm.sizes}
                        onChange={(e) => setProductForm({ ...productForm, sizes: e.target.value })}
                        placeholder="CH, M, G, XL o Universal"
                        style={{ width: '100%', height: 44, padding: '0 0.8rem', borderRadius: '10px', border: '1px solid var(--border)', fontSize: '0.95rem' }}
                      />
                    </div>

                    {/* Precios específicos por Talla / Medida */}
                    <div style={{ gridColumn: 'span 2', padding: '1rem', background: 'var(--bg-surface-raised)', borderRadius: '14px', border: '1px solid var(--border)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                        <div>
                          <strong style={{ fontSize: '0.9rem', color: 'var(--ink)', display: 'block' }}>Precios Específicos por Medida / Talla (Opcional)</strong>
                          <span style={{ fontSize: '0.76rem', color: 'var(--ink-faint)' }}>
                            Si algunas tallas (ej. XL, XXL o Especial) tienen precio diferente al precio base (${productForm.price || '0.00'}), asígnalo aquí:
                          </span>
                        </div>
                      </div>

                      {(() => {
                        const parsedList = typeof productForm.sizes === 'string'
                          ? productForm.sizes.split(',').map((s) => s.trim()).filter(Boolean)
                          : (Array.isArray(productForm.sizes) ? productForm.sizes : []);
                        
                        if (parsedList.length === 0) {
                          return (
                            <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--ink-faint)', fontStyle: 'italic' }}>
                              Escribe las tallas arriba separadas por coma para definir tarifas personalizadas por medida.
                            </p>
                          );
                        }

                        return (
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '0.6rem' }}>
                            {parsedList.map((sz) => {
                              const customPrice = productForm.priceBySize?.[sz] ?? '';
                              const hasCustom = customPrice !== '' && customPrice !== undefined;
                              return (
                                <div
                                  key={sz}
                                  style={{
                                    background: 'var(--bg-surface)',
                                    border: hasCustom ? '1.5px solid var(--brand)' : '1px solid var(--border)',
                                    borderRadius: '10px',
                                    padding: '0.5rem 0.6rem',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '0.3rem'
                                  }}
                                >
                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontSize: '0.8rem', fontWeight: 800, color: hasCustom ? 'var(--brand)' : 'var(--ink)' }}>{sz}</span>
                                    {hasCustom && (
                                      <button
                                        type="button"
                                        onClick={() => {
                                          const nextMap = { ...(productForm.priceBySize || {}) };
                                          delete nextMap[sz];
                                          setProductForm({ ...productForm, priceBySize: nextMap });
                                        }}
                                        title="Quitar precio especial y volver al base"
                                        style={{ background: 'transparent', border: 'none', color: '#EF4444', cursor: 'pointer', padding: 0, fontSize: '0.75rem', fontWeight: 700 }}
                                      >
                                        ✕
                                      </button>
                                    )}
                                  </div>
                                  <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                                    <span style={{ position: 'absolute', left: 7, fontSize: '0.8rem', color: 'var(--ink-faint)', fontWeight: 700 }}>$</span>
                                    <input
                                      type="number"
                                      step="0.01"
                                      placeholder={productForm.price || '0.00'}
                                      value={customPrice}
                                      onChange={(e) => {
                                        const val = e.target.value;
                                        const nextMap = { ...(productForm.priceBySize || {}) };
                                        if (val === '') {
                                          delete nextMap[sz];
                                        } else {
                                          nextMap[sz] = Number(val);
                                        }
                                        setProductForm({ ...productForm, priceBySize: nextMap });
                                      }}
                                      style={{
                                        width: '100%',
                                        height: 32,
                                        padding: '0 0.4rem 0 1.25rem',
                                        borderRadius: '6px',
                                        border: '1px solid var(--border)',
                                        fontSize: '0.82rem',
                                        fontWeight: hasCustom ? 800 : 500,
                                        color: hasCustom ? '#059669' : 'var(--ink)',
                                        background: 'var(--bg-surface)'
                                      }}
                                    />
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        );
                      })()}
                    </div>

                    {/* Sección Ficha Técnica PDF */}
                    <div style={{ gridColumn: 'span 2', padding: '1rem', background: 'var(--bg-surface-raised)', borderRadius: '14px', border: '1px solid var(--border)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                        <div>
                          <strong style={{ fontSize: '0.9rem', color: 'var(--ink)' }}>Ficha Técnica PDF</strong>
                          <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--ink-faint)' }}>
                            Permite abrir y consultar el documento PDF en el catálogo
                          </span>
                        </div>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 700, color: 'var(--ink)' }}>
                          <input
                            type="checkbox"
                            checked={productForm.hasPdf}
                            onChange={(e) => setProductForm({ ...productForm, hasPdf: e.target.checked })}
                            style={{ width: 18, height: 18, accentColor: 'var(--brand)', cursor: 'pointer' }}
                          />
                          <span>Incluye PDF</span>
                        </label>
                      </div>

                      {productForm.hasPdf && (
                        <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
                          <label
                            style={{
                              padding: '0.5rem 1rem',
                              borderRadius: 'var(--radius-pill)',
                              background: 'var(--brand)',
                              color: '#FFFFFF',
                              fontSize: '0.82rem',
                              fontWeight: 700,
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.4rem'
                            }}
                          >
                            <Upload size={15} />
                            <span>Subir Archivo PDF</span>
                            <input type="file" accept="application/pdf" onChange={handlePdfFileChange} style={{ display: 'none' }} />
                          </label>
                          {(pdfFileName || productForm.customPdfUrl) && (
                            <span style={{ fontSize: '0.82rem', color: '#059669', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                              ✓ PDF listo: {pdfFileName || 'Ficha Cargada'}
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Sección Variantes de Color (Algunos llevan colores) */}
                    <div style={{ gridColumn: 'span 2', padding: '1rem', background: 'var(--bg-surface-raised)', borderRadius: '14px', border: '1px solid var(--border)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                        <div>
                          <strong style={{ fontSize: '0.9rem', color: 'var(--ink)' }}>Variantes de Color</strong>
                          <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--ink-faint)' }}>
                            Actívalo solo para productos que se ofrecen en distintos colores
                          </span>
                        </div>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 700, color: 'var(--ink)' }}>
                          <input
                            type="checkbox"
                            checked={productForm.hasColors}
                            onChange={(e) => {
                              const checked = e.target.checked;
                              setProductForm({
                                ...productForm,
                                hasColors: checked,
                                colors: checked ? (productForm.colors.length > 0 ? productForm.colors : [{ id: 'NE', name: 'Negro', hex: '#1E293B', border: '#0F172A' }]) : []
                              });
                            }}
                            style={{ width: 18, height: 18, accentColor: 'var(--brand)', cursor: 'pointer' }}
                          />
                          <span>Lleva Colores</span>
                        </label>
                      </div>

                      {productForm.hasColors && (
                        <div>
                          {/* Colores actuales cargados */}
                          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '0.8rem' }}>
                            {(productForm.colors || []).map((col, idx) => (
                              <span
                                key={idx}
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '0.35rem',
                                  padding: '0.3rem 0.6rem',
                                  borderRadius: 'var(--radius-pill)',
                                  background: 'var(--bg-surface)',
                                  border: '1px solid var(--border)',
                                  fontSize: '0.8rem',
                                  fontWeight: 700
                                }}
                              >
                                <span style={{ width: 10, height: 10, borderRadius: '50%', background: col.hex, border: '1px solid rgba(0,0,0,0.2)' }} />
                                <span>{col.name}</span>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveColor(idx)}
                                  style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: 0 }}
                                >
                                  <X size={14} />
                                </button>
                              </span>
                            ))}
                          </div>

                          {/* Presets Rápidos */}
                          <div style={{ marginBottom: '0.75rem' }}>
                            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--ink-secondary)', display: 'block', marginBottom: '0.3rem' }}>
                              Presets Rápidos:
                            </span>
                            <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                              {[
                                { name: 'Negro', hex: '#1E293B' },
                                { name: 'Beige', hex: '#D4B996' },
                                { name: 'Azul', hex: '#1D4ED8' },
                                { name: 'Gris', hex: '#64748B' },
                                { name: 'Naranja Neón', hex: '#FF6B00' },
                                { name: 'Verde Neón', hex: '#10B981' }
                              ].map((cp) => (
                                <button
                                  key={cp.name}
                                  type="button"
                                  onClick={() => handleAddPresetColor(cp.name, cp.hex)}
                                  style={{
                                    fontSize: '0.72rem',
                                    padding: '0.2rem 0.55rem',
                                    borderRadius: 'var(--radius-pill)',
                                    border: '1px solid var(--border)',
                                    background: 'var(--bg-surface)',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.3rem',
                                    cursor: 'pointer',
                                    fontWeight: 600
                                  }}
                                >
                                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: cp.hex }} />
                                  <span>+ {cp.name}</span>
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Añadir Color Personalizado */}
                          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                            <input
                              type="color"
                              value={newColorHex}
                              onChange={(e) => setNewColorHex(e.target.value)}
                              style={{ width: 36, height: 36, borderRadius: '8px', border: 'none', cursor: 'pointer' }}
                            />
                            <input
                              type="text"
                              value={newColorName}
                              onChange={(e) => setNewColorName(e.target.value)}
                              placeholder="Nombre del color (ej. Turquesa)"
                              style={{ flex: 1, height: 36, padding: '0 0.6rem', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '0.85rem' }}
                            />
                            <button
                              type="button"
                              onClick={handleAddColor}
                              style={{ height: 36, padding: '0 1rem', borderRadius: 'var(--radius-pill)', background: 'var(--brand)', color: '#FFFFFF', border: 'none', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}
                            >
                              Agregar Color
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Subida de Imagen con Previsualización */}
                    <div style={{ gridColumn: 'span 2' }}>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.4rem', color: 'var(--ink-secondary)' }}>
                        Imagen del Producto (Compresión WebP automática)
                      </label>
                      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        {imagePreview && (
                          <div style={{ width: 80, height: 80, borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--bg-surface-raised)', overflow: 'hidden' }}>
                            <img src={imagePreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                          </div>
                        )}
                        <label
                          style={{
                            flex: 1,
                            height: 60,
                            borderRadius: '12px',
                            border: '2px dashed var(--brand)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.6rem',
                            cursor: 'pointer',
                            background: 'var(--brand-soft)',
                            color: 'var(--brand)',
                            fontWeight: 700,
                            fontSize: '0.9rem'
                          }}
                        >
                          <Upload size={20} />
                          <span>Seleccionar archivo de imagen</span>
                          <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
                        </label>
                      </div>
                    </div>

                    <div style={{ gridColumn: 'span 2' }}>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.4rem', color: 'var(--ink-secondary)' }}>
                        Descripción Clínica / Detallada
                      </label>
                      <textarea
                        rows={3}
                        value={productForm.desc}
                        onChange={(e) => setProductForm({ ...productForm, desc: e.target.value })}
                        placeholder="Descripción médica de la férula o dispositivo ortopédico..."
                        style={{ width: '100%', padding: '0.8rem', borderRadius: '10px', border: '1px solid var(--border)', fontSize: '0.92rem' }}
                      />
                    </div>

                    {/* Botones de Acción */}
                    <div style={{ gridColumn: 'span 2', display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                      <button
                        type="button"
                        onClick={() => setIsEditingProduct(false)}
                        style={{
                          padding: '0 1.5rem',
                          height: 48,
                          borderRadius: 'var(--radius-pill)',
                          border: '1px solid var(--border)',
                          background: 'transparent',
                          color: 'var(--ink)',
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        style={{
                          padding: '0 2rem',
                          height: 48,
                          borderRadius: 'var(--radius-pill)',
                          background: 'var(--brand)',
                          color: '#FFFFFF',
                          border: 'none',
                          fontWeight: 800,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          boxShadow: 'var(--shadow-glow)'
                        }}
                      >
                        <Save size={18} />
                        <span>Guardar Producto (con NIP)</span>
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          )}

          {/* ================= PESTAÑA 2: BRANDING ================= */}
          {activeTab === 'branding' && (
            <div style={{ maxWidth: '720px', margin: '0 auto', background: 'var(--bg-surface)', padding: '2rem', borderRadius: '24px', border: '1px solid var(--border)' }}>
              <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.25rem', fontWeight: 800, color: 'var(--ink)' }}>
                Personalización de Marca & Identidad Visual
              </h3>
              <p style={{ margin: '0 0 1.5rem 0', fontSize: '0.88rem', color: 'var(--ink-secondary)' }}>
                Cambia el logotipo principal y la paleta de color para adaptarla a cualquier marca o evento.
              </p>

              {brandingStatus && (
                <div style={{ padding: '0.75rem 1rem', borderRadius: '12px', background: 'var(--brand-soft)', color: 'var(--brand)', marginBottom: '1.5rem', fontWeight: 600, fontSize: '0.85rem' }}>
                  {brandingStatus}
                </div>
              )}

              {/* Logotipo */}
              <div style={{ marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border)' }}>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--ink)' }}>
                  Logotipo Oficial del Quiosco
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                  <div style={{ padding: '1rem', background: 'var(--bg-surface-raised)', borderRadius: '14px', border: '1px solid var(--border)', maxWidth: '220px' }}>
                    <img src={currentLogo} alt="Logo activo" style={{ maxWidth: '100%', maxHeight: '50px', objectFit: 'contain' }} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ padding: '0.6rem 1.2rem', borderRadius: 'var(--radius-pill)', background: 'var(--brand)', color: '#FFFFFF', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Upload size={16} />
                      <span>Subir Nuevo Logo</span>
                      <input type="file" accept="image/*" onChange={handleLogoUpload} style={{ display: 'none' }} />
                    </label>
                    <button
                      onClick={handleResetBranding}
                      style={{ padding: '0.5rem 1rem', borderRadius: 'var(--radius-pill)', border: '1px solid var(--border)', background: 'none', color: 'var(--ink-faint)', fontSize: '0.8rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                    >
                      <RefreshCw size={14} />
                      <span>Restablecer Logo Oficial</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Color Principal */}
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--ink)' }}>
                  Color Primario de la Aplicación
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
                  <input
                    type="color"
                    value={brandColor}
                    onChange={(e) => handleColorChange(e.target.value)}
                    style={{ width: 52, height: 52, borderRadius: '12px', border: 'none', cursor: 'pointer' }}
                  />
                  <input
                    type="text"
                    value={brandColor}
                    onChange={(e) => handleColorChange(e.target.value)}
                    style={{ width: 120, height: 44, borderRadius: '10px', border: '1px solid var(--border)', padding: '0 0.8rem', fontWeight: 700, textTransform: 'uppercase' }}
                  />
                </div>

                {/* Presets Médicos */}
                <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                  {[
                    { name: 'Tynor Cyan', hex: '#10B4C1' },
                    { name: 'Azul Clínico', hex: '#0284C7' },
                    { name: 'Verde Médico', hex: '#059669' },
                    { name: 'Púrpura Ortopedia', hex: '#7C3AED' },
                    { name: 'Ámbar Cálido', hex: '#D97706' },
                    { name: 'Rojo Terapéutico', hex: '#E11D48' }
                  ].map((p) => (
                    <button
                      key={p.hex}
                      onClick={() => handleColorChange(p.hex)}
                      style={{
                        padding: '0.4rem 0.8rem',
                        borderRadius: 'var(--radius-pill)',
                        border: brandColor === p.hex ? `2px solid ${p.hex}` : '1px solid var(--border)',
                        background: 'var(--bg-surface-raised)',
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem'
                      }}
                    >
                      <span style={{ width: 12, height: 12, borderRadius: '50%', background: p.hex }} />
                      <span>{p.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ================= PESTAÑA 3: CORREO EMISOR ================= */}
          {activeTab === 'email' && (
            <div style={{ maxWidth: '760px', margin: '0 auto', background: 'var(--bg-surface)', padding: '2rem', borderRadius: '24px', border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
                <div>
                  <h3 style={{ margin: '0 0 0.4rem 0', fontSize: '1.25rem', fontWeight: 800, color: 'var(--ink)' }}>
                    Configuración de Cuenta Emisora Centralizada (Zero-Code)
                  </h3>
                  <span style={{ fontSize: '0.85rem', color: 'var(--ink-secondary)' }}>
                    Todos los correos con cotizaciones saldrán de esta única cuenta hacia clientes y asesores
                  </span>
                </div>
              </div>

              {/* Botones de Presets */}
              <div style={{ display: 'flex', gap: '0.6rem', marginBottom: '1.5rem' }}>
                <button
                  type="button"
                  onClick={() => handleApplyEmailPreset('GMAIL')}
                  style={{ flex: 1, padding: '0.7rem', borderRadius: '12px', border: '1px solid var(--border)', background: emailConfig.provider === 'gmail' ? 'var(--brand-soft)' : 'var(--bg-surface-raised)', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}
                >
                  Preset: Gmail
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyEmailPreset('OUTLOOK')}
                  style={{ flex: 1, padding: '0.7rem', borderRadius: '12px', border: '1px solid var(--border)', background: emailConfig.provider === 'outlook' ? 'var(--brand-soft)' : 'var(--bg-surface-raised)', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}
                >
                  Preset: Outlook / 365
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyEmailPreset('CUSTOM')}
                  style={{ flex: 1, padding: '0.7rem', borderRadius: '12px', border: '1px solid var(--border)', background: emailConfig.provider === 'custom' ? 'var(--brand-soft)' : 'var(--bg-surface-raised)', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}
                >
                  Preset: Dominio Propio
                </button>
              </div>

              {emailStatus.message && (
                <div
                  style={{
                    padding: '0.75rem 1rem',
                    borderRadius: '12px',
                    marginBottom: '1.5rem',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    background: emailStatus.type === 'error' ? 'rgba(239, 68, 68, 0.1)' : 'var(--brand-soft)',
                    color: emailStatus.type === 'error' ? '#EF4444' : 'var(--brand)'
                  }}
                >
                  {emailStatus.message}
                </div>
              )}

              <form onSubmit={handleSaveEmailConfig} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.35rem', color: 'var(--ink-secondary)' }}>
                    Correo Electrónico Emisor
                  </label>
                  <input
                    type="email"
                    required
                    value={emailConfig.fromEmail}
                    onChange={(e) => setEmailConfig({ ...emailConfig, fromEmail: e.target.value })}
                    placeholder="cotizaciones@empresa.com"
                    style={{ width: '100%', height: 44, padding: '0 0.8rem', borderRadius: '10px', border: '1px solid var(--border)' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.35rem', color: 'var(--ink-secondary)' }}>
                    Nombre del Remitente Visible
                  </label>
                  <input
                    type="text"
                    required
                    value={emailConfig.fromName}
                    onChange={(e) => setEmailConfig({ ...emailConfig, fromName: e.target.value })}
                    placeholder="Tynor Ortopedia — Cotizaciones"
                    style={{ width: '100%', height: 44, padding: '0 0.8rem', borderRadius: '10px', border: '1px solid var(--border)' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.35rem', color: 'var(--ink-secondary)' }}>
                    Servidor SMTP (Host)
                  </label>
                  <input
                    type="text"
                    required
                    value={emailConfig.host}
                    onChange={(e) => setEmailConfig({ ...emailConfig, host: e.target.value })}
                    placeholder="smtp.tudominio.com"
                    style={{ width: '100%', height: 44, padding: '0 0.8rem', borderRadius: '10px', border: '1px solid var(--border)' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.35rem', color: 'var(--ink-secondary)' }}>
                    Puerto (ej. 587 o 465)
                  </label>
                  <input
                    type="number"
                    required
                    value={emailConfig.port}
                    onChange={(e) => setEmailConfig({ ...emailConfig, port: e.target.value })}
                    style={{ width: '100%', height: 44, padding: '0 0.8rem', borderRadius: '10px', border: '1px solid var(--border)' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.35rem', color: 'var(--ink-secondary)' }}>
                    Usuario de Autenticación
                  </label>
                  <input
                    type="text"
                    required
                    value={emailConfig.user}
                    onChange={(e) => setEmailConfig({ ...emailConfig, user: e.target.value })}
                    placeholder="ej. cotizaciones@empresa.com"
                    style={{ width: '100%', height: 44, padding: '0 0.8rem', borderRadius: '10px', border: '1px solid var(--border)' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.35rem', color: 'var(--ink-secondary)' }}>
                    Contraseña / App Password
                  </label>
                  <input
                    type="password"
                    required
                    value={emailConfig.password}
                    onChange={(e) => setEmailConfig({ ...emailConfig, password: e.target.value })}
                    placeholder="••••••••••••"
                    style={{ width: '100%', height: 44, padding: '0 0.8rem', borderRadius: '10px', border: '1px solid var(--border)' }}
                  />
                </div>

                {/* Sección de Sincronización IMAP */}
                <div style={{ gridColumn: 'span 2', marginTop: '0.5rem', padding: '1rem', background: 'var(--bg-surface-raised)', borderRadius: '14px', border: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.8rem' }}>
                    <div>
                      <h4 style={{ margin: '0 0 0.2rem 0', fontSize: '0.92rem', fontWeight: 800, color: 'var(--ink)' }}>
                        Sincronización IMAP y Copia de Respaldo
                      </h4>
                      <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--ink-secondary)' }}>
                        Garantiza que cualquier cotización enviada quede visible de inmediato en tu cuenta de correo y carpeta de Enviados.
                      </p>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem', marginBottom: '0.8rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.3rem', color: 'var(--ink-secondary)' }}>
                        Servidor IMAP (Host)
                      </label>
                      <input
                        type="text"
                        value={emailConfig.imapHost || ''}
                        onChange={(e) => setEmailConfig({ ...emailConfig, imapHost: e.target.value })}
                        placeholder={emailConfig.host ? `Igual a SMTP (${emailConfig.host})` : 'gator2006.hostgator.com'}
                        style={{ width: '100%', height: 40, padding: '0 0.8rem', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '0.85rem' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.3rem', color: 'var(--ink-secondary)' }}>
                        Puerto IMAP (SSL)
                      </label>
                      <input
                        type="number"
                        value={emailConfig.imapPort || 993}
                        onChange={(e) => setEmailConfig({ ...emailConfig, imapPort: e.target.value })}
                        style={{ width: '100%', height: 40, padding: '0 0.8rem', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '0.85rem' }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--ink)', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={emailConfig.syncImap !== false}
                        onChange={(e) => setEmailConfig({ ...emailConfig, syncImap: e.target.checked })}
                        style={{ width: 17, height: 17, accentColor: 'var(--brand)', cursor: 'pointer' }}
                      />
                      <span>Guardar copia automáticamente en mi carpeta "Enviados" de IMAP</span>
                    </label>

                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--ink)', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={emailConfig.copyToSender !== false}
                        onChange={(e) => setEmailConfig({ ...emailConfig, copyToSender: e.target.checked })}
                        style={{ width: 17, height: 17, accentColor: 'var(--brand)', cursor: 'pointer' }}
                      />
                      <span>Recibir copia oculta de respaldo en mi bandeja de entrada (Cco / BCC)</span>
                    </label>
                  </div>
                </div>

                <div style={{ gridColumn: 'span 2', display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                  <button
                    type="submit"
                    style={{ padding: '0 1.8rem', height: 46, borderRadius: 'var(--radius-pill)', background: 'var(--brand)', color: '#FFFFFF', border: 'none', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                  >
                    <Save size={18} />
                    <span>Guardar Configuración de Correo</span>
                  </button>
                </div>
              </form>

              {/* Prueba de Conexión en Vivo */}
              <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border)' }}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.95rem', fontWeight: 800, color: 'var(--ink)' }}>
                  Prueba de Envío en Tiempo Real
                </h4>
                <div style={{ display: 'flex', gap: '0.8rem' }}>
                  <input
                    type="email"
                    value={testEmail}
                    onChange={(e) => setTestEmail(e.target.value)}
                    placeholder="Ingresa tu correo personal para recibir prueba..."
                    style={{ flex: 1, height: 44, padding: '0 0.8rem', borderRadius: '10px', border: '1px solid var(--border)' }}
                  />
                  <button
                    type="button"
                    disabled={isTestingEmail}
                    onClick={handleTestEmail}
                    style={{ padding: '0 1.5rem', height: 44, borderRadius: 'var(--radius-pill)', background: 'var(--bg-surface-raised)', border: '1px solid var(--border)', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                  >
                    <Send size={16} />
                    <span>{isTestingEmail ? 'Probando...' : 'Enviar Prueba'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ================= PESTAÑA 4: SEGURIDAD ================= */}
          {activeTab === 'security' && (
            <div style={{ maxWidth: '520px', margin: '0 auto', background: 'var(--bg-surface)', padding: '2rem', borderRadius: '24px', border: '1px solid var(--border)' }}>
              <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.25rem', fontWeight: 800, color: 'var(--ink)' }}>
                Seguridad & Cambio de Credenciales
              </h3>
              <p style={{ margin: '0 0 1.5rem 0', fontSize: '0.85rem', color: 'var(--ink-secondary)' }}>
                Cambia el Usuario o NIP de acceso al panel y confirmación de acciones.
              </p>

              {securityStatus.message && (
                <div
                  style={{
                    padding: '0.75rem 1rem',
                    borderRadius: '12px',
                    marginBottom: '1.5rem',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    background: securityStatus.type === 'error' ? 'rgba(239, 68, 68, 0.1)' : 'var(--brand-soft)',
                    color: securityStatus.type === 'error' ? '#EF4444' : 'var(--brand)'
                  }}
                >
                  {securityStatus.message}
                </div>
              )}

              <form onSubmit={handleUpdateSecurity} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.35rem', color: 'var(--ink-secondary)' }}>
                    NIP Actual de Administrador *
                  </label>
                  <input
                    type="password"
                    required
                    value={securityForm.currentNip}
                    onChange={(e) => setSecurityForm({ ...securityForm, currentNip: e.target.value })}
                    placeholder="Ingresa tu NIP actual"
                    style={{ width: '100%', height: 44, padding: '0 0.8rem', borderRadius: '10px', border: '1px solid var(--border)' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.35rem', color: 'var(--ink-secondary)' }}>
                    Nuevo Nombre de Usuario *
                  </label>
                  <input
                    type="text"
                    required
                    value={securityForm.newUsername}
                    onChange={(e) => setSecurityForm({ ...securityForm, newUsername: e.target.value })}
                    placeholder="Ej. admin o supervisor"
                    style={{ width: '100%', height: 44, padding: '0 0.8rem', borderRadius: '10px', border: '1px solid var(--border)' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.35rem', color: 'var(--ink-secondary)' }}>
                    Nuevo NIP (mínimo 4 dígitos) *
                  </label>
                  <input
                    type="password"
                    required
                    value={securityForm.newNip}
                    onChange={(e) => setSecurityForm({ ...securityForm, newNip: e.target.value })}
                    placeholder="••••"
                    style={{ width: '100%', height: 44, padding: '0 0.8rem', borderRadius: '10px', border: '1px solid var(--border)' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.35rem', color: 'var(--ink-secondary)' }}>
                    Confirmar Nuevo NIP *
                  </label>
                  <input
                    type="password"
                    required
                    value={securityForm.confirmNip}
                    onChange={(e) => setSecurityForm({ ...securityForm, confirmNip: e.target.value })}
                    placeholder="••••"
                    style={{ width: '100%', height: 44, padding: '0 0.8rem', borderRadius: '10px', border: '1px solid var(--border)' }}
                  />
                </div>

                <button
                  type="submit"
                  style={{ marginTop: '0.5rem', width: '100%', height: 48, borderRadius: 'var(--radius-pill)', background: 'var(--brand)', color: '#FFFFFF', border: 'none', fontWeight: 800, cursor: 'pointer' }}
                >
                  Actualizar Credenciales
                </button>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* Modal Emergente de Confirmación con NIP */}
      {nipPromptOpen && (
        <div className="modal-overlay open" style={{ zIndex: 1300 }}>
          <div
            className="modal-card"
            style={{ width: 'min(380px, 90vw)', background: 'var(--bg-surface)', padding: '1.5rem', borderRadius: '20px', border: '1px solid var(--border-strong)', boxShadow: 'var(--shadow-modal)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
              <KeyRound size={20} color="var(--brand)" />
              <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: 'var(--ink)' }}>
                Confirmación de Seguridad
              </h4>
            </div>
            <p style={{ margin: '0 0 1rem 0', fontSize: '0.85rem', color: 'var(--ink-secondary)' }}>
              Ingresa el NIP de Administrador para autorizar esta acción:
            </p>

            {nipError && (
              <div style={{ padding: '0.5rem 0.8rem', borderRadius: '8px', background: 'rgba(239, 68, 68, 0.1)', color: '#EF4444', fontSize: '0.8rem', marginBottom: '0.75rem' }}>
                {nipError}
              </div>
            )}

            <input
              type="password"
              autoFocus
              value={nipInput}
              onChange={(e) => setNipInput(e.target.value)}
              placeholder="NIP de 4 dígitos"
              style={{ width: '100%', height: 46, padding: '0 0.8rem', borderRadius: '12px', border: '2px solid var(--brand)', fontSize: '1.2rem', textAlign: 'center', letterSpacing: '0.3em', marginBottom: '1.25rem' }}
            />

            <div style={{ display: 'flex', gap: '0.8rem' }}>
              <button
                type="button"
                onClick={() => setNipPromptOpen(false)}
                style={{ flex: 1, height: 44, borderRadius: 'var(--radius-pill)', border: '1px solid var(--border)', background: 'none', fontWeight: 700, cursor: 'pointer' }}
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmNip}
                style={{ flex: 1, height: 44, borderRadius: 'var(--radius-pill)', background: 'var(--brand)', color: '#FFFFFF', border: 'none', fontWeight: 800, cursor: 'pointer' }}
              >
                Autorizar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

