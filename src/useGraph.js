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
  clusters: [],
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
    const edges = [];
    carrera.graph.forEach((n) => {
      graphNodes.push(new Node(n));
      if (n.correlativas)
        n.correlativas.split("-").forEach((c) => {
          edges.push({ from: c, to: n.id });
        });
      else edges.push({ from: "CBC", to: n.id, hidden: true });
    });

    const electivas = {
      joinCondition: function (nodeOptions) {
        return nodeOptions.categoria === "Materias Electivas";
      },
      clusterNodeProperties: {
        id: "cluster-Materias Electivas",
        hidden: true,
        level: 20,
        allowSingleNodeCluster: true,
      },
    };
    electivas.toggle = (network) => {
      if (network.isCluster("cluster-Materias Electivas")) {
        network.openCluster("cluster-Materias Electivas");
      } else network.cluster(electivas);
    };

    const clusters = [electivas];

    setGraph({ nodes: graphNodes, edges, clusters });
  }, [carrera]); //eslint-disable-line

  return { carrera, changeCarrera, graph, options, key };
};

export default useGraph;
