/* eslint-disable react-hooks/exhaustive-deps */
import { useColorMode } from "@chakra-ui/color-mode";
import React from "react";
import CARRERAS from "./carreras";
import { CREDITOS } from "./constants";
import Node from "./Node";
import { COLORS } from "./theme";
import { accCreditos, accCreditosNecesarios, accProportion, overrideVisJsUpdate } from "./utils";

const graphObj = {
  nodes: [],
  edges: [],
  groups: [],
};

const useGraph = (loginHook) => {
  const { user, setUser, register, logged, getGraph, postGraph } = loginHook;
  const { colorMode } = useColorMode();
  const [network, setNetwork] = React.useState(null);
  const [graph, setGraph] = React.useState(graphObj);
  const [nodes, setNodes] = React.useState(null);
  const [edges, setEdges] = React.useState(null);

  const [shouldLoadGraph, setShouldLoadGraph] = React.useState(false);
  const [loadingGraph, setLoadingGraph] = React.useState(false);
  const [needsRegister, setNeedsRegister] = React.useState(false);

  const [displayedNode, setDisplayedNode] = React.useState("");

  ///
  /// useEffects
  ///

  // En boot, si no estoy logueado, muestro lic en sistemas
  React.useEffect(() => {
    if (!logged) changeCarrera(CARRERAS[0].id);
  }, []);

  // Cuando me loggeo, me cambio a la carrera del usuario
  React.useEffect(() => {
    if (logged) changeCarrera(user.carrera.id);
  }, [logged]);

  // Cuando el usuario se desloguea, llamamos a actualizar para sacar los labels de la nota
  React.useEffect(() => {
    if (!logged) actualizar();
  }, [logged]);

  // Cuando cambia la network, le overrideo el update para que no este redibujandose constantemente
  React.useEffect(() => {
    if (!network) return
    overrideVisJsUpdate(network);
  }, [network]);

  // Si cambia cualquier cosa del usuario, actualizamos su registro en la db
  React.useEffect(() => {
    if (logged && needsRegister) register();
  }, [user.carrera, user.orientacion, user.finDeCarrera]);


  ///
  /// Getters
  ///

  const getters = {
    NodesFrom: (id) => network.getConnectedNodes(id, "from"),
    NodesTo: (id) => network.getConnectedNodes(id, "to"),
    NeighborNodes: (id) => network.getConnectedNodes(id),
    NeighborEdges: (id) => network.getConnectedEdges(id),
    Cuatrimestres: () => nodes ? nodes.get({
      filter: (n) => n.cuatrimestre,
      fields: ["id", "cuatrimestre"],
    }) : [],
    SelectableCategorias: () => {
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
    MateriasAprobadasCBC: () =>
      nodes ? nodes.get({
        filter: (n) => n.categoria === "*CBC" && n.aprobada && n.nota > 0,
        fields: ["nota"],
      }) : [],
    MateriasAprobadasSinCBC: () =>
      nodes ? nodes.get({
        filter: (n) => n.aprobada && n.nota >= 0 && n.categoria !== "*CBC" && n.categoria !== "CBC",
        fields: ["nota", "creditos"],
      }) : [],
    MateriasAprobadasSinEquivalenciasSinCBC: () =>
      nodes ? nodes.get({
        filter: (n) => n.aprobada && n.nota > 0 && n.categoria !== "*CBC" && n.categoria !== "CBC",
        fields: ["nota", "creditos"],
      }) : [],
    MateriasAprobadasConCBC: () =>
      nodes ? nodes
        .get({
          filter: (n) => n.aprobada && n.nota > 0,
          fields: ["nota", "creditos"],
        }) : [],
    CBC: () => nodes ? nodes
      .get({
        filter: (n) =>
          n.categoria === "*CBC",
      }) : [],
    Obligatorias: () => nodes ? nodes
      .get({
        filter: (n) =>
          n.categoria === "Materias Obligatorias",
        fields: ["creditos"],
      }) : [],
    ObligatoriasAprobadas: () => nodes ? nodes
      .get({
        filter: (n) =>
          n.categoria === "Materias Obligatorias" &&
          n.aprobada &&
          n.nota >= 0,
        fields: ["creditos"],
      }) : [],
    ElectivasAprobadas: () => nodes ? nodes
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
      }) : [],
    OrientacionAprobadas: () => nodes ? nodes
      .get({
        filter: (n) =>
          n.categoria === user.orientacion?.nombre &&
          n.aprobada &&
          n.nota >= 0,
        fields: ["creditos"],
      }) : [],
    CategoriaOnly: (categoria) => nodes ? nodes
      .get({
        filter: (n) => n.categoria === categoria,
      }) : [],
    CategoriaRelevantes: (categoria) => nodes ? nodes
      .get({
        filter: (n) => n.categoria === categoria && (n.cuatrimestre || n.nota >= -1)
      }) : [],
    AllRelevantes: () => nodes ? nodes
      .get({
        filter: (n) => n.categoria !== "*CBC" && (n.cuatrimestre || n.nota >= -1)
      }) : [],
    Shown: () => nodes ? nodes
      .get({
        filter: (n) => !n.hidden
      }) : [],
    AllShown: () => nodes ? nodes
      .get({
        filter: (n) => !n.hidden &&
          n.categoria !== "CBC" &&
          n.categoria !== "*CBC" &&
          n.categoria !== "Fin de Carrera" &&
          n.categoria !== "Fin de Carrera (Obligatorio)"
      }) : [],
    AllShownWithCuatri: () => nodes ? nodes
      .get({
        filter: (n) => n.cuatrimestre &&
          !n.hidden &&
          n.categoria !== "CBC" &&
          n.categoria !== "*CBC"
      }) : [],
    AllShownWithoutCuatri: () => nodes ? nodes
      .get({
        filter: (n) =>
          !n.cuatrimestre &&
          !n.hidden &&
          n.originalLevel &&
          n.categoria !== "CBC" &&
          n.categoria !== "*CBC"
      }) : [],
    WithoutNivel: () => nodes ? nodes
      .get({
        filter: (n) => n.categoria !== "Materias Electivas" &&
          n.categoria !== "Fin de Carrera" &&
          n.categoria !== "Fin de Carrera (Obligatorio)" &&
          !n.hidden &&
          !n.cuatrimestre &&
          !n.originalLevel &&
          n.originalLevel !== 0
      }) : [],
    Electivas: () => nodes ? nodes
      .get({
        filter: (n) => n.categoria === "Materias Electivas" &&
          !n.hidden &&
          !n.cuatrimestre
      }) : [],
    Levels: () => nodes ? nodes
      .get({
        filter: (n) =>
          !n.hidden &&
          n.categoria !== "Fin de Carrera" &&
          n.categoria !== "Fin de Carrera (Obligatorio)",
        fields: ["level"],
        type: { level: "number" },
      }) : [],
    FinDeCarrera: () => nodes ? nodes
      .get({
        filter: (n) =>
          (n.categoria === "Fin de Carrera" || n.categoria === "Fin de Carrera (Obligatorio)") &&
          !n.hidden &&
          !n.cuatrimestre
      }) : [],
  }

  ///
  /// Acciones y helpers
  ///

  const getNode = (id) => {
    return nodes?.get(id)?.nodeRef;
  };

  const redraw = () => {
    if (network) {
      network.redraw()
      network.fit();
    }
  };

  const saveGraph = () => {
    postGraph(nodes, user.carrera.creditos.checkbox, optativas, aplazos);
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

  const restartGraphCuatris = () => {
    nodes.update(getters.Cuatrimestres().map((n) => getNode(n.id).cursando(undefined)));
    actualizar();
    actualizarNiveles()
  };

  const toggleCheckbox = (c) => {
    const value = !!user.carrera.creditos.checkbox.find((ch) => ch.nombre === c).check;
    user.carrera.creditos.checkbox.find((ch) => ch.nombre === c).check = !value;
    actualizar();
  };

  const toggleCBC = () => {
    // TODO: estaria barbaro que con network.fit/network.moveTo
    // se logre que cuando haces click en el CBC el grafo se acomode
    // y no haga que se te mueva todo (o sea, que el click sea idempotente)
    const categoria = getters.CBC();
    categoria.forEach((n) => {
      const node = getNode(n.id);
      node.hidden = !node.hidden;
      return node;
    });
    actualizar();
    actualizarNiveles()
    network.fit();
  };

  ///
  /// Funcion clave: recorre todos los nodos y llama a nodo.actualizar()
  ///

  const actualizar = () => {
    if (!nodes?.carrera) return;
    const creditos = [...getters.MateriasAprobadasSinCBC(), ...getters.CBC(), ...optativas].reduce(accCreditos, 0)
    nodes.update(
      nodes.map((n) =>
        getNode(n.id).actualizar({
          getters,
          user,
          network,
          getNode,
          creditos,
          showLabels: logged,
          colorMode,
        })
      )
    );
    updateCreditos()
  };

  ///
  /// Login Stuff... Muchísimo cuidado al tocar esto
  ///

  React.useEffect(() => {
    if (!nodes?.carrera || nodes.carrera !== user.carrera?.id) return;
    if (shouldLoadGraph) {
      setDisplayedNode("")
      setShouldLoadGraph(false);
      setLoadingGraph(true);
      getGraph(user.padron, user.carrera.id)
        .then(async (metadata) => {
          const toUpdate = [];
          if (metadata.materias) {
            metadata.materias.forEach((m) => {
              let node = getNode(m.id)
              if (!node) return;
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
          showRelevantes();
          if (metadata.optativas) {
            optativasDispatch({ action: 'override', value: metadata.optativas })
          };
          if (metadata.aplazos) setAplazos(metadata.aplazos);
          network.fit();

          if (user.padron && user.carrera?.id === "informatica-2020") {
            await transicionInformatica2020()
          }

          setLoadingGraph(false);
        })
        .catch((e) => {
          aprobar("CBC", 0);
          actualizarNiveles()
          network.fit();
          setLoadingGraph(false);
        });
    }
  }, [shouldLoadGraph, nodes]);

  React.useEffect(() => {
    if (!nodes?.carrera || nodes.carrera !== user.carrera?.id) return;
    if (user.orientacion) changeOrientacion(user.orientacion.nombre);
    setDisplayedNode("");
    aprobar("CBC", 0);
    actualizarNiveles()
    network.fit();
  }, [nodes, user.finDeCarrera, user.orientacion]);

  const changeCarrera = async (id) => {
    setDisplayedNode("");
    setUser(({ ...rest }) => {
      const carrera = CARRERAS.find((c) => c.id === id);

      const userdata = logged
        ? user.allLogins.find((l) => l.carreraid === id)
        : false;
      // Forzar a siempre recargar todo si es informatica 2020...
      setShouldLoadGraph(!!userdata || id === "informatica-2020");
      const orientacion =
        carrera.orientaciones?.find(
          (c) => c.nombre === userdata?.orientacionid
        ) || null;
      const finDeCarrera =
        carrera.finDeCarrera?.find((c) => c.id === userdata?.findecarreraid) ||
        null;

      // TODO: resetear las optativas acá
      setAplazos(0)

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

  ///
  /// Manejo de grupos/categorias y sus niveles
  ///

  const groupStatus = (categoria) => {
    const status = [
      ...new Set(
        getters.CategoriaOnly(categoria).map((n) => n.hidden)
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
        group = getters.CategoriaRelevantes(categoria).map((n) => {
          const node = getNode(n.id);
          node.hidden = false;
          return node;
        });
        if (group.length) break;
      // eslint-disable-next-line no-fallthrough
      case "partial":
        group = getters.CategoriaOnly(categoria)
          .map((n) => {
            const node = getNode(n.id);
            node.hidden = false;
            return node;
          });
        break;
      case "shown":
        group = getters.CategoriaOnly(categoria)
          .map((n) => {
            const node = getNode(n.id);
            node.hidden = true;
            return node;
          });
        if (group.map(n => n.id).includes(network.getSelectedNodes()[0])) {
          deselectNode()
          network.selectNodes([]);
        }
        break;
      default:
        break;
    }

    actualizar();
    actualizarNiveles();
    network.fit();
  };

  const showRelevantes = () => {
    const relevantes = getters.AllRelevantes().map((n) => {
      const node = getNode(n.id);
      node.hidden = false;
      return node;
    });

    nodes.update(relevantes);
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
    let lastLevel = Math.max(...getters.AllShown().map(n => n.level))

    const conCuatri = getters.AllShownWithCuatri()
    const firstCuatri = Math.min(...conCuatri.map(n => n.cuatrimestre))

    if (conCuatri.length) {
      lastLevel = 0
      toUpdate.push(...conCuatri.map((n) => {
        n.level = ((n.cuatrimestre - firstCuatri) / 0.5) + lastLevel + 1;
        return n;
      }))
      if (toUpdate.length) lastLevel = Math.max(...toUpdate.map(n => n.level))
      const sinCuatri = getters.AllShownWithoutCuatri()
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

    const noElectivasPeroSinNivel = getters.WithoutNivel()
    toUpdate.push(...balanceSinNivel(noElectivasPeroSinNivel, lastLevel));
    if (toUpdate.length) lastLevel = Math.max(...toUpdate.map(n => n.level))

    const electivas = getters.Electivas()
    toUpdate.push(...balanceSinNivel(electivas, lastLevel));

    if (toUpdate.length) lastLevel = Math.max(...toUpdate.map(n => n.level))
    if (!isFinite(lastLevel)) {
      lastLevel = Math.max(...getters.Levels().map((n) => n.level))
    }

    const findecarrera = getters.FinDeCarrera()
    toUpdate.push(...findecarrera.map((n) => {
      n.level = lastLevel + 1;
      return n
    }))

    nodes.update(toUpdate)
    network.body.emitter.emit("_dataChanged");
  }

  ///
  /// Logica de creditos y optativas
  ///

  const [creditos, setCreditos] = React.useState([]);

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

  const updateCreditos = () => {
    if (!nodes?.carrera) return;
    let creditos = [];
    const getCorrectCreditos = () => {
      if (user.carrera.eligeOrientaciones)
        return user.carrera.creditos.orientacion[user.orientacion?.nombre];
      return user.carrera.creditos;
    };

    const cbc = getters.CBC()
    creditos.push({
      ...CREDITOS['CBC'],
      creditosNecesarios: cbc.reduce(accCreditos, 0),
      creditos: cbc.reduce(accCreditos, 0),
      nmaterias: cbc.length,
    });

    const obligatorias = getters.ObligatoriasAprobadas()
    creditos.push({
      ...CREDITOS['Obligatorias'],
      creditosNecesarios: user.carrera.creditos.obligatorias,
      nmaterias: obligatorias.length,
      totalmaterias: getters.Obligatorias().length,
      creditos: obligatorias.reduce(accCreditos, 0),
    });

    const electivas = getters.ElectivasAprobadas()
    creditos.push({
      ...CREDITOS['Electivas'],
      creditosNecesarios: isNaN(getCorrectCreditos()?.electivas)
        ? getCorrectCreditos()?.electivas[user.finDeCarrera?.id]
        : getCorrectCreditos()?.electivas,

      nmaterias: electivas.length,
      creditos:
        electivas.reduce(accCreditos, 0) +
        optativas.reduce(accCreditos, 0),
    });

    const orientacion = getters.OrientacionAprobadas()
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
        nmaterias: orientacion.length,
        creditos: orientacion.reduce(accCreditos, 0),
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
      creditos.push({
        ...CREDITOS['Fin de Carrera'],
        nombre: node.materia,
        nombrecorto: user.finDeCarrera.id,
        creditosNecesarios: node.creditos,
        creditos: node.aprobada ? node.creditos : 0,
      });
    }

    const totalNecesarios = creditos.reduce(accCreditosNecesarios, 0);
    creditos.forEach((c) => {
      c.proportion =
        Math.round((c.creditosNecesarios / totalNecesarios) * 10) || 1;
    });

    const fullProportion = creditos.reduce(accProportion, 0);
    if (fullProportion > 10) creditos[1].proportion -= fullProportion - 10;
    else if (fullProportion < 10) creditos[1].proportion += 10 - fullProportion;
    setCreditos(creditos)
  };

  ///
  /// Logica de aplazos
  ///

  const [aplazos, setAplazos] = React.useState(0)


  ///
  /// Logica de interacción con el grafo
  ///

  const blurOthers = (id) => {
    const node = getNode(id)
    if (!node) return;

    let neighborNodes = getters.NeighborNodes(id)
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

    const neighborEdgesIds = getters.NeighborEdges(id)
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
      getters.Shown().map((n) => {
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

  const deselectNode = () => {
    unblurAll()
    setDisplayedNode("");
  }

  const selectNode = (id) => {
    unblurAll()
    blurOthers(id)
    setDisplayedNode(id);
  }

  let hovertimer = undefined;
  const events = {
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
    hoverNode: (e) => {
      const id = e.node;
      if (network.getSelectedNodes().length) {
        return
      }
      hovertimer = setTimeout(() => {
        selectNode(id)
      }, 300);
    },
    blurNode: () => {
      if (network.getSelectedNodes().length) {
        return
      }
      if (hovertimer) {
        clearTimeout(hovertimer);
        hovertimer = undefined;
      } else {
        deselectNode()
      }
    },
    selectNode: (e) => {
      if (hovertimer) {
        clearTimeout(hovertimer);
        hovertimer = undefined;
      }
      const id = e.nodes[0];
      if (id === "CBC") {
        toggleCBC();
        deselectNode()
        network.selectNodes([]);
        return
      }
      selectNode(id)
    },
    deselectNode: (e) => {
      if (hovertimer) {
        clearTimeout(hovertimer);
        hovertimer = undefined;
      }
      deselectNode()
    },
  };


  // Cambiar las optativas actualiza los creditos que actualiza el mapa...
  // Cambiar el colorMode tiene que actualizar el texto de las materias con texto afuera
  React.useEffect(() => {
    actualizar();
  }, [colorMode, optativas]);


  const transicionInformatica2020 = async () => {
    const planViejo = require("./data/informatica-1986.json")
    const findMateria = (id) => {
      return planViejo.find((m) => m.id === id)
    }

    let toUpdate = [];
    let creditosElectivas = 0

    const informaticaVieja = await getGraph(user.padron, "informatica")
    let aprobadas = informaticaVieja.materias.filter((m) => m.nota >= 0)
    // Primero, nos encargamos de algunos casos borde. Materias nuevas que equivalen a dos materias viejas
    const equivLenguajesCompiladores1 = aprobadas.filter((m) => m.id === '75.31' || m.id === '75.16' || m.id === '75.14')
    if (equivLenguajesCompiladores1.length >= 1) {
      const lenguajesCompiladoresI = getNode('ID09')
      toUpdate.push(lenguajesCompiladoresI.aprobar(equivLenguajesCompiladores1[0].nota));
    }
    equivLenguajesCompiladores1.slice(1).forEach((m) => {
      const materia = findMateria(m.id);
      if (materia) {
        creditosElectivas += materia.creditos;
      }
    });

    const equivtallerSeguridad = aprobadas.filter((m) => m.id === '66.69' || m.id === '66.20')
    if (equivtallerSeguridad.length >= 1) {
      const tallerSeguridad = getNode('ID22')
      toUpdate.push(tallerSeguridad.aprobar(equivtallerSeguridad[0].nota));
    }
    if (equivtallerSeguridad === 2) {
      creditosElectivas += 6
    }

    const legal = aprobadas.find((m) => m.id === '71.40');
    const equivBaseTecno = aprobadas.filter((m) => m.id === '71.46' || m.id === '71.18')
    if (legal && equivBaseTecno.length >= 1) {
      const baseTecnologica = getNode('ID19')
      toUpdate.push(baseTecnologica.aprobar(legal.nota));
    }
    if (equivBaseTecno.length === 2) {
      creditosElectivas += 6;
    }

    const tdd = aprobadas.find((m) => m.id === '75.10');
    let taller2 = aprobadas.find((m) => m.id === '75.52');
    if (!tdd && taller2) {
      const ingSoft2 = getNode('75.10');
      toUpdate.push(ingSoft2.aprobar(taller2.nota));
      taller2 = undefined; // Si uso taller para ing soft 2 no la puedo usar para distribuidos
    }

    // Descartamos las materias que acabamos de aplicar
    // tambien descarto el idioma, porque en el plan viejo no estaba especificado que idioma era el aprobado
    aprobadas = aprobadas.filter(m => !['78.xx', '75.31', '75.16', '75.14', '66.69', '66.20', '71.40', '71.46', '71.18', '75.52'].includes(m.id))
    // Ahora, aprobamos todas las materias directamente equivalentes, y nos cargamos
    // los creditos de las materias que ya no estan como creditos de electivas para el plan nuevo
    // No hacemos nada con las que estan en final...
    let creditosElectivasPlanNuevo = 0;
    for (const m of aprobadas) {
      let node = getNode(m.id)
      if (m.nota >= 0) {
        if (!node) {
          let materia = findMateria(m.id)
          creditosElectivas += materia.creditos
          continue
        };
        toUpdate.push(node.aprobar(m.nota));

        // Física 2 te da 4 creditos extra
        if (m.id === "62.03") {
          creditosElectivas += 4
        }

        // Analisis numerico te da 2 creditos extra
        if (m.id === "75.12") {
          creditosElectivas += 2
        }

        if (node.categoria === "Materias Electivas") {
          creditosElectivasPlanNuevo += node.creditos;
        }
      };
    }

    // Los creditos por optativas me los traigo de la carrera vieja
    creditosElectivas += informaticaVieja.optativas.reduce((acc, curr) => {
      return acc + curr.creditos
    }, 0)

    const tda = aprobadas.find((m) => m.id === '75.29');
    const modelos = aprobadas.find((m) => m.id === '71.14');
    const discreta = aprobadas.find((m) => m.id === '61.07');
    if (!tda && modelos) {
      const tdaNueva = getNode('75.29');
      toUpdate.push(tdaNueva.aprobar(modelos.nota));
      creditosElectivas -= 6; // por los 6 creditos de modelos que ya se sumaron
    } else if (!tda && discreta && creditosElectivas >= 8) {
      const tdaNueva = getNode('75.29');
      toUpdate.push(tdaNueva.aprobar(discreta.nota));
      creditosElectivas -= 8; // por los 6 creditos de discreta que ya se sumaron + 2 de la equivalencia
    }

    const distri = aprobadas.find((m) => m.id === '75.74');
    if (!distri && taller2 && creditosElectivas >= 2) {
      const distriNueva = getNode('75.74');
      toUpdate.push(distriNueva.aprobar(taller2.nota));
      creditosElectivas -= 2;
      taller2 = undefined;
    }

    if (taller2) {
      creditosElectivas += 4;
    }

    nodes.update(toUpdate.flat());
    actualizar();
    actualizarNiveles();
    const creditos = creditosElectivas >= (24 - creditosElectivasPlanNuevo) ? (24 - creditosElectivasPlanNuevo) : creditosElectivas;
    if (creditos > 0) {
      optativasDispatch({
        action: 'override', value: [{
          id: 1,
          nombre: "Vienen del Plan 1986",
          creditos,
        }]
      })
    };
    network.fit();
  }

  return {
    graph,
    toggleGroup,
    getNode,
    aprobar,
    desaprobar,
    redraw,
    creditos,
    setNetwork,
    setNodes,
    saveGraph,
    restartGraphCuatris,
    setEdges,
    changeCarrera,
    changeOrientacion,
    changeFinDeCarrera,
    toggleCheckbox,
    loadingGraph,
    setNeedsRegister,
    cursando,
    groupStatus,
    optativas,
    optativasDispatch,
    displayedNode,
    setDisplayedNode,
    getters,
    events,
    aplazos,
    setAplazos,
  };
};

export default useGraph;
