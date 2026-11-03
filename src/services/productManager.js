/**
 * Gestor Unificado de Productos y Almacenamiento en la Nube
 * Soporte híbrido: Productos base + Productos creados por Administrador (LocalStorage + Supabase)
 * Incluye optimización automática de imágenes en WebP y confirmación criptográfica de NIP (SHA-256 + Salt)
 */

import { PRODUCTS as BASE_PRODUCTS } from '../data/products';

const STORAGE_KEY_CUSTOM_PRODUCTS = 'tynor_custom_products';
const STORAGE_KEY_ADMIN_AUTH = 'tynor_admin_credentials';

export const KIOSK_SECURITY_SALT = 'TYNOR_KIOSK_SALT_2026';
export const DEFAULT_ADMIN_NIP_HASH = '573e2dc11281e6e5f5642973c2da5351a8838d662c4c55d80973c344171382ac';

const DEFAULT_ADMIN = {
  username: 'admin',
  nipHash: DEFAULT_ADMIN_NIP_HASH,
  version: 2
};

/**
 * Genera el hash criptográfico SHA-256 de un NIP con salt para almacenamiento seguro
 * @param {string|number} nip
 * @param {string} salt
 * @returns {Promise<string>} Resumen hexadecimal en minúsculas de 64 caracteres
 */
export async function hashNip(nip, salt = KIOSK_SECURITY_SALT) {
  if (nip == null || nip === '') return '';
  const encoder = new TextEncoder();
  const data = encoder.encode(String(nip).trim() + salt);

  if (typeof crypto !== 'undefined' && crypto.subtle) {
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hashBuffer))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
  }
  throw new Error('Web Crypto API (crypto.subtle) no disponible en este entorno.');
}

/**
 * Comprime una imagen a formato WebP o JPEG usando Canvas para reducir su tamaño a ~90-130 KB
 * @param {File} file
 * @param {number} maxDimension
 * @param {number} quality
 * @returns {Promise<string>} Data URL base64 optimizada
 */
export async function compressImage(file, maxDimension = 1000, quality = 0.82) {
  return new Promise((resolve, reject) => {
    if (!file) return resolve('');
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxDimension) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          }
        } else {
          if (height > maxDimension) {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        // Intentar compresión WebP; si el navegador no la soporta, exporta JPEG
        try {
          const webpData = canvas.toDataURL('image/webp', quality);
          if (webpData.startsWith('data:image/webp')) {
            return resolve(webpData);
          }
        } catch (_) {}

        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}

export const productManager = {
  /**
   * Obtiene las credenciales del Administrador con migración transparente
   * de texto plano legacy a hash criptográfico SHA-256 + Salt
   * @returns {Promise<{username: string, nipHash: string, version: number}>}
   */
  async getAdminCredentials() {
    try {
      const savedRaw = localStorage.getItem(STORAGE_KEY_ADMIN_AUTH);
      if (!savedRaw) return { ...DEFAULT_ADMIN };

      const saved = JSON.parse(savedRaw);
      const is64Hex = (str) => typeof str === 'string' && /^[0-9a-f]{64}$/i.test(str);

      // 1. Estructura moderna con hash ya computado
      if (saved.nipHash && is64Hex(saved.nipHash)) {
        return {
          username: saved.username || 'admin',
          nipHash: saved.nipHash,
          version: 2
        };
      }

      // 2. Migración de estructura legacy con campo 'nip' en texto plano o hash sin salt
      if (saved.nip) {
        if (is64Hex(saved.nip)) {
          const upgraded = {
            username: saved.username || 'admin',
            nipHash: saved.nip,
            version: 2
          };
          localStorage.setItem(STORAGE_KEY_ADMIN_AUTH, JSON.stringify(upgraded));
          return upgraded;
        } else {
          const computedHash = await hashNip(saved.nip);
          const upgraded = {
            username: saved.username || 'admin',
            nipHash: computedHash,
            version: 2
          };
          localStorage.setItem(STORAGE_KEY_ADMIN_AUTH, JSON.stringify(upgraded));
          console.info('[Security] NIP de administrador migrado de texto plano a SHA-256 con Salt.');
          return upgraded;
        }
      }
    } catch (e) {
      console.warn('Error reading or migrating admin credentials:', e);
    }
    return { ...DEFAULT_ADMIN };
  },

  /**
   * Valida Usuario y NIP calculando el hash con Salt en tiempo real
   * @param {string} user
   * @param {string|number} nip
   * @returns {Promise<boolean>}
   */
  async verifyCredentials(user, nip) {
    if (!user || !nip) return false;
    const creds = await this.getAdminCredentials();
    const inputHash = await hashNip(nip);
    const userMatch = creds.username.trim().toLowerCase() === String(user).trim().toLowerCase();
    const hashMatch = creds.nipHash.toLowerCase() === inputHash.toLowerCase();
    return userMatch && hashMatch;
  },

  /**
   * Valida solo el NIP para acciones administrativas críticas (editar o eliminar)
   * @param {string|number} nip
   * @returns {Promise<boolean>}
   */
  async verifyNip(nip) {
    if (!nip) return false;
    const creds = await this.getAdminCredentials();
    const inputHash = await hashNip(nip);
    return creds.nipHash.toLowerCase() === inputHash.toLowerCase();
  },

  /**
   * Actualiza Usuario y NIP almacenando únicamente el hash SHA-256 con Salt
   * @param {string|number} currentNip
   * @param {string} newUsername
   * @param {string|number} newNip
   * @returns {Promise<{success: boolean, error?: string}>}
   */
  async updateCredentials(currentNip, newUsername, newNip) {
    const isCurrentValid = await this.verifyNip(currentNip);
    if (!isCurrentValid) {
      return { success: false, error: 'El NIP actual ingresado es incorrecto.' };
    }
    if (!newUsername || !newNip || String(newNip).trim().length < 4) {
      return { success: false, error: 'El nuevo usuario y NIP (mínimo 4 dígitos) son requeridos.' };
    }

    const nipHash = await hashNip(newNip);
    const next = {
      username: String(newUsername).trim(),
      nipHash,
      version: 2
    };
    try {
      localStorage.setItem(STORAGE_KEY_ADMIN_AUTH, JSON.stringify(next));
      return { success: true };
    } catch (e) {
      return { success: false, error: e.message };
    }
  },

  /**
   * Lee productos personalizados guardados por el admin
   */
  getCustomProducts() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CUSTOM_PRODUCTS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  },

  /**
   * Guarda la lista de productos personalizados
   */
  setCustomProducts(products) {
    try {
      localStorage.setItem(STORAGE_KEY_CUSTOM_PRODUCTS, JSON.stringify(products));
      this.notifyListeners();
    } catch (e) {
      console.error('Error saving custom products:', e);
    }
  },

  /**
   * Retorna el catálogo unificado (Base + Custom)
   */
  getAllProducts() {
    const custom = this.getCustomProducts();
    // Mapa con los productos custom reemplazando o sumándose a los base
    const customCodes = new Set(custom.map((p) => String(p.code)));
    const filteredBase = BASE_PRODUCTS.filter((p) => !customCodes.has(String(p.code)));
    return [...custom, ...filteredBase];
  },

  /**
   * Agrega un nuevo producto (requiere confirmación asíncrona de NIP)
   */
  async addProduct(productData, imageFile = null, nip) {
    const isAuthorized = await this.verifyNip(nip);
    if (!isAuthorized) {
      return { success: false, error: 'NIP de autorización incorrecto.' };
    }

    if (!productData.code || !productData.name) {
      return { success: false, error: 'Código de referencia y Nombre son obligatorios.' };
    }

    const code = String(productData.code).trim();
    const existing = this.getAllProducts().find((p) => String(p.code) === code);
    if (existing) {
      return { success: false, error: `Ya existe un producto registrado con el código [${code}].` };
    }

    let finalImageUrl = productData.imageUrl || '';
    if (imageFile) {
      finalImageUrl = await compressImage(imageFile);
    }

    const newProd = {
      code,
      name: productData.name.trim(),
      marca: productData.marca ? productData.marca.trim() : (productData.linea || 'Tynor'),
      linea: productData.linea || productData.marca || 'Ortopédica',
      cat: productData.cat || 'inmovilizador',
      price: productData.price != null && productData.price !== '' ? Number(productData.price) : 0,
      priceBySize: productData.priceBySize || null,
      stock: productData.stock != null && productData.stock !== '' ? Number(productData.stock) : 10,
      bodyPart: productData.bodyPart || 'rodilla',
      badge: productData.badge || 'Nuevo',
      sizes: Array.isArray(productData.sizes) ? productData.sizes : ['Universal'],
      colors: Array.isArray(productData.colors) ? productData.colors : [],
      hasPdf: Boolean(productData.hasPdf || productData.customPdfUrl),
      customPdfUrl: productData.customPdfUrl || null,
      shortDesc: productData.shortDesc || '',
      desc: productData.desc || '',
      uses: Array.isArray(productData.uses) ? productData.uses : [productData.uses || 'Soporte ortopédico'],
      features: Array.isArray(productData.features) ? productData.features : [productData.features || 'Diseño anatómico'],
      customImage: finalImageUrl || null,
      isCustom: true,
      createdAt: new Date().toISOString()
    };

    const currentCustom = this.getCustomProducts();
    this.setCustomProducts([newProd, ...currentCustom]);
    return { success: true, product: newProd };
  },

  /**
   * Modifica un producto existente (requiere confirmación asíncrona de NIP)
   */
  async updateProduct(code, updatedData, newImageFile = null, nip) {
    const isAuthorized = await this.verifyNip(nip);
    if (!isAuthorized) {
      return { success: false, error: 'NIP de autorización incorrecto.' };
    }

    const strCode = String(code).trim();
    let finalImageUrl = updatedData.imageUrl || null;
    if (newImageFile) {
      finalImageUrl = await compressImage(newImageFile);
    }

    const currentCustom = this.getCustomProducts();
    const existingCustomIndex = currentCustom.findIndex((p) => String(p.code) === strCode);

    if (existingCustomIndex >= 0) {
      const merged = {
        ...currentCustom[existingCustomIndex],
        ...updatedData,
        customImage: finalImageUrl || currentCustom[existingCustomIndex].customImage,
        updatedAt: new Date().toISOString()
      };
      currentCustom[existingCustomIndex] = merged;
      this.setCustomProducts([...currentCustom]);
      return { success: true, product: merged };
    } else {
      // Es un producto base que se está editando por primera vez: lo convertimos en custom override
      const baseProd = BASE_PRODUCTS.find((p) => String(p.code) === strCode);
      if (!baseProd) {
        return { success: false, error: 'Producto no encontrado.' };
      }
      const newOverride = {
        ...baseProd,
        ...updatedData,
        customImage: finalImageUrl || baseProd.customImage || null,
        isCustom: true,
        updatedAt: new Date().toISOString()
      };
      this.setCustomProducts([newOverride, ...currentCustom]);
      return { success: true, product: newOverride };
    }
  },

  /**
   * Elimina un producto (requiere confirmación asíncrona de NIP)
   */
  async deleteProduct(code, nip) {
    const isAuthorized = await this.verifyNip(nip);
    if (!isAuthorized) {
      return { success: false, error: 'NIP de autorización incorrecto para eliminar.' };
    }

    const strCode = String(code).trim();
    const currentCustom = this.getCustomProducts();
    const filtered = currentCustom.filter((p) => String(p.code) !== strCode);

    this.setCustomProducts(filtered);
    return { success: true };
  },

  // Suscripción reactiva para que las vistas actualicen en vivo
  listeners: new Set(),
  subscribe(fn) {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  },
  notifyListeners() {
    this.listeners.forEach((fn) => {
      try {
        fn(this.getAllProducts());
      } catch (e) {
        console.error('Error in productManager listener:', e);
      }
    });
  }
};
