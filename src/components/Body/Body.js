/* eslint-disable react-hooks/exhaustive-deps */
import {
  Box,
  SlideFade,
  useColorModeValue,
  useConst,
} from "@chakra-ui/react";
import useResizeObserver from "use-resize-observer";
import React, { useEffect, useRef } from "react";
import Graph from "react-graph-vis";
import Snowfall from "react-snowfall";
import * as C from "../../constants";
import { GraphContext, UserContext } from "../../Contexts";
import CategoryTagStack from "./CategoryTagStack";
import LoadingGraph from "./LoadingGraph";
import { Fireworks } from 'fireworks-js/dist/react'
import Controls from "./Controls";

const Body = () => {
  const {
    graph,
    aprobar,
    setNetwork,
    redraw,
    setNodes,
    setEdges,
    desaprobar,
    getNode,
    edges,
    loadingGraph,
    network,
    openCBC,
    stats,
    nodes,
    setDisplayedNode
  } = React.useContext(GraphContext);
  const { user, logged } = React.useContext(UserContext);

  const ref = useRef(null);
  const { width, height } = useResizeObserver({ ref });
  useEffect(redraw, [width, height]);

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
    deselectNode: () => {
      unblurAll()
      setDisplayedNode("");
    },
  };

  const isChristmasTime = useConst(() => {
    const today = new Date();
    const start = new Date(today.getFullYear(), 11, 19);
    const end = new Date(today.getFullYear() + 1, 0, 1);
    return today >= start && today <= end;
  });

  return (
    <Box
      ref={ref}
      css={{ "& *:focus": { outline: "none" } }}
      bg={useColorModeValue("graphbg", "graphbgdark")}
      flexGrow="1"
      height="1em"
      position="relative"
    >
      {stats.isRecibido && <Fireworks options={{ speed: 3 }} style={{ width: '100%', height: '100%', position: 'fixed' }} />}
      {isChristmasTime && <Snowfall color="lavender" />}
      <SlideFade in={loadingGraph} unmountOnExit>
        <LoadingGraph />
      </SlideFade>
      <Graph
        key={user.carrera?.id}
        graph={graph}
        getNetwork={(r) => {
          setNetwork(r);
        }}
        getNodes={(r) => {
          r.carrera = user.carrera?.id;
          setNodes(r);
        }}
        getEdges={(r) => {
          setEdges(r);
        }}
        options={C.GRAPHOPTIONS}
        events={events}
      />
      <CategoryTagStack />
      <Controls />
    </Box>
  );
};

export default Body;
