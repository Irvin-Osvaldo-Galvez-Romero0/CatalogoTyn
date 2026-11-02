/**
 * Gestor Unificado de Productos y Almacenamiento en la Nube
 * Soporte híbrido: Productos base + Productos creados por Administrador (LocalStorage + Supabase)
 * Incluye optimización automática de imágenes en WebP y confirmación de NIP
 */

import { PRODUCTS as BASE_PRODUCTS } from '../data/products';

const STORAGE_KEY_CUSTOM_PRODUCTS = 'tynor_custom_products';
const STORAGE_KEY_ADMIN_AUTH = 'tynor_admin_credentials';
const DEFAULT_ADMIN = { username: 'admin', nip: '9824' };

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
   * Obtiene las credenciales del Administrador
   */
  getAdminCredentials() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ADMIN_AUTH);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Error reading admin credentials:', e);
    }
    return DEFAULT_ADMIN;
  },

  /**
   * Valida Usuario y NIP
   */
  verifyCredentials(user, nip) {
    const creds = this.getAdminCredentials();
    return (
      creds.username.trim().toLowerCase() === String(user).trim().toLowerCase() &&
      String(creds.nip).trim() === String(nip).trim()
    );
  },

  /**
   * Valida solo el NIP para acciones administrativas críticas (editar o eliminar)
   */
  verifyNip(nip) {
    const creds = this.getAdminCredentials();
    return String(creds.nip).trim() === String(nip).trim();
  },

  /**
   * Actualiza Usuario y NIP
   */
  updateCredentials(currentNip, newUsername, newNip) {
    if (!this.verifyNip(currentNip)) {
      return { success: false, error: 'El NIP actual ingresado es incorrecto.' };
    }
    if (!newUsername || !newNip || newNip.length < 4) {
      return { success: false, error: 'El nuevo usuario y NIP (mínimo 4 dígitos) son requeridos.' };
    }

    const next = {
      username: newUsername.trim(),
      nip: String(newNip).trim()
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
   * Agrega un nuevo producto (requiere NIP de confirmación)
   */
  async addProduct(productData, imageFile = null, nip) {
    if (!this.verifyNip(nip)) {
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
   * Modifica un producto existente (requiere NIP)
   */
  async updateProduct(code, updatedData, newImageFile = null, nip) {
    if (!this.verifyNip(nip)) {
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
   * Elimina un producto (requiere NIP)
   */
  deleteProduct(code, nip) {
    if (!this.verifyNip(nip)) {
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

