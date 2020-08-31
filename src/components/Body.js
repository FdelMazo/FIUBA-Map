import React from "react";
import { Box } from "@chakra-ui/core";
import { GraphContext } from "../Contexts";
import { Network, Node } from "@lifeomic/react-vis-network";

const Body = () => {
  const { graph, options } = React.useContext(GraphContext);
  const network = React.useRef(null);

  const onClick = (e) => {
    const id = e.nodes[0];
    const node = network.current.nodes._data[id].nodeRef;
    node.aprobar();
    network.current.nodes.update(node);
  };

  return (
    <Box minHeight="100%">
      <Network onClick={onClick} ref={network} options={options}>
        {graph.nodes.map((n) => (
          <Node {...n} />
        ))}
      </Network>
    </Box>
  );
};

export default Body;
