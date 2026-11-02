import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  // Configuración de encabezados CORS para peticiones desde el kiosco/app
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Método no permitido. Usa POST.' });
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
    } = req.body;

    if (!config || !config.host || !config.user || !config.password) {
      return res.status(400).json({
        success: false,
        error: 'Faltan parámetros de configuración SMTP (host, user, password).'
      });
    }

    if (!recipientEmail) {
      return res.status(400).json({
        success: false,
        error: 'El correo destinatario es obligatorio.'
      });
    }

    const portNum = Number(config.port) || 465;
    const isSecure = config.secure !== undefined ? Boolean(config.secure) : portNum === 465;

    // Crear el transporte Nodemailer con los datos del servidor HostGator / SMTP
    const transporter = nodemailer.createTransport({
      host: config.host.trim(),
      port: portNum,
      secure: isSecure,
      auth: {
        user: config.user.trim(),
        pass: config.password
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    const formattedTotal = new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(totalAmount);

    const subject = `Cotización Tynor #${quoteNumber || 'OFICIAL'} — ${items.length} productos`;

    const productRowsHtml = items.map((p, idx) => {
      const priceStr = p.price != null ? `$${Number(p.price).toFixed(2)} MXN` : 'Consultar';
      const sizesStr = p.selectedSizes?.join(', ') || p.sizes?.join(', ') || 'Estándar';
      return `
        <tr style="border-bottom: 1px solid #E2E8F0;">
          <td style="padding: 10px; font-weight: bold; color: #0A1E1B;">${idx + 1}. Ref. ${p.code}</td>
          <td style="padding: 10px; color: #334E48;">${p.name}</td>
          <td style="padding: 10px; color: #64748B;">${sizesStr}</td>
          <td style="padding: 10px; text-align: right; font-weight: bold; color: #10B4C1;">${priceStr}</td>
        </tr>
      `;
    }).join('');

    const htmlBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #E2E8F0; border-radius: 12px; background: #FFFFFF;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h2 style="color: #10B4C1; margin: 0;">Tynor Ortopedia</h2>
          <p style="color: #64748B; margin: 5px 0 0 0; font-size: 14px;">Cotización Electrónica Oficial #${quoteNumber || 'OFICIAL'}</p>
        </div>

        <p style="color: #0A1E1B; font-size: 15px;">Hola <strong>${recipientName}</strong>,</p>
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
          <p style="margin: 0 0 5px 0;"><strong>Asesor Comercial:</strong> ${salesRep?.name || 'Tynor Ventas'}</p>
          <p style="margin: 0;"><strong>Contacto Directo:</strong> ${salesRep?.displayPhone || '+52 55 1080 5603'}</p>
        </div>
      </div>
    `;

    const attachments = [];
    if (pdfBase64) {
      attachments.push({
        filename: `Cotizacion_Tynor_${quoteNumber || 'OFICIAL'}.pdf`,
        content: pdfBase64,
        encoding: 'base64'
      });
    }

    const fromAddress = config.fromName
      ? `"${config.fromName}" <${config.fromEmail || config.user}>`
      : (config.fromEmail || config.user);

    const mailOptions = {
      from: fromAddress,
      to: recipientEmail,
      subject,
      html: htmlBody,
      attachments
    };

    const info = await transporter.sendMail(mailOptions);

    return res.status(200).json({
      success: true,
      messageId: info.messageId,
      message: `Correo enviado exitosamente a ${recipientEmail}`
    });
  } catch (error) {
    console.error('Error in send-email API route:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Error al conectar y enviar mediante el servidor de correo'
    });
  }
}
