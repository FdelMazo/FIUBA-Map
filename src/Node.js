class Node {
  constructor(n) {
    this.label = n.materia;
    this.id = n.id;
    this.nodeRef = this;
    this.group = "A";
  }
  aprobar() {
    this.group = "B";
  }
}

export default Node;
