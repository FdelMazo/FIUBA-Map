/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import CARRERAS from "./carreras";
import Node from "./Node";
import { COLORS } from "./theme";

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
  const [firstTime, setFirstTime] = React.useState(true);
  const { user, setUser, register, logged, getGraph, postGraph } = loginHook;

  React.useEffect(() => {
    if (!logged) changeCarrera(CARRERAS[0].id);
    else {
      changeCarrera(user.carrera.id);
    }
  }, [logged]);

  React.useEffect(() => {
    if (logged && !firstTime) register();
  }, [user.carrera, user.orientacion, user.finDeCarrera]);

  React.useEffect(() => {
    if (!nodes?.carrera || nodes.carrera !== user.carrera?.id) return;
    if (shouldLoadGraph) {
      setShouldLoadGraph(false);
      setLoadingGraph(true);
      getGraph(user.padron, user.carrera.id)
        .then((metadata) => {
          if (metadata.materias)
            metadata.materias.forEach((m) => {
              if (m.nota >= 0) aprobar(m.id, m.nota);
              else if (m.nota === -1) {
                ponerEnFinal(m.id);
              } else if (m.cuatri >= 0) {
                cursando(m.id, m.cuatri);
              }
            });
          if (metadata.checkboxes)
            metadata.checkboxes.forEach((c) => toggleCheckbox(c));
          if (user.orientacion) toggleGroup(user.orientacion.nombre);
          if (electivasStatus() === "hidden") toggleElectivas();
          setLoadingGraph(false);
        })
        .catch((e) => {
          setLoadingGraph(false);
        });
    }
  }, [shouldLoadGraph, nodes]);

  React.useEffect(() => {
    setShowLabels(logged);
    if (!nodes) return;
    const conNota = nodes.get({
      filter: (n) => n.nota !== 0,
    });
    conNota.forEach((n) => {
      getNode(n.id).showLabel({ nodes, showLabel: logged });
    });
  }, [logged]);

  const saveGraph = () => {
    postGraph(nodes, user.carrera.creditos.checkbox);
  };
  const changeCarrera = async (id) => {
    setUser(({ ...rest }) => {
      const carrera = CARRERAS.find((c) => c.id === id);

      const userdata = logged
        ? user.allLogins.find((l) => l.carreraid === id)
        : false;
      setShouldLoadGraph(!!userdata);
      const orientacion =
        carrera.orientaciones?.find(
          (c) => c.nombre === userdata?.orientacionid
        ) || null;
      const finDeCarrera =
        carrera.finDeCarrera?.find((c) => c.id === userdata?.findecarreraid) ||
        null;

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
    const finDeCarrera =
      user.carrera.finDeCarrera.find((c) => c.id === id) || null;
    setUser({ ...user, finDeCarrera });
  };

  React.useEffect(() => {
    if (!nodes?.carrera || nodes.carrera !== user.carrera?.id) return;
    aprobar("CBC", 0);
    if (user.orientacion) changeOrientacion(user.orientacion.nombre);
    if (user.carrera.finDeCarrera) {
      changeFinDeCarrera(user.finDeCarrera?.id);
      user.carrera.finDeCarrera.forEach((f) => {
        const n = getNode(f.materia);
        n.hidden = !(f.id === user.finDeCarrera?.id);
        nodes.update(n);
      });
    }
    keepFinDeCarreraOnLastLevel();
  }, [nodes, user.finDeCarrera, user.orientacion]);

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

  const electivasStatus = () => {
    const status = [
      ...new Set(
        nodes
          .get({
            filter: (c) => c.categoria === "Materias Electivas",
            fields: ["hidden"],
          })
          .map((n) => n.hidden)
      ),
    ];
    if (status.length === 1) {
      return status[0] ? "hidden" : "shown";
    }
    return "partial";
  };

  const toggleElectivas = () => {
    const status = electivasStatus();
    let group = null;
    switch (status) {
      case "hidden":
        group = nodes
          .get({
            filter: (n) =>
              n.categoria === "Materias Electivas" &&
              n.group !== "Materias Electivas",
            fields: ["id"],
          })
          .map((n) => {
            const node = getNode(n.id);
            node.hidden = false;
            return node;
          });
        if (group.length) break;
      // eslint-disable-next-line no-fallthrough
      case "partial":
        group = graph.nodes
          .filter((n) => n.categoria === "Materias Electivas")
          .map((n) => {
            const node = getNode(n.id);
            node.hidden = false;
            return node;
          });
        break;

      case "shown":
        group = graph.nodes
          .filter((n) => n.categoria === "Materias Electivas")
          .map((n) => {
            const node = getNode(n.id);
            node.hidden = true;
            return node;
          });
        break;
      default:
        break;
    }

    nodes.update(group);
    keepFinDeCarreraOnLastLevel();
    network.fit();
  };

  const toggleGroup = (id) => {
    const categoria = graph.nodes.filter((n) => n.categoria === id);
    const group = categoria.map((n) => {
      const node = getNode(n.id);
      node.hidden = !node.hidden;
      return node;
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

  const cursando = (id, cuatri) => {
    desaprobar(id);
    const node = getNode(id);
    node.cursando({
      network: network,
      nodes: nodes,
      cuatri,
      showLabels,
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
    return nodes.get({
      filter: (c) => c.categoria === id,
      fields: ["hidden"],
    })[0].hidden;
  };

  const getCreditos = () => {
    let creditos = [];
    const accumulator = (acc, node) => {
      acc += node.creditos;
      return acc;
    };

    creditos.push({
      nombre: "Materias Obligatorias",
      bg: COLORS.obligatorias[50],
      color: "obligatorias",
      creditosNecesarios: user.carrera.creditos.obligatorias,
      creditos: nodes
        .get({
          filter: (n) =>
            n.categoria === "Materias Obligatorias" &&
            n.aprobada &&
            n.nota >= 0,
          fields: ["creditos"],
        })
        .reduce(accumulator, 0),
    });

    creditos.push({
      nombre: `Materias Electivas${
        user.finDeCarrera ? ` (eligiendo ${user.finDeCarrera.id})` : ""
      }`,
      color: "electivas",
      bg: COLORS.electivas[50],
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
            n.nota >= 0,
          fields: ["creditos"],
        })
        .reduce(accumulator, 0),
    });

    if (
      user.carrera.eligeOrientaciones &&
      user.orientacion &&
      (!isNaN(user.carrera.creditos.orientacion) ||
        user.carrera.creditos.orientacion[user.finDeCarrera?.id])
    )
      creditos.push({
        nombre: `Orientación: ${user.orientacion.nombre}`,
        color: "orientacion0",
        bg: COLORS.orientacion0[50],
        creditosNecesarios: isNaN(user.carrera.creditos.orientacion)
          ? user.carrera.creditos.orientacion[user.finDeCarrera?.id]
          : user.carrera.creditos.orientacion,
        creditos: nodes
          .get({
            filter: (n) =>
              n.categoria === user.orientacion.nombre &&
              n.aprobada &&
              n.nota >= 0,
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
          color: "findecarrera",
          bg: COLORS.findecarrera[50],
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

  const toggleCheckbox = (c) => {
    const value = !!user.carrera.creditos.checkbox.find(
      (ch) => ch.nombre === c.nombre
    ).check;
    user.carrera.creditos.checkbox.find(
      (ch) => ch.nombre === c.nombre
    ).check = !value;
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
    autosave,
    setAutosave,
    setEdges,
    changeCarrera,
    changeOrientacion,
    changeFinDeCarrera,
    toggleCheckbox,
    actualizarMetadata,
    loadingGraph,
    setFirstTime,
    isGroupHidden,
    cursando,
    electivasStatus,
    toggleElectivas,
  };
};

export default useGraph;
