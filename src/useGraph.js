import React, { useEffect } from "react";
import CARRERAS from "./carreras";
import Node from "./Node";

const graphObj = {
  nodes: [],
  edges: [],
  groups: [],
};

const globalObj = {
  nodes: null,
  edges: null,
  network: null,
};

const useGraph = () => {
  const [global, setGlobal] = React.useState(globalObj);
  const [graph, setGraph] = React.useState(graphObj);
  const [key, setKey] = React.useState(true);
  const [carrera, setCarrera] = React.useState(Object.values(CARRERAS)[0]);

  const changeCarrera = (id) => {
    setCarrera(CARRERAS[id]);
  };

  useEffect(() => {
    setKey(!key);
    const graphNodes = [];
    const graphEdges = [];
    carrera.graph.forEach((n) => {
      graphNodes.push(new Node(n));
      if (n.correlativas)
        n.correlativas.split("-").forEach((c) => {
          graphEdges.push({ from: c, to: n.id });
        });
      else graphEdges.push({ from: "CBC", to: n.id, hidden: true });
    });

    const groups = Array.from(new Set(carrera.graph.map((n) => n.categoria)));

    setGraph({ nodes: graphNodes, edges: graphEdges, groups });
  }, [carrera]); //eslint-disable-line

  const toggleGroup = (id) => {
    graph.nodes
      .filter((n) => n.categoria === id)
      .forEach((n) => {
        n.hidden = !n.hidden;
      });
    global.nodes.update(graph.nodes);
    global.network.fit();
  };

  const getNode = (id) => {
    return global.nodes.get(id).nodeRef;
  };

  const aprobarSinNota = (id) => {
    const node = getNode(id);
    node.aprobar({
      network: global.network,
      nodes: global.nodes,
      getNode,
    });
  };

  const nodeFunctions = {
    getNode,
    aprobarSinNota,
  };

  const eleccionFinDeCarrera = () => {
    return "tpp";
  };
  const eleccionOrientacion = () => {
    return "Gestion";
  };

  const getCreditos = () => {
    let creditos = [
      {
        nombre: "Materias Obligatorias",
        color: "blue",
        creditosNecesarios: carrera.creditos.obligatorias,
        creditos: 23,
      },
      {
        nombre: `Materias Electivas (eligiendo ${eleccionFinDeCarrera()})`,
        color: "purple",
        creditosNecesarios: carrera.creditos.electivas[eleccionFinDeCarrera()],
        creditos: 10,
      },
      {
        nombre: `Orientación: ${eleccionOrientacion()}`,
        color: "yellow",
        creditosNecesarios: carrera.creditos.orientacion,
        creditos: 55,
      },
      {
        nombre: `${eleccionFinDeCarrera()}`,
        color: "red",
        creditosNecesarios: 10,
        creditos: 10,
      },
    ];

    let total = 0;
    creditos.forEach((c) => (total += c.creditosNecesarios));
    creditos.forEach((c) => {
      c.proportion = Math.round((c.creditosNecesarios / total) * 10);
    });

    return creditos;
  };

  return {
    carrera,
    changeCarrera,
    graph,
    key,
    toggleGroup,
    setGlobal,
    nodeFunctions,
    getCreditos,
  };
};

export default useGraph;
