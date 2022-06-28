import { COLORS } from "./theme";

const FONT_AFUERA = ["CBC", "*CBC", "Fin de Carrera", "Fin de Carrera (Obligatorio)"]
const ALWAYS_SHOW = ["Materias Obligatorias", "CBC", "Fin de Carrera (Obligatorio)"]

function breakWords(string) {
  let broken = "";
  string.split(" ").forEach((element) => {
    if (element.length < 5) broken += " " + element;
    else broken += "\n" + element;
  });
  return broken.trim();
}

class Node {
  constructor(n) {
    this.nodeRef = this;
    Object.assign(this, { ...n });
    this.label = breakWords(n.materia);
    this.group = this.categoria;
    this.aprobada = false;
    this.nota = -2;
    this.title =
      this.title ||
      (this.creditos
        ? `[${this.id}] ${this.materia}\n- Otorga ${this.creditos} créditos${
            this.requiere ? "\n- Requiere " + this.requiere + " créditos" : ""
          }`
        : `[${this.id}] ${this.materia}`);
    this.cuatrimestre = undefined;
    this.originalLevel = this.level;
    this.level = this.level ?? -3
    this.hidden = !ALWAYS_SHOW.includes(this.categoria)
  }

  aprobar(nota) {
    if (nota < -1) return;
    this.aprobada = nota > -1 ? true : false;
    this.nota = nota;
    return this;
  }

  desaprobar() {
    this.aprobada = false;
    this.nota = -2;
    return this;
  }

  cursando(cuatri) {
    this.cuatrimestre = cuatri;
    return this;
  }

  isHabilitada(ctx) {
    const { network, nodes, getNode, optativas } = ctx;

    const from = network.getConnectedNodes(this.id, "from");
    const totalCreditos =
      nodes
        .get({
          filter: (n) => n.aprobada || n.categoria === "*CBC",
          fields: ["creditos"],
        })
        .reduce((acc, n) => {
          acc += n.creditos;
          return acc;
        }, 0) +
      optativas.reduce((acc, n) => {
        acc += n.creditos;
        return acc;
      }, 0);

    let todoAprobado = true;
    for (let i = 0; i < from.length; i++) {
      const m = getNode(from[i]);
      todoAprobado &= m.aprobada;
    }
    if (this.requiere) todoAprobado &= totalCreditos >= this.requiere;
    return todoAprobado;
  }

  actualizar(ctx) {
    const { user, showLabels, nodes, colorMode } = ctx;
    let grupoDefault = this.categoria;
    if (this.aprobada && this.nota >= 0) grupoDefault = "Aprobadas";
    else if (this.nota === -1) grupoDefault = "En Final";
    else if (this.isHabilitada(ctx)) grupoDefault = "Habilitadas";
    this.group = grupoDefault;

    let labelDefault = breakWords(this.materia);
    if (showLabels) {
      if (this.aprobada && this.nota > 0)
        labelDefault += "\n[" + this.nota + "]";
      else if (this.aprobada && this.nota === 0)
        labelDefault += "\n[Equivalencia]";
      else if (this.nota === -1) labelDefault += "\n[En Final]";
    }
    this.label = labelDefault;

    if (this.categoria === "*CBC") {
      if (this.group === "Habilitadas") this.color = COLORS.aprobadas[100];
      if (this.group === "Aprobadas") this.color = COLORS.aprobadas[400];
    }

    if (this.categoria === "CBC") {
      const materiasCBC = nodes.get({
        filter: (n) => n.categoria === "*CBC" && n.aprobada && n.nota > 0,
        fields: ["nota"],
      });
      const sumCBC = materiasCBC.reduce((acc, node) => {
        acc += node.nota;
        return acc;
      }, 0);

      const promedioCBC = sumCBC ? (sumCBC / materiasCBC.length).toFixed(2) : 0;

      this.label = breakWords("Ciclo Básico Común");
      if (showLabels && promedioCBC) this.label += "\n[" + promedioCBC + "]";
      if (materiasCBC.length === 6) this.color = COLORS.aprobadas[400];
      else this.color = COLORS.aprobadas[100];
    }

    if (this.categoria === "Fin de Carrera") {
      this.hidden = !(this.id === user.finDeCarrera?.materia);
    }

    if (FONT_AFUERA.includes(this.categoria)) {
      this.font = { color: colorMode === "dark" ? "white" : "black" };
    }

    return this;
  }
}

export default Node;
