const { chromium } = require('C:/Users/User/AppData/Roaming/npm/node_modules/@playwright/cli/node_modules/playwright-core');
const fs = require('fs');
const path = require('path');

async function main() {
  const screenshotsDir = path.join(__dirname, '../docs/screenshots');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  console.log('Launching Edge for Admin Panel captures...');
  const browser = await chromium.launch({
    channel: 'msedge',
    headless: true
  });

  const context = await browser.newContext({
    viewport: { width: 1366, height: 820 },
    deviceScaleFactor: 2
  });

  const page = await context.newPage();
  const targetUrl = 'https://catalogotyn.vercel.app';
  console.log(`Navigating to ${targetUrl}...`);
  await page.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(2500);

  const logoCard = page.locator('.kiosk-brand-card');
  console.log('Performing 2.6s long-press on logo...');
  await logoCard.dispatchEvent('pointerdown');
  await page.waitForTimeout(2700);
  await logoCard.dispatchEvent('pointerup');
  await page.waitForTimeout(1000);

  const nipInput = page.locator('input[placeholder*="NIP"]');
  console.log('Filling NIP 9824...');
  await nipInput.fill('9824');
  await page.waitForTimeout(500);

  console.log('Capturing fig_admin_login.png...');
  await page.screenshot({ path: path.join(screenshotsDir, 'fig_admin_login.png') });

  const submitBtn = page.locator('button:has-text("Ingresar al Panel")');
  await submitBtn.click();
  await page.waitForTimeout(2000);

  // 1. Tab Productos (Tabla General)
  console.log('Capturing fig_admin_products_table.png...');
  await page.screenshot({ path: path.join(screenshotsDir, 'fig_admin_products_table.png') });

  // Click "Nuevo Producto"
  console.log('Opening product creation/edit form...');
  const newProductBtn = page.locator('button:has-text("Nuevo Producto")');
  if (await newProductBtn.count() > 0) {
    await newProductBtn.click();
    await page.waitForTimeout(1500);

    // Scroll form to reveal priceBySize
    await page.evaluate(() => {
      const container = document.querySelector('.admin-content, form, .modal-card, .admin-dashboard-fullscreen');
      if (container) container.scrollTop = 380;
    });
    await page.waitForTimeout(600);

    console.log('Capturing fig_admin_product_form.png...');
    await page.screenshot({ path: path.join(screenshotsDir, 'fig_admin_product_form.png') });

    // Cancel form
    const cancelBtn = page.locator('button:has-text("Cancelar"), button:has-text("Volver")').first();
    if (await cancelBtn.count() > 0) {
      await cancelBtn.click();
      await page.waitForTimeout(1000);
    }
  }

  // 2. Tab Branding
  console.log('Navigating to Branding tab...');
  const brandingTab = page.locator('button:has-text("Branding & Logo")');
  if (await brandingTab.count() > 0) {
    await brandingTab.click();
    await page.waitForTimeout(1500);
    console.log('Capturing fig_admin_branding.png...');
    await page.screenshot({ path: path.join(screenshotsDir, 'fig_admin_branding.png') });
  }

  // 3. Tab Correo Emisor
  console.log('Navigating to Email tab...');
  const emailTab = page.locator('button:has-text("Correo Emisor")');
  if (await emailTab.count() > 0) {
    await emailTab.click();
    await page.waitForTimeout(1500);
    console.log('Capturing fig_admin_email.png...');
    await page.screenshot({ path: path.join(screenshotsDir, 'fig_admin_email.png') });
  }

  // 4. Tab Seguridad NIP
  console.log('Navigating to Security tab...');
  const securityTab = page.locator('button:has-text("Seguridad NIP")');
  if (await securityTab.count() > 0) {
    await securityTab.click();
    await page.waitForTimeout(1500);
    console.log('Capturing fig_admin_security.png...');
    await page.screenshot({ path: path.join(screenshotsDir, 'fig_admin_security.png') });
  }

  await browser.close();
  console.log('ALL ADMIN TABS CAPTURED SUCCESSFULLY!');
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
