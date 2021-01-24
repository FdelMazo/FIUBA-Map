export const USER_FORM =
  "https://docs.google.com/forms/u/1/d/e/1FAIpQLSedZWz0SJOLsxEscmHo8FDdTQyIF5xTczGBqr1Z6oLwKwiemw/formResponse";

export const USER_FORM_ENTRIES = {
  padron: "entry.1608351524",
  carrera: "entry.1130086596",
  orientacion: "entry.1483291801",
  finDeCarrera: "entry.310979509",
};

export const SPREADSHEET =
  "https://sheets.googleapis.com/v4/spreadsheets/1b6h2RApBs2xbN6-eGVvxH68EALKDklvS91fb7d_IVz4/values/";

export const SHEETS = {
  user: {
    name: "usuarios",
    columns: {
      timestamp: "A",
      padron: "B",
      carrera: "C",
      orientacion: "D",
      finDeCarrera: "E",
    },
    index: {
      timestamp: 0,
      padron: 1,
      carrera: 2,
      orientacion: 3,
      finDeCarrera: 4,
    },
  },
  registros: "",
};

export const KEY = "AIzaSyA9snz4CXDq_K8fJeUXkRtRZAQM90HTFp4";

export const GRUPOS = {
  Aprobadas: { color: "#1dd1a1" },
  CBC: { color: "#ff9f43" },
  Habilitadas: { color: "#ff9f43" },
  "En Final": { color: "#feca57" },
  "Materias Obligatorias": { color: "#54a0ff" },
  "Materias Electivas": { color: "#a29bfe" },
  // Informática
  "Gestión Industrial de Sistemas": { color: "#fab1a0" },
  "Sistemas Distribuidos": { color: "#C4E538" },
  "Sistemas de Producción": { color: "#fd79a8" },
  // Mecánica
  "Diseño Mecánico": { color: "#fab1a0" },
  Termomecánica: { color: "#C4E538" },
  Metalúrgica: { color: "#fd79a8" },
  "Computación Aplicada": { color: "#BDC581" },
  Industrias: { color: "#EE5A24" },
  // Electrónica
  "Multiples Orientaciones": { color: "#fab1a0" },
  "Procesamiento de Señales": { color: "#C4E538" },
  "Automatización y Control": { color: "#fd79a8" },
  "Física Electrónica": { color: "#BDC581" },
  Telecomunicaciones: { color: "#EE5A24" },
  "Sistemas Digitales y Computación": { color: "#FFE4E1" },
  Multimedia: { color: "#FFDAB9" },
  "Instrumentación Biomédica": { color: "#66CDAA" },
};

export const GRAPHOPTIONS = {
  nodes: { shape: "box" },
  interaction: {
    hover: true,
  },
  layout: {
    hierarchical: { enabled: true, direction: "LR", levelSeparation: 150 },
  },
  edges: { arrows: { to: { enabled: true, scaleFactor: 0.7, type: "arrow" } } },
  groups: { ...GRUPOS },
};
