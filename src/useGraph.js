import React, { useEffect } from "react";
import CARRERAS from "./carreras";
import Node from "./Node";

const options = {
  nodes: { shape: "box" },
  interaction: {
    hover: true,
  },
  layout: {
    hierarchical: { enabled: true, direction: "LR", levelSeparation: 150 },
  },
  edges: { arrows: { to: { enabled: true, scaleFactor: 0.7, type: "arrow" } } },
};

const graphObj = {
  nodes: [],
  edges: [],
};

const useGraph = () => {
  const [graph, setGraph] = React.useState(graphObj);
  const [globalNodes, setGlobalNodes] = React.useState({});
  const [carrera, setCarrera] = React.useState(Object.values(CARRERAS)[0]);
  const [key, setKey] = React.useState(true);

  const events = {
    select: (e) => console.log(globalNodes),
  };

  const changeCarrera = (id) => {
    setCarrera(CARRERAS[id]);
  };

  useEffect(() => {
    setKey(!key);
    const nodes = [];
    const edges = [];
    const globalNodes = {};
    carrera.graph.forEach((n) => {
      const node = new Node(n);
      nodes.push(node);
      globalNodes[n.codigo] = node;
      if (n.correlativas)
        n.correlativas.split("-").forEach((c) => {
          edges.push({ from: c, to: n.codigo });
        });
      else edges.push({ from: "CBC", to: n.codigo, hidden: true });
    });

    setGraph({ nodes, edges });
    setGlobalNodes(globalNodes);
  }, [carrera]);

  return { carrera, changeCarrera, graph, key, options, events };
};

export default useGraph;
