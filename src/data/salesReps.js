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
 * Genera el mensaje estructurado de WhatsApp desglosando variantes compuestas
 * (ej. 1 pz Chica Verde y 2 pzs Grande Naranja)
 */
export function buildWhatsAppMessage(salesRepName, items, pdfUrl = '') {
  let message = `¡Hola ${salesRepName}! 🩺\nMe interesa solicitar la siguiente precotización:\n\n`;

  let totalEstimated = 0;
  let totalPiecesCount = 0;

  items.forEach((item, idx) => {
    const priceNum = Number(item.price) || 0;
    const code = item.code ? `[Ref. ${item.code}]` : '';
    const marca = item.marca ? ` (${item.marca})` : '';

    const variants = item.variants && item.variants.length > 0 ? item.variants : null;

    if (variants) {
      const itemPieces = variants.reduce((sum, v) => sum + (v.quantity || 1), 0);
      const itemSubtotal = priceNum * itemPieces;
      totalEstimated += itemSubtotal;
      totalPiecesCount += itemPieces;

      message += `${idx + 1}. *${code} ${item.name}*${marca} (${itemPieces} pz${itemPieces > 1 ? 's' : ''}):\n`;

      variants.forEach((v) => {
        const vQty = v.quantity || 1;
        const vSubtotal = priceNum * vQty;
        const colorPart = v.colorName ? ` - Color: ${v.colorName}` : '';
        const pricePart = priceNum > 0 ? ` [${new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(vSubtotal)}]` : '';
        message += `   • *${vQty} pz${vQty > 1 ? 's' : ''}* - Talla/Medida: ${v.size}${colorPart}${pricePart}\n`;
      });
    } else {
      const qty = item.quantity || 1;
      const subtotal = priceNum * qty;
      totalEstimated += subtotal;
      totalPiecesCount += qty;

      message += `${idx + 1}. *${qty} pz${qty > 1 ? 's' : ''}* - *${code} ${item.name}*${marca}\n`;

      const sizes = item.selectedSizes || item.sizes;
      if (sizes && sizes.length > 0) {
        message += `   • Medida/Talla: ${sizes.join(', ')}\n`;
      }

      const colorNames = item.selectedColorNames || (item.selectedColorName ? [item.selectedColorName] : []);
      if (colorNames.length > 0) {
        message += `   • Color: ${colorNames.join(', ')}\n`;
      }

      if (priceNum > 0) {
        const formattedSubtotal = new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(subtotal);
        message += `   • Subtotal: ${formattedSubtotal}\n`;
      }
    }

    message += '\n';
  });

  if (totalPiecesCount > 0) {
    message += `📦 *Piezas Totales:* ${totalPiecesCount}\n`;
  }

  if (totalEstimated > 0) {
    const formattedTotal = new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(totalEstimated);
    message += `💰 *Total Estimado:* ${formattedTotal}\n`;
  }

  if (pdfUrl) {
    message += `\n📄 *Cotización PDF:* ${pdfUrl}\n`;
  }

  return message.trim();
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
