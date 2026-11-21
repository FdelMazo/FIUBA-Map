import { Badge, Flex, Tooltip, Text } from "@chakra-ui/react";
import { QuestionIcon } from "@chakra-ui/icons";
import React from "react";
import { GraphContext } from "../../MapContext";

// Cuando hay una materia seleccionada, te muestra el codigo, cuantos creditos da, etc
const MateriaStatus = () => {
  const { getNode, displayedNode } = React.useContext(GraphContext);
  const node = React.useMemo(
    () => (displayedNode ? getNode(displayedNode) : undefined),
    [displayedNode, getNode],
  );

  // Para el tooltip nativo (hover) cuando el nombre queda cortado
  const fullTitle = `[${node?.id}] ${node?.materia}`;

  // Mismo layout en todos los tamaños: "[codigo] nombre" en una linea (cortado si es largo)
  // y abajo los badges de creditos
  return displayedNode ? (
    <Flex direction="column" align="flex-start" flex={1} minW={0} gap={1}>
      <Text
        noOfLines={1}
        maxWidth={{ base: "30ch", md: "50ch" }}
        fontSize="sm"
        color="white"
        title={fullTitle}
      >
        <Text as="span" fontWeight="semibold">
          [{node?.id}]
        </Text>{" "}
        {node?.materia}
      </Text>

      <Flex gap={1} flexWrap="wrap">
        <Badge fontSize="2xs" px={1} colorScheme="green" variant="outline">
          {node?.id === "CBC"
            ? `Clickealo para ver las materias!`
            : `Otorga ${node?.creditos} créditos`}
        </Badge>

        {node?.requiere && (
          <Tooltip
            placement="bottom"
            label="El plan de estudios no es muy claro de si hay que contabilizar los créditos del CBC para esto, entonces no estoy seguro de que es válido acá. Además, los docentes suelen hacer lo que quieren con esto, así que toma todo con pinzas y asegurate de poder cursar la materia antes de anotarte."
          >
            <Badge fontSize="2xs" px={1} colorScheme="orange" variant="outline">
              Requiere {node?.requiere} créditos{" "}
              {node?.requiereCBC ? (
                "(con CBC)"
              ) : node?.requiereCBC === false ? (
                "(sin CBC)"
              ) : (
                <QuestionIcon />
              )}
            </Badge>
          </Tooltip>
        )}
      </Flex>
    </Flex>
  ) : (
    <></>
  );
};

export default MateriaStatus;
