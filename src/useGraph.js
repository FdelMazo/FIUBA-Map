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
  const [orientacion, setOrientacion] = React.useState(null);
  const [finDeCarrera, setFinDeCarrera] = React.useState(null);

  useEffect(() => {
    setOrientacion(carrera.orientaciones?.[0].nombre);
    setFinDeCarrera(carrera.finDeCarrera?.[0].id);
  }, [carrera]);

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
    global.network.redraw();
    global.network.fit();
  };

  const getNode = (id) => {
    return global?.nodes?.get(id)?.nodeRef;
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

  const getCreditos = () => {
    let creditos = [];
    creditos.push({
      nombre: "Materias Obligatorias",
      color: "blue",
      creditosNecesarios: carrera.creditos.obligatorias,
      creditos: 1,
    });

    if (finDeCarrera || !isNaN(carrera.creditos.electivas))
      creditos.push({
        nombre: `Materias Electivas${
          finDeCarrera ? ` (eligiendo ${finDeCarrera})` : ""
        }`,
        color: "purple",
        creditosNecesarios: isNaN(carrera.creditos.electivas)
          ? carrera.creditos.electivas[finDeCarrera]
          : carrera.creditos.electivas,
        creditos: 1,
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
        creditos: 1,
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
            creditos: 1,
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
          creditos: 1,
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
    setOrientacion,
    finDeCarrera,
    setFinDeCarrera,
  };
};

export default useGraph;
