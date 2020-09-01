import * as data from "./data";

const CARRERAS = {
  sistemas: {
    graph: data.sistemas,
    nombre: "Licenciatura en Sistemas",
  },
  informatica: {
    graph: data.informatica,
    nombre: "Ingeniería en Informática",
    orientaciones: { gestion: { nombre: "Gestion de Producción" } },
  },
};

export default CARRERAS;
