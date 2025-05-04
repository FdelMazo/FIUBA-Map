import { Box, Icon, SlideFade, useColorModeValue } from "@chakra-ui/react";
import React from "react";
// @ts-ignore ignoramos porque react-graph-vis no tiene soporte para TypeScript
import Graph from "react-graph-vis";
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

// Muestra el grafo y un par de pavadas mas
const Body = () => {
  const { graph, createNetwork, networkRef, creditos, events } =
    React.useContext(GraphContext);
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
      <Graph
        key={user.carrera.id}
        graph={graph}
        getNetwork={createNetwork}
        options={C.GRAPHOPTIONS}
        events={events}
      />
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
