import CARRERAS from "./carreras";
import { COLORS } from "./theme";

export const USER_FORM =
  "https://docs.google.com/forms/u/1/d/e/1FAIpQLSedZWz0SJOLsxEscmHo8FDdTQyIF5xTczGBqr1Z6oLwKwiemw/formResponse";

export const USER_FORM_ENTRIES = {
  padron: "entry.1608351524",
  carrera: "entry.1130086596",
  orientacion: "entry.1483291801",
  finDeCarrera: "entry.310979509",
};

export const GRAPH_FORM =
  "https://docs.google.com/forms/d/e/1FAIpQLScEomNxSEdv07ifB9ep5olsemzRjdPoMMhWL6GLGhswm93shg/formResponse";

export const GRAPH_FORM_ENTRIES = {
  padron: "entry.2064135385",
  carrera: "entry.977368567",
  map: "entry.2113204957",
};

export const BUGS_FORM =
  "https://docs.google.com/forms/d/1Mr4-4qWqZKaobjG3GI30aPvC5qlMsd6Eib3YGUbLd2k/formResponse";

export const BUGS_FORM_ENTRIES = {
  padron: "entry.108884877",
  carrera: "entry.30310619",
  orientacion: "entry.2052513370",
  finDeCarrera: "entry.1835776497",
  bug: "entry.817568535",
};

export const SPREADSHEET =
  "https://sheets.googleapis.com/v4/spreadsheets/1b6h2RApBs2xbN6-eGVvxH68EALKDklvS91fb7d_IVz4/values/";

export const SHEETS = {
  user: "usuarios",
  registros: "registros",
};

export const KEY = "AIzaSyA9snz4CXDq_K8fJeUXkRtRZAQM90HTFp4";

export const GRUPOS = {
  Aprobadas: { color: COLORS.green[400] },
  CBC: { color: COLORS.orange[400] },
  Habilitadas: { color: COLORS.orange[400] },
  "En Final": { color: COLORS.yellow[400] },
  "Materias Obligatorias": { color: COLORS.blue[400] },
  "Materias Electivas": { color: COLORS.purple[400] },
  "Fin de Carrera": { color: COLORS.red[400] },
  "Fin de Carrera (Obligatorio)": { color: COLORS.red[400] },
  ...CARRERAS.filter((c) => c.orientaciones)
    .flatMap((c) => c.orientaciones)
    .reduce(function (map, obj) {
      map[obj.nombre] = obj;
      return map;
    }, {}),
};

export const GRAPHOPTIONS = {
  nodes: { shape: "box" },
  interaction: {
    hover: true,
  },
  physics: {
    enabled: false,
    hierarchicalRepulsion: {
      nodeDistance: 90,
    },
    stabilization: {
      iterations: 100,
      fit: true,
    },
  },
  layout: {
    hierarchical: {
      enabled: true,
      levelSeparation: 145,
      treeSpacing: 0,
      shakeTowards: "leaves",
      direction: "LR",
    },
  },
  edges: { arrows: { to: { enabled: true, scaleFactor: 0.7, type: "arrow" } } },
  groups: { ...GRUPOS },
};
