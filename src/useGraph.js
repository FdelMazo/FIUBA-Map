import React, { useEffect } from "react";
import CARRERAS from "./carreras";

const graphObj = {
  nodes: [],
  edges: [],
};

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
      nodes.push({ id: n.codigo, label: n.materia });
    });
    return { nodes, edges };
  };

  return { carrera, changeCarrera, graph, key };
};

export default useGraph;
