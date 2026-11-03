const { chromium } = require('C:/Users/User/AppData/Roaming/npm/node_modules/@playwright/cli/node_modules/playwright-core');
const fs = require('fs');
const path = require('path');

async function main() {
  const screenshotsDir = path.join(__dirname, '../docs/screenshots');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  console.log('Launching browser (channel: msedge)...');
  const browser = await chromium.launch({
    channel: 'msedge',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const context = await browser.newContext({
    viewport: { width: 1366, height: 768 },
    deviceScaleFactor: 2
  });

  const page = await context.newPage();
  const targetUrl = 'https://catalogotyn.vercel.app';

  // 1. Catálogo Principal
  console.log('Capturing Fig. 1: Catálogo Principal...');
  await page.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(3000);
  await page.screenshot({ path: path.join(screenshotsDir, 'fig1_catalogo_principal.png') });

  // 2. Cuerpo 3D
  console.log('Capturing Fig. 2: Cuerpo 3D...');
  const anatomyBtn = await page.$('button[aria-label="Ver Cuerpo Anatómico 3D"]');
  if (anatomyBtn) {
    await anatomyBtn.click();
    await page.waitForTimeout(2000);
    await page.screenshot({ path: path.join(screenshotsDir, 'fig2_anatomia_3d.png') });
    
    // Regresar al catálogo
    const catalogBtn = await page.$('button[aria-label="Ver Catálogo General"]');
    if (catalogBtn) await catalogBtn.click();
    await page.waitForTimeout(1000);
  }

  // 3. Modal de Detalle de Producto
  console.log('Capturing Fig. 3: Detalle de Producto...');
  const productCard = await page.$('.kiosk-card');
  if (productCard) {
    await productCard.click();
    await page.waitForTimeout(1500);

    // Try selecting a size
    const sizeBtns = await page.$$('.modal-content button');
    for (const b of sizeBtns) {
      const txt = await b.innerText();
      if (['CH', 'M', 'G', 'XL', 'XXL'].some(s => txt.includes(s))) {
        await b.click();
        await page.waitForTimeout(400);
        break;
      }
    }

    // Click "+ Agregar Combinación"
    const addComboBtn = await page.$('button:has-text("Agregar Combinación")');
    if (addComboBtn) {
      await addComboBtn.click();
      await page.waitForTimeout(600);
    }

    await page.screenshot({ path: path.join(screenshotsDir, 'fig3_detalle_producto.png') });

    // Close product detail modal
    const closeBtn = await page.$('.modal-top button');
    if (closeBtn) {
      await closeBtn.click();
      await page.waitForTimeout(800);
    }
  }

  // 4. Drawer de Lista de Deseos
  console.log('Capturing Fig. 4: Drawer Lista de Deseos...');
  const wishlistBtn = await page.$('button[title="Ver mi lista de deseos y cotización"]');
  if (wishlistBtn) {
    await wishlistBtn.click();
    await page.waitForTimeout(1500);
    await page.screenshot({ path: path.join(screenshotsDir, 'fig4_lista_deseos.png') });

    // 5. Modal de Código QR
    console.log('Capturing Fig. 5: Modal Código QR...');
    const sendWhatsappBtn = await page.$('button:has-text("Enviar Pedido a WhatsApp")');
    if (sendWhatsappBtn) {
      await sendWhatsappBtn.click();
      await page.waitForTimeout(2000);
      await page.screenshot({ path: path.join(screenshotsDir, 'fig5_codigo_qr.png') });
    }
  }

  // 6. Panel de Administración (Login + Dashboard)
  console.log('Capturing Fig. 6 & 7: Panel de Administración...');
  await page.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(2000);

  const logoCard = await page.$('.kiosk-brand-card');
  if (logoCard) {
    // 3 quick clicks
    await logoCard.click({ clickCount: 3, delay: 100 });
    await page.waitForTimeout(1200);

    const nipInput = await page.$('input[type="password"]');
    if (nipInput) {
      await page.screenshot({ path: path.join(screenshotsDir, 'fig6_login_admin.png') });

      const userInput = await page.$('input[placeholder="Usuario"], input[placeholder="admin"]');
      if (userInput) await userInput.fill('admin');
      await nipInput.fill('2026');

      const submitBtn = await page.$('button[type="submit"], button:has-text("Acceder"), button:has-text("Entrar")');
      if (submitBtn) {
        await submitBtn.click();
        await page.waitForTimeout(2000);
        await page.screenshot({ path: path.join(screenshotsDir, 'fig7_panel_administracion.png') });
      }
    }
  }

  // 7. Modo Demostración (Attract Mode)
  console.log('Capturing Fig. 8: Modo Demostración...');
  await page.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(2000);

  const demoBtn = await page.$('.kiosk-demo-pill-btn, button[title="Iniciar Modo Demostración"]');
  if (demoBtn) {
    await demoBtn.click();
    await page.waitForTimeout(2000);
    await page.screenshot({ path: path.join(screenshotsDir, 'fig8_modo_demostracion.png') });
  }

  // 8. Vista Móvil de Precotización
  console.log('Capturing Fig. 9: Cotización en Móvil...');
  const mobileContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true
  });
  const mobilePage = await mobileContext.newPage();
  await mobilePage.goto(`${targetUrl}/?q=sample`, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await mobilePage.waitForTimeout(2500);
  await mobilePage.screenshot({ path: path.join(screenshotsDir, 'fig9_vista_movil.png') });

  await browser.close();
  console.log('ALL SCREENSHOTS CAPTURED PERFECTLY!');
}

main().catch((err) => {
  console.error('Error in capture_screenshots:', err);
  process.exit(1);
});
