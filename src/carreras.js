import * as data from "./data";

export const CARRERAS = [
  {
    id: "informatica",
    graph: data.informatica,
    nombre: "Ingeniería en Informática",
    orientaciones: [
      { nombre: "Gestión Industrial de Sistemas", color: "#fab1a0" },
      { nombre: "Sistemas Distribuidos", color: "#C4E538" },
      { nombre: "Sistemas de Producción", color: "#fd79a8" },
    ],
    finDeCarrera: [
      { id: "tesis", materia: "75.00" },
      { id: "tpp", materia: "75.99" },
    ],
    creditos: {
      obligatorias: 156,
      orientacion: { tesis: 34, tpp: 34 },
      electivas: { tesis: 34, tpp: 46 },
    },
    eligeOrientaciones: true,
  },
  {
    id: "agrimensura",
    graph: data.agrimensura,
    nombre: "Ingeniería en Agrimensura",
    finDeCarrera: [
      { id: "tesis", materia: "70.00" },
      { id: "tpp", materia: "70.99" },
    ],
    creditos: {
      obligatorias: 178,
      checkbox: [
        { nombre: "Estadía Supervisada de al menos 200 horas", color: "teal" },
      ],
      electivas: { tesis: 12, tpp: 18 },
    },
  },
  {
    id: "alimentos",
    graph: data.alimentos,
    nombre: "Ingeniería de Alimentos",
    creditos: {
      materias: [
        { id: "76.90", color: "red" },
        { id: "76.44", color: "pink" },
      ],
      obligatorias: 118,
      electivas: 10,
    },
  },
  {
    id: "civil",
    graph: data.civil,
    nombre: "Ingeniería Civil",
    creditos: {
      obligatorias: 210,
      electivas: 34,
      materias: [{ id: "84.99", color: "red" }],
      checkbox: [
        { nombre: "Estadía Supervisada de al menos 200 horas", color: "teal" },
        { nombre: "Idioma Inglés", color: "orange" },
      ],
    },
  },
  {
    id: "electricista",
    graph: data.electricista,
    nombre: "Ingeniería Electricista",
    finDeCarrera: [
      { id: "tesis", materia: "85.00" },
      { id: "tpp", materia: "85.99" },
    ],
    creditos: {
      obligatorias: 206,
      checkbox: [
        { nombre: "Estadía Supervisada de al menos 200 horas", color: "teal" },
        { nombre: "Idioma Inglés", color: "orange" },
      ],
      electivas: { tesis: 16, tpp: 22 },
    },
  },
  {
    id: "electronica",
    graph: data.electronica,
    nombre: "Ingeniería Electrónica",
    orientaciones: [
      { nombre: "Multiples Orientaciones", color: "#fab1a0" },
      { nombre: "Procesamiento de Señales", color: "#C4E538" },
      { nombre: "Automatización y Control", color: "#fd79a8" },
      { nombre: "Física Electrónica", color: "#BDC581" },
      { nombre: "Telecomunicaciones", color: "#EE5A24" },
      { nombre: "Sistemas Digitales y Computación", color: "#FFE4E1" },
      { nombre: "Multimedia", color: "#FFDAB9" },
      { nombre: "Instrumentación Biomédica", color: "#66CDAA" },
    ],
    finDeCarrera: [
      { id: "tesis", materia: "86.00" },
      { id: "tpp", materia: "86.99" },
    ],
    creditos: {
      obligatorias: 166,
      electivas: 56,
      checkbox: [
        { nombre: "Práctica  Profesional", color: "teal" },
        { nombre: "Idioma Inglés", color: "orange" },
      ],
    },
  },
  {
    id: "industrial",
    graph: data.industrial,
    nombre: "Ingeniería Industrial",
    finDeCarrera: [
      { id: "tesis", materia: "92.00" },
      { id: "tpp", materia: "92.99" },
    ],
    creditos: {
      obligatorias: 196,
      checkbox: [
        {
          nombre:
            "Asignaturas  humanísticas  a  cursar  en  otras  Facultades de la UBA (4 créditos)",
          color: "blackAlpha",
        },
        { nombre: "Idioma Inglés", color: "orange" },
        { nombre: "Práctica Profesional de al menos 200 horas", color: "teal" },
      ],
      electivas: { tesis: 32, tpp: 32 },
    },
  },
  {
    id: "mecanica",
    graph: data.mecanica,
    nombre: "Ingeniería Mecánica",
    orientaciones: [
      { nombre: "Diseño Mecánico", color: "#fab1a0" },
      { nombre: "Termomecánica", color: "#C4E538" },
      { nombre: "Metalúrgica", color: "#fd79a8" },
      { nombre: "Computación Aplicada", color: "#BDC581" },
      { nombre: "Industrias", color: "#EE5A24" },
    ],
    eligeOrientaciones: { tesis: true },
    finDeCarrera: [
      { id: "tesis", materia: "67.00" },
      { id: "tpp", materia: "67.98" },
    ],
    creditos: {
      obligatorias: 190,
      orientacion: { tesis: 28 },
      electivas: { tesis: 24, tpp: 52 },
    },
  },
  {
    id: "naval",
    graph: data.naval,
    nombre: "Ingeniería Naval y Mecánica",
    finDeCarrera: [
      { id: "tesis", materia: "73.00" },
      { id: "tpp", materia: "73.99" },
    ],
    creditos: {
      obligatorias: 226,
      electivas: { tesis: 20, tpp: 38 },
    },
  },
  {
    id: "petroleo",
    graph: data.petroleo,
    nombre: "Ingeniería en Petróleo",
    finDeCarrera: [
      { id: "tesis", materia: "79.00" },
      { id: "tpp", materia: "79.99" },
    ],
    creditos: {
      obligatorias: 216,
      electivas: { tesis: 12, tpp: 16 },
      checkbox: [
        { nombre: "Práctica  Supervisada", color: "teal" },
        { nombre: "Idioma Inglés", color: "orange" },
      ],
    },
  },
  {
    id: "quimica",
    graph: data.quimica,
    nombre: "Ingeniería Química",
    finDeCarrera: [
      { id: "tesis", materia: "76.64" },
      { id: "tpp", materia: "76.59-76.62" },
    ],
    creditos: {
      obligatorias: 216,
      electivas: { tesis: 18, tpp: 24 },
    },
  },
  {
    id: "sistemas",
    graph: data.sistemas,
    nombre: "Licenciatura en Análisis de Sistemas",
    creditos: {
      obligatorias: 148,
      electivas: 28,
      checkbox: [{ nombre: "Idioma Inglés", color: "orange" }],
    },
  },
];

export default CARRERAS;
