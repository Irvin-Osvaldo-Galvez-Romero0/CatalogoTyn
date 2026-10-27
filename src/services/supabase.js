/**
 * Servicio de Integración con Supabase para Captura de Prospectos Comerciales
 * Conexión directa y resiliente con soporte de guardado offline (PWA / Kiosco)
 */

const SUPABASE_URL = 'https://xvrnssesbkzxeusubzes.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh2cm5zc2VzYmt6eGV1c3ViemVzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTMwNDg2NTgsImV4cCI6MjEwODYyNDY1OH0.Flfpf4NZHP84b5MvDpBDU6cHXkt78dty8GF63RnHy3c';

const PENDING_LEADS_KEY = 'tynor_pending_leads';

/**
 * Guarda un prospecto en Supabase. Si falla la red, lo almacena en cola local.
 * @param {Object} leadData - Datos del formulario
 * @returns {Promise<{success: boolean, data?: any, offline?: boolean, error?: string}>}
 */
export async function submitLead(leadData) {
  const payload = {
    nombre_completo: leadData.nombreCompleto?.trim() || '',
    edad: leadData.edad ? String(leadData.edad).trim() : null,
    puesto: leadData.puesto?.trim() || null,
    nombre_empresa: leadData.nombreEmpresa?.trim() || '',
    tipo_negocio: leadData.tipoNegocio || null,
    tipo_negocio_otro: leadData.tipoNegocioOtro?.trim() || null,
    productos_comercializa: leadData.productosComercializa || [],
    productos_comercializa_otro: leadData.productosComercializaOtro?.trim() || null,
    marcas_distribuye: leadData.marcasDistribuye?.trim() || null,
    productos_interes: leadData.productosInteres || [],
    productos_interes_otro: leadData.productosInteresOtro?.trim() || null,
    estado: leadData.estado || null,
    municipio: leadData.municipio?.trim() || null,
    tipo_operacion: leadData.tipoOperacion || null,
    cobertura: leadData.cobertura || null,
    email: leadData.email?.trim() || null,
    telefono: leadData.telefono?.trim() || null,
    motivo_visita: leadData.motivoVisita || null,
    motivo_visita_otro: leadData.motivoVisitaOtro?.trim() || null,
    nivel_interes: leadData.nivelInteres || 'A (alto)',
    codigo_qr: leadData.codigoQr?.trim() || null,
    asesor_asignado: leadData.asesorAsignado?.trim() || null
  };

  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/prospectos_comerciales`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errText = await response.text();
      console.warn('Error en respuesta Supabase:', response.status, errText);
      // Guardar localmente para sincronización posterior
      enqueuePendingLead(payload);
      return { success: true, offline: true, warning: 'Guardado localmente. Se sincronizará automáticamente.' };
    }

    const data = await response.json();
    return { success: true, data: data[0] || data, offline: false };
  } catch (err) {
    console.warn('Fallo de conexión con Supabase (posible modo offline):', err);
    enqueuePendingLead(payload);
    return { success: true, offline: true, warning: 'Guardado localmente por falta de conexión.' };
  }
}

/**
 * Agrega un prospecto a la cola local en LocalStorage
 */
function enqueuePendingLead(payload) {
  try {
    const queue = JSON.parse(localStorage.getItem(PENDING_LEADS_KEY) || '[]');
    queue.push({ ...payload, queued_at: new Date().toISOString() });
    localStorage.setItem(PENDING_LEADS_KEY, JSON.stringify(queue));
  } catch (e) {
    console.error('Error guardando en cola local:', e);
  }
}

/**
 * Sincroniza prospectos pendientes almacenados localmente hacia Supabase
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
            'Content-Type': 'application/json'
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

// Escuchar evento online para sincronizar automáticamente
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    syncPendingLeads().then((res) => {
      if (res.synced > 0) {
        console.log(`[Supabase Sync] ${res.synced} prospectos pendientes sincronizados exitosamente.`);
      }
    });
  });
}
