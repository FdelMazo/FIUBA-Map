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

  return {
    carrera,
    changeCarrera,
    graph,
    key,
    toggleGroup,
    setGlobal,
    nodeFunctions,
  };
};

export default useGraph;
