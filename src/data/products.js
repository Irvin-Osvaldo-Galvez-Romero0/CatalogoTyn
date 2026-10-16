export const CATEGORIES = [
  { id: "todos", label: "Todos los productos", icon: "Grid" },
  { id: "hombro_brazo", label: "Hombro y Brazo", icon: "Shield" },
  { id: "cabestrillo", label: "Cabestrillos", icon: "Shield" },
  { id: "inmovilizador", label: "Inmovilizadores", icon: "Activity" },
  { id: "cervical", label: "Cuello y Cervical", icon: "Crosshair" },
  { id: "clavicula", label: "Clavícula", icon: "Crosshair" },
  { id: "lumbar", label: "Columna y Lumbar", icon: "Activity" },
  { id: "rodillera", label: "Rodilleras", icon: "Disc" },
  { id: "tobillo", label: "Tobillo y Pie", icon: "Disc" }
];

export const BODY_PARTS = [
  {
    id: "hombro",
    name: "Hombro y Manguito Rotador",
    hotspotId: "hotspot-hombro",
    position: "0.30 1.22 0.03",
    normal: "0.8 0.2 0.5",
    zoomTarget: "0.26m 1.22m 0.03m",
    zoomOrbit: "45deg 75deg 0.65m",
    label: "1",
    desc: "Inmovilización trilateral, fijación acromial y patologías de manguito rotador"
  },
  {
    id: "mano",
    name: "Muñeca, Mano y Dedos",
    hotspotId: "hotspot-mano",
    position: "0.40 0.82 0.06",
    normal: "0.7 0.3 0.6",
    zoomTarget: "0.38m 0.82m 0.06m",
    zoomOrbit: "55deg 80deg 0.52m",
    label: "2",
    desc: "Férulas maleables de aluminio y soporte distal de mano y falanges"
  },
  {
    id: "rodilla",
    name: "Rodilla y Rótula",
    hotspotId: "hotspot-rodilla",
    position: "0.13 0.49 0.11",
    normal: "0.4 0.2 0.9",
    zoomTarget: "0.08m 0.49m 0.10m",
    zoomOrbit: "10deg 80deg 0.62m",
    label: "3",
    desc: "Soportes elásticos 3D, estabilizadores rotulianos y bisagras policéntricas"
  },
  {
    id: "cuello",
    name: "Cuello y Columna Cervical",
    hotspotId: "hotspot-cuello",
    position: "-0.10 1.36 0.06",
    normal: "-0.6 0.1 0.8",
    zoomTarget: "0m 1.35m 0.07m",
    zoomOrbit: "0deg 78deg 0.55m",
    label: "4",
    desc: "Collarines cervicales anatómicos de soporte mentoniano y control de latigazo"
  },
  {
    id: "clavicula",
    name: "Clavícula y Tórax",
    hotspotId: "hotspot-clavicula",
    position: "-0.13 1.30 0.09",
    normal: "-0.5 0.2 0.8",
    zoomTarget: "-0.09m 1.30m 0.10m",
    zoomOrbit: "-15deg 75deg 0.68m",
    label: "5",
    desc: "Soportes posturales y corrección dorsal de fracturas de clavícula"
  },
  {
    id: "brazo",
    name: "Brazo, Codo y Antebrazo",
    hotspotId: "hotspot-brazo",
    position: "0.34 1.05 0.04",
    normal: "0.9 0 0.4",
    zoomTarget: "0.31m 1.05m 0.04m",
    zoomOrbit: "55deg 75deg 0.62m",
    label: "6",
    desc: "Cabestrillos de descarga articular ergonómica y recuperación en flexión"
  },
  {
    id: "espalda",
    name: "Espalda y Columna Lumbar",
    hotspotId: "hotspot-espalda",
    position: "0 0.96 -0.09",
    normal: "0 0 -1",
    zoomTarget: "0m 0.96m -0.09m",
    zoomOrbit: "180deg 85deg 0.75m",
    label: "7",
    desc: "Fajas sacrolumbares de doble tensión para lumbalgias y hernias discales"
  },
  {
    id: "pierna",
    name: "Pierna y Rehabilitación ROM",
    hotspotId: "hotspot-pierna",
    position: "-0.13 0.60 0.10",
    normal: "-0.5 0.2 0.8",
    zoomTarget: "-0.09m 0.60m 0.10m",
    zoomOrbit: "-20deg 80deg 0.68m",
    label: "8",
    desc: "Ortesis graduables de rango de movimiento (ROM) post-cirugía de ligamentos"
  },
  {
    id: "tobillo",
    name: "Tobillo y Articulación del Pie",
    hotspotId: "hotspot-tobillo",
    position: "0.12 0.12 0.08",
    normal: "0.6 0.2 0.8",
    zoomTarget: "0.08m 0.12m 0.08m",
    zoomOrbit: "15deg 80deg 0.55m",
    label: "9",
    desc: "Tobilleras elásticas compresivas con talón abierto para esguinces y estabilidad"
  }
];

export const PRODUCTS = [
  {
    code: "C01",
    name: "Cabestrillo (Tropical)",
    cat: "cabestrillo",
    price: 125.00,
    bodyPart: "brazo",
    badge: "Más Vendido",
    sizes: ["CH", "M", "G", "XG"],
    hasPdf: true,
    hasVideo: false,
    shortDesc: "Diseño ergonómico para climas cálidos y soporte prolongado del brazo en flexión.",
    desc: "La función del cabestrillo es sostener, apoyar e inmovilizar esguinces, fracturas o intervenciones quirúrgicas del brazo, manteniéndolo en posición de flexión durante el proceso de recuperación.\n\nFabricado en un elegante e inteligente diseño ideal para condiciones climáticas cálidas y húmedas.",
    uses: [
      "Fractura en cualquier estructura que compone el brazo.",
      "Inmovilización post-operatoria del antebrazo y codo.",
      "Soporte cómodo para uso prolongado en climas cálidos."
    ],
    features: [
      "Tela perforada 3D transpirable y antialérgica",
      "Correa de hombro con almohadilla acolchada para evitar rozaduras",
      "Hebilla de fácil liberación para colocación autónoma"
    ]
  },
  {
    code: "C06",
    name: "Cabestrillo Ancho (Buggy)",
    cat: "cabestrillo",
    price: 140.00,
    bodyPart: "brazo",
    badge: "Confort Extra",
    sizes: ["Universal"],
    hasPdf: false,
    hasVideo: false,
    shortDesc: "Banda ancha envolvente para distribución de peso uniforme y soporte reforzado.",
    desc: "La función del cabestrillo es sostener, apoyar e inmovilizar esguinces, fracturas o intervenciones quirúrgicas del brazo, manteniéndolo en posición de flexión durante el proceso de recuperación.\n\nSu diseño de cuna ancha distribuye la carga reduciendo el punto de presión sobre el cuello y los hombros.",
    uses: [
      "Fractura en cualquier estructura que compone el brazo.",
      "Rehabilitación tras cirugía ortopédica de codo o húmero.",
      "Soporte estable con cuna ancha de reposo."
    ],
    features: [
      "Cuna anatómica ancha con soporte de pulgar integrado",
      "Tejido suave de tacto clínico de alta resistencia",
      "Ajuste ambidiestro de colocación rápida"
    ]
  },
  {
    code: "L04",
    name: "Cabestrillo Oxypore",
    cat: "cabestrillo",
    price: null,
    bodyPart: "brazo",
    badge: "Tecnología Oxypore",
    sizes: ["CH", "M", "G", "XG"],
    hasPdf: false,
    hasVideo: true,
    shortDesc: "Malla 3D microporosa de ventilación continua con video demostrativo.",
    desc: "De tamaño reducido y diseño elegante, no cubre el pecho, apoya y cubre el brazo por completo. Puede acomodar yesos o vendajes voluminosos. Es el más adecuado para climas cálidos. Hecho de tela perforada de malla 3D fuerte, sin arrugas, muy bien ventilada con un aspecto agradable.",
    uses: [
      "Sostiene y apoya los brazos torcidos, rotos u operados quirúrgicamente.",
      "Uso con yesos voluminosos sin compresión excesiva.",
      "Ideal para pacientes con piel sensible o hiperhidrosis."
    ],
    features: [
      "Estructura Oxypore Honeycomb para flujo de aire activo",
      "Sistema de hebilla micrométrica de alta fijación",
      "Lavable a mano sin pérdida de forma estructural"
    ]
  },
  {
    code: "C02",
    name: "Inmovilizador de Hombro Universal",
    cat: "inmovilizador",
    price: 265.00,
    bodyPart: "hombro",
    badge: "Fijación Completa",
    sizes: ["Universal"],
    hasPdf: false,
    hasVideo: false,
    shortDesc: "Inmovilización trilateral para traumatología de hombro y húmero.",
    desc: "Soporte versátil que se adapta a distintas tallas, brindando estabilidad completa al hombro y al antebrazo desde el primer ajuste para una recuperación segura. Restringe eficazmente la abducción y rotación del hombro.",
    uses: [
      "Luxación y subluxación glenohumeral aguda.",
      "Fractura de cabeza de húmero y escápula.",
      "Fase post-quirúrgica inmediata de manguito rotador."
    ],
    features: [
      "Banda torácica ancha para inmovilización axial rígida",
      "Diseño adaptable izquierda/derecha sin accesorios adicionales",
      "Cierres de velcro de grado médico de alta tenacidad"
    ]
  },
  {
    code: "C03",
    name: "Inmovilizador Elástico de Hombros",
    cat: "inmovilizador",
    price: 360.00,
    bodyPart: "hombro",
    badge: "Compresión Dinámica",
    sizes: ["CH", "M", "G", "XG"],
    hasPdf: false,
    hasVideo: false,
    shortDesc: "Compresión elástica multidireccional para patologías de manguito rotador.",
    desc: "Diseño elástico que restringe el movimiento del hombro proporcionando compresión controlada y soporte térmico. Ideal para lesiones de manguito rotador, tendinitis o luxaciones recidivantes.",
    uses: [
      "Lesiones del manguito rotador y bursitis subacromial.",
      "Subluxación recidivante de hombro.",
      "Rehabilitación y retorno paulatino a la movilidad."
    ],
    features: [
      "Tejido elástico de 4 vías con memoria elástica de alto nivel",
      "Cinturón de ajuste humeral con tensión graduada",
      "Perfil bajo para uso discreto bajo la ropa"
    ]
  },
  {
    code: "F03",
    name: "Inmovilizador de Aluminio para Dedo",
    cat: "inmovilizador",
    price: null,
    bodyPart: "mano",
    badge: "Maleable",
    sizes: ["CH", "M", "G"],
    hasPdf: false,
    hasVideo: false,
    shortDesc: "Férula anatómica acolchada maleable para falanges interfalángicas.",
    desc: "Férula de aluminio maleable recubierta de espuma de alta densidad que inmoviliza y protege las falanges de los dedos en caso de fracturas, esguinces o rehabilitación articular.",
    uses: [
      "Fracturas de falanges distales y medias.",
      "Esguinces articulares interfalángicos.",
      "Protección post-traumática deportiva."
    ],
    features: [
      "Aluminio anodizado maleable a la anatomía del paciente",
      "Interior en espuma de poliuretano ventilada",
      "No interfiere con rayos X de control médico"
    ]
  },
  {
    code: "C05",
    name: "Soporte para Clavícula con Velcro",
    cat: "clavicula",
    price: 210.00,
    bodyPart: "clavicula",
    badge: "Postural",
    sizes: ["CH", "M", "G", "XG"],
    hasPdf: false,
    hasVideo: false,
    shortDesc: "Cierre velcro de microajuste rápido para corrección postural y fractura.",
    desc: "Cierre de velcro para un ajuste rápido y progresivo. Corrige la postura y ayuda en el tratamiento de fracturas de clavícula, pensado para uso diario prolongado sin fatiga dérmica.",
    uses: [
      "Tratamiento conservador de fracturas de clavícula.",
      "Corrección de postura hipercifótica o hombros caídos.",
      "Soporte acromioclavicular en rehabilitación."
    ],
    features: [
      "Hebillas de anillo en 'D' con amortiguador axilar suave",
      "Banda dorsal acolchada antitorsión",
      "Fácil regulación de tensión por el propio paciente"
    ]
  },
  {
    code: "C04",
    name: "Soporte para Clavícula con Hebilla",
    cat: "clavicula",
    price: 213.00,
    bodyPart: "clavicula",
    badge: "Ajuste Firme",
    sizes: ["CH", "M", "G"],
    hasPdf: false,
    hasVideo: false,
    shortDesc: "Sistema de hebillas metálicas con bloqueo firme para inmovilización clavicular.",
    desc: "Sistema de hebillas que permite un ajuste firme y seguro para inmovilizar la clavícula y promover la correcta alineación postural durante la consolidación ósea.",
    uses: [
      "Consolidación ósea de fracturas de clavícula cerradas.",
      "Inmovilización escapular post-trauma.",
      "Realineamiento biomecánico de cintura escapular."
    ],
    features: [
      "Hebillas de aleación ligera no deformables",
      "Almohadillas axilares de espuma viscoelástica para evitar compresión vascular",
      "Construcción duradera de resistencia grado hospitalario"
    ]
  },
  {
    code: "B01",
    name: "Collarín Cervical Suave",
    cat: "cervical",
    price: 185.00,
    bodyPart: "cuello",
    badge: "Soporte Anatómico",
    sizes: ["CH", "M", "G", "XG"],
    hasPdf: false,
    hasVideo: false,
    shortDesc: "Inmovilización cómoda y soporte mentoniano para contracturas y latigazo cervical.",
    desc: "Diseñado para brindar soporte térmico y contención fisiológica de la columna cervical, limitando la flexo-extensión excesiva sin comprimir la mandíbula.",
    uses: [
      "Esguinces y contracturas musculares cervicales (latigazo).",
      "Cervicobraquialgias y tortícolis agudas.",
      "Rehabilitación post-trauma leve."
    ],
    features: [
      "Espuma de poliuretano de alta densidad indeformable",
      "Funda de algodón 100% transpirable y lavable",
      "Cierre de velcro regulable para ajuste milimétrico"
    ]
  },
  {
    code: "A01",
    name: "Faja Sacrolumbar Reforzada",
    cat: "lumbar",
    price: 420.00,
    bodyPart: "espalda",
    badge: "Doble Tensión",
    sizes: ["CH", "M", "G", "XG", "XXG"],
    hasPdf: false,
    hasVideo: false,
    shortDesc: "Estabilidad dorsal y descompresión lumbosacra con varillas anatómicas flexibles.",
    desc: "Soporte lumbosacro de grado terapéutico con doble banda de contra-tracción elástica y varillas posteriores que descargan la presión de las vértebras lumbares.",
    uses: [
      "Lumbalgias agudas, dolor lumbosacro y ciática.",
      "Hernias discales y espondilólisis.",
      "Soporte preventivo ocupacional y levantamiento de carga."
    ],
    features: [
      "Varillas dorsales anatómicas de soporte rígido",
      "Doble banda elástica de contra-tracción para compresión ajustable",
      "Tejido monofilamento elástico poroso de máxima ventilación"
    ]
  },
  {
    code: "D09",
    name: "Rodillera Mecánica Abierta (Algodón)",
    cat: "rodillera",
    price: null,
    bodyPart: "rodilla",
    badge: "Bisagras Laterales",
    sizes: ["CH", "M", "G", "XG", "XXG"],
    hasPdf: false,
    hasVideo: false,
    shortDesc: "Rótula abierta con articulaciones policéntricas de estabilidad lateral.",
    desc: "Rodillera de compresión con diseño abierto en la rótula. Fabricada en algodón elástico transpirable, incluye articulaciones mecánicas laterales de aleación para dar máxima estabilidad a la articulación femorotibial.",
    uses: [
      "Inestabilidad moderada a severa de ligamentos colaterales (LCL/MCL).",
      "Lesiones meniscales y osteoartritis de rodilla.",
      "Apoyo biomecánico en pacientes geriátricos o post-quirúrgicos."
    ],
    features: [
      "Bisagras mecánicas bilaterales desmontables para lavado",
      "Almohadilla rotuliana de silicona viscoelástica centrada",
      "Algodón hipoalergénico con excelente gestión de humedad"
    ]
  },
  {
    code: "D05",
    name: "Rodillera Elástica",
    cat: "rodillera",
    price: null,
    bodyPart: "rodilla",
    badge: "Compresión 3D",
    sizes: ["CH", "M", "G", "XG"],
    hasPdf: false,
    hasVideo: false,
    shortDesc: "Compresión graduada continua y soporte propioceptivo articular.",
    desc: "Soporte elástico que provee compresión uniforme y calor terapéutico a la articulación, ideal para tratar esguinces leves, inflamación articular y brindar apoyo preventivo durante la actividad física.",
    uses: [
      "Esguinces leves de rodilla y tendinitis rotuliana.",
      "Edema e inflamación post-esfuerzo.",
      "Prevención en actividad laboral con carga de peso."
    ],
    features: [
      "Tejido circular sin costuras que previene puntos de fricción",
      "Bordes con compresión desvanecida que no cortan la circulación",
      "Conserva la temperatura terapéutica en tejidos blandos"
    ]
  },
  {
    code: "D10",
    name: "Rodillera Mecánica Graduable (ROM)",
    cat: "rodillera",
    price: null,
    bodyPart: "pierna",
    badge: "Control ROM",
    sizes: ["Universal Graduable"],
    hasPdf: false,
    hasVideo: false,
    shortDesc: "Control milimétrico de rango de movimiento (flexión/extensión) post-operatorio.",
    desc: "Máxima sujeción con bisagras graduables que permiten controlar con precisión el rango de movimiento (ROM) de flexión y extensión. Indicada para post-operatorios de ligamento cruzado anterior (LCA) y prótesis de rodilla.",
    uses: [
      "Rehabilitación post-cirugía de ligamentos cruzados (LCA / LCP).",
      "Reparación meniscal y osteotomías de rodilla.",
      "Control estricto de flexo-extensión en etapas tempranas de recuperación."
    ],
    features: [
      "Selector de ángulo con pines de bloqueo rápido de 0° a 120°",
      "Barras telescópicas extensibles según la longitud de pierna",
      "Acolchados lavables desmontables con fijación velcro de alta seguridad"
    ]
  },
  {
    code: "D01",
    name: "Tobillera Elástica de Compresión",
    cat: "tobillo",
    price: 160.00,
    bodyPart: "tobillo",
    badge: "Compresión 3D",
    sizes: ["CH", "M", "G", "XG"],
    hasPdf: false,
    hasVideo: false,
    shortDesc: "Compresión articular y propiocepción dinámica para el tobillo y talón.",
    desc: "Soporte elástico anatómico de alta densidad con apertura en talón que estabiliza el complejo ligamentoso del tobillo sin restringir la marcha normal ni molestar dentro del calzado.",
    uses: [
      "Esguinces de tobillo (Grado I y II) y laxitud ligamentosa.",
      "Tendinitis aquílea y edema post-esfuerzo.",
      "Soporte preventivo deportivo y laboral."
    ],
    features: [
      "Talón anatómico abierto para óptima adaptación a la pisada",
      "Tejido circular sin costuras de compresión controlada",
      "Material transpirable que retiene el calor terapéutico"
    ]
  }
];
