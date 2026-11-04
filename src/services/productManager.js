/**
 * Gestor Unificado de Productos y Almacenamiento en la Nube
 * Soporte híbrido: Productos base + Productos creados por Administrador (LocalStorage + Supabase)
 * Incluye optimización automática de imágenes en WebP y confirmación criptográfica de NIP (SHA-256 + Salt)
 */

import { PRODUCTS as BASE_PRODUCTS } from '../data/products';
import { normalizeColor } from '../utils/colorUtils';

const STORAGE_KEY_CUSTOM_PRODUCTS = 'tynor_custom_products';
const STORAGE_KEY_ADMIN_AUTH = 'tynor_admin_credentials';

const SUPABASE_URL = 'https://xvrnssesbkzxeusubzes.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh2cm5zc2VzYmt6eGV1c3ViemVzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTMwNDg2NTgsImV4cCI6MjEwODYyNDY1OH0.Flfpf4NZHP84b5MvDpBDU6cHXkt78dty8GF63RnHy3c';

export const KIOSK_SECURITY_SALT = 'TYNOR_KIOSK_SALT_2026';
export const DEFAULT_ADMIN_NIP_HASH = '573e2dc11281e6e5f5642973c2da5351a8838d662c4c55d80973c344171382ac';

const DEFAULT_ADMIN = {
  username: 'admin',
  nipHash: DEFAULT_ADMIN_NIP_HASH,
  version: 2
};

function getHeaders(prefer = 'return=minimal') {
  return {
    'apikey': SUPABASE_ANON_KEY,
    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
    'Content-Type': 'application/json',
    'Prefer': prefer
  };
}

function mapRowToProduct(row) {
  return {
    code: row.code,
    name: row.name,
    marca: row.marca || 'Tynor',
    linea: row.linea || 'Ortopédica',
    cat: row.cat || 'inmovilizador',
    price: Number(row.price) || 0,
    priceBySize: row.price_by_size || null,
    stock: row.stock != null ? Number(row.stock) : 10,
    bodyPart: row.body_part || 'rodilla',
    badge: row.badge || 'Nuevo',
    sizes: Array.isArray(row.sizes) ? row.sizes : ['Universal'],
    colors: Array.isArray(row.colors) ? row.colors.map(normalizeColor).filter(Boolean) : [],
    hasPdf: Boolean(row.has_pdf || row.custom_pdf_url),
    customPdfUrl: row.custom_pdf_url || null,
    shortDesc: row.short_desc || '',
    desc: row.desc_text || '',
    uses: Array.isArray(row.uses) ? row.uses : [row.uses || 'Soporte ortopédico'],
    features: Array.isArray(row.features) ? row.features : [row.features || 'Diseño anatómico'],
    customImage: row.custom_image || null,
    isCustom: Boolean(row.is_custom),
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

function mapProductToRow(prod) {
  return {
    code: String(prod.code).trim(),
    name: String(prod.name).trim(),
    marca: prod.marca ? String(prod.marca).trim() : 'Tynor',
    linea: prod.linea ? String(prod.linea).trim() : 'Ortopédica',
    cat: prod.cat || 'inmovilizador',
    price: Number(prod.price) || 0,
    price_by_size: prod.priceBySize || null,
    stock: prod.stock != null ? Number(prod.stock) : 10,
    body_part: prod.bodyPart || 'rodilla',
    badge: prod.badge || 'Nuevo',
    sizes: Array.isArray(prod.sizes) ? prod.sizes : ['Universal'],
    colors: Array.isArray(prod.colors) ? prod.colors : [],
    has_pdf: Boolean(prod.hasPdf || prod.customPdfUrl),
    custom_pdf_url: prod.customPdfUrl || null,
    short_desc: prod.shortDesc || '',
    desc_text: prod.desc || '',
    uses: Array.isArray(prod.uses) ? prod.uses : [prod.uses || 'Soporte ortopédico'],
    features: Array.isArray(prod.features) ? prod.features : [prod.features || 'Diseño anatómico'],
    custom_image: prod.customImage || null,
    is_custom: true,
    is_active: true
  };
}

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

/**
 * Sube un archivo binario (imagen o PDF) al Bucket 'catalog-media' de Supabase Storage
 * @param {File|Blob} file
 * @param {'images'|'pdfs'} folder
 * @param {string} fileName
 * @returns {Promise<string|null>} URL pública CDN del archivo o null si falla
 */
export async function uploadToStorage(file, folder, fileName) {
  if (!file) return null;
  try {
    const cleanName = `${Date.now()}_${fileName.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
    const storagePath = `${folder}/${cleanName}`;
    const uploadUrl = `${SUPABASE_URL}/storage/v1/object/catalog-media/${storagePath}`;

    const res = await fetch(uploadUrl, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': file.type || (folder === 'pdfs' ? 'application/pdf' : 'image/webp'),
        'x-upsert': 'true'
      },
      body: file
    });

    if (res.ok) {
      return `${SUPABASE_URL}/storage/v1/object/public/catalog-media/${storagePath}`;
    }
  } catch (err) {
    console.warn('[Storage] Fallo al subir archivo a Supabase Storage:', err.message);
  }
  return null;
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
   * Sincroniza los productos personalizados desde la nube (Supabase)
   * Si la tabla aún no existe o el dispositivo está offline, mantiene los datos locales sin errores.
   */
  async syncCloudProducts() {
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/productos_catalogo?select=*&is_active=eq.true&order=created_at.desc`, {
        headers: getHeaders('return=representation')
      });

      if (!res.ok) {
        // HTTP 404 significa que la tabla aún no se ha creado en Supabase
        return { success: false, status: res.status };
      }

      const rows = await res.json();
      if (Array.isArray(rows)) {
        const cloudProducts = rows.map(mapRowToProduct);
        const localCustom = this.getCustomProducts();

        // Mezclar dando prioridad a la versión con fecha de actualización más reciente
        const productMap = new Map();
        localCustom.forEach((p) => productMap.set(String(p.code), p));
        cloudProducts.forEach((p) => {
          const local = productMap.get(String(p.code));
          if (!local || new Date(p.updatedAt || p.createdAt || 0) >= new Date(local.updatedAt || local.createdAt || 0)) {
            productMap.set(String(p.code), p);
          }
        });

        const unifiedCustom = Array.from(productMap.values());
        localStorage.setItem(STORAGE_KEY_CUSTOM_PRODUCTS, JSON.stringify(unifiedCustom));
        this.notifyListeners();
        return { success: true, count: unifiedCustom.length };
      }
    } catch (e) {
      console.warn('[ProductManager] Sincronización en la nube en modo offline:', e.message);
    }
    return { success: false };
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
    const unified = [...custom, ...filteredBase];
    // Ordenamiento determinista estable por código para evitar Cumulative Layout Shift (CLS)
    unified.sort((a, b) => String(a.code).localeCompare(String(b.code), undefined, { numeric: true, sensitivity: 'base' }));
    return unified.map((p) => ({
      ...p,
      colors: Array.isArray(p.colors) ? p.colors.map(normalizeColor).filter(Boolean) : []
    }));
  },

  /**
   * Agrega un nuevo producto (requiere confirmación asíncrona de NIP)
   */
  async addProduct(productData, imageFile = null, pdfFile = null, nip) {
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
      // Subir archivo original o comprimido a Supabase Storage
      const cloudImg = await uploadToStorage(imageFile, 'images', `${code}.webp`);
      if (cloudImg) {
        finalImageUrl = cloudImg;
      }
    }

    let finalPdfUrl = productData.customPdfUrl || null;
    if (pdfFile) {
      const cloudPdf = await uploadToStorage(pdfFile, 'pdfs', `${code}_ficha.pdf`);
      if (cloudPdf) {
        finalPdfUrl = cloudPdf;
      }
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
      customPdfUrl: finalPdfUrl,
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

    // Sincronizacion asincrona en Supabase
    fetch(`${SUPABASE_URL}/rest/v1/productos_catalogo`, {
      method: 'POST',
      headers: getHeaders('return=minimal'),
      body: JSON.stringify(mapProductToRow(newProd))
    }).catch((err) => console.warn('[ProductManager] Supabase cloud insert pending/offline:', err.message));

    return { success: true, product: newProd };
  },

  /**
   * Modifica un producto existente (requiere confirmación asíncrona de NIP)
   */
  async updateProduct(code, updatedData, newImageFile = null, newPdfFile = null, nip) {
    const isAuthorized = await this.verifyNip(nip);
    if (!isAuthorized) {
      return { success: false, error: 'NIP de autorización incorrecto.' };
    }

    const strCode = String(code).trim();
    let finalImageUrl = updatedData.imageUrl || null;
    if (newImageFile) {
      finalImageUrl = await compressImage(newImageFile);
      const cloudImg = await uploadToStorage(newImageFile, 'images', `${strCode}.webp`);
      if (cloudImg) {
        finalImageUrl = cloudImg;
      }
    }

    let finalPdfUrl = updatedData.customPdfUrl || null;
    if (newPdfFile) {
      const cloudPdf = await uploadToStorage(newPdfFile, 'pdfs', `${strCode}_ficha.pdf`);
      if (cloudPdf) {
        finalPdfUrl = cloudPdf;
      }
    }

    const currentCustom = this.getCustomProducts();
    const existingCustomIndex = currentCustom.findIndex((p) => String(p.code) === strCode);

    if (existingCustomIndex >= 0) {
      const merged = {
        ...currentCustom[existingCustomIndex],
        ...updatedData,
        customImage: finalImageUrl || currentCustom[existingCustomIndex].customImage,
        customPdfUrl: finalPdfUrl || currentCustom[existingCustomIndex].customPdfUrl,
        updatedAt: new Date().toISOString()
      };
      currentCustom[existingCustomIndex] = merged;
      this.setCustomProducts([...currentCustom]);
      fetch(`${SUPABASE_URL}/rest/v1/productos_catalogo?code=eq.${encodeURIComponent(strCode)}`, {
        method: 'PATCH',
        headers: getHeaders('return=minimal'),
        body: JSON.stringify(mapProductToRow(merged))
      }).catch((err) => console.warn('[ProductManager] Supabase cloud patch pending/offline:', err.message));
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
        customPdfUrl: finalPdfUrl || baseProd.customPdfUrl || null,
        isCustom: true,
        updatedAt: new Date().toISOString()
      };
      this.setCustomProducts([newOverride, ...currentCustom]);
      fetch(`${SUPABASE_URL}/rest/v1/productos_catalogo?code=eq.${encodeURIComponent(strCode)}`, {
        method: 'PATCH',
        headers: getHeaders('return=minimal'),
        body: JSON.stringify(mapProductToRow(newOverride))
      }).catch((err) => console.warn('[ProductManager] Supabase cloud patch pending/offline:', err.message));
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

    // Sincronizacion asincrona de borrado con Supabase
    fetch(`${SUPABASE_URL}/rest/v1/productos_catalogo?code=eq.${encodeURIComponent(strCode)}`, {
      method: 'DELETE',
      headers: getHeaders('return=minimal')
    }).catch((err) => console.warn('[ProductManager] Supabase cloud delete pending/offline:', err.message));

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
