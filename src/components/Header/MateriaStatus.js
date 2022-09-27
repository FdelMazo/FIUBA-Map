import {
  Badge,
  Flex,
  Stat,
  StatHelpText,
  StatLabel,
  Text,
} from "@chakra-ui/react";
import React from "react";
import { GraphContext, UserContext } from "../../Contexts";

const MateriaStatus = () => {
  const { isMobile } = React.useContext(UserContext);
  const { getNode, displayedNode } = React.useContext(GraphContext);

  const node = React.useMemo(() => getNode(displayedNode), [displayedNode, getNode])

  return displayedNode && (
    <Flex alignItems="flex-end" height="fit-content">
      {isMobile ? (
        <Text textAlign="center" noOfLines={1} width="100vw" px={8} color="white"><strong>[{node?.id}]</strong> {node?.materia}</Text>
      ) : (
          <Stat color="white" maxWidth="30ch">
            <StatLabel>[{node?.id}]</StatLabel>
          <StatHelpText noOfLines={1}>
            {node?.materia}
          </StatHelpText>
        </Stat>
      )}

    </Flex>
  )
};

export default MateriaStatus;
