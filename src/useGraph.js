import React, { useEffect } from "react";
import CARRERAS from "./carreras";
import Node from "./Node";
import * as C from "./constants";

const options = {
  nodes: { shape: "box" },
  interaction: {
    hover: true,
  },
  layout: {
    hierarchical: { enabled: true, direction: "LR", levelSeparation: 150 },
  },
  edges: { arrows: { to: { enabled: true, scaleFactor: 0.7, type: "arrow" } } },
  groups: { ...C.GRUPOS },
};

const graphObj = {
  nodes: [],
  edges: [],
  groups: [],
};

const useGraph = () => {
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

  const toggleGroup = (id, nodeArr, nodes, toggle) => {
    if (!nodes) return;
    nodeArr
      .filter((n) => n.categoria == id)
      .forEach((n) => {
        if (toggle != undefined) {
          n.hidden = toggle;
        } else {
          n.hidden = !n.hidden;
        }
      });
    nodes.update(nodeArr);
  };

  const isGroupHidden = (id, nodesArr) => {
    return nodesArr.find((n) => n.categoria == id).hidden
  }

  return { carrera, changeCarrera, graph, options, key, toggleGroup, isGroupHidden };
};

export default useGraph;
