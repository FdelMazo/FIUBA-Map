/* eslint-disable react-hooks/exhaustive-deps */
import { useColorMode } from "@chakra-ui/color-mode";
import React from "react";
import CARRERAS from "./carreras";
import { CREDITOS } from "./constants";
import Node from "./Node";
import { COLORS } from "./theme";
import { accCreditos, accCreditosNecesarios, accProportion, overrideVisJsUpdate, promediar } from "./utils";

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
            c !== "CDN" &&
            c !== "*CDN" &&
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
    MateriasAprobadasCDN: () =>
      nodes ? nodes.get({
        filter: (n) => n.categoria === "*CDN" && n.aprobada && n.nota > 0,
        fields: ["nota"],
      }) : [],
    MateriasAprobadasSinCDN: () =>
      nodes ? nodes.get({
        filter: (n) => n.aprobada && n.nota >= 0 && n.categoria !== "*CDN" && n.categoria !== "CDN",
        fields: ["nota", "creditos"],
      }) : [],
    MateriasAprobadasSinEquivalenciasSinCDN: () =>
      nodes ? nodes.get({
        filter: (n) => n.aprobada && n.nota > 0 && n.categoria !== "*CDN" && n.categoria !== "CDN",
        fields: ["nota", "creditos"],
      }) : [],
    MateriasAprobadasConCDN: () =>
      nodes ? nodes
        .get({
          filter: (n) => n.aprobada && n.nota > 0,
          fields: ["nota", "creditos"],
        }) : [],
    CDN: () => nodes ? nodes
      .get({
        filter: (n) =>
          n.categoria === "*CDN",
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
          n.categoria !== "CDN" &&
          n.categoria !== "*CDN" &&
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
        filter: (n) => n.categoria !== "*CDN" && (n.cuatrimestre || n.nota >= -1)
      }) : [],
    Shown: () => nodes ? nodes
      .get({
        filter: (n) => !n.hidden
      }) : [],
    AllShown: () => nodes ? nodes
      .get({
        filter: (n) => !n.hidden &&
          n.categoria !== "CDN" &&
          n.categoria !== "*CDN" &&
          n.categoria !== "Fin de Carrera" &&
          n.categoria !== "Fin de Carrera (Obligatorio)"
      }) : [],
    AllShownWithCuatri: () => nodes ? nodes
      .get({
        filter: (n) => n.cuatrimestre &&
          !n.hidden &&
          n.categoria !== "CDN" &&
          n.categoria !== "*CDN"
      }) : [],
    AllShownWithoutCuatri: () => nodes ? nodes
      .get({
        filter: (n) =>
          !n.cuatrimestre &&
          !n.hidden &&
          n.originalLevel &&
          n.categoria !== "CDN" &&
          n.categoria !== "*CDN"
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

  ///
  /// Funcion clave: recorre todos los nodos y llama a nodo.actualizar()
  ///

  const actualizar = () => {
    if (!nodes?.carrera) return;
    updatePromedio()
    const creditosTotales = updateCreditos()
    nodes.update(
      nodes.map((n) =>
        getNode(n.id).actualizar({
          getters,
          user,
          network,
          getNode,
          creditosTotales,
          showLabels: logged,
          colorMode,
        })
      )
    );
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
        .then((metadata) => {
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
          setLoadingGraph(false);
        })
        .catch((e) => {
          aprobar("CDN", 0);
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
    aprobar("CDN", 0);
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
          graphEdges.push({ from: "CDN", to: n.id, color: "transparent" });
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
  const [stats, setStats] = React.useState({
    creditosTotales: 0,
    creditosTotalesNecesarios: 0,
    isRecibido: false,
  });

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

    const CDN = getters.CDN()
    creditos.push({
      ...CREDITOS['CDN'],
      creditosNecesarios: CDN.reduce(accCreditos, 0),
      creditos: CDN.reduce(accCreditos, 0),
      nmaterias: CDN.length,
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

    const aprobadas = [...getters.MateriasAprobadasSinCDN(), ...CDN, ...optativas]
    const creditosTotales = aprobadas.reduce(accCreditos, 0)
    const allCreditosAprobados = creditos.every(c => c.creditos >= c.creditosNecesarios);
    const creditosTotalesNecesarios = user.carrera?.creditos.total
    const isRecibido = creditosTotales >= user.carrera?.creditos.total && allCreditosAprobados

    setStats({
      creditosTotales,
      creditosTotalesNecesarios,
      isRecibido,
    });

    setCreditos(creditos)

    return creditosTotales
  };

  ///
  /// Logica de aplazos y promedio
  ///

  const [aplazos, setAplazos] = React.useState(0)
  const [promedio, setPromedio] = React.useState({
    promedio: 0,
    promedioConAplazos: 0,
    promedioConCDN: 0,
  })

  const updatePromedio = () => {
    setPromedio({
      promedio: promediar(getters.MateriasAprobadasSinEquivalenciasSinCDN()),
      promedioConAplazos: promediar([
        ...getters.MateriasAprobadasSinEquivalenciasSinCDN(),
        ...Array(aplazos).fill({ nota: 2 })
      ]),
      promedioConCDN: promediar(getters.MateriasAprobadasConCDN()),
    })
  }

  // Si cambian los aplazos, hay que actualizar el objeto promedio
  React.useEffect(() => {
    updatePromedio()
  }, [aplazos])

  ///
  /// Logica de interacción con el grafo
  ///

  const blurOthers = (id) => {
    const node = getNode(id)
    if (!node) return;

    let neighborNodes = getters.NeighborNodes(id)
    if (node.requiere) {
      neighborNodes = neighborNodes.filter((node) => node !== "CDN");
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
    network.selectNodes([]);
  }

  const selectNode = (id) => {
    unblurAll()
    blurOthers(id)
    setDisplayedNode(id);
  }

  let hovertimer = undefined;
  const events = {
    click: (e) => {
      // click: abre/cierra CDN
      // click en ningun nodo: limpiar blur/selection
      if (!e.nodes.length) {
        deselectNode()
        return;
      }
      const id = e.nodes[0];
    },
    doubleClick: (e) => {
      // dobleclick: aprobar/desaprobar
      const id = e.nodes[0];
      if (id === "CDN") return;
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
      if (!logged || id === "CDN") return;
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
      hovertimer = setTimeout(() => {
        selectNode(id)
        blurOthers(id)
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
        unblurAll()
      }
    },
    selectNode: (e) => {
      const id = e.nodes[0];
      if (hovertimer) {
        clearTimeout(hovertimer);
        hovertimer = undefined;
      }
      selectNode(id)
    },
  };


  // Cambiar las optativas actualiza los creditos que actualiza el mapa...
  // Cambiar el colorMode tiene que actualizar el texto de las materias con texto afuera
  React.useEffect(() => {
    actualizar();
  }, [colorMode, optativas]);

  return {
    graph,
    toggleGroup,
    getNode,
    aprobar,
    desaprobar,
    redraw,
    creditos,
    stats,
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
    promedio,
  };
};

export default useGraph;
