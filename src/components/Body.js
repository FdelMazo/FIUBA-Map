import React from "react";
import { Box } from "@chakra-ui/core";
import { GraphContext } from "../Contexts";
import { Network, Node, Edge } from "@lifeomic/react-vis-network";

const Body = () => {
  const { graph, options, key } = React.useContext(GraphContext);
  const networkRef = React.useRef(null);

  const onClick = (e) => {
    const id = e.nodes[0];
    const node = networkRef.current.nodes.get(id).nodeRef;
    node.onClick(
      {},
      {
        network: networkRef.current.network,
        nodeArr: networkRef.current.nodes,
      }
    );
  };

  return (
    <Box minHeight="100%">
      <Network key={key} onClick={onClick} ref={networkRef} options={options}>
        {graph.nodes.map((n) => (
          <Node {...n} />
        ))}
        {graph.edges.map((e) => (
          <Edge {...e} />
        ))}
      </Network>
    </Box>
  );
};

export default Body;
