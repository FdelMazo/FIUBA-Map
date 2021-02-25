import { ChatIcon, EmailIcon, Icon } from "@chakra-ui/icons";
import {
  Box,
  Flex,
  IconButton,
  Link,
  SlideFade,
  Text,
  Textarea,
  Tooltip,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect } from "react";
import Graph from "react-graph-vis";
import * as C from "../constants";
import { GraphContext, UserContext } from "../Contexts";
import CategoryTagStack from "./CategoryTagStack";
import LoadingGraph from "./LoadingGraph";
import useWindowSize from "./useWindowSize";

const Body = (props) => {
  const {
    graph,
    redraw,
    aprobar,
    setNetwork,
    setNodes,
    setEdges,
    desaprobar,
    getNode,
    loadingGraph,
  } = React.useContext(GraphContext);
  const { user, logged, submitBug } = React.useContext(UserContext);
  const { width } = useWindowSize();
  const { setDisplayedNode } = props;
  const toast = useToast();

  useEffect(() => {
    toast({
      title: <Text color="black">FIUBA Map v2 - Beta</Text>,
      description: (
        <Box color="black" px={5} pb={5}>
          <Text>
            Hola, estoy testeando una nueva versión del FMap. Pero todavía le
            falta pulir bastaaaaaante.
          </Text>
          <Text>
            Si encontras algo feo, incorrecto, lento, erroneo... me decís?{" "}
          </Text>
          <Text>
            Si ves algo que te gustó, o tenes alguna sugerencia, también!
          </Text>
          <form
            onSubmit={(t) => {
              t.preventDefault();
              submitBug(t.target.elements["bug"].value);
            }}
          >
            <Flex alignItems="flex-end">
              <Textarea
                resize="none"
                focusBorderColor="black"
                size="sm"
                placeholder="Encontre un error en..."
                name="bug"
              />
              <IconButton
                ml={3}
                colorScheme="blackAlpha"
                size="sm"
                type="submit"
                icon={<ChatIcon />}
              />
            </Flex>
          </form>
        </Box>
      ),
      status: "info",
      position: "bottom-left",
      duration: null,
      isClosable: true,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setTimeout(redraw, 100);
  }, [width, redraw]);

  const events = {
    click: (e) => {
      const id = e.nodes[0];
      if (id === "CBC") return;
      const node = getNode(id);
      if (!node) {
        if (logged) setDisplayedNode("");
        return;
      }
      if (!node.aprobada) {
        aprobar(id, 7);
        if (logged) setDisplayedNode(id);
      } else {
        desaprobar(id);
        if (logged) setDisplayedNode("");
      }
    },
  };

  return (
    <Box bg="graph" flexGrow="1" height="1em" position="relative">
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

      <Box mb={3} mr={2} bottom={0} right={0} position="absolute" zIndex={2}>
        <Tooltip
          label="fdelmazo at fi.uba.ar"
          fontFamily="general"
          zIndex={5501}
          backgroundColor="tooltipBackground"
          placement="top"
        >
          <EmailIcon mr={2} boxSize={5} />
        </Tooltip>
        <Tooltip
          label="FdelMazo/FIUBA-Map"
          fontFamily="general"
          zIndex={5501}
          backgroundColor="tooltipBackground"
          placement="top"
        >
          <Link
            isExternal
            color="black"
            href="https://github.com/fdelmazo/FIUBA-Map"
          >
            <Icon boxSize={5} viewBox="0 0 16 16" color="black">
              <path
                fill="currentColor"
                d="M7.999,0.431c-4.285,0-7.76,3.474-7.76,7.761 c0,3.428,2.223,6.337,5.307,7.363c0.388,0.071,0.53-0.168,0.53-0.374c0-0.184-0.007-0.672-0.01-1.32 c-2.159,0.469-2.614-1.04-2.614-1.04c-0.353-0.896-0.862-1.135-0.862-1.135c-0.705-0.481,0.053-0.472,0.053-0.472 c0.779,0.055,1.189,0.8,1.189,0.8c0.692,1.186,1.816,0.843,2.258,0.645c0.071-0.502,0.271-0.843,0.493-1.037 C4.86,11.425,3.049,10.76,3.049,7.786c0-0.847,0.302-1.54,0.799-2.082C3.768,5.507,3.501,4.718,3.924,3.65 c0,0,0.652-0.209,2.134,0.796C6.677,4.273,7.34,4.187,8,4.184c0.659,0.003,1.323,0.089,1.943,0.261 c1.482-1.004,2.132-0.796,2.132-0.796c0.423,1.068,0.157,1.857,0.077,2.054c0.497,0.542,0.798,1.235,0.798,2.082 c0,2.981-1.814,3.637-3.543,3.829c0.279,0.24,0.527,0.713,0.527,1.437c0,1.037-0.01,1.874-0.01,2.129 c0,0.208,0.14,0.449,0.534,0.373c3.081-1.028,5.302-3.935,5.302-7.362C15.76,3.906,12.285,0.431,7.999,0.431z"
              />
            </Icon>
          </Link>
        </Tooltip>
      </Box>
    </Box>
  );
};

export default Body;
