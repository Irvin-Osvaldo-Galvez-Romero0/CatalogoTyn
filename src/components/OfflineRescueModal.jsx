import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  HardDrive,
  Download,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Database,
  Layers,
  Users,
  FileSpreadsheet,
  FileText,
  Wifi,
  WifiOff,
  Search,
  Check,
  ShieldCheck,
  Calendar,
  Sparkles
} from 'lucide-react';
import { offlineStorageService } from '../services/offlineStorageService';
import { syncPendingLeads } from '../services/supabase';
import { brandingService } from '../services/brandingService';
import { productManager } from '../services/productManager';

export default function OfflineRescueModal({ isOpen, onClose }) {
  const [summary, setSummary] = useState(() => offlineStorageService.getTablesSummary());
  const [leads, setLeads] = useState(() => offlineStorageService.getArchivedLeads());
  const [searchQuery, setSearchQuery] = useState('');
  const [isOnline, setIsOnline] = useState(() => (typeof navigator !== 'undefined' ? navigator.onLine : true));
  const [isSyncing, setIsSyncing] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'leads'

  // Suscribirse a cambios en la memoria local y estado de conexión
  useEffect(() => {
    const unsub = offlineStorageService.subscribe(() => {
      setSummary(offlineStorageService.getTablesSummary());
      setLeads(offlineStorageService.getArchivedLeads());
    });

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      unsub();
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Cerrar con Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Actualizar datos cada vez que se abre el modal
  useEffect(() => {
    if (isOpen) {
      setSummary(offlineStorageService.getTablesSummary());
      setLeads(offlineStorageService.getArchivedLeads());
      setFeedback(null);
    }
  }, [isOpen]);

  // Filtrado de prospectos en memoria
  const filteredLeads = useMemo(() => {
    if (!searchQuery.trim()) return leads;
    const q = searchQuery.toLowerCase();
    return leads.filter((l) => {
      return (
        (l.nombre_completo && l.nombre_completo.toLowerCase().includes(q)) ||
        (l.nombre_empresa && l.nombre_empresa.toLowerCase().includes(q)) ||
        (l.telefono && l.telefono.includes(q)) ||
        (l.email && l.email.toLowerCase().includes(q)) ||
        (l.codigo_qr && l.codigo_qr.toLowerCase().includes(q)) ||
        (l.asesor_asignado && l.asesor_asignado.toLowerCase().includes(q))
      );
    });
  }, [leads, searchQuery]);

  // Acción: Descargar CSV de Prospectos (Método 2)
  const handleDownloadLeadsCsv = () => {
    const result = offlineStorageService.exportProspectosCsv();
    if (result.success) {
      setFeedback({
        type: 'success',
        msg: `¡Éxito! Se descargó el archivo ${result.filename} con ${result.count} prospecto(s).`
      });
    } else {
      setFeedback({
        type: 'info',
        msg: result.message || 'No hay prospectos en memoria para descargar.'
      });
    }
  };

  // Acción: Descargar Respaldo Completo de las 3 Tablas en JSON (Método 2)
  const handleDownloadFullJson = () => {
    const result = offlineStorageService.exportFullBackupJson();
    if (result.success) {
      setFeedback({
        type: 'success',
        msg: `¡Respaldo Completo Generado! Se guardó ${result.filename} con las 3 tablas del quiosco.`
      });
    } else {
      setFeedback({
        type: 'error',
        msg: 'Error al generar el respaldo JSON.'
      });
    }
  };

  // Acción: Descargar Catálogo de 180 Productos en CSV
  const handleDownloadCatalogCsv = () => {
    const result = offlineStorageService.exportCatalogCsv();
    if (result.success) {
      setFeedback({
        type: 'success',
        msg: `¡Catálogo exportado! Se descargó ${result.filename} (${result.count} productos).`
      });
    }
  };

  // Acción: Sincronizar manualmente con Supabase Cloud
  const handleManualSync = async () => {
    if (isSyncing) return;
    setIsSyncing(true);
    setFeedback({
      type: 'info',
      msg: 'Conectando con Supabase Cloud y sincronizando datos...'
    });

    try {
      const syncResult = await syncPendingLeads();
      await brandingService.syncFromCloud();
      await productManager.syncCloudProducts();

      setSummary(offlineStorageService.getTablesSummary());
      setLeads(offlineStorageService.getArchivedLeads());

      if (syncResult && syncResult.synced > 0) {
        setFeedback({
          type: 'success',
          msg: `¡Sincronización Exitosa! Se enviaron ${syncResult.synced} prospecto(s) a Supabase Cloud.`
        });
      } else if (syncResult && syncResult.remaining > 0) {
        setFeedback({
          type: 'warning',
          msg: `Sincronización parcial: ${syncResult.remaining} registro(s) siguen en cola local.`
        });
      } else {
        setFeedback({
          type: 'success',
          msg: 'Todos los datos están al día con la nube. No hay registros pendientes.'
        });
      }
    } catch (err) {
      setFeedback({
        type: 'error',
        msg: `Fallo al sincronizar: ${err.message || 'Sin conexión con el servidor'}. Los datos siguen 100% seguros en memoria local.`
      });
    } finally {
      setIsSyncing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="rescue-modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="rescue-modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Cabecera del Modal */}
        <div className="rescue-modal-header">
          <div className="rescue-modal-title-box">
            <div className="rescue-modal-icon-badge">
              <HardDrive size={24} />
            </div>
            <div>
              <div className="rescue-title-row">
                <h2 className="rescue-modal-title">Memoria Local & Rescate de Datos</h2>
                <span className={`rescue-net-pill ${isOnline ? 'online' : 'offline'}`}>
                  {isOnline ? (
                    <>
                      <Wifi size={13} />
                      <span>Conectado</span>
                    </>
                  ) : (
                    <>
                      <WifiOff size={13} />
                      <span>Modo 100% Offline</span>
                    </>
                  )}
                </span>
              </div>
              <p className="rescue-modal-subtitle">
                Método 2: Descarga Directa Offline y Respaldo Permanente de las 3 Tablas
              </p>
            </div>
          </div>
          <button
            type="button"
            className="rescue-modal-close-btn"
            onClick={onClose}
            aria-label="Cerrar ventana de rescate"
          >
            <X size={22} />
          </button>
        </div>

        {/* Notificación de Feedback Temporal */}
        {feedback && (
          <div className={`rescue-feedback-banner ${feedback.type}`}>
            {feedback.type === 'success' && <CheckCircle2 size={18} />}
            {feedback.type === 'warning' && <AlertTriangle size={18} />}
            {feedback.type === 'info' && <RefreshCw size={18} />}
            {feedback.type === 'error' && <AlertTriangle size={18} />}
            <span>{feedback.msg}</span>
            <button
              type="button"
              className="rescue-feedback-close"
              onClick={() => setFeedback(null)}
              aria-label="Cerrar notificación"
            >
              ×
            </button>
          </div>
        )}

        {/* Pestañas de Navegación del Modal */}
        <div className="rescue-tabs-bar">
          <button
            type="button"
            className={`rescue-tab-nav-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <Database size={16} />
            <span>Estado de las 3 Tablas</span>
          </button>
          <button
            type="button"
            className={`rescue-tab-nav-btn ${activeTab === 'leads' ? 'active' : ''}`}
            onClick={() => setActiveTab('leads')}
          >
            <Users size={16} />
            <span>Registros en Memoria ({leads.length})</span>
            {summary.table3_prospectos.pendingSyncCount > 0 && (
              <span className="rescue-pending-badge">
                {summary.table3_prospectos.pendingSyncCount} pendientes
              </span>
            )}
          </button>
        </div>

        {/* Cuerpo del Modal */}
        <div className="rescue-modal-body">
          {activeTab === 'overview' && (
            <>
              {/* Sección de Tarjetas de las 3 Tablas */}
              <div className="rescue-tables-grid">
                {/* Tabla 1: configuracion_kiosco */}
                <div className="rescue-table-card">
                  <div className="rescue-card-top">
                    <div className="rescue-card-badge-icon card-color-blue">
                      <Layers size={18} />
                    </div>
                    <span className="rescue-table-db-tag">configuracion_kiosco</span>
                  </div>
                  <h3 className="rescue-card-title">Configuración & Marca</h3>
                  <div className="rescue-card-metrics">
                    <div className="rescue-metric-row">
                      <span className="metric-label">Color institucional:</span>
                      <div className="metric-color-swatch-box">
                        <span
                          className="metric-swatch-dot"
                          style={{ backgroundColor: summary.table1_configuracion.brandColor }}
                        />
                        <code className="metric-code">{summary.table1_configuracion.brandColor}</code>
                      </div>
                    </div>
                    <div className="rescue-metric-row">
                      <span className="metric-label">Logotipo oficial:</span>
                      <span className="metric-value">
                        {summary.table1_configuracion.isCustomLogo ? 'Personalizado (Nube)' : 'Tynor Oficial'}
                      </span>
                    </div>
                    <div className="rescue-metric-row">
                      <span className="metric-label">NIP Administrador:</span>
                      <span className="metric-value-chip chip-green">
                        <ShieldCheck size={13} /> Activo (SHA-256)
                      </span>
                    </div>
                  </div>
                  <div className="rescue-card-footer">
                    <CheckCircle2 size={14} className="text-emerald" />
                    <span>Persistente en memoria local</span>
                  </div>
                </div>

                {/* Tabla 2: productos_catalogo */}
                <div className="rescue-table-card">
                  <div className="rescue-card-top">
                    <div className="rescue-card-badge-icon card-color-indigo">
                      <Database size={18} />
                    </div>
                    <span className="rescue-table-db-tag">productos_catalogo</span>
                  </div>
                  <h3 className="rescue-card-title">Catálogo Completo</h3>
                  <div className="rescue-card-metrics">
                    <div className="rescue-metric-row">
                      <span className="metric-label">Total productos activos:</span>
                      <strong className="metric-value-huge">
                        {summary.table2_productos.totalProducts}
                      </strong>
                    </div>
                    <div className="rescue-metric-row">
                      <span className="metric-label">Productos base:</span>
                      <span className="metric-value">{summary.table2_productos.baseProductsCount} productos</span>
                    </div>
                    <div className="rescue-metric-row">
                      <span className="metric-label">Personalizados:</span>
                      <span className="metric-value">{summary.table2_productos.customProductsCount} creados</span>
                    </div>
                  </div>
                  <div className="rescue-card-footer">
                    <CheckCircle2 size={14} className="text-emerald" />
                    <span>Precios, tallas y variantes 100% offline</span>
                  </div>
                </div>

                {/* Tabla 3: prospectos_comerciales */}
                <div className="rescue-table-card highlight">
                  <div className="rescue-card-top">
                    <div className="rescue-card-badge-icon card-color-amber">
                      <Users size={18} />
                    </div>
                    <span className="rescue-table-db-tag">prospectos_comerciales</span>
                  </div>
                  <h3 className="rescue-card-title">Prospectos & Cotizaciones</h3>
                  <div className="rescue-card-metrics">
                    <div className="rescue-metric-row">
                      <span className="metric-label">Total guardados en tablet:</span>
                      <strong className="metric-value-huge text-brand">
                        {summary.table3_prospectos.totalLocalLeads}
                      </strong>
                    </div>
                    <div className="rescue-metric-row">
                      <span className="metric-label">Sincronizados en Nube:</span>
                      <span className="metric-value-chip chip-green">
                        <Check size={13} /> {summary.table3_prospectos.syncedCount}
                      </span>
                    </div>
                    <div className="rescue-metric-row">
                      <span className="metric-label">Pendientes de subir:</span>
                      <span
                        className={`metric-value-chip ${
                          summary.table3_prospectos.pendingSyncCount > 0 ? 'chip-amber' : 'chip-muted'
                        }`}
                      >
                        {summary.table3_prospectos.pendingSyncCount > 0 ? (
                          <>
                            <AlertTriangle size={13} /> {summary.table3_prospectos.pendingSyncCount} en cola
                          </>
                        ) : (
                          <>
                            <Check size={13} /> 0 pendientes
                          </>
                        )}
                      </span>
                    </div>
                  </div>
                  <div className="rescue-card-footer">
                    <ShieldCheck size={14} className="text-emerald" />
                    <span>Inmutable ante apagados y reinicios</span>
                  </div>
                </div>
              </div>

              {/* Botones de Rescate Directo (Método 2) */}
              <div className="rescue-actions-panel">
                <div className="rescue-panel-header">
                  <h4 className="rescue-panel-title">
                    <Download size={18} />
                    <span>Método 2: Botón de Rescate y Descarga Directa</span>
                  </h4>
                  <span className="rescue-panel-tag">Sin requerir internet</span>
                </div>

                <div className="rescue-actions-buttons-grid">
                  {/* Botón Principal: Descarga de Prospectos en CSV para Excel */}
                  <button
                    type="button"
                    className="rescue-action-btn primary"
                    onClick={handleDownloadLeadsCsv}
                  >
                    <div className="btn-icon-wrapper">
                      <FileSpreadsheet size={22} />
                    </div>
                    <div className="btn-text-content">
                      <strong className="btn-title">Descargar Prospectos (.CSV para Excel)</strong>
                      <span className="btn-desc">
                        Exporta todos los prospectos y cotizaciones capturados en este dispositivo directamente a tu carpeta de Descargas.
                      </span>
                    </div>
                    <span className="btn-badge-action">Descargar CSV</span>
                  </button>

                  {/* Botón Secundario: Descarga del Respaldo Completo de 3 Tablas en JSON */}
                  <button
                    type="button"
                    className="rescue-action-btn secondary"
                    onClick={handleDownloadFullJson}
                  >
                    <div className="btn-icon-wrapper">
                      <Database size={22} />
                    </div>
                    <div className="btn-text-content">
                      <strong className="btn-title">Descargar Respaldo 3 Tablas (.JSON)</strong>
                      <span className="btn-desc">
                        Copia forense idéntica de las 3 tablas (Branding, Catálogo 180+ y Prospectos) para respaldo técnico integral.
                      </span>
                    </div>
                    <span className="btn-badge-action">Descargar JSON</span>
                  </button>

                  {/* Botón Terciario: Exportar Catálogo de 180 Productos en CSV */}
                  <button
                    type="button"
                    className="rescue-action-btn tertiary"
                    onClick={handleDownloadCatalogCsv}
                  >
                    <div className="btn-icon-wrapper">
                      <FileText size={20} />
                    </div>
                    <div className="btn-text-content">
                      <strong className="btn-title">Descargar Catálogo de Productos (.CSV)</strong>
                      <span className="btn-desc">
                        Exporta los 180+ productos con códigos, precios, zonas anatómicas y fichas técnicas.
                      </span>
                    </div>
                    <span className="btn-badge-action">Catálogo CSV</span>
                  </button>

                  {/* Botón Sincronización Manual */}
                  <button
                    type="button"
                    className={`rescue-action-btn sync ${isSyncing ? 'loading' : ''}`}
                    onClick={handleManualSync}
                    disabled={isSyncing}
                  >
                    <div className="btn-icon-wrapper">
                      <RefreshCw size={20} className={isSyncing ? 'animate-spin' : ''} />
                    </div>
                    <div className="btn-text-content">
                      <strong className="btn-title">Sincronizar con Supabase Cloud</strong>
                      <span className="btn-desc">
                        {isOnline
                          ? 'Sube prospectos pendientes y sincroniza catálogos con la nube de forma inmediata.'
                          : 'No hay conexión WiFi disponible. Al conectarte podrás sincronizar con 1 toque.'}
                      </span>
                    </div>
                    <span className="btn-badge-action">
                      {isSyncing ? 'Sincronizando...' : 'Sincronizar'}
                    </span>
                  </button>
                </div>
              </div>
            </>
          )}

          {activeTab === 'leads' && (
            <div className="rescue-leads-view">
              <div className="rescue-leads-toolbar">
                <div className="rescue-search-wrapper">
                  <Search size={16} className="search-icon" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar por nombre, empresa, teléfono o asesor..."
                    className="rescue-search-input"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      className="rescue-clear-search-btn"
                      onClick={() => setSearchQuery('')}
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>

                <div className="rescue-toolbar-actions">
                  <button
                    type="button"
                    className="rescue-quick-download-btn"
                    onClick={handleDownloadLeadsCsv}
                    title="Descargar esta lista en CSV"
                  >
                    <Download size={15} />
                    <span>Descargar CSV</span>
                  </button>
                </div>
              </div>

              {filteredLeads.length === 0 ? (
                <div className="rescue-empty-leads-box">
                  <Users size={48} className="empty-icon" />
                  <h4>No se encontraron prospectos</h4>
                  <p>
                    {searchQuery
                      ? 'No hay registros que coincidan con la búsqueda.'
                      : 'Aún no se han registrado prospectos en este quiosco. Cualquier registro creado se guardará aquí de forma inmediata incluso sin internet.'}
                  </p>
                </div>
              ) : (
                <div className="rescue-table-responsive-wrapper">
                  <table className="rescue-leads-table">
                    <thead>
                      <tr>
                        <th>Fecha y Hora</th>
                        <th>Nombre Completo</th>
                        <th>Empresa / Negocio</th>
                        <th>Contacto</th>
                        <th>Asesor</th>
                        <th>Estatus Nube</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredLeads.map((lead, idx) => (
                        <tr key={lead.local_id || idx}>
                          <td className="cell-date">
                            {lead.captured_at ? (
                              <>
                                <Calendar size={13} />
                                <span>{new Date(lead.captured_at).toLocaleDateString('es-MX')}</span>
                                <small>{new Date(lead.captured_at).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}</small>
                              </>
                            ) : (
                              'Reciente'
                            )}
                          </td>
                          <td className="cell-name">
                            <strong>{lead.nombre_completo || 'Sin nombre'}</strong>
                            {lead.puesto && <small className="text-muted">{lead.puesto}</small>}
                          </td>
                          <td className="cell-company">
                            <span>{lead.nombre_empresa || 'Particular / No especificado'}</span>
                            {lead.tipo_negocio && <small className="text-brand-subtle">{lead.tipo_negocio}</small>}
                          </td>
                          <td className="cell-contact">
                            {lead.telefono && <div>📞 {lead.telefono}</div>}
                            {lead.email && <div className="text-muted">✉️ {lead.email}</div>}
                          </td>
                          <td className="cell-rep">
                            <span className="rep-badge">{lead.asesor_asignado || 'General'}</span>
                          </td>
                          <td className="cell-status">
                            {lead.sync_status === 'synced' ? (
                              <span className="status-pill synced">
                                <CheckCircle2 size={13} /> Sincronizado
                              </span>
                            ) : (
                              <span className="status-pill pending">
                                <HardDrive size={13} /> En Memoria Local
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Pie del Modal */}
        <div className="rescue-modal-footer">
          <div className="rescue-footer-guarantee">
            <ShieldCheck size={16} className="text-emerald" />
            <span>
              <strong>Garantía de Persistencia:</strong> Los datos se almacenan en el almacenamiento protegido del navegador / APK y sobreviven apagados de pantalla o batería.
            </span>
          </div>
          <button type="button" className="rescue-close-footer-btn" onClick={onClose}>
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
}

