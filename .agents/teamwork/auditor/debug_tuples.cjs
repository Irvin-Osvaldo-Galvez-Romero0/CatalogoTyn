const fs = require('fs');
const path = require('path');

const seedPath = path.resolve(__dirname, '../worker_deliverables/supabase_seed.sql');
const sqlContent = fs.readFileSync(seedPath, 'utf8');

const insertSection = sqlContent.split('INSERT INTO public.products')[1];
const productTuples = insertSection.split('\nON CONFLICT')[0];

const lines = productTuples.split('\n').filter(l => l.trim().startsWith('('));
console.log(`Lines starting with (: ${lines.length}`);

// Let's check each product code extracted
const codes = [];
lines.forEach((l, i) => {
  const match = l.match(/^\s*\('([^']+)'/);
  if (match) {
    codes.push(match[1]);
  } else {
    console.log(`Line ${i} did not match code:`, l.slice(0, 50));
  }
});

console.log(`Total codes extracted: ${codes.length}`);
const codeSet = new Set(codes);
console.log(`Unique codes extracted: ${codeSet.size}`);

if (codes.length !== codeSet.size) {
  // Find duplicates
  const seen = new Set();
  const dupes = [];
  codes.forEach(c => {
    if (seen.has(c)) dupes.push(c);
    seen.add(c);
  });
  console.log('Duplicate codes in SQL:', dupes);
}
