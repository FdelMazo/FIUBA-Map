import { useColorMode } from "@chakra-ui/color-mode";
import React from "react";
import { CARRERAS } from "./carreras";
import { CREDITOS } from "./constants";
import Node from "./Node";
import { COLORS } from "./theme";
import { accCreditos, accCreditosNecesarios, accProportion } from "./utils";
import useResizeObserver from "use-resize-observer";

const Graph = (userContext) => {
  const { user, setUser, logged, saveUserGraph, register } = userContext;
  const { colorMode } = useColorMode();

  // Guardamos en el estado que nodo esta clickeado, para mostrarlo en el header
  const [displayedNode, setDisplayedNode] = React.useState("");

  // Guardamos cuantos aplazos se tienen para computar en el promedio
  const [aplazos, setAplazos] = React.useState(0);

  // La network es nuestra interfaz con visjs.
  // Nos da acceso a los nodos, las aristas y varias funciones
  // https://visjs.github.io/vis-network/docs/network/
  const [network, setNetwork] = React.useState(null);

  // Cuando cambia el tamaño de la pantalla, se redibuja la red. Sin esto, se rompe
  const { ref: networkRef, width, height } = useResizeObserver();
  React.useEffect(() => {
    if (!network) return;
    network.redraw();
    network.fit();
  }, [network, width, height]);

  const edges = React.useMemo(() => {
    return network?.body.data.edges;
  }, [network]);

  const nodes = React.useMemo(() => {
    return network?.body.data.nodes;
  }, [network]);

  // Para manipular los nodos, necesitamos acceso a la ref interna que les seteamos en el constructor
  const getNode = (id) => {
    return nodes?.get(id)?.nodeRef;
  };

  // Cuando cambia la carrera, cambia la key del body.
  // Cuando cambia la key del body, se llama a `createNetwork` que lo que hace es armar una red desde 0
  // Esta red despues se llena con el graph
  const createNetwork = (network) => {
    // Avoid re-rendering the whole graph when the data changes
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
    };

    // Limitar el zoom-in y el zoom-out
    const MIN_ZOOM = 0.4;
    const MAX_ZOOM = 1.7;
    let lastZoomPosition = { x: 0, y: 0 };
    network.on("zoom", () => {
      let scale = network.getScale();
      if (scale <= MIN_ZOOM) {
        network.moveTo({
          position: lastZoomPosition,
          scale: MIN_ZOOM,
        });
      } else if (scale >= MAX_ZOOM) {
        network.moveTo({
          position: lastZoomPosition,
          scale: MAX_ZOOM,
        });
      } else {
        lastZoomPosition = network.getViewPosition();
      }
    });
    network.on("dragEnd", () => {
      lastZoomPosition = network.getViewPosition();
    });

    // Le pongo una key al network para poder compararla contra la key del graph
    network.key = user.carrera.id;

    // Por mas que me encante este efecto, le agrega mucho tiempo de carga a la pagina antes de abrir
    // Lo dejo comentado nada mas por lo mucho que me gusta
    // https://stackoverflow.com/a/72950605/10728610
    // https://www.seancdavis.com/posts/mutlicolored-dotted-grid-canvas/
    // https://github.com/open-source-labs/Svelvet/blob/main/src/lib/containers/Background/Background.svelte
    // network.on("beforeDrawing", function (ctx) {
    //   var width = ctx.canvas.clientWidth;
    //   var height = ctx.canvas.clientHeight;
    //   var spacing = 24;
    //   var gridExtentFactor = 1.5;
    //   ctx.fillStyle = "darkgray"

    //   for (var x = -width * gridExtentFactor; x <= width * gridExtentFactor; x += spacing) {
    //     for (var y = -height * gridExtentFactor; y <= height * gridExtentFactor; y += spacing) {
    //       ctx.beginPath();
    //       ctx.arc(x, y, 1, 0, 2 * Math.PI, false);
    //       ctx.fill();
    //     }
    //   }
    // });

    setNetwork(network);
  };

  // El graph es el contenido de la red. Al cambiar la carrera se rellena con lo que tiene el json
  // y despues, con un useEffect, se rellena con lo que tiene el usuario en la DB
  const graph = React.useMemo(() => {
    // Esta mal que un useMemo no sea puro...
    // pero cuando se actualiza el grafo, por las dudas, limpiamos el nodo que teniamos elegido
    // test: entrar y clickear un nodo rapido, y esperar a que el usuario se loguee solo
    setDisplayedNode("");
    const nodes = user.carrera.graph.map((n) => new Node(n));
    const edges = user.carrera.graph.flatMap((n) => {
      let e = [];
      if (n.correlativas)
        n.correlativas.split("-").forEach((c) => {
          e.push({
            from: c,
            to: n.id,
            smooth: { enabled: true, type: "curvedCW", roundness: 0.1 },
          });
        });
      if (n.requiere) e.push({ from: "CBC", to: n.id, color: "transparent" });
      return e;
    });

    const groups = Array.from(
      new Set(user.carrera.graph.map((n) => n.categoria)),
    );

    // Para evitar que se actualice la red pero no el grafo, guardamos la carrera
    // y despues la usamos para chequear contra la carrera de la network
    const key = user.carrera.id;
    return { nodes, edges, groups, key };
  }, [user.carrera.graph, user.carrera.id]);

  // Cuando cambia la carrera, poblamos el nuevo grafo con lo que hay en la DB
  // (o, simplemente aprobamos el CBC si el usuario no tenia nada)
  React.useEffect(() => {
    if (!network || graph.key !== network.key) return;

    // Nos fijamos que el usuario tenga un mapa guardado en la db
    const map = user.maps.find((map) => map.carreraid === user.carrera.id)?.map;
    if (map) {
      const toUpdate = [];

      // Aprobamos/planeamos todo lo que tenia el usuario en la db
      map.materias.forEach((m) => {
        let node = getNode(m.id);
        if (!node) return;
        if (m.nota >= -1 || m.cuatrimestre) {
          if (m.nota >= -1) {
            node = node.aprobar(m.nota);
          }
          if (m.cuatrimestre) {
            node = node.cursando(m.cuatrimestre);
          }
          toUpdate.push(node);
        }
      });

      // Actualizamos su metadata
      map.checkboxes?.forEach((c) => toggleCheckbox(c));
      optativasDispatch({ action: "override", value: map.optativas ?? [] });
      setAplazos(map.aplazos || 0);

      // Si tiene orientacion setupeada, se lo mostramos
      if (
        user.orientacion &&
        groupStatus(user.orientacion.nombre) === "hidden"
      ) {
        toggleGroup(user.orientacion.nombre);
      }

      nodes.update(toUpdate);

      actualizar();
      actualizarNiveles();
      // Showrelevantes es para mostrar lo que el usuario quiere ver on boot:
      //   todo lo aprobado, todo lo planeado, etc
      // Es para evitar que cada vez que te logueas tengas que ponerte a clickear cosas en la UI hasta ver lo que queres
      showRelevantes();
      network.fit();
    } else {
      // Si no tengo mapa en la DB (porque me desloguee, o porque soy un usuario nuevo en esta carrera),
      //   reseteo absolutamente todo y solamente apruebo el CBC
      user.carrera.creditos.checkbox?.forEach((ch) => (ch.check = false));
      optativasDispatch({ action: "override", value: [] });
      setAplazos(0);
      nodes.update(
        getters
          .ALL()
          .map((n) => getNode(n.id).desaprobar().cursando(undefined)),
      );
      aprobar("CBC", 0);
      actualizarNiveles();
      network.fit();
    }
    // Solo queremos poblar el grafo cuando el usuario cambia de carrera
    // o cuando el usuario se loguea y cambia el padron
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.padron, graph.key, network]);

  // Funcion importantisimaaaa, recorre todos los nodos y los actualiza a todos
  // Se llama casi siempre que pasa algo.
  // Por ejemplo, cuando apruebo una materia, la llamo para que se actualizen todas las materias que habilita
  // En un mundo ideal, esto seria un useEffect que depende de que si cambian los nodos, se llama solo
  // Pero como visjs no es muy React-compatible, es mejor llamarlo a mano
  // Tambien, podría ser una suscripcion a la estructura "nodes" (https://visjs.github.io/vis-data/data/dataset.html#Subscriptions)
  // pero como las suscripciones son con callbacks fijos, y actualizar() depende de cosas extra a la network (como los creditos),
  // es bastante jodido estar siempre actualizando el callback
  // Eso si... si se refactorizara todo para que la network contenga todos los datos dentro suyo (optativas, creditos, etc), la suscripcion sería una mejor implementación
  const actualizar = () => {
    if (!network || graph.key !== network.key) return;
    const creditosTotales = [
      ...getters.MateriasAprobadasSinCBC(),
      ...getters.CBC(),
      ...optativas,
    ].reduce(accCreditos, 0);
    const creditosCBC = [...getters.CBC()].reduce(accCreditos, 0);
    nodes.update(
      nodes.map((n) =>
        getNode(n.id).actualizar({
          getters,
          user,
          network,
          getNode,
          creditos: { creditosTotales, creditosCBC },
          showLabels: logged,
          colorMode,
        }),
      ),
    );
    updateCreditos();
  };

  // Funcion incomprensible que recorre todos los nodos y le ordena los levels (las columnas) en base a mil cosas
  // Se debería llamar cada vez que cambia estructuralmente el grafo
  // (por ej: se muestran / ocultan las electivas, o se le setea el cuatrimestre a una materia)
  const actualizarNiveles = () => {
    // A la izq de todo, el CBC. Eso es constante

    const toUpdate = [];
    let lastLevel = Math.max(...getters.AllShown().map((n) => n.level));

    const conCuatri = getters.AllShownWithCuatri();
    const firstCuatri = Math.min(...conCuatri.map((n) => n.cuatrimestre));

    // Despues del CBC, las materias que tienen seteado el cuatrimestre
    // Como un estilo de "lo planeado a la izq, lo por planear a la der"
    // (la realidad es que si no planeas todas las materias obligatorias, queda bastante feo.
    // Tal vez despues de setupear la primera te forzas a setupear todas las demas)
    if (conCuatri.length) {
      lastLevel = 0;
      toUpdate.push(
        ...conCuatri.map((n) => {
          n.level = (n.cuatrimestre - firstCuatri) / 0.5 + lastLevel + 1;
          return n;
        }),
      );
      if (toUpdate.length)
        lastLevel = Math.max(...toUpdate.map((n) => n.level));
      const sinCuatri = getters.AllShownWithoutCuatri();
      if (sinCuatri.length) {
        const firstOffset = Math.min(...sinCuatri.map((n) => n.originalLevel));
        toUpdate.push(
          ...sinCuatri.map((n) => {
            const offset =
              isFinite(firstOffset) && n.originalLevel
                ? n.originalLevel - firstOffset
                : 0;
            n.level = lastLevel + offset + 1;
            return n;
          }),
        );
        if (toUpdate.length)
          lastLevel = Math.max(...toUpdate.map((n) => n.level));
      }
    }

    // Despues de las planeadas, las obligatorias no planeadas
    const noElectivasPeroSinNivel = getters.WithoutNivel();
    toUpdate.push(...balanceSinNivel(noElectivasPeroSinNivel, lastLevel));
    if (toUpdate.length) lastLevel = Math.max(...toUpdate.map((n) => n.level));

    // Despues las electivas no planeadas
    const electivas = getters.Electivas();
    toUpdate.push(...balanceSinNivel(electivas, lastLevel));

    if (toUpdate.length) lastLevel = Math.max(...toUpdate.map((n) => n.level));
    if (!isFinite(lastLevel)) {
      lastLevel = Math.max(...getters.Levels().map((n) => n.level));
    }

    // Finalmente, si no esta planeado, el final de carrera
    const findecarrera = getters.FinDeCarrera();
    toUpdate.push(
      ...findecarrera.map((n) => {
        n.level = lastLevel + 1;
        return n;
      }),
    );

    nodes.update(toUpdate);

    // Le tiramos un centro a visjs y le pedimos que redibuje
    network.body.emitter.emit("_dataChanged");
  };

  // Guarda el "mapa" en la base de datos, con toda su metadata:
  // - materias: solo nos importan las materias aprobadas o "planeadas" (con cuatrimestre)
  // - checkboxes: los booleanos tipo "aprobe ingles"
  // - optativas: los creditos que no estan en el plan que se agregaron
  // - aplazos: la cantidad de aplazos seteado
  const saveGraph = async () => {
    const materias = nodes.get({
      filter: (n) => n.aprobada || n.nota === -1 || n.cuatrimestre,
      fields: ["id", "nota", "cuatrimestre"],
    });
    const checkboxes = user.carrera.creditos.checkbox
      ?.filter((c) => c.check === true)
      .map((c) => c.nombre);
    return saveUserGraph(user, materias, checkboxes, optativas, aplazos);
  };

  ///
  // Interfaz de la UI con los cambios del usuario (carrera, orientacion, findecarrera)
  // Cada vez que cambia del usuario, se guarda en la DB para que quede guardado\
  // y la proxima vez que entre vaya directamente a esa carrera
  // (porque on boot se usa la ultima carrera registrada en la db)
  ///
  const changeCarrera = (id) => {
    // Nos fijamos si ya habia algun registro en la db
    const userdata = user.allLogins.find((l) => l.carreraid === id);
    const carrera = CARRERAS.find((c) => c.id === id);
    let newUser = { ...user, carrera, orientacion: null, finDeCarrera: null };
    if (userdata) {
      const orientacion = carrera.orientaciones?.find(
        (c) => c.nombre === userdata.orientacionid,
      );
      const finDeCarrera = carrera.finDeCarrera?.find(
        (c) => c.id === userdata.findecarreraid,
      );
      newUser = { ...newUser, orientacion, finDeCarrera };
    }
    if (logged) register(newUser);
    setUser(newUser);
  };

  const changeOrientacion = (id) => {
    const orientacion = user.carrera.orientaciones?.find(
      (c) => c.nombre === id,
    );
    const newUser = { ...user, orientacion };
    if (logged) register(newUser);
    setUser(newUser);
  };

  const changeFinDeCarrera = (id) => {
    const finDeCarrera = user.carrera.finDeCarrera?.find((c) => c.id === id);
    const newUser = { ...user, finDeCarrera };
    if (logged) register(newUser);
    setUser(newUser);
  };

  ///
  // Interfaz de botones de la UI con los nodos
  ///
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
    actualizarNiveles();
  };

  const restartGraphCuatris = () => {
    nodes.update(
      getters.Cuatrimestres().map((n) => getNode(n.id).cursando(undefined)),
    );
    actualizar();
    actualizarNiveles();
  };

  const toggleCheckbox = (c) => {
    if (!user.carrera.creditos.checkbox.find((ch) => ch.nombre === c)) {
      return;
    }

    const value = !!user.carrera.creditos.checkbox.find((ch) => ch.nombre === c)
      .check;
    user.carrera.creditos.checkbox.find((ch) => ch.nombre === c).check = !value;
    actualizar();
  };

  // Clickear en la materia "CBC" te muestra las materias adentro del CBC
  const toggleCBC = () => {
    const categoria = getters.CBC();
    categoria.forEach((n) => {
      const node = getNode(n.id);
      node.hidden = !node.hidden;
      return node;
    });
    actualizar();
    actualizarNiveles();

    const isOpening = categoria.some((n) => !n.hidden);
    const { x, y } = network.getViewPosition();

    // El 150 esta hardcodeado a la dif de la posicion del nodo del CBC
    // cuando se prende y cuando se apaga
    if (isOpening) {
      network.moveTo({ position: { x: x - 150, y } });
    } else {
      network.moveTo({ position: { x: x + 150, y } });
    }
  };

  ///
  /// Manejo de grupos/categorias y sus niveles
  ///

  // Un grupo puede estar enteramente mostrado, parcialmente mostrado, enteramente oculto
  // "Parcialmente mostrado" es para que cuando yo abro las electivas, me muestre solamente las relevantes en vez del choclo entero
  //   relevantes: planeadas o aprobadas
  // TODO: lo malo de mostrar materias parciales, es que si mostras aprobaste una materia pero no sus correlativas (caso borde),
  //  se va a mostrar una materia flotando, porque sus correlativas no estan presentes
  //  Tal vez habria que agregar para mostrar todas las relevantes y todas sus correlativas
  const groupStatus = (categoria) => {
    const status = [
      ...new Set(getters.CategoriaOnly(categoria).map((n) => n.hidden)),
    ];
    if (status.length === 1) {
      return status[0] ? "hidden" : "shown";
    }
    return "partial";
  };

  // Si esta oculto, lo muestro parcialmente
  // Si esta mostrado parcialmente, lo muestro enteramente
  // Si esta mostrado enteramente, lo oculto
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
        group = getters.CategoriaOnly(categoria).map((n) => {
          const node = getNode(n.id);
          node.hidden = false;
          return node;
        });
        break;
      case "shown":
        group = getters.CategoriaOnly(categoria).map((n) => {
          const node = getNode(n.id);
          node.hidden = true;
          return node;
        });
        if (group.map((n) => n.id).includes(network.getSelectedNodes()[0])) {
          deselectNode();
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

  // Se usa on boot para mostrar tooodo lo que le interesa al usuario, y evitarle clicks en la UI ni bien entra
  // Relevantes: aprobadas o planeadas
  const showRelevantes = () => {
    const relevantes = getters.AllRelevantes().map((n) => {
      const node = getNode(n.id);
      node.hidden = false;
      return node;
    });

    nodes.update(relevantes);
    actualizar();
    actualizarNiveles();
    network.fit();
  };

  // Cuando un grupo tiene muchas materias (por ej: tengo 40 electivas), queremos que no sea una columna de muchas materias al hilo
  // Entonces, hacemos que se muestren en columnas de a 7 materias, ordenadas por prioridad (aprobadas mas arriba que desaprobadas, por ej)
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
    return electivas;
  };

  // Las optativas son materias que te agregan creditos que no estan en el plan de la carrera
  // Les asignamos solamente el nombre y la cantidad de creditos que otorgan (porque la nota no influye en el promedio)
  const [optativas, optativasDispatch] = React.useReducer(
    (prevstate, dispatched) => {
      let newstate = prevstate;
      const { action, value } = dispatched;
      switch (action) {
        case "override":
          newstate = value;
          break;
        case "create":
          const lastOptativaId = prevstate.map((o) => o.id).pop() || 0;
          newstate = [
            ...newstate,
            {
              id: lastOptativaId + 1,
              nombre: "Materia Optativa",
              creditos: 4,
            },
          ];
          break;
        case "remove":
          newstate = prevstate.filter((o) => o.id !== value.id);
          break;
        case "edit":
          newstate = prevstate.map((o) => (o.id === value.id ? value : o));
          break;
        default:
          return newstate;
      }
      return newstate;
    },
    [],
  );

  // Hay distintos creditos para almacenar (los de las obligatorias, los de las electivas, etc)
  // Guardamos un array y lo vamos llenando de objetos que contienen:
  // - El nombre y el color del conjunto de creditos
  // - Cuantos creditos se necesitan para aprobar ese conjunto entero
  // - Cuantos creditos se tienen actualmente
  // Hay que llamar a mano a `updateCreditos` en vez de que sea un useMemo porque
  // visjs no es muy reactivo... si se pudiese, habria que hacer que dependamos solamente de nodes
  // y evitar la llamada a mano
  const [creditos, setCreditos] = React.useState([]);

  const updateCreditos = () => {
    if (!network || graph.key !== network.key) return [];
    let creditos = [];

    // La estructura de las carreras varia bastante
    // Por ej: algunas carreras dicen que si elegis X orientacion, tenes que hacer otra cantidad de creditos de electivas
    const getCorrectCreditos = () => {
      if (user.carrera.eligeOrientaciones)
        return user.carrera.creditos.orientacion[user.orientacion?.nombre];
      return user.carrera.creditos;
    };

    // Primeros creditos a mostrar: los 38 del CBC
    // Lo mostramos como siempre aprobado del todo
    const cbc = getters.CBC();
    creditos.push({
      ...CREDITOS["CBC"],
      creditosNecesarios: cbc.reduce(accCreditos, 0),
      creditos: cbc.reduce(accCreditos, 0),
      nmaterias: cbc.length,
    });

    // Despues, las obligatorias
    const allObligatorias = getters.Obligatorias();
    const obligatorias = getters.ObligatoriasAprobadas();
    creditos.push({
      ...CREDITOS["Obligatorias"],
      creditosNecesarios: allObligatorias.reduce(accCreditos, 0),
      nmaterias: obligatorias.length,
      totalmaterias: allObligatorias.length,
      creditos: obligatorias.reduce(accCreditos, 0),
    });

    // Despues, las electivas, incluyendo las orientaciones no elegidas
    const electivas = getters.ElectivasAprobadas();
    const electivasCreditosNecesarios = isNaN(getCorrectCreditos()?.electivas)
      ? getCorrectCreditos()?.electivas[user.finDeCarrera?.id]
      : getCorrectCreditos()?.electivas;
    creditos.push({
      ...CREDITOS["Electivas"],
      creditosNecesarios: electivasCreditosNecesarios,
      nmaterias: electivas.length,
      creditos:
        electivas.reduce(accCreditos, 0) + optativas.reduce(accCreditos, 0),
      helpText:
        !electivasCreditosNecesarios &&
        `Elegí ${user.carrera.eligeOrientaciones && !user.orientacion ? "orientación" : ""}${user.carrera.eligeOrientaciones && !user.orientacion && !user.finDeCarrera ? " y " : ""}${!user.finDeCarrera ? "entre tesis y tpp" : ""} en la configuración de usuario para saber cuantos necesitás.`,
    });

    // Despues, orientacion obligatoria (si hay)
    const orientacion = getters.OrientacionAprobadas();
    if (user.carrera.eligeOrientaciones)
      if (
        user.orientacion &&
        user.carrera.creditos.orientacion[user.orientacion?.nombre]
      ) {
        creditos.push({
          nombre: `Orientación: ${user.orientacion.nombre}`,
          nombrecorto: "Orientación",
          bg: COLORS[user.orientacion.colorScheme][50],
          color: user.orientacion.colorScheme,
          creditosNecesarios: getCorrectCreditos()?.orientacion,
          nmaterias: orientacion.length,
          creditos: orientacion.reduce(accCreditos, 0),
        });
      } else {
        creditos.push({
          nombre: `Orientación`,
          nombrecorto: "Orientación",
          color: "orientacion1",
          bg: COLORS.orientacion1[50],
          creditosNecesarios: 8,
          creditos: 0,
          dummy: true,
          helpText: "Elegí una orientación en la configuración de usuario",
        });
      }

    // Despues los distintos checkboxes (practica profesional, ingles, etc)
    // aca le setupeamos que tiene 8 creditos para llenar, para tener una barra de progreso
    // pero estos creditos que le pusimos no son reales.
    // Siempre que hay que obtener el numero de creditos que tenemos, hay que sacar los por checkbox: true
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
          dummy: true,
        });
      });
    }

    // Despues, las materias obligatorias para recibirte (final de carrera obligatorio)
    // Esto incluye los finales de carrera de las carreras que NO pueden elegir entre tesis/tpp
    // OJO: si el día de mañana se quisiese dar un lugar especial a X materia,
    //  por ejemplo: aprobar la materia electiva ingles cuenta como aprobar el examen de ingles
    //  habria que asegurarse de que sus creditos no se doble cuenten en el total
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

    // Si la carrera tiene para elegir entre tesis y tpp, de la misma manera que las materias de arriba
    // agregamos el final de carrera que corresponda
    if (user.carrera.finDeCarrera) {
      if (user.finDeCarrera) {
        const node = getNode(user.finDeCarrera.materia);
        creditos.push({
          ...CREDITOS["Fin de Carrera"],
          nombre: node.materia,
          nombrecorto: user.finDeCarrera.id,
          creditosNecesarios: node.creditos,
          creditos: node.aprobada ? node.creditos : 0,
        });
      } else {
        creditos.push({
          ...CREDITOS["Fin de Carrera"],
          creditosNecesarios: 8,
          creditos: 0,
          dummy: true,
          helpText: "Elegí entre tésis o tpp en la configuración de usuario",
        });
      }
    }

    // Hacemos que el tamaño de las barritas sea proporcional a su peso sobre el total para recibirte
    const totalNecesarios = creditos.reduce(accCreditosNecesarios, 0);
    creditos.forEach((c) => {
      c.proportion =
        Math.round((c.creditosNecesarios / totalNecesarios) * 10) || 1;
    });

    const fullProportion = creditos.reduce(accProportion, 0);
    if (fullProportion > 10) creditos[1].proportion -= fullProportion - 10;
    else if (fullProportion < 10) creditos[1].proportion += 10 - fullProportion;
    setCreditos(creditos);
  };

  ///
  // Logica de eventos (clicks, hovers, etc)
  ///

  // Cuando tengo un nodo seleccionado, quiero que todos los demas sean mas transparentes
  // y tener foco solamente sobre el nodo, sus aristas, y sus correlativas
  const blurOthers = (id) => {
    const node = getNode(id);
    if (!node) return;

    let neighborNodes = getters.NeighborNodes(id);
    if (node.requiere) {
      neighborNodes = neighborNodes.filter((node) => node !== "CBC");
    }

    const allOtherNodes = nodes.get({
      filter: function (n) {
        return (
          !neighborNodes.includes(n.id) && !(n.id === node.id) && !n.hidden
        );
      },
    });
    nodes.update(
      allOtherNodes.map((n) => {
        n.opacity = 0.3;
        return n;
      }),
    );

    const neighborEdgesIds = getters.NeighborEdges(id);
    const neighborEdges = edges.get({
      filter: function (edge) {
        return (
          neighborEdgesIds.includes(edge.id) && edge.color !== "transparent"
        );
      },
    });
    edges.update(
      neighborEdges.map((edge) => {
        edge.hoverWidth = 2;
        edge.selectionWidth = 2;
        edge.arrows = { to: { scaleFactor: 0.7 } };
        edge.color = { opacity: 1 };
        return edge;
      }),
    );
  };

  // Reseteamos al estado original: todos los nodos opacos
  const unblurAll = () => {
    nodes.update(
      getters.Shown().map((n) => {
        n.opacity = undefined;
        return n;
      }),
    );

    const neighborEdges = edges.get({
      filter: function (edge) {
        return edge.color !== "transparent" && edge.selectionWidth === 2;
      },
    });
    edges.update(
      neighborEdges.map((edge) => {
        edge.selectionWidth = undefined;
        edge.hoverWidth = undefined;
        edge.arrows = undefined;
        edge.color = undefined;
        return edge;
      }),
    );
  };

  const selectNode = (id, display = false) => {
    unblurAll();
    blurOthers(id);
    if (display) setDisplayedNode(id);
  };

  const deselectNode = (display = false) => {
    unblurAll();
    if (displayedNode && display) {
      setDisplayedNode("");
    }
  };

  let hovertimer = undefined;

  // Interacción con el mouse
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
      // hover: seleccionar nodo para ver sus correlativas facilmente
      const id = e.node;
      if (network.getSelectedNodes().length) {
        return;
      }

      // Hacemos que esto solo suceda despues de un tiempo, para evitar que
      // cuando pasamos el mouse asi nomas se seleccione el nodo
      clearTimeout(hovertimer);
      hovertimer = setTimeout(() => {
        selectNode(id);
      }, 300);
    },
    blurNode: () => {
      // unhover: volvemos al estado original
      clearTimeout(hovertimer);
      hovertimer = undefined;

      if (network.getSelectedNodes().length) {
        return;
      }
      deselectNode();
    },
    selectNode: (e) => {
      // click: seleccionar un nodo
      const id = e.nodes[0];

      // Si clickeo el CBC, lo abro/cierro
      if (id === "CBC") {
        toggleCBC();
        deselectNode();
        network.selectNodes([]);
        return;
      }
      selectNode(id, true);
    },
    deselectNode: (e) => {
      // click en otro nodo/click en cualquier lado del mapa: deseleccionar lo que teniamos
      deselectNode(true);
    },
  };

  // Definimos muuuuchos getters para tener acceso a todo tipo de nodos y no andar repitiendo todo
  const getters = {
    NodesFrom: (id) => network.getConnectedNodes(id, "from"),
    NodesTo: (id) => network.getConnectedNodes(id, "to"),
    NeighborNodes: (id) => network.getConnectedNodes(id),
    NeighborEdges: (id) => network.getConnectedEdges(id),
    Cuatrimestres: () =>
      nodes
        ? nodes.get({
            filter: (n) => n.cuatrimestre,
            fields: ["id", "cuatrimestre"],
          })
        : [],
    SelectableCategorias: () => {
      const categorias = nodes
        ? nodes
            .distinct("categoria")
            .filter(
              (c) =>
                c !== "CBC" &&
                c !== "*CBC" &&
                c !== "Materias Obligatorias" &&
                c !== "Fin de Carrera (Obligatorio)" &&
                c !== "Fin de Carrera",
            )
        : [];
      if (categorias.indexOf("Materias Electivas") > 0) {
        categorias.splice(categorias.indexOf("Materias Electivas"), 1);
        categorias.unshift("Materias Electivas");
      }
      return categorias;
    },
    ALL: () => (nodes ? nodes.get() : []),
    MateriasAprobadasCBC: () =>
      nodes
        ? nodes.get({
            filter: (n) => n.categoria === "*CBC" && n.aprobada && n.nota > 0,
            fields: ["nota"],
          })
        : [],
    MateriasAprobadasSinCBC: () =>
      nodes
        ? nodes.get({
            filter: (n) =>
              n.aprobada &&
              n.nota >= 0 &&
              n.categoria !== "*CBC" &&
              n.categoria !== "CBC",
            fields: ["nota", "creditos"],
          })
        : [],
    MateriasAprobadasSinEquivalenciasSinCBC: () =>
      nodes
        ? nodes.get({
            filter: (n) =>
              n.aprobada &&
              n.nota > 0 &&
              n.categoria !== "*CBC" &&
              n.categoria !== "CBC",
            fields: ["nota", "creditos"],
          })
        : [],
    MateriasAprobadasConCBC: () =>
      nodes
        ? nodes.get({
            filter: (n) => n.aprobada && n.nota > 0,
            fields: ["nota", "creditos"],
          })
        : [],
    CBC: () =>
      nodes
        ? nodes.get({
            filter: (n) => n.categoria === "*CBC",
          })
        : [],
    Obligatorias: () =>
      nodes
        ? nodes.get({
            filter: (n) => n.categoria === "Materias Obligatorias",
            fields: ["creditos"],
          })
        : [],
    ObligatoriasAprobadas: () =>
      nodes
        ? nodes.get({
            filter: (n) =>
              n.categoria === "Materias Obligatorias" &&
              n.aprobada &&
              n.nota >= 0,
            fields: ["creditos"],
          })
        : [],
    ElectivasAprobadas: () =>
      nodes
        ? nodes.get({
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
        : [],
    OrientacionAprobadas: () =>
      nodes
        ? nodes.get({
            filter: (n) =>
              n.categoria === user.orientacion?.nombre &&
              n.aprobada &&
              n.nota >= 0,
            fields: ["creditos"],
          })
        : [],
    CategoriaOnly: (categoria) =>
      nodes
        ? nodes.get({
            filter: (n) => n.categoria === categoria,
          })
        : [],
    CategoriaRelevantes: (categoria) =>
      nodes
        ? nodes.get({
            filter: (n) =>
              n.categoria === categoria && (n.cuatrimestre || n.nota >= -1),
          })
        : [],
    AllRelevantes: () =>
      nodes
        ? nodes.get({
            filter: (n) =>
              n.categoria !== "*CBC" && (n.cuatrimestre || n.nota >= -1),
          })
        : [],
    Shown: () =>
      nodes
        ? nodes.get({
            filter: (n) => !n.hidden,
          })
        : [],
    AllShown: () =>
      nodes
        ? nodes.get({
            filter: (n) =>
              !n.hidden &&
              n.categoria !== "CBC" &&
              n.categoria !== "*CBC" &&
              n.categoria !== "Fin de Carrera" &&
              n.categoria !== "Fin de Carrera (Obligatorio)",
          })
        : [],
    AllShownWithCuatri: () =>
      nodes
        ? nodes.get({
            filter: (n) =>
              n.cuatrimestre &&
              !n.hidden &&
              n.categoria !== "CBC" &&
              n.categoria !== "*CBC",
          })
        : [],
    AllShownWithoutCuatri: () =>
      nodes
        ? nodes.get({
            filter: (n) =>
              !n.cuatrimestre &&
              !n.hidden &&
              n.originalLevel &&
              n.categoria !== "CBC" &&
              n.categoria !== "*CBC",
          })
        : [],
    WithoutNivel: () =>
      nodes
        ? nodes.get({
            filter: (n) =>
              n.categoria !== "Materias Electivas" &&
              n.categoria !== "Fin de Carrera" &&
              n.categoria !== "Fin de Carrera (Obligatorio)" &&
              !n.hidden &&
              !n.cuatrimestre &&
              !n.originalLevel &&
              n.originalLevel !== 0,
          })
        : [],
    Electivas: () =>
      nodes
        ? nodes.get({
            filter: (n) =>
              n.categoria === "Materias Electivas" &&
              !n.hidden &&
              !n.cuatrimestre,
          })
        : [],
    Levels: () =>
      nodes
        ? nodes.get({
            filter: (n) =>
              !n.hidden &&
              n.categoria !== "Fin de Carrera" &&
              n.categoria !== "Fin de Carrera (Obligatorio)",
            fields: ["level"],
            type: { level: "number" },
          })
        : [],
    FinDeCarrera: () =>
      nodes
        ? nodes.get({
            filter: (n) =>
              (n.categoria === "Fin de Carrera" ||
                n.categoria === "Fin de Carrera (Obligatorio)") &&
              !n.hidden &&
              !n.cuatrimestre,
          })
        : [],
  };

  // Escape hatches: forzar actualizaciones
  // - Cuando el usuario se desloguea/loguea, cambian las labels
  // - Cambiar las optativas agrega creditos, lo cual puede habilitar materias
  // - Cambiar el colorMode cambia el color de la label
  // - Cambiar la orientacion hace que se cambien los creditos
  // - Cambiar el fin de carrera hace que se muestren otras materias
  React.useEffect(() => {
    if (!network || graph.key !== network.key) return;
    actualizar();
    actualizarNiveles();
    // Sabemos clavado en que momentos queremos forzar una actualización
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    logged,
    colorMode,
    optativas,
    user.orientacion?.nombre,
    user.finDeCarrera?.id,
  ]);

  return {
    graph,
    toggleGroup,
    getNode,
    aprobar,
    desaprobar,
    creditos,
    setNetwork,
    saveGraph,
    restartGraphCuatris,
    changeCarrera,
    changeOrientacion,
    changeFinDeCarrera,
    toggleCheckbox,
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
    createNetwork,
    networkRef,
  };
};

export default Graph;
