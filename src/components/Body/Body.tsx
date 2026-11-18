import { Box, Icon, SlideFade, useColorModeValue } from "@chakra-ui/react";
import React from "react";
import { DataSet } from "vis-data";
import { Network, NetworkEvents } from "vis-network";
import Snowfall from "react-snowfall";
import * as C from "../../constants";
import { GraphContext, UserContext } from "../../MapContext";
import CategoryTagStack from "./CategoryTagStack";
import LoadingGraph from "./LoadingGraph";
import { Fireworks } from "@fireworks-js/react";
import Controls from "./Controls";
import { FaSnowflake } from "react-icons/fa";

const today = new Date();
const start = new Date(today.getFullYear(), 11, 19);
const end = new Date(today.getFullYear() + 1, 0, 1);
const isChristmasTime = today >= start && today <= end;

// Monta la red de vis.js sobre un div. Se crea una sola vez: cuando cambia la carrera,
// Body le cambia la key y se monta una red nueva
const VisGraph = () => {
  const { graph, events, createNetwork } = React.useContext(GraphContext);
  const container = React.useRef<HTMLDivElement>(null);
  const network = React.useRef<Network>();

  // useLayoutEffect (y no useEffect) para que la red y todo lo que dispara setNetwork
  // (cargar el mapa del usuario) pase antes de que el navegador pinte. Si no, se ve un flicker
  React.useLayoutEffect(() => {
    const data = {
      nodes: new DataSet(graph.nodes),
      edges: new DataSet(graph.edges),
    };
    network.current = new Network(container.current!, data, C.GRAPHOPTIONS);
    createNetwork(network.current);
    return () => network.current?.destroy();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Los handlers cierran sobre el estado de cada render, asi que los re-enganchamos siempre
  React.useLayoutEffect(() => {
    const net = network.current;
    if (!net) return;
    const entries = Object.entries(events) as [NetworkEvents, () => void][];
    entries.forEach(([name, handler]) => net.on(name, handler));
    return () => entries.forEach(([name, handler]) => net.off(name, handler));
  });

  return <div ref={container} style={{ width: "100%", height: "100%" }} />;
};

// Muestra el grafo y un par de pavadas mas
const Body = () => {
  const { networkRef, creditos } = React.useContext(GraphContext);
  const { user, loggingIn } = React.useContext(UserContext);
  const [snowfall, setSnowfall] = React.useState(true);

  const isRecibido = React.useMemo(() => {
    return (
      !!creditos.length &&
      creditos.every((c) => c.creditos >= c.creditosNecesarios)
    );
  }, [creditos]);

  return (
    <Box
      ref={networkRef}
      css={{ "& *:focus": { outline: "none" } }}
      bg={useColorModeValue("graphbg", "graphbgdark")}
      flexGrow="1"
      height="1em"
      position="relative"
    >
      {isRecibido && (
        <Fireworks
          options={{ traceSpeed: 1 }}
          style={{ width: "100%", height: "100%", position: "fixed" }}
        />
      )}
      <SlideFade in={loggingIn} unmountOnExit>
        <LoadingGraph />
      </SlideFade>
      <VisGraph key={user.carrera.id} />
      <CategoryTagStack />
      <Controls />
      {isChristmasTime && (
        <>
          <Icon
            top={0}
            left={0}
            mt={2}
            ml={2}
            position="absolute"
            as={FaSnowflake}
            opacity={snowfall ? 1 : 0.5}
            boxSize={5}
            cursor="pointer"
            color="darkgray"
            onClick={() => setSnowfall(!snowfall)}
          />
          {snowfall && <Snowfall color="lavender" />}
        </>
      )}
    </Box>
  );
};

export default Body;
