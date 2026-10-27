import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  Touchpad,
  Sparkles,
  Activity,
  ArrowRight,
  CheckCircle2,
  X,
  Layers,
  User,
  HeartPulse,
  Maximize2,
  Eye,
  Bone,
  Scan,
  Shield
} from 'lucide-react';
import { PRODUCTS, BODY_PARTS } from '../data/products';

const STEP_DURATION_MS = 7500; // 7.5 segundos por articulación anatómica en el tour

export default function AttractMode({
  onDismiss,
  theme,
  onSelectProduct,
  onGoToAnatomy,
  onGoToCatalog
}) {
  const [tourIndex, setTourIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [viewMode, setViewMode] = useState('body'); // 'body' | 'skeleton'
  const [isTransforming, setIsTransforming] = useState(false);
  const [activeProductIndex, setActiveProductIndex] = useState(0);

  const modelRef = useRef(null);
  const timerRef = useRef(null);
  const productTimerRef = useRef(null);

  // 8 Estaciones cinemáticas del Tour 3D por articulaciones clave
  const TOUR_STOPS = useMemo(() => [
    {
      id: 'rodilla',
      partId: 'rodilla',
      stepNum: 1,
      title: 'Rodilla y Rótula',
      subtitle: 'Articulación Femorotibial y Complejo Ligamentoso',
      desc: 'Soportes de compresión graduada 3D, estabilizadores rotulianos y bisagras policéntricas ROM.',
      featuredCodes: ['D09', 'D10', 'D05', '101'],
      target: '0.08m 0.49m 0.10m',
      orbit: '10deg 80deg 0.72m',
      tag: 'CONTROL ROM & ESTABILIDAD'
    },
    {
      id: 'codo',
      partId: 'codo',
      stepNum: 2,
      title: 'Codo y Articulación Cubital',
      subtitle: 'Manejo de Epicondilitis, Bursitis y Tendinitis',
      desc: 'Coderas mecánicas graduables ROM, bandas de descarga de tendón y compresión deportiva Air Pro.',
      featuredCodes: ['E46', 'E10', '303', 'E11'],
      target: '0.32m 1.02m 0.04m',
      orbit: '50deg 75deg 0.65m',
      tag: 'ALIVIO EPICONDILITIS'
    },
    {
      id: 'cuello',
      partId: 'cuello',
      stepNum: 3,
      title: 'Cuello y Columna Cervical',
      subtitle: 'Vértebras C1-C7 y Soporte Mentoniano',
      desc: 'Inmovilización anatómica post-traumática, tracción cervical para puerta y control de latigazo.',
      featuredCodes: ['B01', 'B05', 'G25', 'B31'],
      target: '0m 1.35m 0.07m',
      orbit: '0deg 78deg 0.64m',
      tag: 'INMOVILIZACIÓN CLÍNICA'
    },
    {
      id: 'espalda',
      partId: 'espalda',
      stepNum: 4,
      title: 'Espalda y Columna Lumbar',
      subtitle: 'Región Lumbosacra L1-S1 y Corrección Dorsal',
      desc: 'Fajas sacrolumbares de doble tensión con varillas moldeables, corsets rígidos y correctores posturales.',
      featuredCodes: ['A01', 'A04', 'A12', 'A33'],
      target: '0m 0.96m -0.09m',
      orbit: '180deg 85deg 0.85m',
      tag: 'DESCOMPRESIÓN DISCAL'
    },
    {
      id: 'mano',
      partId: 'mano',
      stepNum: 5,
      title: 'Muñeca, Mano y Falanges',
      subtitle: 'Aparato Flexo-Extensor y Metacarpianos',
      desc: 'Férulas maleables de aluminio tipo catre/rana/martillo, muñequeras con abducción y Quervain.',
      featuredCodes: ['E05', 'F02', 'F04', 'F06'],
      target: '0.38m 0.82m 0.06m',
      orbit: '55deg 80deg 0.62m',
      tag: 'FÉRULAS & REHABILITACIÓN'
    },
    {
      id: 'pie',
      partId: 'pie',
      stepNum: 6,
      title: 'Pie, Talón y Soporte Plantar',
      subtitle: 'Bóveda Plantar, Calcáneo y Podología',
      desc: 'Plantillas viscoelásticas de silicón grado médico, taloneras para espolón y férulas Hallux Valgus.',
      featuredCodes: ['K01', 'K02', 'K14', 'K08'],
      target: '0.08m 0.03m 0.14m',
      orbit: '15deg 82deg 0.58m',
      tag: 'PODOLOGÍA DE PRECISIÓN'
    },
    {
      id: 'abdomen',
      partId: 'abdomen',
      stepNum: 7,
      title: 'Abdomen, Tórax y Maternidad',
      subtitle: 'Pared Abdominal, Cinturón Torácico e Inguinal',
      desc: 'Soportes de contención abdominal postquirúrgica, fajas maternales evolutivas y sujeción torácica.',
      featuredCodes: ['A01', 'A35', 'A09', '406'],
      target: '0m 0.98m 0.12m',
      orbit: '0deg 80deg 0.78m',
      tag: 'SOPORTE POSTQUIRÚRGICO'
    },
    {
      id: 'biomecanica_global',
      partId: 'rodilla',
      stepNum: 8,
      title: 'Biomecánica Global y 360°',
      subtitle: 'Inspección Integral de Articulaciones y Órtesis',
      desc: 'Visualización fluida de la cinemática articular y adaptación ergonómica de soluciones ortopédicas Tynor.',
      featuredCodes: ['D10', 'E46', 'A12', 'B05'],
      target: 'auto auto auto',
      orbit: '0deg 75deg 105%',
      tag: 'PANORÁMICA 360° INTEGRAL'
    }
  ], []);

  const currentStop = TOUR_STOPS[tourIndex] || TOUR_STOPS[0];

  // Productos asignados a la parada actual
  const currentStopProducts = useMemo(() => {
    // Primero los destacados de la parada
    const featured = currentStop.featuredCodes
      .map((code) => PRODUCTS.find((p) => p.code === code))
      .filter(Boolean);
    
    // Luego completamos con los demás de la zona anatómica
    const otherInZone = PRODUCTS.filter(
      (p) => (p.bodyPart === currentStop.partId) && !currentStop.featuredCodes.includes(p.code)
    );
    return [...featured, ...otherInZone];
  }, [currentStop]);

  // Selección automática cíclica de producto dentro de la estación activa
  useEffect(() => {
    setActiveProductIndex(0);
    if (productTimerRef.current) clearInterval(productTimerRef.current);

    productTimerRef.current = setInterval(() => {
      setActiveProductIndex((prev) => {
        const topCount = Math.min(4, currentStopProducts.length);
        if (topCount <= 1) return 0;
        return (prev + 1) % topCount;
      });
    }, 2400);

    return () => {
      if (productTimerRef.current) clearInterval(productTimerRef.current);
    };
  }, [currentStopProducts]);

  // Aplicar cinemática de cámara 3D en cada cambio de estación
  const applyCameraToStop = useCallback((stop) => {
    if (!modelRef.current) return;
    const model = modelRef.current;

    if (stop.target) {
      model.cameraTarget = stop.target;
    }
    if (stop.orbit) {
      model.cameraOrbit = stop.orbit;
    }
    // Si es vista global, activar rotación automática lenta
    model.autoRotate = (stop.id === 'biomecanica_global');
  }, []);

  useEffect(() => {
    applyCameraToStop(currentStop);
  }, [currentStop, applyCameraToStop]);

  const nextStop = useCallback(() => {
    setTourIndex((prev) => (prev + 1) % TOUR_STOPS.length);
  }, [TOUR_STOPS.length]);

  const prevStop = useCallback(() => {
    setTourIndex((prev) => (prev - 1 + TOUR_STOPS.length) % TOUR_STOPS.length);
  }, [TOUR_STOPS.length]);

  const goToStop = (idx) => {
    setTourIndex(idx);
  };

  // Timer del loop de la demostración sin re-renderizados continuos
  useEffect(() => {
    if (isPaused) return;

    timerRef.current = setTimeout(() => {
      nextStop();
    }, STEP_DURATION_MS);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isPaused, tourIndex, nextStop]);

  // Manejo de teclado
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault();
        setIsPaused((p) => !p);
      } else if (e.key === 'ArrowRight') {
        nextStop();
      } else if (e.key === 'ArrowLeft') {
        prevStop();
      } else if (e.key === 'Escape') {
        onDismiss();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextStop, prevStop, onDismiss]);

  const handleToggleLayer = (mode) => {
    if (mode === viewMode || isTransforming) return;
    setIsTransforming(true);
    setTimeout(() => {
      setViewMode(mode);
      setTimeout(() => setIsTransforming(false), 500);
    }, 350);
  };

  return (
    <div
      className="attract-overlay attract-interactive-showroom"
      onClick={onDismiss}
      role="region"
      aria-label="Modo Demostración Autónomo del Cuerpo 3D"
    >
      {/* Fondo dinámico médico con auras */}
      <div className="attract-ambient-backdrop">
        <div className="attract-glow-blob blob-1" />
        <div className="attract-glow-blob blob-2" />
        <div className="attract-grid-pattern" />
      </div>

      {/* Barra superior de navegación y telemetría */}
      <div className="attract-top-bar" onClick={(e) => e.stopPropagation()}>
        <div className="attract-brand-mini">
          <img
            src={theme === 'dark' ? '/assets/logo1.png' : '/assets/logo.png'}
            alt="Tynor"
            className="attract-mini-logo"
          />
          <div className="attract-expo-chip">
            <span className="attract-live-dot" />
            <span className="attract-expo-text">DEMO BIOMECÁNICO 3D • STAND OFICIAL</span>
          </div>
        </div>

        {/* Stepper de las 8 estaciones del tour 3D */}
        <div className="attract-timeline-stepper">
          {TOUR_STOPS.map((stop, idx) => {
            const isActive = tourIndex === idx;
            const isPast = tourIndex > idx;
            return (
              <button
                key={stop.id}
                className={`attract-step-pill ${isActive ? 'active' : ''} ${isPast ? 'completed' : ''}`}
                onClick={() => goToStop(idx)}
                title={`Ver ${stop.title}`}
                aria-label={`Estación ${idx + 1}: ${stop.title}`}
              >
                <div className="attract-step-header">
                  <span className="step-num">#{stop.stepNum}</span>
                  <span className="step-name">{stop.title.split(' ')[0]}</span>
                </div>
                <div className="attract-progress-track">
                  <div
                    key={`step-${tourIndex}-${idx}`}
                    className={`attract-progress-fill ${isActive ? 'animating' : ''} ${isPaused ? 'paused' : ''}`}
                    style={{
                      width: isPast ? '100%' : (!isActive ? '0%' : undefined)
                    }}
                  />
                </div>
              </button>
            );
          })}
        </div>

        {/* Controles de reproducción */}
        <div className="attract-controls-cluster">
          <button
            className="attract-ctrl-btn"
            onClick={prevStop}
            title="Estación anterior (Flecha Izquierda)"
            aria-label="Anterior"
          >
            <ChevronLeft size={20} />
          </button>

          <button
            className={`attract-ctrl-btn ${isPaused ? 'paused' : ''}`}
            onClick={() => setIsPaused(!isPaused)}
            title={isPaused ? 'Reanudar tour automático (Espacio)' : 'Pausar tour (Espacio)'}
            aria-label={isPaused ? 'Reanudar' : 'Pausar'}
          >
            {isPaused ? <Play size={18} fill="currentColor" /> : <Pause size={18} />}
          </button>

          <button
            className="attract-ctrl-btn"
            onClick={nextStop}
            title="Siguiente estación (Flecha Derecha)"
            aria-label="Siguiente"
          >
            <ChevronRight size={20} />
          </button>

          <button
            className="attract-exit-pill-btn"
            onClick={onDismiss}
            title="Toca para interactuar libremente con el catálogo"
          >
            <span>Salir</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {/* Escenario Principal: 3D Central con Selección Dinámica de Productos */}
      <div className="attract-stage-viewport">
        <div className="attract-slide-scene scene-3d-tour" onClick={(e) => e.stopPropagation()}>
          
          {/* Columna Izquierda: Visor 3D Interactivo con Hotspots */}
          <div className="demo-3d-col">
            <div className="demo-3d-viewport-wrapper">
              <model-viewer
                ref={modelRef}
                src={viewMode === 'body' ? '/assets/Model_Human.glb' : '/assets/Model_Skeleton.glb'}
                alt="Modelo Anatómico 3D Tynor en Demostración"
                environment-image="neutral"
                tone-mapping="neutral"
                shadow-intensity="0"
                shadow-softness="0"
                interpolation-decay="200"
                min-scale="0.5"
                power-preference="low-power"
                camera-controls
                interaction-prompt="none"
                loading="eager"
                reveal="auto"
                bounds="tight"
                camera-orbit={currentStop.orbit}
                camera-target={currentStop.target}
                className={`demo-model-viewer ${isTransforming ? 'transforming-xray' : ''}`}
                style={{ width: '100%', height: '100%' }}
              >
                {/* Hotspots de las 12 zonas sobre el modelo */}
                {BODY_PARTS.map((part) => {
                  const isCurrent = currentStop.partId === part.id;
                  return (
                    <button
                      key={part.id}
                      className={`Hotspot ${isCurrent ? 'active-hotspot' : ''}`}
                      slot={part.hotspotId}
                      data-position={part.position}
                      data-normal={part.normal}
                      onClick={() => {
                        const matchingStopIdx = TOUR_STOPS.findIndex((s) => s.partId === part.id);
                        if (matchingStopIdx !== -1) {
                          goToStop(matchingStopIdx);
                        }
                      }}
                      aria-label={`Articulación ${part.name}`}
                      title={part.name}
                    >
                      {part.label}
                    </button>
                  );
                })}
              </model-viewer>

              {/* Efecto de rayos X / escáner láser durante transición */}
              {isTransforming && (
                <div className="xray-scanner-effect">
                  <div className="xray-laser-beam" />
                  <div className="xray-flash-glare" />
                  <div className="xray-scan-hud">
                    <span className="xray-hud-text">
                      {viewMode === 'body' ? '⚡ ESCANEANDO SISTEMA ÓSEO...' : '🧬 RECONSTRUYENDO MASA MUSCULAR...'}
                    </span>
                  </div>
                </div>
              )}

              {/* Selector flotante de capa anatómica (Cuerpo / Esqueleto) */}
              <div className="demo-floating-layer-switch">
                <button
                  className={`demo-layer-toggle-btn ${viewMode === 'body' ? 'active' : ''}`}
                  onClick={() => handleToggleLayer('body')}
                  disabled={isTransforming}
                  title="Ver masa muscular"
                >
                  <Activity size={14} />
                  <span>Cuerpo 3D</span>
                </button>
                <button
                  className={`demo-layer-toggle-btn ${viewMode === 'skeleton' ? 'active' : ''}`}
                  onClick={() => handleToggleLayer('skeleton')}
                  disabled={isTransforming}
                  title="Ver esqueleto óseo"
                >
                  <Bone size={14} />
                  <span>Esqueleto</span>
                </button>
              </div>

              {/* HUD inferior de telemetría de la zona activa */}
              <div className="demo-3d-hud-bar">
                <div className="demo-hud-target-pill">
                  <span className="demo-hud-dot" />
                  <span className="demo-hud-zone-name">{currentStop.title}</span>
                </div>
                <div className="demo-hud-stats">
                  <span>{currentStopProducts.length} SOLUCIONES ASOCIADAS</span>
                </div>
              </div>
            </div>
          </div>

          {/* Columna Derecha: Tarjeta de Zona y Productos Seleccionados */}
          <div className="demo-products-col">
            <div className="demo-zone-hero-card">
              <div className="demo-zone-header-row">
                <div className="attract-tag-badge">
                  <Scan size={14} />
                  <span>{currentStop.tag}</span>
                </div>
                <span className="demo-stop-badge">ESTACIÓN {currentStop.stepNum} DE {TOUR_STOPS.length}</span>
              </div>

              <h2 className="demo-zone-title">{currentStop.title}</h2>
              <div className="demo-zone-subtitle">{currentStop.subtitle}</div>
              <p className="demo-zone-desc">{currentStop.desc}</p>
            </div>

            {/* Showcase de Selección de Productos de la Zona */}
            <div className="demo-showcase-container">
              <div className="demo-showcase-header">
                <div className="demo-showcase-title">
                  <Sparkles size={16} color="var(--brand)" />
                  <span>PRODUCTOS SELECCIONADOS PARA ESTA ARTICULACIÓN</span>
                </div>
                <span className="demo-showcase-hint">Toca cualquier producto para abrir su ficha</span>
              </div>

              {/* Grid de 4 productos de la articulación con selección animada activa */}
              <div className="demo-products-selection-grid">
                {currentStopProducts.slice(0, 4).map((p, idx) => {
                  const isAutoSelected = activeProductIndex === idx;
                  return (
                    <div
                      key={p.code}
                      className={`demo-product-card ${isAutoSelected ? 'auto-selected' : ''}`}
                      onClick={() => onSelectProduct?.(p)}
                      title={`Ver ficha técnica de ${p.name}`}
                    >
                      {isAutoSelected && (
                        <div className="demo-selection-flag">
                          <span className="flag-dot" />
                          <span>SELECCIONADO EN DEMO</span>
                        </div>
                      )}

                      <div className="demo-product-card-top">
                        <span className="demo-prod-code">Ref. {p.code}</span>
                        <span className="demo-prod-badge">{p.badge}</span>
                      </div>

                      <div className="demo-product-img-wrap">
                        <img
                          src={`/assets/${p.code}.png`}
                          alt={p.name}
                          className="demo-product-img"
                          loading="lazy"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = '/assets/logo.png';
                          }}
                        />
                        <div className="demo-img-glow" />
                      </div>

                      <div className="demo-product-info">
                        <h4 className="demo-product-name">{p.name}</h4>
                        <div className="demo-product-cta-row">
                          <span className="demo-product-price">
                            Consultar Precio
                          </span>
                          <button className="demo-product-view-btn">
                            <Eye size={13} />
                            <span>Ver Ficha</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Botón de acción rápido a la zona en el visor 3D */}
              <div className="demo-zone-actions-row">
                <button
                  className="attract-primary-btn"
                  onClick={() => onGoToAnatomy?.()}
                >
                  <Maximize2 size={16} />
                  <span>Explorar en 3D</span>
                </button>

                <button
                  className="attract-secondary-btn attract-catalog-btn"
                  onClick={() => onGoToCatalog?.()}
                  title="Explorar todo el catálogo de productos Tynor"
                >
                  <Layers size={16} className="catalog-btn-icon" />
                  <span>Ver Catálogo</span>
                  <ArrowRight size={15} className="catalog-btn-arrow" />
                </button>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* Banner magnético inferior interactivo */}
      <div className="attract-bottom-banner" onClick={onDismiss}>
        <div className="attract-beacon-ripple">
          <div className="ripple-circle c1" />
          <div className="ripple-circle c2" />
          <div className="ripple-circle c3" />
          <div className="beacon-icon-wrap">
            <Touchpad size={32} className="beacon-icon" />
          </div>
        </div>

        <div className="attract-prompt-text-block">
          <div className="prompt-headline">
            TOCA LA PANTALLA EN CUALQUIER LUGAR PARA INTERACTUAR LIBREMENTE
          </div>
          <div className="prompt-subtext">
            Exploración Biomecánica 3D • 12 Zonas Anatómicas • 180 Soluciones Ortopédicas Certificadas
          </div>
        </div>

        <div className="attract-prompt-badge">
          <span>Stand Activo</span>
          <ArrowRight size={16} />
        </div>
      </div>
    </div>
  );
}
