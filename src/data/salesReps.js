// Catálogo Oficial de Asesores, Vendedores y Directivos Tynor para WhatsApp
// Números en formato internacional México (+52 1 / wa.me/521XXXXXXXXXX)

export const DEFAULT_SALES_REPS = [
  {
    id: 'gabriel_catalan',
    name: 'Gabriel Fersunnyc Catalán Ramos',
    phone: '5215510805603',
    displayPhone: '+52 55 1080 5603',
    department: 'Ventas',
    email: 'gabriel.catalan@tynor.com.mx'
  },
  {
    id: 'susana_castillo',
    name: 'Susana Castillo',
    phone: '5215519647622',
    displayPhone: '+52 55 1964 7622',
    department: 'Ventas',
    email: 'susana.castillo@tynor.com.mx'
  },
  {
    id: 'cesar_aparicio',
    name: 'César Aparicio Hernández',
    phone: '5215530204398',
    displayPhone: '+52 55 3020 4398',
    department: 'Ventas',
    email: 'cesar.aparicio@tynor.com.mx'
  },
  {
    id: 'saul_reyes',
    name: 'Saúl Elpidio Reyes Olguín',
    phone: '5215519647610',
    displayPhone: '+52 55 1964 7610',
    department: 'Ventas',
    email: 'saul.reyes@tynor.com.mx'
  },
  {
    id: 'x_magesh',
    name: 'X Magesh Deevakar',
    phone: '5215610241060',
    displayPhone: '+52 56 1024 1060',
    department: 'Ventas',
    email: 'magesh.deevakar@tynor.com.mx'
  },
  {
    id: 'edgar_lopez',
    name: 'Edgar Horacio López Ortega Mariche',
    phone: '5215530184858',
    displayPhone: '+52 55 3018 4858',
    department: 'Ventas',
    email: 'edgar.lopez@tynor.com.mx'
  },
  {
    id: 'jose_alfredo_gomez',
    name: 'José Alfredo Gómez Martínez',
    phone: '5215530175434',
    displayPhone: '+52 55 3017 5434',
    department: 'Ventas',
    email: 'alfredo.gomez@tynor.com.mx'
  },
  {
    id: 'elizabeth_bustamante',
    name: 'Elizabeth Bustamante Ramos',
    phone: '5215562967168',
    displayPhone: '+52 55 6296 7168',
    department: 'Ventas',
    email: 'elizabeth.bustamante@tynor.com.mx'
  }
];

/**
 * Genera el saludo limpio para WhatsApp sin texto largo ni precotizaciones redundantes.
 * Solo saludo cordial hacia el asesor para adjuntar directamente el PDF descargado.
 */
export function buildWhatsAppMessage(salesRepName, items = []) {
  const repNameClean = salesRepName || 'Asesor';
  return `¡Hola ${repNameClean}! 🩺 Adjunto mi cotización oficial descargada en PDF desde el quiosco para su revisión y seguimiento. Quedo atento a tus comentarios. ¡Gracias!`;
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
