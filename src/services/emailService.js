/**
 * Servicio de Configuración y Despacho de Correo Emisor Único (Zero-Code Email Gateway)
 * Permite enviar cotizaciones desde una cuenta centralizada (Gmail, Outlook o Dominio Corporativo)
 */

const EMAIL_CONFIG_KEY = 'tynor_email_gateway_config';

export const EMAIL_PRESETS = {
  GMAIL: {
    id: 'gmail',
    name: 'Google Gmail / Google Workspace',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    imapHost: 'imap.gmail.com',
    imapPort: 993,
    note: 'Requiere contraseña de aplicación (App Password) de 16 caracteres de Google.'
  },
  OUTLOOK: {
    id: 'outlook',
    name: 'Microsoft Outlook / Office 365',
    host: 'smtp.office365.com',
    port: 587,
    secure: false,
    imapHost: 'outlook.office365.com',
    imapPort: 993,
    note: 'Requiere autenticación SMTP e IMAP habilitadas en Microsoft 365 / Outlook.'
  },
  CUSTOM: {
    id: 'custom',
    name: 'Dominio Propio / HostGator / cPanel (IMAP + SMTP)',
    host: '',
    port: 465,
    secure: true,
    imapHost: '',
    imapPort: 993,
    note: 'Ingresa los datos de tu servidor cPanel, HostGator o correo institucional con sincronización IMAP.'
  }
};

export const emailService = {
  /**
   * Obtiene la configuración actual de la cuenta emisora
   */
  getConfig() {
    try {
      const saved = localStorage.getItem(EMAIL_CONFIG_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          provider: parsed.provider || 'custom',
          host: parsed.host || '',
          port: parsed.port || 465,
          secure: parsed.secure !== undefined ? parsed.secure : true,
          imapHost: parsed.imapHost !== undefined ? parsed.imapHost : '',
          imapPort: parsed.imapPort || 993,
          syncImap: parsed.syncImap !== undefined ? parsed.syncImap : true,
          copyToSender: parsed.copyToSender !== undefined ? parsed.copyToSender : true,
          user: parsed.user || '',
          password: parsed.password || '',
          fromName: parsed.fromName || 'Tynor Ortopedia — Cotizaciones',
          fromEmail: parsed.fromEmail || '',
          replyTo: parsed.replyTo || ''
        };
      }
    } catch (e) {
      console.warn('Could not read email config:', e);
    }

    return {
      provider: 'custom',
      host: '',
      port: 465,
      secure: true,
      imapHost: '',
      imapPort: 993,
      syncImap: true,
      copyToSender: true,
      user: '',
      password: '',
      fromName: 'Tynor Ortopedia — Cotizaciones',
      fromEmail: '',
      replyTo: ''
    };
  },

  /**
   * Guarda la configuración de la cuenta emisora
   */
  saveConfig(newConfig) {
    try {
      localStorage.setItem(EMAIL_CONFIG_KEY, JSON.stringify(newConfig));
      return { success: true };
    } catch (e) {
      console.error('Error saving email config:', e);
      return { success: false, error: e.message };
    }
  },

  /**
   * Realiza un test de diagnóstico de conexión y envío
   */
  async testConnection(testRecipientEmail) {
    const config = this.getConfig();
    if (!config.fromEmail || !config.user || !config.host) {
      return {
        success: false,
        error: 'Por favor completa al menos el servidor SMTP, usuario, contraseña y correo emisor.'
      };
    }

    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          config,
          recipientEmail: testRecipientEmail,
          recipientName: 'Prueba de Conexión',
          quoteNumber: 'TEST',
          items: [
            { code: 'TEST', name: 'Comprobación de Servidor SMTP HostGator', price: 0, sizes: ['OK'] }
          ],
          totalAmount: 0
        })
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Error al conectar con el servidor SMTP');
      }

      return {
        success: true,
        message: `¡Prueba exitosa! Correo enviado desde ${config.fromEmail} a ${testRecipientEmail}.`
      };
    } catch (err) {
      return {
        success: false,
        error: `Fallo de conexión o envío: ${err.message}`
      };
    }
  },

  /**
   * Envía la cotización formal por correo electrónico
   */
  async sendQuote({
    recipientEmail,
    recipientName = 'Cliente',
    ccEmail = null,
    quoteNumber,
    items = [],
    totalAmount = 0,
    salesRep = null,
    pdfBlob = null
  }) {
    const config = this.getConfig();

    const formattedTotal = new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(totalAmount);

    const subject = `Cotización Tynor #${quoteNumber || 'OFICIAL'} — ${items.length} productos`;

    const productRowsText = items.map((p, idx) => {
      const priceStr = p.price != null ? `$${Number(p.price).toFixed(2)} MXN` : 'Consultar';
      const sizesStr = p.selectedSizes?.join(', ') || p.sizes?.join(', ') || 'Estándar';
      return `${idx + 1}. [Ref. ${p.code}] ${p.name} | Tallas: ${sizesStr} | Precio: ${priceStr}`;
    }).join('\n');

    const emailBodyText =
      `Hola ${recipientName},\n\n` +
      `Adjuntamos la cotización solicitada del Catálogo Tynor:\n\n` +
      `${productRowsText}\n\n` +
      `TOTAL GENERAL: ${formattedTotal}\n\n` +
      `Asesor asignado: ${salesRep?.name || 'Tynor Ventas'}\n` +
      `Teléfono / WhatsApp: ${salesRep?.displayPhone || '+52 55 1080 5603'}\n` +
      (ccEmail ? `Copia al asesor: ${ccEmail}\n\n` : '\n') +
      `¡Gracias por tu preferencia!\nTynor Ortopedia & Biomecánica`;

    // Si está configurado el servidor SMTP, intentar despacho directo mediante la API de Vercel
    if (config.host && config.user && config.password) {
      try {
        let pdfBase64 = null;
        if (pdfBlob) {
          pdfBase64 = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => {
              const res = reader.result;
              const base64 = typeof res === 'string' ? res.split(',')[1] : null;
              resolve(base64);
            };
            reader.onerror = () => resolve(null);
            reader.readAsDataURL(pdfBlob);
          });
        }

        const response = await fetch('/api/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            config,
            recipientEmail,
            recipientName,
            ccEmail,
            quoteNumber,
            items,
            totalAmount,
            salesRep,
            pdfBase64
          })
        });

        const data = await response.json();
        if (response.ok && data.success) {
          return {
            success: true,
            mode: 'smtp_direct',
            from: config.fromEmail || config.user,
            to: recipientEmail,
            cc: ccEmail,
            formattedTotal,
            message: data.message || `Correo enviado exitosamente a ${recipientEmail}`
          };
        } else {
          console.warn('Fallo el envío por API, usando fallback mailto:', data.error);
          const ccParam = ccEmail ? `&cc=${encodeURIComponent(ccEmail)}` : '';
          const mailtoUrl = `mailto:${encodeURIComponent(recipientEmail)}?subject=${encodeURIComponent(subject)}${ccParam}&body=${encodeURIComponent(emailBodyText)}`;

          return {
            success: true,
            mode: 'mailto',
            mailtoUrl,
            from: config.fromEmail || 'cotizaciones@tynor.com.mx',
            to: recipientEmail,
            cc: ccEmail,
            formattedTotal,
            warning: data.error
              ? `Aviso del servidor de correo: "${data.error}". Se preparó el desglose oficial para enviarlo directamente desde tu aplicación de correo.`
              : null
          };
        }
      } catch (e) {
        console.warn('Error llamando a /api/send-email, usando fallback mailto:', e);
        const ccParam = ccEmail ? `&cc=${encodeURIComponent(ccEmail)}` : '';
        const mailtoUrl = `mailto:${encodeURIComponent(recipientEmail)}?subject=${encodeURIComponent(subject)}${ccParam}&body=${encodeURIComponent(emailBodyText)}`;

        return {
          success: true,
          mode: 'mailto',
          mailtoUrl,
          from: config.fromEmail || 'cotizaciones@tynor.com.mx',
          to: recipientEmail,
          cc: ccEmail,
          formattedTotal,
          warning: `No se pudo conectar al servicio SMTP (${e.message}). Puedes abrir el correo directamente en tu aplicación abajo.`
        };
      }
    }

    // Fallback: Si no hay servidor configurado o falla la red, preparar enlace mailto
    const ccParam = ccEmail ? `&cc=${encodeURIComponent(ccEmail)}` : '';
    const mailtoUrl = `mailto:${encodeURIComponent(recipientEmail)}?subject=${encodeURIComponent(subject)}${ccParam}&body=${encodeURIComponent(emailBodyText)}`;

    return {
      success: true,
      mode: 'mailto',
      mailtoUrl,
      from: config.fromEmail || 'cotizaciones@tynor.com.mx',
      to: recipientEmail,
      cc: ccEmail,
      formattedTotal
    };
  }
};

