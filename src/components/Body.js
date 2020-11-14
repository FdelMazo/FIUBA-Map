import React, { useEffect } from "react";
import {
  Box,
  Stack,
  IconButton,
  TagLabel,
  TagIcon,
  Tag,
  Button
} from "@chakra-ui/core";
import { GraphContext } from "../Contexts";
import Graph from "react-graph-vis";
import * as C from "../constants";

const Body = () => {
  const { graph, options, carrera, key, toggleGroup, isGroupHidden } = React.useContext(
    GraphContext
  );
  const [displayedNode, setDisplayedNode] = React.useState({});
  const [network, setNetwork] = React.useState(null);
  const [nodes, setNodes] = React.useState(null);
  const [edges, setEdges] = React.useState(null);

  const events = {
    deselectNode: () => {
      setDisplayedNode({})
    },
    selectNode: (e) => {
      const id = e.nodes[0];
      const node = nodes.get(id).nodeRef;
      node.onClick(
        { setDisplayedNode },
        {
          network,
          nodeArr: nodes,
        }
      );
    },
  };

  return (
    <Box minHeight="100%">
      <Tag position="absolute" zIndex={2}>
        {displayedNode.label}
      </Tag>
      <Stack position="absolute" right={0} zIndex={2}>
        {graph.groups
          .filter((c) => c != "CBC" && c != "Materias Obligatorias")
          .map((c) => {
            return (
            <Button bg={C.GRUPOS[c].color} as="button" borderRadius="md"
              onClick={() => {
                toggleGroup(c, graph.nodes, nodes);
              }}>
              <TagLabel>{c}</TagLabel>
            </Button>
          )})}
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
        options={options}
        events={events}
      />
    </Box>
  );
};

export default Body;
