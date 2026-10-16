(function(){
  "use strict";
const PRODUCTS = [
    { code:"C01", name:"Cabestrillo (Tropical)", cat:"cabestrillo", price:125.00, bodyPart:['hombro', 'brazo'],
      desc:"<b>Descripción:</b> La función del cabestrillo es sostener, apoyar e inmovilizar esguinces, fracturas o intervenciones quirúrgicas del brazo, manteniéndolo en posición de flexión durante el proceso de recuperación.<br><br>Fabricado en un elegante e inteligente diseño ideal para países tropicales con condiciones climáticas cálidas y húmedas.<br><br><b>USOS Y APLICACIONES:</b><br>• Fractura en cualquier estructura que compone el brazo.<br>• Fractura de clavícula." },
    
    { code:"C06", name:"Cabestrillo Ancho (Buggy)", cat:"cabestrillo", price:140.00, bodyPart:['hombro', 'brazo'],
      desc:"<b>Descripción:</b> La función del cabestrillo es sostener, apoyar e inmovilizar esguinces, fracturas o intervenciones quirúrgicas del brazo, manteniéndolo en posición de flexión durante el proceso de recuperación.<br><br>Fabricado en un elegante e inteligente diseño ideal para países tropicales con condiciones climáticas cálidas y húmedas.<br><br><b>USOS Y APLICACIONES:</b><br>• Fractura en cualquier estructura que compone el brazo.<br>• Fractura de clavícula." },
    
    { code:"L04", name:"Cabestrillo Oxypore", cat:"cabestrillo", price:null, bodyPart:['hombro', 'brazo'],
      desc:"<b>Descripción:</b> De tamaño reducido y diseño elegante, no cubre el pecho, apoya y cubre el brazo por completo. Puede acomodar yesos o vendajes voluminosos. Es el más adecuado para climas cálidos. Hecho de tela perforada de malla 3D fuerte, sin arrugas, muy bien ventilada con un aspecto agradable.<br><br><b>USOS Y APLICACIONES:</b><br>Sostiene y apoya los brazos torcidos, rotos u operados quirúrgicamente en posición de flexión mientras se recupera." },

    { code:"C02", name:"Inmovilizador de Hombro Universal", cat:"inmovilizador", price:265.00, bodyPart:['hombro', 'brazo'],
      desc:"Soporte versátil que se adapta a distintas tallas, brindando estabilidad completa al hombro y al antebrazo desde el primer ajuste para una recuperación segura." },
    
    { code:"F03", name:"Inmovilizador de Aluminio para Dedo", cat:"inmovilizador", price:null, bodyPart:['mano'],
      desc:"Férula de aluminio maleable recubierta de espuma que inmoviliza y protege las falanges de los dedos en caso de fracturas, esguinces o rehabilitación." },
    
    { code:"C03", name:"Inmovilizador Elástico de Hombros", cat:"inmovilizador", price:360.00, bodyPart:['hombro'],
      desc:"Diseño elástico que restringe el movimiento del hombro proporcionando compresión y soporte. Ideal para lesiones de manguito rotador o luxaciones." },

    { code:"C05", name:"Soporte para Clavícula con Velcro", cat:"clavicula", price:210.00, bodyPart:['hombro'],
      desc:"Cierre de velcro para un ajuste rápido y progresivo. Corrige la postura y ayuda en el tratamiento de fracturas de clavícula, pensado para uso diario prolongado." },
    
    { code:"C04", name:"Soporte para Clavícula con Hebilla", cat:"clavicula", price:213.00, bodyPart:['hombro'],
      desc:"Sistema de hebillas que permite un ajuste firme y seguro para inmovilizar la clavícula y promover la correcta alineación postural durante la recuperación." },

    { code:"D09", name:"Rodillera Mecánica Abierta de Algodón Elástico", cat:"rodillera", price:null, bodyPart:['rodilla'],
      desc:"Rodillera de compresión con diseño abierto en la rótula. Fabricada en algodón elástico transpirable, incluye articulaciones mecánicas laterales para dar mayor estabilidad a la rodilla." },
    
    { code:"D05", name:"Rodillera Elástica", cat:"rodillera", price:null, bodyPart:['rodilla'],
      desc:"Soporte elástico que provee compresión uniforme y calor terapéutico a la articulación, ideal para tratar esguinces leves, inflamación y brindar apoyo preventivo." },
    
    { code:"D10", name:"Rodillera Mecánica Graduable", cat:"rodillera", price:null, bodyPart:['rodilla'],
      desc:"Máxima sujeción con bisagras graduables que permiten controlar con precisión el rango de movimiento de flexión y extensión. Indicada para post-operatorios y rehabilitación." }
  ];

  const CATEGORIES = [
    { id:"todos", label:"Todos" },
    { id:"cabestrillo", label:"Cabestrillos" },
    { id:"inmovilizador", label:"Inmovilizadores" },
    { id:"clavicula", label:"Soportes de clavícula" },
    { id:"rodillera", label:"Rodilleras" }
  ];

  let state = {
    view: "catalog",
    category: "todos",
    query: "",
    interest: []
  };

  const byCode = code => PRODUCTS.find(p => p.code === code);
  const money = v => v == null ? "Consultar precio" : "$" + v.toFixed(2);

  const tabCatalog = document.getElementById("tabCatalog");
  const tabAnatomy = document.getElementById("tabAnatomy");
  const catalogView = document.getElementById("catalogView");
  const anatomyView = document.getElementById("anatomyView");
  const searchWrap = document.getElementById("searchWrap");

  function switchView(viewName){
    state.view = viewName;
    if(viewName === "catalog"){
      tabCatalog.classList.add("active"); tabAnatomy.classList.remove("active");
      catalogView.classList.remove("hidden"); anatomyView.classList.add("hidden");
      searchWrap.style.display = "block";
    } else {
      tabAnatomy.classList.add("active"); tabCatalog.classList.remove("active");
      anatomyView.classList.remove("hidden"); catalogView.classList.add("hidden");
      searchWrap.style.display = "none";
    }
  }
  tabCatalog.addEventListener("click", () => switchView("catalog"));
  tabAnatomy.addEventListener("click", () => switchView("anatomy"));

  const gridEl = document.getElementById("grid");
  const emptyEl = document.getElementById("emptyState");
  const filtersEl = document.getElementById("filters");

  function renderFilters(){
    filtersEl.innerHTML = "";
    CATEGORIES.forEach(cat => {
      const btn = document.createElement("button");
      btn.className = "filter-pill"; btn.textContent = cat.label;
      btn.setAttribute("aria-pressed", String(state.category === cat.id));
      btn.addEventListener("click", () => { state.category = cat.id; renderFilters(); renderGrid(); });
      filtersEl.appendChild(btn);
    });
  }

  function visibleProducts(){
    const q = state.query.trim().toLowerCase();
    return PRODUCTS.filter(p => {
      const matchesCat = state.category === "todos" || p.cat === state.category;
      const matchesQuery = !q || p.name.toLowerCase().includes(q);
      return matchesCat && matchesQuery;
    });
  }

  function createCardElement(p) {
    const card = document.createElement("button");
    card.className = "card"; 
    card.dataset.cat = p.cat;
    card.setAttribute("aria-label", p.name + ", " + money(p.price));
    
    card.innerHTML = `
      <div class="card-icon">
        <img src="assets/${p.code}.png" alt="${p.name}" style="max-width: 80%; max-height: 80%; object-fit: contain;">
      </div>
      <div class="card-body">
        <span class="card-cat">${CATEGORIES.find(c=>c.id===p.cat)?.label}</span>
        <span class="card-name">${p.name}</span>
      </div>
      <div class="card-foot">
        <span class="card-price">${money(p.price)}</span>
        <span class="card-add" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>
        </span>
      </div>`;
    card.addEventListener("click", () => openDetail(p.code));
    return card;
  }

  function renderGrid(){
    const items = visibleProducts();
    gridEl.innerHTML = "";
    emptyEl.hidden = items.length !== 0;
    gridEl.hidden = items.length === 0;
    items.forEach(p => gridEl.appendChild(createCardElement(p)));
  }

  document.getElementById("searchInput").addEventListener("input", (e) => {
    state.query = e.target.value; renderGrid();
  });

  const modelViewer = document.getElementById('humanModel');
  const panel = document.getElementById('anatomyPanel');
  const panelGrid = document.getElementById('anatomyGrid');
  const panelTitle = document.getElementById('anatomyTitle');
  const closePanelBtn = document.getElementById('anatomyClose');

  document.querySelectorAll('.Hotspot').forEach(hotspot => {
    hotspot.addEventListener('click', (e) => {
      modelViewer.autoRotate = false;
      const position = e.currentTarget.dataset.position;
      modelViewer.cameraTarget = position;
      modelViewer.cameraOrbit = "auto auto 2m";
      
      const part = e.currentTarget.dataset.part;
      const partNames = { hombro: "Hombro y Brazo", rodilla: "Rodilla", mano: "Muñeca y Mano" };
      panelTitle.textContent = "Mostrando: " + (partNames[part] || part);
      
      const filtered = PRODUCTS.filter(p => p.bodyPart.includes(part));
      panelGrid.innerHTML = "";
      if(filtered.length === 0){
        panelGrid.innerHTML = `<p style="grid-column:1/-1; color:var(--ink-muted);">No hay productos en esta área por el momento.</p>`;
      } else {
        filtered.forEach(p => panelGrid.appendChild(createCardElement(p)));
      }
      
      panel.classList.add('open');
    });
  });

  closePanelBtn.addEventListener('click', () => {
    panel.classList.remove('open');
    modelViewer.cameraTarget = "auto auto auto";
    modelViewer.cameraOrbit = "0deg 75deg 105%"; 
    modelViewer.autoRotate = true;
  });

  const detailOverlay = document.getElementById("detailOverlay");
  const detailPanel = document.getElementById("detailPanel");

  const pdfOverlay = document.getElementById("pdfOverlay");
  const pdfFrame = document.getElementById("pdfFrame");
  const videoOverlay = document.getElementById("videoOverlay");
  const videoPlayer = document.getElementById("videoPlayer");

  function openDetail(code){
    const p = byCode(code);
    const inList = state.interest.includes(code);
    
    detailPanel.innerHTML = `
      <div class="detail-visual" data-cat="${p.cat}" style="background:var(--cat-${p.cat}-soft); color:var(--cat-${p.cat})">
        <img src="assets/${p.code}.png" alt="${p.name}" style="max-width: 80%; max-height: 80%; object-fit: contain;">
      </div>
      <div class="detail-content">
        <div class="detail-top">
          <div>
            <span class="detail-ref">Ref. ${p.code}</span>
            <p class="detail-cat">${CATEGORIES.find(c=>c.id===p.cat).label}</p>
          </div>
          <button class="detail-close" id="detailCloseBtn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg></button>
        </div>
        <h2 class="detail-name">${p.name}</h2>
        <div class="detail-price">${money(p.price)}</div>
        <p class="detail-desc">${p.desc}</p>
        <div class="detail-actions">
          <button class="btn btn-primary" id="addBtn" data-added="${inList}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">${inList ? '<path d="M5 13l4 4L19 7"/>' : '<path d="M12 5v14M5 12h14"/>'}</svg>
            <span>${inList ? "En tu lista" : "Agregar"}</span>
          </button>
          
          <button class="btn-icon-action" id="pdfBtn" title="Ver Ficha Técnica PDF">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
          </button>

          <button class="btn-icon-action" id="videoBtn" title="Ver Video Demostrativo">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect>
              <line x1="7" y1="2" x2="7" y2="22"></line><line x1="17" y1="2" x2="17" y2="22"></line>
              <line x1="2" y1="12" x2="22" y2="12"></line><line x1="2" y1="7" x2="7" y2="7"></line>
              <line x1="2" y1="17" x2="7" y2="17"></line><line x1="17" y1="17" x2="22" y2="17"></line>
              <line x1="17" y1="7" x2="22" y2="7"></line>
            </svg>
          </button>

        </div>
      </div>`;

    detailPanel.querySelector("#addBtn").addEventListener("click", (e) => toggleInterest(p.code, e.currentTarget));
    detailPanel.querySelector("#detailCloseBtn").addEventListener("click", closeDetail);
    
    detailPanel.querySelector("#pdfBtn").addEventListener("click", () => {
      pdfFrame.src = `pdf/${p.code}.pdf`;
      pdfOverlay.classList.add("open");
    });

    detailPanel.querySelector("#videoBtn").addEventListener("click", () => {
      videoPlayer.src = `video/${p.code}.mp4`;
      videoOverlay.classList.add("open");
      videoPlayer.play();
    });

    detailOverlay.classList.add("open");
    detailOverlay.setAttribute("aria-hidden", "false");
  }

  function closeDetail(){
    detailOverlay.classList.remove("open");
    detailOverlay.setAttribute("aria-hidden", "true");
  }

  document.getElementById("pdfClose").addEventListener("click", () => {
    pdfOverlay.classList.remove("open");
    setTimeout(() => pdfFrame.src = "", 300); 
  });

  document.getElementById("videoClose").addEventListener("click", () => {
    videoOverlay.classList.remove("open");
    videoPlayer.pause();
    setTimeout(() => videoPlayer.src = "", 300);
    videoOverlay.classList.remove("cinema-mode"); 
  });

  document.getElementById("cinemaToggle").addEventListener("click", () => {
    videoOverlay.classList.toggle("cinema-mode");
  });

  detailOverlay.addEventListener("click", (e) => { if (e.target === detailOverlay) closeDetail(); });
  pdfOverlay.addEventListener("click", (e) => { if (e.target === pdfOverlay) document.getElementById("pdfClose").click(); });
  videoOverlay.addEventListener("click", (e) => { if (e.target === videoOverlay) document.getElementById("videoClose").click(); });
  function closeDetail(){
    detailOverlay.classList.remove("open");
    detailOverlay.setAttribute("aria-hidden", "true");
  }
  detailOverlay.addEventListener("click", (e) => { if (e.target === detailOverlay) closeDetail(); });

  const listBadge = document.getElementById("listBadge");
  const drawer = document.getElementById("drawer");
  const drawerBackdrop = document.getElementById("drawerBackdrop");
  const drawerList = document.getElementById("drawerList");
  const drawerCount = document.getElementById("drawerCount");

  function toggleInterest(code, btnEl){
    const idx = state.interest.indexOf(code);
    if (idx === -1) state.interest.push(code); else state.interest.splice(idx, 1);
    updateListBadge(); renderDrawer();
    if (btnEl){
      const added = state.interest.includes(code);
      btnEl.dataset.added = String(added);
      btnEl.querySelector("span").textContent = added ? "En tu lista" : "Agregar a mi lista";
      btnEl.querySelector("svg").innerHTML = added ? '<path d="M5 13l4 4L19 7"/>' : '<path d="M12 5v14M5 12h14"/>';
    }
  }

  function updateListBadge(){
    const n = state.interest.length;
    listBadge.textContent = String(n); listBadge.dataset.empty = String(n === 0);
    listBadge.classList.remove("pulse"); void listBadge.offsetWidth; listBadge.classList.add("pulse");
  }

  function renderDrawer(){
    drawerCount.textContent = state.interest.length + (state.interest.length === 1 ? " producto" : " productos");
    if (state.interest.length === 0){
      drawerList.innerHTML = `<div class="drawer-empty">Toca "Agregar a mi lista" en cualquier producto para guardarlo aquí.</div>`;
      return;
    }
    drawerList.innerHTML = "";
    state.interest.forEach(code => {
      const p = byCode(code);
      const row = document.createElement("div"); row.className = "drawer-item";
      
      row.innerHTML = `
        <div class="drawer-item-icon" style="background:var(--cat-${p.cat}-soft); color:var(--cat-${p.cat})">
          <img src="assets/${p.code}.png" alt="${p.name}" style="max-width: 80%; max-height: 80%; object-fit: contain;">
        </div>
        <div>
          <div class="drawer-item-name">${p.name}</div>
          <div class="drawer-item-price">${money(p.price)}</div>
        </div>
        <button class="drawer-item-remove" aria-label="Quitar ${p.name}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg></button>`;
      row.querySelector(".drawer-item-remove").addEventListener("click", () => toggleInterest(code, null));
      drawerList.appendChild(row);
    });
  }

  function openDrawer(){ drawer.classList.add("open"); drawerBackdrop.classList.add("open"); }
  function closeDrawer(){ drawer.classList.remove("open"); drawerBackdrop.classList.remove("open"); }

  document.getElementById("listToggle").addEventListener("click", openDrawer);
  document.getElementById("drawerClose").addEventListener("click", closeDrawer);
  drawerBackdrop.addEventListener("click", closeDrawer);
  document.getElementById("clearBtn").addEventListener("click", () => { state.interest = []; updateListBadge(); renderDrawer(); });
  document.getElementById("printBtn").addEventListener("click", () => window.print());

  const themeToggle = document.getElementById("themeToggle");
  function setTheme(mode){ document.documentElement.setAttribute("data-theme", mode); }
  themeToggle.addEventListener("click", () => {
    const next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
    if (document.startViewTransition) document.startViewTransition(() => setTheme(next)); else setTheme(next);
  });

  document.getElementById("resetBtn").addEventListener("click", () => {
    state = { view: state.view, category:"todos", query:"", interest:[] };
    document.getElementById("searchInput").value = "";
    updateListBadge(); renderDrawer(); renderFilters(); renderGrid();
    closeDetail(); closeDrawer(); panel.classList.remove('open');
    modelViewer.cameraTarget = "auto auto auto"; modelViewer.cameraOrbit = "0deg 75deg 105%"; modelViewer.autoRotate = true;
  });

  renderFilters(); renderGrid(); renderDrawer(); updateListBadge();
})();