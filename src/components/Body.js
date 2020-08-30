import Graph from "react-graph-vis";
import React from "react";
import { Box } from "@chakra-ui/core";
import { GraphContext } from "../Contexts";

const Body = () => {
  const { graph, key, options, events } = React.useContext(GraphContext);

  return (
    <Box key={key} minHeight="100%">
      <Graph graph={graph} options={options} events={events} />
    </Box>
  );
};

export default Body;
