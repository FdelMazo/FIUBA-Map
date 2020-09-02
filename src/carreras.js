import * as data from "./data";

const CARRERAS = {
  informatica: {
    graph: data.informatica,
    nombre: "Ingeniería en Informática",
    orientaciones: { gestion: { nombre: "Gestion de Producción" } },
  },
  sistemas: {
    graph: data.sistemas,
    nombre: "Licenciatura en Sistemas",
  },
};

export default CARRERAS;
