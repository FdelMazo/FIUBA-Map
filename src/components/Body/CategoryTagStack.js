import {
  Icon,
  LightMode,
  SimpleGrid,
  Tag,
  TagLabel,
  TagLeftIcon,
} from "@chakra-ui/react";
import React from "react";
import { BiCircle } from "react-icons/bi";
import { RiFocus2Line, RiFocusLine } from "react-icons/ri";
import * as C from "../../constants";
import { GraphContext } from "../../MapContext";

// Componente para mostrar/ocultar grupos de materias
const CategoryTagStack = () => {
  const { toggleGroup, groupStatus, getters } = React.useContext(GraphContext);
  const categorias = React.useMemo(() => getters.SelectableCategorias(), [getters]);

  return (
    <LightMode>
      <SimpleGrid
        columns={categorias.length > 4 ? 2 : 1}
        mb={2}
        ml={2}
        spacing={2}
        bottom={0}
        position="absolute"
        maxW="60%"
      >
        {categorias.map((c) => (
            <Tag
              cursor="pointer"
              bg={C.GRUPOS[c]?.color}
              key={c}
              size={{ base: "sm", md: "md" }}
              onClick={() => {
                toggleGroup(c);
              }}
            >
              <TagLeftIcon
                as={() => {
                  switch (groupStatus(c)) {
                    case "hidden":
                      return (
                        <Icon boxSize={"1.3em"} as={BiCircle} mr="0.5rem" />
                      );
                    case "partial":
                      return (
                        <Icon boxSize={"1.3em"} as={RiFocusLine} mr="0.5rem" />
                      );
                    case "shown":
                      return (
                        <Icon boxSize={"1.3em"} as={RiFocus2Line} mr="0.5rem" />
                      );
                    default:
                      return;
                  }
                }}
              />
              <TagLabel>{c}</TagLabel>
            </Tag>
          ))}
      </SimpleGrid>
    </LightMode>
  );
};

export default CategoryTagStack;
