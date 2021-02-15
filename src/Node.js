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
    this.id = n.id;
    this.value = n.creditos;
    this.materia = n.materia;
    this.label = breakWords(n.materia);
    this.level = n.nivel;
    this.group = n.categoria;
    this.categoria = n.categoria;
    this.aprobada = false;
    this.nota = 0;
    this.habilitada = false;
    this.hidden =
      this.categoria !== "Materias Obligatorias" && this.categoria !== "CBC";
    Object.assign(this, { ...n });
  }

  aprobar(ctx) {
    const { network, nodes, getNode } = ctx;

    this.aprobada = true;
    this.group = this.getGrupo();
    nodes.update(this);
    const habilitadas = [];

    network.getConnectedNodes(this.id, "to").forEach((m) => {
      const nodem = getNode(m);
      if (nodem.isHabilitada(ctx)) {
        nodem.habilitada = true;
        nodem.group = nodem.getGrupo();
        habilitadas.push(nodem);
      }
    });
    nodes.update(habilitadas);
  }

  isHabilitada(ctx) {
    const { network, nodes } = ctx;

    const from = network.getConnectedNodes(this.id, "from");

    let todoAprobado = true;
    for (let i = 0; i < from.length; i++) {
      const m = nodes.get(from[i]);
      todoAprobado &= m.aprobada;
    }
    return todoAprobado;

    // this.group = this.getGrupo();
    // nodes.update(this);
  }

  desaprobar(ctx) {
    const { nodes } = ctx;
    this.aprobada = false;

    this.group = this.getGrupo();
    nodes.update(this);
  }

  deshabilitar() {
    this.habilitada = false;
  }

  getGrupo() {
    let grupoDefault = this.categoria;
    if (this.aprobada && this.nota >= 0) grupoDefault = "Aprobadas";
    else if (this.aprobada) grupoDefault = "En Final";
    else if (this.habilitada) grupoDefault = "Habilitadas";
    return grupoDefault;
  }
}

export default Node;
