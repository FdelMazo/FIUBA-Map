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
  // https://dmitripavlutin.com/react-usereducer/
  const [network, setNetwork] = React.useState(null);
  const [nodes, setNodes] = React.useState(null);
  const [edges, setEdges] = React.useState(null);
  const [displayedNode, setDisplayedNode] = React.useState("");
  const [graph, setGraph] = React.useState(graphObj);
  const [creditos, setCreditos] = React.useState([]);
  const [stats, setStats] = React.useState({
    materiasAprobadas: 0,
    creditosTotales: 0,
    isRecibido: false,
  });
  const [shouldLoadGraph, setShouldLoadGraph] = React.useState(false);
  const [loadingGraph, setLoadingGraph] = React.useState(false);
  const [firstTime, setFirstTime] = React.useState(true);
  const { user, setUser, register, logged, getGraph, postGraph } = loginHook;
  const { colorMode } = useColorMode();
  const [optativas, optativasDispatch] = React.useReducer((prevstate, dispatched) => {
    let newstate = prevstate;
    const { action, value } = dispatched
    switch (action) {
      case 'override':
        newstate = value;
        break;
      case 'create':
        const lastOptativaId = prevstate.map((o) => o.id).pop() || 0;
        newstate = [
          ...newstate,
          {
            id: lastOptativaId + 1,
            nombre: "Materia Optativa",
            creditos: 4
          }
        ]
        break;
      case 'remove':
        newstate = prevstate.filter((o) => o.id !== value.id)
        break;
      case 'edit':
        newstate = [
          ...prevstate.filter((o) => o.id !== value.id),
          { ...value }
        ]
        break;
      default:
        return newstate;
    }
    return newstate;
  }, []);


  const actualizar = () => {
    if (!nodes) return;
    updatePromedio()
    setCreditos(getCreditos());
    nodes.update(
      nodes.map((n) =>
        getNode(n.id).actualizar({
          user,
          network,
          getNode,
          optativas,
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
    if (!network) return
    // Copied from https://github.com/visjs/vis-network/blob/2c774997ff234fa93555f36ca8040cf4d489e5df/lib/network/modules/NodesHandler.js#L325
    // Removed the last call to body.emit(datachanged)
    network.nodesHandler.update = (ids, changedData, oldData) => {
      const nodes = network.body.nodes;
      let dataChanged = false;
      for (let i = 0; i < ids.length; i++) {
        const id = ids[i];
        let node = nodes[id];
        const data = changedData[i];
        if (node !== undefined) {
          // update node
          if (node.setOptions(data)) {
            dataChanged = true;
          }
        } else {
          dataChanged = true;
          // create node
          node = network.create(data);
          nodes[id] = node;
        }
      }

      if (!dataChanged && oldData !== undefined) {
        // Check for any changes which should trigger a layout recalculation
        // For now, this is just 'level' for hierarchical layout
        // Assumption: old and new data arranged in same order; at time of writing, this holds.
        dataChanged = changedData.some(function (newValue, index) {
          const oldValue = oldData[index];
          return oldValue && oldValue.level !== newValue.level;
        });
      }

      network.body.emitter.emit("_dataUpdated");
    }
  }, [network]);


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
              let node = getNode(m.id)
              if (!node) return;
              if (m.cuatri >= 0) {
                node.cuatri = m.cuatri
                toUpdate.push(node);
              }
              if (m.nota >= -1) {
                node = node.aprobar(m.nota)
                toUpdate.push(node);
              }
              if (m.cuatrimestre) {
                node = node.cursando(m.cuatrimestre)
                toUpdate.push(node);
              }
            });
          }
          if (metadata.checkboxes)
            metadata.checkboxes.forEach((c) => toggleCheckbox(c));
          if (
            user.orientacion &&
            groupStatus(user.orientacion.nombre) === "hidden"
          )
            toggleGroup(user.orientacion.nombre);
          nodes.update(toUpdate.flat());
          actualizar();
          actualizarNiveles()
          showAprobadas();
          setLoadingGraph(false);
          if (metadata.optativas) {
            optativasDispatch({ action: 'override', value: metadata.optativas })
          };
          if (metadata.aplazos) setAplazos(metadata.aplazos);
          network.fit();
        })
        .catch((e) => {
          setLoadingGraph(false);
          aprobar("CBC", 0);
          actualizarNiveles()
          network.fit();
        });
    }
  }, [shouldLoadGraph, nodes]);

  React.useEffect(() => {
    if (!nodes?.carrera || nodes.carrera !== user.carrera?.id) return;
    if (user.orientacion) changeOrientacion(user.orientacion.nombre);
    aprobar("CBC", 0);
    actualizarNiveles()
    network.fit();
  }, [nodes, user.finDeCarrera, user.orientacion]);

  const getNode = (id) => {
    return nodes?.get(id)?.nodeRef;
  };

  const redraw = () => {
    if (network) network.redraw();
  };

  const saveGraph = () => {
    postGraph(nodes, user.carrera.creditos.checkbox, optativas, aplazos);
  };

  const restartGraph = () => {
    nodes.update(nodes?.get({
      filter: (n) => n.cuatrimestre,
      fields: ["id", "cuatrimestre"],
    }).map((n) => getNode(n.id).cursando(undefined)));
    actualizar();
    actualizarNiveles()
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
      })
      carrera.graph.forEach((n) => {
        if (n.correlativas)
          n.correlativas.split("-").forEach((c) => {
            graphEdges.push({ from: c, to: n.id, smooth: { enabled: true, type: "curvedCW", roundness: 0.1 } });
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

  const groupStatus = (categoria) => {
    const status = [
      ...new Set(
        nodes
          .get({
            filter: (c) => c.categoria === categoria,
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

  const toggleGroup = (categoria) => {
    const status = groupStatus(categoria);
    let group = null;
    switch (status) {
      case "hidden":
        group = graph.nodes
          .filter((n) =>
            n.categoria === categoria &&
            (n.cuatrimestre || n.nota >= -1))
          .map((n) => {
            const node = getNode(n.id);
            node.hidden = false;
            return node;
          });
        if (group.length) break;
      // eslint-disable-next-line no-fallthrough
      case "partial":
        group = graph.nodes
          .filter((n) => n.categoria === categoria)
          .map((n) => {
            const node = getNode(n.id);
            node.hidden = false;
            return node;
          });
        break;

      case "shown":
        group = graph.nodes
          .filter((n) => n.categoria === categoria)
          .map((n) => {
            const node = getNode(n.id);
            node.hidden = true;
            return node;
          });
        break;
      default:
        break;
    }

    actualizar();
    actualizarNiveles()
    redraw();
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

  const cursando = (id, cuatrimestre) => {
    nodes.update(getNode(id).cursando(cuatrimestre));
    actualizar();
    actualizarNiveles()
  };

  const toggleCheckbox = (c) => {
    const value = !!user.carrera.creditos.checkbox.find((ch) => ch.nombre === c)
      .check;
    user.carrera.creditos.checkbox.find((ch) => ch.nombre === c).check = !value;
    actualizar();
  };

  const getCreditos = () => {
    let creditos = [];
    const accumulator = (acc, node) => {
      acc += node.creditos;
      return acc;
    };

    const getCorrectCreditos = () => {
      if (user.carrera.eligeOrientaciones)
        return user.carrera.creditos.orientacion[user.orientacion?.nombre];
      return user.carrera.creditos;
    };

    creditos.push({
      nombre: "Ciclo Básico Común",
      nombrecorto: "CBC",
      bg: COLORS.aprobadas[50],
      color: "aprobadas",
      creditosNecesarios: nodes
        .get({
          filter: (n) =>
            n.categoria === "*CBC",
          fields: ["creditos"],
        })
        .reduce(accumulator, 0),
      creditos: nodes
        .get({
          filter: (n) =>
            n.categoria === "*CBC",
          fields: ["creditos"],
        })
        .reduce(accumulator, 0),
      nmaterias: nodes.get({
        filter: (n) =>
          n.categoria === "*CBC",
        fields: ["creditos"],
      }).length,
    });

    creditos.push({
      nombre: "Materias Obligatorias",
      nombrecorto: "Obligatorias",
      bg: COLORS.obligatorias[50],
      color: "obligatorias",
      creditosNecesarios: user.carrera.creditos.obligatorias,
      nmaterias: nodes.get({
        filter: (n) =>
          n.categoria === "Materias Obligatorias" &&
          n.aprobada &&
          n.nota >= 0,
        fields: ["creditos"],
      }).length,
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
      nombre: "Materias Electivas",
      nombrecorto: "Electivas",
      color: "electivas",
      bg: COLORS.electivas[50],
      creditosNecesarios: isNaN(getCorrectCreditos()?.electivas)
        ? getCorrectCreditos()?.electivas[user.finDeCarrera?.id]
        : getCorrectCreditos()?.electivas,

      nmaterias: nodes
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
      }).length,
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
      user.carrera.creditos.orientacion[user.orientacion?.nombre]
    )
      creditos.push({
        nombre: `Orientación: ${user.orientacion.nombre}`,
        nombrecorto: "Orientación",
        bg: COLORS[user.orientacion.colorScheme][50],
        color: user.orientacion.colorScheme,
        creditosNecesarios: getCorrectCreditos()?.orientacion,
        nmaterias: nodes
          .get({
            filter: (n) =>
              n.categoria === user.orientacion.nombre &&
              n.aprobada &&
              n.nota >= 0,
            fields: ["creditos"],
          }).length,
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

    if (fullProportion > 10) creditos[1].proportion -= fullProportion - 10;
    else if (fullProportion < 10) creditos[1].proportion += 10 - fullProportion;

    const aprobadas = nodes.get({
      filter: (n) =>
        n.categoria !== "CBC" &&
        n.categoria !== "*CBC" &&
        n.aprobada &&
        n.nota >= 0,
      fields: ["creditos"],
    });
    aprobadas.push(...nodes.get({
      filter: (n) =>
        n.categoria === "*CBC",
      fields: ["creditos"],
    }));
    aprobadas.push(...optativas);

    const allCreditosAprobados = creditos.every(c => c.creditos >= c.creditosNecesarios);
    const creditosTotales = aprobadas.reduce(accumulator, 0)

    setStats({
      materiasAprobadas: aprobadas.length,
      creditosTotales,
      isRecibido: creditosTotales >= user.carrera?.creditos.total && allCreditosAprobados,
    });

    return creditos;
  };

  const openCBC = () => {
    const categoria = graph.nodes.filter((n) => n.categoria === "*CBC");
    categoria.forEach((n) => {
      const node = getNode(n.id);
      node.hidden = !node.hidden;
      return node;
    });
    actualizar();
    actualizarNiveles()
    network.fit();
  };

  const showAprobadas = () => {
    let electivas = nodes
      .get({
        filter: (n) =>
          n.categoria === "Materias Electivas" &&
          (n.aprobada || n.nota === -1 || n.cuatrimestre),
        fields: ["id"],
      })
      .map((n) => {
        const node = getNode(n.id);
        node.hidden = false;
        return node;
      });

    let resto = nodes
      .get({
        filter: (n) =>
          n.categoria !== "CBC" &&
          n.categoria !== "*CBC" &&
          n.categoria !== "Materias Obligatorias" &&
          n.categoria !== "Materias Electivas" &&
          n.categoria !== "Fin de Carrera (Obligatorio)" &&
          n.categoria !== "Fin de Carrera" &&
          (n.aprobada || n.nota === -1 || n.cuatrimestre),
        fields: ["id"],
      })
      .map((n) => {
        const node = getNode(n.id);
        node.hidden = false;
        return node;
      });

    nodes.update([...electivas, ...resto]);
    actualizar();
    actualizarNiveles()
    network.fit();
  };

  const balanceSinNivel = (group, lastLevel) => {
    const sortByGroup = (a, b) => {
      const nodeA = getNode(a.id);
      const nodeB = getNode(b.id);
      const groupOrder = [
        "Aprobadas",
        "En Final",
        "Habilitadas",
        "Materias Electivas",
        ...graph.groups,
      ];
      if (nodeA.creditos && nodeB.creditos && nodeA.group === nodeB.group) {
        return nodeB.creditos - nodeA.creditos;
      }
      return groupOrder.indexOf(nodeA.group) - groupOrder.indexOf(nodeB.group);
    };

    const electivas = group.sort(sortByGroup);

    let counter = 0;
    let addLevel = 1;

    electivas.forEach((n) => {
      counter += 1;
      if (counter === 7) {
        counter = 0;
        addLevel += 1;
      }
      n.level = lastLevel + addLevel;
    });
    return electivas
  };


  const actualizarNiveles = () => {
    const toUpdate = []
    let lastLevel = Math.max(...nodes.get({
      filter: (n) => !n.hidden &&
        n.categoria !== "CBC" &&
        n.categoria !== "*CBC" &&
        n.categoria !== "Fin de Carrera" &&
        n.categoria !== "Fin de Carrera (Obligatorio)"
    }).map(n => n.level))

    const conCuatri = nodes.get({
      filter: (n) => n.cuatrimestre &&
        !n.hidden &&
        n.categoria !== "CBC" &&
        n.categoria !== "*CBC"
    })
    const firstCuatri = Math.min(...conCuatri.map(n => n.cuatrimestre))

    if (conCuatri.length) {
      lastLevel = 0
      toUpdate.push(...conCuatri.map((n) => {
        n.level = ((n.cuatrimestre - firstCuatri) / 0.5) + lastLevel + 1;
        return n;
      }))
      if (toUpdate.length) lastLevel = Math.max(...toUpdate.map(n => n.level))
      const sinCuatri = nodes.get({
        filter: (n) =>
          !n.cuatrimestre &&
          !n.hidden &&
          n.originalLevel &&
          n.categoria !== "CBC" &&
          n.categoria !== "*CBC"
      })
      if (sinCuatri.length) {
        const firstOffset = Math.min(...sinCuatri.map(n => n.originalLevel))
        toUpdate.push(...sinCuatri.map((n) => {
          const offset = isFinite(firstOffset) && n.originalLevel ? n.originalLevel - firstOffset : 0
          n.level = lastLevel + offset + 1;
          return n;
        }))
        if (toUpdate.length) lastLevel = Math.max(...toUpdate.map(n => n.level))
      }
    }

    const noElectivasPeroSinNivel = nodes.get({
      filter: (n) => n.categoria !== "Materias Electivas" &&
        n.categoria !== "Fin de Carrera" &&
        n.categoria !== "Fin de Carrera (Obligatorio)" &&
        !n.hidden &&
        !n.cuatrimestre &&
        !n.originalLevel &&
        n.originalLevel !== 0
    })
    toUpdate.push(...balanceSinNivel(noElectivasPeroSinNivel, lastLevel));
    if (toUpdate.length) lastLevel = Math.max(...toUpdate.map(n => n.level))

    const electivas = nodes.get({
      filter: (n) => n.categoria === "Materias Electivas" &&
        !n.hidden &&
        !n.cuatrimestre
    })
    toUpdate.push(...balanceSinNivel(electivas, lastLevel));

    if (toUpdate.length) lastLevel = Math.max(...toUpdate.map(n => n.level))
    if (!isFinite(lastLevel)) {
      lastLevel = Math.max(
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
    }

    const findecarrera = nodes.get({
      filter: (n) =>
        (n.categoria === "Fin de Carrera" || n.categoria === "Fin de Carrera (Obligatorio)") &&
        !n.hidden &&
        !n.cuatrimestre
    })
    toUpdate.push(...findecarrera.map((n) => {
      n.level = lastLevel + 1;
      return n
    }))

    nodes.update(toUpdate)
    network.body.emitter.emit("_dataChanged");
  }

  const getCurrentCuatri = () => {
    const today = new Date();
    let cuatri = today.getFullYear();
    const month = today.getMonth();
    if (month > 6) cuatri = cuatri + 0.5;
    return cuatri;
  }

  const getters = {
    selectableCategorias: () => {
      const categorias = nodes ? nodes
        .distinct("categoria")
        .filter(
          (c) =>
            c !== "CBC" &&
            c !== "*CBC" &&
            c !== "Materias Obligatorias" &&
            c !== "Fin de Carrera (Obligatorio)" &&
            c !== "Fin de Carrera"
        ) : []
      if (categorias.indexOf('Materias Electivas') > 0) {
        categorias.splice(categorias.indexOf('Materias Electivas'), 1);
        categorias.unshift('Materias Electivas');
      }
      return categorias
    },
    materiasAprobadasSinCBC: () =>
      nodes ? nodes.get({
        filter: (n) => n.aprobada && n.nota > 0 && n.categoria !== "*CBC",
        fields: ["nota"],
      }) : [],
    materiasAprobadasConCBC: () =>
      nodes ? nodes.get({
        filter: (n) => n.aprobada && n.nota > 0,
        fields: ["nota"],
      }) : [],
  }

  const blurOthers = (id) => {
    const node = getNode(id)
    if (!node) return;

    let neighborNodes = network.getConnectedNodes(node.id);
    if (node.requiere) {
      neighborNodes = neighborNodes.filter((node) => node !== "CBC");
    }

    const allOtherNodes = nodes.get({
      filter: function (n) {
        return !neighborNodes.includes(n.id) && !(n.id === node.id) && !n.hidden;
      },
    });
    nodes.update(
      allOtherNodes.map((n) => {
        n.opacity = 0.3;
        return n;
      })
    );

    const neighborEdgesIds = network.getConnectedEdges(node.id);
    const neighborEdges = edges.get({
      filter: function (edge) {
        return neighborEdgesIds.includes(edge.id) && edge.color !== "transparent"
      },
    });
    edges.update(
      neighborEdges.map((edge) => {
        edge.hoverWidth = 2
        edge.selectionWidth = 2
        edge.arrows = { to: { scaleFactor: 0.7 } };
        edge.color = { opacity: 1 };
        return edge;
      })
    );
  }

  const unblurAll = () => {
    nodes.update(
      nodes.map((n) => {
        n.opacity = undefined;
        return n;
      })
    );

    const neighborEdges = edges.get({
      filter: function (edge) {
        return edge.color !== "transparent" && edge.selectionWidth === 2
      },
    });
    edges.update(
      neighborEdges.map((edge) => {
        edge.selectionWidth = undefined
        edge.hoverWidth = undefined
        edge.arrows = undefined
        edge.color = undefined
        return edge;
      })
    );
  }

  const events = {
    click: (e) => {
      // click: abre/cierra CBC
      // click en ningun nodo: limpiar blur/selection
      if (!e.nodes.length) {
        unblurAll()
        setDisplayedNode("");
        return;
      }
      const id = e.nodes[0];
      if (id === "CBC") {
        openCBC();
      }
    },
    doubleClick: (e) => {
      // dobleclick: aprobar/desaprobar
      const id = e.nodes[0];
      if (id === "CBC") return;
      const node = getNode(id);
      if (!node) return;

      if (!node.aprobada) {
        aprobar(id, 4);
      } else {
        desaprobar(id);
      }
    },
    hold: (e) => {
      // holdclick logeado: poner/sacar en final
      // no tiene sentido que alguien deslogueado use el feature de final
      const id = e.nodes[0];
      if (!logged || id === "CBC") return;
      const node = getNode(id);
      if (!node) return;

      if (!(node.nota === -1)) {
        aprobar(id, -1);
      } else {
        desaprobar(id);
      }
    },
    hoverNode: (e) => {
      const id = e.node;
      if (network.getSelectedNodes().length) {
        return
      }
      blurOthers(id)
    },
    blurNode: () => {
      if (network.getSelectedNodes().length) {
        return
      }
      unblurAll()
    },
    selectNode: (e) => {
      const id = e.nodes[0];
      unblurAll()
      blurOthers(id)
      if (!logged || id === "CBC") return;
      setDisplayedNode(id);
    },
  };


  const [aplazos, setAplazos] = React.useState(0)
  const [promedio, setPromedio] = React.useState({
    promedio: 0,
    promedioConAplazos: 0,
    promedioConCBC: 0,
  })

  const updatePromedio = () => {
    setPromedio({
      promedio: promediar(getters.materiasAprobadasSinCBC()),
      promedioConAplazos: promediar([
        ...getters.materiasAprobadasSinCBC(),
        ...Array(aplazos).fill({ nota: 2 })
      ]),
      promedioConCBC: promediar(getters.materiasAprobadasConCBC()),
    })
  }

  React.useEffect(() => {
    updatePromedio()
  }, [aplazos])

  return {
    graph,
    toggleGroup,
    getNode,
    aprobar,
    desaprobar,
    redraw,
    creditos,
    stats,
    network,
    setNetwork,
    nodes,
    setNodes,
    saveGraph,
    restartGraph,
    edges,
    setEdges,
    changeCarrera,
    changeOrientacion,
    changeFinDeCarrera,
    toggleCheckbox,
    loadingGraph,
    setFirstTime,
    actualizar,
    cursando,
    groupStatus,
    optativas,
    optativasDispatch,
    openCBC,
    getCurrentCuatri,
    displayedNode,
    setDisplayedNode,
    getters,
    events,
    aplazos,
    setAplazos,
    promedio,
  };
};

const promediar = (materias) => {
  const sum = materias.reduce((acc, node) => {
    acc += node.nota;
    return acc;
  }, 0);
  return sum ? (sum / materias.length).toFixed(2) : 0;
};

export default useGraph;
