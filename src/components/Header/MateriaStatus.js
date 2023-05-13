import {
  Badge,
  Flex,
  Stat,
  StatLabel,
  Tooltip,
  Text,
} from "@chakra-ui/react";
import React from "react";
import { GraphContext, UserContext } from "../../Contexts";

const MateriaStatus = () => {
  const { isMobile } = React.useContext(UserContext);
  const { getNode, displayedNode } = React.useContext(GraphContext);

  const node = React.useMemo(() => getNode(displayedNode), [displayedNode, getNode])

  return displayedNode && (
    <Flex height="fit-content" flexWrap="wrap" gap={2}>
      {isMobile ? (
        <Text textAlign="center" noOfLines={1} width="100vw" px={8} color="white"><strong>[{node?.id}]</strong> {node?.materia}</Text>
      ) : (
          <Stat color="white" minWidth="16ch" maxWidth="30ch" mr="1">
            <StatLabel>{node?.materia}</StatLabel>
        </Stat>
      )}

      <Flex direction={isMobile ? "row" : "column"} m="auto" gap={2} textAlign="center" alignSelf="center">
        {node?.finales_para_cursar_str?.length > 0 &&
          <Badge
            width="100%"
            px={2}
            colorScheme="orange"
            variant="outline"
          >
                Finales para cursar:  {node?.finales_para_cursar_str?.join(" - ")} 
          </Badge>
        }
        {node?.cursadas_para_cursar_str?.length > 0 &&
          <Badge
            width="100%"
            px={2}
            colorScheme="orange"
            variant="outline"
          >
                Cursadas para cursar:  {node?.cursadas_para_cursar_str?.join(" - ")} 
          </Badge>
        }
        {node?.finales_para_rendir_str?.length > 0 &&
          <Badge
            width="100%"
            px={2}
            colorScheme="orange"
            variant="outline"
          >
                Finales para rendir final:  {node?.finales_para_rendir_str?.join(" - ")} 
          </Badge>
        }
      </Flex>
      <Flex direction={isMobile ? "row" : "column"} m="auto" gap={2} textAlign="center" alignSelf="center">
        {node?.requiere &&
            <Tooltip placement="bottom" label="">
              <Badge
                width="100%"
                px={2}
                colorScheme="red"
                variant="outline"
              >
                Requiere {node?.requiere}
              </Badge>
            </Tooltip>
        }
      </Flex>
    </Flex>
  )
};

export default MateriaStatus;
