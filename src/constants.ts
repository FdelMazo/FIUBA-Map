import { CARRERAS } from "./carreras";
import { COLORS } from "./theme";
import { UserType } from "./types/User";
import { NodeType } from "./types/Node";

export const USER_FORM =
  "https://docs.google.com/forms/u/1/d/e/1FAIpQLSfDKMLIYm0ivpDsOwOJFvCp1U0zyRDF9V5dHj7cdsKdt61FsA/formResponse";

export const USER_FORM_ENTRIES = {
  padron: "entry.1608351524",
  carrera: "entry.1130086596",
  orientacion: "entry.1483291801",
  finDeCarrera: "entry.310979509",
};

export const GRAPH_FORM =
  "https://docs.google.com/forms/d/e/1FAIpQLScF6ZGJqwUexxlqXBg-yAjjlZa7QKJbZTfPx0U-54U8iyqJUw/formResponse";

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
  "https://sheets.googleapis.com/v4/spreadsheets/1b6h2RApBs2xbN6-eGVvxH68EALKDklvS91fb7d_IVz4/values";

export const SHEETS = {
  user: "usuarios",
  registros: "registros",
};

// Por default, una google key que solo funciona desde el dominio "fede.dm"
// para que ande en todos lados (o sea, para poder testear la herramienta) hay que tener un archivo
// .env solamente con la linea `REACT_APP_FEDE_KEY="<KEY>"` (pedirle la key a algun autor...)
// (si, por algun motivo la envvar tiene que empezar con `REACT_APP`)
export const KEY =
  process.env.REACT_APP_FEDE_KEY || "AIzaSyA9snz4CXDq_K8fJeUXkRtRZAQM90HTFp4";

// Dibuja un rombo
const drawFinDeCarrera = ({
  ctx,
  id,
  x,
  y,
  state: { selected, hover },
  style,
  label,
}: NodeType.DrawFinDeCarrera) => {
  let r = style.size;
  const drawNode = () => {
    if (selected || hover) {
      r += 3;
    }
    ctx.beginPath();
    const sides = 4;
    const a = (Math.PI * 2) / sides;
    ctx.moveTo(x, y + r);
    for (let i = 1; i < sides; i++) {
      ctx.lineTo(x + r * Math.sin(a * i), y + r * Math.cos(a * i));
    }
    ctx.closePath();
    ctx.save();

    ctx.fillStyle = style.color;
    ctx.strokeStyle = selected || hover ? "black" : "gray";
    ctx.lineWidth = selected || hover ? 3 : 2;
    ctx.globalAlpha = style.opacity;
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    ctx.textAlign = "center";
    const lines = label.split("\n");
    const lineheight = 13;
    let mid = lines.length / 2;
    let fontSize = 12;
    let maxLineWidth = 0;
    for (let i = 0; i < lines.length; i++) {
      if (ctx.measureText(lines[i]).width > maxLineWidth) {
        maxLineWidth = ctx.measureText(lines[i]).width;
      }
    }
    if (maxLineWidth > r * 1.5) {
      fontSize -= 1;
    }
    let boldness = selected || hover ? "bold" : "500";
    ctx.font = `${boldness} ${fontSize}px arial`;
    ctx.fillStyle = selected || hover ? "black" : "";
    for (let i = 0; i < lines.length; i++) {
      ctx.fillText(lines[i], x, y + (i + 0.5 - mid) * lineheight);
    }
  };
  return {
    drawNode,
  };
};

// Colores y formas de cada grupo
export const GRUPOS = {
  Aprobadas: { color: COLORS.aprobadas[400] },
  CBC: {
    shape: "hexagon",
    size: 30,
  },
  "*CBC": {
    color: COLORS.aprobadas[100],
    shape: "square",
    size: 15,
  },
  Habilitadas: { color: COLORS.habilitadas[400] },
  Cursando: { color: COLORS.cursando[400] },
  "En Final": { color: COLORS.enfinal[400] },
  "Materias Obligatorias": { color: COLORS.obligatorias[400] },
  "Materias Electivas": { color: COLORS.electivas[400] },
  "Fin de Carrera": {
    color: COLORS.findecarrera[400],
    label: "custom",
    shape: "custom",
    size: 60,
    ctxRenderer: drawFinDeCarrera,
  },
  "Fin de Carrera (Obligatorio)": {
    color: COLORS.findecarrera[400],
    label: "custom",
    shape: "custom",
    size: 60,
    ctxRenderer: drawFinDeCarrera,
  },
  ...CARRERAS.filter((c): c is UserType.Carrera & {orientaciones: UserType.Orientacion[]} => c.orientaciones !== undefined)
    .flatMap((c) => c.orientaciones)
    .reduce<{ [key: string]: UserType.Orientacion }>(function (map, obj) {
      obj.color = (COLORS[obj.colorScheme] as any)[500];
      map[obj.nombre] = obj;
      return map;
    }, {}),
};

// Muchas opciones de la network
// tiene buenas cosas para tunear y experimentar
export const GRAPHOPTIONS = {
  nodes: { shape: "box" },
  interaction: {
    hover: true,
  },
  physics: {
    // Fede del futuro: Deja de intentar hacer funcionar esto. No trae casi nada de valor al programa, y ya pasaste más de 5 noches intentándolo, sin resultado alguno.
    //   Si estas queriendo hacerlo andar, espero que este comentario te recuerde la realidad: no sirve de nada, y no te va a quedar lindo. Es un capricho, y no lo vale.
    // enabled: true
    enabled: false,
    hierarchicalRepulsion: {
      nodeDistance: 90,
    },
    stabilization: {
      iterations: 30,
      fit: true,
    },
  },
  layout: {
    hierarchical: {
      enabled: true,
      parentCentralization: false,
      blockShifting: false,
      edgeMinimization: false,
      direction: "LR",
    },
  },
  edges: {
    hoverWidth: 0,
    arrowStrikethrough: false,
    arrows: {
      to: { enabled: true, scaleFactor: 0.6, type: "arrow" },
    },
    color: { inherit: "from", opacity: 0.7 },
  },
  groups: { ...GRUPOS },
};

// Colores asignados a cada barrita de progreso de los creditos
export const CREDITOS = {
  CBC: {
    nombrecorto: "CBC",
    nombre: "Ciclo Básico Común",
    bg: COLORS.aprobadas[50],
    color: "aprobadas",
  },
  Obligatorias: {
    nombrecorto: "Obligatorias",
    nombre: "Materias Obligatorias",
    bg: COLORS.obligatorias[50],
    color: "obligatorias",
  },
  Electivas: {
    nombrecorto: "Electivas",
    nombre: "Materias Electivas",
    color: "electivas",
    bg: COLORS.electivas[50],
  },
  "Fin de Carrera": {
    nombrecorto: "Tesis/TPP",
    nombre: "Fin de Carrera",
    color: "findecarrera",
    bg: COLORS.findecarrera[50],
  },
};
