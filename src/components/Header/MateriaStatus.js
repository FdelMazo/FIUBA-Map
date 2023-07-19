import {
  Badge,
  Flex,
  Stat,
  StatHelpText,
  StatLabel,
  Tooltip,
  Text,
} from "@chakra-ui/react";
import {
  QuestionIcon
} from "@chakra-ui/icons";
import React from "react";
import { GraphContext, UserContext } from "../../MapContext";

// Cuando hay una materia seleccionada, te muestra el codigo, cuantos creditos da, etc
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
            <StatLabel>[{node?.id}]</StatLabel>
          <StatHelpText noOfLines={1}>
            {node?.materia}
          </StatHelpText>
        </Stat>
      )}

      <Flex direction={isMobile ? "row" : "column"} m="auto" gap={2} textAlign="center" alignSelf="center">
        <Badge
          width="100%"
          px={2}
          colorScheme="green"
          variant="outline"
        >
          {node?.id === "CBC" ? `Clickealo para ver las materias!` : `Otorga ${node?.creditos} créditos`}
        </Badge>

        {node?.requiere &&
          <Tooltip placement="bottom" label="El plan de estudios no es muy claro de si hay que contabilizar los créditos del CBC para esto, entonces no estoy seguro de que es válido acá. Además, los docentes suelen hacer lo que quieren con esto, así que toma todo con pinzas y asegurate de poder cursar la materia antes de anotarte.">
            <Badge
              width="100%"
              px={2}
              colorScheme="orange"
              variant="outline"
            >
              Requiere {node?.requiere} créditos {
                node?.requiereCBC ? "(con CBC)" :
                  node?.requiereCBC === false ? "(sin CBC)" :
                    <QuestionIcon />
              }
            </Badge>
          </Tooltip>
        }
      </Flex>
    </Flex>
  )
};

export default MateriaStatus;
