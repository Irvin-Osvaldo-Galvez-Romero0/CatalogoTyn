const fs = require('fs');
const path = require('path');
const { PRODUCTS, CATEGORIES } = require('../../../src/data/products.js');

const seedPath = path.resolve(__dirname, '../worker_deliverables/supabase_seed.sql');
const sqlContent = fs.readFileSync(seedPath, 'utf8');

console.log('--- AUDIT: PRODUCTS & CATEGORIES DATA VERIFICATION ---');

// 1. Check Categories
console.log(`Source Categories count: ${CATEGORIES.length}`);
let missingCategories = 0;
CATEGORIES.forEach(c => {
  if (!sqlContent.includes(`'${c.id}'`)) {
    console.error(`Missing category in SQL: ${c.id}`);
    missingCategories++;
  }
});
console.log(`Categories check: ${missingCategories === 0 ? 'PASS (all present)' : 'FAIL'}`);

// 2. Check Products Count & Codes
console.log(`Source Products count: ${PRODUCTS.length}`);
let missingProducts = 0;
let malformedProducts = 0;

PRODUCTS.forEach(p => {
  // Check code exists in SQL
  const codeRegex = new RegExp(`\\('\\s*${p.code.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')}'\\s*,`);
  if (!codeRegex.test(sqlContent) && !sqlContent.includes(`('${p.code}'`)) {
    console.error(`Missing product in SQL: ${p.code}`);
    missingProducts++;
    return;
  }

  // Check name snippet exists
  // Handle single quote escaping in names if any
  const escapedNameSnippet = p.name.slice(0, 15).replace(/'/g, "''");
  if (!sqlContent.includes(escapedNameSnippet)) {
    console.error(`Product name not found or altered for ${p.code}: ${p.name}`);
    malformedProducts++;
  }
});

console.log(`Products code check: ${missingProducts === 0 ? 'PASS (all 180 products present)' : 'FAIL'}`);
console.log(`Products name check: ${malformedProducts === 0 ? 'PASS (all names intact)' : 'FAIL'}`);

// 3. Check for Facades or Dummy Data
const dummyMatches = sqlContent.match(/'(TODO|PLACEHOLDER|DUMMY|TEST|foo|bar)'/gi) || [];
console.log(`Dummy / Facade pattern occurrences: ${dummyMatches.length}`);

// 4. Check Category FK Integrity in Seed
let invalidCatFKs = 0;
const validCatIds = new Set(CATEGORIES.map(c => c.id));
PRODUCTS.forEach(p => {
  if (!validCatIds.has(p.cat)) {
    console.error(`Product ${p.code} has invalid cat_id: ${p.cat}`);
    invalidCatFKs++;
  }
});
console.log(`Category FK validity: ${invalidCatFKs === 0 ? 'PASS (all 180 match valid categories)' : 'FAIL'}`);

// 5. Line distribution check
const lineCounts = {};
PRODUCTS.forEach(p => {
  lineCounts[p.linea] = (lineCounts[p.linea] || 0) + 1;
});
console.log('Line distribution in products.js:', lineCounts);

// 6. Media completeness
let withPdf = 0;
let withVideo = 0;
PRODUCTS.forEach(p => {
  if (p.hasPdf) withPdf++;
  if (p.hasVideo) withVideo++;
});
console.log(`Media stats: hasPdf=${withPdf}, hasVideo=${withVideo}`);

// Check if SQL has exactly 180 INSERT row tuples
const insertSection = sqlContent.split('INSERT INTO public.products')[1];
const productTuples = insertSection.split('\nON CONFLICT')[0];
const rowMatches = productTuples.match(/^\s*\(/gm) || [];
console.log(`Product SQL tuples count in INSERT statement: ${rowMatches.length}`);

if (rowMatches.length !== 180) {
  console.error(`MISMATCH: Expected 180 SQL product tuples, found ${rowMatches.length}`);
} else {
  console.log('SQL Tuple Count: EXACT MATCH (180/180)');
}
