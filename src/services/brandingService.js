/**
 * Servicio de Personalización de Marca (Branding Dinámico / White-Labeling Centralizado)
 * Conexión Híbrida: Supabase Cloud Database + Supabase Storage + LocalStorage Fallback
 * Sincroniza en tiempo real el logotipo oficial y la paleta de color principal en TODOS los quioscos y dispositivos.
 */

const STORAGE_KEY_LOGO = 'tynor_branding_logo';
const STORAGE_KEY_COLOR = 'tynor_branding_color';
const DEFAULT_BRAND_COLOR = '#10B4C1';
const DEFAULT_LOGO_PATH = '/assets/logo.webp';

const SUPABASE_URL = 'https://xvrnssesbkzxeusubzes.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh2cm5zc2VzYmt6eGV1c3ViemVzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTMwNDg2NTgsImV4cCI6MjEwODYyNDY1OH0.Flfpf4NZHP84b5MvDpBDU6cHXkt78dty8GF63RnHy3c';

/**
 * Convierte un color HEX a RGB
 */
function hexToRgb(hex) {
  let c = hex.replace('#', '');
  if (c.length === 3) {
    c = c.split('').map((char) => char + char).join('');
  }
  const num = parseInt(c, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255
  };
}

/**
 * Ajusta el brillo de un color HEX
 */
function adjustBrightness(hex, percent) {
  const { r, g, b } = hexToRgb(hex);
  const adjust = (val) => Math.min(255, Math.max(0, Math.round(val + (val * percent) / 100)));
  const toHex = (n) => n.toString(16).padStart(2, '0');
  return `#${toHex(adjust(r))}${toHex(adjust(g))}${toHex(adjust(b))}`;
}

/**
 * Calcula la luminancia relativa según el estándar WCAG 2.2
 * 0.0 = negro absoluto, 1.0 = blanco puro
 */
function getRelativeLuminance(r, g, b) {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

export const brandingService = {
  /**
   * Obtiene la ruta o data-URL del logotipo activo (Caché local inmediata)
   */
  getLogo() {
    try {
      return localStorage.getItem(STORAGE_KEY_LOGO) || DEFAULT_LOGO_PATH;
    } catch {
      return DEFAULT_LOGO_PATH;
    }
  },

  /**
   * Obtiene el color principal activo (Caché local inmediata)
   */
  getBrandColor() {
    try {
      return localStorage.getItem(STORAGE_KEY_COLOR) || DEFAULT_BRAND_COLOR;
    } catch {
      return DEFAULT_BRAND_COLOR;
    }
  },

  /**
   * Guarda un nuevo logotipo (ruta o URL pública) y lo sincroniza en Supabase Cloud
   */
  async setLogo(logoUrlOrBase64) {
    try {
      if (logoUrlOrBase64) {
        localStorage.setItem(STORAGE_KEY_LOGO, logoUrlOrBase64);
      } else {
        localStorage.removeItem(STORAGE_KEY_LOGO);
      }
      this.notifyListeners();

      // Sincronizar en la nube si no es base64 pesado
      if (logoUrlOrBase64 && !logoUrlOrBase64.startsWith('data:')) {
        this.patchCloudConfig({ logo_url: logoUrlOrBase64 });
      }
    } catch (e) {
      console.warn('Error saving custom logo:', e);
    }
  },

  /**
   * Sube un archivo de logotipo a Supabase Storage y lo asigna globalmente a todos los dispositivos
   */
  async uploadLogoToCloud(file) {
    if (!file) throw new Error('Archivo no especificado');

    const ext = file.name ? file.name.split('.').pop().toLowerCase() : 'webp';
    const mimeType = file.type || 'image/webp';
    const fileName = `logo_${Date.now()}.${ext}`;
    const storagePath = `branding/${fileName}`;
    const uploadUrl = `${SUPABASE_URL}/storage/v1/object/catalog-media/${storagePath}`;

    const res = await fetch(uploadUrl, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': mimeType,
        'x-upsert': 'true'
      },
      body: file
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Error al subir logo a Supabase Storage: ${res.status} - ${err}`);
    }

    const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/catalog-media/${storagePath}`;
    localStorage.setItem(STORAGE_KEY_LOGO, publicUrl);
    this.notifyListeners();
    await this.patchCloudConfig({ logo_url: publicUrl });
    return publicUrl;
  },

  /**
   * Restablece el logotipo al oficial por defecto en local y en la nube
   */
  async resetLogo() {
    try {
      localStorage.removeItem(STORAGE_KEY_LOGO);
      this.notifyListeners();
      await this.patchCloudConfig({ logo_url: DEFAULT_LOGO_PATH });
    } catch (e) {
      console.warn('Error resetting logo:', e);
    }
  },

  /**
   * Aplica y guarda un nuevo color principal en DOM, localStorage y en la nube Supabase
   */
  setBrandColor(hexColor) {
    if (!hexColor || !/^#[0-9A-Fa-f]{6}$/.test(hexColor)) return;
    try {
      localStorage.setItem(STORAGE_KEY_COLOR, hexColor);
      this.applyColorToDom(hexColor);
      this.notifyListeners();
      this.patchCloudConfig({ brand_color: hexColor });
    } catch (e) {
      console.warn('Error saving brand color:', e);
    }
  },

  /**
   * Restablece el color principal al turquesa médico Tynor (#10B4C1) en local y en la nube
   */
  async resetBrandColor() {
    try {
      localStorage.removeItem(STORAGE_KEY_COLOR);
      this.applyColorToDom(DEFAULT_BRAND_COLOR);
      this.notifyListeners();
      await this.patchCloudConfig({ brand_color: DEFAULT_BRAND_COLOR });
    } catch (e) {
      console.warn('Error resetting brand color:', e);
    }
  },

  /**
   * Restablece todo el branding oficial en local y en la nube
   */
  async resetBrandingCloud() {
    try {
      localStorage.removeItem(STORAGE_KEY_LOGO);
      localStorage.removeItem(STORAGE_KEY_COLOR);
      this.applyColorToDom(DEFAULT_BRAND_COLOR);
      this.notifyListeners();
      await this.patchCloudConfig({
        brand_color: DEFAULT_BRAND_COLOR,
        logo_url: DEFAULT_LOGO_PATH
      });
    } catch (e) {
      console.warn('Error resetting branding in cloud:', e);
    }
  },

  /**
   * Actualiza el registro de branding en Supabase
   */
  async patchCloudConfig(payload) {
    try {
      const body = {
        ...payload,
        updated_at: new Date().toISOString()
      };
      const res = await fetch(`${SUPABASE_URL}/rest/v1/configuracion_kiosco?id=eq.global`, {
        method: 'PATCH',
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify(body)
      });
      return res.ok;
    } catch (err) {
      console.warn('[Branding] Supabase patch pending/offline:', err.message);
      return false;
    }
  },

  /**
   * Sincroniza la configuración de marca desde Supabase hacia este dispositivo
   */
  async syncFromCloud() {
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/configuracion_kiosco?id=eq.global&select=*`, {
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
        }
      });
      if (!res.ok) return;

      const rows = await res.json();
      if (!rows || rows.length === 0) return;

      const cloud = rows[0];
      let hasChanged = false;

      if (cloud.brand_color && cloud.brand_color !== this.getBrandColor()) {
        localStorage.setItem(STORAGE_KEY_COLOR, cloud.brand_color);
        this.applyColorToDom(cloud.brand_color);
        hasChanged = true;
      }

      if (cloud.logo_url && cloud.logo_url !== this.getLogo()) {
        localStorage.setItem(STORAGE_KEY_LOGO, cloud.logo_url);
        hasChanged = true;
      }

      if (hasChanged) {
        this.notifyListeners();
      }
    } catch (err) {
      console.warn('[Branding] Supabase sync offline/cached:', err.message);
    }
  },

  /**
   * Inyecta las variables CSS en :root
   */
  applyColorToDom(hex) {
    if (typeof document === 'undefined') return;
    try {
      const root = document.documentElement;
      const { r, g, b } = hexToRgb(hex);
      const luminance = getRelativeLuminance(r, g, b);
      const isLight = luminance > 0.60;

      const hover = isLight ? adjustBrightness(hex, -6) : adjustBrightness(hex, -12);
      const vivid = isLight ? adjustBrightness(hex, -14) : adjustBrightness(hex, 10);

      root.style.setProperty('--brand', hex);
      root.style.setProperty('--brand-hover', hover);
      root.style.setProperty('--brand-vivid', vivid);

      if (isLight) {
        // Algoritmo de Luminancia Inteligente / Blanco Monocromático (WCAG AAA)
        root.style.setProperty('--brand-ink', '#0F172A'); // Texto grafito profundo ultra nítido
        root.style.setProperty('--brand-text', '#0F172A'); // Texto/iconos de marca sobre fondo claro
        root.style.setProperty('--brand-border', 'rgba(15, 23, 42, 0.18)'); // Borde perimetral para relieve
        root.style.setProperty('--brand-soft', 'rgba(15, 23, 42, 0.06)'); // Fondo suave con contraste
        root.style.setProperty('--brand-glow', 'rgba(15, 23, 42, 0.12)'); // Sombra física de elevación
        root.style.setProperty('--border-strong', 'rgba(15, 23, 42, 0.22)');
      } else {
        // Modo Cromático Normal / Colores Vivos y Saturados
        root.style.setProperty('--brand-ink', '#FFFFFF'); // Texto blanco puro
        root.style.setProperty('--brand-text', hex); // Texto de acento de marca
        root.style.setProperty('--brand-border', 'transparent');
        root.style.setProperty('--brand-soft', `rgba(${r}, ${g}, ${b}, 0.12)`);
        root.style.setProperty('--brand-glow', `rgba(${r}, ${g}, ${b}, 0.35)`);
        root.style.setProperty('--border-strong', `rgba(${r}, ${g}, ${b}, 0.30)`);
      }
    } catch (err) {
      console.error('Failed to apply CSS variables:', err);
    }
  },

  /**
   * Inicializa la configuración de marca al cargar la app:
   * 1. Pinta el color local de inmediato (0ms sin parpadeos).
   * 2. Sincroniza desde Supabase Cloud.
   * 3. Registra listener de visibilidad y chequeo periódico.
   */
  initBranding() {
    const color = this.getBrandColor();
    this.applyColorToDom(color);

    // Sincronización con la nube
    this.syncFromCloud();

    if (typeof window !== 'undefined' && !this._initialized) {
      this._initialized = true;

      // Re-sincronizar al volver a la pestaña o quiosco activo
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
          this.syncFromCloud();
        }
      });

      // Chequeo periódico cada 5 minutos
      setInterval(() => {
        this.syncFromCloud();
      }, 5 * 60 * 1000);
    }
  },

  // Sistema reactivo de suscripción a cambios de branding
  listeners: new Set(),
  subscribe(fn) {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  },
  notifyListeners() {
    const data = {
      logo: this.getLogo(),
      color: this.getBrandColor()
    };
    this.listeners.forEach((fn) => {
      try {
        fn(data);
      } catch (err) {
        console.error('Error in branding listener:', err);
      }
    });
  }
};
