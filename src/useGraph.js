/* eslint-disable react-hooks/exhaustive-deps */
import { useColorMode } from "@chakra-ui/color-mode";
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
  const [aplazos, setAplazos] = React.useState(0);
  const [stats, setStats] = React.useState({
    materiasAprobadas: 0,
    creditosTotales: 0,
  });
  const [shouldLoadGraph, setShouldLoadGraph] = React.useState(false);
  const [autosave, setAutosave] = React.useState(false);
  const [loadingGraph, setLoadingGraph] = React.useState(false);
  const [firstTime, setFirstTime] = React.useState(true);
  const { user, setUser, register, logged, getGraph, postGraph } = loginHook;
  const { colorMode } = useColorMode();
  const [optativas, setOptativas] = React.useState([]);

  const actualizar = () => {
    if (!nodes) return;
    if (autosave) saveGraph();
    setPromedio(getPromedio());
    setCreditos(getCreditos());
    nodes.update(
      nodes.map((n) =>
        getNode(n.id).actualizar({
          user,
          network,
          getNode,
          showLabels: logged,
          nodes,
          colorMode,
        })
      )
    );
  };

  React.useEffect(() => {
    if (!logged) changeCarrera(CARRERAS[0].id);
  }, []);

  React.useEffect(() => {
    if (logged) changeCarrera(user.carrera.id);
  }, [logged]);

  React.useEffect(() => {
    actualizar();
  }, [colorMode, optativas]);

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
          const toUpdate = [];
          if (metadata.materias) {
            metadata.materias.forEach((m) => {
              if (m.nota >= -1) {
                toUpdate.push(getNode(m.id).aprobar(m.nota));
              } else if (m.cuatri >= 0) {
                toUpdate.push(getNode(m.id).cursando(m.cuatri));
              }
            });
          }
          if (metadata.checkboxes)
            metadata.checkboxes.forEach((c) => toggleCheckbox(c));
          if (user.orientacion) toggleGroup(user.orientacion.nombre);
          if (electivasStatus() === "hidden") toggleElectivas();
          nodes.update(toUpdate.flat());
          actualizar();
          setLoadingGraph(false);
          if (metadata.optativas) setOptativas(metadata.optativas);
          network.fit();
        })
        .catch((e) => {
          setLoadingGraph(false);
          aprobar("CBC", 0);
          network.fit();
        });
    }
  }, [shouldLoadGraph, nodes]);

  React.useEffect(() => {
    if (!nodes?.carrera || nodes.carrera !== user.carrera?.id) return;
    if (user.orientacion) changeOrientacion(user.orientacion.nombre);
    aprobar("CBC", 0);
    network.fit();
  }, [nodes, user.finDeCarrera, user.orientacion]);

  const getNode = (id) => {
    return nodes?.get(id)?.nodeRef;
  };

  const redraw = () => {
    if (network) network.redraw();
  };
  const saveGraph = () => {
    postGraph(nodes, user.carrera.creditos.checkbox, optativas);
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
    balanceShownElectivas(group);

    nodes.update(group);
    actualizar();
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
    actualizar();
    network.fit();
  };

  const aprobar = (id, nota) => {
    nodes.update(getNode(id).aprobar(nota));
    actualizar();
  };

  const desaprobar = (id) => {
    nodes.update(getNode(id).desaprobar());
    actualizar();
  };

  const cursando = (id, cuatri) => {
    nodes.update(getNode(id).cursando(cuatri));
    actualizar();
  };

  const isGroupHidden = (id) => {
    return nodes.get({
      filter: (c) => c.categoria === id,
      fields: ["hidden"],
    })[0].hidden;
  };

  const toggleCheckbox = (c) => {
    const value = !!user.carrera.creditos.checkbox.find((ch) => ch.nombre === c)
      .check;
    user.carrera.creditos.checkbox.find((ch) => ch.nombre === c).check = !value;
    actualizar();
  };

  const getPromedio = () => {
    const materias = nodes.get({
      filter: (n) => n.aprobada && n.nota > 0 && n.categoria !== "*CBC",
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

    const getCorrectCreditos = () => {
      if (user.carrera.eligeOrientaciones === true)
        return user.carrera.creditos.orientacion[user.orientacion?.nombre];
      return user.carrera.creditos;
    };

    creditos.push({
      nombre: "Materias Obligatorias",
      nombrecorto: "Obligatorias",
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
      nombrecorto: "Electivas",
      color: "electivas",
      bg: COLORS.electivas[50],
      creditosNecesarios: isNaN(getCorrectCreditos()?.electivas)
        ? getCorrectCreditos()?.electivas[user.finDeCarrera?.id]
        : getCorrectCreditos()?.electivas,

      creditos:
        nodes
          .get({
            filter: (n) =>
              n.categoria !== "CBC" &&
              n.categoria !== "*CBC" &&
              n.categoria !== "Materias Obligatorias" &&
              n.categoria !== "Fin de Carrera" &&
              n.categoria !== "Fin de Carrera (Obligatorio)" &&
              n.categoria !== user.orientacion?.nombre &&
              n.aprobada &&
              n.nota >= 0,
            fields: ["creditos"],
          })
          .reduce(accumulator, 0) + optativas.reduce(accumulator, 0),
    });

    if (
      user.carrera.eligeOrientaciones &&
      user.orientacion &&
      (user.carrera.creditos.orientacion[user.orientacion?.nombre] ||
        user.carrera.creditos.orientacion[user.finDeCarrera?.id])
    )
      creditos.push({
        nombre: `Orientación: ${user.orientacion.nombre}`,
        nombrecorto: "Orientación",
        bg: COLORS[user.orientacion.colorScheme][50],
        color: user.orientacion.colorScheme,
        creditosNecesarios: isNaN(getCorrectCreditos()?.orientacion)
          ? getCorrectCreditos().orientacion[user.finDeCarrera?.id]
          : getCorrectCreditos()?.orientacion,
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
          nombre: m.nombre,
          nombrecorto: m.nombrecorto,
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
            nombre: node.materia,
            nombrecorto: m.nombrecorto,
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
          nombre: node.materia,
          nombrecorto: user.finDeCarrera.id,
          color: "findecarrera",
          bg: COLORS.findecarrera[50],
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

    const aprobadas = nodes.get({
      filter: (n) =>
        n.categoria !== "CBC" &&
        n.categoria !== "*CBC" &&
        n.aprobada &&
        n.nota >= 0,
      fields: ["creditos"],
    });
    aprobadas.push(...optativas.filter(Boolean));

    setStats({
      materiasAprobadas: aprobadas.length,
      creditosTotales: aprobadas.reduce(accumulator, 0),
    });

    return creditos;
  };

  const addOptativa = (nombre, creditos) => {
    const ids = optativas.map((o) => o.id);
    let id = ids.length + 1;
    for (let i = 0; i < ids.length; i++) {
      if (ids[i] !== i + 1) id = i;
    }
    setOptativas(() => {
      optativas.push({ id, nombre, creditos });
      return optativas.filter(Boolean);
    });
  };

  const editOptativa = (id, nombre, creditos) => {
    setOptativas(() => {
      const i = optativas.findIndex((o) => o.id === id);
      optativas[i] = { id, nombre, creditos };
      return optativas.filter(Boolean);
    });
  };
  const removeOptativa = (id) => {
    setOptativas(() => {
      const i = optativas.findIndex((o) => o.id === id);
      delete optativas[i];
      return optativas.filter(Boolean);
    });
  };

  const promedioConAplazos = (n) => {
    if (!nodes) return 0;
    const materias = nodes.get({
      filter: (n) => n.aprobada && n.nota > 0 && n.categoria !== "*CBC",
      fields: ["nota"],
    });
    materias.push(...Array(n).fill({ nota: 2 }));

    const sum = materias.reduce((acc, node) => {
      acc += node.nota;
      return acc;
    }, 0);
    return sum ? (sum / materias.length).toFixed(2) : 0;
  };

  const promedioConCBC = () => {
    if (!nodes) return 0;
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

  const openCBC = () => {
    toggleGroup("*CBC");
  };

  const balanceShownElectivas = (group) => {
    const sortByGroup = (a, b) => {
      const nodeA = getNode(a.id);
      const nodeB = getNode(b.id);
      const groupOrder = [
        "Aprobadas",
        "En Final",
        "Habilitadas",
        "Materias Electivas",
        "Cursando",
        ...Array(10)
          .fill()
          .map((_, i) => `A Cursar (${i + 1})`),
      ];
      return groupOrder.indexOf(nodeA.group) - groupOrder.indexOf(nodeB.group);
    };

    const electivas = group.sort(sortByGroup);
    const lastLevel = Math.max(
      ...nodes
        .get({
          filter: (n) =>
            n.categoria !== "Materias Electivas" &&
            n.categoria !== "Fin de Carrera" &&
            n.categoria !== "Fin de Carrera (Obligatorio)",
          fields: ["level"],
          type: { level: "number" },
        })
        .map((n) => n.level)
    );
    let counter = 0;
    let addLevel = 1;

    electivas.forEach((n) => {
      const node = getNode(n.id);
      counter += 1;
      if (counter === 7) {
        counter = 0;
        addLevel += 1;
      }
      node.level = lastLevel + addLevel;
    });
    nodes.update(electivas);
  };

  return {
    graph,
    toggleGroup,
    getNode,
    aprobar,
    desaprobar,
    redraw,
    promedio,
    promedioConAplazos,
    promedioConCBC,
    creditos,
    stats,
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
    loadingGraph,
    setFirstTime,
    isGroupHidden,
    actualizar,
    cursando,
    electivasStatus,
    toggleElectivas,
    optativas,
    addOptativa,
    editOptativa,
    removeOptativa,
    aplazos,
    setAplazos,
    openCBC,
  };
};

export default useGraph;
