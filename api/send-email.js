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
  const origin = req.headers?.origin;
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
  const clientIp = (req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown').split(',')[0].trim();
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
