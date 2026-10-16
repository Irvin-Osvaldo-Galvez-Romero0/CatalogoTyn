export const CATEGORIES = [
  { id: "todos", label: "Todos los productos", icon: "Grid" },
  { id: "cabestrillo", label: "Cabestrillos", icon: "Shield" },
  { id: "inmovilizador", label: "Inmovilizadores", icon: "Activity" },
  { id: "clavicula", label: "Soportes de Clavícula", icon: "Crosshair" },
  { id: "rodillera", label: "Rodilleras Ortopédicas", icon: "Disc" }
];

export const BODY_PARTS = [
  {
    id: "clavicula",
    name: "Clavícula y Postura",
    hotspotId: "hotspot-clavicula",
    position: "0.02 1.35 0.11",
    normal: "0 0.2 1",
    label: "1",
    desc: "Soportes posturales y alineación ósea de clavícula"
  },
  {
    id: "hombro",
    name: "Hombro y Manguito Rotador",
    hotspotId: "hotspot-hombro",
    position: "0.20 1.36 0.05",
    normal: "0.8 0.3 0.5",
    label: "2",
    desc: "Inmovilización trilateral y compresión elástica glenohumeral"
  },
  {
    id: "brazo",
    name: "Brazo, Codo y Antebrazo",
    hotspotId: "hotspot-brazo",
    position: "0.28 1.10 0.04",
    normal: "0.9 0 0.4",
    label: "3",
    desc: "Cabestrillos ergonómicos de soporte y descarga articular"
  },
  {
    id: "mano",
    name: "Muñeca, Mano y Dedos",
    hotspotId: "hotspot-mano",
    position: "0.38 0.88 0.06",
    normal: "0.7 0.3 0.6",
    label: "4",
    desc: "Férulas maleables de aluminio y soporte distal de mano"
  },
  {
    id: "rodilla",
    name: "Rodilla y Ligamentos",
    hotspotId: "hotspot-rodilla",
    position: "0.09 0.49 0.11",
    normal: "0 0.2 1",
    label: "5",
    desc: "Soportes elásticos 3D y estabilizadores rotulianos"
  },
  {
    id: "pierna",
    name: "Pierna y Rehabilitación ROM",
    hotspotId: "hotspot-pierna",
    position: "-0.08 0.49 0.10",
    normal: "0 0.2 1",
    label: "6",
    desc: "Ortesis graduables de rango de movimiento (ROM) post-operatorio"
  }
];

export const PRODUCTS = [
  {
    code: "C01",
    name: "Cabestrillo (Tropical)",
    cat: "cabestrillo",
    price: 125.00,
    bodyPart: ["brazo", "hombro", "mano", "clavicula"],
    badge: "Más Vendido",
    sizes: ["CH", "M", "G", "XG"],
    hasPdf: true,
    hasVideo: false,
    shortDesc: "Diseño ergonómico para climas cálidos y soporte prolongado del brazo en flexión.",
    desc: "La función del cabestrillo es sostener, apoyar e inmovilizar esguinces, fracturas o intervenciones quirúrgicas del brazo, manteniéndolo en posición de flexión durante el proceso de recuperación.\n\nFabricado en un elegante e inteligente diseño ideal para condiciones climáticas cálidas y húmedas.",
    uses: [
      "Fractura en cualquier estructura que compone el brazo.",
      "Fractura de clavícula y luxaciones escapulares.",
      "Post-operatorio o esguinces de codo y muñeca."
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
    bodyPart: ["brazo", "hombro", "mano"],
    badge: "Confort Extra",
    sizes: ["Universal"],
    hasPdf: false,
    hasVideo: false,
    shortDesc: "Banda ancha envolvente para distribución de peso uniforme y soporte reforzado.",
    desc: "La función del cabestrillo es sostener, apoyar e inmovilizar esguinces, fracturas o intervenciones quirúrgicas del brazo, manteniéndolo en posición de flexión durante el proceso de recuperación.\n\nSu diseño de cuna ancha distribuye la carga reduciendo el punto de presión sobre el cuello y los hombros.",
    uses: [
      "Fractura en cualquier estructura que compone el brazo.",
      "Rehabilitación tras cirugía ortopédica.",
      "Tratamiento conservador de lesiones del manguito rotador."
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
    bodyPart: ["brazo", "hombro"],
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
    bodyPart: ["hombro", "brazo"],
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
    code: "F03",
    name: "Inmovilizador de Aluminio para Dedo",
    cat: "inmovilizador",
    price: null,
    bodyPart: ["mano"],
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
    code: "C03",
    name: "Inmovilizador Elástico de Hombros",
    cat: "inmovilizador",
    price: 360.00,
    bodyPart: ["hombro"],
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
    code: "C05",
    name: "Soporte para Clavícula con Velcro",
    cat: "clavicula",
    price: 210.00,
    bodyPart: ["clavicula", "hombro"],
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
    bodyPart: ["clavicula", "hombro"],
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
    code: "D09",
    name: "Rodillera Mecánica Abierta (Algodón)",
    cat: "rodillera",
    price: null,
    bodyPart: ["rodilla", "pierna"],
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
    bodyPart: ["rodilla", "pierna"],
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
    bodyPart: ["rodilla", "pierna"],
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
  }
];
