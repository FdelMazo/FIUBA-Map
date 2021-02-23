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
    this.nota = 0;
    this.habilitada = false;
    this.hidden =
      this.categoria !== "Materias Obligatorias" &&
      this.categoria !== "CBC" &&
      this.categoria !== "Fin de Carrera (Obligatorio)";
  }

  chequearNodosCred(ctx) {
    const { nodes, getNode } = ctx;
    const nodosCred = nodes.get({
      filter: (n) => n.requiere && !n.correlativas,
      fields: ["id"],
    });

    const totalCreditos = nodes
      .get({ filter: (n) => n.aprobada, fields: ["creditos"] })
      .reduce((acc, n) => {
        acc += n.creditos;
        return acc;
      }, 0);

    const res = [];
    nodosCred.forEach((n) => {
      const node = getNode(n.id);
      node.habilitada = totalCreditos >= node.requiere;
      node.group = node.getGrupo();
      res.push(node);
    });

    return res;
  }

  aprobar(ctx) {
    const { network, nodes, getNode, nota } = ctx;

    this.aprobada = true;
    if (nota) this.nota = nota;

    if (this.label.includes("[")) this.label = this.label.split("\n[")[0];
    if (nota > 0) this.label += "\n[" + this.nota + "]";
    if (nota === -1) {
      this.group = this.getGrupo();
      this.label += "\n[Final]";
      nodes.update(this);
      return;
    }

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

    nodes.update(habilitadas.concat(this.chequearNodosCred(ctx)));
  }

  isHabilitada(ctx) {
    const { network, nodes } = ctx;

    const from = network.getConnectedNodes(this.id, "from");

    let todoAprobado = true;
    for (let i = 0; i < from.length; i++) {
      const m = nodes.get(from[i]);
      todoAprobado &= m.aprobada;
    }
    const totalCreditos = nodes
      .get({ filter: (n) => n.aprobada, fields: ["creditos"] })
      .reduce((acc, n) => {
        acc += n.creditos;
        return acc;
      }, 0);

    if (this.requiere) todoAprobado &= totalCreditos >= this.requiere;
    return todoAprobado;
  }

  desaprobar(ctx) {
    const { network, nodes, getNode } = ctx;

    this.aprobada = false;
    this.nota = 0;
    if (this.label.includes("[")) this.label = this.label.split("\n[")[0];
    this.group = this.getGrupo();
    nodes.update(this);

    const deshabilitadas = [];

    network.getConnectedNodes(this.id, "to").forEach((m) => {
      const nodem = getNode(m);
      if (!nodem.isHabilitada(ctx)) {
        nodem.habilitada = false;
        nodem.group = nodem.getGrupo();
        deshabilitadas.push(nodem);
      }
    });

    nodes.update(deshabilitadas.concat(this.chequearNodosCred(ctx)));
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
