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
    this.id = n.codigo;
    this.label = breakWords(n.materia);
    this.value = n.creditos;
    this.category = n.categoria;
    this.level = n.nivel;
    this.requiere = n.requiere;
    this.aprobada = false;
    this.nota = 0;
    this.habilitada = false;
    this.group = n.categoria;
  }
}

export default Node;
