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
  const [carrera, setCarrera] = React.useState(CARRERAS[0]);
  const [orientacion, setOrientacion] = React.useState(null);
  const [finDeCarrera, setFinDeCarrera] = React.useState(null);
  const [promedio, setPromedio] = React.useState(0);
  const [creditos, setCreditos] = React.useState([]);
  const [ticker, setTicker] = React.useState(false);

  useEffect(() => {
    setTimeout(() => {
      setPromedio(getPromedio());
      setCreditos(getCreditos());
    }, 500);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ticker]);

  useEffect(() => {
    if (!finDeCarrera) return;
    carrera.finDeCarrera.forEach((f) => {
      const n = getNode(f.materia);
      n.hidden = !(f.id === finDeCarrera);
      global.nodes.update(n);
    });
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
    const l = Math.max(
      ...graph.nodes
        .filter((n) => !n.hidden && n.categoria !== "Fin de Carrera")
        .map((n) => n.level)
    );
    const f = carrera.finDeCarrera.find((f) => f.id === finDeCarrera);
    const n = getNode(f.materia);
    n.level = l + 1;
    global.nodes.update(n);
  };

  const toggleGroup = (id) => {
    graph.nodes
      .filter((n) => n.categoria === id)
      .forEach((n) => {
        n.hidden = !n.hidden;
      });

    global.nodes.update(graph.nodes);
    global.network.setOptions({
      physics: {
        stabilization: {
          iterations: 1000,
          fit: true,
        },
      },
    });
    global.network.stabilize();
    keepFinDeCarreraOnLastLevel();
  };

  const getNode = (id) => {
    return global?.nodes?.get(id)?.nodeRef;
  };

  const ponerEnFinal = (id) => {
    desaprobar(id);
    aprobar(id, -1);
  };

  const aprobar = (id, nota) => {
    setTicker(!ticker);
    const node = getNode(id);

    global.network.setOptions({
      physics: {
        stabilization: {
          iterations: 1000,
          fit: false,
        },
      },
    });
    node.aprobar({
      network: global.network,
      nodes: global.nodes,
      getNode,
      nota,
    });

    global.network.stabilize();
  };

  const desaprobar = (id) => {
    setTicker(!ticker);
    const node = getNode(id);

    global.network.setOptions({
      physics: {
        stabilization: {
          iterations: 1000,
          fit: false,
        },
      },
    });
    node.desaprobar({
      network: global.network,
      nodes: global.nodes,
      getNode,
    });

    global.network.stabilize();
  };

  const nodeFunctions = {
    getNode,
    ponerEnFinal,
    aprobar,
    desaprobar,
  };

  const getPromedio = () => {
    const materias = graph.nodes.filter((n) => n.aprobada && n.nota > 0);

    const sum = materias.reduce((acc, node) => {
      acc += node.nota;
      return acc;
    }, 0);

    return sum ? (sum / materias.length).toFixed(2) : 0;
  };

  const getCreditos = () => {
    let creditos = [];
    creditos.push({
      nombre: "Materias Obligatorias",
      color: "blue",
      creditosNecesarios: carrera.creditos.obligatorias,
      creditos: graph.nodes
        .filter((n) => n.categoria === "Materias Obligatorias")
        .filter((n) => n.aprobada && n.nota > 0)
        .reduce((acc, node) => {
          acc += node.creditos;
          return acc;
        }, 0),
    });

    creditos.push({
      nombre: `Materias Electivas${
        finDeCarrera ? ` (eligiendo ${finDeCarrera})` : ""
      }`,
      color: "purple",
      creditosNecesarios: isNaN(carrera.creditos.electivas)
        ? carrera.creditos.electivas[finDeCarrera]
        : carrera.creditos.electivas,
      creditos: graph.nodes
        .filter(
          (n) =>
            n.categoria !== "CBC" &&
            n.categoria !== "Materias Obligatorias" &&
            n.categoria !== "Fin de Carrera"
        )
        .filter((n) => n.categoria !== orientacion)
        .filter((n) => n.aprobada && n.nota > 0)
        .reduce((acc, node) => {
          acc += node.creditos;
          return acc;
        }, 0),
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
        creditos: graph.nodes
          .filter((n) => n.categoria === orientacion)
          .filter((n) => n.aprobada && n.nota > 0)
          .reduce((acc, node) => {
            acc += node.creditos;
            return acc;
          }, 0),
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

    let total = 0;
    creditos.forEach((c) => (total += c.creditosNecesarios));
    creditos.forEach((c) => {
      c.proportion = Math.round((c.creditosNecesarios / total) * 10) || 1;
    });

    let fullProportion = 0;
    creditos.forEach((c) => {
      fullProportion += c.proportion;
    });
    if (fullProportion > 10) creditos[0].proportion -= fullProportion - 10;
    else if (fullProportion < 10) creditos[0].proportion += 10 - fullProportion;

    return creditos;
  };

  const redraw = () => {
    if (global && global.network) global.network.redraw();
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
    redraw,
    orientacion,
    desaprobar,
    promedio,
    creditos,
    setOrientacion,
    finDeCarrera,
    setFinDeCarrera,
  };
};

export default useGraph;
