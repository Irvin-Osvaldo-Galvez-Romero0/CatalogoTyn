import { PRODUCTS } from '../src/data/products.js';

const zeroPrice = PRODUCTS.filter(p => !p.price || p.price <= 0);

console.log(`TOTAL DE PRODUCTOS EN EL CATÁLOGO: ${PRODUCTS.length}`);
console.log(`PRODUCTOS CON PRECIO ASIGNADO: ${PRODUCTS.length - zeroPrice.length}`);
console.log(`PRODUCTOS SIN PRECIO (Precio $0.00 / Pendientes): ${zeroPrice.length}\n`);

if (zeroPrice.length === 0) {
  console.log("¡Todos los productos tienen precio asignado!");
} else {
  zeroPrice.forEach((p, idx) => {
    console.log(`${idx + 1}. Código: [${p.code}] - ${p.name}`);
    console.log(`   Línea / Marca: ${p.linea || p.marca || 'N/A'} | Categoría: ${p.cat} | Anatomía: ${p.bodyPart}`);
    console.log(`   Tallas: ${p.sizes ? p.sizes.join(', ') : 'Universal'}\n`);
  });
}

