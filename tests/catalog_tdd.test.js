import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { PRODUCTS } from '../src/data/products.js';
import { DEFAULT_SALES_REPS, buildWhatsAppMessage, getWhatsAppUrl } from '../src/data/salesReps.js';

describe('1. Invariantes de Datos y Líneas Oficiales XLSX (TDD)', () => {
  test('El catálogo debe contener exactamente 180 productos registrados', () => {
    assert.equal(PRODUCTS.length, 180, `Se esperaban 180 productos, pero hay ${PRODUCTS.length}`);
  });

  test('La distribución de líneas debe corresponder exactamente al XLSX oficial (27 Deportiva, 132 ORTOPEDIA, 21 REHABILITACION)', () => {
    const counts = { Deportiva: 0, ORTOPEDIA: 0, REHABILITACION: 0, otros: 0 };
    for (const p of PRODUCTS) {
      const line = p.linea || p.badge;
      if (counts[line] !== undefined) {
        counts[line]++;
      } else {
        counts.otros++;
      }
    }

    assert.equal(counts.Deportiva, 27, `Línea Deportiva debe tener 27 productos, tiene ${counts.Deportiva}`);
    assert.equal(counts.ORTOPEDIA, 132, `Línea ORTOPEDIA debe tener 132 productos, tiene ${counts.ORTOPEDIA}`);
    assert.equal(counts.REHABILITACION, 21, `Línea REHABILITACION debe tener 21 productos, tiene ${counts.REHABILITACION}`);
    assert.equal(counts.otros, 0, `No debe haber productos con líneas no oficiales (${counts.otros} encontrados)`);
  });

  test('Ningún producto debe contener la frase obsoleta "naranja neon" en su descripción o título', () => {
    for (const p of PRODUCTS) {
      const fullText = `${p.name} ${p.desc || ''} ${p.features || ''}`.toLowerCase();
      assert.equal(
        fullText.includes('naranja neon') || fullText.includes('naranja neón'),
        false,
        `El producto ${p.code} (${p.name}) aún contiene 'naranja neon'`
      );
    }
  });

  test('Todos los productos deben tener código de referencia y nombre válido no vacío', () => {
    for (const p of PRODUCTS) {
      assert.ok(p.code && p.code.trim().length > 0, `Producto sin código válido: ${JSON.stringify(p)}`);
      assert.ok(p.name && p.name.trim().length > 0, `Producto sin nombre válido: ${p.code}`);
    }
  });
});

describe('2. Padrón Comercial y Generador Seguro de WhatsApp (AppSec & TDD)', () => {
  test('El padrón comercial debe contener 8 asesores activos y ningún vendedor duplicado', () => {
    assert.equal(DEFAULT_SALES_REPS.length, 8, `Se esperaban 8 asesores oficiales, hay ${DEFAULT_SALES_REPS.length}`);
    const ids = new Set(DEFAULT_SALES_REPS.map(r => r.id));
    assert.equal(ids.size, DEFAULT_SALES_REPS.length, 'Existen asesores con IDs duplicados');
  });

  test('Todos los teléfonos de los asesores deben seguir el formato internacional México (+52 1 / 13 dígitos)', () => {
    for (const rep of DEFAULT_SALES_REPS) {
      assert.match(
        rep.phone,
        /^521\d{10}$/,
        `El teléfono de ${rep.name} (${rep.phone}) no cumple con el formato E.164 para WhatsApp México (521 + 10 dígitos)`
      );
    }
  });

  test('getWhatsAppUrl debe normalizar números locales de 10 dígitos y prefijos 52 sin 1', () => {
    const url10 = getWhatsAppUrl('5510805603', 'Prueba');
    assert.ok(url10.startsWith('https://wa.me/5215510805603?text='), `Fallo normalización 10 dígitos: ${url10}`);

    const url12 = getWhatsAppUrl('525510805603', 'Prueba');
    assert.ok(url12.startsWith('https://wa.me/5215510805603?text='), `Fallo normalización 12 dígitos: ${url12}`);

    const url13 = getWhatsAppUrl('5215510805603', 'Prueba');
    assert.ok(url13.startsWith('https://wa.me/5215510805603?text='), `Fallo preservación 13 dígitos: ${url13}`);
  });

  test('getWhatsAppUrl debe rechazar inyecciones de esquemas maliciosos (XSS / Intent Injection)', () => {
    const testCases = [
      'javascript:alert(1)',
      'data:text/html,<script>alert(1)</script>',
      'intent://evil.com#Intent;scheme=http;package=com.android.chrome;end'
    ];

    for (const evilPhone of testCases) {
      const generated = getWhatsAppUrl(evilPhone, 'test');
      assert.ok(
        generated.startsWith('https://wa.me/'),
        `La URL generada no inicia de forma segura con https://wa.me/: ${generated}`
      );
      assert.ok(
        !generated.includes('javascript:') && !generated.includes('data:text/html'),
        `Se detectó esquema peligroso en: ${generated}`
      );
    }
  });

  test('buildWhatsAppMessage debe generar un resumen estructurado legible sin fallar ante listas vacías', () => {
    const emptyMsg = buildWhatsAppMessage('Gabriel', []);
    assert.ok(emptyMsg.includes('*¡Hola Gabriel!*'));
    assert.ok(emptyMsg.includes('*Total de productos:* 0'));

    const items = [
      { code: '101', name: 'Rodillera AIR PRO', cat: 'Deportiva' },
      { code: 'D02', name: 'Inmovilizador de Rodilla', cat: 'ORTOPEDIA' }
    ];
    const fullMsg = buildWhatsAppMessage('Susana', items);
    assert.ok(fullMsg.includes('*¡Hola Susana!*'));
    assert.ok(fullMsg.includes('[Ref. 101] Rodillera AIR PRO'));
    assert.ok(fullMsg.includes('[Ref. D02] Inmovilizador de Rodilla'));
    assert.ok(fullMsg.includes('*Total de productos:* 2'));
  });

  test('buildWhatsAppMessage debe incluir los colores y las tallas seleccionadas de forma estructurada', () => {
    const itemsWithVariants = [
      {
        code: '101',
        name: 'Rodillera Deportiva AIR PRO con Soporte Rotuliano',
        cat: 'Deportiva',
        selectedColor: 'N',
        selectedColorName: 'Naranja',
        selectedSizes: ['CH', 'M', 'XL']
      },
      {
        code: 'A01',
        name: 'Faja Sacrolumbar Reforzada',
        cat: 'lumbar',
        selectedSizes: ['G', 'XXL']
      }
    ];

    const message = buildWhatsAppMessage('Gabriel', itemsWithVariants);
    assert.ok(message.includes('• Color: Naranja (101N)'), 'Debe incluir el color con el sufijo de SKU');
    assert.ok(message.includes('• Tallas solicitadas: CH, M, XL'), 'Debe incluir las tallas múltiples seleccionadas para 101');
    assert.ok(message.includes('• Tallas solicitadas: G, XXL'), 'Debe incluir las tallas múltiples seleccionadas para A01');
  });

  test('El producto 101 y líneas deportivas deben poseer colores (Naranja/Verde) y tallas (CH, M, G, XL) verificadas', () => {
    const prod101 = PRODUCTS.find((p) => p.code === '101');
    assert.ok(prod101, 'Producto 101 no encontrado');
    assert.ok(prod101.colors && prod101.colors.length >= 2, 'Producto 101 debe tener al menos 2 colores (N y V)');
    const colorIds = prod101.colors.map(c => c.id);
    assert.ok(colorIds.includes('N') && colorIds.includes('V'), 'Producto 101 debe contener colores N y V');

    assert.ok(prod101.sizes.includes('CH'), '101 debe incluir talla CH');
    assert.ok(prod101.sizes.includes('M'), '101 debe incluir talla M');
    assert.ok(prod101.sizes.includes('G'), '101 debe incluir talla G');
    assert.ok(prod101.sizes.includes('XL'), '101 debe incluir talla XL');
  });
});

describe('3. Algoritmo Matemático de Zoom 3D y Centrado Estricto (PdfViewer TDD)', () => {
  // Replicamos la función pura de sujeción matemática implementada en PdfViewer.jsx
  function computeClampedPan(zoom, panX, panY, viewportW, viewportH, contentW, contentH) {
    const scaledW = contentW * zoom;
    const scaledH = contentH * zoom;

    let clampedX;
    if (scaledW <= viewportW) {
      // Regla de Oro: Si el documento cabe en ancho, queda matemáticamente centrado
      clampedX = (viewportW - scaledW) / 2;
    } else {
      const minX = viewportW - scaledW;
      const maxX = 0;
      clampedX = Math.min(maxX, Math.max(minX, panX));
    }

    let clampedY;
    if (scaledH <= viewportH) {
      clampedY = Math.max(0, (viewportH - scaledH) / 2);
    } else {
      const minY = viewportH - scaledH;
      const maxY = 0;
      clampedY = Math.min(maxY, Math.max(minY, panY));
    }

    return { panX: clampedX, panY: clampedY };
  }

  test('A escala 1.0x (ancho 800px en pantalla 1920px), el documento debe centrarse exactamente en (1920 - 800)/2 = 560px', () => {
    const result = computeClampedPan(1.0, 0, 0, 1920, 1080, 800, 1100);
    assert.equal(result.panX, 560, 'El documento no está centrado a 1.0x');
  });

  test('A escala 1.5x (ancho 800*1.5 = 1200px en pantalla 1920px), el documento DEBE seguir centrado en (1920 - 1200)/2 = 360px', () => {
    // Incluso si un panX anterior era 0 o -100
    const result = computeClampedPan(1.5, -200, 0, 1920, 1080, 800, 1100);
    assert.equal(result.panX, 360, 'El documento debe mantenerse centrado mientras scaledW <= viewportW');
  });

  test('A escala 3.0x (ancho 800*3 = 2400px en pantalla 1920px), panX debe estar estrictamente acotado entre [1920-2400, 0] = [-480, 0]', () => {
    // Si intenta salirse hacia la derecha (panX > 0)
    const rightOverflow = computeClampedPan(3.0, 150, 0, 1920, 1080, 800, 1100);
    assert.equal(rightOverflow.panX, 0, 'No debe permitir panX > 0 cuando desborda');

    // Si intenta salirse hacia la izquierda (panX < -480)
    const leftOverflow = computeClampedPan(3.0, -800, 0, 1920, 1080, 800, 1100);
    assert.equal(leftOverflow.panX, -480, 'No debe permitir panX < -480 cuando desborda');

    // Si está dentro de los límites válidos
    const validPan = computeClampedPan(3.0, -250, 0, 1920, 1080, 800, 1100);
    assert.equal(validPan.panX, -250, 'Debe preservar el panX válido dentro de límites');
  });
});

describe('4. Resiliencia de Persistencia y Límites de Memoria (Residuality Theory Layer 7)', () => {
  test('La deserialización de lista de interés debe recuperarse con un residuo seguro [] ante JSON corrupto', () => {
    function parseInterestSafely(rawString) {
      try {
        const parsed = JSON.parse(rawString);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    }

    assert.deepEqual(parseInterestSafely('null'), []);
    assert.deepEqual(parseInterestSafely('{"invalido": true}'), []);
    assert.deepEqual(parseInterestSafely('CORRUPTED_BINARY_DATA_{{[['), []);
    assert.deepEqual(parseInterestSafely('["101", "D02"]'), ['101', 'D02']);
  });
});
