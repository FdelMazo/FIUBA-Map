import Graph from "react-graph-vis";
import React from "react";
import { Box } from "@chakra-ui/core";
import { GraphContext } from "../Contexts";

const Body = () => {
  const { graph, key, options } = React.useContext(GraphContext);

  return (
    <Box key={key} flexGrow={5}>
      <Graph graph={graph} options={options} />
    </Box>
  );
};

export default Body;
