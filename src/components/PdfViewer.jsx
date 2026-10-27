import React, { useState, useEffect, useRef, useCallback } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { AlertCircle, RefreshCw } from 'lucide-react';

// Configurar worker de PDF.js local para funcionamiento 100% offline
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdfjs/pdf.worker.min.js';
}

export default function PdfViewer({ src, title }) {
  const [pdfDoc, setPdfDoc] = useState(null);
  const [numPages, setNumPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estados de transformación espacial (GPU Matrix / Estilo 3D)
  const [zoom, setZoom] = useState(1.0);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [showBadge, setShowBadge] = useState(false);
  const [isGesturing, setIsGesturing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const containerRef = useRef(null);
  const pagesContainerRef = useRef(null);
  const renderTasksRef = useRef({});
  const baseScalesRef = useRef({});
  const docDimensionsRef = useRef({ width: 0, height: 0 });
  const zoomRef = useRef(1.0);
  const panRef = useRef({ x: 0, y: 0 });

  const badgeTimeoutRef = useRef(null);
  const animFrameRef = useRef(null);
  const renderDebounceRef = useRef(null);
  const gestureTimeoutRef = useRef(null);

  // Referencias para interacción con ratón
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0, panX: 0, panY: 0 });

  // Referencias para interacción táctil
  const isPinchingRef = useRef(false);
  const pinchStartDistRef = useRef(0);
  const pinchStartZoomRef = useRef(1.0);
  const lastTapRef = useRef(null);

  // Mantener zoomRef y panRef sincronizados
  useEffect(() => {
    zoomRef.current = zoom;
  }, [zoom]);

  useEffect(() => {
    panRef.current = pan;
  }, [pan]);

  // Indicador HUD de nivel de zoom (se desvanece tras 1.2s)
  const triggerBadge = useCallback((currentZoom) => {
    setShowBadge(true);
    if (badgeTimeoutRef.current) clearTimeout(badgeTimeoutRef.current);
    badgeTimeoutRef.current = setTimeout(() => {
      setShowBadge(false);
    }, 1200);
  }, []);

  /**
   * Cálculo de límites (Bounding Box Clamping):
   * Si el documento cabe en el visor, se mantiene ESTRICTAMENTE CENTRADO (sin deriva lateral ni vacíos).
   * Si desborda, permite paneo libre pero acotado a los márgenes del documento.
   */
  const getClampedPan = useCallback((targetX, targetY, currentZoom) => {
    const viewport = pagesContainerRef.current;
    if (!viewport) return { x: targetX, y: targetY };

    const vw = viewport.clientWidth;
    const vh = viewport.clientHeight;
    const docW = docDimensionsRef.current.width || 600;
    const docH = docDimensionsRef.current.height || 850;

    const scaledW = docW * currentZoom;
    const scaledH = docH * currentZoom;

    let clampedX = targetX;
    let clampedY = targetY;

    // Horizontal (X)
    if (scaledW <= vw) {
      // Siempre centrado exactamente en el eje X
      clampedX = (vw - scaledW) / 2;
    } else {
      const margin = 24;
      const minX = vw - scaledW - margin;
      const maxX = margin;
      clampedX = Math.max(minX, Math.min(maxX, targetX));
    }

    // Vertical (Y)
    if (scaledH <= vh) {
      clampedY = (vh - scaledH) / 2;
    } else {
      const margin = 24;
      const minY = vh - scaledH - margin;
      const maxY = margin;
      clampedY = Math.max(minY, Math.min(maxY, targetY));
    }

    return { x: clampedX, y: clampedY };
  }, []);

  /**
   * Zoom Focal Matemático (Focal-Point Zoom):
   * Conserva el punto (screenX, screenY) inmóvil bajo el cursor o entre los dedos.
   */
  const zoomAtPoint = useCallback(
    (targetZoom, screenX, screenY) => {
      const viewport = pagesContainerRef.current;
      if (!viewport) return;

      const clampedZoom = Math.max(1.0, Math.min(3.5, targetZoom));
      const oldZoom = zoomRef.current;
      if (Math.abs(clampedZoom - oldZoom) < 0.001) return;

      const vRect = viewport.getBoundingClientRect();
      const fx = screenX !== undefined && screenX !== null ? screenX - vRect.left : vRect.width / 2;
      const fy = screenY !== undefined && screenY !== null ? screenY - vRect.top : vRect.height / 2;

      const currentPan = panRef.current;
      const ratio = clampedZoom / oldZoom;

      const newPanX = fx - (fx - currentPan.x) * ratio;
      const newPanY = fy - (fy - currentPan.y) * ratio;

      const clampedPan = getClampedPan(newPanX, newPanY, clampedZoom);

      zoomRef.current = clampedZoom;
      panRef.current = clampedPan;

      setZoom(clampedZoom);
      setPan(clampedPan);
      triggerBadge(clampedZoom);
    },
    [getClampedPan, triggerBadge]
  );

  /**
   * Animación fluida de Zoom (Estilo 3D / Cámara centrada):
   * Al hacer doble clic/toque, enfoca y centra la zona clickeada suavemente en pantalla.
   */
  const animateZoomTo = useCallback(
    (targetZoom, screenX, screenY, centerTarget = false, duration = 260) => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      const viewport = pagesContainerRef.current;
      if (!viewport) return;

      const vRect = viewport.getBoundingClientRect();
      const startZoom = zoomRef.current;
      const startPan = { ...panRef.current };
      const clampedTargetZoom = Math.max(1.0, Math.min(3.5, targetZoom));

      let endPan;
      if (clampedTargetZoom <= 1.05) {
        // Regresar a la vista general centrada
        const docW = docDimensionsRef.current.width || 600;
        const docH = docDimensionsRef.current.height || 850;
        endPan = getClampedPan((vRect.width - docW) / 2, (vRect.height - docH) / 2, 1.0);
      } else if (centerTarget) {
        // Centrar suavemente el punto cliqueado en el visor (estilo 3D)
        const fx = screenX !== undefined && screenX !== null ? screenX - vRect.left : vRect.width / 2;
        const fy = screenY !== undefined && screenY !== null ? screenY - vRect.top : vRect.height / 2;
        const docX = (fx - startPan.x) / startZoom;
        const docY = (fy - startPan.y) / startZoom;
        const desiredPanX = vRect.width / 2 - docX * clampedTargetZoom;
        const desiredPanY = vRect.height / 2 - docY * clampedTargetZoom;
        endPan = getClampedPan(desiredPanX, desiredPanY, clampedTargetZoom);
      } else {
        const fx = screenX !== undefined && screenX !== null ? screenX - vRect.left : vRect.width / 2;
        const fy = screenY !== undefined && screenY !== null ? screenY - vRect.top : vRect.height / 2;
        const ratio = clampedTargetZoom / startZoom;
        const rawPanX = fx - (fx - startPan.x) * ratio;
        const rawPanY = fy - (fy - startPan.y) * ratio;
        endPan = getClampedPan(rawPanX, rawPanY, clampedTargetZoom);
      }

      const startTime = performance.now();
      setIsGesturing(true);

      const step = (now) => {
        const elapsed = now - startTime;
        const progress = Math.min(1, elapsed / duration);
        // Easing cúbico suave: f(t) = 1 - (1 - t)^3
        const ease = 1 - Math.pow(1 - progress, 3);

        const currentZ = startZoom + (clampedTargetZoom - startZoom) * ease;
        const currentPanX = startPan.x + (endPan.x - startPan.x) * ease;
        const currentPanY = startPan.y + (endPan.y - startPan.y) * ease;

        zoomRef.current = currentZ;
        panRef.current = { x: currentPanX, y: currentPanY };
        setZoom(currentZ);
        setPan({ x: currentPanX, y: currentPanY });

        if (progress < 1) {
          animFrameRef.current = requestAnimationFrame(step);
        } else {
          animFrameRef.current = null;
          setIsGesturing(false);
          triggerBadge(clampedTargetZoom);
        }
      };

      animFrameRef.current = requestAnimationFrame(step);
    },
    [getClampedPan, triggerBadge]
  );

  // Cargar documento PDF
  const loadDocument = useCallback(async () => {
    if (!src) return;
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    setLoading(true);
    setError(null);
    setZoom(1.0);
    zoomRef.current = 1.0;
    setPan({ x: 0, y: 0 });
    panRef.current = { x: 0, y: 0 };
    setShowBadge(false);
    setIsGesturing(false);
    baseScalesRef.current = {};

    try {
      const cleanSrc = src.split('#')[0];
      const loadingTask = pdfjsLib.getDocument({
        url: cleanSrc,
        cMapUrl: '/pdfjs/cmaps/',
        cMapPacked: true,
        isEvalSupported: false,
        enableXfa: false,
        stopAtErrors: true
      });

      const doc = await loadingTask.promise;
      setPdfDoc(doc);
      setNumPages(doc.numPages);
      setLoading(false);
    } catch (err) {
      console.error('[PdfViewer] Error cargando PDF:', err);
      setError(err.message || 'No se pudo cargar el archivo PDF.');
      setLoading(false);
    }
  }, [src]);

  useEffect(() => {
    loadDocument();
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      Object.values(renderTasksRef.current).forEach((task) => {
        if (task && typeof task.cancel === 'function') {
          task.cancel();
        }
      });
      renderTasksRef.current = {};
      if (badgeTimeoutRef.current) clearTimeout(badgeTimeoutRef.current);
      if (renderDebounceRef.current) clearTimeout(renderDebounceRef.current);
      if (gestureTimeoutRef.current) clearTimeout(gestureTimeoutRef.current);
    };
  }, [loadDocument]);

  /**
   * Renderizado Offscreen con doble búfer (Zero-Flicker):
   * Dibuja primero en memoria y vuelca instantáneamente al canvas visible.
   */
  const renderPage = useCallback(
    async (pageNumber, canvas, containerWidth, containerHeight, targetZoom) => {
      if (!pdfDoc || !canvas) return;

      try {
        if (renderTasksRef.current[pageNumber]) {
          renderTasksRef.current[pageNumber].cancel();
          renderTasksRef.current[pageNumber] = null;
        }

        const page = await pdfDoc.getPage(pageNumber);
        const unscaledViewport = page.getViewport({ scale: 1, rotation: 0 });

        const cWidth = containerWidth || (pagesContainerRef.current ? pagesContainerRef.current.clientWidth : window.innerWidth);
        const cHeight = containerHeight || (pagesContainerRef.current ? pagesContainerRef.current.clientHeight : (window.innerHeight - 64));

        const isMobileOrPortrait = cWidth < 768 || cWidth <= cHeight;

        let baseScale;
        if (isMobileOrPortrait) {
          const safeWidth = Math.max(cWidth - 28, 280);
          baseScale = safeWidth / unscaledViewport.width;
        } else {
          const safeHeight = Math.max(cHeight - 48, 360);
          const safeWidth = Math.max(cWidth - 64, 400);
          const scaleByHeight = safeHeight / unscaledViewport.height;
          const scaleByWidth = safeWidth / unscaledViewport.width;
          baseScale = Math.min(scaleByHeight, scaleByWidth);
        }

        baseScale = Math.max(baseScale, 0.35);

        const baseWidth = Math.floor(unscaledViewport.width * baseScale);
        const baseHeight = Math.floor(unscaledViewport.height * baseScale);

        baseScalesRef.current[pageNumber] = {
          baseWidth,
          baseHeight,
          baseScale,
          unscaledViewport,
        };

        docDimensionsRef.current = {
          width: baseWidth,
          height: numPages * baseHeight + (numPages - 1) * 24,
        };

        const pixelRatio = Math.min(window.devicePixelRatio || 1, 2.5);
        const currentZ = targetZoom || zoomRef.current || 1.0;
        const internalScale = baseScale * pixelRatio * Math.min(2.5, currentZ);
        const viewport = page.getViewport({ scale: internalScale, rotation: 0 });

        // Crear búfer offscreen en memoria
        const offscreen = document.createElement('canvas');
        offscreen.width = Math.floor(viewport.width);
        offscreen.height = Math.floor(viewport.height);
        const offCtx = offscreen.getContext('2d', { alpha: false });
        offCtx.fillStyle = '#FFFFFF';
        offCtx.fillRect(0, 0, offscreen.width, offscreen.height);

        const renderContext = {
          canvasContext: offCtx,
          viewport: viewport,
        };

        const renderTask = page.render(renderContext);
        renderTasksRef.current[pageNumber] = renderTask;

        await renderTask.promise;
        renderTasksRef.current[pageNumber] = null;

        canvas.width = offscreen.width;
        canvas.height = offscreen.height;
        canvas.style.width = `${baseWidth}px`;
        canvas.style.height = `${baseHeight}px`;
        canvas.style.backgroundColor = '#FFFFFF';

        const ctx = canvas.getContext('2d', { alpha: false });
        ctx.drawImage(offscreen, 0, 0);

        // Si es la carga inicial (pan 0,0), centrar el documento de inmediato
        if (panRef.current.x === 0 && panRef.current.y === 0 && pagesContainerRef.current) {
          const vw = pagesContainerRef.current.clientWidth;
          const vh = pagesContainerRef.current.clientHeight;
          const initialPan = getClampedPan((vw - baseWidth) / 2, (vh - docDimensionsRef.current.height) / 2, 1.0);
          panRef.current = initialPan;
          setPan(initialPan);
        }
      } catch (err) {
        if (err && err.name !== 'RenderingCancelledException') {
          console.warn(`[PdfViewer] Error en página ${pageNumber}:`, err);
        }
      }
    },
    [pdfDoc, numPages, getClampedPan]
  );

  // Re-renderizar páginas cuando cambien las dimensiones base del contenedor
  const updatePages = useCallback(() => {
    if (!pdfDoc || !pagesContainerRef.current) return;
    const cWidth = pagesContainerRef.current.clientWidth;
    const cHeight = pagesContainerRef.current.clientHeight;
    if (cWidth <= 0 || cHeight <= 0) return;

    for (let i = 1; i <= numPages; i++) {
      const canvas = document.getElementById(`pdf-page-canvas-${i}`);
      if (canvas) {
        renderPage(i, canvas, cWidth, cHeight, zoomRef.current);
      }
    }
  }, [pdfDoc, numPages, renderPage]);

  // Re-renderizado de alta fidelidad nítida diferido silencioso tras cambiar el zoom
  useEffect(() => {
    if (!pdfDoc) return;
    if (renderDebounceRef.current) clearTimeout(renderDebounceRef.current);
    renderDebounceRef.current = setTimeout(() => {
      if (!pagesContainerRef.current) return;
      const cWidth = pagesContainerRef.current.clientWidth;
      const cHeight = pagesContainerRef.current.clientHeight;
      for (let i = 1; i <= numPages; i++) {
        const canvas = document.getElementById(`pdf-page-canvas-${i}`);
        if (canvas) {
          renderPage(i, canvas, cWidth, cHeight, zoom);
        }
      }
    }, 280);

    return () => {
      if (renderDebounceRef.current) clearTimeout(renderDebounceRef.current);
    };
  }, [zoom, pdfDoc, numPages, renderPage]);

  // Observador de redimensionamiento automático
  useEffect(() => {
    if (!pagesContainerRef.current) return;

    let rAFId = null;
    const handleResize = () => {
      if (rAFId) cancelAnimationFrame(rAFId);
      rAFId = requestAnimationFrame(() => {
        updatePages();
        const clamped = getClampedPan(panRef.current.x, panRef.current.y, zoomRef.current);
        panRef.current = clamped;
        setPan(clamped);
      });
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(pagesContainerRef.current);

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    return () => {
      if (rAFId) cancelAnimationFrame(rAFId);
      resizeObserver.disconnect();
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, [updatePages, getClampedPan]);

  // Rueda de ratón en PC: Ctrl+Wheel / Trackpad pinch para zoom, Wheel normal para scroll vertical
  useEffect(() => {
    const viewport = pagesContainerRef.current;
    if (!viewport) return;

    const handleWheel = (e) => {
      e.preventDefault();
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);

      if (e.ctrlKey || e.metaKey) {
        // Zoom focal continuo
        setIsGesturing(true);
        const delta = -e.deltaY;
        const factor = delta > 0 ? 1.14 : 0.88;
        zoomAtPoint(zoomRef.current * factor, e.clientX, e.clientY);

        if (gestureTimeoutRef.current) clearTimeout(gestureTimeoutRef.current);
        gestureTimeoutRef.current = setTimeout(() => {
          setIsGesturing(false);
        }, 180);
      } else {
        // Desplazamiento vertical fluido entre páginas
        const newY = panRef.current.y - e.deltaY;
        const clamped = getClampedPan(panRef.current.x, newY, zoomRef.current);
        panRef.current = clamped;
        setPan(clamped);
      }
    };

    viewport.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      viewport.removeEventListener('wheel', handleWheel);
    };
  }, [zoomAtPoint, getClampedPan]);

  // Gestos táctiles en móvil/APK: Pinch-to-zoom y Double-tap to zoom
  const handleTouchStart = (e) => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);

    if (e.touches.length === 1) {
      const touch = e.touches[0];
      const now = Date.now();
      const lastTap = lastTapRef.current;

      if (lastTap && now - lastTap.time < 320) {
        const dist = Math.hypot(touch.clientX - lastTap.x, touch.clientY - lastTap.y);
        if (dist < 30) {
          // Doble toque: animación centrada suave (estilo 3D)
          e.preventDefault();
          const nextZoom = zoomRef.current > 1.15 ? 1.0 : 2.2;
          animateZoomTo(nextZoom, touch.clientX, touch.clientY, true, 260);
          lastTapRef.current = null;
          return;
        }
      }
      lastTapRef.current = { time: now, x: touch.clientX, y: touch.clientY };

      isDraggingRef.current = true;
      setIsDragging(true);
      dragStartRef.current = {
        x: touch.clientX,
        y: touch.clientY,
        panX: panRef.current.x,
        panY: panRef.current.y,
      };
    } else if (e.touches.length === 2) {
      // Iniciar pellizco de dos dedos
      isDraggingRef.current = false;
      setIsDragging(false);
      isPinchingRef.current = true;
      setIsGesturing(true);

      const t0 = e.touches[0];
      const t1 = e.touches[1];
      const dist = Math.hypot(t0.clientX - t1.clientX, t0.clientY - t1.clientY);

      pinchStartDistRef.current = dist;
      pinchStartZoomRef.current = zoomRef.current;
    }
  };

  const handleTouchMove = (e) => {
    if (e.touches.length === 1 && isDraggingRef.current) {
      // Paneo con 1 dedo
      const touch = e.touches[0];
      const dx = touch.clientX - dragStartRef.current.x;
      const dy = touch.clientY - dragStartRef.current.y;
      const nextPan = getClampedPan(
        dragStartRef.current.panX + dx,
        dragStartRef.current.panY + dy,
        zoomRef.current
      );
      panRef.current = nextPan;
      setPan(nextPan);
    } else if (e.touches.length === 2 && isPinchingRef.current) {
      // Pellizco focal con 2 dedos
      e.preventDefault();
      const t0 = e.touches[0];
      const t1 = e.touches[1];
      const dist = Math.hypot(t0.clientX - t1.clientX, t0.clientY - t1.clientY);
      const midX = (t0.clientX + t1.clientX) / 2;
      const midY = (t0.clientY + t1.clientY) / 2;

      if (pinchStartDistRef.current > 0) {
        const factor = dist / pinchStartDistRef.current;
        const targetZoom = Math.max(1.0, Math.min(3.5, pinchStartZoomRef.current * factor));
        zoomAtPoint(targetZoom, midX, midY);
      }
    }
  };

  const handleTouchEnd = (e) => {
    if (isPinchingRef.current && e.touches.length < 2) {
      isPinchingRef.current = false;
      setIsGesturing(false);
      if (zoomRef.current < 1.08) {
        animateZoomTo(1.0, null, null, false, 200);
      }
    }
    if (e.touches.length === 0) {
      isDraggingRef.current = false;
      setIsDragging(false);
      setIsGesturing(false);
    }
  };

  // Doble clic con ratón: enfoca y centra la zona clickeada en la pantalla
  const handleDoubleClick = (e) => {
    e.preventDefault();
    const nextZoom = zoomRef.current > 1.15 ? 1.0 : 2.2;
    animateZoomTo(nextZoom, e.clientX, e.clientY, true, 260);
  };

  // Arrastre con ratón para paneo en PC
  const handleMouseDown = (e) => {
    if (e.button !== 0) return;
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);

    isDraggingRef.current = true;
    setIsDragging(true);
    setIsGesturing(true);
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      panX: panRef.current.x,
      panY: panRef.current.y,
    };
  };

  const handleMouseMove = (e) => {
    if (!isDraggingRef.current) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    const nextPan = getClampedPan(
      dragStartRef.current.panX + dx,
      dragStartRef.current.panY + dy,
      zoomRef.current
    );
    panRef.current = nextPan;
    setPan(nextPan);
  };

  const handleMouseUp = () => {
    if (isDraggingRef.current) {
      isDraggingRef.current = false;
      setIsDragging(false);
      setIsGesturing(false);
    }
  };

  return (
    <div className="pdf-viewer-root" ref={containerRef}>
      {/* Contenedor principal con gestión de gestos estilo 3D */}
      <div
        className="pdf-scroll-viewport"
        ref={pagesContainerRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onDoubleClick={handleDoubleClick}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {loading && (
          <div className="pdf-loading-state">
            <div className="pdf-spinner" />
            <p className="pdf-loading-title">Cargando Ficha Técnica...</p>
            <span className="pdf-loading-subtitle">{title || 'Documento Médico Tynor'}</span>
          </div>
        )}

        {error && (
          <div className="pdf-error-state">
            <AlertCircle size={44} color="#EF4444" />
            <p className="pdf-error-title">No se pudo visualizar el PDF</p>
            <span className="pdf-error-desc">{error}</span>
            <button type="button" className="pdf-retry-btn" onClick={loadDocument}>
              <RefreshCw size={18} />
              <span>Reintentar</span>
            </button>
          </div>
        )}

        {!loading && !error && (
          <div
            className={`pdf-viewport-stage ${isDragging ? 'is-dragging' : ''}`}
            style={{
              transform: `translate3d(${pan.x}px, ${pan.y}px, 0px) scale(${zoom})`,
              transformOrigin: '0 0',
            }}
          >
            {Array.from({ length: numPages }, (_, idx) => idx + 1).map((pageNum) => (
              <div
                key={pageNum}
                id={`pdf-page-card-${pageNum}`}
                className="pdf-page-card"
              >
                <div className="pdf-canvas-wrap">
                  <canvas
                    id={`pdf-page-canvas-${pageNum}`}
                    ref={(canvasNode) => {
                      if (canvasNode && pagesContainerRef.current) {
                        const w = pagesContainerRef.current.clientWidth;
                        const h = pagesContainerRef.current.clientHeight;
                        renderPage(pageNum, canvasNode, w, h, zoomRef.current);
                      }
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Indicador HUD de Zoom: Sutil, no interactivo, sin botones (se desvanece solo) */}
      <div
        className={`pdf-zoom-badge ${showBadge ? 'visible' : ''}`}
        aria-hidden="true"
      >
        {Math.round(zoom * 100)}%
      </div>
    </div>
  );
}
