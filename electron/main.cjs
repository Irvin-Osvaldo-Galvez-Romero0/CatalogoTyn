const { app, BrowserWindow, globalShortcut } = require('electron');
const path = require('path');
const http = require('http');
const fs = require('fs');
const url = require('url');

// Aceleración de GPU y WebGL optimizada para silicio de bajos recursos (Intel HD 2010+, Atom, Celeron)
app.commandLine.appendSwitch('ignore-gpu-blocklist');
app.commandLine.appendSwitch('enable-webgl');
app.commandLine.appendSwitch('enable-webgl2-compute-context');
app.commandLine.appendSwitch('use-angle', 'default');
app.commandLine.appendSwitch('enable-zero-copy');
app.commandLine.appendSwitch('disable-gpu-watchdog');
app.commandLine.appendSwitch('force-device-scale-factor', '1');
app.commandLine.appendSwitch('renderer-process-limit', '2');
app.commandLine.appendSwitch('js-flags', '--max-old-space-size=512');
app.commandLine.appendSwitch('touch-events', 'enabled');
app.commandLine.appendSwitch('enable-touch-drag-drop');

const isDev = process.env.NODE_ENV === 'development';
const DIST_PATH = path.join(__dirname, '../dist');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.glb': 'model/gltf-binary',
  '.gltf': 'model/gltf+json',
  '.pdf': 'application/pdf',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf',
  '.ico': 'image/x-icon'
};

let localServer = null;
let mainWindow = null;

// Servidor HTTP interno de alto rendimiento para servir los recursos locales (modelos 3D, PDFs, imágenes)
function startLocalServer() {
  return new Promise((resolve, reject) => {
    localServer = http.createServer((req, res) => {
      try {
        const parsedUrl = url.parse(req.url);
        let decodedPath = decodeURIComponent(parsedUrl.pathname);
        if (decodedPath === '/') decodedPath = '/index.html';

        let filePath = path.join(DIST_PATH, decodedPath);

        // Si estamos empaquetados y el archivo fue desempaquetado de asar (GLBs, PDFs, videos)
        if (!fs.existsSync(filePath) && filePath.includes('app.asar')) {
          const unpackedCandidate = filePath.replace('app.asar', 'app.asar.unpacked');
          if (fs.existsSync(unpackedCandidate)) {
            filePath = unpackedCandidate;
          }
        }

        // Seguridad: evitar path traversal
        if (!filePath.startsWith(DIST_PATH)) {
          res.writeHead(403);
          res.end('Acceso denegado');
          return;
        }

        // Si el archivo no existe, fallback a index.html (SPA)
        if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
          const fallbackIndex = path.join(DIST_PATH, 'index.html');
          if (fs.existsSync(fallbackIndex)) {
            filePath = fallbackIndex;
          } else {
            res.writeHead(404);
            res.end('Recurso no encontrado');
            return;
          }
        }

        const stat = fs.statSync(filePath);
        const ext = path.extname(filePath).toLowerCase();
        const contentType = MIME_TYPES[ext] || 'application/octet-stream';

        // Soporte de Range Requests (crítico para videos MP4 y archivos GLB grandes)
        const range = req.headers.range;
        if (range) {
          const parts = range.replace(/bytes=/, '').split('-');
          const start = parseInt(parts[0], 10);
          const end = parts[1] ? parseInt(parts[1], 10) : stat.size - 1;
          const chunksize = (end - start) + 1;
          const fileStream = fs.createReadStream(filePath, { start, end });

          res.writeHead(206, {
            'Content-Range': `bytes ${start}-${end}/${stat.size}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunksize,
            'Content-Type': contentType,
            'Access-Control-Allow-Origin': '*'
          });
          fileStream.pipe(res);
        } else {
          res.writeHead(200, {
            'Content-Length': stat.size,
            'Content-Type': contentType,
            'Accept-Ranges': 'bytes',
            'Access-Control-Allow-Origin': '*'
          });
          fs.createReadStream(filePath).pipe(res);
        }
      } catch (err) {
        console.error('Error en servidor local:', err);
        res.writeHead(500);
        res.end('Error interno');
      }
    });

    // Escuchar en puerto dinámico asignado por el sistema en localhost
    localServer.listen(0, '127.0.0.1', () => {
      const port = localServer.address().port;
      console.log(`[Tynor Kiosk] Servidor local iniciado en http://127.0.0.1:${port}`);
      resolve(port);
    });

    localServer.on('error', reject);
  });
}

async function createWindow(serverPort) {
  const iconPath = path.join(__dirname, '../build/icon.ico');

  const isKiosk = !process.argv.includes('--windowed');

  mainWindow = new BrowserWindow({
    width: 1920,
    height: 1080,
    fullscreen: isKiosk,
    kiosk: isKiosk,
    frame: !isKiosk,
    autoHideMenuBar: true,
    icon: fs.existsSync(iconPath) ? iconPath : undefined,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: true
    }
  });

  // Atajos de teclado para administración en kiosco
  mainWindow.webContents.on('before-input-event', (event, input) => {
    // F11: Alternar Pantalla Completa / Kiosco
    if (input.key === 'F11' && input.type === 'keyDown') {
      const isCurrentlyKiosk = mainWindow.isKiosk();
      mainWindow.setKiosk(!isCurrentlyKiosk);
      event.preventDefault();
    }
    // Escape: Salir de Kiosco a Modo Ventana (para operadores técnicos)
    if (input.key === 'Escape' && input.type === 'keyDown') {
      if (mainWindow.isKiosk()) {
        mainWindow.setKiosk(false);
        mainWindow.setFullScreen(false);
      }
    }
  });

  const appUrl = isDev && process.env.VITE_DEV_SERVER_URL
    ? process.env.VITE_DEV_SERVER_URL
    : `http://127.0.0.1:${serverPort}`;

  await mainWindow.loadURL(appUrl);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(async () => {
  let port = 3005;
  if (!isDev) {
    port = await startLocalServer();
  }
  await createWindow(port);

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow(port);
    }
  });
});

app.on('window-all-closed', () => {
  if (localServer) {
    localServer.close();
  }
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
