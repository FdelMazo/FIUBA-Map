/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import CARRERAS from "./carreras";
import Node from "./Node";

const graphObj = {
  nodes: [],
  edges: [],
  groups: [],
};

const useGraph = (loginHook) => {
  const [network, setNetwork] = React.useState(null);
  const [nodes, setNodes] = React.useState(null);
  const [edges, setEdges] = React.useState(null);
  const [graph, setGraph] = React.useState(graphObj);
  const [promedio, setPromedio] = React.useState(0);
  const [creditos, setCreditos] = React.useState([]);
  const [showLabels, setShowLabels] = React.useState(false);
  const [shouldLoadGraph, setShouldLoadGraph] = React.useState(false);
  const [autosave, setAutosave] = React.useState(false);
  const [loadingGraph, setLoadingGraph] = React.useState(false);
  const { user, setUser, logged, getGraph, postGraph } = loginHook;

  React.useEffect(() => {
    if (!nodes?.carrera || nodes.carrera !== user.carrera?.id) return;
    if (shouldLoadGraph) {
      setShouldLoadGraph(false);
      setLoadingGraph(true);
      getGraph(user.padron, user.carrera.id)
        .then((metadata) => {
          metadata.materias.forEach((m) => {
            if (m.nota > 0) aprobar(m.id, m.nota);
            else if (m.nota === -1) {
              ponerEnFinal(m.id);
            }
          });
          if (metadata.checkboxes)
            metadata.checkboxes.forEach((c) => toggleCheckbox(c));
          setLoadingGraph(false);
        })
        .catch(() => setLoadingGraph(false));
    }
  }, [shouldLoadGraph]);

  React.useEffect(() => {
    setShowLabels(logged);
    if (!nodes) return;
    const conNota = nodes.get({
      filter: (n) => n.nota !== 0,
    });
    conNota.forEach((n) => {
      getNode(n.id).showLabel({ nodes, showLabel: logged });
    });

    if (logged) setShouldLoadGraph(true);
  }, [logged]);

  const changeCarrera = async (id) => {
    setUser(({ ...rest }) => {
      const carrera = CARRERAS.find((c) => c.id === id);

      const userdata = user.allLogins.find((l) => l.carreraid === id);
      setShouldLoadGraph(!!userdata);
      const orientacion = carrera.orientaciones?.find(
        (c) => c.nombre === userdata?.orientacionid
      );
      const finDeCarrera = carrera.finDeCarrera?.find(
        (c) => c.id === userdata?.findecarreraid
      );

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
      return { ...rest, carrera, orientacion, finDeCarrera };
    });
  };
  const changeOrientacion = (id) => {
    const orientacion = user.carrera.orientaciones.find((c) => c.nombre === id);
    setUser({ ...user, orientacion });
  };
  const changeFinDeCarrera = (id) => {
    const finDeCarrera = user.carrera.finDeCarrera.find((c) => c.id === id);
    setUser({ ...user, finDeCarrera });
  };

  React.useEffect(() => {
    if (user.carrera) changeCarrera(user.carrera.id);
  }, [user.carrera]);

  React.useEffect(() => {
    if (!nodes?.carrera || nodes.carrera !== user.carrera?.id) return;
    aprobar("CBC", 0);
    if (user.orientacion) changeOrientacion(user.orientacion.nombre);
    if (user.finDeCarrera) {
      changeFinDeCarrera(user.finDeCarrera.id);
      user.carrera.finDeCarrera.forEach((f) => {
        const n = getNode(f.materia);
        n.hidden = !(f.id === user.finDeCarrera.id);
        nodes.update(n);
      });
    }
    keepFinDeCarreraOnLastLevel();
  }, [nodes, user.finDeCarrera, user.orientacion]);

  // React.useEffect(() => {
  //   if (user.padron) saveGraph();
  // }, [user.padron]);

  const keepFinDeCarreraOnLastLevel = () => {
    const lastLevel = Math.max(
      ...nodes
        .get({
          filter: (n) =>
            !n.hidden &&
            n.categoria !== "Fin de Carrera" &&
            n.categoria !== "Fin de Carrera (Obligatorio)",
          fields: ["level"],
          type: { level: "number" },
        })
        .map((n) => n.level)
    );

    const nodesFinDeCarrera = nodes.get({
      filter: (n) =>
        n.categoria === "Fin de Carrera" ||
        n.categoria === "Fin de Carrera (Obligatorio)",
    });
    nodesFinDeCarrera.forEach((n) => {
      n.level = lastLevel + 1;
      nodes.update(n);
    });
  };

  const toggleGroup = (id) => {
    const group = graph.nodes.filter((n) => n.categoria === id);
    group.forEach((n) => {
      n.hidden = !n.hidden;
    });

    nodes.update(group);
    keepFinDeCarreraOnLastLevel();
    network.fit();
  };

  const getNode = (id) => {
    return nodes?.get(id)?.nodeRef;
  };

  const ponerEnFinal = (id) => {
    desaprobar(id);
    aprobar(id, -1);
  };

  const actualizarMetadata = () => {
    if (autosave) saveGraph();
    keepFinDeCarreraOnLastLevel();
    setPromedio(getPromedio());
    setCreditos(getCreditos());
  };

  const aprobar = (id, nota) => {
    const node = getNode(id);

    node.aprobar({
      network: network,
      nodes: nodes,
      getNode,
      nota,
      showLabels,
    });

    actualizarMetadata();
  };

  const desaprobar = (id) => {
    const node = getNode(id);

    node.desaprobar({
      network: network,
      nodes: nodes,
      getNode,
    });

    actualizarMetadata();
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

  const isGroupHidden = (id) => {
    return nodes.get({ filter: (c) => c.group === id, fields: ["hidden"] })[0]
      .hidden;
  };

  const getCreditos = () => {
    let creditos = [];
    const accumulator = (acc, node) => {
      acc += node.creditos;
      return acc;
    };

    creditos.push({
      nombre: "Materias Obligatorias",
      bg: "LightSkyBlue",
      color: "blue",
      creditosNecesarios: user.carrera.creditos.obligatorias,
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
        user.finDeCarrera ? ` (eligiendo ${user.finDeCarrera.id})` : ""
      }`,
      color: "purple",
      bg: "Thistle",
      creditosNecesarios: isNaN(user.carrera.creditos.electivas)
        ? user.carrera.creditos.electivas[user.finDeCarrera?.id]
        : user.carrera.creditos.electivas,

      creditos: nodes
        .get({
          filter: (n) =>
            n.categoria !== "CBC" &&
            n.categoria !== "Materias Obligatorias" &&
            n.categoria !== "Fin de Carrera" &&
            n.categoria !== "Fin de Carrera (Obligatorio)" &&
            n.categoria !== user.orientacion?.nombre &&
            n.aprobada &&
            n.nota > 0,
          fields: ["creditos"],
        })
        .reduce(accumulator, 0),
    });

    if (
      user.carrera.eligeOrientaciones &&
      user.orientacion &&
      user.carrera.creditos.orientacion[user.finDeCarrera?.id]
    )
      creditos.push({
        nombre: `Orientación: ${user.orientacion.nombre}`,
        color: "yellow",
        bg: "LemonChiffon",
        creditosNecesarios:
          user.carrera.creditos.orientacion[user.finDeCarrera.id],
        creditos: nodes
          .get({
            filter: (n) =>
              n.categoria === user.orientacion.nombre &&
              n.aprobada &&
              n.nota > 0,
            fields: ["creditos"],
          })
          .reduce(accumulator, 0),
      });

    if (user.carrera.creditos.checkbox) {
      user.carrera.creditos.checkbox.forEach((m) => {
        creditos.push({
          nombre: `${m.nombre}`,
          color: m.color,
          bg: m.bg,
          creditosNecesarios: 8,
          creditos: m.check ? 8 : 0,
          checkbox: true,
          check: m.check,
        });
      });
    }

    if (user.carrera.creditos.materias)
      user.carrera.creditos.materias.forEach((m) => {
        const node = getNode(m.id);
        if (node)
          creditos.push({
            nombre: `${node.materia}`,
            color: m.color,
            bg: m.bg,
            creditosNecesarios: node.creditos,
            creditos: node.aprobada ? node.creditos : 0,
          });
      });

    if (user.finDeCarrera) {
      const node = getNode(user.finDeCarrera.materia);
      if (node && node.creditos)
        creditos.push({
          nombre: `${node.materia}`,
          color: "red",
          bg: "LightCoral",
          creditosNecesarios: node.creditos,
          creditos: node.aprobada ? node.creditos : 0,
          getCreditos,
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

  React.useEffect(() => {
    changeCarrera(CARRERAS[0].id);
  }, []);

  const toggleCheckbox = (c) => {
    const value = !!user.carrera.creditos.checkbox.find(
      (ch) => ch.nombre === c.nombre
    ).check;
    user.carrera.creditos.checkbox.find(
      (ch) => ch.nombre === c.nombre
    ).check = !value;
  };

  const saveGraph = () => {
    postGraph(nodes, user.carrera.creditos.checkbox);
  };

  return {
    graph,
    toggleGroup,
    getNode,
    ponerEnFinal,
    aprobar,
    desaprobar,
    redraw,
    promedio,
    creditos,
    network,
    setNetwork,
    nodes,
    setNodes,
    saveGraph,
    edges,
    setAutosave,
    setEdges,
    changeCarrera,
    changeOrientacion,
    changeFinDeCarrera,
    toggleCheckbox,
    actualizarMetadata,
    loadingGraph,
    isGroupHidden,
  };
};

export default useGraph;
