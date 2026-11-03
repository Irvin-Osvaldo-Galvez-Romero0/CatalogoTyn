const { chromium } = require('C:/Users/User/AppData/Roaming/npm/node_modules/@playwright/cli/node_modules/playwright-core');
const path = require('path');

async function captureQr() {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const context = await browser.newContext({ viewport: { width: 1366, height: 768 }, deviceScaleFactor: 2 });
  const page = await context.newPage();

  console.log('Navigating to catalog...');
  await page.goto('https://catalogotyn.vercel.app', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(2500);

  // Click direct "+ Agregar" on first card
  const addBtn = await page.$('.kiosk-add-btn');
  if (addBtn) {
    await addBtn.click();
    await page.waitForTimeout(1000);
  }

  // Open wishlist drawer
  const drawerBtn = await page.$('button[title="Ver mi lista de deseos y cotización"]');
  if (drawerBtn) {
    await drawerBtn.click();
    await page.waitForTimeout(1500);

    // Click "Enviar Pedido a WhatsApp"
    const sendBtn = await page.$('button:has-text("Enviar Pedido a WhatsApp")');
    if (sendBtn) {
      await sendBtn.click();
      await page.waitForTimeout(2500);

      const targetPath = path.join(__dirname, '../docs/screenshots/fig5_codigo_qr.png');
      await page.screenshot({ path: targetPath });
      console.log('fig5_codigo_qr.png captured successfully to:', targetPath);
    }
  }

  await browser.close();
}

captureQr().catch(e => console.error(e));
