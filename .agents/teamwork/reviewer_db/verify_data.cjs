const fs = require('fs');
const path = require('path');
const { PRODUCTS, CATEGORIES, BODY_PARTS } = require('../../../src/data/products.js');

console.log('=== TEST 1: Basic Counts ===');
console.log('Categories count:', CATEGORIES.length);
console.log('Body parts count:', BODY_PARTS.length);
console.log('Products count:', PRODUCTS.length);

console.log('\n=== TEST 2: Special Characters & Quotes ===');
let singleQuotes = 0;
let doubleQuotes = 0;
let backslashes = 0;
let specialCharProducts = [];

for (const p of PRODUCTS) {
  const jsonStr = JSON.stringify(p);
  if (jsonStr.includes("'")) {
    singleQuotes++;
    specialCharProducts.push({ code: p.code, name: p.name });
  }
  if (jsonStr.includes('"')) doubleQuotes++;
  if (jsonStr.includes('\\')) backslashes++;
}
console.log('Products containing single quotes (\'):', singleQuotes);
console.log('Products containing backslashes (\\):', backslashes);
if (singleQuotes > 0) {
  console.log('Examples with single quotes:', specialCharProducts.slice(0, 5));
}

console.log('\n=== TEST 3: Inspect Seed SQL Syntax & Escaping ===');
const seedPath = path.join(__dirname, '../worker_deliverables/supabase_seed.sql');
const seedContent = fs.readFileSync(seedPath, 'utf8');

// Check line count and file size
const lines = seedContent.split('\n');
console.log('Seed SQL lines:', lines.length);
console.log('Seed SQL size (bytes):', seedContent.length);

// Check if all 180 product codes appear in seed
let missingInSeed = [];
for (const p of PRODUCTS) {
  // Regex to match code in INSERT values: e.g. ('101', or ('D02',
  const codeRegex = new RegExp(`\\('${p.code}',`);
  if (!codeRegex.test(seedContent)) {
    missingInSeed.push(p.code);
  }
}
console.log('Missing product codes in seed:', missingInSeed.length);
if (missingInSeed.length > 0) {
  console.log('Missing codes:', missingInSeed);
}

// Check JSONB syntax in seed
const jsonbRegex = /'(\{.*\}|\[.*\])'::jsonb/g;
let jsonbMatches = 0;
let invalidJsonb = [];
let match;
while ((match = jsonbRegex.exec(seedContent)) !== null) {
  jsonbMatches++;
  const raw = match[1].replace(/''/g, "'");
  try {
    JSON.parse(raw);
  } catch (err) {
    invalidJsonb.push({ match: match[0].substring(0, 50), err: err.message });
  }
}
console.log('JSONB literals checked:', jsonbMatches);
console.log('Invalid JSONB literals:', invalidJsonb.length);
if (invalidJsonb.length > 0) {
  console.log('Invalid samples:', invalidJsonb.slice(0, 3));
}
