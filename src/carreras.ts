import { COLORS } from "./theme";
import { UserType } from "./types/User";

// La estructura de las carreras de FIUBA varía bastante. Es muy poco uniforme
// Cada carrera tiene un json asociado donde se almacenan las materias

// Grupos de materias
// - Son solo visuales: cada grupo tiene su etiqueta y color en el mapa, y se puede abrir/cerrar
// - En el json, cada materia tiene su `categoria` (como cuenta: obligatoria, electiva...) y opcionalmente su `grupo`
//   (por ej: electivas agrupadas por area, como en electronica 2009)
// - Los colores se asignan solos, en el orden en que aparecen los grupos en el json
// Algunas carreras te hacen elegir una orientacion => `creditos.orientaciones`, por nombre
// - Sus materias tienen `categoria: "Orientacion:<nombre>"` (por ej: "Orientacion:Termomecánica"), sin `grupo`
// - Cada orientacion pide sus propios creditos, y cambia cuantos de electivas hay que hacer
// - Las materias de las orientaciones no elegidas cuentan como electivas

// Algunas carreras te hacen elegir entre tesis y tpp, otras no => `creditos.findecarrera`
// Algunas carreras tienen materias que si o si necesitas para recibirte (practica profesional) => `creditos.materias`
// Algunas carreras tienen cosas que no son materias que si o si necesitas para recibirte (examen de ingles) => `creditos.checkbox`

// Informatica 1986 es la peor de todas. En base a las combinaciones de [orientacion,findecarrera], hay que hacer distinta cantidad de creditos de electivas

//// Acerca de cada json de las carreras
// En los jsons se tiene una lista de objetos donde cada uno representa una materia
//   de cada materia hay que especificar el id (el codigo), el nombre, la cantidad de creditos que da,
//   (en algunas materias, la cantidad de creditos minima requerida para cursarlas),
//   las correlativas que tiene (un string de ids separados por guiones),
//   el grupo al que pertenecen: son electivas? obligatorias? etc
// Se puede intentar armar ese json parseando los PDFs de la facultad, o a manopla
// Con el tiempo si hay alguna correlativa esta mal escrita, alguien se da cuenta y lo avisa

// Técnicamente este array no es de carreras, es de planes de estudio de cada carrera
// Pero el FIUBA Map arranco antes de que existan muchos planes para cada carrera, y
// ahora quedo que el usuario tiene una "carrera" asociada, aunque sea un plan, así que
// lo dejamos así

export const CARRERAS: UserType.Carrera[] = [
  {
    id: "sistemasviejo",
    link: "https://fi.uba.ar/grado/carreras/lic-en-analisis-de-sistemas/plan-de-estudios",
    ano: 1986,
    graph: require("./data/sistemas-1986.json"),
    creditos: {
      electivas: 40,
    },
  },
  {
    id: "sistemas",
    link: "https://fi.uba.ar/grado/carreras/lic-en-analisis-de-sistemas/plan-de-estudios",
    ano: 2014,
    graph: require("./data/sistemas-2014.json"),
    creditos: {
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
    link: "https://fi.uba.ar/grado/carreras/ingenieria-en-informatica/plan-de-estudios",
    ano: 1986,
    graph: require("./data/informatica-1986.json"),
    finDeCarrera: [
      { id: "tesis", materia: "75.00" },
      { id: "tpp", materia: "75.99" },
    ],
    creditos: {
      orientaciones: {
        "Gestión Industrial de Sistemas": {
          creditos: 24,
          electivas: { tesis: 78, tpp: 90 },
        },
        "Sistemas de Producción": {
          creditos: 22,
          electivas: { tesis: 80, tpp: 92 },
        },
        "Sistemas Distribuidos": {
          creditos: 18,
          electivas: { tesis: 84, tpp: 96 },
        },
      },
    },
  },
  {
    id: "informatica-2020",
    link: "https://fi.uba.ar/grado/carreras/ingenieria-en-informatica/plan-de-estudios",
    ano: 2020,
    graph: require("./data/informatica-2020.json"),
    creditos: {
      electivas: 24,
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
          id: "TIF",
          nombrecorto: "TIF",
          bg: COLORS.findecarrera[50],
          color: "findecarrera",
        },
      ],
    },
  },
  {
    id: "agrimensura",
    link: "https://fi.uba.ar/grado/carreras/ingenieria-en-agrimensura/plan-de-estudios",
    ano: 2006,
    graph: require("./data/agrimensura-2006.json"),
    finDeCarrera: [
      { id: "tesis", materia: "70.00" },
      { id: "tpp", materia: "70.99" },
    ],
    creditos: {
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
    link: "https://fi.uba.ar/grado/carreras/ingenieria-en-agrimensura/plan-de-estudios",
    ano: 2020,
    graph: require("./data/agrimensura-2020.json"),
    creditos: {
      electivas: 16,
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
          id: "TIF",
          nombrecorto: "TIF",
          bg: COLORS.findecarrera[50],
          color: "findecarrera",
        },
      ],
    },
  },
  {
    id: "bioingenieria-2020",
    link: "https://fi.uba.ar/grado/carreras/bioingenieria/plan-de-estudios",
    ano: 2020,
    graph: require("./data/bioingenieria-2020.json"),
    creditos: {
      electivas: 16,
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
          id: "TIF",
          nombrecorto: "TIF",
          bg: COLORS.findecarrera[50],
          color: "findecarrera",
        },
      ],
    },
  },
  {
    id: "alimentos",
    link: "https://fi.uba.ar/grado/carreras/ingenieria-en-alimentos/plan-de-estudios",
    ano: 2001,
    graph: require("./data/alimentos-2000.json"),
    creditos: {
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
    id: "alimentos-2020",
    link: "https://fi.uba.ar/grado/carreras/ingenieria-en-alimentos/plan-de-estudios",
    ano: 2020,
    graph: require("./data/alimentos-2020.json"),
    creditos: {
      electivas: 12,
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
          id: "TIF",
          nombrecorto: "TIF",
          bg: COLORS.findecarrera[50],
          color: "findecarrera",
        },
      ],
    },
  },
  {
    id: "civil",
    link: "https://fi.uba.ar/grado/carreras/ingenieria-civil/plan-de-estudios",
    ano: 2009,
    graph: require("./data/civil-2009.json"),
    creditos: {
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
    link: "https://fi.uba.ar/grado/carreras/ingenieria-civil/plan-de-estudios",
    ano: 2020,
    graph: require("./data/civil-2020.json"),
    creditos: {
      electivas: 24,
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
          id: "TIF",
          nombrecorto: "TIF",
          bg: COLORS.findecarrera[50],
          color: "findecarrera",
        },
      ],
    },
  },
  {
    id: "electricista",
    link: "https://fi.uba.ar/grado/carreras/ingenieria-electricista/plan-de-estudios",
    ano: 2009,
    graph: require("./data/electricista-2009.json"),
    finDeCarrera: [
      { id: "tesis", materia: "85.00" },
      { id: "tpp", materia: "85.99" },
    ],
    creditos: {
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
    id: "energia-electrica-2020",
    link: "https://fi.uba.ar/grado/carreras/ingenieria-electricista/plan-de-estudios",
    ano: 2020,
    graph: require("./data/energia-electrica-2020.json"),
    creditos: {
      electivas: 18,
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
          id: "TIF",
          nombrecorto: "TIF",
          bg: COLORS.findecarrera[50],
          color: "findecarrera",
        },
      ],
    },
  },
  {
    id: "electronica",
    link: "https://fi.uba.ar/grado/carreras/ingenieria-electronica/plan-de-estudios",
    ano: 2009,
    graph: require("./data/electronica-2009.json"),
    finDeCarrera: [
      { id: "tesis", materia: "86.00" },
      { id: "tpp", materia: "86.99" },
    ],
    creditos: {
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
    link: "https://fi.uba.ar/grado/carreras/ingenieria-electronica/plan-de-estudios",
    ano: 2020,
    graph: require("./data/electronica-2020.json"),
    creditos: {
      electivas: 24,
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
          id: "TIF",
          nombrecorto: "TIF",
          bg: COLORS.findecarrera[50],
          color: "findecarrera",
        },
      ],
    },
  },
  {
    id: "industrial",
    link: "https://fi.uba.ar/grado/carreras/ingenieria-industrial/plan-de-estudios",
    ano: 2011,
    graph: require("./data/industrial-2011.json"),
    finDeCarrera: [
      { id: "tesis", materia: "92.00" },
      { id: "tpp", materia: "92.99" },
    ],
    creditos: {
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
    link: "https://fi.uba.ar/grado/carreras/ingenieria-industrial/plan-de-estudios",
    ano: 2020,
    graph: require("./data/industrial-2020.json"),
    creditos: {
      electivas: 24,
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
          id: "TIF",
          nombrecorto: "TIF",
          bg: COLORS.findecarrera[50],
          color: "findecarrera",
        },
      ],
    },
  },
  {
    id: "mecanica",
    link: "https://fi.uba.ar/grado/carreras/ingenieria-mecanica/plan-de-estudios",
    ano: 1986,
    graph: require("./data/mecanica-1986.json"),
    finDeCarrera: [
      { id: "tesis", materia: "67.00" },
      { id: "tpp", materia: "67.98" },
    ],
    creditos: {
      orientaciones: {
        "Diseño Mecánico": {
          creditos: 28,
          electivas: { tesis: 24, tpp: 28 },
        },
        Termomecánica: {
          creditos: 28,
          electivas: { tesis: 24, tpp: 28 },
        },
      },
    },
  },
  {
    id: "mecanica-2020",
    link: "https://fi.uba.ar/grado/carreras/ingenieria-mecanica/plan-de-estudios",
    ano: 2020,
    graph: require("./data/mecanica-2020.json"),
    creditos: {
      electivas: 14,
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
          id: "TIF",
          nombrecorto: "TIF",
          bg: COLORS.findecarrera[50],
          color: "findecarrera",
        },
      ],
    },
  },
  {
    id: "naval",
    link: "https://fi.uba.ar/grado/carreras/ingenieria-naval/plan-de-estudios",
    ano: 1986,
    graph: require("./data/naval-1986.json"),
    finDeCarrera: [
      { id: "tesis", materia: "73.00" },
      { id: "tpp", materia: "73.99" },
    ],
    creditos: {
      electivas: { tesis: 20, tpp: 38 },
    },
  },
  {
    id: "naval-2020",
    link: "https://fi.uba.ar/grado/carreras/ingenieria-naval/plan-de-estudios",
    ano: 2020,
    graph: require("./data/naval-2020.json"),
    creditos: {
      electivas: 18,
      materias: [
        {
          id: "TIF",
          nombrecorto: "TIF",
          bg: COLORS.findecarrera[50],
          color: "findecarrera",
        },
      ],
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
    id: "petroleo",
    link: "https://fi.uba.ar/grado/carreras/ingenieria-en-petroleo/plan-de-estudios",
    ano: 2015,
    graph: require("./data/petroleo-2015.json"),
    finDeCarrera: [
      { id: "tesis", materia: "79.00" },
      { id: "tpp", materia: "79.99" },
    ],
    creditos: {
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
    link: "https://fi.uba.ar/grado/carreras/ingenieria-en-petroleo/plan-de-estudios",
    ano: 2020,
    graph: require("./data/petroleo-2020.json"),
    creditos: {
      electivas: 14,
      materias: [
        {
          id: "TIF",
          nombrecorto: "TIF",
          bg: COLORS.findecarrera[50],
          color: "findecarrera",
        },
      ],
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
    id: "quimica",
    link: "https://fi.uba.ar/grado/carreras/ingenieria-quimica/plan-de-estudios",
    ano: 1986,
    graph: require("./data/quimica-1986.json"),
    finDeCarrera: [
      { id: "tesis", materia: "76.64" },
      { id: "tpp", materia: "76.59-76.62" },
    ],
    creditos: {
      electivas: { tesis: 18, tpp: 24 },
    },
  },
  {
    id: "quimica-2020",
    link: "https://fi.uba.ar/grado/carreras/ingenieria-quimica/plan-de-estudios",
    ano: 2020,
    graph: require("./data/quimica-2020.json"),
    creditos: {
      electivas: 14,
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
          id: "TIF",
          nombrecorto: "TIF",
          bg: COLORS.findecarrera[50],
          color: "findecarrera",
        },
      ],
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
    nombre: "Ingeniería en Alimentos",
    nombrecorto: "Alimentos",
    planes: ["alimentos", "alimentos-2020"],
  },
  {
    nombre: "Bioingeniería",
    nombrecorto: "Bioingeniería",
    planes: ["bioingenieria-2020"],
  },
  {
    nombre: "Ingeniería en Energía Eléctrica",
    nombrecorto: "Electricista",
    planes: ["electricista", "energia-electrica-2020"],
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
    planes: ["mecanica", "mecanica-2020"],
  },
  {
    nombre: "Ingeniería Naval",
    nombrecorto: "Naval",
    planes: ["naval", "naval-2020"],
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
];
