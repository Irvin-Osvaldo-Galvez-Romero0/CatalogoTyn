/**
 * Script de Importación Masiva de Productos a Supabase
 * Importa los 180 productos oficiales del Catálogo Tynor a public.productos_catalogo
 * Utiliza Upsert idempotente (on_conflict=code) para evitar duplicados.
 */

import { PRODUCTS } from '../src/data/products.js';

const SUPABASE_URL = 'https://xvrnssesbkzxeusubzes.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh2cm5zc2VzYmt6eGV1c3ViemVzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTMwNDg2NTgsImV4cCI6MjEwODYyNDY1OH0.Flfpf4NZHP84b5MvDpBDU6cHXkt78dty8GF63RnHy3c';

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
    badge: prod.badge || 'Catálogo',
    sizes: Array.isArray(prod.sizes) && prod.sizes.length > 0 ? prod.sizes : ['Universal'],
    colors: Array.isArray(prod.colors)
      ? prod.colors.map((c) => (typeof c === 'object' && c !== null ? JSON.stringify(c) : String(c)))
      : [],
    has_pdf: Boolean(prod.hasPdf || prod.customPdfUrl),
    custom_pdf_url: prod.customPdfUrl || null,
    short_desc: prod.shortDesc || '',
    desc_text: prod.desc || '',
    uses: Array.isArray(prod.uses) ? prod.uses : [prod.uses || 'Soporte ortopédico'],
    features: Array.isArray(prod.features) ? prod.features : [prod.features || 'Diseño anatómico'],
    custom_image: prod.customImage || null,
    is_custom: false,
    is_active: true
  };
}

async function runImport() {
  console.log(`====================================================`);
  console.log(`📦 INICIANDO IMPORTACIÓN MASIVA A SUPABASE`);
  console.log(`Total productos en catálogo base: ${PRODUCTS.length}`);
  console.log(`Servidor Supabase: ${SUPABASE_URL}`);
  console.log(`====================================================`);

  const rows = PRODUCTS.map(mapProductToRow);

  const BATCH_SIZE = 30;
  let totalImported = 0;

  for (let i = 0; i < rows.length; i += BATCH_SIZE) {
    const batch = rows.slice(i, i + BATCH_SIZE);
    const batchNumber = Math.floor(i / BATCH_SIZE) + 1;
    const totalBatches = Math.ceil(rows.length / BATCH_SIZE);

    console.log(`⏳ Enviando lote ${batchNumber}/${totalBatches} (${batch.length} productos)...`);

    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/productos_catalogo?on_conflict=code`, {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'resolution=merge-duplicates,return=minimal'
        },
        body: JSON.stringify(batch)
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Error HTTP ${res.status}: ${errorText}`);
      }

      totalImported += batch.length;
      console.log(`✅ Lote ${batchNumber} sincronizado con éxito (${totalImported}/${rows.length})`);
    } catch (err) {
      console.error(`❌ Error en lote ${batchNumber}:`, err.message);
      process.exit(1);
    }
  }

  // Verificación final
  console.log(`\n🔍 Verificando conteo total de productos en Supabase...`);
  const countRes = await fetch(`${SUPABASE_URL}/rest/v1/productos_catalogo?select=id`, {
    headers: {
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      'Range-Unit': 'items',
      'Range': '0-0',
      'Prefer': 'count=exact'
    }
  });

  const contentRange = countRes.headers.get('content-range');
  console.log(`📊 Conteo reportado por Supabase (Content-Range): ${contentRange}`);
  console.log(`🎉 ¡IMPORTACIÓN EXITOSA! Se han cargado los ${totalImported} productos a Supabase.`);
}

runImport();

