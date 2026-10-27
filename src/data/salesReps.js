// Catálogo Oficial de Asesores, Vendedores y Directivos Tynor para WhatsApp
// Números en formato internacional México (+52 1 / wa.me/521XXXXXXXXXX)

export const DEFAULT_SALES_REPS = [
  {
    id: 'gabriel_catalan',
    name: 'Gabriel Fersunnyc Catalán Ramos',
    phone: '5215510805603',
    displayPhone: '+52 55 1080 5603',
    department: 'Ventas'
  },
  {
    id: 'susana_castillo',
    name: 'Susana Castillo',
    phone: '5215519647622',
    displayPhone: '+52 55 1964 7622',
    department: 'Ventas'
  },
  {
    id: 'cesar_aparicio',
    name: 'César Aparicio Hernández',
    phone: '5215530204398',
    displayPhone: '+52 55 3020 4398',
    department: 'Ventas'
  },
  {
    id: 'saul_reyes',
    name: 'Saúl Elpidio Reyes Olguín',
    phone: '5215519647610',
    displayPhone: '+52 55 1964 7610',
    department: 'Ventas'
  },
  {
    id: 'x_magesh',
    name: 'X Magesh Deevakar',
    phone: '5215610241060',
    displayPhone: '+52 56 1024 1060',
    department: 'Ventas'
  },
  {
    id: 'edgar_lopez',
    name: 'Edgar Horacio López Ortega Mariche',
    phone: '5215530184858',
    displayPhone: '+52 55 3018 4858',
    department: 'Ventas'
  },
  {
    id: 'jose_alfredo_gomez',
    name: 'José Alfredo Gómez Martínez',
    phone: '5215530175434',
    displayPhone: '+52 55 3017 5434',
    department: 'Ventas'
  },
  {
    id: 'elizabeth_bustamante',
    name: 'Elizabeth Bustamante Ramos',
    phone: '5215562967168',
    displayPhone: '+52 55 6296 7168',
    department: 'Ventas'
  }
];

/**
 * Genera el mensaje estructurado de WhatsApp a partir de los productos seleccionados
 */
export function buildWhatsAppMessage(salesRepName, items) {
  const dateStr = new Date().toLocaleDateString('es-MX', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const header = `*¡Hola ${salesRepName}!* 🩺\n` +
    `Me interesa hacer una precotización de los siguientes productos del *Catálogo Tynor* (Stand EXPOMEDICAL):\n\n`;

  const productsList = items
    .map((item, idx) => {
      const code = item.code ? `[Ref. ${item.code}]` : '';
      const cat = item.cat ? `(${item.cat})` : '';
      let line = `${idx + 1}. *${code} ${item.name}* ${cat}`;

      const colorNames = item.selectedColorNames || (item.selectedColorName ? [item.selectedColorName] : []);
      const colorCodes = item.selectedColors || (item.selectedColor ? [item.selectedColor] : []);
      if (colorCodes.length > 0) {
        const formattedColors = colorCodes.map((code, i) => {
          const name = colorNames[i] || (item.colors?.find(c => c.id === code)?.name) || code;
          return `${name} (${item.code}${code})`;
        }).join(', ');
        details.push(colorCodes.length === 1 ? `• Color: ${formattedColors}` : `• Colores solicitados: ${formattedColors}`);
      }

      const sizes = item.selectedSizes || item.sizes;
      if (sizes && sizes.length > 0) {
        if (sizes.length === 1) {
          details.push(`• Talla solicitada: ${sizes[0]}`);
        } else {
          details.push(`• Tallas solicitadas: ${sizes.join(', ')}`);
        }
      }

      if (details.length > 0) {
        line += '\n   ' + details.join('\n   ');
      }
      return line;
    })
    .join('\n\n');

  const footer = `\n\n📋 *Total de productos:* ${items.length}\n` +
    `📅 *Fecha de solicitud:* ${dateStr}\n\n` +
    `_Enviado desde el Catálogo Interactivo Tynor_`;

  return `${header}${productsList}${footer}`;
}

/**
 * Genera la URL universal de WhatsApp (wa.me) con normalización para números de México
 */
export function getWhatsAppUrl(phone, message) {
  let cleanPhone = (phone || '').replace(/\D/g, '');
  if (cleanPhone.length === 10) {
    cleanPhone = '521' + cleanPhone;
  } else if (cleanPhone.length === 12 && cleanPhone.startsWith('52') && !cleanPhone.startsWith('521')) {
    cleanPhone = '521' + cleanPhone.slice(2);
  }
  const encodedText = encodeURIComponent(message || '');
  return `https://wa.me/${cleanPhone}?text=${encodedText}`;
}
