const { contextBridge } = require('electron');

// Exponer de forma segura capacidades de escritorio si se requieren
contextBridge.exposeInMainWorld('electronDesktop', {
  isDesktop: true,
  platform: process.platform,
  version: process.versions.electron
});
