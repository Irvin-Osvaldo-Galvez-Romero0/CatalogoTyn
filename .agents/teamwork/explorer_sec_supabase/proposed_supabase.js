/**
 * Servicio de Integración con Supabase para Captura de Prospectos Comerciales
 * Versión Segura y Endurecida (ECC Hardening & Defense-in-Depth)
 * Conexión directa y resiliente con soporte de guardado offline (PWA / Kiosco)
 */

const SUPABASE_URL = 'https://xvrnssesbkzxeusubzes.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh2cm5zc2VzYmt6eGV1c3ViemVzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTMwNDg2NTgsImV4cCI6MjEwODYyNDY1OH0.Flfpf4NZHP84b5MvDpBDU6cHXkt78dty8GF63RnHy3c';

const PENDING_LEADS_KEY = 'tynor_pending_leads';
const MAX_PENDING_LEADS = 50;

const VALID_NIVELES = ['A (alto)', 'B (medio)', 'C (bajo)'];

/**
 * Sanitiza y limita la longitud de una cadena de texto
 * @param {any} val
 * @param {number} maxLength
 * @returns {string|null}
 */
function sanitizeString(val, maxLength = 255) {
  if (typeof val !== 'string') return null;
  const trimmed = val.trim();
  return trimmed.length > 0 ? trimmed.substring(0, maxLength) : null;
}

/**
 * Sanitiza un arreglo de cadenas, filtrando no strings y limitando cantidad y longitud
 * @param {any} arr
 * @param {number} maxItems
 * @param {number} maxStrLength
 * @returns {string[]}
 */
function sanitizeArray(arr, maxItems = 20, maxStrLength = 100) {
  if (!Array.isArray(arr)) return [];
  return arr
    .filter((item) => typeof item === 'string' && item.trim().length > 0)
    .slice(0, maxItems)
    .map((item) => item.trim().substring(0, maxStrLength));
}

/**
 * Sanitiza un número de teléfono manteniendo caracteres numéricos y de marcado estándar
 * @param {any} phone
 * @returns {string|null}
 */
function sanitizePhone(phone) {
  if (typeof phone !== 'string') return null;
  const trimmed = phone.trim();
  const clean = trimmed.replace(/[^0-9+\-()\s]/g, '');
  return clean.length >= 7 ? clean.substring(0, 30) : null;
}

/**
 * Sanitiza y valida formato básico de correo electrónico
 * @param {any} email
 * @returns {string|null}
 */
function sanitizeEmail(email) {
  if (typeof email !== 'string') return null;
  const trimmed = email.trim().toLowerCase();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(trimmed) ? trimmed.substring(0, 150) : null;
}

/**
 * Guarda un prospecto en Supabase aplicando saneamiento estricto y preferencia return=minimal.
 * Si falla la red, lo almacena en cola local acotada.
 * @param {Object} leadData - Datos del formulario
 * @returns {Promise<{success: boolean, data?: any, offline?: boolean, warning?: string, error?: string}>}
 */
export async function submitLead(leadData) {
  if (!leadData || typeof leadData !== 'object') {
    return { success: false, error: 'Datos de prospecto inválidos.' };
  }

  const payload = {
    nombre_completo: sanitizeString(leadData.nombreCompleto, 150) || '',
    edad: sanitizeString(leadData.edad ? String(leadData.edad) : null, 10),
    puesto: sanitizeString(leadData.puesto, 100),
    nombre_empresa: sanitizeString(leadData.nombreEmpresa, 150) || '',
    tipo_negocio: sanitizeString(leadData.tipoNegocio, 100),
    tipo_negocio_otro: sanitizeString(leadData.tipoNegocioOtro, 150),
    productos_comercializa: sanitizeArray(leadData.productosComercializa, 20, 100),
    productos_comercializa_otro: sanitizeString(leadData.productosComercializaOtro, 200),
    marcas_distribuye: sanitizeString(leadData.marcasDistribuye, 200),
    productos_interes: sanitizeArray(leadData.productosInteres, 20, 100),
    productos_interes_otro: sanitizeString(leadData.productosInteresOtro, 200),
    estado: sanitizeString(leadData.estado, 50),
    municipio: sanitizeString(leadData.municipio, 100),
    tipo_operacion: sanitizeString(leadData.tipoOperacion, 50),
    cobertura: sanitizeString(leadData.cobertura, 50),
    email: sanitizeEmail(leadData.email),
    telefono: sanitizePhone(leadData.telefono),
    motivo_visita: sanitizeString(leadData.motivoVisita, 50),
    motivo_visita_otro: sanitizeString(leadData.motivoVisitaOtro, 150),
    nivel_interes: VALID_NIVELES.includes(leadData.nivelInteres) ? leadData.nivelInteres : 'A (alto)',
    codigo_qr: sanitizeString(leadData.codigoQr, 200),
    asesor_asignado: sanitizeString(leadData.asesorAsignado, 100)
  };

  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/prospectos_comerciales`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal' // Indispensable para RLS INSERT-only sin permisos SELECT
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errText = await response.text();
      console.warn('Error en respuesta Supabase:', response.status, errText);
      enqueuePendingLead(payload);
      return { success: true, offline: true, warning: 'Guardado localmente. Se sincronizará automáticamente.' };
    }

    // Al usar return=minimal, PostgREST retorna 201 Created con cuerpo vacío
    return { success: true, offline: false };
  } catch (err) {
    console.warn('Fallo de conexión con Supabase (modo offline):', err);
    enqueuePendingLead(payload);
    return { success: true, offline: true, warning: 'Guardado localmente por falta de conexión.' };
  }
}

/**
 * Agrega un prospecto a la cola local en LocalStorage con límite máximo defensivo (FIFO)
 * @param {Object} payload
 */
function enqueuePendingLead(payload) {
  try {
    const queue = JSON.parse(localStorage.getItem(PENDING_LEADS_KEY) || '[]');
    if (queue.length >= MAX_PENDING_LEADS) {
      queue.shift(); // Evita saturar la cuota de LocalStorage descartando el lead más antiguo
    }
    queue.push({ ...payload, queued_at: new Date().toISOString() });
    localStorage.setItem(PENDING_LEADS_KEY, JSON.stringify(queue));
  } catch (e) {
    console.error('Error guardando en cola local:', e);
  }
}

/**
 * Sincroniza prospectos pendientes almacenados localmente hacia Supabase
 * @returns {Promise<{synced: number, remaining?: number, error?: string}>}
 */
export async function syncPendingLeads() {
  try {
    const queue = JSON.parse(localStorage.getItem(PENDING_LEADS_KEY) || '[]');
    if (!queue.length) return { synced: 0 };

    const remaining = [];
    let syncedCount = 0;

    for (const lead of queue) {
      const { queued_at, ...payload } = lead;
      try {
        const res = await fetch(`${SUPABASE_URL}/rest/v1/prospectos_comerciales`, {
          method: 'POST',
          headers: {
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=minimal'
          },
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          syncedCount++;
        } else {
          remaining.push(lead);
        }
      } catch {
        remaining.push(lead);
      }
    }

    localStorage.setItem(PENDING_LEADS_KEY, JSON.stringify(remaining));
    return { synced: syncedCount, remaining: remaining.length };
  } catch (e) {
    console.error('Error sincronizando cola local:', e);
    return { synced: 0, error: e.message };
  }
}

// Escuchar eventos online, focus y temporizador periódico para sincronizar automáticamente (FLAW-01)
if (typeof window !== 'undefined') {
  const triggerLeadSync = () => {
    syncPendingLeads().then((res) => {
      if (res && res.synced > 0) {
        console.log(`[Supabase Sync] ${res.synced} prospectos pendientes sincronizados exitosamente.`);
      }
    });
  };

  // 1. Sincronizar al recuperar conexión de red
  window.addEventListener('online', triggerLeadSync);

  // 2. Sincronizar cuando la ventana o app vuelve al foco (ej. tablet reactivada o cambio de pestaña)
  window.addEventListener('focus', triggerLeadSync);

  // 3. Temporizador periódico de reintento cada 5 minutos (300,000 ms)
  setInterval(triggerLeadSync, 300000);
}
