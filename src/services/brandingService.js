/**
 * Servicio de Personalización de Marca (Branding Dinámico / White-Labeling)
 * Permite cambiar el logotipo oficial y la paleta de color principal del quiosco
 */

const STORAGE_KEY_LOGO = 'tynor_branding_logo';
const STORAGE_KEY_COLOR = 'tynor_branding_color';
const DEFAULT_BRAND_COLOR = '#10B4C1';
const DEFAULT_LOGO_PATH = '/assets/logo.png';

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

export const brandingService = {
  /**
   * Obtiene la ruta o data-URL del logotipo activo
   */
  getLogo() {
    try {
      return localStorage.getItem(STORAGE_KEY_LOGO) || DEFAULT_LOGO_PATH;
    } catch {
      return DEFAULT_LOGO_PATH;
    }
  },

  /**
   * Guarda un nuevo logotipo (ruta o base64)
   */
  setLogo(logoUrlOrBase64) {
    try {
      if (logoUrlOrBase64) {
        localStorage.setItem(STORAGE_KEY_LOGO, logoUrlOrBase64);
      } else {
        localStorage.removeItem(STORAGE_KEY_LOGO);
      }
      this.notifyListeners();
    } catch (e) {
      console.warn('Error saving custom logo:', e);
    }
  },

  /**
   * Restablece el logotipo al oficial por defecto
   */
  resetLogo() {
    try {
      localStorage.removeItem(STORAGE_KEY_LOGO);
      this.notifyListeners();
    } catch (e) {
      console.warn('Error resetting logo:', e);
    }
  },

  /**
   * Obtiene el color principal activo
   */
  getBrandColor() {
    try {
      return localStorage.getItem(STORAGE_KEY_COLOR) || DEFAULT_BRAND_COLOR;
    } catch {
      return DEFAULT_BRAND_COLOR;
    }
  },

  /**
   * Aplica y guarda un nuevo color principal en las variables CSS globales
   */
  setBrandColor(hexColor) {
    if (!hexColor || !/^#[0-9A-Fa-f]{6}$/.test(hexColor)) return;
    try {
      localStorage.setItem(STORAGE_KEY_COLOR, hexColor);
      this.applyColorToDom(hexColor);
      this.notifyListeners();
    } catch (e) {
      console.warn('Error saving brand color:', e);
    }
  },

  /**
   * Restablece el color principal al turquesa médico Tynor (#10B4C1)
   */
  resetBrandColor() {
    try {
      localStorage.removeItem(STORAGE_KEY_COLOR);
      this.applyColorToDom(DEFAULT_BRAND_COLOR);
      this.notifyListeners();
    } catch (e) {
      console.warn('Error resetting brand color:', e);
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
      const hover = adjustBrightness(hex, -12);
      const vivid = adjustBrightness(hex, 10);

      root.style.setProperty('--brand', hex);
      root.style.setProperty('--brand-hover', hover);
      root.style.setProperty('--brand-vivid', vivid);
      root.style.setProperty('--brand-soft', `rgba(${r}, ${g}, ${b}, 0.12)`);
      root.style.setProperty('--brand-glow', `rgba(${r}, ${g}, ${b}, 0.35)`);
      root.style.setProperty('--border-strong', `rgba(${r}, ${g}, ${b}, 0.30)`);
    } catch (err) {
      console.error('Failed to apply CSS variables:', err);
    }
  },

  /**
   * Inicializa la configuración de marca al cargar la app
   */
  initBranding() {
    const color = this.getBrandColor();
    this.applyColorToDom(color);
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

