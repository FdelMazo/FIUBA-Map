/* eslint-disable react-hooks/exhaustive-deps */
import {
  Box,
  SlideFade,
  useColorModeValue,
} from "@chakra-ui/react";
import useResizeObserver from "use-resize-observer";
import React from "react";
import Graph from "react-graph-vis";
import Snowfall from "react-snowfall";
import * as C from "../../constants";
import { GraphContext, UserContext } from "../../Contexts";
import CategoryTagStack from "./CategoryTagStack";
import LoadingGraph from "./LoadingGraph";
import { Fireworks } from 'fireworks-js/dist/react'
import Controls from "./Controls";

const today = new Date();
const start = new Date(today.getFullYear(), 11, 19);
const end = new Date(today.getFullYear() + 1, 0, 1);
const isChristmasTime = today >= start && today <= end;

const Body = () => {
  const {
    graph,
    setNetwork,
    redraw,
    setNodes,
    setEdges,
    loadingGraph,
    stats,
    events,
  } = React.useContext(GraphContext);
  const { user, loggingIn } = React.useContext(UserContext);

  const { ref, width, height } = useResizeObserver();
  React.useEffect(redraw, [width, height]);

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
      <SlideFade in={loadingGraph || loggingIn} unmountOnExit>
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
