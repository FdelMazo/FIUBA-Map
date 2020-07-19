import React, { useEffect } from "react";
import CARRERAS from "./carreras";

const options = {
  nodes: { shape: "box" },
  layout: {
    hierarchical: { enabled: true, direction: "LR", levelSeparation: 150 },
  },
  edges: { arrows: { to: { enabled: true, scaleFactor: 0.7, type: "arrow" } } },
};

const graphObj = {
  nodes: [],
  edges: [],
};

function breakWords(string) {
  let broken = "";
  string.split(" ").forEach((element) => {
    if (element.length < 5) broken += " " + element;
    else broken += "\n" + element;
  });
  return broken.trim();
}

const useGraph = () => {
  const [graph, setGraph] = React.useState(graphObj);
  const [carrera, setCarrera] = React.useState(Object.values(CARRERAS)[0]);
  const [key, setKey] = React.useState(true);

  const changeCarrera = (id) => {
    setCarrera(CARRERAS[id]);
  };

  useEffect(() => {
    setKey(!key);
    const { nodes, edges } = initGraph(carrera.graph);
    setGraph({ nodes, edges });
  }, [carrera]);

  const initGraph = (graph) => {
    const nodes = [];
    const edges = [];
    graph.forEach((n) => {
      nodes.push({ id: n.codigo, label: breakWords(n.materia) });
      if (n.correlativas)
        n.correlativas.split("-").forEach((c) => {
          edges.push({ from: c, to: n.codigo });
        });
      else edges.push({ from: "CBC", to: n.codigo, hidden: true });
    });
    return { nodes, edges };
  };

  return { carrera, changeCarrera, graph, key, options };
};

export default useGraph;
