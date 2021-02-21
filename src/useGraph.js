import React, { useEffect } from "react";
import CARRERAS from "./carreras";
import Node from "./Node";

const graphObj = {
  nodes: [],
  edges: [],
  groups: [],
};

const useGraph = () => {
  const [network, setNetwork] = React.useState(null);
  const [nodes, setNodes] = React.useState(null);
  const [edges, setEdges] = React.useState(null);
  const [graph, setGraph] = React.useState(graphObj);
  const [key, setKey] = React.useState(true);
  const [carrera, setCarrera] = React.useState(CARRERAS[0]);
  const [orientacion, setOrientacion] = React.useState(null);
  const [finDeCarrera, setFinDeCarrera] = React.useState(null);
  const [promedio, setPromedio] = React.useState(0);
  const [creditos, setCreditos] = React.useState([]);
  const [ticker, setTicker] = React.useState(false);

  useEffect(() => {
    if (!nodes) return;
    setTimeout(() => {
      setPromedio(getPromedio());
      setCreditos(getCreditos());
    }, 500);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ticker, nodes]);

  useEffect(() => {
    if (!finDeCarrera) return;
    carrera.finDeCarrera.forEach((f) => {
      const n = getNode(f.materia);
      n.hidden = !(f.id === finDeCarrera);
      nodes.update(n);
    });
    keepFinDeCarreraOnLastLevel();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finDeCarrera]);

  const changeCarrera = (id) => {
    setCarrera(CARRERAS.find((c) => c.id === id));
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
      if (n.requiere)
        graphEdges.push({ from: "CBC", to: n.id, color: "transparent" });
    });

    const groups = Array.from(new Set(carrera.graph.map((n) => n.categoria)));

    setGraph({ nodes: graphNodes, edges: graphEdges, groups });
  }, [carrera]); //eslint-disable-line

  const keepFinDeCarreraOnLastLevel = () => {
    if (!finDeCarrera) return;

    const lastLevel = Math.max(
      ...nodes
        .get({
          filter: (n) => !n.hidden && n.categoria !== "Fin de Carrera",
          fields: ["level"],
          type: { level: "number" },
        })
        .map((n) => n.level)
    );

    const f = carrera.finDeCarrera.find((f) => f.id === finDeCarrera);
    const n = nodes.get(f.materia);
    n.level = lastLevel + 1;
    nodes.update(n);
  };

  const toggleGroup = (id) => {
    graph.nodes
      .filter((n) => n.categoria === id)
      .forEach((n) => {
        n.hidden = !n.hidden;
      });

    nodes.update(graph.nodes);
    network.setOptions({
      physics: {
        stabilization: {
          fit: true,
        },
      },
    });
    network.stabilize();
    keepFinDeCarreraOnLastLevel();
  };

  const getNode = (id) => {
    return nodes?.get(id)?.nodeRef;
  };

  const ponerEnFinal = (id) => {
    desaprobar(id);
    aprobar(id, -1);
  };

  const aprobar = (id, nota) => {
    const node = getNode(id);

    network.setOptions({
      physics: {
        stabilization: {
          fit: false,
        },
      },
    });
    node.aprobar({
      network: network,
      nodes: nodes,
      getNode,
      nota,
    });

    network.stabilize();
    setTicker(!ticker);
  };

  const desaprobar = (id) => {
    const node = getNode(id);

    network.setOptions({
      physics: {
        stabilization: {
          fit: false,
        },
      },
    });
    node.desaprobar({
      network: network,
      nodes: nodes,
      getNode,
    });

    network.stabilize();
    setTicker(!ticker);
  };

  const getPromedio = () => {
    const materias = nodes.get({
      filter: (n) => n.aprobada && n.nota > 0,
      fields: ["nota"],
    });

    const sum = materias.reduce((acc, node) => {
      acc += node.nota;
      return acc;
    }, 0);

    return sum ? (sum / materias.length).toFixed(2) : 0;
  };

  const getCreditos = () => {
    let creditos = [];
    const accumulator = (acc, node) => {
      acc += node.creditos;
      return acc;
    };

    creditos.push({
      nombre: "Materias Obligatorias",
      color: "blue",
      creditosNecesarios: carrera.creditos.obligatorias,
      creditos: nodes
        .get({
          filter: (n) =>
            n.categoria === "Materias Obligatorias" && n.aprobada && n.nota > 0,
          fields: ["creditos"],
        })
        .reduce(accumulator, 0),
    });

    creditos.push({
      nombre: `Materias Electivas${
        finDeCarrera ? ` (eligiendo ${finDeCarrera})` : ""
      }`,
      color: "purple",
      creditosNecesarios: isNaN(carrera.creditos.electivas)
        ? carrera.creditos.electivas[finDeCarrera]
        : carrera.creditos.electivas,

      creditos: nodes
        .get({
          filter: (n) =>
            n.categoria !== "CBC" &&
            n.categoria !== "Materias Obligatorias" &&
            n.categoria !== "Fin de Carrera" &&
            n.categoria !== orientacion &&
            n.aprobada &&
            n.nota > 0,
          fields: ["creditos"],
        })
        .reduce(accumulator, 0),
    });

    if (
      carrera.eligeOrientaciones &&
      orientacion &&
      carrera.creditos.orientacion[finDeCarrera]
    )
      creditos.push({
        nombre: `Orientación: ${orientacion}`,
        color: "yellow",
        creditosNecesarios: carrera.creditos.orientacion[finDeCarrera],
        creditos: nodes
          .get({
            filter: (n) =>
              n.categoria === orientacion && n.aprobada && n.nota > 0,
            fields: ["creditos"],
          })
          .reduce(accumulator, 0),
      });

    if (carrera.creditos.checkbox) {
      carrera.creditos.checkbox.forEach((m) => {
        creditos.push({
          nombre: `${m.nombre}`,
          color: m.color,
          creditosNecesarios: 8,
          creditos: 1,
          checkbox: true,
          check: false,
        });
      });
    }

    if (carrera.creditos.materias)
      carrera.creditos.materias.forEach((m) => {
        const node = getNode(m.id);
        if (node)
          creditos.push({
            nombre: `${node.materia}`,
            color: m.color,
            creditosNecesarios: node.creditos,
            creditos: node.aprobada ? node.creditos : 0,
          });
      });

    if (finDeCarrera && carrera.finDeCarrera) {
      const nodeId = carrera.finDeCarrera.find((c) => c.id === finDeCarrera)
        .materia;
      const node = getNode(nodeId);
      if (node && node.creditos)
        creditos.push({
          nombre: `${node.materia}`,
          color: "red",
          creditosNecesarios: node.creditos,
          creditos: node.aprobada ? node.creditos : 0,
        });
    }

    const totalNecesarios = creditos.reduce((acc, grupo) => {
      acc += grupo.creditosNecesarios;
      return acc;
    }, 0);

    creditos.forEach((c) => {
      c.proportion =
        Math.round((c.creditosNecesarios / totalNecesarios) * 10) || 1;
    });

    const fullProportion = creditos.reduce((acc, grupo) => {
      acc += grupo.proportion;
      return acc;
    }, 0);

    if (fullProportion > 10) creditos[0].proportion -= fullProportion - 10;
    else if (fullProportion < 10) creditos[0].proportion += 10 - fullProportion;

    return creditos;
  };

  const redraw = () => {
    if (network) network.redraw();
  };

  return {
    carrera,
    changeCarrera,
    graph,
    key,
    toggleGroup,
    getNode,
    ponerEnFinal,
    aprobar,
    desaprobar,
    getCreditos,
    redraw,
    orientacion,
    promedio,
    creditos,
    setOrientacion,
    finDeCarrera,
    setFinDeCarrera,
    network,
    setNetwork,
    nodes,
    setNodes,
    edges,
    setEdges,
  };
};

export default useGraph;
