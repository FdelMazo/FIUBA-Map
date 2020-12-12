import * as data from "./data";

const CARRERAS = {
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
  },
  industrial: {
    graph: data.industrial,
    nombre: "Ingeniería Industrial",
  },
  informatica: {
    graph: data.informatica,
    nombre: "Ingeniería en Informática",
    orientaciones: { gestion: { nombre: "Gestion de Producción" } },
    finDeCarrera: { tpp: { nombre: "Trabajo Práctico Profesional" } },
  },
  mecanica: {
    graph: data.mecanica,
    nombre: "Ingeniería Mecánica",
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
