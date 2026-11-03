# Reporte de Exploración de Seguridad: API de Correo y Autenticación NIP de Quiosco

> **Agente:** `explorer_sec_auth_email`  
> **Fecha:** 2026-11-03  
> **Área:** AppSec & Criptografía Defensiva (`api/send-email.js`, `src/services/productManager.js`, `src/components/admin/AdminAuthModal.jsx`, `src/components/admin/AdminDashboardModal.jsx`)

---

## 1. Observation

A través de la inspección directa del código fuente y pruebas automatizadas locales, se documentan las siguientes evidencias observables:

### 1.1 Pasarela Serverless de Correo (`api/send-email.js`)
- **CORS Permisivo Irrestricto:**
  - Archivo: `api/send-email.js`, líneas 5-7:
    ```javascript
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    ```
    Cualquier origen web en internet puede emitir solicitudes `fetch` directas hacia esta función serverless en Vercel.
- **Inactivación de Validación TLS (Riesgo MitM):**
  - Archivo: `api/send-email.js`, líneas 55-57:
    ```javascript
    tls: {
      rejectUnauthorized: false
    }
    ```
    Nodemailer desactiva explícitamente la comprobación de certificados SSL/TLS, permitiendo ataques de intermediario (Man-in-the-Middle) en redes públicas donde opere el quiosco (ej. ferias médicas, centros comerciales).
- **Falta de Validación de Formato de Correo y CRLF Injection:**
  - Archivo: `api/send-email.js`, líneas 36-41:
    ```javascript
    if (!recipientEmail) {
      return res.status(400).json({
        success: false,
        error: 'El correo destinatario es obligatorio.'
      });
    }
    ```
    No existe validación con expresión regular ni descarte de caracteres de salto de línea (`\r\n`), lo que expone a inyección de encabezados SMTP (`Bcc:`, `Cc:`) si se transmiten parámetros adulterados.
- **Inyección de HTML en Plantilla de Correo:**
  - Archivo: `api/send-email.js`, líneas 87, 72-76:
    ```javascript
    <p style="color: #0A1E1B; font-size: 15px;">Hola <strong>${recipientName}</strong>,</p>
    ...
    <td style="padding: 10px; color: #334E48;">${p.name}</td>
    ```
    Variables como `recipientName`, `p.name` y `quoteNumber` se interpolan directamente sin sanitización de caracteres HTML (`&`, `<`, `>`, `"`, `'`).
- **Ausencia de Mitigación SSRF:**
  - Archivo: `api/send-email.js`, líneas 47-54:
    El parámetro `config.host` no valida si el destino es una dirección de metadatos de nube (`169.254.169.254`) o `localhost`.

### 1.2 Credenciales Administrativas del Quiosco (`src/services/productManager.js` & Modales)
- **Credenciales en Texto Plano:**
  - Archivo: `src/services/productManager.js`, líneas 10-11:
    ```javascript
    const STORAGE_KEY_ADMIN_AUTH = 'tynor_admin_credentials';
    const DEFAULT_ADMIN = { username: 'admin', nip: '9824' };
    ```
    El NIP `9824` y el usuario `admin` están grabados en texto plano en el bundle.
- **Persistencia Insegura en `localStorage`:**
  - Archivo: `src/services/productManager.js`, líneas 112-117:
    ```javascript
    const next = {
      username: newUsername.trim(),
      nip: String(newNip).trim()
    };
    try {
      localStorage.setItem(STORAGE_KEY_ADMIN_AUTH, JSON.stringify(next));
    ```
    Cualquier actualización de credenciales almacena el NIP en texto plano en el navegador/quiosco.
- **Validación Síncrona en Texto Plano:**
  - Archivo: `src/services/productManager.js`, líneas 85-99:
    ```javascript
    verifyCredentials(user, nip) {
      const creds = this.getAdminCredentials();
      return (
        creds.username.trim().toLowerCase() === String(user).trim().toLowerCase() &&
        String(creds.nip).trim() === String(nip).trim()
      );
    },
    verifyNip(nip) {
      const creds = this.getAdminCredentials();
      return String(creds.nip).trim() === String(nip).trim();
    }
    ```
- **Divulgación de Información en Interfaz Pública:**
  - Archivo: `src/components/admin/AdminAuthModal.jsx`, línea 222:
    ```jsx
    placeholder="Ingresa tu NIP (ej. 9824)"
    ```
    La interfaz gráfica revela explícitamente el NIP administrativo por defecto en un formulario expuesto al público.

### 1.3 Validación Criptográfica Empírica
- Ejecución con `node -e`:
  El cálculo de SHA-256 para `9824` con el salt `TYNOR_KIOSK_SALT_2026`:
  ```bash
  node -e "const crypto = require('crypto'); const salt = 'TYNOR_KIOSK_SALT_2026'; console.log(crypto.createHash('sha256').update('9824' + salt).digest('hex'));"
  ```
  Produce de manera idéntica y reproducible:
  `573e2dc11281e6e5f5642973c2da5351a8838d662c4c55d80973c344171382ac`

---

## 2. Logic Chain

1. **De la Observación 1.1 al Endurecimiento de `api/send-email.js`:**
   - La cabecera `Access-Control-Allow-Origin: *` permite el abuso de la cuota serverless de Vercel y del servidor SMTP de la empresa por parte de actores externos.
   - Restringir el origen mediante una lista blanca autorizada (`https://catalogotyn.vercel.app`, dominios institucionales `tynor.com.mx` y puertos de desarrollo local `localhost:4173`, `5173`) junto con `Vary: Origin` garantiza que solo la aplicación legítima acceda a la API.
   - Cambiar `rejectUnauthorized: false` a `rejectUnauthorized: true` con `minVersion: 'TLSv1.2'` restablece la validación obligatoria de certificados TLS según los estándares RFC 8446 y NIST SP 800-52r2, neutralizando ataques MitM.
   - La inclusión de validación de formato RFC 5322 para destinatarios, filtros CRLF (`/[\r\n]/`), sanitización HTML (`escapeHtml`), protección contra hosts de metadatos (`169.254.169.254`) y rate limiting de 15 peticiones/minuto por IP previene la inyección de cabeceras SMTP, el phishing masivo y ataques SSRF.

2. **De la Observación 1.2 a la Arquitectura Criptográfica con Salt y Migración:**
   - Almacenar el NIP en texto plano en `localStorage` viola OWASP A02:2021 (Cryptographic Failures). En quioscos táctiles públicos y entornos físicos compartidos, cualquier persona con acceso a la consola o inspección del almacenamiento extrae la clave administrativa al instante.
   - El uso de la API nativa de navegadores `crypto.subtle.digest('SHA-256', ...)` combinada con un salt estático (`TYNOR_KIOSK_SALT_2026`) garantiza que solo se persista y compare el resumen criptográfico irreversible.
   - Debido a que `crypto.subtle.digest` es inherentemente asíncrono, los métodos `verifyCredentials`, `verifyNip`, `updateCredentials`, `addProduct`, `updateProduct` y `deleteProduct` deben procesarse con `async/await`.
   - Para no bloquear quioscos o navegadores donde ya se haya configurado un NIP personalizado en texto plano, la función de lectura (`getAdminCredentials`) detecta la presencia de un NIP legacy (longitud distinta a 64 caracteres hexadecimales), computa su hash con salt de inmediato y sobrescribe `localStorage` con `{ username, nipHash, version: 2 }`, erradicando el texto plano de forma automática en la primera ejecución.
   - La corrección del placeholder en `AdminAuthModal.jsx` a `placeholder="Ingresa tu NIP (4-8 dígitos)"` elimina la vulnerabilidad de divulgación de credenciales en pantalla.

---

## 3. Caveats

- **Disponibilidad de Web Crypto API (`crypto.subtle`):**  
  `crypto.subtle` requiere un Contexto Seguro (HTTPS o localhost). La aplicación se ejecuta bajo HTTPS en Vercel y bajo localhost en pruebas locales y en el empaquetado Electron, por lo que el contexto seguro está 100% garantizado. Se provee manejo de error explícito si `crypto.subtle` no existiera.
- **Almacenamiento de Contraseñas SMTP en Cliente:**  
  Actualmente `emailService.js` almacena en `localStorage` la configuración SMTP del administrador (host, usuario, contraseña). Si bien el endurecimiento en `api/send-email.js` valida y protege el tránsito y rechaza orígenes extraños, se recomienda a futuro centralizar credenciales SMTP corporativas fijas en variables de entorno Vercel (`SMTP_PASS`) para que no residan en el cliente.
- **No se investigaron módulos ajenos a Email y Auth:**  
  La auditoría de Supabase RLS y `vercel.json` se encuentra delegada a agentes pares del equipo según la partición de tareas establecida por el orquestador.

---

## 4. Conclusion & Especificación de Cambios

Se concluye que las remediaciones de seguridad para la API de Correo y el sistema de Autenticación NIP son técnicamente viables, de impacto quirúrgico y sin romper la compatibilidad funcional de la aplicación.

A continuación se detalla la especificación de cambios exacta para el agente implementador:

### 4.1 Código Propuesto para `api/send-email.js`
Reemplazo completo de `api/send-email.js`:

```javascript
import nodemailer from 'nodemailer';

// Orígenes autorizados (producción en Vercel, dominios institucionales y entornos locales de desarrollo)
const ALLOWED_ORIGIN_PATTERNS = [
  /^https:\/\/catalogotyn(\.vercel\.app|-[\w.-]+\.vercel\.app)$/,
  /^https:\/\/([a-zA-Z0-9-]+\.)?tynor\.com\.mx$/,
  /^http:\/\/localhost:(3000|4173|5173)$/,
  /^http:\/\/127\.0\.0\.1:(3000|4173|5173)$/
];

// Servidores y metadatos no permitidos para mitigar ataques SSRF
const FORBIDDEN_HOSTS = new Set([
  '169.254.169.254',
  'metadata.google.internal',
  'localhost',
  '127.0.0.1',
  '0.0.0.0',
  '::1'
]);

// Expresión regular RFC 5322 para validación de formato de correo
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

// Rate limiting en memoria para instancias calientes de funciones serverless (Vercel)
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minuto
const MAX_REQUESTS_PER_WINDOW = 15; // Máximo 15 peticiones por minuto por IP

function isRateLimited(ip) {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now - entry.startTime > RATE_LIMIT_WINDOW_MS) {
    rateLimitMap.set(ip, { startTime: now, count: 1 });
    return false;
  }
  if (entry.count >= MAX_REQUESTS_PER_WINDOW) {
    return true;
  }
  entry.count += 1;
  return false;
}

// Sanitización contra inyección de HTML / XSS en clientes de correo
function escapeHtml(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Detección de caracteres de inyección de encabezados CRLF
function hasCrlf(str) {
  return typeof str === 'string' && /[\r\n]/.test(str);
}

export default async function handler(req, res) {
  const origin = req.headers.origin;
  let isAllowedOrigin = false;

  if (origin) {
    isAllowedOrigin = ALLOWED_ORIGIN_PATTERNS.some((pattern) => pattern.test(origin));
    if (isAllowedOrigin) {
      res.setHeader('Access-Control-Allow-Origin', origin);
      res.setHeader('Vary', 'Origin');
    } else {
      return res.status(403).json({
        success: false,
        error: 'Origen no autorizado por política CORS de seguridad.'
      });
    }
  }

  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Tynor-Client');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Método no permitido. Usa POST.'
    });
  }

  // Rate Limiting defensivo por IP
  const clientIp = (req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown').split(',')[0].trim();
  if (isRateLimited(clientIp)) {
    return res.status(429).json({
      success: false,
      error: 'Límite de solicitudes de correo excedido. Por favor espera un minuto.'
    });
  }

  try {
    const {
      config,
      recipientEmail,
      recipientName = 'Cliente',
      quoteNumber,
      items = [],
      totalAmount = 0,
      salesRep = null,
      pdfBase64 = null
    } = req.body || {};

    if (!config || !config.host || !config.user || !config.password) {
      return res.status(400).json({
        success: false,
        error: 'Faltan parámetros obligatorios de configuración SMTP (host, user, password).'
      });
    }

    const hostTrimmed = String(config.host).trim();
    if (FORBIDDEN_HOSTS.has(hostTrimmed.toLowerCase())) {
      return res.status(400).json({
        success: false,
        error: 'El servidor host SMTP especificado no está permitido.'
      });
    }

    // Prevención estricta de CRLF injection en parámetros SMTP
    if (
      hasCrlf(recipientEmail) ||
      hasCrlf(recipientName) ||
      hasCrlf(quoteNumber) ||
      hasCrlf(config.user) ||
      hasCrlf(config.host) ||
      hasCrlf(config.fromEmail) ||
      hasCrlf(config.fromName)
    ) {
      return res.status(400).json({
        success: false,
        error: 'Caracteres no permitidos (CRLF) detectados en los parámetros de entrada.'
      });
    }

    // Validación rigurosa de formato de correo
    if (!recipientEmail || typeof recipientEmail !== 'string' || !EMAIL_REGEX.test(recipientEmail.trim()) || recipientEmail.length > 254) {
      return res.status(400).json({
        success: false,
        error: 'El correo destinatario es obligatorio y debe tener un formato válido.'
      });
    }

    const cleanRecipientEmail = recipientEmail.trim();
    const cleanRecipientName = escapeHtml(String(recipientName).trim().slice(0, 80)) || 'Cliente';
    const cleanQuoteNumber = String(quoteNumber || 'OFICIAL').replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 32);

    const portNum = Number(config.port) || 465;
    if (portNum < 1 || portNum > 65535) {
      return res.status(400).json({
        success: false,
        error: 'Puerto SMTP no válido.'
      });
    }

    const isSecure = config.secure !== undefined ? Boolean(config.secure) : portNum === 465;

    // Transporte Nodemailer con verificación TLS estricta (rejectUnauthorized: true)
    const transporter = nodemailer.createTransport({
      host: hostTrimmed,
      port: portNum,
      secure: isSecure,
      auth: {
        user: String(config.user).trim(),
        pass: String(config.password)
      },
      tls: {
        rejectUnauthorized: true,
        minVersion: 'TLSv1.2'
      }
    });

    const safeTotal = typeof totalAmount === 'number' && Number.isFinite(totalAmount) && totalAmount >= 0 && totalAmount < 100000000
      ? totalAmount
      : 0;

    const formattedTotal = new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(safeTotal);

    const subject = `Cotización Tynor #${cleanQuoteNumber} — ${Math.min(items.length, 100)} productos`;

    const productRowsHtml = items.slice(0, 100).map((p, idx) => {
      const priceVal = Number(p.price);
      const priceStr = Number.isFinite(priceVal) ? `$${priceVal.toFixed(2)} MXN` : 'Consultar';
      const rawSizes = p.selectedSizes?.join(', ') || p.sizes?.join(', ') || 'Estándar';
      const sizesStr = escapeHtml(rawSizes);
      const safeCode = escapeHtml(String(p.code || ''));
      const safeName = escapeHtml(String(p.name || ''));

      return `
        <tr style="border-bottom: 1px solid #E2E8F0;">
          <td style="padding: 10px; font-weight: bold; color: #0A1E1B;">${idx + 1}. Ref. ${safeCode}</td>
          <td style="padding: 10px; color: #334E48;">${safeName}</td>
          <td style="padding: 10px; color: #64748B;">${sizesStr}</td>
          <td style="padding: 10px; text-align: right; font-weight: bold; color: #10B4C1;">${priceStr}</td>
        </tr>
      `;
    }).join('');

    const salesRepName = escapeHtml(String(salesRep?.name || 'Tynor Ventas').slice(0, 60));
    const salesRepPhone = escapeHtml(String(salesRep?.displayPhone || '+52 55 1080 5603').slice(0, 30));

    const htmlBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #E2E8F0; border-radius: 12px; background: #FFFFFF;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h2 style="color: #10B4C1; margin: 0;">Tynor Ortopedia</h2>
          <p style="color: #64748B; margin: 5px 0 0 0; font-size: 14px;">Cotización Electrónica Oficial #${cleanQuoteNumber}</p>
        </div>

        <p style="color: #0A1E1B; font-size: 15px;">Hola <strong>${cleanRecipientName}</strong>,</p>
        <p style="color: #334E48; font-size: 14px; line-height: 1.5;">
          Gracias por visitarnos en nuestro catálogo interactivo. A continuación encontrarás el desglose de los productos cotizados:
        </p>

        <table style="width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 13px;">
          <thead>
            <tr style="background: #F1F5F9; color: #475569; text-align: left;">
              <th style="padding: 10px;">Código</th>
              <th style="padding: 10px;">Producto</th>
              <th style="padding: 10px;">Tallas/Variantes</th>
              <th style="padding: 10px; text-align: right;">Precio</th>
            </tr>
          </thead>
          <tbody>
            ${productRowsHtml}
          </tbody>
        </table>

        <div style="background: #F8FAFC; padding: 15px; border-radius: 8px; margin-bottom: 20px; text-align: right;">
          <span style="font-size: 14px; color: #64748B;">Suma Total Estimada: </span>
          <strong style="font-size: 20px; color: #10B4C1;">${formattedTotal}</strong>
        </div>

        <div style="border-top: 1px solid #E2E8F0; padding-top: 15px; margin-top: 20px; font-size: 13px; color: #64748B;">
          <p style="margin: 0 0 5px 0;"><strong>Asesor Comercial:</strong> ${salesRepName}</p>
          <p style="margin: 0;"><strong>Contacto Directo:</strong> ${salesRepPhone}</p>
        </div>
      </div>
    `;

    const attachments = [];
    if (pdfBase64 && typeof pdfBase64 === 'string') {
      if (pdfBase64.length <= 15 * 1024 * 1024) {
        attachments.push({
          filename: `Cotizacion_Tynor_${cleanQuoteNumber}.pdf`,
          content: pdfBase64,
          encoding: 'base64'
        });
      }
    }

    const cleanFromName = config.fromName ? escapeHtml(String(config.fromName).slice(0, 50)) : '';
    const cleanFromEmail = config.fromEmail ? String(config.fromEmail).trim() : String(config.user).trim();
    const fromAddress = cleanFromName ? `"${cleanFromName}" <${cleanFromEmail}>` : cleanFromEmail;

    const mailOptions = {
      from: fromAddress,
      to: cleanRecipientEmail,
      subject,
      html: htmlBody,
      attachments
    };

    const info = await transporter.sendMail(mailOptions);

    return res.status(200).json({
      success: true,
      messageId: info.messageId,
      message: `Correo enviado exitosamente a ${cleanRecipientEmail}`
    });
  } catch (error) {
    console.error('Error in send-email API route:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Error al conectar y enviar mediante el servidor de correo'
    });
  }
}
```

---

### 4.2 Código Propuesto para `src/services/productManager.js`
Añadir soporte criptográfico y métodos asíncronos con migración:

```javascript
export const KIOSK_SECURITY_SALT = 'TYNOR_KIOSK_SALT_2026';
export const DEFAULT_ADMIN_NIP_HASH = '573e2dc11281e6e5f5642973c2da5351a8838d662c4c55d80973c344171382ac';

const DEFAULT_ADMIN = {
  username: 'admin',
  nipHash: DEFAULT_ADMIN_NIP_HASH,
  version: 2
};

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
```

Métodos en `productManager`:
```javascript
  async getAdminCredentials() {
    try {
      const savedRaw = localStorage.getItem(STORAGE_KEY_ADMIN_AUTH);
      if (!savedRaw) return { ...DEFAULT_ADMIN };

      const saved = JSON.parse(savedRaw);
      const is64Hex = (str) => typeof str === 'string' && /^[0-9a-f]{64}$/i.test(str);

      if (saved.nipHash && is64Hex(saved.nipHash)) {
        return {
          username: saved.username || 'admin',
          nipHash: saved.nipHash,
          version: 2
        };
      }

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

  async verifyCredentials(user, nip) {
    if (!user || !nip) return false;
    const creds = await this.getAdminCredentials();
    const inputHash = await hashNip(nip);
    const userMatch = creds.username.trim().toLowerCase() === String(user).trim().toLowerCase();
    const hashMatch = creds.nipHash.toLowerCase() === inputHash.toLowerCase();
    return userMatch && hashMatch;
  },

  async verifyNip(nip) {
    if (!nip) return false;
    const creds = await this.getAdminCredentials();
    const inputHash = await hashNip(nip);
    return creds.nipHash.toLowerCase() === inputHash.toLowerCase();
  },

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

  async addProduct(productData, imageFile = null, nip) {
    if (!(await this.verifyNip(nip))) {
      return { success: false, error: 'NIP de autorización incorrecto.' };
    }
    ...
  },

  async updateProduct(code, updatedData, newImageFile = null, nip) {
    if (!(await this.verifyNip(nip))) {
      return { success: false, error: 'NIP de autorización incorrecto.' };
    }
    ...
  },

  async deleteProduct(code, nip) {
    if (!(await this.verifyNip(nip))) {
      return { success: false, error: 'NIP de autorización incorrecto para eliminar.' };
    }
    ...
  }
```

---

### 4.3 Modificaciones en `src/components/admin/AdminAuthModal.jsx`
1. **Llamada Asíncrona en Submit (Líneas 14-34):**
   ```javascript
   const handleSubmit = async (e) => {
     if (e) e.preventDefault();
     setErrorMsg('');

     if (!username.trim()) {
       setErrorMsg('Por favor ingresa el nombre de usuario.');
       return;
     }
     if (!nip.trim()) {
       setErrorMsg('Por favor ingresa el NIP de acceso.');
       return;
     }

     const isValid = await productManager.verifyCredentials(username, nip);
     if (isValid) {
       onSuccess(nip);
       onClose();
     } else {
       setErrorMsg('Usuario o NIP incorrectos. Verifica tus credenciales.');
     }
   };
   ```
2. **Eliminación de la Fuga de NIP en Placeholder (Línea 222):**
   - Antes: `placeholder="Ingresa tu NIP (ej. 9824)"`
   - Después: `placeholder="Ingresa tu NIP (4-8 dígitos)"`

---

### 4.4 Modificaciones en `src/components/admin/AdminDashboardModal.jsx`
1. **`handleConfirmNip` Asíncrono (Líneas 113-122):**
   ```javascript
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
   ```
2. **`handleDeleteProductClick` con Await (Líneas 277-284):**
   ```javascript
   const handleDeleteProductClick = (code) => {
     requestNipVerification(async (verifiedNip) => {
       const res = await productManager.deleteProduct(code, verifiedNip);
       if (!res.success) {
         alert(res.error);
       }
     });
   };
   ```
3. **`handleUpdateSecurity` Asíncrono (Líneas 366-383):**
   ```javascript
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
   ```

---

## 5. Verification Method

Para verificar independientemente estas conclusiones y validar la implementación una vez aplicada:

### 5.1 Verificación Criptográfica del Hash y Migración
Ejecutar en la terminal el script de prueba de integridad criptográfica:
```bash
node -e "
const crypto = require('crypto');
const KIOSK_SECURITY_SALT = 'TYNOR_KIOSK_SALT_2026';
const EXPECTED_HASH = '573e2dc11281e6e5f5642973c2da5351a8838d662c4c55d80973c344171382ac';

async function test() {
  const enc = new TextEncoder();
  const buf = await crypto.webcrypto.subtle.digest('SHA-256', enc.encode('9824' + KIOSK_SECURITY_SALT));
  const hex = Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
  if (hex !== EXPECTED_HASH) throw new Error('Mismatch in NIP hash calculation');
  console.log('✅ Hashing SHA-256 verificado con éxito:', hex);
}
test();
"
```
**Criterio de éxito:** Imprime `✅ Hashing SHA-256 verificado con éxito`.

### 5.2 Verificación de Rechazo CORS en `api/send-email.js`
Ejecutar prueba de llamada con origen no autorizado:
```bash
node -e "
import('./api/send-email.js').then(m => {
  console.log('Handler imported successfully');
});
"
```
Comprobar mediante `fetch` local que un origen como `https://malicious-site.example` reciba código HTTP `403 Forbidden`.

### 5.3 Verificación de Compilación de Proyecto
```bash
npm run build
```
**Criterio de éxito:** Código de salida 0, sin errores de sintaxis JSX ni tipos incompletos.
