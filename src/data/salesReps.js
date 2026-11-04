// Catálogo Oficial de Asesores, Vendedores y Directivos Tynor para WhatsApp y Correo
// Números en formato internacional México (+52 1 / wa.me/521XXXXXXXXXX)
// Directorio Oficial Tynor 2026

export const DEFAULT_SALES_REPS = [
  {
    id: 'gabriel_catalan',
    name: 'Gabriel Catalán Ramos',
    phone: '5215510805603',
    displayPhone: '+52 55 1080 5603',
    extension: '',
    department: 'Ejecutivo Comercial',
    email: 'gcatalan@tynor.com.mx'
  },
  {
    id: 'susana_castillo',
    name: 'Lic. Susana Castillo',
    phone: '5215519647622',
    displayPhone: '+52 55 1964 7622',
    extension: '105',
    department: 'Dirección Comercial',
    email: 'susana@tynor.com.mx'
  },
  {
    id: 'cesar_aparicio',
    name: 'César Aparicio Hernández',
    phone: '5215530204398',
    displayPhone: '+52 55 3020 4398',
    extension: '111',
    department: 'Ejecutivo Comercial',
    email: 'cesar@tynor.com.mx'
  },
  {
    id: 'saul_reyes',
    name: 'Saúl Reyes Olguín',
    phone: '5215519647610',
    displayPhone: '+52 55 1964 7610',
    extension: '112',
    department: 'Ejecutivo Comercial',
    email: 'saul@tynor.com.mx'
  },
  {
    id: 'x_magesh',
    name: 'Deevakar X Magesh',
    phone: '5215610241060',
    displayPhone: '+52 56 1024 1060',
    extension: '109',
    department: 'Gerente de Ventas',
    email: 'deevakar@tynor.com.mx'
  },
  {
    id: 'elizabeth_bustamante',
    name: 'Elizabeth Bustamante Ramos',
    phone: '5215562967168',
    displayPhone: '+52 55 6296 7168',
    extension: '',
    department: 'Ejecutivo Comercial / Televentas',
    email: 'televentas@tynor.com.mx'
  },
  {
    id: 'edgar_lopez',
    name: 'Edgar López Ortega Mariche',
    phone: '5215530184858',
    displayPhone: '+52 55 3018 4858',
    extension: '',
    department: 'Ejecutivo Comercial / Foráneo',
    email: 'edgar.l@tynor.com.mx'
  },
  {
    id: 'jose_alfredo_gomez',
    name: 'José Alfredo Gómez Martínez',
    phone: '5215530175434',
    displayPhone: '+52 55 3017 5434',
    extension: '',
    department: 'Ejecutivo Comercial / Foráneo (GDL)',
    email: 'ventasgdl@tynor.com.mx'
  },
  {
    id: 'inder_pal_singh',
    name: 'Inder Pal Singh',
    phone: '5215519647624',
    displayPhone: '+52 55 1964 7624',
    extension: '103',
    department: 'CEO',
    email: 'inder@tynor.com.mx'
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
