export const CATEGORIES = [
  {
    "id": "todos",
    "label": "Todos los productos",
    "icon": "Grid"
  },
  {
    "id": "hombro_brazo",
    "label": "Hombro y Brazo",
    "icon": "Shield"
  },
  {
    "id": "cabestrillo",
    "label": "Cabestrillos",
    "icon": "Shield"
  },
  {
    "id": "inmovilizador",
    "label": "Inmovilizadores",
    "icon": "Activity"
  },
  {
    "id": "cervical",
    "label": "Cuello y Cervical",
    "icon": "Crosshair"
  },
  {
    "id": "clavicula",
    "label": "Clavícula",
    "icon": "Crosshair"
  },
  {
    "id": "lumbar",
    "label": "Columna y Lumbar",
    "icon": "Activity"
  },
  {
    "id": "rodillera",
    "label": "Rodilleras",
    "icon": "Disc"
  },
  {
    "id": "tobillo",
    "label": "Tobillo y Pie",
    "icon": "Disc"
  },
  {
    "id": "movilidad",
    "label": "Movilidad y Marcha",
    "icon": "Activity"
  }
];

export const BODY_PARTS = [
  {
    "id": "hombro",
    "name": "Hombro y Manguito Rotador",
    "hotspotId": "hotspot-hombro",
    "position": "0.30 1.22 0.03",
    "normal": "0.8 0.2 0.5",
    "zoomTarget": "0.26m 1.22m 0.03m",
    "zoomOrbit": "45deg 75deg 0.65m",
    "label": "1",
    "desc": "Inmovilización trilateral, fijación acromial y patologías de manguito rotador"
  },
  {
    "id": "mano",
    "name": "Muñeca, Mano y Dedos",
    "hotspotId": "hotspot-mano",
    "position": "0.40 0.82 0.06",
    "normal": "0.7 0.3 0.6",
    "zoomTarget": "0.38m 0.82m 0.06m",
    "zoomOrbit": "55deg 80deg 0.52m",
    "label": "2",
    "desc": "Férulas maleables de aluminio y soporte distal de mano y falanges"
  },
  {
    "id": "rodilla",
    "name": "Rodilla y Rótula",
    "hotspotId": "hotspot-rodilla",
    "position": "0.13 0.49 0.11",
    "normal": "0.4 0.2 0.9",
    "zoomTarget": "0.08m 0.49m 0.10m",
    "zoomOrbit": "10deg 80deg 0.62m",
    "label": "3",
    "desc": "Soportes elásticos 3D, estabilizadores rotulianos y bisagras policéntricas"
  },
  {
    "id": "cuello",
    "name": "Cuello y Columna Cervical",
    "hotspotId": "hotspot-cuello",
    "position": "-0.10 1.36 0.06",
    "normal": "-0.6 0.1 0.8",
    "zoomTarget": "0m 1.35m 0.07m",
    "zoomOrbit": "0deg 78deg 0.55m",
    "label": "4",
    "desc": "Collarines cervicales anatómicos de soporte mentoniano y control de latigazo"
  },
  {
    "id": "clavicula",
    "name": "Clavícula y Tórax",
    "hotspotId": "hotspot-clavicula",
    "position": "-0.13 1.30 0.09",
    "normal": "-0.5 0.2 0.8",
    "zoomTarget": "-0.09m 1.30m 0.10m",
    "zoomOrbit": "-15deg 75deg 0.68m",
    "label": "5",
    "desc": "Soportes posturales y corrección dorsal de fracturas de clavícula"
  },
  {
    "id": "brazo",
    "name": "Brazo, Codo y Antebrazo",
    "hotspotId": "hotspot-brazo",
    "position": "0.34 1.05 0.04",
    "normal": "0.9 0 0.4",
    "zoomTarget": "0.31m 1.05m 0.04m",
    "zoomOrbit": "55deg 75deg 0.62m",
    "label": "6",
    "desc": "Cabestrillos de descarga articular ergonómica y recuperación en flexión"
  },
  {
    "id": "espalda",
    "name": "Espalda y Columna Lumbar",
    "hotspotId": "hotspot-espalda",
    "position": "0 0.96 -0.09",
    "normal": "0 0 -1",
    "zoomTarget": "0m 0.96m -0.09m",
    "zoomOrbit": "180deg 85deg 0.75m",
    "label": "7",
    "desc": "Fajas sacrolumbares de doble tensión para lumbalgias y hernias discales"
  },
  {
    "id": "pierna",
    "name": "Pierna y Rehabilitación ROM",
    "hotspotId": "hotspot-pierna",
    "position": "-0.13 0.60 0.10",
    "normal": "-0.5 0.2 0.8",
    "zoomTarget": "-0.09m 0.60m 0.10m",
    "zoomOrbit": "-20deg 80deg 0.68m",
    "label": "8",
    "desc": "Ortesis graduables de rango de movimiento (ROM) post-cirugía de ligamentos"
  },
  {
    "id": "tobillo",
    "name": "Tobillo y Articulación del Pie",
    "hotspotId": "hotspot-tobillo",
    "position": "0.12 0.12 0.08",
    "normal": "0.6 0.2 0.8",
    "zoomTarget": "0.08m 0.12m 0.08m",
    "zoomOrbit": "15deg 80deg 0.55m",
    "label": "9",
    "desc": "Tobilleras elásticas compresivas con talón abierto para esguinces y estabilidad"
  }
];

export const PRODUCTS = [
  {
    "code": "101",
    "name": "Rodillera Deportiva AIR PRO con Soporte Rotuliano",
    "cat": "rodillera",
    "price": 185,
    "bodyPart": "rodilla",
    "badge": "Deportiva",
    "linea": "Deportiva",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL"
    ],
    "colors": [
      {
        "id": "N",
        "name": "Naranja Neón",
        "hex": "#FF6B00",
        "border": "#EA580C"
      },
      {
        "id": "V",
        "name": "Verde Neón",
        "hex": "#10B981",
        "border": "#059669"
      }
    ],
    "hasPdf": true,
    "hasVideo": false,
    "shortDesc": "Rodillera Deportiva AIR PRO con Soporte Rotuliano diseñado para soporte terapéutico de alta durabilidad y estabilidad anatómica.",
    "desc": "Dispositivo ortopédico Rodillera Deportiva AIR PRO con Soporte Rotuliano fabricado con materiales de grado clínico internacional Tynor. Proporciona soporte, compresión controlada y alivio anatómico óptimo para una rehabilitación segura y confortable.",
    "uses": [
      "Tratamiento y prevención de afecciones en zona de rodilla.",
      "Rehabilitación ortopédica post-traumática o post-quirúrgica.",
      "Soporte ergonómico de uso diario con alivio de carga articular."
    ],
    "features": [
      "Material transpirable hipoalergénico de alta resistencia",
      "Diseño ergonómico ajustable a la morfología del paciente",
      "Estructura diseñada bajo estándares ortopédicos internacionales"
    ],
    "priceBySize": {
      "CH": 185,
      "M": 185,
      "G": 185,
      "XL": 185
    }
  },
  {
    "code": "102",
    "name": "Rodillera Deportiva AIR PRO (par)",
    "cat": "rodillera",
    "price": 275,
    "bodyPart": "rodilla",
    "badge": "Deportiva",
    "linea": "Deportiva",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL"
    ],
    "colors": [
      {
        "id": "N",
        "name": "Naranja Neón",
        "hex": "#FF6B00",
        "border": "#EA580C"
      },
      {
        "id": "V",
        "name": "Verde Neón",
        "hex": "#10B981",
        "border": "#059669"
      }
    ],
    "hasPdf": true,
    "hasVideo": false,
    "shortDesc": "Rodillera Deportiva AIR PRO (par) diseñado para soporte terapéutico de alta durabilidad y estabilidad anatómica.",
    "desc": "Dispositivo ortopédico Rodillera Deportiva AIR PRO (par) fabricado con materiales de grado clínico internacional Tynor. Proporciona soporte, compresión controlada y alivio anatómico óptimo para una rehabilitación segura y confortable.",
    "uses": [
      "Tratamiento y prevención de afecciones en zona de rodilla.",
      "Rehabilitación ortopédica post-traumática o post-quirúrgica.",
      "Soporte ergonómico de uso diario con alivio de carga articular."
    ],
    "features": [
      "Material transpirable hipoalergénico de alta resistencia",
      "Diseño ergonómico ajustable a la morfología del paciente",
      "Estructura diseñada bajo estándares ortopédicos internacionales"
    ],
    "priceBySize": {
      "CH": 275,
      "M": 275,
      "G": 275,
      "XL": 275
    }
  },
  {
    "code": "103",
    "name": "Rodillera Deportiva AIR (par)",
    "cat": "rodillera",
    "price": 275,
    "bodyPart": "rodilla",
    "badge": "Deportiva",
    "linea": "Deportiva",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL"
    ],
    "colors": [
      {
        "id": "N",
        "name": "Naranja Neón",
        "hex": "#FF6B00",
        "border": "#EA580C"
      },
      {
        "id": "V",
        "name": "Verde Neón",
        "hex": "#10B981",
        "border": "#059669"
      }
    ],
    "hasPdf": true,
    "hasVideo": false,
    "shortDesc": "Rodillera Deportiva AIR (par) diseñado para soporte terapéutico de alta durabilidad y estabilidad anatómica.",
    "desc": "Dispositivo ortopédico Rodillera Deportiva AIR (par) fabricado con materiales de grado clínico internacional Tynor. Proporciona soporte, compresión controlada y alivio anatómico óptimo para una rehabilitación segura y confortable.",
    "uses": [
      "Tratamiento y prevención de afecciones en zona de rodilla.",
      "Rehabilitación ortopédica post-traumática o post-quirúrgica.",
      "Soporte ergonómico de uso diario con alivio de carga articular."
    ],
    "features": [
      "Material transpirable hipoalergénico de alta resistencia",
      "Diseño ergonómico ajustable a la morfología del paciente",
      "Estructura diseñada bajo estándares ortopédicos internacionales"
    ],
    "priceBySize": {
      "CH": 275,
      "M": 275,
      "G": 275,
      "XL": 275
    }
  },
  {
    "code": "104",
    "name": "Rodillera para Levantamiento de Pesas (par)",
    "cat": "rodillera",
    "price": 285,
    "bodyPart": "rodilla",
    "badge": "Deportiva",
    "linea": "Deportiva",
    "sizes": [
      "Universal"
    ],
    "hasPdf": true,
    "hasVideo": false,
    "shortDesc": "Rodillera para Levantamiento de Pesas (par) diseñado para soporte terapéutico de alta durabilidad y estabilidad anatómica.",
    "desc": "Dispositivo ortopédico Rodillera para Levantamiento de Pesas (par) fabricado con materiales de grado clínico internacional Tynor. Proporciona soporte, compresión controlada y alivio anatómico óptimo para una rehabilitación segura y confortable.",
    "uses": [
      "Tratamiento y prevención de afecciones en zona de rodilla.",
      "Rehabilitación ortopédica post-traumática o post-quirúrgica.",
      "Soporte ergonómico de uso diario con alivio de carga articular."
    ],
    "features": [
      "Material transpirable hipoalergénico de alta resistencia",
      "Diseño ergonómico ajustable a la morfología del paciente",
      "Estructura diseñada bajo estándares ortopédicos internacionales"
    ],
    "colors": [
      {
        "id": "N",
        "name": "Naranja Neón",
        "hex": "#FF6B00",
        "border": "#EA580C"
      },
      {
        "id": "V",
        "name": "Verde Neón",
        "hex": "#10B981",
        "border": "#059669"
      }
    ],
    "priceBySize": {
      "UNITALLA": 285,
      "Universal": 285
    }
  },
  {
    "code": "105",
    "name": "Muslera Elástica Deportiva AIR PRO",
    "cat": "todos",
    "price": 185,
    "bodyPart": "pierna",
    "badge": "Deportiva",
    "linea": "Deportiva",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL"
    ],
    "hasPdf": true,
    "hasVideo": false,
    "shortDesc": "Muslera Elástica Deportiva AIR PRO diseñado para soporte terapéutico de alta durabilidad y estabilidad anatómica.",
    "desc": "Dispositivo ortopédico Muslera Elástica Deportiva AIR PRO fabricado con materiales de grado clínico internacional Tynor. Proporciona soporte, compresión controlada y alivio anatómico óptimo para una rehabilitación segura y confortable.",
    "uses": [
      "Tratamiento y prevención de afecciones en zona de pierna.",
      "Rehabilitación ortopédica post-traumática o post-quirúrgica.",
      "Soporte ergonómico de uso diario con alivio de carga articular."
    ],
    "features": [
      "Material transpirable hipoalergénico de alta resistencia",
      "Diseño ergonómico ajustable a la morfología del paciente",
      "Estructura diseñada bajo estándares ortopédicos internacionales"
    ],
    "colors": [
      {
        "id": "N",
        "name": "Naranja Neón",
        "hex": "#FF6B00",
        "border": "#EA580C"
      },
      {
        "id": "V",
        "name": "Verde Neón",
        "hex": "#10B981",
        "border": "#059669"
      }
    ],
    "priceBySize": {
      "CH": 185,
      "M": 185,
      "G": 185,
      "XL": 185
    }
  },
  {
    "code": "107",
    "name": "Corrector de Postura Deportivo",
    "cat": "clavicula",
    "price": 275,
    "bodyPart": "clavicula",
    "badge": "Deportiva",
    "linea": "Deportiva",
    "sizes": [
      "Universal"
    ],
    "hasPdf": true,
    "hasVideo": false,
    "shortDesc": "Corrector de Postura Deportivo diseñado para soporte terapéutico de alta durabilidad y estabilidad anatómica.",
    "desc": "Dispositivo ortopédico Corrector de Postura Deportivo fabricado con materiales de grado clínico internacional Tynor. Proporciona soporte, compresión controlada y alivio anatómico óptimo para una rehabilitación segura y confortable.",
    "uses": [
      "Tratamiento y prevención de afecciones en zona de clavicula.",
      "Rehabilitación ortopédica post-traumática o post-quirúrgica.",
      "Soporte ergonómico de uso diario con alivio de carga articular."
    ],
    "features": [
      "Material transpirable hipoalergénico de alta resistencia",
      "Diseño ergonómico ajustable a la morfología del paciente",
      "Estructura diseñada bajo estándares ortopédicos internacionales"
    ],
    "colors": [
      {
        "id": "V",
        "name": "Verde",
        "hex": "#10B981",
        "border": "#059669"
      },
      {
        "id": "N",
        "name": "Naranja",
        "hex": "#FF6B00",
        "border": "#EA580C"
      }
    ],
    "priceBySize": {
      "UNITALLA": 275,
      "Universal": 275
    }
  },
  {
    "code": "108",
    "name": "Anillo Subrotuliano Doble",
    "cat": "rodillera",
    "price": null,
    "bodyPart": "rodilla",
    "badge": "Deportiva",
    "linea": "Deportiva",
    "sizes": [
      "Universal"
    ],
    "hasPdf": true,
    "hasVideo": false,
    "shortDesc": "Anillo Subrotuliano Doble diseñado para soporte terapéutico de alta durabilidad y estabilidad anatómica.",
    "desc": "Dispositivo ortopédico Anillo Subrotuliano Doble fabricado con materiales de grado clínico internacional Tynor. Proporciona soporte, compresión controlada y alivio anatómico óptimo para una rehabilitación segura y confortable.",
    "uses": [
      "Tratamiento y prevención de afecciones en zona de rodilla.",
      "Rehabilitación ortopédica post-traumática o post-quirúrgica.",
      "Soporte ergonómico de uso diario con alivio de carga articular."
    ],
    "features": [
      "Material transpirable hipoalergénico de alta resistencia",
      "Diseño ergonómico ajustable a la morfología del paciente",
      "Estructura diseñada bajo estándares ortopédicos internacionales"
    ],
    "colors": [
      {
        "id": "NEG",
        "name": "Negro",
        "hex": "#1E293B",
        "border": "#0F172A"
      }
    ]
  },
  {
    "code": "201",
    "name": "Tobillera Deportiva AIR PRO",
    "cat": "tobillo",
    "price": 170,
    "bodyPart": "tobillo",
    "badge": "Deportiva",
    "linea": "Deportiva",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL"
    ],
    "hasPdf": true,
    "hasVideo": false,
    "shortDesc": "Tobillera Deportiva AIR PRO diseñado para soporte terapéutico de alta durabilidad y estabilidad anatómica.",
    "desc": "Dispositivo ortopédico Tobillera Deportiva AIR PRO fabricado con materiales de grado clínico internacional Tynor. Proporciona soporte, compresión controlada y alivio anatómico óptimo para una rehabilitación segura y confortable.",
    "uses": [
      "Tratamiento y prevención de afecciones en zona de tobillo.",
      "Rehabilitación ortopédica post-traumática o post-quirúrgica.",
      "Soporte ergonómico de uso diario con alivio de carga articular."
    ],
    "features": [
      "Material transpirable hipoalergénico de alta resistencia",
      "Diseño ergonómico ajustable a la morfología del paciente",
      "Estructura diseñada bajo estándares ortopédicos internacionales"
    ],
    "colors": [
      {
        "id": "N",
        "name": "Naranja Neón",
        "hex": "#FF6B00",
        "border": "#EA580C"
      },
      {
        "id": "V",
        "name": "Verde Neón",
        "hex": "#10B981",
        "border": "#059669"
      }
    ],
    "priceBySize": {
      "CH": 170,
      "M": 170,
      "G": 170,
      "XL": 170
    }
  },
  {
    "code": "202",
    "name": "Tobillera Deportiva AIR PRO con Cinta en Ocho",
    "cat": "tobillo",
    "price": 190,
    "bodyPart": "tobillo",
    "badge": "Deportiva",
    "linea": "Deportiva",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL"
    ],
    "colors": [
      {
        "id": "N",
        "name": "Naranja Neón",
        "hex": "#FF6B00",
        "border": "#EA580C"
      },
      {
        "id": "V",
        "name": "Verde Neón",
        "hex": "#10B981",
        "border": "#059669"
      }
    ],
    "hasPdf": true,
    "hasVideo": false,
    "shortDesc": "Tobillera Deportiva AIR PRO con Cinta en Ocho diseñado para soporte terapéutico de alta durabilidad y estabilidad anatómica.",
    "desc": "Dispositivo ortopédico Tobillera Deportiva AIR PRO con Cinta en Ocho fabricado con materiales de grado clínico internacional Tynor. Proporciona soporte, compresión controlada y alivio anatómico óptimo para una rehabilitación segura y confortable.",
    "uses": [
      "Tratamiento y prevención de afecciones en zona de tobillo.",
      "Rehabilitación ortopédica post-traumática o post-quirúrgica.",
      "Soporte ergonómico de uso diario con alivio de carga articular."
    ],
    "features": [
      "Material transpirable hipoalergénico de alta resistencia",
      "Diseño ergonómico ajustable a la morfología del paciente",
      "Estructura diseñada bajo estándares ortopédicos internacionales"
    ],
    "priceBySize": {
      "CH": 190,
      "M": 190,
      "G": 190,
      "XL": 190
    }
  },
  {
    "code": "301",
    "name": "Muñequera Deportiva C/sujetador Pulgar (par)",
    "cat": "inmovilizador",
    "price": 225,
    "bodyPart": "mano",
    "badge": "Deportiva",
    "linea": "Deportiva",
    "sizes": [
      "Universal"
    ],
    "colors": [
      {
        "id": "N",
        "name": "Naranja Neón",
        "hex": "#FF6B00",
        "border": "#EA580C"
      },
      {
        "id": "V",
        "name": "Verde Neón",
        "hex": "#10B981",
        "border": "#059669"
      }
    ],
    "hasPdf": true,
    "hasVideo": false,
    "shortDesc": "Muñequera Deportiva C/sujetador Pulgar (par) diseñado para soporte terapéutico de alta durabilidad y estabilidad anatómica.",
    "desc": "Dispositivo ortopédico Muñequera Deportiva C/sujetador Pulgar (par) fabricado con materiales de grado clínico internacional Tynor. Proporciona soporte, compresión controlada y alivio anatómico óptimo para una rehabilitación segura y confortable.",
    "uses": [
      "Tratamiento y prevención de afecciones en zona de mano.",
      "Rehabilitación ortopédica post-traumática o post-quirúrgica.",
      "Soporte ergonómico de uso diario con alivio de carga articular."
    ],
    "features": [
      "Material transpirable hipoalergénico de alta resistencia",
      "Diseño ergonómico ajustable a la morfología del paciente",
      "Estructura diseñada bajo estándares ortopédicos internacionales"
    ],
    "priceBySize": {
      "UNITALLA": 225,
      "Universal": 225
    }
  },
  {
    "code": "302",
    "name": "Codera de Tenista Deportiva PRO",
    "cat": "hombro_brazo",
    "price": 150,
    "bodyPart": "brazo",
    "badge": "Deportiva",
    "linea": "Deportiva",
    "sizes": [
      "Universal"
    ],
    "colors": [
      {
        "id": "N",
        "name": "Naranja Neón",
        "hex": "#FF6B00",
        "border": "#EA580C"
      },
      {
        "id": "V",
        "name": "Verde Neón",
        "hex": "#10B981",
        "border": "#059669"
      }
    ],
    "hasPdf": true,
    "hasVideo": false,
    "shortDesc": "Codera de Tenista Deportiva PRO diseñado para soporte terapéutico de alta durabilidad y estabilidad anatómica.",
    "desc": "Dispositivo ortopédico Codera de Tenista Deportiva PRO fabricado con materiales de grado clínico internacional Tynor. Proporciona soporte, compresión controlada y alivio anatómico óptimo para una rehabilitación segura y confortable.",
    "uses": [
      "Tratamiento y prevención de afecciones en zona de brazo.",
      "Rehabilitación ortopédica post-traumática o post-quirúrgica.",
      "Soporte ergonómico de uso diario con alivio de carga articular."
    ],
    "features": [
      "Material transpirable hipoalergénico de alta resistencia",
      "Diseño ergonómico ajustable a la morfología del paciente",
      "Estructura diseñada bajo estándares ortopédicos internacionales"
    ],
    "priceBySize": {
      "UNITALLA": 150,
      "Universal": 150
    }
  },
  {
    "code": "303",
    "name": "Codera Deportiva AIR PRO con Soporte de Cinta",
    "cat": "hombro_brazo",
    "price": 175,
    "bodyPart": "brazo",
    "badge": "Deportiva",
    "linea": "Deportiva",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL"
    ],
    "hasPdf": true,
    "hasVideo": false,
    "shortDesc": "Codera Deportiva AIR PRO con Soporte de Cinta diseñado para soporte terapéutico de alta durabilidad y estabilidad anatómica.",
    "desc": "Dispositivo ortopédico Codera Deportiva AIR PRO con Soporte de Cinta fabricado con materiales de grado clínico internacional Tynor. Proporciona soporte, compresión controlada y alivio anatómico óptimo para una rehabilitación segura y confortable.",
    "uses": [
      "Tratamiento y prevención de afecciones en zona de brazo.",
      "Rehabilitación ortopédica post-traumática o post-quirúrgica.",
      "Soporte ergonómico de uso diario con alivio de carga articular."
    ],
    "features": [
      "Material transpirable hipoalergénico de alta resistencia",
      "Diseño ergonómico ajustable a la morfología del paciente",
      "Estructura diseñada bajo estándares ortopédicos internacionales"
    ],
    "colors": [
      {
        "id": "N",
        "name": "Naranja Neón",
        "hex": "#FF6B00",
        "border": "#EA580C"
      },
      {
        "id": "V",
        "name": "Verde Neón",
        "hex": "#10B981",
        "border": "#059669"
      }
    ],
    "priceBySize": {
      "CH": 175,
      "M": 175,
      "G": 175,
      "XL": 175
    }
  },
  {
    "code": "304",
    "name": "Codera Deportiva Neopreno",
    "cat": "hombro_brazo",
    "price": 225,
    "bodyPart": "brazo",
    "badge": "Deportiva",
    "linea": "Deportiva",
    "sizes": [
      "Unitalla"
    ],
    "colors": [
      {
        "id": "N",
        "name": "Naranja Neón",
        "hex": "#FF6B00",
        "border": "#EA580C"
      },
      {
        "id": "V",
        "name": "Verde Neón",
        "hex": "#10B981",
        "border": "#059669"
      }
    ],
    "hasPdf": true,
    "hasVideo": false,
    "shortDesc": "Codera Deportiva Neopreno diseñado para soporte terapéutico de alta durabilidad y estabilidad anatómica.",
    "desc": "Dispositivo ortopédico Codera Deportiva Neopreno fabricado con materiales de grado clínico internacional Tynor. Proporciona soporte, compresión controlada y alivio anatómico óptimo para una rehabilitación segura y confortable.",
    "uses": [
      "Tratamiento y prevención de afecciones en zona de brazo.",
      "Rehabilitación ortopédica post-traumática o post-quirúrgica.",
      "Soporte ergonómico de uso diario con alivio de carga articular."
    ],
    "features": [
      "Material transpirable hipoalergénico de alta resistencia",
      "Diseño ergonómico ajustable a la morfología del paciente",
      "Estructura diseñada bajo estándares ortopédicos internacionales"
    ],
    "priceBySize": {
      "UNITALLA": 225,
      "Unitalla": 225
    }
  },
  {
    "code": "401",
    "name": "Rodillera Deportiva Neopreno",
    "cat": "rodillera",
    "price": 375,
    "bodyPart": "rodilla",
    "badge": "Deportiva",
    "linea": "Deportiva",
    "sizes": [
      "Universal"
    ],
    "hasPdf": false,
    "hasVideo": false,
    "shortDesc": "Rodillera Deportiva Neopreno diseñado para soporte terapéutico de alta durabilidad y estabilidad anatómica.",
    "desc": "Dispositivo ortopédico Rodillera Deportiva Neopreno fabricado con materiales de grado clínico internacional Tynor. Proporciona soporte, compresión controlada y alivio anatómico óptimo para una rehabilitación segura y confortable.",
    "uses": [
      "Tratamiento y prevención de afecciones en zona de rodilla.",
      "Rehabilitación ortopédica post-traumática o post-quirúrgica.",
      "Soporte ergonómico de uso diario con alivio de carga articular."
    ],
    "features": [
      "Material transpirable hipoalergénico de alta resistencia",
      "Diseño ergonómico ajustable a la morfología del paciente",
      "Estructura diseñada bajo estándares ortopédicos internacionales"
    ],
    "colors": [
      {
        "id": "V",
        "name": "Verde",
        "hex": "#10B981",
        "border": "#059669"
      },
      {
        "id": "N",
        "name": "Naranja",
        "hex": "#FF6B00",
        "border": "#EA580C"
      }
    ],
    "priceBySize": {
      "UNITALLA": 375,
      "Universal": 375
    }
  },
  {
    "code": "402",
    "name": "Rodillera Deportiva Neopreno",
    "cat": "rodillera",
    "price": 275,
    "bodyPart": "rodilla",
    "badge": "Deportiva",
    "linea": "Deportiva",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL"
    ],
    "hasPdf": true,
    "hasVideo": false,
    "shortDesc": "Rodillera Deportiva Neopreno diseñado para soporte terapéutico de alta durabilidad y estabilidad anatómica.",
    "desc": "Dispositivo ortopédico Rodillera Deportiva Neopreno fabricado con materiales de grado clínico internacional Tynor. Proporciona soporte, compresión controlada y alivio anatómico óptimo para una rehabilitación segura y confortable.",
    "uses": [
      "Tratamiento y prevención de afecciones en zona de rodilla.",
      "Rehabilitación ortopédica post-traumática o post-quirúrgica.",
      "Soporte ergonómico de uso diario con alivio de carga articular."
    ],
    "features": [
      "Material transpirable hipoalergénico de alta resistencia",
      "Diseño ergonómico ajustable a la morfología del paciente",
      "Estructura diseñada bajo estándares ortopédicos internacionales"
    ],
    "colors": [
      {
        "id": "N",
        "name": "Naranja Neón",
        "hex": "#FF6B00",
        "border": "#EA580C"
      },
      {
        "id": "V",
        "name": "Verde Neón",
        "hex": "#10B981",
        "border": "#059669"
      }
    ],
    "priceBySize": {
      "CH": 275,
      "M": 275,
      "G": 275,
      "XL": 275
    }
  },
  {
    "code": "403",
    "name": "Soporte Deportivo para Tobillo",
    "cat": "tobillo",
    "price": 230,
    "bodyPart": "tobillo",
    "badge": "Deportiva",
    "linea": "Deportiva",
    "sizes": [
      "Universal"
    ],
    "colors": [
      {
        "id": "N",
        "name": "Naranja Neón",
        "hex": "#FF6B00",
        "border": "#EA580C"
      },
      {
        "id": "V",
        "name": "Verde Neón",
        "hex": "#10B981",
        "border": "#059669"
      }
    ],
    "hasPdf": true,
    "hasVideo": false,
    "shortDesc": "Soporte Deportivo para Tobillo diseñado para soporte terapéutico de alta durabilidad y estabilidad anatómica.",
    "desc": "Dispositivo ortopédico Soporte Deportivo para Tobillo fabricado con materiales de grado clínico internacional Tynor. Proporciona soporte, compresión controlada y alivio anatómico óptimo para una rehabilitación segura y confortable.",
    "uses": [
      "Tratamiento y prevención de afecciones en zona de tobillo.",
      "Rehabilitación ortopédica post-traumática o post-quirúrgica.",
      "Soporte ergonómico de uso diario con alivio de carga articular."
    ],
    "features": [
      "Material transpirable hipoalergénico de alta resistencia",
      "Diseño ergonómico ajustable a la morfología del paciente",
      "Estructura diseñada bajo estándares ortopédicos internacionales"
    ],
    "priceBySize": {
      "UNITALLA": 230,
      "Universal": 230
    }
  },
  {
    "code": "404",
    "name": "Soporte Deportivo Hombro Doble Cierre",
    "cat": "hombro_brazo",
    "price": 450,
    "bodyPart": "hombro",
    "badge": "Deportiva",
    "linea": "Deportiva",
    "sizes": [
      "Universal"
    ],
    "colors": [
      {
        "id": "N",
        "name": "Naranja Neón",
        "hex": "#FF6B00",
        "border": "#EA580C"
      },
      {
        "id": "V",
        "name": "Verde Neón",
        "hex": "#10B981",
        "border": "#059669"
      }
    ],
    "hasPdf": true,
    "hasVideo": false,
    "shortDesc": "Soporte Deportivo Hombro Doble Cierre diseñado para soporte terapéutico de alta durabilidad y estabilidad anatómica.",
    "desc": "Dispositivo ortopédico Soporte Deportivo Hombro Doble Cierre fabricado con materiales de grado clínico internacional Tynor. Proporciona soporte, compresión controlada y alivio anatómico óptimo para una rehabilitación segura y confortable.",
    "uses": [
      "Tratamiento y prevención de afecciones en zona de hombro.",
      "Rehabilitación ortopédica post-traumática o post-quirúrgica.",
      "Soporte ergonómico de uso diario con alivio de carga articular."
    ],
    "features": [
      "Material transpirable hipoalergénico de alta resistencia",
      "Diseño ergonómico ajustable a la morfología del paciente",
      "Estructura diseñada bajo estándares ortopédicos internacionales"
    ],
    "priceBySize": {
      "UNITALLA": 450,
      "Universal": 450
    }
  },
  {
    "code": "405",
    "name": "Muñequera Deportiva C/soporte Pulgar (par)",
    "cat": "inmovilizador",
    "price": 200,
    "bodyPart": "mano",
    "badge": "Deportiva",
    "linea": "Deportiva",
    "sizes": [
      "Universal"
    ],
    "colors": [
      {
        "id": "N",
        "name": "Naranja Neón",
        "hex": "#FF6B00",
        "border": "#EA580C"
      },
      {
        "id": "V",
        "name": "Verde Neón",
        "hex": "#10B981",
        "border": "#059669"
      }
    ],
    "hasPdf": true,
    "hasVideo": false,
    "shortDesc": "Muñequera Deportiva C/soporte Pulgar (par) diseñado para soporte terapéutico de alta durabilidad y estabilidad anatómica.",
    "desc": "Dispositivo ortopédico Muñequera Deportiva C/soporte Pulgar (par) fabricado con materiales de grado clínico internacional Tynor. Proporciona soporte, compresión controlada y alivio anatómico óptimo para una rehabilitación segura y confortable.",
    "uses": [
      "Tratamiento y prevención de afecciones en zona de mano.",
      "Rehabilitación ortopédica post-traumática o post-quirúrgica.",
      "Soporte ergonómico de uso diario con alivio de carga articular."
    ],
    "features": [
      "Material transpirable hipoalergénico de alta resistencia",
      "Diseño ergonómico ajustable a la morfología del paciente",
      "Estructura diseñada bajo estándares ortopédicos internacionales"
    ],
    "priceBySize": {
      "UNITALLA": 200,
      "Universal": 200
    }
  },
  {
    "code": "406",
    "name": "Soporte Deportivo Abdominal Sencillo",
    "cat": "lumbar",
    "price": 425,
    "bodyPart": "espalda",
    "badge": "Deportiva",
    "linea": "Deportiva",
    "sizes": [
      "Universal"
    ],
    "colors": [
      {
        "id": "N",
        "name": "Naranja Neón",
        "hex": "#FF6B00",
        "border": "#EA580C"
      },
      {
        "id": "V",
        "name": "Verde Neón",
        "hex": "#10B981",
        "border": "#059669"
      }
    ],
    "hasPdf": true,
    "hasVideo": false,
    "shortDesc": "Soporte Deportivo Abdominal Sencillo diseñado para soporte terapéutico de alta durabilidad y estabilidad anatómica.",
    "desc": "Dispositivo ortopédico Soporte Deportivo Abdominal Sencillo fabricado con materiales de grado clínico internacional Tynor. Proporciona soporte, compresión controlada y alivio anatómico óptimo para una rehabilitación segura y confortable.",
    "uses": [
      "Tratamiento y prevención de afecciones en zona de espalda.",
      "Rehabilitación ortopédica post-traumática o post-quirúrgica.",
      "Soporte ergonómico de uso diario con alivio de carga articular."
    ],
    "features": [
      "Material transpirable hipoalergénico de alta resistencia",
      "Diseño ergonómico ajustable a la morfología del paciente",
      "Estructura diseñada bajo estándares ortopédicos internacionales"
    ],
    "priceBySize": {
      "UNITALLA": 425,
      "Universal": 425
    }
  },
  {
    "code": "407",
    "name": "Soporte Deportivo Abdominal Ajustable",
    "cat": "lumbar",
    "price": 425,
    "bodyPart": "espalda",
    "badge": "Deportiva",
    "linea": "Deportiva",
    "sizes": [
      "Universal"
    ],
    "colors": [
      {
        "id": "N",
        "name": "Naranja Neón",
        "hex": "#FF6B00",
        "border": "#EA580C"
      },
      {
        "id": "V",
        "name": "Verde Neón",
        "hex": "#10B981",
        "border": "#059669"
      }
    ],
    "hasPdf": true,
    "hasVideo": false,
    "shortDesc": "Soporte Deportivo Abdominal Ajustable diseñado para soporte terapéutico de alta durabilidad y estabilidad anatómica.",
    "desc": "Dispositivo ortopédico Soporte Deportivo Abdominal Ajustable fabricado con materiales de grado clínico internacional Tynor. Proporciona soporte, compresión controlada y alivio anatómico óptimo para una rehabilitación segura y confortable.",
    "uses": [
      "Tratamiento y prevención de afecciones en zona de espalda.",
      "Rehabilitación ortopédica post-traumática o post-quirúrgica.",
      "Soporte ergonómico de uso diario con alivio de carga articular."
    ],
    "features": [
      "Material transpirable hipoalergénico de alta resistencia",
      "Diseño ergonómico ajustable a la morfología del paciente",
      "Estructura diseñada bajo estándares ortopédicos internacionales"
    ],
    "priceBySize": {
      "UNITALLA": 425,
      "Universal": 425
    }
  },
  {
    "code": "408",
    "name": "Muñequera Deportiva (par)",
    "cat": "inmovilizador",
    "price": 200,
    "bodyPart": "mano",
    "badge": "Deportiva",
    "linea": "Deportiva",
    "sizes": [
      "Universal"
    ],
    "colors": [
      {
        "id": "V",
        "name": "Verde",
        "hex": "#10B981",
        "border": "#059669"
      },
      {
        "id": "N",
        "name": "Naranja",
        "hex": "#FF6B00",
        "border": "#EA580C"
      }
    ],
    "hasPdf": true,
    "hasVideo": false,
    "shortDesc": "Muñequera Deportiva (par) diseñado para soporte terapéutico de alta durabilidad y estabilidad anatómica.",
    "desc": "Dispositivo ortopédico Muñequera Deportiva (par) fabricado con materiales de grado clínico internacional Tynor. Proporciona soporte, compresión controlada y alivio anatómico óptimo para una rehabilitación segura y confortable.",
    "uses": [
      "Tratamiento y prevención de afecciones en zona de mano.",
      "Rehabilitación ortopédica post-traumática o post-quirúrgica.",
      "Soporte ergonómico de uso diario con alivio de carga articular."
    ],
    "features": [
      "Material transpirable hipoalergénico de alta resistencia",
      "Diseño ergonómico ajustable a la morfología del paciente",
      "Estructura diseñada bajo estándares ortopédicos internacionales"
    ],
    "priceBySize": {
      "UNITALLA": 200,
      "Universal": 200
    }
  },
  {
    "code": "414",
    "name": "Rodillera Deportiva Cerrada Neopreno",
    "cat": "rodillera",
    "price": null,
    "bodyPart": "rodilla",
    "badge": "Deportiva",
    "linea": "Deportiva",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL",
      "XXL"
    ],
    "hasPdf": false,
    "hasVideo": false,
    "shortDesc": "Rodillera Deportiva Cerrada Neopreno diseñado para soporte terapéutico de alta durabilidad y estabilidad anatómica.",
    "desc": "Dispositivo ortopédico Rodillera Deportiva Cerrada Neopreno fabricado con materiales de grado clínico internacional Tynor. Proporciona soporte, compresión controlada y alivio anatómico óptimo para una rehabilitación segura y confortable.",
    "uses": [
      "Tratamiento y prevención de afecciones en zona de rodilla.",
      "Rehabilitación ortopédica post-traumática o post-quirúrgica.",
      "Soporte ergonómico de uso diario con alivio de carga articular."
    ],
    "features": [
      "Material transpirable hipoalergénico de alta resistencia",
      "Diseño ergonómico ajustable a la morfología del paciente",
      "Estructura diseñada bajo estándares ortopédicos internacionales"
    ],
    "colors": [
      {
        "id": "N",
        "name": "Negro",
        "hex": "#1E293B",
        "border": "#0F172A"
      },
      {
        "id": "V",
        "name": "Verde",
        "hex": "#10B981",
        "border": "#059669"
      }
    ]
  },
  {
    "code": "702",
    "name": "Espinillera y Pantorrillera Deportiva AIR PRO (par)",
    "cat": "todos",
    "price": 225,
    "bodyPart": "pierna",
    "badge": "Deportiva",
    "linea": "Deportiva",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL"
    ],
    "hasPdf": true,
    "hasVideo": false,
    "shortDesc": "Espinillera y Pantorrillera Deportiva AIR PRO (par) diseñado para soporte terapéutico de alta durabilidad y estabilidad anatómica.",
    "desc": "Dispositivo ortopédico Espinillera y Pantorrillera Deportiva AIR PRO (par) fabricado con materiales de grado clínico internacional Tynor. Proporciona soporte, compresión controlada y alivio anatómico óptimo para una rehabilitación segura y confortable.",
    "uses": [
      "Tratamiento y prevención de afecciones en zona de pierna.",
      "Rehabilitación ortopédica post-traumática o post-quirúrgica.",
      "Soporte ergonómico de uso diario con alivio de carga articular."
    ],
    "features": [
      "Material transpirable hipoalergénico de alta resistencia",
      "Diseño ergonómico ajustable a la morfología del paciente",
      "Estructura diseñada bajo estándares ortopédicos internacionales"
    ],
    "colors": [
      {
        "id": "N",
        "name": "Naranja Neón",
        "hex": "#FF6B00",
        "border": "#EA580C"
      },
      {
        "id": "V",
        "name": "Verde Neón",
        "hex": "#10B981",
        "border": "#059669"
      }
    ],
    "priceBySize": {
      "CH": 225,
      "M": 225,
      "G": 225,
      "XL": 225
    }
  },
  {
    "code": "703",
    "name": "Espinillera y Pantorrillera Neopreno",
    "cat": "todos",
    "price": 295,
    "bodyPart": "pierna",
    "badge": "Deportiva",
    "linea": "Deportiva",
    "sizes": [
      "Unitalla"
    ],
    "hasPdf": true,
    "hasVideo": false,
    "shortDesc": "Espinillera y Pantorrillera Neopreno diseñado para soporte terapéutico de alta durabilidad y estabilidad anatómica.",
    "desc": "Dispositivo ortopédico Espinillera y Pantorrillera Neopreno fabricado con materiales de grado clínico internacional Tynor. Proporciona soporte, compresión controlada y alivio anatómico óptimo para una rehabilitación segura y confortable.",
    "uses": [
      "Tratamiento y prevención de afecciones en zona de pierna.",
      "Rehabilitación ortopédica post-traumática o post-quirúrgica.",
      "Soporte ergonómico de uso diario con alivio de carga articular."
    ],
    "features": [
      "Material transpirable hipoalergénico de alta resistencia",
      "Diseño ergonómico ajustable a la morfología del paciente",
      "Estructura diseñada bajo estándares ortopédicos internacionales"
    ],
    "colors": [
      {
        "id": "N",
        "name": "Naranja Neón",
        "hex": "#FF6B00",
        "border": "#EA580C"
      },
      {
        "id": "V",
        "name": "Verde Neón",
        "hex": "#10B981",
        "border": "#059669"
      }
    ],
    "priceBySize": {
      "UNITALLA": 295,
      "Unitalla": 295
    }
  },
  {
    "code": "704",
    "name": "Manga Elástica de Proteccion",
    "cat": "hombro_brazo",
    "price": 95,
    "bodyPart": "brazo",
    "badge": "Deportiva",
    "linea": "Deportiva",
    "sizes": [
      "Universal"
    ],
    "hasPdf": true,
    "hasVideo": false,
    "shortDesc": "Manga Elástica de Proteccion diseñado para soporte terapéutico de alta durabilidad y estabilidad anatómica.",
    "desc": "Dispositivo ortopédico Manga Elástica de Proteccion fabricado con materiales de grado clínico internacional Tynor. Proporciona soporte, compresión controlada y alivio anatómico óptimo para una rehabilitación segura y confortable.",
    "uses": [
      "Tratamiento y prevención de afecciones en zona de brazo.",
      "Rehabilitación ortopédica post-traumática o post-quirúrgica.",
      "Soporte ergonómico de uso diario con alivio de carga articular."
    ],
    "features": [
      "Material transpirable hipoalergénico de alta resistencia",
      "Diseño ergonómico ajustable a la morfología del paciente",
      "Estructura diseñada bajo estándares ortopédicos internacionales"
    ],
    "colors": [
      {
        "id": "N",
        "name": "Naranja",
        "hex": "#FF6B00",
        "border": "#EA580C"
      },
      {
        "id": "V",
        "name": "Verde",
        "hex": "#10B981",
        "border": "#059669"
      }
    ],
    "priceBySize": {
      "UNITALLA": 95,
      "Universal": 95
    }
  },
  {
    "code": "706",
    "name": "Protector de Dedos (kit C/10 Piezas)",
    "cat": "inmovilizador",
    "price": null,
    "bodyPart": "mano",
    "badge": "Deportiva",
    "linea": "Deportiva",
    "sizes": [
      "Universal"
    ],
    "hasPdf": false,
    "hasVideo": false,
    "shortDesc": "Protector de Dedos (kit C/10 Piezas) diseñado para soporte terapéutico de alta durabilidad y estabilidad anatómica.",
    "desc": "Dispositivo ortopédico Protector de Dedos (kit C/10 Piezas) fabricado con materiales de grado clínico internacional Tynor. Proporciona soporte, compresión controlada y alivio anatómico óptimo para una rehabilitación segura y confortable.",
    "uses": [
      "Tratamiento y prevención de afecciones en zona de mano.",
      "Rehabilitación ortopédica post-traumática o post-quirúrgica.",
      "Soporte ergonómico de uso diario con alivio de carga articular."
    ],
    "features": [
      "Material transpirable hipoalergénico de alta resistencia",
      "Diseño ergonómico ajustable a la morfología del paciente",
      "Estructura diseñada bajo estándares ortopédicos internacionales"
    ]
  },
  {
    "code": "911",
    "name": "Correa para Levantamiento de Pesas",
    "cat": "todos",
    "price": null,
    "bodyPart": "pierna",
    "badge": "Deportiva",
    "linea": "Deportiva",
    "sizes": [
      "Universal"
    ],
    "hasPdf": false,
    "hasVideo": false,
    "shortDesc": "Correa para Levantamiento de Pesas diseñado para soporte terapéutico de alta durabilidad y estabilidad anatómica.",
    "desc": "Dispositivo ortopédico Correa para Levantamiento de Pesas fabricado con materiales de grado clínico internacional Tynor. Proporciona soporte, compresión controlada y alivio anatómico óptimo para una rehabilitación segura y confortable.",
    "uses": [
      "Tratamiento y prevención de afecciones en zona de pierna.",
      "Rehabilitación ortopédica post-traumática o post-quirúrgica.",
      "Soporte ergonómico de uso diario con alivio de carga articular."
    ],
    "features": [
      "Material transpirable hipoalergénico de alta resistencia",
      "Diseño ergonómico ajustable a la morfología del paciente",
      "Estructura diseñada bajo estándares ortopédicos internacionales"
    ]
  },
  {
    "code": "A01",
    "name": "Faja Sacrolumbar Reforzada",
    "cat": "lumbar",
    "price": 344.0,
    "bodyPart": "espalda",
    "badge": "ORTOPEDIA",
    "linea": "ORTOPEDIA",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL",
      "XXL"
    ],
    "hasPdf": true,
    "hasVideo": false,
    "shortDesc": "Estabilidad dorsal y descompresión lumbosacra con varillas anatómicas flexibles.",
    "desc": "Soporte lumbosacro de grado terapéutico con doble banda de contra-tracción elástica y varillas posteriores que descargan la presión de las vértebras lumbares.",
    "uses": [
      "Lumbalgias agudas, dolor lumbosacro y ciática.",
      "Hernias discales y espondilólisis.",
      "Soporte preventivo ocupacional y levantamiento de carga."
    ],
    "features": [
      "Varillas dorsales anatómicas de soporte rígido",
      "Doble banda elástica de contra-tracción para compresión ajustable",
      "Tejido monofilamento elástico poroso de máxima ventilación"
    ],
    "priceBySize": {
      "CH": 344.0,
      "M": 344.0,
      "G": 344.0,
      "XL": 392.0,
      "XXL": 392.0
    }
  },
  {
    "code": "A03",
    "name": "Reductor de Vientre",
    "cat": "lumbar",
    "price": 385.0,
    "bodyPart": "espalda",
    "badge": "ORTOPEDIA",
    "linea": "ORTOPEDIA",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL",
      "XXL"
    ],
    "hasPdf": true,
    "hasVideo": false,
    "shortDesc": "Reductor de Vientre diseñado para soporte terapéutico de alta durabilidad y estabilidad anatómica.",
    "desc": "Dispositivo ortopédico Reductor de Vientre fabricado con materiales de grado clínico internacional Tynor. Proporciona soporte, compresión controlada y alivio anatómico óptimo para una rehabilitación segura y confortable.",
    "uses": [
      "Tratamiento y prevención de afecciones en zona de espalda.",
      "Rehabilitación ortopédica post-traumática o post-quirúrgica.",
      "Soporte ergonómico de uso diario con alivio de carga articular."
    ],
    "features": [
      "Material transpirable hipoalergénico de alta resistencia",
      "Diseño ergonómico ajustable a la morfología del paciente",
      "Estructura diseñada bajo estándares ortopédicos internacionales"
    ],
    "priceBySize": {
      "CH": 385.0,
      "M": 385.0,
      "G": 385.0,
      "XL": 427.0,
      "XXL": 427.0
    }
  },
  {
    "code": "A04",
    "name": "Faja Sacrolumbar Varillas Semirigidas",
    "cat": "lumbar",
    "price": 552.0,
    "bodyPart": "espalda",
    "badge": "ORTOPEDIA",
    "linea": "ORTOPEDIA",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL",
      "XXL"
    ],
    "hasPdf": true,
    "hasVideo": false,
    "shortDesc": "Faja Sacrolumbar Varillas Semirigidas diseñado para soporte terapéutico de alta durabilidad y estabilidad anatómica.",
    "desc": "Dispositivo ortopédico Faja Sacrolumbar Varillas Semirigidas fabricado con materiales de grado clínico internacional Tynor. Proporciona soporte, compresión controlada y alivio anatómico óptimo para una rehabilitación segura y confortable.",
    "uses": [
      "Tratamiento y prevención de afecciones en zona de espalda.",
      "Rehabilitación ortopédica post-traumática o post-quirúrgica.",
      "Soporte ergonómico de uso diario con alivio de carga articular."
    ],
    "features": [
      "Material transpirable hipoalergénico de alta resistencia",
      "Diseño ergonómico ajustable a la morfología del paciente",
      "Estructura diseñada bajo estándares ortopédicos internacionales"
    ],
    "priceBySize": {
      "CH": 552.0,
      "M": 552.0,
      "G": 552.0,
      "XL": 598.0,
      "XXL": 598.0
    }
  },
  {
    "code": "A05",
    "name": "Faja Sacrolumbar con Soporte Acojinado",
    "cat": "lumbar",
    "price": 433.0,
    "bodyPart": "espalda",
    "badge": "ORTOPEDIA",
    "linea": "ORTOPEDIA",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL",
      "XXL",
      "XXXL"
    ],
    "hasPdf": true,
    "hasVideo": false,
    "shortDesc": "Faja Sacrolumbar con Soporte Acojinado diseñado para soporte terapéutico de alta durabilidad y estabilidad anatómica.",
    "desc": "Dispositivo ortopédico Faja Sacrolumbar con Soporte Acojinado fabricado con materiales de grado clínico internacional Tynor. Proporciona soporte, compresión controlada y alivio anatómico óptimo para una rehabilitación segura y confortable.",
    "uses": [
      "Tratamiento y prevención de afecciones en zona de espalda.",
      "Rehabilitación ortopédica post-traumática o post-quirúrgica.",
      "Soporte ergonómico de uso diario con alivio de carga articular."
    ],
    "features": [
      "Material transpirable hipoalergénico de alta resistencia",
      "Diseño ergonómico ajustable a la morfología del paciente",
      "Estructura diseñada bajo estándares ortopédicos internacionales"
    ],
    "priceBySize": {
      "CH": 433.0,
      "M": 433.0,
      "G": 433.0,
      "XL": 488.0,
      "XXL": 488.0,
      "XXXL": 516.0
    }
  },
  {
    "code": "A06",
    "name": "Faja Sacrolumbar con Soporte Acojinado Black",
    "cat": "lumbar",
    "price": 433.0,
    "bodyPart": "espalda",
    "badge": "ORTOPEDIA",
    "linea": "ORTOPEDIA",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL",
      "XXL"
    ],
    "hasPdf": true,
    "hasVideo": false,
    "shortDesc": "Faja Sacrolumbar con Soporte Acojinado Black diseñado para soporte terapéutico de alta durabilidad y estabilidad anatómica.",
    "desc": "Dispositivo ortopédico Faja Sacrolumbar con Soporte Acojinado Black fabricado con materiales de grado clínico internacional Tynor. Proporciona soporte, compresión controlada y alivio anatómico óptimo para una rehabilitación segura y confortable.",
    "uses": [
      "Tratamiento y prevención de afecciones en zona de espalda.",
      "Rehabilitación ortopédica post-traumática o post-quirúrgica.",
      "Soporte ergonómico de uso diario con alivio de carga articular."
    ],
    "features": [
      "Material transpirable hipoalergénico de alta resistencia",
      "Diseño ergonómico ajustable a la morfología del paciente",
      "Estructura diseñada bajo estándares ortopédicos internacionales"
    ],
    "colors": [
      {
        "id": "NEGRO",
        "name": "Negro (Black)",
        "hex": "#1E293B",
        "border": "#0F172A"
      }
    ],
    "priceBySize": {
      "CH": 433.0,
      "M": 433.0,
      "G": 433.0,
      "XL": 488.0,
      "XXL": 488.0
    }
  },
  {
    "code": "A07",
    "name": "Faja Sacrolumbar con Varillas Rigidas",
    "cat": "lumbar",
    "price": 605.0,
    "bodyPart": "espalda",
    "badge": "ORTOPEDIA",
    "linea": "ORTOPEDIA",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL",
      "XXL",
      "XXXL"
    ],
    "hasPdf": true,
    "hasVideo": false,
    "shortDesc": "Faja Sacrolumbar con Varillas Rigidas diseñado para soporte terapéutico de alta durabilidad y estabilidad anatómica.",
    "desc": "Dispositivo ortopédico Faja Sacrolumbar con Varillas Rigidas fabricado con materiales de grado clínico internacional Tynor. Proporciona soporte, compresión controlada y alivio anatómico óptimo para una rehabilitación segura y confortable.",
    "uses": [
      "Tratamiento y prevención de afecciones en zona de espalda.",
      "Rehabilitación ortopédica post-traumática o post-quirúrgica.",
      "Soporte ergonómico de uso diario con alivio de carga articular."
    ],
    "features": [
      "Material transpirable hipoalergénico de alta resistencia",
      "Diseño ergonómico ajustable a la morfología del paciente",
      "Estructura diseñada bajo estándares ortopédicos internacionales"
    ],
    "priceBySize": {
      "CH": 605.0,
      "M": 605.0,
      "G": 605.0,
      "XL": 605.0,
      "XXL": 625.0,
      "XXXL": 625.0
    }
  },
  {
    "code": "A09",
    "name": "Cinturon Torácico Regular",
    "cat": "lumbar",
    "price": 303.0,
    "bodyPart": "espalda",
    "badge": "ORTOPEDIA",
    "linea": "ORTOPEDIA",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL"
    ],
    "hasPdf": true,
    "hasVideo": false,
    "shortDesc": "Cinturon Torácico Regular diseñado para soporte terapéutico de alta durabilidad y estabilidad anatómica.",
    "desc": "Dispositivo ortopédico Cinturon Torácico Regular fabricado con materiales de grado clínico internacional Tynor. Proporciona soporte, compresión controlada y alivio anatómico óptimo para una rehabilitación segura y confortable.",
    "uses": [
      "Tratamiento y prevención de afecciones en zona de espalda.",
      "Rehabilitación ortopédica post-traumática o post-quirúrgica.",
      "Soporte ergonómico de uso diario con alivio de carga articular."
    ],
    "features": [
      "Material transpirable hipoalergénico de alta resistencia",
      "Diseño ergonómico ajustable a la morfología del paciente",
      "Estructura diseñada bajo estándares ortopédicos internacionales"
    ],
    "priceBySize": {
      "CH": 303.0,
      "M": 303.0,
      "G": 303.0,
      "XL": 303.0
    }
  },
  {
    "code": "A11",
    "name": "Soporte de Pecho",
    "cat": "lumbar",
    "price": 474.0,
    "bodyPart": "espalda",
    "badge": "ORTOPEDIA",
    "linea": "ORTOPEDIA",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL",
      "XXL",
      "XXXL",
      "XXXXL"
    ],
    "hasPdf": true,
    "hasVideo": false,
    "shortDesc": "Soporte de Pecho diseñado para soporte terapéutico de alta durabilidad y estabilidad anatómica.",
    "desc": "Dispositivo ortopédico Soporte de Pecho fabricado con materiales de grado clínico internacional Tynor. Proporciona soporte, compresión controlada y alivio anatómico óptimo para una rehabilitación segura y confortable.",
    "uses": [
      "Tratamiento y prevención de afecciones en zona de espalda.",
      "Rehabilitación ortopédica post-traumática o post-quirúrgica.",
      "Soporte ergonómico de uso diario con alivio de carga articular."
    ],
    "features": [
      "Material transpirable hipoalergénico de alta resistencia",
      "Diseño ergonómico ajustable a la morfología del paciente",
      "Estructura diseñada bajo estándares ortopédicos internacionales"
    ],
    "priceBySize": {
      "CH": 474.0,
      "M": 474.0,
      "G": 474.0,
      "XL": 474.0,
      "XXL": 516.0,
      "XXXL": 550.0,
      "XXXXL": 584.0
    }
  },
  {
    "code": "A12",
    "name": "Corset de Hiperextension (tipo Cash)",
    "cat": "lumbar",
    "price": 930.0,
    "bodyPart": "espalda",
    "badge": "ORTOPEDIA",
    "linea": "ORTOPEDIA",
    "sizes": [
      "CH Corto",
      "G Largo"
    ],
    "hasPdf": true,
    "hasVideo": false,
    "shortDesc": "Corset de Hiperextension (tipo Cash) diseñado para soporte terapéutico de alta durabilidad y estabilidad anatómica.",
    "desc": "Dispositivo ortopédico Corset de Hiperextension (tipo Cash) fabricado con materiales de grado clínico internacional Tynor. Proporciona soporte, compresión controlada y alivio anatómico óptimo para una rehabilitación segura y confortable.",
    "uses": [
      "Tratamiento y prevención de afecciones en zona de espalda.",
      "Rehabilitación ortopédica post-traumática o post-quirúrgica.",
      "Soporte ergonómico de uso diario con alivio de carga articular."
    ],
    "features": [
      "Material transpirable hipoalergénico de alta resistencia",
      "Diseño ergonómico ajustable a la morfología del paciente",
      "Estructura diseñada bajo estándares ortopédicos internacionales"
    ],
    "priceBySize": {
      "CH Corto": 930.0,
      "G Largo": 930.0
    }
  },
  {
    "code": "A13",
    "name": "Corset de Taylor",
    "cat": "lumbar",
    "price": 1252.0,
    "bodyPart": "espalda",
    "badge": "ORTOPEDIA",
    "linea": "ORTOPEDIA",
    "sizes": [
      "Universal (CR)",
      "Universal (LG)",
      "Talla Especial (CR)",
      "Talla Especial (LG)"
    ],
    "hasPdf": true,
    "hasVideo": false,
    "shortDesc": "Corset de Taylor diseñado para soporte terapéutico de alta durabilidad y estabilidad anatómica.",
    "desc": "Dispositivo ortopédico Corset de Taylor fabricado con materiales de grado clínico internacional Tynor. Proporciona soporte, compresión controlada y alivio anatómico óptimo para una rehabilitación segura y confortable.",
    "uses": [
      "Tratamiento y prevención de afecciones en zona de espalda.",
      "Rehabilitación ortopédica post-traumática o post-quirúrgica.",
      "Soporte ergonómico de uso diario con alivio de carga articular."
    ],
    "features": [
      "Material transpirable hipoalergénico de alta resistencia",
      "Diseño ergonómico ajustable a la morfología del paciente",
      "Estructura diseñada bajo estándares ortopédicos internacionales"
    ],
    "priceBySize": {
      "Universal (CR)": 1252.0,
      "Universal (LG)": 1252.0,
      "Talla Especial (CR)": 1313.0,
      "Talla Especial (LG)": 1313.0
    }
  },
  {
    "code": "A15",
    "name": "Soporte Lumbar",
    "cat": "lumbar",
    "price": 535.0,
    "bodyPart": "espalda",
    "badge": "ORTOPEDIA",
    "linea": "ORTOPEDIA",
    "sizes": [
      "Universal",
      "Talla Especial"
    ],
    "hasPdf": true,
    "hasVideo": false,
    "shortDesc": "Soporte Lumbar diseñado para soporte terapéutico de alta durabilidad y estabilidad anatómica.",
    "desc": "Dispositivo ortopédico Soporte Lumbar fabricado con materiales de grado clínico internacional Tynor. Proporciona soporte, compresión controlada y alivio anatómico óptimo para una rehabilitación segura y confortable.",
    "uses": [
      "Tratamiento y prevención de afecciones en zona de espalda.",
      "Rehabilitación ortopédica post-traumática o post-quirúrgica.",
      "Soporte ergonómico de uso diario con alivio de carga articular."
    ],
    "features": [
      "Material transpirable hipoalergénico de alta resistencia",
      "Diseño ergonómico ajustable a la morfología del paciente",
      "Estructura diseñada bajo estándares ortopédicos internacionales"
    ],
    "priceBySize": {
      "Universal": 535.0,
      "Talla Especial": 535.0
    }
  },
  {
    "code": "A16",
    "name": "Faja Inguinal Regular",
    "cat": "lumbar",
    "price": 344.0,
    "bodyPart": "espalda",
    "badge": "ORTOPEDIA",
    "linea": "ORTOPEDIA",
    "sizes": [
      "CH",
      "G",
      "XL"
    ],
    "hasPdf": true,
    "hasVideo": false,
    "shortDesc": "Faja Inguinal Regular diseñado para soporte terapéutico de alta durabilidad y estabilidad anatómica.",
    "desc": "Dispositivo ortopédico Faja Inguinal Regular fabricado con materiales de grado clínico internacional Tynor. Proporciona soporte, compresión controlada y alivio anatómico óptimo para una rehabilitación segura y confortable.",
    "uses": [
      "Tratamiento y prevención de afecciones en zona de espalda.",
      "Rehabilitación ortopédica post-traumática o post-quirúrgica.",
      "Soporte ergonómico de uso diario con alivio de carga articular."
    ],
    "features": [
      "Material transpirable hipoalergénico de alta resistencia",
      "Diseño ergonómico ajustable a la morfología del paciente",
      "Estructura diseñada bajo estándares ortopédicos internacionales"
    ],
    "priceBySize": {
      "CH": 344.0,
      "G": 344.0,
      "XL": 344.0
    }
  },
  {
    "code": "A29",
    "name": "Faja de Tracción Lumbar Reforzada",
    "cat": "lumbar",
    "price": 1025.0,
    "bodyPart": "espalda",
    "badge": "ORTOPEDIA",
    "linea": "ORTOPEDIA",
    "sizes": [
      "CH - M",
      "G - XL",
      "XXL"
    ],
    "hasPdf": true,
    "hasVideo": false,
    "shortDesc": "Faja de Tracción Lumbar Reforzada diseñado para soporte terapéutico de alta durabilidad y estabilidad anatómica.",
    "desc": "Dispositivo ortopédico Faja de Tracción Lumbar Reforzada fabricado con materiales de grado clínico internacional Tynor. Proporciona soporte, compresión controlada y alivio anatómico óptimo para una rehabilitación segura y confortable.",
    "uses": [
      "Tratamiento y prevención de afecciones en zona de espalda.",
      "Rehabilitación ortopédica post-traumática o post-quirúrgica.",
      "Soporte ergonómico de uso diario con alivio de carga articular."
    ],
    "features": [
      "Material transpirable hipoalergénico de alta resistencia",
      "Diseño ergonómico ajustable a la morfología del paciente",
      "Estructura diseñada bajo estándares ortopédicos internacionales"
    ],
    "priceBySize": {
      "CH - M": 1025.0,
      "G - XL": 1025.0,
      "XXL": 1175.0
    }
  },
  {
    "code": "A30",
    "name": "Faja de Tracción Lumbar Sencilla",
    "cat": "lumbar",
    "price": 1025.0,
    "bodyPart": "espalda",
    "badge": "ORTOPEDIA",
    "linea": "ORTOPEDIA",
    "sizes": [
      "CH - M",
      "G - XL",
      "XXL"
    ],
    "hasPdf": true,
    "hasVideo": false,
    "shortDesc": "Faja de Tracción Lumbar Sencilla diseñado para soporte terapéutico de alta durabilidad y estabilidad anatómica.",
    "desc": "Dispositivo ortopédico Faja de Tracción Lumbar Sencilla fabricado con materiales de grado clínico internacional Tynor. Proporciona soporte, compresión controlada y alivio anatómico óptimo para una rehabilitación segura y confortable.",
    "uses": [
      "Tratamiento y prevención de afecciones en zona de espalda.",
      "Rehabilitación ortopédica post-traumática o post-quirúrgica.",
      "Soporte ergonómico de uso diario con alivio de carga articular."
    ],
    "features": [
      "Material transpirable hipoalergénico de alta resistencia",
      "Diseño ergonómico ajustable a la morfología del paciente",
      "Estructura diseñada bajo estándares ortopédicos internacionales"
    ],
    "priceBySize": {
      "CH - M": 1025.0,
      "G - XL": 1025.0,
      "XXL": 1175.0
    }
  },
  {
    "code": "A33",
    "name": "Corrector de Postura",
    "cat": "clavicula",
    "price": 495.0,
    "bodyPart": "clavicula",
    "badge": "ORTOPEDIA",
    "linea": "ORTOPEDIA",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL",
      "Pediátrico"
    ],
    "hasPdf": true,
    "hasVideo": false,
    "shortDesc": "Corrector de Postura diseñado para soporte terapéutico de alta durabilidad y estabilidad anatómica.",
    "desc": "Dispositivo ortopédico Corrector de Postura fabricado con materiales de grado clínico internacional Tynor. Proporciona soporte, compresión controlada y alivio anatómico óptimo para una rehabilitación segura y confortable.",
    "uses": [
      "Tratamiento y prevención de afecciones en zona de clavicula.",
      "Rehabilitación ortopédica post-traumática o post-quirúrgica.",
      "Soporte ergonómico de uso diario con alivio de carga articular."
    ],
    "features": [
      "Material transpirable hipoalergénico de alta resistencia",
      "Diseño ergonómico ajustable a la morfología del paciente",
      "Estructura diseñada bajo estándares ortopédicos internacionales"
    ],
    "priceBySize": {
      "CH": 495.0,
      "M": 495.0,
      "G": 495.0,
      "XL": 495.0,
      "Pediátrico": 495.0
    }
  },
  {
    "code": "A35",
    "name": "Soporte de Maternidad Black",
    "cat": "lumbar",
    "price": 400.0,
    "bodyPart": "espalda",
    "badge": "ORTOPEDIA",
    "linea": "ORTOPEDIA",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL",
      "XXL"
    ],
    "hasPdf": true,
    "hasVideo": false,
    "shortDesc": "Soporte de Maternidad Black diseñado para soporte terapéutico de alta durabilidad y estabilidad anatómica.",
    "desc": "Dispositivo ortopédico Soporte de Maternidad Black fabricado con materiales de grado clínico internacional Tynor. Proporciona soporte, compresión controlada y alivio anatómico óptimo para una rehabilitación segura y confortable.",
    "uses": [
      "Tratamiento y prevención de afecciones en zona de espalda.",
      "Rehabilitación ortopédica post-traumática o post-quirúrgica.",
      "Soporte ergonómico de uso diario con alivio de carga articular."
    ],
    "features": [
      "Material transpirable hipoalergénico de alta resistencia",
      "Diseño ergonómico ajustable a la morfología del paciente",
      "Estructura diseñada bajo estándares ortopédicos internacionales"
    ],
    "colors": [
      {
        "id": "NEGRO",
        "name": "Negro (Black)",
        "hex": "#1E293B",
        "border": "#0F172A"
      }
    ],
    "priceBySize": {
      "CH": 400.0,
      "M": 400.0,
      "G": 400.0,
      "XL": 450.0,
      "XXL": 450.0
    }
  },
  {
    "code": "A36",
    "name": "Cinturon de Sujecion Lumbar",
    "cat": "lumbar",
    "price": 495.0,
    "bodyPart": "espalda",
    "badge": "ORTOPEDIA",
    "linea": "ORTOPEDIA",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL",
      "XXL"
    ],
    "hasPdf": true,
    "hasVideo": false,
    "shortDesc": "Cinturon de Sujecion Lumbar diseñado para soporte terapéutico de alta durabilidad y estabilidad anatómica.",
    "desc": "Dispositivo ortopédico Cinturon de Sujecion Lumbar fabricado con materiales de grado clínico internacional Tynor. Proporciona soporte, compresión controlada y alivio anatómico óptimo para una rehabilitación segura y confortable.",
    "uses": [
      "Tratamiento y prevención de afecciones en zona de espalda.",
      "Rehabilitación ortopédica post-traumática o post-quirúrgica.",
      "Soporte ergonómico de uso diario con alivio de carga articular."
    ],
    "features": [
      "Material transpirable hipoalergénico de alta resistencia",
      "Diseño ergonómico ajustable a la morfología del paciente",
      "Estructura diseñada bajo estándares ortopédicos internacionales"
    ],
    "priceBySize": {
      "CH": 495.0,
      "M": 495.0,
      "G": 495.0,
      "XL": 525.0,
      "XXL": 550.0
    }
  },
  {
    "code": "A38",
    "name": "Corrector de Postura Black",
    "cat": "clavicula",
    "price": 275.0,
    "bodyPart": "clavicula",
    "badge": "ORTOPEDIA",
    "linea": "ORTOPEDIA",
    "sizes": [
      "Universal"
    ],
    "hasPdf": true,
    "hasVideo": false,
    "shortDesc": "Corrector de Postura Black diseñado para soporte terapéutico de alta durabilidad y estabilidad anatómica.",
    "desc": "Dispositivo ortopédico Corrector de Postura Black fabricado con materiales de grado clínico internacional Tynor. Proporciona soporte, compresión controlada y alivio anatómico óptimo para una rehabilitación segura y confortable.",
    "uses": [
      "Tratamiento y prevención de afecciones en zona de clavicula.",
      "Rehabilitación ortopédica post-traumática o post-quirúrgica.",
      "Soporte ergonómico de uso diario con alivio de carga articular."
    ],
    "features": [
      "Material transpirable hipoalergénico de alta resistencia",
      "Diseño ergonómico ajustable a la morfología del paciente",
      "Estructura diseñada bajo estándares ortopédicos internacionales"
    ],
    "colors": [
      {
        "id": "NEGRO",
        "name": "Negro (Black)",
        "hex": "#1E293B",
        "border": "#0F172A"
      }
    ],
    "priceBySize": {
      "Universal": 275.0
    }
  },
  {
    "code": "B01",
    "name": "Collarín Cervical Suave",
    "cat": "cervical",
    "price": 150.0,
    "bodyPart": "cuello",
    "badge": "ORTOPEDIA",
    "linea": "ORTOPEDIA",
    "sizes": [
      "CH",
      "M",
      "G",
      "Pediátrico"
    ],
    "hasPdf": true,
    "hasVideo": false,
    "shortDesc": "Inmovilización cómoda y soporte mentoniano para contracturas y latigazo cervical.",
    "desc": "Diseñado para brindar soporte térmico y contención fisiológica de la columna cervical, limitando la flexo-extensión excesiva sin comprimir la mandíbula.",
    "uses": [
      "Esguinces y contracturas musculares cervicales (latigazo).",
      "Cervicobraquialgias y tortícolis agudas.",
      "Rehabilitación post-trauma leve."
    ],
    "features": [
      "Espuma de poliuretano de alta densidad indeformable",
      "Funda de algodón 100% transpirable y lavable",
      "Cierre de velcro regulable para ajuste milimétrico"
    ],
    "priceBySize": {
      "CH": 150.0,
      "M": 150.0,
      "G": 150.0,
      "Pediátrico": 150.0
    }
  },
  {
    "code": "B02",
    "name": "Collarín Tipo Thomas Blando",
    "cat": "cervical",
    "price": 145.0,
    "bodyPart": "cuello",
    "badge": "ORTOPEDIA",
    "linea": "ORTOPEDIA",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL"
    ],
    "hasPdf": true,
    "hasVideo": false,
    "shortDesc": "Collarín Tipo Thomas Blando diseñado para soporte terapéutico de alta durabilidad y estabilidad anatómica.",
    "desc": "Dispositivo ortopédico Collarín Tipo Thomas Blando fabricado con materiales de grado clínico internacional Tynor. Proporciona soporte, compresión controlada y alivio anatómico óptimo para una rehabilitación segura y confortable.",
    "uses": [
      "Tratamiento y prevención de afecciones en zona de cuello.",
      "Rehabilitación ortopédica post-traumática o post-quirúrgica.",
      "Soporte ergonómico de uso diario con alivio de carga articular."
    ],
    "features": [
      "Material transpirable hipoalergénico de alta resistencia",
      "Diseño ergonómico ajustable a la morfología del paciente",
      "Estructura diseñada bajo estándares ortopédicos internacionales"
    ],
    "priceBySize": {
      "CH": 145.0,
      "M": 145.0,
      "G": 145.0,
      "XL": 145.0
    }
  },
  {
    "code": "B03",
    "name": "Collarín Tipo Thomas Firme",
    "cat": "cervical",
    "price": 165.0,
    "bodyPart": "cuello",
    "badge": "ORTOPEDIA",
    "linea": "ORTOPEDIA",
    "sizes": [
      "CH",
      "M",
      "G"
    ],
    "hasPdf": true,
    "hasVideo": false,
    "shortDesc": "Collarín Tipo Thomas Firme diseñado para soporte terapéutico de alta durabilidad y estabilidad anatómica.",
    "desc": "Dispositivo ortopédico Collarín Tipo Thomas Firme fabricado con materiales de grado clínico internacional Tynor. Proporciona soporte, compresión controlada y alivio anatómico óptimo para una rehabilitación segura y confortable.",
    "uses": [
      "Tratamiento y prevención de afecciones en zona de cuello.",
      "Rehabilitación ortopédica post-traumática o post-quirúrgica.",
      "Soporte ergonómico de uso diario con alivio de carga articular."
    ],
    "features": [
      "Material transpirable hipoalergénico de alta resistencia",
      "Diseño ergonómico ajustable a la morfología del paciente",
      "Estructura diseñada bajo estándares ortopédicos internacionales"
    ],
    "priceBySize": {
      "CH": 165.0,
      "M": 165.0,
      "G": 165.0
    }
  },
  {
    "code": "B05",
    "name": "Collarín Philadelphia",
    "cat": "cervical",
    "price": 245.0,
    "bodyPart": "cuello",
    "badge": "ORTOPEDIA",
    "linea": "ORTOPEDIA",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL"
    ],
    "hasPdf": true,
    "hasVideo": false,
    "shortDesc": "Collarín Philadelphia diseñado para soporte terapéutico de alta durabilidad y estabilidad anatómica.",
    "desc": "Dispositivo ortopédico Collarín Philadelphia fabricado con materiales de grado clínico internacional Tynor. Proporciona soporte, compresión controlada y alivio anatómico óptimo para una rehabilitación segura y confortable.",
    "uses": [
      "Tratamiento y prevención de afecciones en zona de cuello.",
      "Rehabilitación ortopédica post-traumática o post-quirúrgica.",
      "Soporte ergonómico de uso diario con alivio de carga articular."
    ],
    "features": [
      "Material transpirable hipoalergénico de alta resistencia",
      "Diseño ergonómico ajustable a la morfología del paciente",
      "Estructura diseñada bajo estándares ortopédicos internacionales"
    ],
    "priceBySize": {
      "CH": 245.0,
      "M": 245.0,
      "G": 245.0,
      "XL": 245.0
    }
  },
  {
    "code": "B07",
    "name": "Collarín Densidad Suave",
    "cat": "cervical",
    "price": 140.0,
    "bodyPart": "cuello",
    "badge": "ORTOPEDIA",
    "linea": "ORTOPEDIA",
    "sizes": [
      "CH",
      "M",
      "G"
    ],
    "hasPdf": true,
    "hasVideo": false,
    "shortDesc": "Collarín Densidad Suave diseñado para soporte terapéutico de alta durabilidad y estabilidad anatómica.",
    "desc": "Dispositivo ortopédico Collarín Densidad Suave fabricado con materiales de grado clínico internacional Tynor. Proporciona soporte, compresión controlada y alivio anatómico óptimo para una rehabilitación segura y confortable.",
    "uses": [
      "Tratamiento y prevención de afecciones en zona de cuello.",
      "Rehabilitación ortopédica post-traumática o post-quirúrgica.",
      "Soporte ergonómico de uso diario con alivio de carga articular."
    ],
    "features": [
      "Material transpirable hipoalergénico de alta resistencia",
      "Diseño ergonómico ajustable a la morfología del paciente",
      "Estructura diseñada bajo estándares ortopédicos internacionales"
    ],
    "priceBySize": {
      "CH": 140.0,
      "M": 140.0,
      "G": 140.0
    }
  },
  {
    "code": "B10",
    "name": "Collarín Philadelphia (plastazote)",
    "cat": "cervical",
    "price": 340.0,
    "bodyPart": "cuello",
    "badge": "ORTOPEDIA",
    "linea": "ORTOPEDIA",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL",
      "Pediátrico"
    ],
    "hasPdf": true,
    "hasVideo": false,
    "shortDesc": "Collarín Philadelphia (plastazote) diseñado para soporte terapéutico de alta durabilidad y estabilidad anatómica.",
    "desc": "Dispositivo ortopédico Collarín Philadelphia (plastazote) fabricado con materiales de grado clínico internacional Tynor. Proporciona soporte, compresión controlada y alivio anatómico óptimo para una rehabilitación segura y confortable.",
    "uses": [
      "Tratamiento y prevención de afecciones en zona de cuello.",
      "Rehabilitación ortopédica post-traumática o post-quirúrgica.",
      "Soporte ergonómico de uso diario con alivio de carga articular."
    ],
    "features": [
      "Material transpirable hipoalergénico de alta resistencia",
      "Diseño ergonómico ajustable a la morfología del paciente",
      "Estructura diseñada bajo estándares ortopédicos internacionales"
    ],
    "priceBySize": {
      "CH": 340.0,
      "M": 340.0,
      "G": 340.0,
      "XL": 340.0,
      "Pediátrico": 340.0
    }
  },
  {
    "code": "B31",
    "name": "Corrector y Relajante Cervical",
    "cat": "cervical",
    "price": 300.0,
    "bodyPart": "cuello",
    "badge": "ORTOPEDIA",
    "linea": "ORTOPEDIA",
    "sizes": [
      "Universal"
    ],
    "hasPdf": true,
    "hasVideo": false,
    "shortDesc": "Corrector y Relajante Cervical diseñado para soporte terapéutico de alta durabilidad y estabilidad anatómica.",
    "desc": "Dispositivo ortopédico Corrector y Relajante Cervical fabricado con materiales de grado clínico internacional Tynor. Proporciona soporte, compresión controlada y alivio anatómico óptimo para una rehabilitación segura y confortable.",
    "uses": [
      "Tratamiento y prevención de afecciones en zona de cuello.",
      "Rehabilitación ortopédica post-traumática o post-quirúrgica.",
      "Soporte ergonómico de uso diario con alivio de carga articular."
    ],
    "features": [
      "Material transpirable hipoalergénico de alta resistencia",
      "Diseño ergonómico ajustable a la morfología del paciente",
      "Estructura diseñada bajo estándares ortopédicos internacionales"
    ],
    "priceBySize": {
      "Universal": 300.0
    }
  },
  {
    "code": "C01",
    "name": "Cabestrillo (Tropical)",
    "cat": "cabestrillo",
    "price": 125.0,
    "bodyPart": "brazo",
    "badge": "ORTOPEDIA",
    "linea": "ORTOPEDIA",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL",
      "XXL",
      "Pediátrico"
    ],
    "hasPdf": true,
    "hasVideo": false,
    "shortDesc": "Diseño ergonómico para climas cálidos y soporte prolongado del brazo en flexión.",
    "desc": "La función del cabestrillo es sostener, apoyar e inmovilizar esguinces, fracturas o intervenciones quirúrgicas del brazo, manteniéndolo en posición de flexión durante el proceso de recuperación.\\n\\nFabricado en un elegante e inteligente diseño ideal para condiciones climáticas cálidas y húmedas.",
    "uses": [
      "Fractura en cualquier estructura que compone el brazo.",
      "Inmovilización post-operatoria del antebrazo y codo.",
      "Soporte cómodo para uso prolongado en climas cálidos."
    ],
    "features": [
      "Tela perforada 3D transpirable y antialérgica",
      "Correa de hombro con almohadilla acolchada para evitar rozaduras",
      "Hebilla de fácil liberación para colocación autónoma"
    ],
    "priceBySize": {
      "CH": 125.0,
      "M": 125.0,
      "G": 125.0,
      "XL": 145.0,
      "XXL": 145.0,
      "Pediátrico": 125.0
    }
  },
  {
    "code": "C02",
    "name": "Inmovilizador de Hombro Universal",
    "cat": "inmovilizador",
    "price": 265.0,
    "bodyPart": "hombro",
    "badge": "ORTOPEDIA",
    "linea": "ORTOPEDIA",
    "sizes": [
      "Universal",
      "Talla Especial",
      "Pediátrico"
    ],
    "hasPdf": true,
    "hasVideo": false,
    "shortDesc": "Inmovilización trilateral para traumatología de hombro y húmero.",
    "desc": "Soporte versátil que se adapta a distintas tallas, brindando estabilidad completa al hombro y al antebrazo desde el primer ajuste para una recuperación segura. Restringe eficazmente la abducción y rotación del hombro.",
    "uses": [
      "Luxación y subluxación glenohumeral aguda.",
      "Fractura de cabeza de húmero y escápula.",
      "Fase post-quirúrgica inmediata de manguito rotador."
    ],
    "features": [
      "Banda torácica ancha para inmovilización axial rígida",
      "Diseño adaptable izquierda/derecha sin accesorios adicionales",
      "Cierres de velcro de grado médico de alta tenacidad"
    ],
    "priceBySize": {
      "Universal": 265.0,
      "Talla Especial": 323.0,
      "Pediátrico": 265.0
    }
  },
  {
    "code": "C03",
    "name": "Inmovilizador Elástico de Hombros",
    "cat": "inmovilizador",
    "price": 360.0,
    "bodyPart": "hombro",
    "badge": "ORTOPEDIA",
    "linea": "ORTOPEDIA",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL"
    ],
    "hasPdf": true,
    "hasVideo": false,
    "shortDesc": "Compresión elástica multidireccional para patologías de manguito rotador.",
    "desc": "Diseño elástico que restringe el movimiento del hombro proporcionando compresión controlada y soporte térmico. Ideal para lesiones de manguito rotador, tendinitis o luxaciones recidivantes.",
    "uses": [
      "Lesiones del manguito rotador y bursitis subacromial.",
      "Subluxación recidivante de hombro.",
      "Rehabilitación y retorno paulatino a la movilidad."
    ],
    "features": [
      "Tejido elástico de 4 vías con memoria elástica de alto nivel",
      "Cinturón de ajuste humeral con tensión graduada",
      "Perfil bajo para uso discreto bajo la ropa"
    ],
    "priceBySize": {
      "CH": 360.0,
      "M": 360.0,
      "G": 360.0,
      "XL": 360.0
    }
  },
  {
    "code": "C04",
    "name": "Soporte para Clavícula con Hebilla",
    "cat": "clavicula",
    "price": 213.0,
    "bodyPart": "clavicula",
    "badge": "ORTOPEDIA",
    "linea": "ORTOPEDIA",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL",
      "Pediátrico"
    ],
    "hasPdf": true,
    "hasVideo": false,
    "shortDesc": "Sistema de hebillas metálicas con bloqueo firme para inmovilización clavicular.",
    "desc": "Sistema de hebillas que permite un ajuste firme y seguro para inmovilizar la clavícula y promover la correcta alineación postural durante la consolidación ósea.",
    "uses": [
      "Consolidación ósea de fracturas de clavícula cerradas.",
      "Inmovilización escapular post-trauma.",
      "Realineamiento biomecánico de cintura escapular."
    ],
    "features": [
      "Hebillas de aleación ligera no deformables",
      "Almohadillas axilares de espuma viscoelástica para evitar compresión vascular",
      "Construcción duradera de resistencia grado hospitalario"
    ],
    "priceBySize": {
      "CH": 213.0,
      "M": 213.0,
      "G": 213.0,
      "XL": 213.0,
      "Pediátrico": 213.0
    }
  },
  {
    "code": "C05",
    "name": "Soporte para Clavícula con Velcro",
    "cat": "clavicula",
    "price": 285.0,
    "bodyPart": "clavicula",
    "badge": "ORTOPEDIA",
    "linea": "ORTOPEDIA",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL",
      "XXL",
      "Pediátrico"
    ],
    "hasPdf": true,
    "hasVideo": false,
    "shortDesc": "Cierre velcro de microajuste rápido para corrección postural y fractura.",
    "desc": "Cierre de velcro para un ajuste rápido y progresivo. Corrige la postura y ayuda en el tratamiento de fracturas de clavícula, pensado para uso diario prolongado sin fatiga dérmica.",
    "uses": [
      "Tratamiento conservador de fracturas de clavícula.",
      "Corrección de postura hipercifótica o hombros caídos.",
      "Soporte acromioclavicular en rehabilitación."
    ],
    "features": [
      "Hebillas de anillo en 'D' con amortiguador axilar suave",
      "Banda dorsal acolchada antitorsión",
      "Fácil regulación de tensión por el propio paciente"
    ],
    "priceBySize": {
      "CH": 285.0,
      "M": 285.0,
      "G": 285.0,
      "XL": 325.0,
      "XXL": 325.0,
      "Pediátrico": 285.0
    }
  },
  {
    "code": "C06",
    "name": "Cabestrillo Ancho (Buggy)",
    "cat": "cabestrillo",
    "price": 140.0,
    "bodyPart": "brazo",
    "badge": "ORTOPEDIA",
    "linea": "ORTOPEDIA",
    "sizes": [
      "XL",
      "XXL",
      "CH",
      "M",
      "G",
      "Pediátrico"
    ],
    "hasPdf": true,
    "hasVideo": false,
    "shortDesc": "Banda ancha envolvente para distribución de peso uniforme y soporte reforzado.",
    "desc": "La función del cabestrillo es sostener, apoyar e inmovilizar esguinces, fracturas o intervenciones quirúrgicas del brazo, manteniéndolo en posición de flexión durante el proceso de recuperación.\\n\\nSu diseño de cuna ancha distribuye la carga reduciendo el punto de presión sobre el cuello y los hombros.",
    "uses": [
      "Fractura en cualquier estructura que compone el brazo.",
      "Rehabilitación tras cirugía ortopédica de codo o húmero.",
      "Soporte estable con cuna ancha de reposo."
    ],
    "features": [
      "Cuna anatómica ancha con soporte de pulgar integrado",
      "Tejido suave de tacto clínico de alta resistencia",
      "Ajuste ambidiestro de colocación rápida"
    ],
    "priceBySize": {
      "XL": 140.0,
      "XXL": 140.0,
      "CH": 140.0,
      "M": 140.0,
      "G": 140.0,
      "Pediátrico": 140.0
    }
  },
  {
    "code": "C08",
    "name": "Zapato para Yeso",
    "cat": "cabestrillo",
    "price": 250.0,
    "bodyPart": "brazo",
    "badge": "ORTOPEDIA",
    "linea": "ORTOPEDIA",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL"
    ],
    "hasPdf": true,
    "hasVideo": false,
    "shortDesc": "Zapato para Yeso diseñado para soporte terapéutico de alta durabilidad y estabilidad anatómica.",
    "desc": "Dispositivo ortopédico Zapato para Yeso fabricado con materiales de grado clínico internacional Tynor. Proporciona soporte, compresión controlada y alivio anatómico óptimo para una rehabilitación segura y confortable.",
    "uses": [
      "Tratamiento y prevención de afecciones en zona de brazo.",
      "Rehabilitación ortopédica post-traumática o post-quirúrgica.",
      "Soporte ergonómico de uso diario con alivio de carga articular."
    ],
    "features": [
      "Material transpirable hipoalergénico de alta resistencia",
      "Diseño ergonómico ajustable a la morfología del paciente",
      "Estructura diseñada bajo estándares ortopédicos internacionales"
    ],
    "priceBySize": {
      "CH": 250.0,
      "M": 250.0,
      "G": 250.0,
      "XL": 250.0
    }
  },
  {
    "code": "C16",
    "name": "Bolsa para Yeso Pierna",
    "cat": "tobillo",
    "price": 275.0,
    "bodyPart": "tobillo",
    "badge": "ORTOPEDIA",
    "linea": "ORTOPEDIA",
    "sizes": [
      "Universal"
    ],
    "hasPdf": true,
    "hasVideo": false,
    "shortDesc": "Bolsa para Yeso Pierna diseñado para soporte terapéutico de alta durabilidad y estabilidad anatómica.",
    "desc": "Dispositivo ortopédico Bolsa para Yeso Pierna fabricado con materiales de grado clínico internacional Tynor. Proporciona soporte, compresión controlada y alivio anatómico óptimo para una rehabilitación segura y confortable.",
    "uses": [
      "Tratamiento y prevención de afecciones en zona de tobillo.",
      "Rehabilitación ortopédica post-traumática o post-quirúrgica.",
      "Soporte ergonómico de uso diario con alivio de carga articular."
    ],
    "features": [
      "Material transpirable hipoalergénico de alta resistencia",
      "Diseño ergonómico ajustable a la morfología del paciente",
      "Estructura diseñada bajo estándares ortopédicos internacionales"
    ],
    "priceBySize": {
      "Universal": 275.0
    }
  },
  {
    "code": "C19",
    "name": "Bolsa para Yeso Brazo",
    "cat": "cabestrillo",
    "price": 130.0,
    "bodyPart": "brazo",
    "badge": "ORTOPEDIA",
    "linea": "ORTOPEDIA",
    "sizes": [
      "Universal"
    ],
    "hasPdf": true,
    "hasVideo": false,
    "shortDesc": "Bolsa para Yeso Brazo diseñado para soporte terapéutico de alta durabilidad y estabilidad anatómica.",
    "desc": "Dispositivo ortopédico Bolsa para Yeso Brazo fabricado con materiales de grado clínico internacional Tynor. Proporciona soporte, compresión controlada y alivio anatómico óptimo para una rehabilitación segura y confortable.",
    "uses": [
      "Tratamiento y prevención de afecciones en zona de brazo.",
      "Rehabilitación ortopédica post-traumática o post-quirúrgica.",
      "Soporte ergonómico de uso diario con alivio de carga articular."
    ],
    "features": [
      "Material transpirable hipoalergénico de alta resistencia",
      "Diseño ergonómico ajustable a la morfología del paciente",
      "Estructura diseñada bajo estándares ortopédicos internacionales"
    ],
    "priceBySize": {
      "Universal": 130.0
    }
  },
  {
    "code": "C21",
    "name": "Cabestrillo Ubano",
    "cat": "cabestrillo",
    "price": 275.0,
    "bodyPart": "brazo",
    "badge": "ORTOPEDIA",
    "linea": "ORTOPEDIA",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL"
    ],
    "hasPdf": true,
    "hasVideo": false,
    "shortDesc": "Cabestrillo Ubano diseñado para soporte terapéutico de alta durabilidad y estabilidad anatómica.",
    "desc": "Dispositivo ortopédico Cabestrillo Ubano fabricado con materiales de grado clínico internacional Tynor. Proporciona soporte, compresión controlada y alivio anatómico óptimo para una rehabilitación segura y confortable.",
    "uses": [
      "Tratamiento y prevención de afecciones en zona de brazo.",
      "Rehabilitación ortopédica post-traumática o post-quirúrgica.",
      "Soporte ergonómico de uso diario con alivio de carga articular."
    ],
    "features": [
      "Material transpirable hipoalergénico de alta resistencia",
      "Diseño ergonómico ajustable a la morfología del paciente",
      "Estructura diseñada bajo estándares ortopédicos internacionales"
    ],
    "priceBySize": {
      "CH": 275.0,
      "M": 275.0,
      "G": 275.0,
      "XL": 275.0
    }
  },
  {
    "code": "D01",
    "name": "Tobillera Elástica de Compresión",
    "cat": "tobillo",
    "price": 172.0,
    "bodyPart": "tobillo",
    "badge": "ORTOPEDIA",
    "linea": "ORTOPEDIA",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL"
    ],
    "hasPdf": true,
    "hasVideo": false,
    "shortDesc": "Compresión articular y propiocepción dinámica para el tobillo y talón.",
    "desc": "Soporte elástico anatómico de alta densidad con apertura en talón que estabiliza el complejo ligamentoso del tobillo sin restringir la marcha normal ni molestar dentro del calzado.",
    "uses": [
      "Esguinces de tobillo (Grado I y II) y laxitud ligamentosa.",
      "Tendinitis aquílea y edema post-esfuerzo.",
      "Soporte preventivo deportivo y laboral."
    ],
    "features": [
      "Talón anatómico abierto para óptima adaptación a la pisada",
      "Tejido circular sin costuras de compresión controlada",
      "Material transpirable que retiene el calor terapéutico"
    ],
    "priceBySize": {
      "CH": 172.0,
      "M": 172.0,
      "G": 172.0,
      "XL": 199.0
    }
  },
  {
    "code": "D02",
    "name": "Soporte de Lona para Tobillo",
    "cat": "tobillo",
    "price": 420.0,
    "bodyPart": "tobillo",
    "badge": "ORTOPEDIA",
    "linea": "ORTOPEDIA",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL",
      "Pediátrico"
    ],
    "hasPdf": true,
    "hasVideo": false,
    "shortDesc": "Soporte de Lona para Tobillo diseñado para soporte terapéutico de alta durabilidad y estabilidad anatómica.",
    "desc": "Dispositivo ortopédico Soporte de Lona para Tobillo fabricado con materiales de grado clínico internacional Tynor. Proporciona soporte, compresión controlada y alivio anatómico óptimo para una rehabilitación segura y confortable.",
    "uses": [
      "Tratamiento y prevención de afecciones en zona de tobillo.",
      "Rehabilitación ortopédica post-traumática o post-quirúrgica.",
      "Soporte ergonómico de uso diario con alivio de carga articular."
    ],
    "features": [
      "Material transpirable hipoalergénico de alta resistencia",
      "Diseño ergonómico ajustable a la morfología del paciente",
      "Estructura diseñada bajo estándares ortopédicos internacionales"
    ],
    "priceBySize": {
      "CH": 420.0,
      "M": 420.0,
      "G": 420.0,
      "XL": 420.0,
      "Pediátrico": 420.0
    }
  },
  {
    "code": "D03",
    "name": "Tobillera Elástica (par)",
    "cat": "tobillo",
    "price": 186.0,
    "bodyPart": "tobillo",
    "badge": "ORTOPEDIA",
    "linea": "ORTOPEDIA",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL"
    ],
    "hasPdf": true,
    "hasVideo": false,
    "shortDesc": "Tobillera Elástica (par) diseñado para soporte terapéutico de alta durabilidad y estabilidad anatómica.",
    "desc": "Dispositivo ortopédico Tobillera Elástica (par) fabricado con materiales de grado clínico internacional Tynor. Proporciona soporte, compresión controlada y alivio anatómico óptimo para una rehabilitación segura y confortable.",
    "uses": [
      "Tratamiento y prevención de afecciones en zona de tobillo.",
      "Rehabilitación ortopédica post-traumática o post-quirúrgica.",
      "Soporte ergonómico de uso diario con alivio de carga articular."
    ],
    "features": [
      "Material transpirable hipoalergénico de alta resistencia",
      "Diseño ergonómico ajustable a la morfología del paciente",
      "Estructura diseñada bajo estándares ortopédicos internacionales"
    ],
    "priceBySize": {
      "CH": 186.0,
      "M": 186.0,
      "G": 186.0,
      "XL": 207.0
    }
  },
  {
    "code": "D04",
    "name": "Rodillera Elástica (par)",
    "cat": "rodillera",
    "price": 175.0,
    "bodyPart": "rodilla",
    "badge": "ORTOPEDIA",
    "linea": "ORTOPEDIA",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL",
      "XXL"
    ],
    "hasPdf": true,
    "hasVideo": false,
    "shortDesc": "Rodillera Elástica (par) diseñado para soporte terapéutico de alta durabilidad y estabilidad anatómica.",
    "desc": "Dispositivo ortopédico Rodillera Elástica (par) fabricado con materiales de grado clínico internacional Tynor. Proporciona soporte, compresión controlada y alivio anatómico óptimo para una rehabilitación segura y confortable.",
    "uses": [
      "Tratamiento y prevención de afecciones en zona de rodilla.",
      "Rehabilitación ortopédica post-traumática o post-quirúrgica.",
      "Soporte ergonómico de uso diario con alivio de carga articular."
    ],
    "features": [
      "Material transpirable hipoalergénico de alta resistencia",
      "Diseño ergonómico ajustable a la morfología del paciente",
      "Estructura diseñada bajo estándares ortopédicos internacionales"
    ],
    "priceBySize": {
      "CH": 175.0,
      "M": 175.0,
      "G": 175.0,
      "XL": 200.0,
      "XXL": 200.0
    }
  },
  {
    "code": "D05",
    "name": "Rodillera Elástica",
    "cat": "rodillera",
    "price": 175.0,
    "bodyPart": "rodilla",
    "badge": "ORTOPEDIA",
    "linea": "ORTOPEDIA",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL",
      "XXL"
    ],
    "hasPdf": true,
    "hasVideo": false,
    "shortDesc": "Compresión graduada continua y soporte propioceptivo articular.",
    "desc": "Soporte elástico que provee compresión uniforme y calor terapéutico a la articulación, ideal para tratar esguinces leves, inflamación articular y brindar apoyo preventivo durante la actividad física.",
    "uses": [
      "Esguinces leves de rodilla y tendinitis rotuliana.",
      "Edema e inflamación post-esfuerzo.",
      "Prevención en actividad laboral con carga de peso."
    ],
    "features": [
      "Tejido circular sin costuras que previene puntos de fricción",
      "Bordes con compresión desvanecida que no cortan la circulación",
      "Conserva la temperatura terapéutica en tejidos blandos"
    ],
    "priceBySize": {
      "CH": 175.0,
      "M": 175.0,
      "G": 175.0,
      "XL": 200.0,
      "XXL": 200.0
    }
  },
  {
    "code": "D06",
    "name": "Rodillera Mecánica Elástica Cerrada",
    "cat": "rodillera",
    "price": 325.0,
    "bodyPart": "rodilla",
    "badge": "ORTOPEDIA",
    "linea": "ORTOPEDIA",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL",
      "XXL"
    ],
    "hasPdf": true,
    "hasVideo": false,
    "shortDesc": "Rodillera Mecánica Elástica Cerrada diseñado para soporte terapéutico de alta durabilidad y estabilidad anatómica.",
    "desc": "Dispositivo ortopédico Rodillera Mecánica Elástica Cerrada fabricado con materiales de grado clínico internacional Tynor. Proporciona soporte, compresión controlada y alivio anatómico óptimo para una rehabilitación segura y confortable.",
    "uses": [
      "Tratamiento y prevención de afecciones en zona de rodilla.",
      "Rehabilitación ortopédica post-traumática o post-quirúrgica.",
      "Soporte ergonómico de uso diario con alivio de carga articular."
    ],
    "features": [
      "Material transpirable hipoalergénico de alta resistencia",
      "Diseño ergonómico ajustable a la morfología del paciente",
      "Estructura diseñada bajo estándares ortopédicos internacionales"
    ],
    "priceBySize": {
      "CH": 325.0,
      "M": 325.0,
      "G": 325.0,
      "XL": 325.0,
      "XXL": 325.0
    }
  },
  {
    "code": "D07",
    "name": "Soporte Elástico para Rodilla",
    "cat": "rodillera",
    "price": 300.0,
    "bodyPart": "rodilla",
    "badge": "ORTOPEDIA",
    "linea": "ORTOPEDIA",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL",
      "XXL"
    ],
    "hasPdf": true,
    "hasVideo": false,
    "shortDesc": "Soporte Elástico para Rodilla diseñado para soporte terapéutico de alta durabilidad y estabilidad anatómica.",
    "desc": "Dispositivo ortopédico Soporte Elástico para Rodilla fabricado con materiales de grado clínico internacional Tynor. Proporciona soporte, compresión controlada y alivio anatómico óptimo para una rehabilitación segura y confortable.",
    "uses": [
      "Tratamiento y prevención de afecciones en zona de rodilla.",
      "Rehabilitación ortopédica post-traumática o post-quirúrgica.",
      "Soporte ergonómico de uso diario con alivio de carga articular."
    ],
    "features": [
      "Material transpirable hipoalergénico de alta resistencia",
      "Diseño ergonómico ajustable a la morfología del paciente",
      "Estructura diseñada bajo estándares ortopédicos internacionales"
    ],
    "priceBySize": {
      "CH": 300.0,
      "M": 300.0,
      "G": 300.0,
      "XL": 300.0,
      "XXL": 300.0
    }
  },
  {
    "code": "D08",
    "name": "Rodillera Abierta C/soporte Rotuliano",
    "cat": "rodillera",
    "price": 335.0,
    "bodyPart": "rodilla",
    "badge": "ORTOPEDIA",
    "linea": "ORTOPEDIA",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL",
      "XXL"
    ],
    "hasPdf": true,
    "hasVideo": false,
    "shortDesc": "Rodillera Abierta C/soporte Rotuliano diseñado para soporte terapéutico de alta durabilidad y estabilidad anatómica.",
    "desc": "Dispositivo ortopédico Rodillera Abierta C/soporte Rotuliano fabricado con materiales de grado clínico internacional Tynor. Proporciona soporte, compresión controlada y alivio anatómico óptimo para una rehabilitación segura y confortable.",
    "uses": [
      "Tratamiento y prevención de afecciones en zona de rodilla.",
      "Rehabilitación ortopédica post-traumática o post-quirúrgica.",
      "Soporte ergonómico de uso diario con alivio de carga articular."
    ],
    "features": [
      "Material transpirable hipoalergénico de alta resistencia",
      "Diseño ergonómico ajustable a la morfología del paciente",
      "Estructura diseñada bajo estándares ortopédicos internacionales"
    ],
    "priceBySize": {
      "CH": 335.0,
      "M": 335.0,
      "G": 335.0,
      "XL": 350.0,
      "XXL": 350.0
    }
  },
  {
    "code": "D09",
    "name": "Rodillera Mecánica Abierta (Algodón)",
    "cat": "rodillera",
    "price": 619.0,
    "bodyPart": "rodilla",
    "badge": "ORTOPEDIA",
    "linea": "ORTOPEDIA",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL",
      "XXL"
    ],
    "hasPdf": true,
    "hasVideo": false,
    "shortDesc": "Rótula abierta con articulaciones policéntricas de estabilidad lateral.",
    "desc": "Rodillera de compresión con diseño abierto en la rótula. Fabricada en algodón elástico transpirable, incluye articulaciones mecánicas laterales de aleación para dar máxima estabilidad a la articulación femorotibial.",
    "uses": [
      "Inestabilidad moderada a severa de ligamentos colaterales (LCL/MCL).",
      "Lesiones meniscales y osteoartritis de rodilla.",
      "Apoyo biomecánico en pacientes geriátricos o post-quirúrgicos."
    ],
    "features": [
      "Bisagras mecánicas bilaterales desmontables para lavado",
      "Almohadilla rotuliana de silicona viscoelástica centrada",
      "Algodón hipoalergénico con excelente gestión de humedad"
    ],
    "priceBySize": {
      "CH": 619.0,
      "M": 619.0,
      "G": 619.0,
      "XL": 688.0,
      "XXL": 688.0
    }
  },
  {
    "code": "D10",
    "name": "Rodillera Mecánica Graduable (ROM)",
    "cat": "rodillera",
    "price": 1100.0,
    "bodyPart": "pierna",
    "badge": "ORTOPEDIA",
    "linea": "ORTOPEDIA",
    "sizes": [
      "Universal"
    ],
    "hasPdf": true,
    "hasVideo": false,
    "shortDesc": "Control milimétrico de rango de movimiento (flexión/extensión) post-operatorio.",
    "desc": "Máxima sujeción con bisagras graduables que permiten controlar con precisión el rango de movimiento (ROM) de flexión y extensión. Indicada para post-operatorios de ligamento cruzado anterior (LCA) y prótesis de rodilla.",
    "uses": [
      "Rehabilitación post-cirugía de ligamentos cruzados (LCA / LCP).",
      "Reparación meniscal y osteotomías de rodilla.",
      "Control estricto de flexo-extensión en etapas tempranas de recuperación."
    ],
    "features": [
      "Selector de ángulo con pines de bloqueo rápido de 0° a 120°",
      "Barras telescópicas extensibles según la longitud de pierna",
      "Acolchados lavables desmontables con fijación velcro de alta seguridad"
    ],
    "priceBySize": {
      "Universal": 1100.0
    }
  },
  {
    "code": "D11",
    "name": "Rodillera Tripanel 19\"",
    "cat": "rodillera",
    "price": 575.0,
    "bodyPart": "rodilla",
    "badge": "ORTOPEDIA",
    "linea": "ORTOPEDIA",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL",
      "XXL",
      "Largo"
    ],
    "hasPdf": true,
    "hasVideo": false,
    "shortDesc": "Rodillera Tripanel 19\" diseñado para soporte terapéutico de alta durabilidad y estabilidad anatómica.",
    "desc": "Dispositivo ortopédico Rodillera Tripanel 19\" fabricado con materiales de grado clínico internacional Tynor. Proporciona soporte, compresión controlada y alivio anatómico óptimo para una rehabilitación segura y confortable.",
    "uses": [
      "Tratamiento y prevención de afecciones en zona de rodilla.",
      "Rehabilitación ortopédica post-traumática o post-quirúrgica.",
      "Soporte ergonómico de uso diario con alivio de carga articular."
    ],
    "features": [
      "Material transpirable hipoalergénico de alta resistencia",
      "Diseño ergonómico ajustable a la morfología del paciente",
      "Estructura diseñada bajo estándares ortopédicos internacionales"
    ],
    "priceBySize": {
      "CH": 575.0,
      "M": 575.0,
      "G": 575.0,
      "XL": 590.0,
      "XXL": 590.0,
      "Largo": 590.0
    }
  },
  {
    "code": "D13",
    "name": "Rodillera Tripanel 14\"",
    "cat": "rodillera",
    "price": 450.0,
    "bodyPart": "rodilla",
    "badge": "ORTOPEDIA",
    "linea": "ORTOPEDIA",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL",
      "XXL",
      "Largo"
    ],
    "hasPdf": true,
    "hasVideo": false,
    "shortDesc": "Rodillera Tripanel 14\" diseñado para soporte terapéutico de alta durabilidad y estabilidad anatómica.",
    "desc": "Dispositivo ortopédico Rodillera Tripanel 14\" fabricado con materiales de grado clínico internacional Tynor. Proporciona soporte, compresión controlada y alivio anatómico óptimo para una rehabilitación segura y confortable.",
    "uses": [
      "Tratamiento y prevención de afecciones en zona de rodilla.",
      "Rehabilitación ortopédica post-traumática o post-quirúrgica.",
      "Soporte ergonómico de uso diario con alivio de carga articular."
    ],
    "features": [
      "Material transpirable hipoalergénico de alta resistencia",
      "Diseño ergonómico ajustable a la morfología del paciente",
      "Estructura diseñada bajo estándares ortopédicos internacionales"
    ],
    "priceBySize": {
      "CH": 450.0,
      "M": 450.0,
      "G": 450.0,
      "XL": 475.0,
      "XXL": 475.0,
      "Largo": 475.0
    }
  },
  {
    "code": "D14",
    "name": "Muslera Elástica",
    "cat": "rodillera",
    "price": 144.0,
    "bodyPart": "rodilla",
    "badge": "ORTOPEDIA",
    "linea": "ORTOPEDIA",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL"
    ],
    "hasPdf": true,
    "hasVideo": false,
    "shortDesc": "Muslera Elástica diseñado para soporte terapéutico de alta durabilidad y estabilidad anatómica.",
    "desc": "Dispositivo ortopédico Muslera Elástica fabricado con materiales de grado clínico internacional Tynor. Proporciona soporte, compresión controlada y alivio anatómico óptimo para una rehabilitación segura y confortable.",
    "uses": [
      "Tratamiento y prevención de afecciones en zona de rodilla.",
      "Rehabilitación ortopédica post-traumática o post-quirúrgica.",
      "Soporte ergonómico de uso diario con alivio de carga articular."
    ],
    "features": [
      "Material transpirable hipoalergénico de alta resistencia",
      "Diseño ergonómico ajustable a la morfología del paciente",
      "Estructura diseñada bajo estándares ortopédicos internacionales"
    ],
    "priceBySize": {
      "CH": 144.0,
      "M": 144.0,
      "G": 144.0,
      "XL": 144.0
    }
  },
  {
    "code": "D17",
    "name": "Órtesis para Pie y Tobillo Izquierda",
    "cat": "tobillo",
    "price": 500.0,
    "bodyPart": "tobillo",
    "badge": "ORTOPEDIA",
    "linea": "ORTOPEDIA",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL",
      "Pediátrico"
    ],
    "hasPdf": true,
    "hasVideo": false,
    "shortDesc": "Órtesis para Pie y Tobillo Izquierda diseñado para soporte terapéutico de alta durabilidad y estabilidad anatómica.",
    "desc": "Dispositivo ortopédico Órtesis para Pie y Tobillo Izquierda fabricado con materiales de grado clínico internacional Tynor. Proporciona soporte, compresión controlada y alivio anatómico óptimo para una rehabilitación segura y confortable.",
    "uses": [
      "Tratamiento y prevención de afecciones en zona de tobillo.",
      "Rehabilitación ortopédica post-traumática o post-quirúrgica.",
      "Soporte ergonómico de uso diario con alivio de carga articular."
    ],
    "features": [
      "Material transpirable hipoalergénico de alta resistencia",
      "Diseño ergonómico ajustable a la morfología del paciente",
      "Estructura diseñada bajo estándares ortopédicos internacionales"
    ],
    "priceBySize": {
      "CH": 500.0,
      "M": 500.0,
      "G": 500.0,
      "XL": 500.0,
      "Pediátrico": 500.0
    }
  },
  {
    "code": "D18",
    "name": "Soporte de Tobillo Urbano",
    "cat": "tobillo",
    "price": 220.0,
    "bodyPart": "tobillo",
    "badge": "ORTOPEDIA",
    "linea": "ORTOPEDIA",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL"
    ],
    "hasPdf": true,
    "hasVideo": false,
    "shortDesc": "Soporte de Tobillo Urbano diseñado para soporte terapéutico de alta durabilidad y estabilidad anatómica.",
    "desc": "Dispositivo ortopédico Soporte de Tobillo Urbano fabricado con materiales de grado clínico internacional Tynor. Proporciona soporte, compresión controlada y alivio anatómico óptimo para una rehabilitación segura y confortable.",
    "uses": [
      "Tratamiento y prevención de afecciones en zona de tobillo.",
      "Rehabilitación ortopédica post-traumática o post-quirúrgica.",
      "Soporte ergonómico de uso diario con alivio de carga articular."
    ],
    "features": [
      "Material transpirable hipoalergénico de alta resistencia",
      "Diseño ergonómico ajustable a la morfología del paciente",
      "Estructura diseñada bajo estándares ortopédicos internacionales"
    ],
    "priceBySize": {
      "CH": 220.0,
      "M": 220.0,
      "G": 220.0,
      "XL": 220.0
    }
  },
  {
    "code": "D19",
    "name": "Anillo Subrotuliano",
    "cat": "rodillera",
    "price": 138.0,
    "bodyPart": "rodilla",
    "badge": "ORTOPEDIA",
    "linea": "ORTOPEDIA",
    "sizes": [
      "Universal"
    ],
    "hasPdf": true,
    "hasVideo": false,
    "shortDesc": "Anillo Subrotuliano diseñado para soporte terapéutico de alta durabilidad y estabilidad anatómica.",
    "desc": "Dispositivo ortopédico Anillo Subrotuliano fabricado con materiales de grado clínico internacional Tynor. Proporciona soporte, compresión controlada y alivio anatómico óptimo para una rehabilitación segura y confortable.",
    "uses": [
      "Tratamiento y prevención de afecciones en zona de rodilla.",
      "Rehabilitación ortopédica post-traumática o post-quirúrgica.",
      "Soporte ergonómico de uso diario con alivio de carga articular."
    ],
    "features": [
      "Material transpirable hipoalergénico de alta resistencia",
      "Diseño ergonómico ajustable a la morfología del paciente",
      "Estructura diseñada bajo estándares ortopédicos internacionales"
    ],
    "priceBySize": {
      "Universal": 138.0
    }
  },
  {
    "code": "D23",
    "name": "Rodillera Elástica Comfeel (par)",
    "cat": "rodillera",
    "price": 275.0,
    "bodyPart": "rodilla",
    "badge": "ORTOPEDIA",
    "linea": "ORTOPEDIA",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL"
    ],
    "hasPdf": true,
    "hasVideo": false,
    "shortDesc": "Rodillera Elástica Comfeel (par) diseñado para soporte terapéutico de alta durabilidad y estabilidad anatómica.",
    "desc": "Dispositivo ortopédico Rodillera Elástica Comfeel (par) fabricado con materiales de grado clínico internacional Tynor. Proporciona soporte, compresión controlada y alivio anatómico óptimo para una rehabilitación segura y confortable.",
    "uses": [
      "Tratamiento y prevención de afecciones en zona de rodilla.",
      "Rehabilitación ortopédica post-traumática o post-quirúrgica.",
      "Soporte ergonómico de uso diario con alivio de carga articular."
    ],
    "features": [
      "Material transpirable hipoalergénico de alta resistencia",
      "Diseño ergonómico ajustable a la morfología del paciente",
      "Estructura diseñada bajo estándares ortopédicos internacionales"
    ],
    "priceBySize": {
      "CH": 275.0,
      "M": 275.0,
      "G": 275.0,
      "XL": 289.0
    }
  },
  {
    "code": "D24",
    "name": "Elevador de Pie Uni",
    "cat": "tobillo",
    "price": 237.0,
    "bodyPart": "tobillo",
    "badge": "ORTOPEDIA",
    "linea": "ORTOPEDIA",
    "sizes": [
      "Universal"
    ],
    "hasPdf": true,
    "hasVideo": false,
    "shortDesc": "Elevador de Pie Uni diseñado para soporte terapéutico de alta durabilidad y estabilidad anatómica.",
    "desc": "Dispositivo ortopédico Elevador de Pie Uni fabricado con materiales de grado clínico internacional Tynor. Proporciona soporte, compresión controlada y alivio anatómico óptimo para una rehabilitación segura y confortable.",
    "uses": [
      "Tratamiento y prevención de afecciones en zona de tobillo.",
      "Rehabilitación ortopédica post-traumática o post-quirúrgica.",
      "Soporte ergonómico de uso diario con alivio de carga articular."
    ],
    "features": [
      "Material transpirable hipoalergénico de alta resistencia",
      "Diseño ergonómico ajustable a la morfología del paciente",
      "Estructura diseñada bajo estándares ortopédicos internacionales"
    ],
    "priceBySize": {
      "Universal": 237.0
    }
  },
  {
    "code": "D25",
    "name": "Tobillera Elástica Comfeel (par)",
    "cat": "tobillo",
    "price": 220.0,
    "bodyPart": "tobillo",
    "badge": "ORTOPEDIA",
    "linea": "ORTOPEDIA",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL",
      "XXL"
    ],
    "hasPdf": true,
    "hasVideo": false,
    "shortDesc": "Tobillera Elástica Comfeel (par) diseñado para soporte terapéutico de alta durabilidad y estabilidad anatómica.",
    "desc": "Dispositivo ortopédico Tobillera Elástica Comfeel (par) fabricado con materiales de grado clínico internacional Tynor. Proporciona soporte, compresión controlada y alivio anatómico óptimo para una rehabilitación segura y confortable.",
    "uses": [
      "Tratamiento y prevención de afecciones en zona de tobillo.",
      "Rehabilitación ortopédica post-traumática o post-quirúrgica.",
      "Soporte ergonómico de uso diario con alivio de carga articular."
    ],
    "features": [
      "Material transpirable hipoalergénico de alta resistencia",
      "Diseño ergonómico ajustable a la morfología del paciente",
      "Estructura diseñada bajo estándares ortopédicos internacionales"
    ],
    "priceBySize": {
      "CH": 220.0,
      "M": 220.0,
      "G": 220.0,
      "XL": 220.0,
      "XXL": 220.0
    }
  },
  {
    "code": "D26",
    "name": "Férula Rigida para Tobillo",
    "cat": "tobillo",
    "price": 375.0,
    "bodyPart": "tobillo",
    "badge": "ORTOPEDIA",
    "linea": "ORTOPEDIA",
    "sizes": [
      "Universal"
    ],
    "hasPdf": true,
    "hasVideo": false,
    "shortDesc": "Férula Rigida para Tobillo diseñado para soporte terapéutico de alta durabilidad y estabilidad anatómica.",
    "desc": "Dispositivo ortopédico Férula Rigida para Tobillo fabricado con materiales de grado clínico internacional Tynor. Proporciona soporte, compresión controlada y alivio anatómico óptimo para una rehabilitación segura y confortable.",
    "uses": [
      "Tratamiento y prevención de afecciones en zona de tobillo.",
      "Rehabilitación ortopédica post-traumática o post-quirúrgica.",
      "Soporte ergonómico de uso diario con alivio de carga articular."
    ],
    "features": [
      "Material transpirable hipoalergénico de alta resistencia",
      "Diseño ergonómico ajustable a la morfología del paciente",
      "Estructura diseñada bajo estándares ortopédicos internacionales"
    ],
    "priceBySize": {
      "Universal": 375.0
    }
  },
  {
    "code": "D28",
    "name": "Rodillera Tripanel 22\"",
    "cat": "rodillera",
    "price": 690.0,
    "bodyPart": "rodilla",
    "badge": "ORTOPEDIA",
    "linea": "ORTOPEDIA",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL",
      "XXL",
      "Largo"
    ],
    "hasPdf": true,
    "hasVideo": false,
    "shortDesc": "Rodillera Tripanel 22\" diseñado para soporte terapéutico de alta durabilidad y estabilidad anatómica.",
    "desc": "Dispositivo ortopédico Rodillera Tripanel 22\" fabricado con materiales de grado clínico internacional Tynor. Proporciona soporte, compresión controlada y alivio anatómico óptimo para una rehabilitación segura y confortable.",
    "uses": [
      "Tratamiento y prevención de afecciones en zona de rodilla.",
      "Rehabilitación ortopédica post-traumática o post-quirúrgica.",
      "Soporte ergonómico de uso diario con alivio de carga articular."
    ],
    "features": [
      "Material transpirable hipoalergénico de alta resistencia",
      "Diseño ergonómico ajustable a la morfología del paciente",
      "Estructura diseñada bajo estándares ortopédicos internacionales"
    ],
    "priceBySize": {
      "CH": 690.0,
      "M": 690.0,
      "G": 690.0,
      "XL": 750.0,
      "XXL": 750.0,
      "Largo": 750.0
    }
  },
  {
    "code": "D40",
    "name": "Férula de Aire para Tobillo",
    "cat": "tobillo",
    "price": 400.0,
    "bodyPart": "tobillo",
    "badge": "ORTOPEDIA",
    "linea": "ORTOPEDIA",
    "sizes": [
      "Universal"
    ],
    "hasPdf": true,
    "hasVideo": false,
    "shortDesc": "Férula de Aire para Tobillo diseñado para soporte terapéutico de alta durabilidad y estabilidad anatómica.",
    "desc": "Dispositivo ortopédico Férula de Aire para Tobillo fabricado con materiales de grado clínico internacional Tynor. Proporciona soporte, compresión controlada y alivio anatómico óptimo para una rehabilitación segura y confortable.",
    "uses": [
      "Tratamiento y prevención de afecciones en zona de tobillo.",
      "Rehabilitación ortopédica post-traumática o post-quirúrgica.",
      "Soporte ergonómico de uso diario con alivio de carga articular."
    ],
    "features": [
      "Material transpirable hipoalergénico de alta resistencia",
      "Diseño ergonómico ajustable a la morfología del paciente",
      "Estructura diseñada bajo estándares ortopédicos internacionales"
    ],
    "priceBySize": {
      "Universal": 400.0
    }
  },
  {
    "code": "D41",
    "name": "Férula Nocturna de Desrotacion",
    "cat": "rodillera",
    "price": 650.0,
    "bodyPart": "rodilla",
    "badge": "ORTOPEDIA",
    "linea": "ORTOPEDIA",
    "sizes": [
      "CH",
      "M",
      "G"
    ],
    "hasPdf": true,
    "hasVideo": false,
    "shortDesc": "Férula Nocturna de Desrotacion diseñado para soporte terapéutico de alta durabilidad y estabilidad anatómica.",
    "desc": "Dispositivo ortopédico Férula Nocturna de Desrotacion fabricado con materiales de grado clínico internacional Tynor. Proporciona soporte, compresión controlada y alivio anatómico óptimo para una rehabilitación segura y confortable.",
    "uses": [
      "Tratamiento y prevención de afecciones en zona de rodilla.",
      "Rehabilitación ortopédica post-traumática o post-quirúrgica.",
      "Soporte ergonómico de uso diario con alivio de carga articular."
    ],
    "features": [
      "Material transpirable hipoalergénico de alta resistencia",
      "Diseño ergonómico ajustable a la morfología del paciente",
      "Estructura diseñada bajo estándares ortopédicos internacionales"
    ],
    "priceBySize": {
      "CH": 650.0,
      "M": 650.0,
      "G": 650.0
    }
  },
  {
    "code": "D43",
    "name": "Órtesis para Pie y Tobillo Luxe Izquierda",
    "cat": "tobillo",
    "price": 575.0,
    "bodyPart": "tobillo",
    "badge": "ORTOPEDIA",
    "linea": "ORTOPEDIA",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL",
      "Pediátrico"
    ],
    "hasPdf": true,
    "hasVideo": false,
    "shortDesc": "Órtesis para Pie y Tobillo Luxe Izquierda diseñado para soporte terapéutico de alta durabilidad y estabilidad anatómica.",
    "desc": "Dispositivo ortopédico Órtesis para Pie y Tobillo Luxe Izquierda fabricado con materiales de grado clínico internacional Tynor. Proporciona soporte, compresión controlada y alivio anatómico óptimo para una rehabilitación segura y confortable.",
    "uses": [
      "Tratamiento y prevención de afecciones en zona de tobillo.",
      "Rehabilitación ortopédica post-traumática o post-quirúrgica.",
      "Soporte ergonómico de uso diario con alivio de carga articular."
    ],
    "features": [
      "Material transpirable hipoalergénico de alta resistencia",
      "Diseño ergonómico ajustable a la morfología del paciente",
      "Estructura diseñada bajo estándares ortopédicos internacionales"
    ],
    "priceBySize": {
      "CH": 575.0,
      "M": 575.0,
      "G": 575.0,
      "XL": 575.0,
      "Pediátrico": 575.0
    }
  },
  {
    "code": "D44",
    "name": "Rodillera Tripanel",
    "cat": "rodillera",
    "price": 300.0,
    "bodyPart": "rodilla",
    "badge": "ORTOPEDIA",
    "linea": "ORTOPEDIA",
    "sizes": [
      "Pediátrico"
    ],
    "hasPdf": true,
    "hasVideo": false,
    "shortDesc": "Rodillera Tripanel diseñado para soporte terapéutico de alta durabilidad y estabilidad anatómica.",
    "desc": "Dispositivo ortopédico Rodillera Tripanel fabricado con materiales de grado clínico internacional Tynor. Proporciona soporte, compresión controlada y alivio anatómico óptimo para una rehabilitación segura y confortable.",
    "uses": [
      "Tratamiento y prevención de afecciones en zona de rodilla.",
      "Rehabilitación ortopédica post-traumática o post-quirúrgica.",
      "Soporte ergonómico de uso diario con alivio de carga articular."
    ],
    "features": [
      "Material transpirable hipoalergénico de alta resistencia",
      "Diseño ergonómico ajustable a la morfología del paciente",
      "Estructura diseñada bajo estándares ortopédicos internacionales"
    ],
    "priceBySize": {
      "Pediátrico": 300.0
    }
  },
  {
    "code": "D47",
    "name": "Soporte de Rodilla Urbano",
    "cat": "rodillera",
    "price": 325.0,
    "bodyPart": "rodilla",
    "badge": "ORTOPEDIA",
    "linea": "ORTOPEDIA",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL"
    ],
    "hasPdf": true,
    "hasVideo": false,
    "shortDesc": "Soporte de Rodilla Urbano diseñado para soporte terapéutico de alta durabilidad y estabilidad anatómica.",
    "desc": "Dispositivo ortopédico Soporte de Rodilla Urbano fabricado con materiales de grado clínico internacional Tynor. Proporciona soporte, compresión controlada y alivio anatómico óptimo para una rehabilitación segura y confortable.",
    "uses": [
      "Tratamiento y prevención de afecciones en zona de rodilla.",
      "Rehabilitación ortopédica post-traumática o post-quirúrgica.",
      "Soporte ergonómico de uso diario con alivio de carga articular."
    ],
    "features": [
      "Material transpirable hipoalergénico de alta resistencia",
      "Diseño ergonómico ajustable a la morfología del paciente",
      "Estructura diseñada bajo estándares ortopédicos internacionales"
    ],
    "priceBySize": {
      "CH": 325.0,
      "M": 325.0,
      "G": 325.0,
      "XL": 325.0
    }
  },
  {
    "code": "D48",
    "name": "Rodillera Mecánica Graduable ROM 22\" Largo",
    "cat": "rodillera",
    "price": 1250.0,
    "bodyPart": "rodilla",
    "badge": "ORTOPEDIA",
    "linea": "ORTOPEDIA",
    "sizes": [
      "Universal"
    ],
    "hasPdf": true,
    "hasVideo": false,
    "shortDesc": "Rodillera Mecánica Graduable ROM 22\" Largo diseñado para soporte terapéutico de alta durabilidad y estabilidad anatómica.",
    "desc": "Dispositivo ortopédico Rodillera Mecánica Graduable ROM 22\" Largo fabricado con materiales de grado clínico internacional Tynor. Proporciona soporte, compresión controlada y alivio anatómico óptimo para una rehabilitación segura y confortable.",
    "uses": [
      "Tratamiento y prevención de afecciones en zona de rodilla.",
      "Rehabilitación ortopédica post-traumática o post-quirúrgica.",
      "Soporte ergonómico de uso diario con alivio de carga articular."
    ],
    "features": [
      "Material transpirable hipoalergénico de alta resistencia",
      "Diseño ergonómico ajustable a la morfología del paciente",
      "Estructura diseñada bajo estándares ortopédicos internacionales"
    ],
    "priceBySize": {
      "Universal": 1250.0
    }
  },
  {
    "code": "D53",
    "name": "Tobillera Elástica Cintas en Ocho Urbana",
    "cat": "tobillo",
    "price": null,
    "bodyPart": "tobillo",
    "badge": "ORTOPEDIA",
    "linea": "ORTOPEDIA",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL"
    ],
    "hasPdf": true,
    "hasVideo": false,
    "shortDesc": "Tobillera Elástica Cintas en Ocho Urbana diseñado para soporte terapéutico de alta durabilidad y estabilidad anatómica.",
    "desc": "Dispositivo ortopédico Tobillera Elástica Cintas en Ocho Urbana fabricado con materiales de grado clínico internacional Tynor. Proporciona soporte, compresión controlada y alivio anatómico óptimo para una rehabilitación segura y confortable.",
    "uses": [
      "Tratamiento y prevención de afecciones en zona de tobillo.",
      "Rehabilitación ortopédica post-traumática o post-quirúrgica.",
      "Soporte ergonómico de uso diario con alivio de carga articular."
    ],
    "features": [
      "Material transpirable hipoalergénico de alta resistencia",
      "Diseño ergonómico ajustable a la morfología del paciente",
      "Estructura diseñada bajo estándares ortopédicos internacionales"
    ]
  },
  {
    "code": "D54",
    "name": "Anillo Subrotuliano Black (par)",
    "cat": "rodillera",
    "price": 250.0,
    "bodyPart": "rodilla",
    "badge": "ORTOPEDIA",
    "linea": "ORTOPEDIA",
    "sizes": [
      "Universal"
    ],
    "hasPdf": true,
    "hasVideo": false,
    "shortDesc": "Anillo Subrotuliano Black (par) diseñado para soporte terapéutico de alta durabilidad y estabilidad anatómica.",
    "desc": "Dispositivo ortopédico Anillo Subrotuliano Black (par) fabricado con materiales de grado clínico internacional Tynor. Proporciona soporte, compresión controlada y alivio anatómico óptimo para una rehabilitación segura y confortable.",
    "uses": [
      "Tratamiento y prevención de afecciones en zona de rodilla.",
      "Rehabilitación ortopédica post-traumática o post-quirúrgica.",
      "Soporte ergonómico de uso diario con alivio de carga articular."
    ],
    "features": [
      "Material transpirable hipoalergénico de alta resistencia",
      "Diseño ergonómico ajustable a la morfología del paciente",
      "Estructura diseñada bajo estándares ortopédicos internacionales"
    ],
    "colors": [
      {
        "id": "NEGRO",
        "name": "Negro (Black)",
        "hex": "#1E293B",
        "border": "#0F172A"
      }
    ],
    "priceBySize": {
      "Universal": 250.0
    }
  },
  {
    "code": "D58",
    "name": "Rodillera ROM Ajustable",
    "cat": "rodillera",
    "price": 1100.0,
    "bodyPart": "rodilla",
    "badge": "REHABILITACION",
    "linea": "REHABILITACION",
    "sizes": [
      "Universal"
    ],
    "hasPdf": false,
    "hasVideo": false,
    "shortDesc": "Rodillera ROM Ajustable diseñado para soporte terapéutico de alta durabilidad y estabilidad anatómica.",
    "desc": "Dispositivo ortopédico Rodillera ROM Ajustable fabricado con materiales de grado clínico internacional Tynor. Proporciona soporte, compresión controlada y alivio anatómico óptimo para una rehabilitación segura y confortable.",
    "uses": [
      "Tratamiento y prevención de afecciones en zona de rodilla.",
      "Rehabilitación ortopédica post-traumática o post-quirúrgica.",
      "Soporte ergonómico de uso diario con alivio de carga articular."
    ],
    "features": [
      "Material transpirable hipoalergénico de alta resistencia",
      "Diseño ergonómico ajustable a la morfología del paciente",
      "Estructura diseñada bajo estándares ortopédicos internacionales"
    ],
    "priceBySize": {
      "Universal": 1100.0
    }
  },
  {
    "code": "E03",
    "name": "Férula para Muñeca y Antebrazo Izquierda",
    "cat": "hombro_brazo",
    "price": 325.0,
    "bodyPart": "brazo",
    "badge": "ORTOPEDIA",
    "linea": "ORTOPEDIA",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL",
      "Pediátrico"
    ],
    "hasPdf": true,
    "hasVideo": false,
    "shortDesc": "Férula para Muñeca y Antebrazo Izquierda diseñado para soporte terapéutico de alta durabilidad y estabilidad anatómica.",
    "desc": "Dispositivo ortopédico Férula para Muñeca y Antebrazo Izquierda fabricado con materiales de grado clínico internacional Tynor. Proporciona soporte, compresión controlada y alivio anatómico óptimo para una rehabilitación segura y confortable.",
    "uses": [
      "Tratamiento y prevención de afecciones en zona de brazo.",
      "Rehabilitación ortopédica post-traumática o post-quirúrgica.",
      "Soporte ergonómico de uso diario con alivio de carga articular."
    ],
    "features": [
      "Material transpirable hipoalergénico de alta resistencia",
      "Diseño ergonómico ajustable a la morfología del paciente",
      "Estructura diseñada bajo estándares ortopédicos internacionales"
    ],
    "priceBySize": {
      "CH": 325.0,
      "M": 325.0,
      "G": 325.0,
      "XL": 325.0,
      "Pediátrico": 325.0
    }
  },
  {
    "code": "E05",
    "name": "Muñequera Elástica Sencilla",
    "cat": "inmovilizador",
    "price": 131.0,
    "bodyPart": "mano",
    "badge": "ORTOPEDIA",
    "linea": "ORTOPEDIA",
    "sizes": [
      "CH",
      "M",
      "G"
    ],
    "hasPdf": true,
    "hasVideo": false,
    "shortDesc": "Muñequera Elástica Sencilla diseñado para soporte terapéutico de alta durabilidad y estabilidad anatómica.",
    "desc": "Dispositivo ortopédico Muñequera Elástica Sencilla fabricado con materiales de grado clínico internacional Tynor. Proporciona soporte, compresión controlada y alivio anatómico óptimo para una rehabilitación segura y confortable.",
    "uses": [
      "Tratamiento y prevención de afecciones en zona de mano.",
      "Rehabilitación ortopédica post-traumática o post-quirúrgica.",
      "Soporte ergonómico de uso diario con alivio de carga articular."
    ],
    "features": [
      "Material transpirable hipoalergénico de alta resistencia",
      "Diseño ergonómico ajustable a la morfología del paciente",
      "Estructura diseñada bajo estándares ortopédicos internacionales"
    ],
    "priceBySize": {
      "CH": 131.0,
      "M": 131.0,
      "G": 131.0
    }
  },
  {
    "code": "E06",
    "name": "Muñequera Elástica",
    "cat": "inmovilizador",
    "price": 158.0,
    "bodyPart": "mano",
    "badge": "ORTOPEDIA",
    "linea": "ORTOPEDIA",
    "sizes": [
      "Universal"
    ],
    "hasPdf": true,
    "hasVideo": false,
    "shortDesc": "Muñequera Elástica diseñado para soporte terapéutico de alta durabilidad y estabilidad anatómica.",
    "desc": "Dispositivo ortopédico Muñequera Elástica fabricado con materiales de grado clínico internacional Tynor. Proporciona soporte, compresión controlada y alivio anatómico óptimo para una rehabilitación segura y confortable.",
    "uses": [
      "Tratamiento y prevención de afecciones en zona de mano.",
      "Rehabilitación ortopédica post-traumática o post-quirúrgica.",
      "Soporte ergonómico de uso diario con alivio de carga articular."
    ],
    "features": [
      "Material transpirable hipoalergénico de alta resistencia",
      "Diseño ergonómico ajustable a la morfología del paciente",
      "Estructura diseñada bajo estándares ortopédicos internacionales"
    ],
    "priceBySize": {
      "Universal": 158.0
    }
  },
  {
    "code": "E10",
    "name": "Codera de Tenista",
    "cat": "hombro_brazo",
    "price": 172.0,
    "bodyPart": "brazo",
    "badge": "ORTOPEDIA",
    "linea": "ORTOPEDIA",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL"
    ],
    "hasPdf": true,
    "hasVideo": false,
    "shortDesc": "Codera de Tenista diseñado para soporte terapéutico de alta durabilidad y estabilidad anatómica.",
    "desc": "Dispositivo ortopédico Codera de Tenista fabricado con materiales de grado clínico internacional Tynor. Proporciona soporte, compresión controlada y alivio anatómico óptimo para una rehabilitación segura y confortable.",
    "uses": [
      "Tratamiento y prevención de afecciones en zona de brazo.",
      "Rehabilitación ortopédica post-traumática o post-quirúrgica.",
      "Soporte ergonómico de uso diario con alivio de carga articular."
    ],
    "features": [
      "Material transpirable hipoalergénico de alta resistencia",
      "Diseño ergonómico ajustable a la morfología del paciente",
      "Estructura diseñada bajo estándares ortopédicos internacionales"
    ],
    "priceBySize": {
      "CH": 172.0,
      "M": 172.0,
      "G": 172.0,
      "XL": 172.0
    }
  },
  {
    "code": "E11",
    "name": "Codera Elástica con Soporte",
    "cat": "hombro_brazo",
    "price": 152.0,
    "bodyPart": "brazo",
    "badge": "ORTOPEDIA",
    "linea": "ORTOPEDIA",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL"
    ],
    "hasPdf": true,
    "hasVideo": false,
    "shortDesc": "Codera Elástica con Soporte diseñado para soporte terapéutico de alta durabilidad y estabilidad anatómica.",
    "desc": "Dispositivo ortopédico Codera Elástica con Soporte fabricado con materiales de grado clínico internacional Tynor. Proporciona soporte, compresión controlada y alivio anatómico óptimo para una rehabilitación segura y confortable.",
    "uses": [
      "Tratamiento y prevención de afecciones en zona de brazo.",
      "Rehabilitación ortopédica post-traumática o post-quirúrgica.",
      "Soporte ergonómico de uso diario con alivio de carga articular."
    ],
    "features": [
      "Material transpirable hipoalergénico de alta resistencia",
      "Diseño ergonómico ajustable a la morfología del paciente",
      "Estructura diseñada bajo estándares ortopédicos internacionales"
    ],
    "priceBySize": {
      "CH": 152.0,
      "M": 152.0,
      "G": 152.0,
      "XL": 152.0
    }
  },
  {
    "code": "E29",
    "name": "Férula de Posicionamiento de Mano Izquierda",
    "cat": "inmovilizador",
    "price": 323.0,
    "bodyPart": "mano",
    "badge": "ORTOPEDIA",
    "linea": "ORTOPEDIA",
    "sizes": [
      "CH",
      "M",
      "G",
      "Pediátrico"
    ],
    "hasPdf": true,
    "hasVideo": false,
    "shortDesc": "Férula de Posicionamiento de Mano Izquierda diseñado para soporte terapéutico de alta durabilidad y estabilidad anatómica.",
    "desc": "Dispositivo ortopédico Férula de Posicionamiento de Mano Izquierda fabricado con materiales de grado clínico internacional Tynor. Proporciona soporte, compresión controlada y alivio anatómico óptimo para una rehabilitación segura y confortable.",
    "uses": [
      "Tratamiento y prevención de afecciones en zona de mano.",
      "Rehabilitación ortopédica post-traumática o post-quirúrgica.",
      "Soporte ergonómico de uso diario con alivio de carga articular."
    ],
    "features": [
      "Material transpirable hipoalergénico de alta resistencia",
      "Diseño ergonómico ajustable a la morfología del paciente",
      "Estructura diseñada bajo estándares ortopédicos internacionales"
    ],
    "priceBySize": {
      "CH": 323.0,
      "M": 323.0,
      "G": 323.0,
      "Pediátrico": 323.0
    }
  },
  {
    "code": "E30",
    "name": "Férula para Antebrazo Ambidiestra",
    "cat": "hombro_brazo",
    "price": 523.0,
    "bodyPart": "brazo",
    "badge": "ORTOPEDIA",
    "linea": "ORTOPEDIA",
    "sizes": [
      "Universal",
      "Talla Especial"
    ],
    "hasPdf": true,
    "hasVideo": false,
    "shortDesc": "Férula para Antebrazo Ambidiestra diseñado para soporte terapéutico de alta durabilidad y estabilidad anatómica.",
    "desc": "Dispositivo ortopédico Férula para Antebrazo Ambidiestra fabricado con materiales de grado clínico internacional Tynor. Proporciona soporte, compresión controlada y alivio anatómico óptimo para una rehabilitación segura y confortable.",
    "uses": [
      "Tratamiento y prevención de afecciones en zona de brazo.",
      "Rehabilitación ortopédica post-traumática o post-quirúrgica.",
      "Soporte ergonómico de uso diario con alivio de carga articular."
    ],
    "features": [
      "Material transpirable hipoalergénico de alta resistencia",
      "Diseño ergonómico ajustable a la morfología del paciente",
      "Estructura diseñada bajo estándares ortopédicos internacionales"
    ],
    "priceBySize": {
      "Universal": 523.0,
      "Talla Especial": 523.0
    }
  },
  {
    "code": "E43",
    "name": "Tablilla Elástica para Muñeca",
    "cat": "inmovilizador",
    "price": 317.0,
    "bodyPart": "mano",
    "badge": "ORTOPEDIA",
    "linea": "ORTOPEDIA",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL"
    ],
    "hasPdf": true,
    "hasVideo": false,
    "shortDesc": "Tablilla Elástica para Muñeca diseñado para soporte terapéutico de alta durabilidad y estabilidad anatómica.",
    "desc": "Dispositivo ortopédico Tablilla Elástica para Muñeca fabricado con materiales de grado clínico internacional Tynor. Proporciona soporte, compresión controlada y alivio anatómico óptimo para una rehabilitación segura y confortable.",
    "uses": [
      "Tratamiento y prevención de afecciones en zona de mano.",
      "Rehabilitación ortopédica post-traumática o post-quirúrgica.",
      "Soporte ergonómico de uso diario con alivio de carga articular."
    ],
    "features": [
      "Material transpirable hipoalergénico de alta resistencia",
      "Diseño ergonómico ajustable a la morfología del paciente",
      "Estructura diseñada bajo estándares ortopédicos internacionales"
    ],
    "priceBySize": {
      "CH": 317.0,
      "M": 317.0,
      "G": 317.0,
      "XL": 317.0
    }
  },
  {
    "code": "E44",
    "name": "Férula de Muñeca con Abducción de Pulgar",
    "cat": "inmovilizador",
    "price": 376.0,
    "bodyPart": "mano",
    "badge": "ORTOPEDIA",
    "linea": "ORTOPEDIA",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL"
    ],
    "hasPdf": true,
    "hasVideo": false,
    "shortDesc": "Férula de Muñeca con Abducción de Pulgar diseñado para soporte terapéutico de alta durabilidad y estabilidad anatómica.",
    "desc": "Dispositivo ortopédico Férula de Muñeca con Abducción de Pulgar fabricado con materiales de grado clínico internacional Tynor. Proporciona soporte, compresión controlada y alivio anatómico óptimo para una rehabilitación segura y confortable.",
    "uses": [
      "Tratamiento y prevención de afecciones en zona de mano.",
      "Rehabilitación ortopédica post-traumática o post-quirúrgica.",
      "Soporte ergonómico de uso diario con alivio de carga articular."
    ],
    "features": [
      "Material transpirable hipoalergénico de alta resistencia",
      "Diseño ergonómico ajustable a la morfología del paciente",
      "Estructura diseñada bajo estándares ortopédicos internacionales"
    ],
    "priceBySize": {
      "CH": 376.0,
      "M": 376.0,
      "G": 376.0,
      "XL": 376.0
    }
  },
  {
    "code": "E46",
    "name": "Codera Mecánica Graduable ROM Derecha",
    "cat": "hombro_brazo",
    "price": 1307.0,
    "bodyPart": "brazo",
    "badge": "ORTOPEDIA",
    "linea": "ORTOPEDIA",
    "sizes": [
      "Universal"
    ],
    "hasPdf": true,
    "hasVideo": false,
    "shortDesc": "Codera Mecánica Graduable ROM Derecha diseñado para soporte terapéutico de alta durabilidad y estabilidad anatómica.",
    "desc": "Dispositivo ortopédico Codera Mecánica Graduable ROM Derecha fabricado con materiales de grado clínico internacional Tynor. Proporciona soporte, compresión controlada y alivio anatómico óptimo para una rehabilitación segura y confortable.",
    "uses": [
      "Tratamiento y prevención de afecciones en zona de brazo.",
      "Rehabilitación ortopédica post-traumática o post-quirúrgica.",
      "Soporte ergonómico de uso diario con alivio de carga articular."
    ],
    "features": [
      "Material transpirable hipoalergénico de alta resistencia",
      "Diseño ergonómico ajustable a la morfología del paciente",
      "Estructura diseñada bajo estándares ortopédicos internacionales"
    ],
    "priceBySize": {
      "Universal": 1307.0
    }
  },
  {
    "code": "E48",
    "name": "Codera Elástica Urbana",
    "cat": "hombro_brazo",
    "price": 250.0,
    "bodyPart": "brazo",
    "badge": "ORTOPEDIA",
    "linea": "ORTOPEDIA",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL"
    ],
    "hasPdf": true,
    "hasVideo": false,
    "shortDesc": "Codera Elástica Urbana diseñado para soporte terapéutico de alta durabilidad y estabilidad anatómica.",
    "desc": "Dispositivo ortopédico Codera Elástica Urbana fabricado con materiales de grado clínico internacional Tynor. Proporciona soporte, compresión controlada y alivio anatómico óptimo para una rehabilitación segura y confortable.",
    "uses": [
      "Tratamiento y prevención de afecciones en zona de brazo.",
      "Rehabilitación ortopédica post-traumática o post-quirúrgica.",
      "Soporte ergonómico de uso diario con alivio de carga articular."
    ],
    "features": [
      "Material transpirable hipoalergénico de alta resistencia",
      "Diseño ergonómico ajustable a la morfología del paciente",
      "Estructura diseñada bajo estándares ortopédicos internacionales"
    ],
    "priceBySize": {
      "CH": 250.0,
      "M": 250.0,
      "G": 250.0,
      "XL": 250.0
    }
  },
  {
    "code": "F02",
    "name": "Férula de Aluminio Tipo Catre",
    "cat": "inmovilizador",
    "price": 76.0,
    "bodyPart": "mano",
    "badge": "ORTOPEDIA",
    "linea": "ORTOPEDIA",
    "sizes": [
      "CH",
      "M",
      "G"
    ],
    "hasPdf": true,
    "hasVideo": false,
    "shortDesc": "Férula de Aluminio Tipo Catre diseñado para soporte terapéutico de alta durabilidad y estabilidad anatómica.",
    "desc": "Dispositivo ortopédico Férula de Aluminio Tipo Catre fabricado con materiales de grado clínico internacional Tynor. Proporciona soporte, compresión controlada y alivio anatómico óptimo para una rehabilitación segura y confortable.",
    "uses": [
      "Tratamiento y prevención de afecciones en zona de mano.",
      "Rehabilitación ortopédica post-traumática o post-quirúrgica.",
      "Soporte ergonómico de uso diario con alivio de carga articular."
    ],
    "features": [
      "Material transpirable hipoalergénico de alta resistencia",
      "Diseño ergonómico ajustable a la morfología del paciente",
      "Estructura diseñada bajo estándares ortopédicos internacionales"
    ],
    "priceBySize": {
      "CH": 76.0,
      "M": 76.0,
      "G": 76.0
    }
  },
  {
    "code": "F03",
    "name": "Inmovilizador de Aluminio para Dedo",
    "cat": "inmovilizador",
    "price": 124.0,
    "bodyPart": "mano",
    "badge": "ORTOPEDIA",
    "linea": "ORTOPEDIA",
    "sizes": [
      "CH",
      "M",
      "G"
    ],
    "hasPdf": true,
    "hasVideo": false,
    "shortDesc": "Férula anatómica acolchada maleable para falanges interfalángicas.",
    "desc": "Férula de aluminio maleable recubierta de espuma de alta densidad que inmoviliza y protege las falanges de los dedos en caso de fracturas, esguinces o rehabilitación articular.",
    "uses": [
      "Fracturas de falanges distales y medias.",
      "Esguinces articulares interfalángicos.",
      "Protección post-traumática deportiva."
    ],
    "features": [
      "Aluminio anodizado maleable a la anatomía del paciente",
      "Interior en espuma de poliuretano ventilada",
      "No interfiere con rayos X de control médico"
    ],
    "priceBySize": {
      "CH": 124.0,
      "M": 124.0,
      "G": 124.0
    }
  },
  {
    "code": "F04",
    "name": "Férula de Aluminio Tipo Rana",
    "cat": "inmovilizador",
    "price": 76.0,
    "bodyPart": "mano",
    "badge": "ORTOPEDIA",
    "linea": "ORTOPEDIA",
    "sizes": [
      "CH",
      "M",
      "G"
    ],
    "hasPdf": true,
    "hasVideo": false,
    "shortDesc": "Férula de Aluminio Tipo Rana diseñado para soporte terapéutico de alta durabilidad y estabilidad anatómica.",
    "desc": "Dispositivo ortopédico Férula de Aluminio Tipo Rana fabricado con materiales de grado clínico internacional Tynor. Proporciona soporte, compresión controlada y alivio anatómico óptimo para una rehabilitación segura y confortable.",
    "uses": [
      "Tratamiento y prevención de afecciones en zona de mano.",
      "Rehabilitación ortopédica post-traumática o post-quirúrgica.",
      "Soporte ergonómico de uso diario con alivio de carga articular."
    ],
    "features": [
      "Material transpirable hipoalergénico de alta resistencia",
      "Diseño ergonómico ajustable a la morfología del paciente",
      "Estructura diseñada bajo estándares ortopédicos internacionales"
    ],
    "priceBySize": {
      "CH": 76.0,
      "M": 76.0,
      "G": 76.0
    }
  },
  {
    "code": "F05",
    "name": "Férula de Alumionio Tipo Martillo",
    "cat": "inmovilizador",
    "price": 76.0,
    "bodyPart": "mano",
    "badge": "ORTOPEDIA",
    "linea": "ORTOPEDIA",
    "sizes": [
      "Universal"
    ],
    "hasPdf": true,
    "hasVideo": false,
    "shortDesc": "Férula de Alumionio Tipo Martillo diseñado para soporte terapéutico de alta durabilidad y estabilidad anatómica.",
    "desc": "Dispositivo ortopédico Férula de Alumionio Tipo Martillo fabricado con materiales de grado clínico internacional Tynor. Proporciona soporte, compresión controlada y alivio anatómico óptimo para una rehabilitación segura y confortable.",
    "uses": [
      "Tratamiento y prevención de afecciones en zona de mano.",
      "Rehabilitación ortopédica post-traumática o post-quirúrgica.",
      "Soporte ergonómico de uso diario con alivio de carga articular."
    ],
    "features": [
      "Material transpirable hipoalergénico de alta resistencia",
      "Diseño ergonómico ajustable a la morfología del paciente",
      "Estructura diseñada bajo estándares ortopédicos internacionales"
    ],
    "priceBySize": {
      "Universal": 76.0
    }
  },
  {
    "code": "F06",
    "name": "Férula Tipo Quervain Ambidiestra",
    "cat": "inmovilizador",
    "price": 193.0,
    "bodyPart": "mano",
    "badge": "ORTOPEDIA",
    "linea": "ORTOPEDIA",
    "sizes": [
      "Universal"
    ],
    "hasPdf": true,
    "hasVideo": false,
    "shortDesc": "Férula Tipo Quervain Ambidiestra diseñado para soporte terapéutico de alta durabilidad y estabilidad anatómica.",
    "desc": "Dispositivo ortopédico Férula Tipo Quervain Ambidiestra fabricado con materiales de grado clínico internacional Tynor. Proporciona soporte, compresión controlada y alivio anatómico óptimo para una rehabilitación segura y confortable.",
    "uses": [
      "Tratamiento y prevención de afecciones en zona de mano.",
      "Rehabilitación ortopédica post-traumática o post-quirúrgica.",
      "Soporte ergonómico de uso diario con alivio de carga articular."
    ],
    "features": [
      "Material transpirable hipoalergénico de alta resistencia",
      "Diseño ergonómico ajustable a la morfología del paciente",
      "Estructura diseñada bajo estándares ortopédicos internacionales"
    ],
    "priceBySize": {
      "Universal": 193.0
    }
  },
  {
    "code": "G01",
    "name": "Kit de Tracción Cutanea con Polea",
    "cat": "tobillo",
    "price": 150.0,
    "bodyPart": "tobillo",
    "badge": "REHABILITACION",
    "linea": "REHABILITACION",
    "sizes": [
      "Adulto",
      "Infantil",
      "Pediátrico"
    ],
    "hasPdf": true,
    "hasVideo": false,
    "shortDesc": "Kit de Tracción Cutanea con Polea diseñado para soporte terapéutico de alta durabilidad y estabilidad anatómica.",
    "desc": "Dispositivo ortopédico Kit de Tracción Cutanea con Polea fabricado con materiales de grado clínico internacional Tynor. Proporciona soporte, compresión controlada y alivio anatómico óptimo para una rehabilitación segura y confortable.",
    "uses": [
      "Tratamiento y prevención de afecciones en zona de tobillo.",
      "Rehabilitación ortopédica post-traumática o post-quirúrgica.",
      "Soporte ergonómico de uso diario con alivio de carga articular."
    ],
    "features": [
      "Material transpirable hipoalergénico de alta resistencia",
      "Diseño ergonómico ajustable a la morfología del paciente",
      "Estructura diseñada bajo estándares ortopédicos internacionales"
    ],
    "priceBySize": {
      "Adulto": 150.0,
      "Infantil": 150.0,
      "Pediátrico": 150.0
    }
  },
  {
    "code": "G20",
    "name": "Bolsa de Peso para Tracción",
    "cat": "tobillo",
    "price": 125.0,
    "bodyPart": "tobillo",
    "badge": "ORTOPEDIA",
    "linea": "ORTOPEDIA",
    "sizes": [
      "Universal"
    ],
    "hasPdf": true,
    "hasVideo": false,
    "shortDesc": "Bolsa de Peso para Tracción diseñado para soporte terapéutico de alta durabilidad y estabilidad anatómica.",
    "desc": "Dispositivo ortopédico Bolsa de Peso para Tracción fabricado con materiales de grado clínico internacional Tynor. Proporciona soporte, compresión controlada y alivio anatómico óptimo para una rehabilitación segura y confortable.",
    "uses": [
      "Tratamiento y prevención de afecciones en zona de tobillo.",
      "Rehabilitación ortopédica post-traumática o post-quirúrgica.",
      "Soporte ergonómico de uso diario con alivio de carga articular."
    ],
    "features": [
      "Material transpirable hipoalergénico de alta resistencia",
      "Diseño ergonómico ajustable a la morfología del paciente",
      "Estructura diseñada bajo estándares ortopédicos internacionales"
    ],
    "priceBySize": {
      "Universal": 125.0
    }
  },
  {
    "code": "G25",
    "name": "Tracción Cervical para Puerta",
    "cat": "cervical",
    "price": 510.0,
    "bodyPart": "cuello",
    "badge": "ORTOPEDIA",
    "linea": "ORTOPEDIA",
    "sizes": [
      "Universal"
    ],
    "hasPdf": true,
    "hasVideo": false,
    "shortDesc": "Tracción Cervical para Puerta diseñado para soporte terapéutico de alta durabilidad y estabilidad anatómica.",
    "desc": "Dispositivo ortopédico Tracción Cervical para Puerta fabricado con materiales de grado clínico internacional Tynor. Proporciona soporte, compresión controlada y alivio anatómico óptimo para una rehabilitación segura y confortable.",
    "uses": [
      "Tratamiento y prevención de afecciones en zona de cuello.",
      "Rehabilitación ortopédica post-traumática o post-quirúrgica.",
      "Soporte ergonómico de uso diario con alivio de carga articular."
    ],
    "features": [
      "Material transpirable hipoalergénico de alta resistencia",
      "Diseño ergonómico ajustable a la morfología del paciente",
      "Estructura diseñada bajo estándares ortopédicos internacionales"
    ],
    "priceBySize": {
      "Universal": 510.0
    }
  },
  {
    "code": "H01",
    "name": "Polaina para Muñeca",
    "cat": "inmovilizador",
    "price": 197.0,
    "bodyPart": "mano",
    "badge": "REHABILITACION",
    "linea": "REHABILITACION",
    "sizes": [
      "Universal"
    ],
    "hasPdf": true,
    "hasVideo": false,
    "shortDesc": "Polaina para Muñeca diseñado para soporte terapéutico de alta durabilidad y estabilidad anatómica.",
    "desc": "Dispositivo ortopédico Polaina para Muñeca fabricado con materiales de grado clínico internacional Tynor. Proporciona soporte, compresión controlada y alivio anatómico óptimo para una rehabilitación segura y confortable.",
    "uses": [
      "Tratamiento y prevención de afecciones en zona de mano.",
      "Rehabilitación ortopédica post-traumática o post-quirúrgica.",
      "Soporte ergonómico de uso diario con alivio de carga articular."
    ],
    "features": [
      "Material transpirable hipoalergénico de alta resistencia",
      "Diseño ergonómico ajustable a la morfología del paciente",
      "Estructura diseñada bajo estándares ortopédicos internacionales"
    ],
    "priceBySize": {
      "Universal": 197.0
    }
  },
  {
    "code": "H02",
    "name": "Polaina para Muñeca o Pie",
    "cat": "inmovilizador",
    "price": 351.0,
    "bodyPart": "mano",
    "badge": "REHABILITACION",
    "linea": "REHABILITACION",
    "sizes": [
      "Universal"
    ],
    "hasPdf": true,
    "hasVideo": false,
    "shortDesc": "Polaina para Muñeca o Pie diseñado para soporte terapéutico de alta durabilidad y estabilidad anatómica.",
    "desc": "Dispositivo ortopédico Polaina para Muñeca o Pie fabricado con materiales de grado clínico internacional Tynor. Proporciona soporte, compresión controlada y alivio anatómico óptimo para una rehabilitación segura y confortable.",
    "uses": [
      "Tratamiento y prevención de afecciones en zona de mano.",
      "Rehabilitación ortopédica post-traumática o post-quirúrgica.",
      "Soporte ergonómico de uso diario con alivio de carga articular."
    ],
    "features": [
      "Material transpirable hipoalergénico de alta resistencia",
      "Diseño ergonómico ajustable a la morfología del paciente",
      "Estructura diseñada bajo estándares ortopédicos internacionales"
    ],
    "priceBySize": {
      "Universal": 351.0
    }
  },
  {
    "code": "H03",
    "name": "Polaina para Muñeca o Pie",
    "cat": "inmovilizador",
    "price": 351.0,
    "bodyPart": "mano",
    "badge": "REHABILITACION",
    "linea": "REHABILITACION",
    "sizes": [
      "Universal"
    ],
    "hasPdf": true,
    "hasVideo": false,
    "shortDesc": "Polaina para Muñeca o Pie diseñado para soporte terapéutico de alta durabilidad y estabilidad anatómica.",
    "desc": "Dispositivo ortopédico Polaina para Muñeca o Pie fabricado con materiales de grado clínico internacional Tynor. Proporciona soporte, compresión controlada y alivio anatómico óptimo para una rehabilitación segura y confortable.",
    "uses": [
      "Tratamiento y prevención de afecciones en zona de mano.",
      "Rehabilitación ortopédica post-traumática o post-quirúrgica.",
      "Soporte ergonómico de uso diario con alivio de carga articular."
    ],
    "features": [
      "Material transpirable hipoalergénico de alta resistencia",
      "Diseño ergonómico ajustable a la morfología del paciente",
      "Estructura diseñada bajo estándares ortopédicos internacionales"
    ],
    "priceBySize": {
      "Universal": 351.0
    }
  },
  {
    "code": "H05",
    "name": "Pelota de Rehabilitacion",
    "cat": "inmovilizador",
    "price": 55.0,
    "bodyPart": "espalda",
    "badge": "ORTOPEDIA",
    "linea": "ORTOPEDIA",
    "sizes": [
      "Universal"
    ],
    "hasPdf": true,
    "hasVideo": false,
    "shortDesc": "Pelota de Rehabilitacion diseñado para soporte terapéutico de alta durabilidad y estabilidad anatómica.",
    "desc": "Dispositivo ortopédico Pelota de Rehabilitacion fabricado con materiales de grado clínico internacional Tynor. Proporciona soporte, compresión controlada y alivio anatómico óptimo para una rehabilitación segura y confortable.",
    "uses": [
      "Tratamiento y prevención de afecciones en zona de espalda.",
      "Rehabilitación ortopédica post-traumática o post-quirúrgica.",
      "Soporte ergonómico de uso diario con alivio de carga articular."
    ],
    "features": [
      "Material transpirable hipoalergénico de alta resistencia",
      "Diseño ergonómico ajustable a la morfología del paciente",
      "Estructura diseñada bajo estándares ortopédicos internacionales"
    ],
    "priceBySize": {
      "Universal": 55.0
    }
  },
  {
    "code": "H12",
    "name": "Compresa de Gel para Ojos (antifaz)",
    "cat": "inmovilizador",
    "price": 95.0,
    "bodyPart": "espalda",
    "badge": "ORTOPEDIA",
    "linea": "ORTOPEDIA",
    "sizes": [
      "Universal"
    ],
    "hasPdf": true,
    "hasVideo": false,
    "shortDesc": "Compresa de Gel para Ojos (antifaz) diseñado para soporte terapéutico de alta durabilidad y estabilidad anatómica.",
    "desc": "Dispositivo ortopédico Compresa de Gel para Ojos (antifaz) fabricado con materiales de grado clínico internacional Tynor. Proporciona soporte, compresión controlada y alivio anatómico óptimo para una rehabilitación segura y confortable.",
    "uses": [
      "Tratamiento y prevención de afecciones en zona de espalda.",
      "Rehabilitación ortopédica post-traumática o post-quirúrgica.",
      "Soporte ergonómico de uso diario con alivio de carga articular."
    ],
    "features": [
      "Material transpirable hipoalergénico de alta resistencia",
      "Diseño ergonómico ajustable a la morfología del paciente",
      "Estructura diseñada bajo estándares ortopédicos internacionales"
    ],
    "priceBySize": {
      "Universal": 95.0
    }
  },
  {
    "code": "H13",
    "name": "Cojín para Coxis",
    "cat": "inmovilizador",
    "price": 680.0,
    "bodyPart": "espalda",
    "badge": "ORTOPEDIA",
    "linea": "ORTOPEDIA",
    "sizes": [
      "Universal"
    ],
    "hasPdf": true,
    "hasVideo": false,
    "shortDesc": "Cojín para Coxis diseñado para soporte terapéutico de alta durabilidad y estabilidad anatómica.",
    "desc": "Dispositivo ortopédico Cojín para Coxis fabricado con materiales de grado clínico internacional Tynor. Proporciona soporte, compresión controlada y alivio anatómico óptimo para una rehabilitación segura y confortable.",
    "uses": [
      "Tratamiento y prevención de afecciones en zona de espalda.",
      "Rehabilitación ortopédica post-traumática o post-quirúrgica.",
      "Soporte ergonómico de uso diario con alivio de carga articular."
    ],
    "features": [
      "Material transpirable hipoalergénico de alta resistencia",
      "Diseño ergonómico ajustable a la morfología del paciente",
      "Estructura diseñada bajo estándares ortopédicos internacionales"
    ],
    "priceBySize": {
      "Universal": 680.0
    }
  },
  {
    "code": "H14",
    "name": "Banda de Resistencia Tyroband 1.50 Mts Largo",
    "cat": "inmovilizador",
    "price": 120,
    "bodyPart": "espalda",
    "badge": "ORTOPEDIA",
    "linea": "ORTOPEDIA",
    "sizes": [
      "Universal"
    ],
    "hasPdf": true,
    "hasVideo": false,
    "shortDesc": "Banda de Resistencia Tyroband 1.50 Mts Largo diseñado para soporte terapéutico de alta durabilidad y estabilidad anatómica.",
    "desc": "Dispositivo ortopédico Banda de Resistencia Tyroband 1.50 Mts Largo fabricado con materiales de grado clínico internacional Tynor. Proporciona soporte, compresión controlada y alivio anatómico óptimo para una rehabilitación segura y confortable.",
    "uses": [
      "Tratamiento y prevención de afecciones en zona de espalda.",
      "Rehabilitación ortopédica post-traumática o post-quirúrgica.",
      "Soporte ergonómico de uso diario con alivio de carga articular."
    ],
    "features": [
      "Material transpirable hipoalergénico de alta resistencia",
      "Diseño ergonómico ajustable a la morfología del paciente",
      "Estructura diseñada bajo estándares ortopédicos internacionales"
    ],
    "priceBySize": {
      "UNITALLA": 120,
      "Universal": 120
    },
    "colors": [
      {
        "id": "AMARILLO",
        "name": "Amarillo",
        "hex": "#EAB308",
        "border": "#CA8A04"
      }
    ]
  },
  {
    "code": "H15",
    "name": "Banda de Resistencia Tyroband 1.50 Mts Largo",
    "cat": "inmovilizador",
    "price": 120,
    "bodyPart": "espalda",
    "badge": "ORTOPEDIA",
    "linea": "ORTOPEDIA",
    "sizes": [
      "Universal"
    ],
    "hasPdf": true,
    "hasVideo": false,
    "shortDesc": "Banda de Resistencia Tyroband 1.50 Mts Largo diseñado para soporte terapéutico de alta durabilidad y estabilidad anatómica.",
    "desc": "Dispositivo ortopédico Banda de Resistencia Tyroband 1.50 Mts Largo fabricado con materiales de grado clínico internacional Tynor. Proporciona soporte, compresión controlada y alivio anatómico óptimo para una rehabilitación segura y confortable.",
    "uses": [
      "Tratamiento y prevención de afecciones en zona de espalda.",
      "Rehabilitación ortopédica post-traumática o post-quirúrgica.",
      "Soporte ergonómico de uso diario con alivio de carga articular."
    ],
    "features": [
      "Material transpirable hipoalergénico de alta resistencia",
      "Diseño ergonómico ajustable a la morfología del paciente",
      "Estructura diseñada bajo estándares ortopédicos internacionales"
    ],
    "priceBySize": {
      "UNITALLA": 120,
      "Universal": 120
    },
    "colors": [
      {
        "id": "ROJO",
        "name": "Rojo",
        "hex": "#EF4444",
        "border": "#DC2626"
      }
    ]
  },
  {
    "code": "H16",
    "name": "Banda de Resistencia Tyroband 1.50 Mts Largo",
    "cat": "inmovilizador",
    "price": 120,
    "bodyPart": "espalda",
    "badge": "ORTOPEDIA",
    "linea": "ORTOPEDIA",
    "sizes": [
      "Universal"
    ],
    "hasPdf": true,
    "hasVideo": false,
    "shortDesc": "Banda de Resistencia Tyroband 1.50 Mts Largo diseñado para soporte terapéutico de alta durabilidad y estabilidad anatómica.",
    "desc": "Dispositivo ortopédico Banda de Resistencia Tyroband 1.50 Mts Largo fabricado con materiales de grado clínico internacional Tynor. Proporciona soporte, compresión controlada y alivio anatómico óptimo para una rehabilitación segura y confortable.",
    "uses": [
      "Tratamiento y prevención de afecciones en zona de espalda.",
      "Rehabilitación ortopédica post-traumática o post-quirúrgica.",
      "Soporte ergonómico de uso diario con alivio de carga articular."
    ],
    "features": [
      "Material transpirable hipoalergénico de alta resistencia",
      "Diseño ergonómico ajustable a la morfología del paciente",
      "Estructura diseñada bajo estándares ortopédicos internacionales"
    ],
    "priceBySize": {
      "UNITALLA": 120,
      "Universal": 120
    },
    "colors": [
      {
        "id": "VERDE",
        "name": "Verde",
        "hex": "#22C55E",
        "border": "#16A34A"
      }
    ]
  },
  {
    "code": "H17",
    "name": "Banda de Resistencia Tyroband 1.50 Mts Largo",
    "cat": "inmovilizador",
    "price": 150,
    "bodyPart": "espalda",
    "badge": "ORTOPEDIA",
    "linea": "ORTOPEDIA",
    "sizes": [
      "Universal"
    ],
    "hasPdf": true,
    "hasVideo": false,
    "shortDesc": "Banda de Resistencia Tyroband 1.50 Mts Largo diseñado para soporte terapéutico de alta durabilidad y estabilidad anatómica.",
    "desc": "Dispositivo ortopédico Banda de Resistencia Tyroband 1.50 Mts Largo fabricado con materiales de grado clínico internacional Tynor. Proporciona soporte, compresión controlada y alivio anatómico óptimo para una rehabilitación segura y confortable.",
    "uses": [
      "Tratamiento y prevención de afecciones en zona de espalda.",
      "Rehabilitación ortopédica post-traumática o post-quirúrgica.",
      "Soporte ergonómico de uso diario con alivio de carga articular."
    ],
    "features": [
      "Material transpirable hipoalergénico de alta resistencia",
      "Diseño ergonómico ajustable a la morfología del paciente",
      "Estructura diseñada bajo estándares ortopédicos internacionales"
    ],
    "priceBySize": {
      "UNITALLA": 150,
      "Universal": 150
    },
    "colors": [
      {
        "id": "AZUL",
        "name": "Azul",
        "hex": "#3B82F6",
        "border": "#2563EB"
      }
    ]
  },
  {
    "code": "H18",
    "name": "Banda de Resistencia Tyroband 1.50 Mts Largo",
    "cat": "inmovilizador",
    "price": 150,
    "bodyPart": "espalda",
    "badge": "ORTOPEDIA",
    "linea": "ORTOPEDIA",
    "sizes": [
      "Universal"
    ],
    "hasPdf": true,
    "hasVideo": false,
    "shortDesc": "Banda de Resistencia Tyroband 1.50 Mts Largo diseñado para soporte terapéutico de alta durabilidad y estabilidad anatómica.",
    "desc": "Dispositivo ortopédico Banda de Resistencia Tyroband 1.50 Mts Largo fabricado con materiales de grado clínico internacional Tynor. Proporciona soporte, compresión controlada y alivio anatómico óptimo para una rehabilitación segura y confortable.",
    "uses": [
      "Tratamiento y prevención de afecciones en zona de espalda.",
      "Rehabilitación ortopédica post-traumática o post-quirúrgica.",
      "Soporte ergonómico de uso diario con alivio de carga articular."
    ],
    "features": [
      "Material transpirable hipoalergénico de alta resistencia",
      "Diseño ergonómico ajustable a la morfología del paciente",
      "Estructura diseñada bajo estándares ortopédicos internacionales"
    ],
    "priceBySize": {
      "UNITALLA": 150,
      "Universal": 150
    },
    "colors": [
      {
        "id": "GRIS",
        "name": "Gris",
        "hex": "#64748B",
        "border": "#475569"
      }
    ]
  },
  {
    "code": "H23",
    "name": "Asiento Ortopédico",
    "cat": "inmovilizador",
    "price": 400.0,
    "bodyPart": "espalda",
    "badge": "ORTOPEDIA",
    "linea": "ORTOPEDIA",
    "sizes": [
      "Universal"
    ],
    "hasPdf": true,
    "hasVideo": false,
    "shortDesc": "Asiento Ortopédico diseñado para soporte terapéutico de alta durabilidad y estabilidad anatómica.",
    "desc": "Dispositivo ortopédico Asiento Ortopédico fabricado con materiales de grado clínico internacional Tynor. Proporciona soporte, compresión controlada y alivio anatómico óptimo para una rehabilitación segura y confortable.",
    "uses": [
      "Tratamiento y prevención de afecciones en zona de espalda.",
      "Rehabilitación ortopédica post-traumática o post-quirúrgica.",
      "Soporte ergonómico de uso diario con alivio de carga articular."
    ],
    "features": [
      "Material transpirable hipoalergénico de alta resistencia",
      "Diseño ergonómico ajustable a la morfología del paciente",
      "Estructura diseñada bajo estándares ortopédicos internacionales"
    ],
    "priceBySize": {
      "Universal": 400.0
    }
  },
  {
    "code": "I01",
    "name": "Torniquete",
    "cat": "tobillo",
    "price": 25.0,
    "bodyPart": "pierna",
    "badge": "ORTOPEDIA",
    "linea": "ORTOPEDIA",
    "sizes": [
      "CH",
      "M",
      "G"
    ],
    "hasPdf": true,
    "hasVideo": false,
    "shortDesc": "Torniquete diseñado para soporte terapéutico de alta durabilidad y estabilidad anatómica.",
    "desc": "Dispositivo ortopédico Torniquete fabricado con materiales de grado clínico internacional Tynor. Proporciona soporte, compresión controlada y alivio anatómico óptimo para una rehabilitación segura y confortable.",
    "uses": [
      "Tratamiento y prevención de afecciones en zona de pierna.",
      "Rehabilitación ortopédica post-traumática o post-quirúrgica.",
      "Soporte ergonómico de uso diario con alivio de carga articular."
    ],
    "features": [
      "Material transpirable hipoalergénico de alta resistencia",
      "Diseño ergonómico ajustable a la morfología del paciente",
      "Estructura diseñada bajo estándares ortopédicos internacionales"
    ],
    "priceBySize": {
      "CH": 25.0,
      "M": 25.0,
      "G": 25.0
    }
  },
  {
    "code": "I02",
    "name": "Rodillera con Compresa Integrada",
    "cat": "rodillera",
    "price": 355.0,
    "bodyPart": "rodilla",
    "badge": "ORTOPEDIA",
    "linea": "ORTOPEDIA",
    "sizes": [
      "Universal"
    ],
    "hasPdf": true,
    "hasVideo": false,
    "shortDesc": "Rodillera con Compresa Integrada diseñado para soporte terapéutico de alta durabilidad y estabilidad anatómica.",
    "desc": "Dispositivo ortopédico Rodillera con Compresa Integrada fabricado con materiales de grado clínico internacional Tynor. Proporciona soporte, compresión controlada y alivio anatómico óptimo para una rehabilitación segura y confortable.",
    "uses": [
      "Tratamiento y prevención de afecciones en zona de rodilla.",
      "Rehabilitación ortopédica post-traumática o post-quirúrgica.",
      "Soporte ergonómico de uso diario con alivio de carga articular."
    ],
    "features": [
      "Material transpirable hipoalergénico de alta resistencia",
      "Diseño ergonómico ajustable a la morfología del paciente",
      "Estructura diseñada bajo estándares ortopédicos internacionales"
    ],
    "priceBySize": {
      "Universal": 355.0
    }
  },
  {
    "code": "I15",
    "name": "Medias Elásticas de Compresión al Muslo (par)",
    "cat": "tobillo",
    "price": 396.0,
    "bodyPart": "pierna",
    "badge": "ORTOPEDIA",
    "linea": "ORTOPEDIA",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL",
      "XXL"
    ],
    "hasPdf": true,
    "hasVideo": false,
    "shortDesc": "Medias Elásticas de Compresión al Muslo (par) diseñado para soporte terapéutico de alta durabilidad y estabilidad anatómica.",
    "desc": "Dispositivo ortopédico Medias Elásticas de Compresión al Muslo (par) fabricado con materiales de grado clínico internacional Tynor. Proporciona soporte, compresión controlada y alivio anatómico óptimo para una rehabilitación segura y confortable.",
    "uses": [
      "Tratamiento y prevención de afecciones en zona de pierna.",
      "Rehabilitación ortopédica post-traumática o post-quirúrgica.",
      "Soporte ergonómico de uso diario con alivio de carga articular."
    ],
    "features": [
      "Material transpirable hipoalergénico de alta resistencia",
      "Diseño ergonómico ajustable a la morfología del paciente",
      "Estructura diseñada bajo estándares ortopédicos internacionales"
    ],
    "priceBySize": {
      "CH": 396.0,
      "M": 396.0,
      "G": 396.0,
      "XL": 421.0,
      "XXL": 421.0
    }
  },
  {
    "code": "I16",
    "name": "Medias Elásticas de Compresión a La Rodilla (par)",
    "cat": "rodillera",
    "price": 338.0,
    "bodyPart": "rodilla",
    "badge": "ORTOPEDIA",
    "linea": "ORTOPEDIA",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL",
      "XXL"
    ],
    "hasPdf": true,
    "hasVideo": false,
    "shortDesc": "Medias Elásticas de Compresión a La Rodilla (par) diseñado para soporte terapéutico de alta durabilidad y estabilidad anatómica.",
    "desc": "Dispositivo ortopédico Medias Elásticas de Compresión a La Rodilla (par) fabricado con materiales de grado clínico internacional Tynor. Proporciona soporte, compresión controlada y alivio anatómico óptimo para una rehabilitación segura y confortable.",
    "uses": [
      "Tratamiento y prevención de afecciones en zona de rodilla.",
      "Rehabilitación ortopédica post-traumática o post-quirúrgica.",
      "Soporte ergonómico de uso diario con alivio de carga articular."
    ],
    "features": [
      "Material transpirable hipoalergénico de alta resistencia",
      "Diseño ergonómico ajustable a la morfología del paciente",
      "Estructura diseñada bajo estándares ortopédicos internacionales"
    ],
    "priceBySize": {
      "CH": 338.0,
      "M": 338.0,
      "G": 338.0,
      "XL": 409.0,
      "XXL": 409.0
    }
  },
  {
    "code": "I46",
    "name": "Respaldo Ortopédico",
    "cat": "tobillo",
    "price": 625.0,
    "bodyPart": "pierna",
    "badge": "ORTOPEDIA",
    "linea": "ORTOPEDIA",
    "sizes": [
      "Universal"
    ],
    "hasPdf": true,
    "hasVideo": false,
    "shortDesc": "Respaldo Ortopédico diseñado para soporte terapéutico de alta durabilidad y estabilidad anatómica.",
    "desc": "Dispositivo ortopédico Respaldo Ortopédico fabricado con materiales de grado clínico internacional Tynor. Proporciona soporte, compresión controlada y alivio anatómico óptimo para una rehabilitación segura y confortable.",
    "uses": [
      "Tratamiento y prevención de afecciones en zona de pierna.",
      "Rehabilitación ortopédica post-traumática o post-quirúrgica.",
      "Soporte ergonómico de uso diario con alivio de carga articular."
    ],
    "features": [
      "Material transpirable hipoalergénico de alta resistencia",
      "Diseño ergonómico ajustable a la morfología del paciente",
      "Estructura diseñada bajo estándares ortopédicos internacionales"
    ],
    "priceBySize": {
      "Universal": 625.0
    }
  },
  {
    "code": "I59",
    "name": "Soporte Escrotal",
    "cat": "tobillo",
    "price": 241.0,
    "bodyPart": "pierna",
    "badge": "ORTOPEDIA",
    "linea": "ORTOPEDIA",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL"
    ],
    "hasPdf": true,
    "hasVideo": false,
    "shortDesc": "Soporte Escrotal diseñado para soporte terapéutico de alta durabilidad y estabilidad anatómica.",
    "desc": "Dispositivo ortopédico Soporte Escrotal fabricado con materiales de grado clínico internacional Tynor. Proporciona soporte, compresión controlada y alivio anatómico óptimo para una rehabilitación segura y confortable.",
    "uses": [
      "Tratamiento y prevención de afecciones en zona de pierna.",
      "Rehabilitación ortopédica post-traumática o post-quirúrgica.",
      "Soporte ergonómico de uso diario con alivio de carga articular."
    ],
    "features": [
      "Material transpirable hipoalergénico de alta resistencia",
      "Diseño ergonómico ajustable a la morfología del paciente",
      "Estructura diseñada bajo estándares ortopédicos internacionales"
    ],
    "priceBySize": {
      "CH": 241.0,
      "M": 241.0,
      "G": 241.0,
      "XL": 241.0
    }
  },
  {
    "code": "I65",
    "name": "Limitador de Movimientos Manos/pies",
    "cat": "tobillo",
    "price": 213.0,
    "bodyPart": "tobillo",
    "badge": "ORTOPEDIA",
    "linea": "ORTOPEDIA",
    "sizes": [
      "Universal"
    ],
    "hasPdf": true,
    "hasVideo": false,
    "shortDesc": "Limitador de Movimientos Manos/pies diseñado para soporte terapéutico de alta durabilidad y estabilidad anatómica.",
    "desc": "Dispositivo ortopédico Limitador de Movimientos Manos/pies fabricado con materiales de grado clínico internacional Tynor. Proporciona soporte, compresión controlada y alivio anatómico óptimo para una rehabilitación segura y confortable.",
    "uses": [
      "Tratamiento y prevención de afecciones en zona de tobillo.",
      "Rehabilitación ortopédica post-traumática o post-quirúrgica.",
      "Soporte ergonómico de uso diario con alivio de carga articular."
    ],
    "features": [
      "Material transpirable hipoalergénico de alta resistencia",
      "Diseño ergonómico ajustable a la morfología del paciente",
      "Estructura diseñada bajo estándares ortopédicos internacionales"
    ],
    "priceBySize": {
      "Universal": 213.0
    }
  },
  {
    "code": "I70",
    "name": "Media de Compresión Medica al Muslo Clase II 22-32 Mmhg",
    "cat": "tobillo",
    "price": null,
    "bodyPart": "pierna",
    "badge": "ORTOPEDIA",
    "linea": "ORTOPEDIA",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL",
      "XXL"
    ],
    "hasPdf": true,
    "hasVideo": false,
    "shortDesc": "Media de Compresión Medica al Muslo Clase II 22-32 Mmhg diseñado para soporte terapéutico de alta durabilidad y estabilidad anatómica.",
    "desc": "Dispositivo ortopédico Media de Compresión Medica al Muslo Clase II 22-32 Mmhg fabricado con materiales de grado clínico internacional Tynor. Proporciona soporte, compresión controlada y alivio anatómico óptimo para una rehabilitación segura y confortable.",
    "uses": [
      "Tratamiento y prevención de afecciones en zona de pierna.",
      "Rehabilitación ortopédica post-traumática o post-quirúrgica.",
      "Soporte ergonómico de uso diario con alivio de carga articular."
    ],
    "features": [
      "Material transpirable hipoalergénico de alta resistencia",
      "Diseño ergonómico ajustable a la morfología del paciente",
      "Estructura diseñada bajo estándares ortopédicos internacionales"
    ]
  },
  {
    "code": "I83",
    "name": "Camiseta Normal de Compresión",
    "cat": "tobillo",
    "price": null,
    "bodyPart": "pierna",
    "badge": "ORTOPEDIA",
    "linea": "ORTOPEDIA",
    "sizes": [
      "CH",
      "G",
      "XL",
      "XXL"
    ],
    "hasPdf": true,
    "hasVideo": false,
    "shortDesc": "Camiseta Normal de Compresión diseñado para soporte terapéutico de alta durabilidad y estabilidad anatómica.",
    "desc": "Dispositivo ortopédico Camiseta Normal de Compresión fabricado con materiales de grado clínico internacional Tynor. Proporciona soporte, compresión controlada y alivio anatómico óptimo para una rehabilitación segura y confortable.",
    "uses": [
      "Tratamiento y prevención de afecciones en zona de pierna.",
      "Rehabilitación ortopédica post-traumática o post-quirúrgica.",
      "Soporte ergonómico de uso diario con alivio de carga articular."
    ],
    "features": [
      "Material transpirable hipoalergénico de alta resistencia",
      "Diseño ergonómico ajustable a la morfología del paciente",
      "Estructura diseñada bajo estándares ortopédicos internacionales"
    ]
  },
  {
    "code": "I91",
    "name": "Respaldo Ortopédico Lumbar",
    "cat": "lumbar",
    "price": 605.0,
    "bodyPart": "espalda",
    "badge": "ORTOPEDIA",
    "linea": "ORTOPEDIA",
    "sizes": [
      "Universal"
    ],
    "hasPdf": true,
    "hasVideo": false,
    "shortDesc": "Respaldo Ortopédico Lumbar diseñado para soporte terapéutico de alta durabilidad y estabilidad anatómica.",
    "desc": "Dispositivo ortopédico Respaldo Ortopédico Lumbar fabricado con materiales de grado clínico internacional Tynor. Proporciona soporte, compresión controlada y alivio anatómico óptimo para una rehabilitación segura y confortable.",
    "uses": [
      "Tratamiento y prevención de afecciones en zona de espalda.",
      "Rehabilitación ortopédica post-traumática o post-quirúrgica.",
      "Soporte ergonómico de uso diario con alivio de carga articular."
    ],
    "features": [
      "Material transpirable hipoalergénico de alta resistencia",
      "Diseño ergonómico ajustable a la morfología del paciente",
      "Estructura diseñada bajo estándares ortopédicos internacionales"
    ],
    "priceBySize": {
      "Universal": 605.0
    }
  },
  {
    "code": "I93",
    "name": "Almohada para Viaje",
    "cat": "tobillo",
    "price": 300,
    "bodyPart": "pierna",
    "badge": "ORTOPEDIA",
    "linea": "ORTOPEDIA",
    "sizes": [
      "Universal"
    ],
    "hasPdf": true,
    "hasVideo": false,
    "shortDesc": "Almohada para Viaje diseñado para soporte terapéutico de alta durabilidad y estabilidad anatómica.",
    "desc": "Dispositivo ortopédico Almohada para Viaje fabricado con materiales de grado clínico internacional Tynor. Proporciona soporte, compresión controlada y alivio anatómico óptimo para una rehabilitación segura y confortable.",
    "uses": [
      "Tratamiento y prevención de afecciones en zona de pierna.",
      "Rehabilitación ortopédica post-traumática o post-quirúrgica.",
      "Soporte ergonómico de uso diario con alivio de carga articular."
    ],
    "features": [
      "Material transpirable hipoalergénico de alta resistencia",
      "Diseño ergonómico ajustable a la morfología del paciente",
      "Estructura diseñada bajo estándares ortopédicos internacionales"
    ],
    "priceBySize": {
      "UNITALLA": 300,
      "Universal": 300
    }
  },
  {
    "code": "I94",
    "name": "Almohada para Viaje Urbana",
    "cat": "tobillo",
    "price": 350.0,
    "bodyPart": "pierna",
    "badge": "ORTOPEDIA",
    "linea": "ORTOPEDIA",
    "sizes": [
      "Universal"
    ],
    "hasPdf": true,
    "hasVideo": false,
    "shortDesc": "Almohada para Viaje Urbana diseñado para soporte terapéutico de alta durabilidad y estabilidad anatómica.",
    "desc": "Dispositivo ortopédico Almohada para Viaje Urbana fabricado con materiales de grado clínico internacional Tynor. Proporciona soporte, compresión controlada y alivio anatómico óptimo para una rehabilitación segura y confortable.",
    "uses": [
      "Tratamiento y prevención de afecciones en zona de pierna.",
      "Rehabilitación ortopédica post-traumática o post-quirúrgica.",
      "Soporte ergonómico de uso diario con alivio de carga articular."
    ],
    "features": [
      "Material transpirable hipoalergénico de alta resistencia",
      "Diseño ergonómico ajustable a la morfología del paciente",
      "Estructura diseñada bajo estándares ortopédicos internacionales"
    ],
    "priceBySize": {
      "Universal": 350.0
    }
  },
  {
    "code": "J01",
    "name": "Rodillera Mecánica Cerrada Neopreno",
    "cat": "rodillera",
    "price": 600.0,
    "bodyPart": "rodilla",
    "badge": "ORTOPEDIA",
    "linea": "ORTOPEDIA",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL",
      "XXL"
    ],
    "hasPdf": true,
    "hasVideo": false,
    "shortDesc": "Rodillera Mecánica Cerrada Neopreno diseñado para soporte terapéutico de alta durabilidad y estabilidad anatómica.",
    "desc": "Dispositivo ortopédico Rodillera Mecánica Cerrada Neopreno fabricado con materiales de grado clínico internacional Tynor. Proporciona soporte, compresión controlada y alivio anatómico óptimo para una rehabilitación segura y confortable.",
    "uses": [
      "Tratamiento y prevención de afecciones en zona de rodilla.",
      "Rehabilitación ortopédica post-traumática o post-quirúrgica.",
      "Soporte ergonómico de uso diario con alivio de carga articular."
    ],
    "features": [
      "Material transpirable hipoalergénico de alta resistencia",
      "Diseño ergonómico ajustable a la morfología del paciente",
      "Estructura diseñada bajo estándares ortopédicos internacionales"
    ],
    "priceBySize": {
      "CH": 600.0,
      "M": 600.0,
      "G": 600.0,
      "XL": 729.0,
      "XXL": 757.0
    }
  },
  {
    "code": "J03",
    "name": "Muñequera con Orificio para Pulgar Neopreno",
    "cat": "inmovilizador",
    "price": 193.0,
    "bodyPart": "mano",
    "badge": "ORTOPEDIA",
    "linea": "ORTOPEDIA",
    "sizes": [
      "Universal"
    ],
    "hasPdf": true,
    "hasVideo": false,
    "shortDesc": "Muñequera con Orificio para Pulgar Neopreno diseñado para soporte terapéutico de alta durabilidad y estabilidad anatómica.",
    "desc": "Dispositivo ortopédico Muñequera con Orificio para Pulgar Neopreno fabricado con materiales de grado clínico internacional Tynor. Proporciona soporte, compresión controlada y alivio anatómico óptimo para una rehabilitación segura y confortable.",
    "uses": [
      "Tratamiento y prevención de afecciones en zona de mano.",
      "Rehabilitación ortopédica post-traumática o post-quirúrgica.",
      "Soporte ergonómico de uso diario con alivio de carga articular."
    ],
    "features": [
      "Material transpirable hipoalergénico de alta resistencia",
      "Diseño ergonómico ajustable a la morfología del paciente",
      "Estructura diseñada bajo estándares ortopédicos internacionales"
    ],
    "priceBySize": {
      "Universal": 193.0
    }
  },
  {
    "code": "J04",
    "name": "Muñequera Sencilla Neopreno",
    "cat": "inmovilizador",
    "price": 152.0,
    "bodyPart": "mano",
    "badge": "ORTOPEDIA",
    "linea": "ORTOPEDIA",
    "sizes": [
      "Universal"
    ],
    "hasPdf": true,
    "hasVideo": false,
    "shortDesc": "Muñequera Sencilla Neopreno diseñado para soporte terapéutico de alta durabilidad y estabilidad anatómica.",
    "desc": "Dispositivo ortopédico Muñequera Sencilla Neopreno fabricado con materiales de grado clínico internacional Tynor. Proporciona soporte, compresión controlada y alivio anatómico óptimo para una rehabilitación segura y confortable.",
    "uses": [
      "Tratamiento y prevención de afecciones en zona de mano.",
      "Rehabilitación ortopédica post-traumática o post-quirúrgica.",
      "Soporte ergonómico de uso diario con alivio de carga articular."
    ],
    "features": [
      "Material transpirable hipoalergénico de alta resistencia",
      "Diseño ergonómico ajustable a la morfología del paciente",
      "Estructura diseñada bajo estándares ortopédicos internacionales"
    ],
    "priceBySize": {
      "Universal": 152.0
    }
  },
  {
    "code": "J05",
    "name": "Rodillera Abierta Sencilla Neopreno",
    "cat": "rodillera",
    "price": 450.0,
    "bodyPart": "rodilla",
    "badge": "ORTOPEDIA",
    "linea": "ORTOPEDIA",
    "sizes": [
      "Universal",
      "Talla Especial"
    ],
    "hasPdf": true,
    "hasVideo": false,
    "shortDesc": "Rodillera Abierta Sencilla Neopreno diseñado para soporte terapéutico de alta durabilidad y estabilidad anatómica.",
    "desc": "Dispositivo ortopédico Rodillera Abierta Sencilla Neopreno fabricado con materiales de grado clínico internacional Tynor. Proporciona soporte, compresión controlada y alivio anatómico óptimo para una rehabilitación segura y confortable.",
    "uses": [
      "Tratamiento y prevención de afecciones en zona de rodilla.",
      "Rehabilitación ortopédica post-traumática o post-quirúrgica.",
      "Soporte ergonómico de uso diario con alivio de carga articular."
    ],
    "features": [
      "Material transpirable hipoalergénico de alta resistencia",
      "Diseño ergonómico ajustable a la morfología del paciente",
      "Estructura diseñada bajo estándares ortopédicos internacionales"
    ],
    "priceBySize": {
      "Universal": 450.0,
      "Talla Especial": 470.0
    }
  },
  {
    "code": "J06",
    "name": "Soporte Abdominal Neopreno",
    "cat": "lumbar",
    "price": 400.0,
    "bodyPart": "espalda",
    "badge": "ORTOPEDIA",
    "linea": "ORTOPEDIA",
    "sizes": [
      "Universal",
      "Talla Especial"
    ],
    "hasPdf": true,
    "hasVideo": false,
    "shortDesc": "Soporte Abdominal Neopreno diseñado para soporte terapéutico de alta durabilidad y estabilidad anatómica.",
    "desc": "Dispositivo ortopédico Soporte Abdominal Neopreno fabricado con materiales de grado clínico internacional Tynor. Proporciona soporte, compresión controlada y alivio anatómico óptimo para una rehabilitación segura y confortable.",
    "uses": [
      "Tratamiento y prevención de afecciones en zona de espalda.",
      "Rehabilitación ortopédica post-traumática o post-quirúrgica.",
      "Soporte ergonómico de uso diario con alivio de carga articular."
    ],
    "features": [
      "Material transpirable hipoalergénico de alta resistencia",
      "Diseño ergonómico ajustable a la morfología del paciente",
      "Estructura diseñada bajo estándares ortopédicos internacionales"
    ],
    "priceBySize": {
      "Universal": 400.0,
      "Talla Especial": 400.0
    }
  },
  {
    "code": "J08",
    "name": "Rodillera Neopreno para Valgus y Varus",
    "cat": "rodillera",
    "price": 633.0,
    "bodyPart": "rodilla",
    "badge": "ORTOPEDIA",
    "linea": "ORTOPEDIA",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL",
      "XXL"
    ],
    "hasPdf": true,
    "hasVideo": false,
    "shortDesc": "Rodillera Neopreno para Valgus y Varus diseñado para soporte terapéutico de alta durabilidad y estabilidad anatómica.",
    "desc": "Dispositivo ortopédico Rodillera Neopreno para Valgus y Varus fabricado con materiales de grado clínico internacional Tynor. Proporciona soporte, compresión controlada y alivio anatómico óptimo para una rehabilitación segura y confortable.",
    "uses": [
      "Tratamiento y prevención de afecciones en zona de rodilla.",
      "Rehabilitación ortopédica post-traumática o post-quirúrgica.",
      "Soporte ergonómico de uso diario con alivio de carga articular."
    ],
    "features": [
      "Material transpirable hipoalergénico de alta resistencia",
      "Diseño ergonómico ajustable a la morfología del paciente",
      "Estructura diseñada bajo estándares ortopédicos internacionales"
    ],
    "priceBySize": {
      "CH": 633.0,
      "M": 633.0,
      "G": 633.0,
      "XL": 633.0,
      "XXL": 633.0
    }
  },
  {
    "code": "J09",
    "name": "Rodillera Cerrada Corta Neopreno",
    "cat": "rodillera",
    "price": 317.0,
    "bodyPart": "rodilla",
    "badge": "ORTOPEDIA",
    "linea": "ORTOPEDIA",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL",
      "XXL"
    ],
    "hasPdf": true,
    "hasVideo": false,
    "shortDesc": "Rodillera Cerrada Corta Neopreno diseñado para soporte terapéutico de alta durabilidad y estabilidad anatómica.",
    "desc": "Dispositivo ortopédico Rodillera Cerrada Corta Neopreno fabricado con materiales de grado clínico internacional Tynor. Proporciona soporte, compresión controlada y alivio anatómico óptimo para una rehabilitación segura y confortable.",
    "uses": [
      "Tratamiento y prevención de afecciones en zona de rodilla.",
      "Rehabilitación ortopédica post-traumática o post-quirúrgica.",
      "Soporte ergonómico de uso diario con alivio de carga articular."
    ],
    "features": [
      "Material transpirable hipoalergénico de alta resistencia",
      "Diseño ergonómico ajustable a la morfología del paciente",
      "Estructura diseñada bajo estándares ortopédicos internacionales"
    ],
    "priceBySize": {
      "CH": 317.0,
      "M": 317.0,
      "G": 317.0,
      "XL": 317.0,
      "XXL": 317.0
    }
  },
  {
    "code": "J12",
    "name": "Soporte Abierto para Tobillo Neopreno",
    "cat": "tobillo",
    "price": 295.0,
    "bodyPart": "tobillo",
    "badge": "ORTOPEDIA",
    "linea": "ORTOPEDIA",
    "sizes": [
      "Universal"
    ],
    "hasPdf": true,
    "hasVideo": false,
    "shortDesc": "Soporte Abierto para Tobillo Neopreno diseñado para soporte terapéutico de alta durabilidad y estabilidad anatómica.",
    "desc": "Dispositivo ortopédico Soporte Abierto para Tobillo Neopreno fabricado con materiales de grado clínico internacional Tynor. Proporciona soporte, compresión controlada y alivio anatómico óptimo para una rehabilitación segura y confortable.",
    "uses": [
      "Tratamiento y prevención de afecciones en zona de tobillo.",
      "Rehabilitación ortopédica post-traumática o post-quirúrgica.",
      "Soporte ergonómico de uso diario con alivio de carga articular."
    ],
    "features": [
      "Material transpirable hipoalergénico de alta resistencia",
      "Diseño ergonómico ajustable a la morfología del paciente",
      "Estructura diseñada bajo estándares ortopédicos internacionales"
    ],
    "priceBySize": {
      "Universal": 295.0
    }
  },
  {
    "code": "J14",
    "name": "Soporte de Hombros Neopreno",
    "cat": "hombro_brazo",
    "price": 425.0,
    "bodyPart": "hombro",
    "badge": "ORTOPEDIA",
    "linea": "ORTOPEDIA",
    "sizes": [
      "Universal",
      "Talla Especial"
    ],
    "hasPdf": true,
    "hasVideo": false,
    "shortDesc": "Soporte de Hombros Neopreno diseñado para soporte terapéutico de alta durabilidad y estabilidad anatómica.",
    "desc": "Dispositivo ortopédico Soporte de Hombros Neopreno fabricado con materiales de grado clínico internacional Tynor. Proporciona soporte, compresión controlada y alivio anatómico óptimo para una rehabilitación segura y confortable.",
    "uses": [
      "Tratamiento y prevención de afecciones en zona de hombro.",
      "Rehabilitación ortopédica post-traumática o post-quirúrgica.",
      "Soporte ergonómico de uso diario con alivio de carga articular."
    ],
    "features": [
      "Material transpirable hipoalergénico de alta resistencia",
      "Diseño ergonómico ajustable a la morfología del paciente",
      "Estructura diseñada bajo estándares ortopédicos internacionales"
    ],
    "priceBySize": {
      "Universal": 425.0,
      "Talla Especial": 425.0
    }
  },
  {
    "code": "J15",
    "name": "Rodillera Mecánica Abierta Neopreno",
    "cat": "rodillera",
    "price": 626.0,
    "bodyPart": "rodilla",
    "badge": "ORTOPEDIA",
    "linea": "ORTOPEDIA",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL",
      "XXL",
      "Pediátrico"
    ],
    "hasPdf": true,
    "hasVideo": false,
    "shortDesc": "Rodillera Mecánica Abierta Neopreno diseñado para soporte terapéutico de alta durabilidad y estabilidad anatómica.",
    "desc": "Dispositivo ortopédico Rodillera Mecánica Abierta Neopreno fabricado con materiales de grado clínico internacional Tynor. Proporciona soporte, compresión controlada y alivio anatómico óptimo para una rehabilitación segura y confortable.",
    "uses": [
      "Tratamiento y prevención de afecciones en zona de rodilla.",
      "Rehabilitación ortopédica post-traumática o post-quirúrgica.",
      "Soporte ergonómico de uso diario con alivio de carga articular."
    ],
    "features": [
      "Material transpirable hipoalergénico de alta resistencia",
      "Diseño ergonómico ajustable a la morfología del paciente",
      "Estructura diseñada bajo estándares ortopédicos internacionales"
    ],
    "priceBySize": {
      "CH": 626.0,
      "M": 626.0,
      "G": 626.0,
      "XL": 626.0,
      "XXL": 626.0,
      "Pediátrico": 626.0
    }
  },
  {
    "code": "J16",
    "name": "Tobillera con Cintas Neopreno",
    "cat": "tobillo",
    "price": 285.0,
    "bodyPart": "tobillo",
    "badge": "ORTOPEDIA",
    "linea": "ORTOPEDIA",
    "sizes": [
      "Universal",
      "Talla Especial"
    ],
    "hasPdf": true,
    "hasVideo": false,
    "shortDesc": "Tobillera con Cintas Neopreno diseñado para soporte terapéutico de alta durabilidad y estabilidad anatómica.",
    "desc": "Dispositivo ortopédico Tobillera con Cintas Neopreno fabricado con materiales de grado clínico internacional Tynor. Proporciona soporte, compresión controlada y alivio anatómico óptimo para una rehabilitación segura y confortable.",
    "uses": [
      "Tratamiento y prevención de afecciones en zona de tobillo.",
      "Rehabilitación ortopédica post-traumática o post-quirúrgica.",
      "Soporte ergonómico de uso diario con alivio de carga articular."
    ],
    "features": [
      "Material transpirable hipoalergénico de alta resistencia",
      "Diseño ergonómico ajustable a la morfología del paciente",
      "Estructura diseñada bajo estándares ortopédicos internacionales"
    ],
    "priceBySize": {
      "Universal": 285.0,
      "Talla Especial": 285.0
    }
  },
  {
    "code": "K01",
    "name": "Plantilla Silicón (par)",
    "cat": "tobillo",
    "price": 605.0,
    "bodyPart": "tobillo",
    "badge": "ORTOPEDIA",
    "linea": "ORTOPEDIA",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL"
    ],
    "hasPdf": true,
    "hasVideo": false,
    "shortDesc": "Plantilla Silicón (par) diseñado para soporte terapéutico de alta durabilidad y estabilidad anatómica.",
    "desc": "Dispositivo ortopédico Plantilla Silicón (par) fabricado con materiales de grado clínico internacional Tynor. Proporciona soporte, compresión controlada y alivio anatómico óptimo para una rehabilitación segura y confortable.",
    "uses": [
      "Tratamiento y prevención de afecciones en zona de tobillo.",
      "Rehabilitación ortopédica post-traumática o post-quirúrgica.",
      "Soporte ergonómico de uso diario con alivio de carga articular."
    ],
    "features": [
      "Material transpirable hipoalergénico de alta resistencia",
      "Diseño ergonómico ajustable a la morfología del paciente",
      "Estructura diseñada bajo estándares ortopédicos internacionales"
    ],
    "priceBySize": {
      "CH": 605.0,
      "M": 605.0,
      "G": 605.0,
      "XL": 605.0
    }
  },
  {
    "code": "K02",
    "name": "Talonera Silicón (par)",
    "cat": "tobillo",
    "price": 344.0,
    "bodyPart": "tobillo",
    "badge": "ORTOPEDIA",
    "linea": "ORTOPEDIA",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL"
    ],
    "hasPdf": true,
    "hasVideo": false,
    "shortDesc": "Talonera Silicón (par) diseñado para soporte terapéutico de alta durabilidad y estabilidad anatómica.",
    "desc": "Dispositivo ortopédico Talonera Silicón (par) fabricado con materiales de grado clínico internacional Tynor. Proporciona soporte, compresión controlada y alivio anatómico óptimo para una rehabilitación segura y confortable.",
    "uses": [
      "Tratamiento y prevención de afecciones en zona de tobillo.",
      "Rehabilitación ortopédica post-traumática o post-quirúrgica.",
      "Soporte ergonómico de uso diario con alivio de carga articular."
    ],
    "features": [
      "Material transpirable hipoalergénico de alta resistencia",
      "Diseño ergonómico ajustable a la morfología del paciente",
      "Estructura diseñada bajo estándares ortopédicos internacionales"
    ],
    "priceBySize": {
      "CH": 344.0,
      "M": 344.0,
      "G": 344.0,
      "XL": 344.0
    }
  },
  {
    "code": "K04",
    "name": "Separador de Dedos Silicion (par)",
    "cat": "inmovilizador",
    "price": 75.0,
    "bodyPart": "mano",
    "badge": "ORTOPEDIA",
    "linea": "ORTOPEDIA",
    "sizes": [
      "CH",
      "M",
      "G"
    ],
    "hasPdf": true,
    "hasVideo": false,
    "shortDesc": "Separador de Dedos Silicion (par) diseñado para soporte terapéutico de alta durabilidad y estabilidad anatómica.",
    "desc": "Dispositivo ortopédico Separador de Dedos Silicion (par) fabricado con materiales de grado clínico internacional Tynor. Proporciona soporte, compresión controlada y alivio anatómico óptimo para una rehabilitación segura y confortable.",
    "uses": [
      "Tratamiento y prevención de afecciones en zona de mano.",
      "Rehabilitación ortopédica post-traumática o post-quirúrgica.",
      "Soporte ergonómico de uso diario con alivio de carga articular."
    ],
    "features": [
      "Material transpirable hipoalergénico de alta resistencia",
      "Diseño ergonómico ajustable a la morfología del paciente",
      "Estructura diseñada bajo estándares ortopédicos internacionales"
    ],
    "priceBySize": {
      "CH": 75.0,
      "M": 75.0,
      "G": 75.0
    }
  },
  {
    "code": "K08",
    "name": "Protector Metatarso Silicón (par)",
    "cat": "tobillo",
    "price": 150.0,
    "bodyPart": "tobillo",
    "badge": "ORTOPEDIA",
    "linea": "ORTOPEDIA",
    "sizes": [
      "Universal"
    ],
    "hasPdf": true,
    "hasVideo": false,
    "shortDesc": "Protector Metatarso Silicón (par) diseñado para soporte terapéutico de alta durabilidad y estabilidad anatómica.",
    "desc": "Dispositivo ortopédico Protector Metatarso Silicón (par) fabricado con materiales de grado clínico internacional Tynor. Proporciona soporte, compresión controlada y alivio anatómico óptimo para una rehabilitación segura y confortable.",
    "uses": [
      "Tratamiento y prevención de afecciones en zona de tobillo.",
      "Rehabilitación ortopédica post-traumática o post-quirúrgica.",
      "Soporte ergonómico de uso diario con alivio de carga articular."
    ],
    "features": [
      "Material transpirable hipoalergénico de alta resistencia",
      "Diseño ergonómico ajustable a la morfología del paciente",
      "Estructura diseñada bajo estándares ortopédicos internacionales"
    ],
    "priceBySize": {
      "Universal": 150.0
    }
  },
  {
    "code": "K10",
    "name": "Plantilla Dura 3/4 Arco Plantar (par)",
    "cat": "tobillo",
    "price": 323.0,
    "bodyPart": "tobillo",
    "badge": "ORTOPEDIA",
    "linea": "ORTOPEDIA",
    "sizes": [
      "CH",
      "M",
      "G"
    ],
    "hasPdf": true,
    "hasVideo": false,
    "shortDesc": "Plantilla Dura 3/4 Arco Plantar (par) diseñado para soporte terapéutico de alta durabilidad y estabilidad anatómica.",
    "desc": "Dispositivo ortopédico Plantilla Dura 3/4 Arco Plantar (par) fabricado con materiales de grado clínico internacional Tynor. Proporciona soporte, compresión controlada y alivio anatómico óptimo para una rehabilitación segura y confortable.",
    "uses": [
      "Tratamiento y prevención de afecciones en zona de tobillo.",
      "Rehabilitación ortopédica post-traumática o post-quirúrgica.",
      "Soporte ergonómico de uso diario con alivio de carga articular."
    ],
    "features": [
      "Material transpirable hipoalergénico de alta resistencia",
      "Diseño ergonómico ajustable a la morfología del paciente",
      "Estructura diseñada bajo estándares ortopédicos internacionales"
    ],
    "priceBySize": {
      "CH": 323.0,
      "M": 323.0,
      "G": 323.0
    }
  },
  {
    "code": "K11",
    "name": "Plantilla Dura 3/4 Arco Plantar (par)",
    "cat": "tobillo",
    "price": 323.0,
    "bodyPart": "tobillo",
    "badge": "ORTOPEDIA",
    "linea": "ORTOPEDIA",
    "sizes": [
      "1 (15-17 cm)",
      "2 (17-19 cm)",
      "3 (19-21 cm)"
    ],
    "hasPdf": true,
    "hasVideo": false,
    "shortDesc": "Plantilla Dura 3/4 Arco Plantar (par) diseñado para soporte terapéutico de alta durabilidad y estabilidad anatómica.",
    "desc": "Dispositivo ortopédico Plantilla Dura 3/4 Arco Plantar (par) fabricado con materiales de grado clínico internacional Tynor. Proporciona soporte, compresión controlada y alivio anatómico óptimo para una rehabilitación segura y confortable.",
    "uses": [
      "Tratamiento y prevención de afecciones en zona de tobillo.",
      "Rehabilitación ortopédica post-traumática o post-quirúrgica.",
      "Soporte ergonómico de uso diario con alivio de carga articular."
    ],
    "features": [
      "Material transpirable hipoalergénico de alta resistencia",
      "Diseño ergonómico ajustable a la morfología del paciente",
      "Estructura diseñada bajo estándares ortopédicos internacionales"
    ],
    "priceBySize": {
      "1 (15-17 cm)": 323.0,
      "2 (17-19 cm)": 323.0,
      "3 (19-21 cm)": 323.0
    }
  },
  {
    "code": "K13",
    "name": "Plantilla Delgada Silicón",
    "cat": "tobillo",
    "price": null,
    "bodyPart": "tobillo",
    "badge": "ORTOPEDIA",
    "linea": "ORTOPEDIA",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL"
    ],
    "hasPdf": true,
    "hasVideo": false,
    "shortDesc": "Plantilla Delgada Silicón diseñado para soporte terapéutico de alta durabilidad y estabilidad anatómica.",
    "desc": "Dispositivo ortopédico Plantilla Delgada Silicón fabricado con materiales de grado clínico internacional Tynor. Proporciona soporte, compresión controlada y alivio anatómico óptimo para una rehabilitación segura y confortable.",
    "uses": [
      "Tratamiento y prevención de afecciones en zona de tobillo.",
      "Rehabilitación ortopédica post-traumática o post-quirúrgica.",
      "Soporte ergonómico de uso diario con alivio de carga articular."
    ],
    "features": [
      "Material transpirable hipoalergénico de alta resistencia",
      "Diseño ergonómico ajustable a la morfología del paciente",
      "Estructura diseñada bajo estándares ortopédicos internacionales"
    ]
  },
  {
    "code": "K14",
    "name": "Férula Nocturna Hallux Valgus",
    "cat": "tobillo",
    "price": 207.0,
    "bodyPart": "tobillo",
    "badge": "ORTOPEDIA",
    "linea": "ORTOPEDIA",
    "sizes": [
      "Universal"
    ],
    "hasPdf": true,
    "hasVideo": false,
    "shortDesc": "Férula Nocturna Hallux Valgus diseñado para soporte terapéutico de alta durabilidad y estabilidad anatómica.",
    "desc": "Dispositivo ortopédico Férula Nocturna Hallux Valgus fabricado con materiales de grado clínico internacional Tynor. Proporciona soporte, compresión controlada y alivio anatómico óptimo para una rehabilitación segura y confortable.",
    "uses": [
      "Tratamiento y prevención de afecciones en zona de tobillo.",
      "Rehabilitación ortopédica post-traumática o post-quirúrgica.",
      "Soporte ergonómico de uso diario con alivio de carga articular."
    ],
    "features": [
      "Material transpirable hipoalergénico de alta resistencia",
      "Diseño ergonómico ajustable a la morfología del paciente",
      "Estructura diseñada bajo estándares ortopédicos internacionales"
    ],
    "priceBySize": {
      "Universal": 207.0
    }
  },
  {
    "code": "K15",
    "name": "Apoyo Plantar Silicón (par)",
    "cat": "tobillo",
    "price": 100.0,
    "bodyPart": "tobillo",
    "badge": "ORTOPEDIA",
    "linea": "ORTOPEDIA",
    "sizes": [
      "CH",
      "M",
      "G",
      "Pediátrico"
    ],
    "hasPdf": true,
    "hasVideo": false,
    "shortDesc": "Apoyo Plantar Silicón (par) diseñado para soporte terapéutico de alta durabilidad y estabilidad anatómica.",
    "desc": "Dispositivo ortopédico Apoyo Plantar Silicón (par) fabricado con materiales de grado clínico internacional Tynor. Proporciona soporte, compresión controlada y alivio anatómico óptimo para una rehabilitación segura y confortable.",
    "uses": [
      "Tratamiento y prevención de afecciones en zona de tobillo.",
      "Rehabilitación ortopédica post-traumática o post-quirúrgica.",
      "Soporte ergonómico de uso diario con alivio de carga articular."
    ],
    "features": [
      "Material transpirable hipoalergénico de alta resistencia",
      "Diseño ergonómico ajustable a la morfología del paciente",
      "Estructura diseñada bajo estándares ortopédicos internacionales"
    ],
    "priceBySize": {
      "CH": 100.0,
      "M": 100.0,
      "G": 100.0,
      "Pediátrico": 100.0
    }
  },
  {
    "code": "K16",
    "name": "Plantilla de Gel P/ Mujer (par)",
    "cat": "tobillo",
    "price": 130.0,
    "bodyPart": "tobillo",
    "badge": "ORTOPEDIA",
    "linea": "ORTOPEDIA",
    "sizes": [
      "CH",
      "M",
      "G"
    ],
    "hasPdf": true,
    "hasVideo": false,
    "shortDesc": "Plantilla de Gel P/ Mujer (par) diseñado para soporte terapéutico de alta durabilidad y estabilidad anatómica.",
    "desc": "Dispositivo ortopédico Plantilla de Gel P/ Mujer (par) fabricado con materiales de grado clínico internacional Tynor. Proporciona soporte, compresión controlada y alivio anatómico óptimo para una rehabilitación segura y confortable.",
    "uses": [
      "Tratamiento y prevención de afecciones en zona de tobillo.",
      "Rehabilitación ortopédica post-traumática o post-quirúrgica.",
      "Soporte ergonómico de uso diario con alivio de carga articular."
    ],
    "features": [
      "Material transpirable hipoalergénico de alta resistencia",
      "Diseño ergonómico ajustable a la morfología del paciente",
      "Estructura diseñada bajo estándares ortopédicos internacionales"
    ],
    "priceBySize": {
      "CH": 130.0,
      "M": 130.0,
      "G": 130.0
    }
  },
  {
    "code": "K18",
    "name": "Plantilla de Cuña (par)",
    "cat": "tobillo",
    "price": 125.0,
    "bodyPart": "tobillo",
    "badge": "ORTOPEDIA",
    "linea": "ORTOPEDIA",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL"
    ],
    "hasPdf": true,
    "hasVideo": false,
    "shortDesc": "Plantilla de Cuña (par) diseñado para soporte terapéutico de alta durabilidad y estabilidad anatómica.",
    "desc": "Dispositivo ortopédico Plantilla de Cuña (par) fabricado con materiales de grado clínico internacional Tynor. Proporciona soporte, compresión controlada y alivio anatómico óptimo para una rehabilitación segura y confortable.",
    "uses": [
      "Tratamiento y prevención de afecciones en zona de tobillo.",
      "Rehabilitación ortopédica post-traumática o post-quirúrgica.",
      "Soporte ergonómico de uso diario con alivio de carga articular."
    ],
    "features": [
      "Material transpirable hipoalergénico de alta resistencia",
      "Diseño ergonómico ajustable a la morfología del paciente",
      "Estructura diseñada bajo estándares ortopédicos internacionales"
    ],
    "priceBySize": {
      "CH": 125.0,
      "M": 125.0,
      "G": 125.0,
      "XL": 125.0
    }
  },
  {
    "code": "L01",
    "name": "Soporte Sacrolumbar Contorneado",
    "cat": "lumbar",
    "price": 325.0,
    "bodyPart": "espalda",
    "badge": "ORTOPEDIA",
    "linea": "ORTOPEDIA",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL",
      "XXL"
    ],
    "hasPdf": true,
    "hasVideo": false,
    "shortDesc": "Soporte Sacrolumbar Contorneado diseñado para soporte terapéutico de alta durabilidad y estabilidad anatómica.",
    "desc": "Dispositivo ortopédico Soporte Sacrolumbar Contorneado fabricado con materiales de grado clínico internacional Tynor. Proporciona soporte, compresión controlada y alivio anatómico óptimo para una rehabilitación segura y confortable.",
    "uses": [
      "Tratamiento y prevención de afecciones en zona de espalda.",
      "Rehabilitación ortopédica post-traumática o post-quirúrgica.",
      "Soporte ergonómico de uso diario con alivio de carga articular."
    ],
    "features": [
      "Material transpirable hipoalergénico de alta resistencia",
      "Diseño ergonómico ajustable a la morfología del paciente",
      "Estructura diseñada bajo estándares ortopédicos internacionales"
    ],
    "priceBySize": {
      "CH": 325.0,
      "M": 325.0,
      "G": 325.0,
      "XL": 345.0,
      "XXL": 345.0
    }
  },
  {
    "code": "L02",
    "name": "Cinturon Sacrolumbar",
    "cat": "lumbar",
    "price": 335.0,
    "bodyPart": "espalda",
    "badge": "ORTOPEDIA",
    "linea": "ORTOPEDIA",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL",
      "XXL"
    ],
    "hasPdf": true,
    "hasVideo": false,
    "shortDesc": "Cinturon Sacrolumbar diseñado para soporte terapéutico de alta durabilidad y estabilidad anatómica.",
    "desc": "Dispositivo ortopédico Cinturon Sacrolumbar fabricado con materiales de grado clínico internacional Tynor. Proporciona soporte, compresión controlada y alivio anatómico óptimo para una rehabilitación segura y confortable.",
    "uses": [
      "Tratamiento y prevención de afecciones en zona de espalda.",
      "Rehabilitación ortopédica post-traumática o post-quirúrgica.",
      "Soporte ergonómico de uso diario con alivio de carga articular."
    ],
    "features": [
      "Material transpirable hipoalergénico de alta resistencia",
      "Diseño ergonómico ajustable a la morfología del paciente",
      "Estructura diseñada bajo estándares ortopédicos internacionales"
    ],
    "priceBySize": {
      "CH": 335.0,
      "M": 335.0,
      "G": 335.0,
      "XL": 350.0,
      "XXL": 350.0
    }
  },
  {
    "code": "L03",
    "name": "Faja Abdominal",
    "cat": "lumbar",
    "price": 225.0,
    "bodyPart": "espalda",
    "badge": "ORTOPEDIA",
    "linea": "ORTOPEDIA",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL",
      "XXL"
    ],
    "hasPdf": true,
    "hasVideo": false,
    "shortDesc": "Faja Abdominal diseñado para soporte terapéutico de alta durabilidad y estabilidad anatómica.",
    "desc": "Dispositivo ortopédico Faja Abdominal fabricado con materiales de grado clínico internacional Tynor. Proporciona soporte, compresión controlada y alivio anatómico óptimo para una rehabilitación segura y confortable.",
    "uses": [
      "Tratamiento y prevención de afecciones en zona de espalda.",
      "Rehabilitación ortopédica post-traumática o post-quirúrgica.",
      "Soporte ergonómico de uso diario con alivio de carga articular."
    ],
    "features": [
      "Material transpirable hipoalergénico de alta resistencia",
      "Diseño ergonómico ajustable a la morfología del paciente",
      "Estructura diseñada bajo estándares ortopédicos internacionales"
    ],
    "priceBySize": {
      "CH": 225.0,
      "M": 225.0,
      "G": 225.0,
      "XL": 240.0,
      "XXL": 240.0
    }
  },
  {
    "code": "L04",
    "name": "Cabestrillo Oxypore",
    "cat": "cabestrillo",
    "price": 125.0,
    "bodyPart": "brazo",
    "badge": "ORTOPEDIA",
    "linea": "ORTOPEDIA",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL"
    ],
    "hasPdf": true,
    "hasVideo": true,
    "shortDesc": "Malla 3D microporosa de ventilación continua con video demostrativo.",
    "desc": "De tamaño reducido y diseño elegante, no cubre el pecho, apoya y cubre el brazo por completo. Puede acomodar yesos o vendajes voluminosos. Es el más adecuado para climas cálidos. Hecho de tela perforada de malla 3D fuerte, sin arrugas, muy bien ventilada con un aspecto agradable.",
    "uses": [
      "Sostiene y apoya los brazos torcidos, rotos u operados quirúrgicamente.",
      "Uso con yesos voluminosos sin compresión excesiva.",
      "Ideal para pacientes con piel sensible o hiperhidrosis."
    ],
    "features": [
      "Estructura Oxypore Honeycomb para flujo de aire activo",
      "Sistema de hebilla micrométrica de alta fijación",
      "Lavable a mano sin pérdida de forma estructural"
    ],
    "priceBySize": {
      "CH": 125.0,
      "M": 125.0,
      "G": 125.0,
      "XL": 125.0
    }
  },
  {
    "code": "L07",
    "name": "Bastón Cuello de Ganso Puño Suave",
    "cat": "movilidad",
    "price": 254,
    "bodyPart": "pierna",
    "badge": "ORTOPEDIA",
    "linea": "ORTOPEDIA",
    "sizes": [
      "Universal"
    ],
    "hasPdf": true,
    "hasVideo": false,
    "shortDesc": "Bastón Cuello de Ganso Puño Suave diseñado para soporte terapéutico de alta durabilidad y estabilidad anatómica.",
    "desc": "Dispositivo ortopédico Bastón Cuello de Ganso Puño Suave fabricado con materiales de grado clínico internacional Tynor. Proporciona soporte, compresión controlada y alivio anatómico óptimo para una rehabilitación segura y confortable.",
    "uses": [
      "Tratamiento y prevención de afecciones en zona de pierna.",
      "Rehabilitación ortopédica post-traumática o post-quirúrgica.",
      "Soporte ergonómico de uso diario con alivio de carga articular."
    ],
    "features": [
      "Material transpirable hipoalergénico de alta resistencia",
      "Diseño ergonómico ajustable a la morfología del paciente",
      "Estructura diseñada bajo estándares ortopédicos internacionales"
    ],
    "colors": [
      {
        "id": "PLATA",
        "name": "Plata",
        "hex": "#CBD5E1",
        "border": "#94A3B8"
      },
      {
        "id": "NEGRO",
        "name": "Negro",
        "hex": "#1E293B",
        "border": "#0F172A"
      }
    ],
    "priceBySize": {
      "PLATA": 254,
      "NEGRO": 254,
      "Universal": 254
    }
  },
  {
    "code": "L08",
    "name": "Bastón Aleman",
    "cat": "movilidad",
    "price": 254,
    "bodyPart": "pierna",
    "badge": "REHABILITACION",
    "linea": "REHABILITACION",
    "sizes": [
      "Universal"
    ],
    "hasPdf": true,
    "hasVideo": false,
    "shortDesc": "Bastón Aleman diseñado para soporte terapéutico de alta durabilidad y estabilidad anatómica.",
    "desc": "Dispositivo ortopédico Bastón Aleman fabricado con materiales de grado clínico internacional Tynor. Proporciona soporte, compresión controlada y alivio anatómico óptimo para una rehabilitación segura y confortable.",
    "uses": [
      "Tratamiento y prevención de afecciones en zona de pierna.",
      "Rehabilitación ortopédica post-traumática o post-quirúrgica.",
      "Soporte ergonómico de uso diario con alivio de carga articular."
    ],
    "features": [
      "Material transpirable hipoalergénico de alta resistencia",
      "Diseño ergonómico ajustable a la morfología del paciente",
      "Estructura diseñada bajo estándares ortopédicos internacionales"
    ],
    "colors": [
      {
        "id": "ORO",
        "name": "Oro",
        "hex": "#D97706",
        "border": "#B45309"
      },
      {
        "id": "PLATA",
        "name": "Plata",
        "hex": "#CBD5E1",
        "border": "#94A3B8"
      },
      {
        "id": "NEGRO",
        "name": "Negro",
        "hex": "#1E293B",
        "border": "#0F172A"
      }
    ],
    "priceBySize": {
      "UNITALLA": 254,
      "Universal": 254
    }
  },
  {
    "code": "L12A",
    "name": "Bastón Cuatro Apoyos",
    "cat": "movilidad",
    "price": 345.0,
    "bodyPart": "pierna",
    "badge": "REHABILITACION",
    "linea": "REHABILITACION",
    "sizes": [
      "Universal"
    ],
    "hasPdf": true,
    "hasVideo": false,
    "shortDesc": "Bastón Cuatro Apoyos diseñado para soporte terapéutico de alta durabilidad y estabilidad anatómica.",
    "desc": "Dispositivo ortopédico Bastón Cuatro Apoyos fabricado con materiales de grado clínico internacional Tynor. Proporciona soporte, compresión controlada y alivio anatómico óptimo para una rehabilitación segura y confortable.",
    "uses": [
      "Tratamiento y prevención de afecciones en zona de pierna.",
      "Rehabilitación ortopédica post-traumática o post-quirúrgica.",
      "Soporte ergonómico de uso diario con alivio de carga articular."
    ],
    "features": [
      "Material transpirable hipoalergénico de alta resistencia",
      "Diseño ergonómico ajustable a la morfología del paciente",
      "Estructura diseñada bajo estándares ortopédicos internacionales"
    ],
    "colors": [
      {
        "id": "PLATA",
        "name": "Plata",
        "hex": "#CBD5E1",
        "border": "#94A3B8"
      }
    ],
    "priceBySize": {
      "Universal": 345.0
    }
  },
  {
    "code": "L13",
    "name": "Bastón Tipo Canadiense (pieza)",
    "cat": "tobillo",
    "price": 399.0,
    "bodyPart": "tobillo",
    "badge": "REHABILITACION",
    "linea": "REHABILITACION",
    "sizes": [
      "Universal"
    ],
    "hasPdf": true,
    "hasVideo": false,
    "shortDesc": "Bastón Tipo Canadiense (pieza) diseñado para soporte terapéutico de alta durabilidad y estabilidad anatómica.",
    "desc": "Dispositivo ortopédico Bastón Tipo Canadiense (pieza) fabricado con materiales de grado clínico internacional Tynor. Proporciona soporte, compresión controlada y alivio anatómico óptimo para una rehabilitación segura y confortable.",
    "uses": [
      "Tratamiento y prevención de afecciones en zona de tobillo.",
      "Rehabilitación ortopédica post-traumática o post-quirúrgica.",
      "Soporte ergonómico de uso diario con alivio de carga articular."
    ],
    "features": [
      "Material transpirable hipoalergénico de alta resistencia",
      "Diseño ergonómico ajustable a la morfología del paciente",
      "Estructura diseñada bajo estándares ortopédicos internacionales"
    ],
    "priceBySize": {
      "Universal": 399.0
    }
  },
  {
    "code": "L21",
    "name": "Muletas Ajustables Importación (par)",
    "cat": "movilidad",
    "price": null,
    "bodyPart": "pierna",
    "badge": "REHABILITACION",
    "linea": "REHABILITACION",
    "sizes": [
      "CH",
      "M",
      "G"
    ],
    "hasPdf": true,
    "hasVideo": false,
    "shortDesc": "Muletas Ajustables Importación (par) diseñado para soporte terapéutico de alta durabilidad y estabilidad anatómica.",
    "desc": "Dispositivo ortopédico Muletas Ajustables Importación (par) fabricado con materiales de grado clínico internacional Tynor. Proporciona soporte, compresión controlada y alivio anatómico óptimo para una rehabilitación segura y confortable.",
    "uses": [
      "Tratamiento y prevención de afecciones en zona de pierna.",
      "Rehabilitación ortopédica post-traumática o post-quirúrgica.",
      "Soporte ergonómico de uso diario con alivio de carga articular."
    ],
    "features": [
      "Material transpirable hipoalergénico de alta resistencia",
      "Diseño ergonómico ajustable a la morfología del paciente",
      "Estructura diseñada bajo estándares ortopédicos internacionales"
    ]
  },
  {
    "code": "L28",
    "name": "Andadera Plegable de Aluminio, con Ruedas Giratorias 360°ø",
    "cat": "movilidad",
    "price": 780,
    "bodyPart": "pierna",
    "badge": "REHABILITACION",
    "linea": "REHABILITACION",
    "sizes": [
      "Universal"
    ],
    "hasPdf": true,
    "hasVideo": false,
    "shortDesc": "Andadera Plegable de Aluminio, con Ruedas Giratorias 360°ø diseñado para soporte terapéutico de alta durabilidad y estabilidad anatómica.",
    "desc": "Dispositivo ortopédico Andadera Plegable de Aluminio, con Ruedas Giratorias 360°ø fabricado con materiales de grado clínico internacional Tynor. Proporciona soporte, compresión controlada y alivio anatómico óptimo para una rehabilitación segura y confortable.",
    "uses": [
      "Tratamiento y prevención de afecciones en zona de pierna.",
      "Rehabilitación ortopédica post-traumática o post-quirúrgica.",
      "Soporte ergonómico de uso diario con alivio de carga articular."
    ],
    "features": [
      "Material transpirable hipoalergénico de alta resistencia",
      "Diseño ergonómico ajustable a la morfología del paciente",
      "Estructura diseñada bajo estándares ortopédicos internacionales"
    ],
    "priceBySize": {
      "PLATA": 780,
      "Universal": 780
    },
    "colors": [
      {
        "id": "PLATA",
        "name": "Plata",
        "hex": "#CBD5E1",
        "border": "#94A3B8"
      }
    ]
  },
  {
    "code": "L29",
    "name": "Andadera Reforzada Plegable, con Ruedas Giratorias 360°ø",
    "cat": "movilidad",
    "price": 800,
    "bodyPart": "pierna",
    "badge": "REHABILITACION",
    "linea": "REHABILITACION",
    "sizes": [
      "Universal"
    ],
    "hasPdf": true,
    "hasVideo": false,
    "shortDesc": "Andadera Reforzada Plegable, con Ruedas Giratorias 360°ø diseñado para soporte terapéutico de alta durabilidad y estabilidad anatómica.",
    "desc": "Dispositivo ortopédico Andadera Reforzada Plegable, con Ruedas Giratorias 360°ø fabricado con materiales de grado clínico internacional Tynor. Proporciona soporte, compresión controlada y alivio anatómico óptimo para una rehabilitación segura y confortable.",
    "uses": [
      "Tratamiento y prevención de afecciones en zona de pierna.",
      "Rehabilitación ortopédica post-traumática o post-quirúrgica.",
      "Soporte ergonómico de uso diario con alivio de carga articular."
    ],
    "features": [
      "Material transpirable hipoalergénico de alta resistencia",
      "Diseño ergonómico ajustable a la morfología del paciente",
      "Estructura diseñada bajo estándares ortopédicos internacionales"
    ],
    "colors": [
      {
        "id": "PLATA",
        "name": "Plata",
        "hex": "#CBD5E1",
        "border": "#94A3B8"
      }
    ],
    "priceBySize": {
      "PLATA": 800,
      "Universal": 800
    }
  },
  {
    "code": "L32",
    "name": "Bastón Aluminio Tres Apoyos",
    "cat": "movilidad",
    "price": 337.0,
    "bodyPart": "pierna",
    "badge": "ORTOPEDIA",
    "linea": "ORTOPEDIA",
    "sizes": [
      "Universal"
    ],
    "hasPdf": true,
    "hasVideo": false,
    "shortDesc": "Bastón Aluminio Tres Apoyos diseñado para soporte terapéutico de alta durabilidad y estabilidad anatómica.",
    "desc": "Dispositivo ortopédico Bastón Aluminio Tres Apoyos fabricado con materiales de grado clínico internacional Tynor. Proporciona soporte, compresión controlada y alivio anatómico óptimo para una rehabilitación segura y confortable.",
    "uses": [
      "Tratamiento y prevención de afecciones en zona de pierna.",
      "Rehabilitación ortopédica post-traumática o post-quirúrgica.",
      "Soporte ergonómico de uso diario con alivio de carga articular."
    ],
    "features": [
      "Material transpirable hipoalergénico de alta resistencia",
      "Diseño ergonómico ajustable a la morfología del paciente",
      "Estructura diseñada bajo estándares ortopédicos internacionales"
    ],
    "priceBySize": {
      "Universal": 337.0
    }
  },
  {
    "code": "L34",
    "name": "Andadera Plegable Reforzada",
    "cat": "movilidad",
    "price": 745,
    "bodyPart": "pierna",
    "badge": "REHABILITACION",
    "linea": "REHABILITACION",
    "sizes": [
      "Universal"
    ],
    "hasPdf": true,
    "hasVideo": false,
    "shortDesc": "Andadera Plegable Reforzada diseñado para soporte terapéutico de alta durabilidad y estabilidad anatómica.",
    "desc": "Dispositivo ortopédico Andadera Plegable Reforzada fabricado con materiales de grado clínico internacional Tynor. Proporciona soporte, compresión controlada y alivio anatómico óptimo para una rehabilitación segura y confortable.",
    "uses": [
      "Tratamiento y prevención de afecciones en zona de pierna.",
      "Rehabilitación ortopédica post-traumática o post-quirúrgica.",
      "Soporte ergonómico de uso diario con alivio de carga articular."
    ],
    "features": [
      "Material transpirable hipoalergénico de alta resistencia",
      "Diseño ergonómico ajustable a la morfología del paciente",
      "Estructura diseñada bajo estándares ortopédicos internacionales"
    ],
    "colors": [
      {
        "id": "PLATA",
        "name": "Plata",
        "hex": "#CBD5E1",
        "border": "#94A3B8"
      }
    ],
    "priceBySize": {
      "PLATA": 745,
      "Universal": 745
    }
  },
  {
    "code": "L35",
    "name": "Silla Cómodo Cromada Altura Ajustable",
    "cat": "movilidad",
    "price": 1134.0,
    "bodyPart": "pierna",
    "badge": "REHABILITACION",
    "linea": "REHABILITACION",
    "sizes": [
      "Universal"
    ],
    "hasPdf": true,
    "hasVideo": false,
    "shortDesc": "Silla Cómodo Cromada Altura Ajustable diseñado para soporte terapéutico de alta durabilidad y estabilidad anatómica.",
    "desc": "Dispositivo ortopédico Silla Cómodo Cromada Altura Ajustable fabricado con materiales de grado clínico internacional Tynor. Proporciona soporte, compresión controlada y alivio anatómico óptimo para una rehabilitación segura y confortable.",
    "uses": [
      "Tratamiento y prevención de afecciones en zona de pierna.",
      "Rehabilitación ortopédica post-traumática o post-quirúrgica.",
      "Soporte ergonómico de uso diario con alivio de carga articular."
    ],
    "features": [
      "Material transpirable hipoalergénico de alta resistencia",
      "Diseño ergonómico ajustable a la morfología del paciente",
      "Estructura diseñada bajo estándares ortopédicos internacionales"
    ],
    "priceBySize": {
      "Universal": 1134.0
    },
    "colors": [
      {
        "id": "CROMADO",
        "name": "Cromado",
        "hex": "#CBD5E1",
        "border": "#94A3B8"
      }
    ]
  },
  {
    "code": "L36",
    "name": "Bastón Cuatro Apoyos Base Pequeña",
    "cat": "movilidad",
    "price": 344.0,
    "bodyPart": "pierna",
    "badge": "ORTOPEDIA",
    "linea": "ORTOPEDIA",
    "sizes": [
      "Universal"
    ],
    "hasPdf": true,
    "hasVideo": false,
    "shortDesc": "Bastón Cuatro Apoyos Base Pequeña diseñado para soporte terapéutico de alta durabilidad y estabilidad anatómica.",
    "desc": "Dispositivo ortopédico Bastón Cuatro Apoyos Base Pequeña fabricado con materiales de grado clínico internacional Tynor. Proporciona soporte, compresión controlada y alivio anatómico óptimo para una rehabilitación segura y confortable.",
    "uses": [
      "Tratamiento y prevención de afecciones en zona de pierna.",
      "Rehabilitación ortopédica post-traumática o post-quirúrgica.",
      "Soporte ergonómico de uso diario con alivio de carga articular."
    ],
    "features": [
      "Material transpirable hipoalergénico de alta resistencia",
      "Diseño ergonómico ajustable a la morfología del paciente",
      "Estructura diseñada bajo estándares ortopédicos internacionales"
    ],
    "priceBySize": {
      "Universal": 344.0
    }
  },
  {
    "code": "L37",
    "name": "Andadera Plegable Ergonómica",
    "cat": "movilidad",
    "price": 450,
    "bodyPart": "pierna",
    "badge": "REHABILITACION",
    "linea": "REHABILITACION",
    "sizes": [
      "Universal"
    ],
    "hasPdf": false,
    "hasVideo": false,
    "shortDesc": "Andadera Plegable Ergonómica diseñado para soporte terapéutico de alta durabilidad y estabilidad anatómica.",
    "desc": "Dispositivo ortopédico Andadera Plegable Ergonómica fabricado con materiales de grado clínico internacional Tynor. Proporciona soporte, compresión controlada y alivio anatómico óptimo para una rehabilitación segura y confortable.",
    "uses": [
      "Tratamiento y prevención de afecciones en zona de pierna.",
      "Rehabilitación ortopédica post-traumática o post-quirúrgica.",
      "Soporte ergonómico de uso diario con alivio de carga articular."
    ],
    "features": [
      "Material transpirable hipoalergénico de alta resistencia",
      "Diseño ergonómico ajustable a la morfología del paciente",
      "Estructura diseñada bajo estándares ortopédicos internacionales"
    ],
    "priceBySize": {
      "PLATA": 450,
      "Universal": 450
    },
    "colors": [
      {
        "id": "PLATA",
        "name": "Plata",
        "hex": "#CBD5E1",
        "border": "#94A3B8"
      }
    ]
  },
  {
    "code": "L43",
    "name": "Silla Cómodo Plegable Tijera Tynor",
    "cat": "movilidad",
    "price": 675.0,
    "bodyPart": "pierna",
    "badge": "REHABILITACION",
    "linea": "REHABILITACION",
    "sizes": [
      "Universal"
    ],
    "hasPdf": false,
    "hasVideo": false,
    "shortDesc": "Silla Cómodo Plegable Tijera Tynor diseñado para soporte terapéutico de alta durabilidad y estabilidad anatómica.",
    "desc": "Dispositivo ortopédico Silla Cómodo Plegable Tijera Tynor fabricado con materiales de grado clínico internacional Tynor. Proporciona soporte, compresión controlada y alivio anatómico óptimo para una rehabilitación segura y confortable.",
    "uses": [
      "Tratamiento y prevención de afecciones en zona de pierna.",
      "Rehabilitación ortopédica post-traumática o post-quirúrgica.",
      "Soporte ergonómico de uso diario con alivio de carga articular."
    ],
    "features": [
      "Material transpirable hipoalergénico de alta resistencia",
      "Diseño ergonómico ajustable a la morfología del paciente",
      "Estructura diseñada bajo estándares ortopédicos internacionales"
    ],
    "priceBySize": {
      "Universal": 675.0
    }
  },
  {
    "code": "L44",
    "name": "Bastón Tres Apoyos",
    "cat": "movilidad",
    "price": 325.0,
    "bodyPart": "pierna",
    "badge": "REHABILITACION",
    "linea": "REHABILITACION",
    "sizes": [
      "Universal"
    ],
    "hasPdf": true,
    "hasVideo": false,
    "shortDesc": "Bastón Tres Apoyos diseñado para soporte terapéutico de alta durabilidad y estabilidad anatómica.",
    "desc": "Dispositivo ortopédico Bastón Tres Apoyos fabricado con materiales de grado clínico internacional Tynor. Proporciona soporte, compresión controlada y alivio anatómico óptimo para una rehabilitación segura y confortable.",
    "uses": [
      "Tratamiento y prevención de afecciones en zona de pierna.",
      "Rehabilitación ortopédica post-traumática o post-quirúrgica.",
      "Soporte ergonómico de uso diario con alivio de carga articular."
    ],
    "features": [
      "Material transpirable hipoalergénico de alta resistencia",
      "Diseño ergonómico ajustable a la morfología del paciente",
      "Estructura diseñada bajo estándares ortopédicos internacionales"
    ],
    "priceBySize": {
      "Universal": 325.0
    }
  },
  {
    "code": "L45",
    "name": "Bastón Base Pirámide (tetra)",
    "cat": "movilidad",
    "price": 435.0,
    "bodyPart": "pierna",
    "badge": "REHABILITACION",
    "linea": "REHABILITACION",
    "sizes": [
      "Universal"
    ],
    "hasPdf": true,
    "hasVideo": false,
    "shortDesc": "Bastón Base Pirámide (tetra) diseñado para soporte terapéutico de alta durabilidad y estabilidad anatómica.",
    "desc": "Dispositivo ortopédico Bastón Base Pirámide (tetra) fabricado con materiales de grado clínico internacional Tynor. Proporciona soporte, compresión controlada y alivio anatómico óptimo para una rehabilitación segura y confortable.",
    "uses": [
      "Tratamiento y prevención de afecciones en zona de pierna.",
      "Rehabilitación ortopédica post-traumática o post-quirúrgica.",
      "Soporte ergonómico de uso diario con alivio de carga articular."
    ],
    "features": [
      "Material transpirable hipoalergénico de alta resistencia",
      "Diseño ergonómico ajustable a la morfología del paciente",
      "Estructura diseñada bajo estándares ortopédicos internacionales"
    ],
    "priceBySize": {
      "Universal": 435.0
    }
  },
  {
    "code": "L46",
    "name": "Regatón Trio 19 MM para L07 y L08",
    "cat": "movilidad",
    "price": 165.0,
    "bodyPart": "pierna",
    "badge": "REHABILITACION",
    "linea": "REHABILITACION",
    "sizes": [
      "Universal"
    ],
    "hasPdf": false,
    "hasVideo": false,
    "shortDesc": "Regatón Trio 19 MM para L07 y L08 diseñado para soporte terapéutico de alta durabilidad y estabilidad anatómica.",
    "desc": "Dispositivo ortopédico Regatón Trio 19 MM para L07 y L08 fabricado con materiales de grado clínico internacional Tynor. Proporciona soporte, compresión controlada y alivio anatómico óptimo para una rehabilitación segura y confortable.",
    "uses": [
      "Tratamiento y prevención de afecciones en zona de pierna.",
      "Rehabilitación ortopédica post-traumática o post-quirúrgica.",
      "Soporte ergonómico de uso diario con alivio de carga articular."
    ],
    "features": [
      "Material transpirable hipoalergénico de alta resistencia",
      "Diseño ergonómico ajustable a la morfología del paciente",
      "Estructura diseñada bajo estándares ortopédicos internacionales"
    ],
    "priceBySize": {
      "Universal": 165.0
    }
  },
  {
    "code": "L47",
    "name": "Regatón Tetra 19 MM para L45",
    "cat": "movilidad",
    "price": 165.0,
    "bodyPart": "pierna",
    "badge": "REHABILITACION",
    "linea": "REHABILITACION",
    "sizes": [
      "Universal"
    ],
    "hasPdf": true,
    "hasVideo": false,
    "shortDesc": "Regatón Tetra 19 MM para L45 diseñado para soporte terapéutico de alta durabilidad y estabilidad anatómica.",
    "desc": "Dispositivo ortopédico Regatón Tetra 19 MM para L45 fabricado con materiales de grado clínico internacional Tynor. Proporciona soporte, compresión controlada y alivio anatómico óptimo para una rehabilitación segura y confortable.",
    "uses": [
      "Tratamiento y prevención de afecciones en zona de pierna.",
      "Rehabilitación ortopédica post-traumática o post-quirúrgica.",
      "Soporte ergonómico de uso diario con alivio de carga articular."
    ],
    "features": [
      "Material transpirable hipoalergénico de alta resistencia",
      "Diseño ergonómico ajustable a la morfología del paciente",
      "Estructura diseñada bajo estándares ortopédicos internacionales"
    ],
    "priceBySize": {
      "Universal": 165.0
    }
  },
  {
    "code": "L49",
    "name": "Muleta Axilar Skipper 110 KG",
    "cat": "movilidad",
    "price": 1300.0,
    "bodyPart": "pierna",
    "badge": "REHABILITACION",
    "linea": "REHABILITACION",
    "sizes": [
      "75 kg",
      "110 kg"
    ],
    "hasPdf": true,
    "hasVideo": false,
    "shortDesc": "Muleta Axilar Skipper 110 KG diseñado para soporte terapéutico de alta durabilidad y estabilidad anatómica.",
    "desc": "Dispositivo ortopédico Muleta Axilar Skipper 110 KG fabricado con materiales de grado clínico internacional Tynor. Proporciona soporte, compresión controlada y alivio anatómico óptimo para una rehabilitación segura y confortable.",
    "uses": [
      "Tratamiento y prevención de afecciones en zona de pierna.",
      "Rehabilitación ortopédica post-traumática o post-quirúrgica.",
      "Soporte ergonómico de uso diario con alivio de carga articular."
    ],
    "features": [
      "Material transpirable hipoalergénico de alta resistencia",
      "Diseño ergonómico ajustable a la morfología del paciente",
      "Estructura diseñada bajo estándares ortopédicos internacionales"
    ],
    "priceBySize": {
      "75 kg": 1300.0,
      "110 kg": 1300.0
    }
  },
  {
    "code": "L50",
    "name": "Recipiente con Tapa para Silla Cómodo L35",
    "cat": "tobillo",
    "price": 75.0,
    "bodyPart": "tobillo",
    "badge": "REHABILITACION",
    "linea": "REHABILITACION",
    "sizes": [
      "Universal"
    ],
    "hasPdf": true,
    "hasVideo": false,
    "shortDesc": "Recipiente con Tapa para Silla Cómodo L35 diseñado para soporte terapéutico de alta durabilidad y estabilidad anatómica.",
    "desc": "Dispositivo ortopédico Recipiente con Tapa para Silla Cómodo L35 fabricado con materiales de grado clínico internacional Tynor. Proporciona soporte, compresión controlada y alivio anatómico óptimo para una rehabilitación segura y confortable.",
    "uses": [
      "Tratamiento y prevención de afecciones en zona de tobillo.",
      "Rehabilitación ortopédica post-traumática o post-quirúrgica.",
      "Soporte ergonómico de uso diario con alivio de carga articular."
    ],
    "features": [
      "Material transpirable hipoalergénico de alta resistencia",
      "Diseño ergonómico ajustable a la morfología del paciente",
      "Estructura diseñada bajo estándares ortopédicos internacionales"
    ],
    "priceBySize": {
      "Universal": 75.0
    }
  }
];
