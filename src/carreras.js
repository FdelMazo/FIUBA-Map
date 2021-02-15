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
    finDeCarrera: {
      tpp: { nombre: "Trabajo Profesional de Ingeniería en Informática" },
      tesis: { nombre: "Tesis de Ingeniería" },
    },
    creditos: {
      obligatorias: 156,
      orientacion: 34,
      electivas: { tesis: 34, tpp: 46 },
    },
  },
  agrimensura: {
    graph: data.agrimensura,
    nombre: "Ingeniería en Agrimensura",
  },
  alimentos: {
    graph: data.alimentos,
    nombre: "Ingeniería de Alimentos",
  },
  civil: {
    graph: data.civil,
    nombre: "Ingeniería Civil",
  },
  electricista: {
    graph: data.electricista,
    nombre: "Ingeniería Electricista",
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
  },
  industrial: {
    graph: data.industrial,
    nombre: "Ingeniería Industrial",
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
  },
  naval: {
    graph: data.naval,
    nombre: "Ingeniería Naval y Mecánica",
  },
  petroleo: {
    graph: data.petroleo,
    nombre: "Ingeniería en Petróleo",
  },
  quimica: {
    graph: data.quimica,
    nombre: "Ingeniería Química",
  },
  sistemas: {
    graph: data.sistemas,
    nombre: "Licenciatura en Análisis de Sistemas",
  },
};

export default CARRERAS;
