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
  const [carrera, setCarrera] = React.useState(Object.values(CARRERAS)[0]);
  const changeCarrera = (id) => {
    setCarrera(CARRERAS[id]);
  };

  useEffect(() => {
    const graphNodes = [];
    const edges = [];
    carrera.graph.forEach((n) => {
      graphNodes.push(new Node(n));
      if (n.correlativas)
        n.correlativas.split("-").forEach((c) => {
          edges.push({ from: c, to: n.codigo });
        });
      else edges.push({ from: "CBC", to: n.codigo, hidden: true });
    });

    setGraph({ nodes: graphNodes, edges });
  }, [carrera]);

  return { carrera, changeCarrera, graph, options };
};

export default useGraph;
