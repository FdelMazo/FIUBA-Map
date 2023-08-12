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

export const CARRERAS = [
  {
    id: "sistemas",
    link: "https://www.fi.uba.ar/grado/carreras/lic-en-analisis-de-sistemas/plan-de-estudios",
    graph: require("./data/sistemas-2014.json"),
    nombre: "Licenciatura en Análisis de Sistemas",
    nombrecorto: "Sistemas",
    creditos: {
      total: 214,
      obligatorias: 136,
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
    graph: require("./data/informatica-1986.json"),
    nombre: "Ingeniería en Informática",
    nombrecorto: "Informática",
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
      obligatorias: 122,
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
    link: "https://mli-fiuba.notion.site/Ingenier-a-en-Inform-tica-48e3eeece07e471dbfe1cd947f7ca245",
    graph: require("./data/informatica-2020.json"),
    nombre: "Ingeniería en Informática (2020)",
    nombrecorto: "Informática 2020",
    finDeCarrera: [
      { id: "tesis", materia: "TESIS" },
      { id: "tpp", materia: "TPP" }
    ],
    creditos: {
      total: 226,
      obligatorias: 152,
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
    graph: require("./data/agrimensura-2006.json"),
    nombre: "Ingeniería en Agrimensura",
    nombrecorto: "Agrimensura",
    finDeCarrera: [
      { id: "tesis", materia: "70.00" },
      { id: "tpp", materia: "70.99" },
    ],
    creditos: {
      total: 246,
      obligatorias: 178,
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
    id: "alimentos",
    link: "https://www.fi.uba.ar/grado/carreras/ingenieria-de-alimentos/plan-de-estudios",
    graph: require("./data/alimentos-2000.json"),
    nombre: "Ingeniería de Alimentos",
    nombrecorto: "Alimentos",
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
      obligatorias: 208,
      electivas: 10,
    },
  },
  {
    id: "civil",
    link: "https://www.fi.uba.ar/grado/carreras/ingenieria-civil/plan-de-estudios",
    graph: require("./data/civil-2009.json"),
    nombre: "Ingeniería Civil",
    nombrecorto: "Civil",
    creditos: {
      total: 295,
      obligatorias: 210,
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
    id: "electricista",
    link: "https://www.fi.uba.ar/grado/carreras/ingenieria-electricista/plan-de-estudios",
    graph: require("./data/electricista-2009.json"),
    nombre: "Ingeniería Electricista",
    nombrecorto: "Electricista",
    finDeCarrera: [
      { id: "tesis", materia: "85.00" },
      { id: "tpp", materia: "85.99" },
    ],
    creditos: {
      total: 280,
      obligatorias: 206,
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
    graph: require("./data/electronica-2009.json"),
    nombre: "Ingeniería Electrónica",
    nombrecorto: "Electrónica",
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
      obligatorias: 166,
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
    id: "industrial",
    link: "https://www.fi.uba.ar/grado/carreras/ingenieria-industrial/plan-de-estudios",
    graph: require("./data/industrial-2011.json"),
    nombre: "Ingeniería Industrial",
    nombrecorto: "Industrial",
    finDeCarrera: [
      { id: "tesis", materia: "92.00" },
      { id: "tpp", materia: "92.99" },
    ],
    creditos: {
      total: 283,
      obligatorias: 196,
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
    beta: true,
    link: "https://mli-fiuba.notion.site/Ingenier-a-Industrial-f1bc735b7f1c44afb7d259d7b2d581a2",
    graph: require("./data/industrial-2020.json"),
    nombre: "Ingeniería Industrial (2020) - BETA",
    nombrecorto: "Industial 2020",
    // finDeCarrera: [
    //   { id: "tesis", materia: "92.00" },
    //   { id: "tpp", materia: "92.99" },
    // ],
    creditos: {
      total: 236,
      obligatorias: 162,
      electivas: 24,
      materias: [
        {
          id: "92.XX",
          nombrecorto: "TESIS/TPP",
          bg: COLORS.findecarrera[50],
          color: "findecarrera",
        },
      ],
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
    },
  },
  {
    id: "mecanica",
    link: "https://www.fi.uba.ar/grado/carreras/ingenieria-mecanica/plan-de-estudios",
    graph: require("./data/mecanica-1986.json"),
    nombre: "Ingeniería Mecánica",
    nombrecorto: "Mecánica",
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
      obligatorias: 190,
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
    graph: require("./data/naval-1986.json"),
    nombre: "Ingeniería Naval y Mecánica",
    nombrecorto: "Naval",
    finDeCarrera: [
      { id: "tesis", materia: "73.00" },
      { id: "tpp", materia: "73.99" },
    ],
    creditos: {
      total: 302,
      obligatorias: 226,
      electivas: { tesis: 20, tpp: 38 },
    },
  },
  {
    id: "petroleo",
    link: "https://www.fi.uba.ar/grado/carreras/ingenieria-en-petroleo/plan-de-estudios",
    graph: require("./data/petroleo-2015.json"),
    nombre: "Ingeniería en Petróleo",
    nombrecorto: "Petróleo",
    finDeCarrera: [
      { id: "tesis", materia: "79.00" },
      { id: "tpp", materia: "79.99" },
    ],
    creditos: {
      total: 284,
      obligatorias: 216,
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
    id: "quimica",
    link: "https://www.fi.uba.ar/grado/carreras/ingenieria-quimica/plan-de-estudios",
    graph: require("./data/quimica-1986.json"),
    nombre: "Ingeniería Química",
    nombrecorto: "Química",
    finDeCarrera: [
      { id: "tesis", materia: "76.64" },
      { id: "tpp", materia: "76.59-76.62" },
    ],
    creditos: {
      total: 290,
      obligatorias: 216,
      electivas: { tesis: 18, tpp: 24 },
    },
  },
  {
    id: "sistemasviejo",
    link: "https://www.fi.uba.ar/grado/carreras/lic-en-analisis-de-sistemas/plan-de-estudios",
    graph: require("./data/sistemas-1986.json"),
    nombre: "Licenciatura en Análisis de Sistemas (1986)",
    nombrecorto: "Sistemas 1986",
    creditos: {
      total: 208,
      obligatorias: 130,
      electivas: 40,
    },
  },
];

export default CARRERAS;
