import { COLORS } from "./theme";
import { promediar } from "./utils";

const FONT_AFUERA = ["CBC", "*CBC"]
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
    const { getters, getNode, creditos } = ctx;
    const from = getters.NodesFrom(this.id);
    let todoAprobado = true;
    for (let id of from) {
      const m = getNode(id);
      todoAprobado &= m.aprobada;
    }
    if (this.requiere) {
      if (this.requiereCBC) {
        todoAprobado &= creditos >= this.requiere;
      } else {
        todoAprobado &= (creditos - 38) >= this.requiere
      }
    };
    return todoAprobado;
  }

  actualizar(ctx) {
    const { user, showLabels, colorMode, getters } = ctx;
    let grupoDefault = this.categoria;
    if (this.aprobada && this.nota >= 0) grupoDefault = "Aprobadas";
    else if (this.nota === -1) grupoDefault = "En Final";
    else if (this.isHabilitada(ctx)) grupoDefault = "Habilitadas";
    this.group = grupoDefault;

    let labelDefault = breakWords(this.materia);
    if (showLabels && this.id !== "CBC") {
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
      const materiasCBC = getters.MateriasAprobadasCBC();
      const promedioCBC = promediar(materiasCBC)
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
