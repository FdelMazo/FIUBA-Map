import React, { useEffect } from "react";
import {
  Box,
  Stack,
  IconButton,
  TagLabel,
  TagIcon,
  Tag,
} from "@chakra-ui/core";
import { GraphContext } from "../Contexts";
import {
  Network,
  Node,
  Edge,
  Cluster,
  ClusterByConnection,
} from "@lifeomic/react-vis-network";

const Body = () => {
  const { graph, options, key } = React.useContext(GraphContext);
  const networkRef = React.useRef(null);
  const [displayedNode, setDisplayedNode] = React.useState({});

  useEffect(() => {
    graph.clusters.forEach((c) => networkRef.current.network.cluster(c));
  }, [graph]);

  const onClick = (e) => {
    const id = e.nodes[0];
    const node = networkRef.current.nodes.get(id).nodeRef;

    node.onClick(
      { setDisplayedNode },
      {
        network: networkRef.current.network,
        nodeArr: networkRef.current.nodes,
      }
    );
  };

  return (
    <Box minHeight="100%">
      <Tag position="absolute" zIndex={2}>
        {displayedNode.label}
      </Tag>
      <Stack position="absolute" right={0} zIndex={2}>
        <Tag
          onClick={() => {
            if (graph.clusters)
              graph.clusters[0].toggle(networkRef.current.network);
          }}
          variantColor="cyan"
        >
          <TagLabel>Electivas</TagLabel>
          <TagIcon icon="check" size="12px" />
        </Tag>
      </Stack>
      <Network key={key} onClick={onClick} ref={networkRef} options={options}>
        <Cluster id={"Aaaa"} nodes={["CBC"]} />
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
