import { COLORS } from "./theme";

// La estructura de las carreras de FIUBA varía bastante. Es muy poco uniforme
// Cada carrera tiene un json asociado donde se almacenan las materias

// Algunas carreras tienen orientaciones
// - Algunas carreras tienen orientaciones obligatorias (hay que elegirla y aprobar todas las materias que tienen) => `eligeOrientaciones`
// - Otras, tienen orientaciones que son solamente un conjunto de materias electivas (o sea, son una sugerencia, algo asi como "si te gusta termodinamica, cursate estas 3 materias")

// Algunas carreras te hacen elegir entre tesis y tpp, otras no => `creditos.findecarrera`
// Algunas carreras tienen materias que si o si necesitas para recibirte (practica profesional) => `creditos.materias`
// Algunas carreras tienen cosas que no son materias que si o si necesitas para recibirte (examen de ingles) => `creditos.checkbox`

// Informatica es la peor de todas. En base a las combinaciones de [orientacion,findecarrera], hay que hacer distinta cantidad de creditos de electivas


//// Acerca de cada json de las carreras
// En los jsons se tiene una lista de objetos donde cada uno representa una materia
//   de cada materia hay que especificar el id (el codigo), el nombre, la cantidad de creditos que da,
//   (en algunas materias, la cantidad de creditos minima requerida para cursarlas),
//   las correlativas que tiene (un string de ids separados por guiones),
//   el grupo al que pertenecen: son electivas? obligatorias? etc
// Se puede intentar armar ese json parseando los PDFs de la facultad, o a manopla
// Con el tiempo si hay alguna correlativa esta mal escrita, alguien se da cuenta y lo avisa

// Técnicamente este array no es de carreras, es de planes de estudio de cada carrera
// Pero el fiuba map arranco antes de que existan muchos planes para cada carrera, y
// ahora quedo que el usuario tiene una "carrera" asociada, aunque sea un plan, así que
// lo dejamos así

// TODO: cambiar los links de los planes nuevos a medida que aparezcan en la pagina de fiuba
export const CARRERAS = [
  {
    id: "sistemas",
    link: "https://www.fi.uba.ar/grado/carreras/lic-en-analisis-de-sistemas/plan-de-estudios",
    ano: 2014,
    graph: require("./data/sistemas-2014.json"),
    creditos: {
      total: 214,
      electivas: 28,
      checkbox: [
        {
          nombre: "Prueba de nivel de idioma inglés",
          nombrecorto: "Inglés",
          bg: COLORS.enfinal[50],
          color: "enfinal",
        },
      ],
      materias: [
        {
          id: "95.61",
          nombrecorto: "TPP",
          bg: COLORS.findecarrera[50],
          color: "findecarrera",
        },
      ],
    },
  },
  {
    id: "informatica",
    link: "https://www.fi.uba.ar/grado/carreras/ingenieria-en-informatica/plan-de-estudios",
    ano: 1986,
    graph: require("./data/informatica-1986.json"),
    orientaciones: [
      {
        nombre: "Gestión Industrial de Sistemas",
        colorScheme: "orientacion1",
      },
      { nombre: "Sistemas Distribuidos", colorScheme: "orientacion2" },
      { nombre: "Sistemas de Producción", colorScheme: "orientacion3" },
    ],
    finDeCarrera: [
      { id: "tesis", materia: "75.00" },
      { id: "tpp", materia: "75.99" },
    ],
    creditos: {
      total: 286,
      orientacion: {
        "Gestión Industrial de Sistemas": {
          orientacion: 24,
          electivas: { tesis: 78, tpp: 90 },
        },
        "Sistemas de Producción": {
          orientacion: 22,
          electivas: { tesis: 80, tpp: 92 },
        },
        "Sistemas Distribuidos": {
          orientacion: 18,
          electivas: { tesis: 84, tpp: 96 },
        },
      },
    },
    eligeOrientaciones: true,
  },
  {
    id: "informatica-2020",
    link: "https://sites.google.com/fi.uba.ar/academica/nuevos-planes-de-estudio/plan-ing-en-inform%C3%A1tica",
    ano: 2020,
    graph: require("./data/informatica-2020.json"),
    finDeCarrera: [
      { id: "tesis", materia: "TESIS" },
      { id: "tpp", materia: "TPP" }
    ],
    creditos: {
      total: 226,
      electivas: 24,
      checkbox: [
        {
          nombre: "Prueba de nivel de idioma inglés",
          nombrecorto: "Inglés",
          bg: COLORS.enfinal[50],
          color: "enfinal",
        },
      ],
    },
  },
  {
    id: "agrimensura",
    link: "https://www.fi.uba.ar/grado/carreras/ingenieria-en-agrimensura/plan-de-estudios",
    ano: 2006,
    graph: require("./data/agrimensura-2006.json"),
    finDeCarrera: [
      { id: "tesis", materia: "70.00" },
      { id: "tpp", materia: "70.99" },
    ],
    creditos: {
      total: 246,
      checkbox: [
        {
          nombre: "Estadía Supervisada de al menos 200 horas",
          nombrecorto: "Estadía",
          bg: COLORS.habilitadas[50],
          color: "habilitadas",
        },
      ],
      electivas: { tesis: 12, tpp: 18 },
    },
  },
  {
    id: "agrimensura-2020",
    link: "https://sites.google.com/fi.uba.ar/academica/nuevos-planes-de-estudio/plan-ing-en-agrimensura",
    beta: true,
    ano: 2020,
    graph: require("./data/agrimensura-2020.json"),
    finDeCarrera: [
      { id: "tesis", materia: "TESIS" },
      { id: "tpp", materia: "TPP" },
    ],
    creditos: {
      total: 227,
      electivas: 16,
    },
  },
  {
    id: "alimentos",
    link: "https://www.fi.uba.ar/grado/carreras/ingenieria-de-alimentos/plan-de-estudios",
    ano: 2001,
    graph: require("./data/alimentos-2000.json"),
    creditos: {
      total: 272,
      materias: [
        {
          id: "76.44",
          nombrecorto: "pp",
          bg: COLORS.habilitadas[50],
          color: "habilitadas",
        },
        {
          id: "76.90",
          nombrecorto: "tesis",
          bg: COLORS.findecarrera[50],
          color: "findecarrera",
        },
      ],
      electivas: 10,
    },
  },
  {
    id: "civil",
    link: "https://www.fi.uba.ar/grado/carreras/ingenieria-civil/plan-de-estudios",
    ano: 2009,
    graph: require("./data/civil-2009.json"),
    creditos: {
      total: 295,
      electivas: 34,
      materias: [
        {
          id: "84.99",
          nombrecorto: "TPP",
          bg: COLORS.findecarrera[50],
          color: "findecarrera",
        },
      ],
      checkbox: [
        {
          nombre: "Estadía Supervisada de al menos 200 horas",
          nombrecorto: "Estadía",
          bg: COLORS.habilitadas[50],
          color: "habilitadas",
        },
        {
          nombre: "Prueba de nivel de idioma inglés",
          nombrecorto: "Inglés",
          bg: COLORS.enfinal[50],
          color: "enfinal",
        },
      ],
    },
  },
  {
    id: "civil-2020",
    link: "https://sites.google.com/fi.uba.ar/academica/nuevos-planes-de-estudio/plan-ing-civil",
    beta: true,
    ano: 2020,
    graph: require("./data/civil-2020.json"),
    finDeCarrera: [
      { id: "tesis", materia: "TESIS" },
      { id: "tpp", materia: "TPP" },
    ],
    creditos: {
      total: 251,
      electivas: 24,
    },
  },
  {
    id: "electricista",
    link: "https://www.fi.uba.ar/grado/carreras/ingenieria-electricista/plan-de-estudios",
    ano: 2009,
    graph: require("./data/electricista-2009.json"),
    finDeCarrera: [
      { id: "tesis", materia: "85.00" },
      { id: "tpp", materia: "85.99" },
    ],
    creditos: {
      total: 280,
      checkbox: [
        {
          nombre: "Estadía Supervisada de al menos 200 horas",
          nombrecorto: "Estadía",
          bg: COLORS.habilitadas[50],
          color: "habilitadas",
        },
        {
          nombre: "Prueba de nivel de idioma inglés",
          nombrecorto: "Inglés",
          bg: COLORS.enfinal[50],
          color: "enfinal",
        },
      ],
      electivas: { tesis: 16, tpp: 22 },
    },
  },
  {
    id: "electronica",
    link: "https://www.fi.uba.ar/grado/carreras/ingenieria-electronica/plan-de-estudios",
    ano: 2009,
    graph: require("./data/electronica-2009.json"),
    orientaciones: [
      { nombre: "Procesamiento de Señales", colorScheme: "orientacion1" },
      { nombre: "Automatización y Control", colorScheme: "orientacion2" },
      { nombre: "Física Electrónica", colorScheme: "orientacion3" },
      { nombre: "Telecomunicaciones", colorScheme: "orientacion4" },
      {
        nombre: "Sistemas Digitales y Computación",
        colorScheme: "orientacion5",
      },
      { nombre: "Multimedia", colorScheme: "orientacion6" },
      { nombre: "Instrumentación Biomédica", colorScheme: "orientacion7" },
      { nombre: "Multiples Orientaciones", colorScheme: "orientacion8" },
    ],
    finDeCarrera: [
      { id: "tesis", materia: "86.00" },
      { id: "tpp", materia: "86.99" },
    ],
    creditos: {
      total: 278,
      electivas: 56,
      checkbox: [
        {
          nombre: "Práctica  Profesional",
          nombrecorto: "PP",
          bg: COLORS.habilitadas[50],
          color: "habilitadas",
        },
        {
          nombre: "Prueba de nivel de idioma inglés",
          nombrecorto: "Inglés",
          bg: COLORS.enfinal[50],
          color: "enfinal",
        },
      ],
    },
  },
  {
    id: "electronica-2020",
    link: "https://sites.google.com/fi.uba.ar/academica/nuevos-planes-de-estudio/plan-ing-en-electr%C3%B3nica",
    beta: true,
    ano: 2020,
    graph: require("./data/electronica-2020.json"),
    finDeCarrera: [
      { id: "tesis", materia: "TESIS" },
      { id: "tpp", materia: "TPP" },
    ],
    creditos: {
      total: 228,
      electivas: 24,
      checkbox: [
        {
          nombre: "Prueba de nivel de idioma inglés",
          nombrecorto: "Inglés",
          bg: COLORS.enfinal[50],
          color: "enfinal",
        },
      ],
    },
  },
  {
    id: "industrial",
    link: "https://www.fi.uba.ar/grado/carreras/ingenieria-industrial/plan-de-estudios",
    ano: 2011,
    graph: require("./data/industrial-2011.json"),
    finDeCarrera: [
      { id: "tesis", materia: "92.00" },
      { id: "tpp", materia: "92.99" },
    ],
    creditos: {
      total: 283,
      checkbox: [
        {
          nombre: "Práctica Profesional de al menos 200 horas",
          nombrecorto: "PP",
          bg: COLORS.habilitadas[50],
          color: "habilitadas",
        },
        {
          nombre: "Prueba de nivel de idioma inglés",
          nombrecorto: "Inglés",
          bg: COLORS.enfinal[50],
          color: "enfinal",
        },
      ],
      electivas: 36,
    },
  },
  {
    id: "industrial-2020",
    link: "https://sites.google.com/fi.uba.ar/academica/nuevos-planes-de-estudio/plan-ing-industrial",
    ano: 2020,
    graph: require("./data/industrial-2020.json"),
    finDeCarrera: [
      { id: "tesis", materia: "TESIS" },
      { id: "tpp", materia: "TPP" },
    ],
    creditos: {
      total: 236,
      electivas: 24,
      checkbox: [
        {
          nombre: "Prueba de nivel de idioma inglés",
          nombrecorto: "Inglés",
          bg: COLORS.enfinal[50],
          color: "enfinal",
        },
      ],
    },
  },
  {
    id: "mecanica",
    link: "https://www.fi.uba.ar/grado/carreras/ingenieria-mecanica/plan-de-estudios",
    ano: 1986,
    graph: require("./data/mecanica-1986.json"),
    orientaciones: [
      { nombre: "Diseño Mecánico", colorScheme: "orientacion1" },
      { nombre: "Termomecánica", colorScheme: "orientacion2" },
      { nombre: "Metalúrgica", colorScheme: "orientacion3", nonEligible: true },
      {
        nombre: "Computación Aplicada",
        colorScheme: "orientacion4",
        nonEligible: true,
      },
      { nombre: "Industrias", colorScheme: "orientacion5", nonEligible: true },
    ],
    finDeCarrera: [
      { id: "tesis", materia: "67.00" },
      { id: "tpp", materia: "67.98" },
    ],
    creditos: {
      total: 298,
      orientacion: {
        "Diseño Mecánico": {
          orientacion: 28,
          electivas: { tesis: 24, tpp: 28 },
        },
        Termomecánica: {
          orientacion: 28,
          electivas: { tesis: 24, tpp: 28 },
        },
      },
    },
    eligeOrientaciones: true,
  },
  {
    id: "naval",
    link: "https://www.fi.uba.ar/grado/carreras/ingenieria-naval-y-mecanica/plan-de-estudios",
    ano: 1986,
    graph: require("./data/naval-1986.json"),
    finDeCarrera: [
      { id: "tesis", materia: "73.00" },
      { id: "tpp", materia: "73.99" },
    ],
    creditos: {
      total: 302,
      electivas: { tesis: 20, tpp: 38 },
    },
  },
  {
    id: "petroleo",
    link: "https://www.fi.uba.ar/grado/carreras/ingenieria-en-petroleo/plan-de-estudios",
    ano: 2015,
    graph: require("./data/petroleo-2015.json"),
    finDeCarrera: [
      { id: "tesis", materia: "79.00" },
      { id: "tpp", materia: "79.99" },
    ],
    creditos: {
      total: 284,
      electivas: { tesis: 12, tpp: 16 },
      checkbox: [
        {
          nombre: "Práctica Supervisada",
          nombrecorto: "PS",
          bg: COLORS.habilitadas[50],
          color: "habilitadas",
        },
        {
          nombre: "Prueba de nivel de idioma inglés",
          nombrecorto: "Inglés",
          bg: COLORS.enfinal[50],
          color: "enfinal",
        },
      ],
    },
  },
  {
    id: "petroleo-2020",
    link: "https://sites.google.com/fi.uba.ar/academica/nuevos-planes-de-estudio/plan-ing-en-petr%C3%B3leo",
    beta: true,
    ano: 2020,
    graph: require("./data/petroleo-2020.json"),
    creditos: {
      total: 241,
      electivas: 14,
      materias: [
        {
          id: "TPP1",
          nombrecorto: "TPP1",
          bg: COLORS.findecarrera[50],
          color: "findecarrera",
        },
        {
          id: "TPP2",
          nombrecorto: "TPP2",
          bg: COLORS.findecarrera[50],
          color: "findecarrera",
        },
      ],
    },
  },
  {
    id: "quimica",
    link: "https://www.fi.uba.ar/grado/carreras/ingenieria-quimica/plan-de-estudios",
    ano: 1986,
    graph: require("./data/quimica-1986.json"),
    finDeCarrera: [
      { id: "tesis", materia: "76.64" },
      { id: "tpp", materia: "76.59-76.62" },
    ],
    creditos: {
      total: 290,
      electivas: { tesis: 18, tpp: 24 },
    },
  },
  {
    id: "quimica-2020",
    link: "https://sites.google.com/fi.uba.ar/academica/nuevos-planes-de-estudio/plan-ing-qu%C3%ADmica",
    beta: true,
    ano: 2020,
    graph: require("./data/quimica-2020.json"),
    finDeCarrera: [
      { id: "tesis", materia: "TESIS" },
      { id: "tpp", materia: "TPP" },
    ],
    creditos: {
      total: 231,
      electivas: 14,
    },
  },
  {
    id: "sistemasviejo",
    link: "https://www.fi.uba.ar/grado/carreras/lic-en-analisis-de-sistemas/plan-de-estudios",
    ano: 1986,
    graph: require("./data/sistemas-1986.json"),
    creditos: {
      total: 208,
      electivas: 40,
    },
  },
];

// Acá se define como se le presentan al usuario la lista de planes/carreras
// Todos los ids de `CARRERAS` tienen que estar usados acá
export const PLANES = [
  {
    nombre: "Ingeniería Civil",
    nombrecorto: "Civil",
    planes: ["civil", "civil-2020"],
  },
  {
    nombre: "Ingeniería de Alimentos",
    nombrecorto: "Alimentos",
    planes: ["alimentos"],
  },
  {
    nombre: "Ingeniería Electricista",
    nombrecorto: "Electricista",
    planes: ["electricista"],
  },
  {
    nombre: "Ingeniería Electrónica",
    nombrecorto: "Electrónica",
    planes: ["electronica", "electronica-2020"],
  },
  {
    nombre: "Ingeniería en Agrimensura",
    nombrecorto: "Agrimensura",
    planes: ["agrimensura", "agrimensura-2020"],
  },
  {
    nombre: "Ingeniería en Informática",
    nombrecorto: "Informática",
    planes: ["informatica", "informatica-2020"],
  },
  {
    nombre: "Ingeniería en Petróleo",
    nombrecorto: "Petróleo",
    planes: ["petroleo", "petroleo-2020"],
  },
  {
    nombre: "Ingeniería Industrial",
    nombrecorto: "Industrial",
    planes: ["industrial", "industrial-2020"],
  },
  {
    nombre: "Ingeniería Mecánica",
    nombrecorto: "Mecánica",
    planes: ["mecanica"],
  },
  {
    nombre: "Ingeniería Naval y Mecánica",
    nombrecorto: "Naval",
    planes: ["naval"],
  },
  {
    nombre: "Ingeniería Química",
    nombrecorto: "Química",
    planes: ["quimica", "quimica-2020"],
  },
  {
    nombre: "Licenciatura en Análisis de Sistemas",
    nombrecorto: "Sistemas",
    planes: ["sistemasviejo", "sistemas"],
  },
]
