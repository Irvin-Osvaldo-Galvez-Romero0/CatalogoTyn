<!DOCTYPE html>
<html lang="es" data-theme="light">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
    <title>Tynor — Catálogo Interactivo</title>
    
    <link rel="stylesheet" href="css/styles.css">
    
    <script type="module" src="https://ajax.googleapis.com/ajax/libs/model-viewer/3.3.0/model-viewer.min.js"></script>
</head>
<body>
  <div class="app">
    <header class="topbar">
  <div class="brand">
        <img src="assets/logo.png" alt="Logo Recupera" class="brand-logo logo-light">
        <img src="assets/logo1.png" alt="Logo Recupera" class="brand-logo logo-dark">
        <div>
          <span class="brand-tag">Catálogo de exhibición</span>
        </div>
      </div>

      <div class="view-tabs">
        <button class="view-tab active" id="tabCatalog">Catálogo</button>
        <button class="view-tab" id="tabAnatomy">Cuerpo 3D</button>
      </div>

      <div class="search-wrap" id="searchWrap">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>
        <input id="searchInput" type="text" inputmode="search" placeholder="Buscar un producto…" autocomplete="off">
      </div>

      <div class="topbar-spacer"></div>

      <button class="icon-btn theme-toggle" id="themeToggle" aria-label="Cambiar a modo oscuro">
        <svg class="moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.5A9 9 0 1 1 11.5 3a7 7 0 0 0 9.5 9.5Z"/></svg>
        <svg class="sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4.5"/><path d="M12 2.5v3M12 18.5v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2.5 12h3M18.5 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"/></svg>
      </button>

      <button class="icon-btn list-btn" id="listToggle" aria-label="Ver lista de interés">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 4h12v17l-6-3.4L6 21Z"/></svg>
        <span class="list-badge" id="listBadge" data-empty="true">0</span>
      </button>
    </header>

    <div class="view-container" id="catalogView">
      <nav class="filters" id="filters"></nav>
      <main class="grid" id="grid"></main>
      <div class="empty" id="emptyState" hidden>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>
        <h3>No encontramos ese producto</h3>
        <p>Prueba con otra palabra o vuelve a "Todos" para ver el catálogo completo.</p>
      </div>
    </div>

    <div class="view-container hidden" id="anatomyView">
      <div class="model-wrapper">
        <model-viewer 
          id="humanModel"
          src="assets/Model_Human.glb" 
          alt="Modelo Humano Anatómico"
          shadow-intensity="1"
          camera-controls
          auto-rotate
          rotation-per-second="5deg"
          interaction-prompt="hand">
          
          <button class="Hotspot" slot="hotspot-hombro" data-position="0.2 1.5 0" data-normal="0 0 1" data-part="hombro">1</button>
          <button class="Hotspot" slot="hotspot-mano" data-position="0.4 0.9 0" data-normal="1 0 0" data-part="mano">2</button>
          <button class="Hotspot" slot="hotspot-rodilla" data-position="0.1 0.5 0.1" data-normal="0 0 1" data-part="rodilla">3</button>
        </model-viewer>
      </div>

      <div class="anatomy-panel" id="anatomyPanel">
        <div class="anatomy-panel-head">
          <h3 id="anatomyTitle">Productos sugeridos</h3>
          <button class="close-panel-btn" id="anatomyClose">Cerrar</button>
        </div>
        <div class="anatomy-panel-grid" id="anatomyGrid"></div>
      </div>
    </div>
  </div>

  <button class="fab-reset" id="resetBtn" aria-label="Reiniciar para el próximo visitante">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 1 3 6.7"/><path d="M3 21v-6h6"/></svg>
    Reiniciar
  </button>

  <div class="drawer-backdrop" id="drawerBackdrop"></div>
  <aside class="drawer" id="drawer" aria-hidden="true">
    <div class="drawer-head">
      <h2>Mi lista de interés</h2>
      <button class="detail-close" id="drawerClose"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg></button>
    </div>
    <div class="drawer-list" id="drawerList"></div>
    <div class="drawer-foot">
      <span class="drawer-count" id="drawerCount">0 productos</span>
      <div class="drawer-foot-actions">
        <button class="text-btn" id="printBtn">Imprimir</button>
        <button class="text-btn" id="clearBtn">Vaciar</button>
      </div>
    </div>
  </aside>

  <div class="detail-overlay" id="detailOverlay" aria-hidden="true">
    <div class="detail-panel" id="detailPanel"></div>
  </div>

  <div class="media-overlay" id="pdfOverlay" aria-hidden="true">
    <div class="media-panel">
      <button class="media-close" id="pdfClose" title="Cerrar PDF">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>
      </button>
      <iframe id="pdfFrame" src="" title="Documento PDF"></iframe>
    </div>
  </div>

  <div class="media-overlay" id="videoOverlay" aria-hidden="true">
    <button class="cinema-toggle" id="cinemaToggle" title="Modo Cine (Apagar luces)">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M9 18h6"/><path d="M10 22h4"/><path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1.5.54 2.89 1.5 3.5.76.76 1.23 1.52 1.41 2.5"/>
      </svg>
    </button>
    <div class="media-panel">
      <button class="media-close" id="videoClose" title="Cerrar Video">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>
      </button>
      <video id="videoPlayer" controls playsinline></video>
    </div>
  </div>
<script src="js/app.js"></script>
</body>
</html>