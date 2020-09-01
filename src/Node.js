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
    this.label = breakWords(n.materia);
    this.level = n.nivel;
    this.group = n.categoria;
    this.categoria = n.categoria;
    this.aprobada = false;
    this.nota = 0;
    this.habilitada = false;
  }

  onClick(args, ctx) {
    args.setDisplayedNode(this);
    if (this.aprobada) {
      this.desaprobar(args, ctx);
    } else {
      this.aprobar(args, ctx);
    }
  }

  aprobar(args, ctx) {
    const { network, nodeArr } = ctx;

    this.aprobada = true;
    this.actualizarGrupo(args, ctx);
    nodeArr.update(this);

    network.getConnectedNodes(this.id, "to").forEach((m) => {
      nodeArr.get(m).nodeRef.habilitar(args, ctx);
    });
  }

  hide(args, ctx) {
    const { network, nodeArr } = ctx;

    this.hidden = true;

    this.actualizarGrupo(args, ctx);
    nodeArr.update(this);
  }

  habilitar(args, ctx) {
    const { network, nodeArr } = ctx;

    const from = network.getConnectedNodes(this.id, "from");

    let todoAprobado = true;
    for (let i = 0; i < from.length; i++) {
      const m = nodeArr.get(from[i]);
      todoAprobado &= m.aprobada;
    }
    if (todoAprobado) this.habilitada = true;

    this.actualizarGrupo(args, ctx);
    nodeArr.update(this);
  }

  desaprobar(args, ctx) {
    const { nodeArr } = ctx;

    this.aprobada = false;

    this.actualizarGrupo(args, ctx);
    nodeArr.update(this);
  }

  deshabilitar() {
    this.habilitada = false;
  }

  actualizarGrupo(args, ctx) {
    const { nodeArr } = ctx;

    let grupoDefault = this.categoria;
    if (this.aprobada && this.nota >= 0) grupoDefault = "Aprobadas";
    else if (this.aprobada) grupoDefault = "En Final";
    else if (this.habilitada) grupoDefault = "Habilitadas";
    this.group = grupoDefault;

    nodeArr.update(this);
  }
}

export default Node;
