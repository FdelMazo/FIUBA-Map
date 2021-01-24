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
  }

  aprobar(ctx) {
    const { network, nodes, getNode } = ctx;

    this.aprobada = true;
    this.actualizarGrupo(ctx);
    nodes.update(this);

    network.getConnectedNodes(this.id, "to").forEach((m) => {
      getNode(m).habilitar(ctx);
    });
  }

  habilitar(ctx) {
    const { network, nodes } = ctx;

    const from = network.getConnectedNodes(this.id, "from");

    let todoAprobado = true;
    for (let i = 0; i < from.length; i++) {
      const m = nodes.get(from[i]);
      todoAprobado &= m.aprobada;
    }
    if (todoAprobado) this.habilitada = true;

    this.actualizarGrupo(ctx);
    nodes.update(this);
  }

  desaprobar(ctx) {
    const { nodes } = ctx;
    this.aprobada = false;

    this.actualizarGrupo(ctx);
    nodes.update(this);
  }

  deshabilitar() {
    this.habilitada = false;
  }

  actualizarGrupo(ctx) {
    const { nodes } = ctx;

    let grupoDefault = this.categoria;
    if (this.aprobada && this.nota >= 0) grupoDefault = "Aprobadas";
    else if (this.aprobada) grupoDefault = "En Final";
    else if (this.habilitada) grupoDefault = "Habilitadas";
    this.group = grupoDefault;

    nodes.update(this);
  }
}

export default Node;
