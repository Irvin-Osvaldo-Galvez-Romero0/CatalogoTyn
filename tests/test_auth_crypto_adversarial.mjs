/**
 * tests/test_auth_crypto_adversarial.mjs
 * Empirical Challenger Suite: Cryptographic Hashing, Migration, and Auth Security
 */

import { webcrypto } from 'node:crypto';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Polyfill browser globals if needed for productManager
if (!globalThis.crypto) {
  globalThis.crypto = webcrypto;
}

// In-memory mock localStorage
class MockLocalStorage {
  constructor() {
    this.store = new Map();
  }
  getItem(key) {
    return this.store.has(key) ? this.store.get(key) : null;
  }
  setItem(key, value) {
    this.store.set(key, String(value));
  }
  removeItem(key) {
    this.store.delete(key);
  }
  clear() {
    this.store.clear();
  }
}

const mockStorage = new MockLocalStorage();
globalThis.localStorage = mockStorage;

// Import target under test
const {
  KIOSK_SECURITY_SALT,
  DEFAULT_ADMIN_NIP_HASH,
  hashNip,
  productManager
} = await import('../src/services/productManager.js');

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;
const failures = [];

function assert(condition, testName, details = '') {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  [PASS] ${testName}`);
  } else {
    failedTests++;
    console.error(`  [FAIL] ${testName} - ${details}`);
    failures.push({ testName, details });
  }
}

console.log('================================================================');
console.log('EMPIRICAL CHALLENGER: AUTH, CRYPTO & MIGRATION VERIFICATION SUITE');
console.log('================================================================\n');

// -----------------------------------------------------------------------------
// 1. Web Crypto SHA-256 & Salted Hashing Tests
// -----------------------------------------------------------------------------
console.log('--- TEST GROUP 1: Web Crypto SHA-256 Hashing ---');

// 1.1 Baseline known hash test
const expectedHash9824 = '573e2dc11281e6e5f5642973c2da5351a8838d662c4c55d80973c344171382ac';
const computed9824 = await hashNip('9824', 'TYNOR_KIOSK_SALT_2026');
assert(
  computed9824 === expectedHash9824,
  'Verify hashNip("9824", "TYNOR_KIOSK_SALT_2026") matches baseline',
  `Computed: ${computed9824}, Expected: ${expectedHash9824}`
);

// 1.2 Cross-check against node:crypto oracle
const nodeHashOracle = crypto.createHash('sha256').update('9824' + 'TYNOR_KIOSK_SALT_2026').digest('hex');
assert(
  computed9824 === nodeHashOracle,
  'Verify hashNip produces identical digest to node:crypto SHA-256 oracle',
  `hashNip: ${computed9824}, node:crypto: ${nodeHashOracle}`
);

// 1.3 Default salt behavior
const computedWithDefaultSalt = await hashNip('9824');
assert(
  computedWithDefaultSalt === DEFAULT_ADMIN_NIP_HASH,
  'Verify hashNip uses KIOSK_SECURITY_SALT as default matching DEFAULT_ADMIN_NIP_HASH',
  `Computed: ${computedWithDefaultSalt}, Expected: ${DEFAULT_ADMIN_NIP_HASH}`
);

// 1.4 Test various NIP lengths (4 to 8 digits)
const sampleNips = ['1234', '56789', '112233', '9876543', '12345678'];
for (const sample of sampleNips) {
  const hash = await hashNip(sample);
  const oracle = crypto.createHash('sha256').update(sample + KIOSK_SECURITY_SALT).digest('hex');
  assert(
    hash === oracle && /^[0-9a-f]{64}$/.test(hash),
    `NIP "${sample}" (${sample.length} digits) hashes correctly to 64-char hex`,
    `Hash: ${hash}`
  );
}

// 1.5 Determinism test (100 iterations)
let isDeterministic = true;
const baseHash = await hashNip('9824');
for (let i = 0; i < 100; i++) {
  if ((await hashNip('9824')) !== baseHash) {
    isDeterministic = false;
    break;
  }
}
assert(isDeterministic, 'hashNip is 100% deterministic across 100 iterations');

// 1.6 Whitespace trimming & number conversion
const numHash = await hashNip(9824);
const spaceHash = await hashNip('  9824  ');
assert(numHash === baseHash, 'Numeric NIP 9824 hashes identically to string "9824"');
assert(spaceHash === baseHash, 'Whitespace-padded NIP "  9824  " trims and hashes identically to "9824"');

// 1.7 Edge cases: empty, null, undefined
const emptyHash = await hashNip('');
const nullHash = await hashNip(null);
const undefHash = await hashNip(undefined);
assert(emptyHash === '', 'Empty string NIP returns empty string');
assert(nullHash === '', 'Null NIP returns empty string');
assert(undefHash === '', 'Undefined NIP returns empty string');

// 1.8 Collision resistance test across 500 distinct values
const hashesSet = new Set();
let collisionDetected = false;
for (let i = 1000; i < 1500; i++) {
  const h = await hashNip(String(i));
  if (hashesSet.has(h)) {
    collisionDetected = true;
    break;
  }
  hashesSet.add(h);
}
assert(!collisionDetected && hashesSet.size === 500, 'Zero collisions across 500 distinct NIP inputs');

// -----------------------------------------------------------------------------
// 2. LocalStorage Migration Tests
// -----------------------------------------------------------------------------
console.log('\n--- TEST GROUP 2: LocalStorage Legacy Migration ---');

// 2.1 Clean install (no storage entry)
mockStorage.clear();
const cleanCreds = await productManager.getAdminCredentials();
assert(
  cleanCreds.username === 'admin' &&
  cleanCreds.nipHash === DEFAULT_ADMIN_NIP_HASH &&
  cleanCreds.version === 2,
  'Clean install returns default admin with version 2 and DEFAULT_ADMIN_NIP_HASH'
);

// 2.2 Legacy plaintext NIP migration
mockStorage.clear();
mockStorage.setItem('tynor_admin_credentials', JSON.stringify({
  username: 'admin',
  nip: '1234'
}));

const migratedCreds = await productManager.getAdminCredentials();
const expected1234Hash = await hashNip('1234');
const storedAfterMigration = JSON.parse(mockStorage.getItem('tynor_admin_credentials'));

assert(
  migratedCreds.username === 'admin' &&
  migratedCreds.nipHash === expected1234Hash &&
  migratedCreds.version === 2,
  'Legacy entry with nip="1234" migrated in-memory to SHA-256 hash'
);
assert(
  storedAfterMigration.nip === undefined &&
  storedAfterMigration.nipHash === expected1234Hash &&
  storedAfterMigration.version === 2,
  'Storage rewritten: plaintext "nip" completely eliminated, "nipHash" saved, version=2'
);

// 2.3 Legacy custom username with plaintext NIP
mockStorage.clear();
mockStorage.setItem('tynor_admin_credentials', JSON.stringify({
  username: 'gerente_farmacia',
  nip: '8765'
}));
const migratedCustom = await productManager.getAdminCredentials();
const expected8765Hash = await hashNip('8765');
assert(
  migratedCustom.username === 'gerente_farmacia' &&
  migratedCustom.nipHash === expected8765Hash,
  'Preserves custom username ("gerente_farmacia") during plaintext migration'
);

// 2.4 Corrupted JSON in localStorage
mockStorage.clear();
mockStorage.setItem('tynor_admin_credentials', 'INVALID_CORRUPTED_JSON{{{');
const fallbackCreds = await productManager.getAdminCredentials();
assert(
  fallbackCreds.username === 'admin' &&
  fallbackCreds.nipHash === DEFAULT_ADMIN_NIP_HASH,
  'Corrupted JSON in localStorage falls back gracefully to default admin without throwing'
);

// 2.5 Already-migrated v2 format remains untouched
mockStorage.clear();
const v2Data = {
  username: 'admin',
  nipHash: expectedHash9824,
  version: 2
};
mockStorage.setItem('tynor_admin_credentials', JSON.stringify(v2Data));
const v2Read = await productManager.getAdminCredentials();
assert(
  v2Read.username === 'admin' && v2Read.nipHash === expectedHash9824 && v2Read.version === 2,
  'Already-migrated v2 record correctly read without re-migrating'
);

// 2.6 Legacy entry with 64-character hex already in "nip" property
mockStorage.clear();
mockStorage.setItem('tynor_admin_credentials', JSON.stringify({
  username: 'admin',
  nip: expectedHash9824
}));
const hexMigrated = await productManager.getAdminCredentials();
assert(
  hexMigrated.nipHash === expectedHash9824 && hexMigrated.version === 2,
  'Legacy 64-hex string in "nip" mapped to "nipHash" without double-hashing'
);

// -----------------------------------------------------------------------------
// 3. Credential & NIP Verification Method Tests
// -----------------------------------------------------------------------------
console.log('\n--- TEST GROUP 3: Credential Verification Vectors ---');

// Reset to default credentials
mockStorage.clear();

// 3.1 Positive authentication (admin / 9824)
const authSuccess = await productManager.verifyCredentials('admin', '9824');
assert(authSuccess === true, 'verifyCredentials("admin", "9824") returns TRUE');

// 3.2 Case insensitivity on username
const authUpper = await productManager.verifyCredentials('ADMIN', '9824');
const authMixed = await productManager.verifyCredentials(' Admin ', ' 9824 ');
assert(authUpper === true, 'verifyCredentials("ADMIN", "9824") is case-insensitive for username');
assert(authMixed === true, 'verifyCredentials(" Admin ", " 9824 ") handles whitespace trimming');

// 3.3 Negative authentication (wrong password)
const authWrongNip = await productManager.verifyCredentials('admin', 'wrong');
const authOffByOne = await productManager.verifyCredentials('admin', '9825');
assert(authWrongNip === false, 'verifyCredentials("admin", "wrong") returns FALSE');
assert(authOffByOne === false, 'verifyCredentials("admin", "9825") returns FALSE');

// 3.4 Negative authentication (wrong username / intruder)
const authHacker = await productManager.verifyCredentials('hacker', '9824');
const authEmptyUser = await productManager.verifyCredentials('', '9824');
const authNullUser = await productManager.verifyCredentials(null, '9824');
assert(authHacker === false, 'verifyCredentials("hacker", "9824") returns FALSE');
assert(authEmptyUser === false, 'verifyCredentials("", "9824") returns FALSE');
assert(authNullUser === false, 'verifyCredentials(null, "9824") returns FALSE');

// 3.5 Injection and adversarial inputs
const authSqlInjection = await productManager.verifyCredentials("' OR 1=1 --", '9824');
const authProtoPollution = await productManager.verifyCredentials('__proto__', '9824');
const authXss = await productManager.verifyCredentials('<script>alert(1)</script>', '9824');
assert(authSqlInjection === false, 'verifyCredentials SQL injection vector rejected');
assert(authProtoPollution === false, 'verifyCredentials prototype pollution vector rejected');
assert(authXss === false, 'verifyCredentials XSS vector rejected');

// 3.6 verifyNip tests
const nipSuccess = await productManager.verifyNip('9824');
const nipNumSuccess = await productManager.verifyNip(9824);
const nipWrong = await productManager.verifyNip('0000');
const nipEmpty = await productManager.verifyNip('');
const nipNull = await productManager.verifyNip(null);
assert(nipSuccess === true, 'verifyNip("9824") returns TRUE');
assert(nipNumSuccess === true, 'verifyNip(9824) with number returns TRUE');
assert(nipWrong === false, 'verifyNip("0000") returns FALSE');
assert(nipEmpty === false, 'verifyNip("") returns FALSE');
assert(nipNull === false, 'verifyNip(null) returns FALSE');

// -----------------------------------------------------------------------------
// 4. Credential Update & Revocation Lifecycle Tests
// -----------------------------------------------------------------------------
console.log('\n--- TEST GROUP 4: Credential Update & Revocation ---');

// 4.1 Update rejected on bad current NIP
const rejWrongCurrent = await productManager.updateCredentials('wrongNip', 'newAdmin', '5555');
assert(
  rejWrongCurrent.success === false && rejWrongCurrent.error.includes('NIP actual ingresado es incorrecto'),
  'updateCredentials rejected when current NIP is wrong'
);

// 4.2 Update rejected on short new NIP (< 4 digits)
const rejShortNip = await productManager.updateCredentials('9824', 'newAdmin', '12');
assert(
  rejShortNip.success === false && rejShortNip.error.includes('mínimo 4 dígitos'),
  'updateCredentials rejected when new NIP is less than 4 digits'
);

// 4.3 Update rejected on empty username
const rejEmptyUser = await productManager.updateCredentials('9824', '', '5555');
assert(
  rejEmptyUser.success === false,
  'updateCredentials rejected when new username is empty'
);

// 4.4 Successful credential update
const updateSuccess = await productManager.updateCredentials('9824', 'supervisor_kiosk', '778899');
assert(updateSuccess.success === true, 'updateCredentials succeeds with valid current NIP and new credentials');

// 4.5 Verify new credentials active and old credentials revoked
const oldAuthFails = await productManager.verifyCredentials('admin', '9824');
const oldNipFails = await productManager.verifyNip('9824');
const newAuthPasses = await productManager.verifyCredentials('supervisor_kiosk', '778899');
const newNipPasses = await productManager.verifyNip('778899');

assert(oldAuthFails === false, 'Old credentials ("admin", "9824") are immediately revoked');
assert(oldNipFails === false, 'Old NIP ("9824") is immediately revoked');
assert(newAuthPasses === true, 'New credentials ("supervisor_kiosk", "778899") authenticate successfully');
assert(newNipPasses === true, 'New NIP ("778899") validates successfully');

// Verify stored data has zero plaintext
const storedNew = JSON.parse(mockStorage.getItem('tynor_admin_credentials'));
assert(
  storedNew.username === 'supervisor_kiosk' &&
  storedNew.nip === undefined &&
  storedNew.nipHash === (await hashNip('778899')) &&
  storedNew.version === 2,
  'Storage contains only new username and salted hash with no plaintext NIP'
);

// -----------------------------------------------------------------------------
// 5. Protected Operations (Add, Update, Delete Product with NIP verification)
// -----------------------------------------------------------------------------
console.log('\n--- TEST GROUP 5: Protected Product Operations NIP Authorization ---');

// 5.1 addProduct rejected with wrong NIP
const addFail = await productManager.addProduct({ code: 'TEST01', name: 'Test Product' }, null, '0000');
assert(addFail.success === false && addFail.error.includes('NIP de autorización incorrecto'), 'addProduct rejected with wrong NIP');

// 5.2 addProduct accepted with valid NIP ('778899')
const addPass = await productManager.addProduct({ code: 'TEST01', name: 'Test Product', price: 250 }, null, '778899');
assert(addPass.success === true, 'addProduct succeeds with valid NIP');

// 5.3 updateProduct rejected with wrong NIP
const updateFail = await productManager.updateProduct('TEST01', { name: 'Updated Name' }, null, 'wrong');
assert(updateFail.success === false && updateFail.error.includes('NIP de autorización incorrecto'), 'updateProduct rejected with wrong NIP');

// 5.4 updateProduct accepted with valid NIP
const updatePass = await productManager.updateProduct('TEST01', { name: 'Updated Name' }, null, '778899');
assert(updatePass.success === true && updatePass.product.name === 'Updated Name', 'updateProduct succeeds with valid NIP');

// 5.5 deleteProduct rejected with wrong NIP
const deleteFail = await productManager.deleteProduct('TEST01', '0000');
assert(deleteFail.success === false && deleteFail.error.includes('NIP de autorización incorrecto'), 'deleteProduct rejected with wrong NIP');

// 5.6 deleteProduct accepted with valid NIP
const deletePass = await productManager.deleteProduct('TEST01', '778899');
assert(deletePass.success === true, 'deleteProduct succeeds with valid NIP');

// Clean up mock product
mockStorage.removeItem('tynor_custom_products');
mockStorage.clear();

// -----------------------------------------------------------------------------
// 6. High-Concurrency & Race Condition Stress Testing
// -----------------------------------------------------------------------------
console.log('\n--- TEST GROUP 6: High-Concurrency & Race Conditions ---');

// 6.1 Parallel migration stress: 50 concurrent calls to getAdminCredentials() with legacy data
mockStorage.setItem('tynor_admin_credentials', JSON.stringify({ username: 'admin', nip: '9999' }));
const concurrentResults = await Promise.all(
  Array.from({ length: 50 }, () => productManager.getAdminCredentials())
);
const hash9999 = await hashNip('9999');
const allConsistent = concurrentResults.every(
  (r) => r.username === 'admin' && r.nipHash === hash9999 && r.version === 2
);
const finalStored = JSON.parse(mockStorage.getItem('tynor_admin_credentials'));
assert(allConsistent, '50 concurrent getAdminCredentials() migrations all return consistent hash');
assert(finalStored.nip === undefined && finalStored.nipHash === hash9999, 'Storage after 50 concurrent migrations is fully sanitized');

// 6.2 Rapid auth check: 100 alternating valid and invalid authentication checks in parallel
const rapidChecks = await Promise.all(
  Array.from({ length: 100 }, (_, i) => {
    const isEven = i % 2 === 0;
    return productManager.verifyCredentials('admin', isEven ? '9999' : 'wrong');
  })
);
const rapidMatches = rapidChecks.every((res, i) => (i % 2 === 0 ? res === true : res === false));
assert(rapidMatches, '100 parallel alternating auth checks yield 100% accurate true/false verdicts');

// -----------------------------------------------------------------------------
// 7. UI Static Security & Async Flow Inspection
// -----------------------------------------------------------------------------
console.log('\n--- TEST GROUP 7: UI Modal Static Analysis & Async Flow ---');

const authModalPath = path.resolve(__dirname, '../src/components/admin/AdminAuthModal.jsx');
const dashboardModalPath = path.resolve(__dirname, '../src/components/admin/AdminDashboardModal.jsx');

const authModalContent = fs.readFileSync(authModalPath, 'utf8');
const dashboardModalContent = fs.readFileSync(dashboardModalPath, 'utf8');

// 7.1 AdminAuthModal verification
const hasAwaitedVerifyCredentials = authModalContent.includes('await productManager.verifyCredentials(username, nip)');
const hasAsyncHandleSubmit = authModalContent.includes('const handleSubmit = async');
const leaksNipInPlaceholder = authModalContent.includes('9824');
assert(hasAsyncHandleSubmit, 'AdminAuthModal.jsx handleSubmit is explicitly async');
assert(hasAwaitedVerifyCredentials, 'AdminAuthModal.jsx properly awaits productManager.verifyCredentials');
assert(!leaksNipInPlaceholder, 'AdminAuthModal.jsx contains ZERO occurrences of hardcoded "9824"');

// 7.2 AdminDashboardModal verification
const hasAsyncConfirmNip = dashboardModalContent.includes('const handleConfirmNip = async');
const hasAwaitedVerifyNip = dashboardModalContent.includes('await productManager.verifyNip(nipInput)');
const hasAwaitedUpdateSecurity = dashboardModalContent.includes('await productManager.updateCredentials(');
const hasAwaitedDeleteProduct = dashboardModalContent.includes('await productManager.deleteProduct(code, verifiedNip)');
const hasAwaitedAddProduct = dashboardModalContent.includes('await productManager.addProduct(payload, imageFile, verifiedNip)');
const hasAwaitedUpdateProduct = dashboardModalContent.includes('await productManager.updateProduct(editingCode, payload, imageFile, verifiedNip)');

assert(hasAsyncConfirmNip, 'AdminDashboardModal.jsx handleConfirmNip is explicitly async');
assert(hasAwaitedVerifyNip, 'AdminDashboardModal.jsx properly awaits productManager.verifyNip');
assert(hasAwaitedUpdateSecurity, 'AdminDashboardModal.jsx properly awaits productManager.updateCredentials');
assert(hasAwaitedDeleteProduct, 'AdminDashboardModal.jsx properly awaits productManager.deleteProduct');
assert(hasAwaitedAddProduct, 'AdminDashboardModal.jsx properly awaits productManager.addProduct');
assert(hasAwaitedUpdateProduct, 'AdminDashboardModal.jsx properly awaits productManager.updateProduct');

// 7.3 Absence of 9824 in entire src/
let srcLeaks = 0;
function scanDir(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      scanDir(full);
    } else if (entry.isFile() && /\.(js|jsx|ts|tsx)$/.test(entry.name)) {
      const code = fs.readFileSync(full, 'utf8');
      if (code.includes('9824')) {
        console.error(`  [LEAK] Found "9824" in ${full}`);
        srcLeaks++;
      }
    }
  }
}
scanDir(path.resolve(__dirname, '../src'));
assert(srcLeaks === 0, 'Zero occurrences of hardcoded NIP "9824" across all files in src/');

// -----------------------------------------------------------------------------
// Summary
// -----------------------------------------------------------------------------
console.log('\n================================================================');
console.log(`TOTAL TESTS: ${totalTests} | PASSED: ${passedTests} | FAILED: ${failedTests}`);
if (failedTests === 0) {
  console.log('VERDICT: ALL EMPIRICAL CRYPTO & AUTH TESTS PASSED (CONFIRM)');
} else {
  console.error(`VERDICT: ${failedTests} TESTS FAILED (REJECT)`);
}
console.log('================================================================\n');

process.exit(failedTests === 0 ? 0 : 1);
