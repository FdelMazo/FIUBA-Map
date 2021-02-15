import * as data from "./data";

export const CARRERAS = {
  informatica: {
    graph: data.informatica,
    nombre: "Ingeniería en Informática",
    orientaciones: {
      "Gestión Industrial de Sistemas": { color: "#fab1a0" },
      "Sistemas Distribuidos": { color: "#C4E538" },
      "Sistemas de Producción": { color: "#fd79a8" },
    },
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
  agrimensura: {
    graph: data.agrimensura,
    nombre: "Ingeniería en Agrimensura",
    finDeCarrera: [
      { id: "tesis", materia: "70.00" },
      { id: "tpp", materia: "70.99" },
    ],
    creditos: {
      obligatorias: 178,
      checkbox: [{ nombre: "Estadía Supervisada de al menos 200 horas" }],
      electivas: { tesis: 12, tpp: 18 },
    },
  },
  alimentos: {
    graph: data.alimentos,
    nombre: "Ingeniería de Alimentos",
    creditos: {
      materias: [{ id: "76.90" }, { id: "76.44" }],
      obligatorias: 118,
      electivas: 10,
    },
  },
  civil: {
    graph: data.civil,
    nombre: "Ingeniería Civil",
    checkbox: [
      { nombre: "Estadía Supervisada de al menos 200 horas" },
      { nombre: "Idioma Inglés" },
    ],
    creditos: {
      obligatorias: 210,
      electivas: 34,
      materias: [{ id: "84.99" }],
    },
  },
  electricista: {
    graph: data.electricista,
    nombre: "Ingeniería Electricista",
    finDeCarrera: [
      { id: "tesis", materia: "85.00" },
      { id: "tpp", materia: "85.99" },
    ],
    creditos: {
      obligatorias: 206,
      checkbox: [
        { nombre: "Estadía Supervisada de al menos 200 horas" },
        { nombre: "Idioma Inglés" },
      ],
      electivas: { tesis: 16, tpp: 22 },
    },
  },
  electronica: {
    graph: data.electronica,
    nombre: "Ingeniería Electrónica",
    orientaciones: {
      "Multiples Orientaciones": { color: "#fab1a0" },
      "Procesamiento de Señales": { color: "#C4E538" },
      "Automatización y Control": { color: "#fd79a8" },
      "Física Electrónica": { color: "#BDC581" },
      Telecomunicaciones: { color: "#EE5A24" },
      "Sistemas Digitales y Computación": { color: "#FFE4E1" },
      Multimedia: { color: "#FFDAB9" },
      "Instrumentación Biomédica": { color: "#66CDAA" },
    },
    finDeCarrera: [
      { id: "tesis", materia: "86.00" },
      { id: "tpp", materia: "86.99" },
    ],
    creditos: {
      obligatorias: 106,
      electivas: { tesis: 56, tpp: 56 },
      checkbox: [
        { nombre: "Práctica  Profesional" },
        { nombre: "Idioma Inglés" },
      ],
    },
  },
  industrial: {
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
        },
        { nombre: "Idioma Inglés" },
        { nombre: "Práctica Profesional de al menos 200 horas" },
      ],
      electivas: { tesis: 32, tpp: 32 },
    },
  },
  mecanica: {
    graph: data.mecanica,
    nombre: "Ingeniería Mecánica",
    orientaciones: {
      "Diseño Mecánico": { color: "#fab1a0" },
      Termomecánica: { color: "#C4E538" },
      Metalúrgica: { color: "#fd79a8" },
      "Computación Aplicada": { color: "#BDC581" },
      Industrias: { color: "#EE5A24" },
    },
    eligeOrientaciones: { tesis: true },
    finDeCarrera: [
      { id: "tesis", materia: "67.00" },
      { id: "tpp", materia: "67.98" },
    ],
    creditos: {
      obligatorias: 190,
      orientacion: { tesis: 24 },
      electivas: { tesis: 24, tpp: 52 },
    },
  },
  naval: {
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
  petroleo: {
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
        { nombre: "Práctica  Supervisada" },
        { nombre: "Idioma Inglés" },
      ],
    },
  },
  quimica: {
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
  sistemas: {
    graph: data.sistemas,
    nombre: "Licenciatura en Análisis de Sistemas",
    creditos: {
      obligatorias: 148,
      electivas: 28,
      checkbox: [{ nombre: "Idioma Inglés" }],
    },
  },
};

export default CARRERAS;
