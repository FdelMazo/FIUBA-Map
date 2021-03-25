import * as data from "./data";
import { COLORS } from "./theme";

export const CARRERAS = [
  {
    id: "sistemas",
    link:
      "http://www.fi.uba.ar/sites/default/files/Licenciatura%20en%20Analisis%20de%20Sistemas%201986%20V2014.pdf",
    graph: data.sistemas,
    nombre: "Licenciatura en Análisis de Sistemas",
    nombrecorto: "Sistemas",
    creditos: {
      total: 176,
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
    link:
      "http://www.fi.uba.ar/sites/default/files/Ingenieria%20en%20Informatica%201986.pdf",
    graph: data.informatica,
    nombre: "Ingeniería en Informática",
    nombrecorto: "Informática",
    orientaciones: [
      {
        nombre: "Gestión Industrial de Sistemas",
        color: COLORS.orientacion1[500],
      },
      { nombre: "Sistemas Distribuidos", color: COLORS.orientacion2[500] },
      { nombre: "Sistemas de Producción", color: COLORS.orientacion3[500] },
    ],
    finDeCarrera: [
      { id: "tesis", materia: "75.00" },
      { id: "tpp", materia: "75.99" },
    ],
    creditos: {
      total: 248,
      obligatorias: 156,
      orientacion: 34,
      electivas: { tesis: 34, tpp: 46 },
    },
    eligeOrientaciones: true,
  },
  {
    id: "agrimensura",
    link:
      "http://www.fi.uba.ar/sites/default/files/Ingenieria%20en%20Agrimensura%202006.pdf",
    graph: data.agrimensura,
    nombre: "Ingeniería en Agrimensura",
    nombrecorto: "Agrimensura",
    finDeCarrera: [
      { id: "tesis", materia: "70.00" },
      { id: "tpp", materia: "70.99" },
    ],
    creditos: {
      total: 208,
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
    link:
      "http://www.fi.uba.ar/sites/default/files/Ingenieria%20de%20Alimentos%202001-.pdf",
    graph: data.alimentos,
    nombre: "Ingeniería de Alimentos",
    nombrecorto: "Alimentos",
    creditos: {
      total: 144,
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
      obligatorias: 118,
      electivas: 10,
    },
  },
  {
    id: "civil",
    link:
      "http://www.fi.uba.ar/sites/default/files/Ingenieria%20Civil%202009.pdf",
    graph: data.civil,
    nombre: "Ingeniería Civil",
    nombrecorto: "Civil",
    creditos: {
      total: 257,
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
    link:
      "http://www.fi.uba.ar/sites/default/files/Ingenieria%20Electricista%202009%20actualizacion%202018_.pdf",
    graph: data.electricista,
    nombre: "Ingeniería Electricista",
    nombrecorto: "Electricista",
    finDeCarrera: [
      { id: "tesis", materia: "85.00" },
      { id: "tpp", materia: "85.99" },
    ],
    creditos: {
      total: 242,
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
    link:
      "http://www.fi.uba.ar/sites/default/files/Ingenieria%20Electr%C3%B3nica%202009%20Modificacion%202018%20actualizacion%202019-.pdf",
    graph: data.electronica,
    nombre: "Ingeniería Electrónica",
    nombrecorto: "Electrónica",
    orientaciones: [
      { nombre: "Multiples Orientaciones", color: COLORS.orientacion0[500] },
      { nombre: "Procesamiento de Señales", color: COLORS.orientacion1[500] },
      { nombre: "Automatización y Control", color: COLORS.orientacion2[500] },
      { nombre: "Física Electrónica", color: COLORS.orientacion3[500] },
      { nombre: "Telecomunicaciones", color: COLORS.orientacion4[500] },
      {
        nombre: "Sistemas Digitales y Computación",
        color: COLORS.orientacion5[500],
      },
      { nombre: "Multimedia", color: COLORS.orientacion6[500] },
      { nombre: "Instrumentación Biomédica", color: COLORS.orientacion7[500] },
    ],
    finDeCarrera: [
      { id: "tesis", materia: "86.00" },
      { id: "tpp", materia: "86.99" },
    ],
    creditos: {
      total: 240,
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
    link:
      "http://www.fi.uba.ar/sites/default/files/Ingenieria%20Industrial%202011%20Modificacion%202018%20actualizacion%202019-.pdf",
    graph: data.industrial,
    nombre: "Ingeniería Industrial",
    nombrecorto: "Industrial",
    finDeCarrera: [
      { id: "tesis", materia: "92.00" },
      { id: "tpp", materia: "92.99" },
    ],
    creditos: {
      total: 245,
      obligatorias: 196,
      materias: [
        {
          id: "HUM",
          nombrecorto: "Humanística",
          bg: COLORS.orientacion1[50],
          color: "orientacion1",
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
      electivas: 32,
    },
  },
  {
    id: "mecanica",
    link:
      "http://www.fi.uba.ar/sites/default/files/Ingenieria%20Mecanica%201986%20-%20actualizaci%C3%B3n%202017-07.pdf",
    graph: data.mecanica,
    nombre: "Ingeniería Mecánica",
    nombrecorto: "Mecánica",
    orientaciones: [
      { nombre: "Diseño Mecánico", color: COLORS.orientacion1[500] },
      { nombre: "Termomecánica", color: COLORS.orientacion2[500] },
      { nombre: "Metalúrgica", color: COLORS.orientacion3[500] },
      { nombre: "Computación Aplicada", color: COLORS.orientacion4[500] },
      { nombre: "Industrias", color: COLORS.orientacion5[500] },
    ],
    eligeOrientaciones: { tesis: true },
    finDeCarrera: [
      { id: "tesis", materia: "67.00" },
      { id: "tpp", materia: "67.98" },
    ],
    creditos: {
      total: 260,
      obligatorias: 190,
      orientacion: { tesis: 28 },
      electivas: { tesis: 24, tpp: 52 },
    },
  },
  {
    id: "naval",
    link:
      "http://www.fi.uba.ar/sites/default/files/Ingenieria%20Naval%20y%20Mecanica%201986-%20plan%20de%20estudios.pdf",
    graph: data.naval,
    nombre: "Ingeniería Naval y Mecánica",
    nombrecorto: "Naval",
    finDeCarrera: [
      { id: "tesis", materia: "73.00" },
      { id: "tpp", materia: "73.99" },
    ],
    creditos: {
      total: 264,
      obligatorias: 226,
      electivas: { tesis: 20, tpp: 38 },
    },
  },
  {
    id: "petroleo",
    link:
      "http://www.fi.uba.ar/sites/default/files/Ingenieria%20en%20Petroleo%202015_.pdf",
    graph: data.petroleo,
    nombre: "Ingeniería en Petróleo",
    nombrecorto: "Petróleo",
    finDeCarrera: [
      { id: "tesis", materia: "79.00" },
      { id: "tpp", materia: "79.99" },
    ],
    creditos: {
      total: 246,
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
    link:
      "http://www.fi.uba.ar/sites/default/files/Ingenieria%20Quimica%201986%20M.pdf",
    graph: data.quimica,
    nombre: "Ingeniería Química",
    nombrecorto: "Química",
    finDeCarrera: [
      { id: "tesis", materia: "76.64" },
      { id: "tpp", materia: "76.59-76.62" },
    ],
    creditos: {
      total: 252,
      obligatorias: 216,
      electivas: { tesis: 18, tpp: 24 },
    },
  },
];

export default CARRERAS;
