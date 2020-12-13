import React, { useEffect } from "react";
import {
  Box,
  Stack,
  IconButton,
  TagLabel,
  TagIcon,
  Tag,
  TagCloseButton,
  TagRightIcon,
  TagLeftIcon,
  Button,
} from "@chakra-ui/react";
import { SmallAddIcon } from "@chakra-ui/icons";
import { GraphContext } from "../Contexts";
import Graph from "react-graph-vis";
import * as C from "../constants";

const Body = () => {
  const { graph, options, carrera, key, toggleGroup } = React.useContext(
    GraphContext
  );
  const [displayedNode, setDisplayedNode] = React.useState({});
  const [network, setNetwork] = React.useState(null);
  const [nodes, setNodes] = React.useState(null);
  const [edges, setEdges] = React.useState(null);

  const events = {
    deselectNode: () => {
      setDisplayedNode({});
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
      <Stack position="absolute" right={0} mt={2} mr={2} zIndex={2}>
        {graph.groups
          .filter((c) => c != "CBC" && c != "Materias Obligatorias")
          .map((c) => (
            <Tag
              cursor="pointer"
              size="md"
              color="black"
              bg={C.GRUPOS[c].color}
              borderRadius="full"
              onClick={() => {
                toggleGroup(c, nodes);
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
        options={options}
        events={events}
      />
    </Box>
  );
};

export default Body;
