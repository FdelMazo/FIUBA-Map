import Graph from "react-graph-vis";
import React from "react";
import { Box } from "@chakra-ui/core";

const graph = {
  nodes: [
    { id: 1, label: "Node 1", color: "#e04141" },
    { id: 2, label: "Node 2", color: "#e09c41" },
    { id: 3, label: "Node 3", color: "#e0df41" },
    { id: 4, label: "Node 4", color: "#7be041" },
    { id: 5, label: "Node 5", color: "#41e0c9" },
  ],
  edges: [
    { from: 1, to: 2 },
    { from: 1, to: 3 },
    { from: 2, to: 4 },
    { from: 2, to: 5 },
  ],
};

const Body = () => {
  return (
    <Box flexGrow={5}>
      <Graph graph={graph} />
    </Box>
  );
};

export default Body;
