import { SmallAddIcon } from "@chakra-ui/icons";
import { Box, Stack, Tag, TagLabel, TagLeftIcon } from "@chakra-ui/react";
import React, { useEffect } from "react";
import Graph from "react-graph-vis";
import * as C from "../constants";
import { GraphContext, UserContext } from "../Contexts";

const Body = (props) => {
  const {
    graph,
    setGlobal,
    key,
    nodeFunctions,
    toggleGroup,
  } = React.useContext(GraphContext);
  const { aprobarSinNota } = nodeFunctions;

  const { logged } = React.useContext(UserContext);

  const [network, setNetwork] = React.useState(null);
  const [nodes, setNodes] = React.useState(null);
  const [edges, setEdges] = React.useState(null);
  useEffect(() => {
    setGlobal({ nodes, edges, network });
  }, [network, nodes, edges, setGlobal]);

  const { setDisplayedNode } = props;

  const events = {
    deselectNode: () => {
      setDisplayedNode("");
    },
    selectNode: (e) => {
      const id = e.nodes[0];
      setDisplayedNode(id);
      if (!logged) aprobarSinNota(id);
    },
  };

  return (
    <Box minHeight="100%">
      <Stack position="absolute" bottom={0} left={0} mb={2} ml={2} zIndex={2}>
        {graph.groups
          .filter((c) => c !== "CBC" && c !== "Materias Obligatorias")
          .map((c) => (
            <Tag
              cursor="pointer"
              size="md"
              color="black"
              bg={C.GRUPOS[c].color}
              borderRadius="full"
              onClick={() => {
                toggleGroup(c);
              }}
            >
              <TagLeftIcon boxSize="12px" as={SmallAddIcon} />
              <TagLabel>{c}</TagLabel>
            </Tag>
          ))}
      </Stack>
      <Graph
        key={key}
        graph={graph}
        getNetwork={(r) => {
          setNetwork(r);
        }}
        getNodes={(r) => {
          setNodes(r);
        }}
        getEdges={(r) => {
          setEdges(r);
        }}
        options={C.GRAPHOPTIONS}
        events={events}
      />
    </Box>
  );
};

export default Body;
