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
import { GraphContext } from "../../Contexts";

const CategoryTagStack = (props) => {
  const { toggleGroup, groupStatus, nodes } = React.useContext(GraphContext);
  const [key, setKey] = React.useState(false);
  const categorias = nodes
    ? nodes
      .distinct("categoria")
      .filter(
        (c) =>
          c !== "CBC" &&
          c !== "*CBC" &&
          c !== "Materias Obligatorias" &&
          c !== "Fin de Carrera (Obligatorio)" &&
          c !== "Fin de Carrera"
      )
    : [];

  const electivasIndex = categorias.indexOf("Materias Electivas");
  categorias[electivasIndex] = categorias[0];
  categorias[0] = "Materias Electivas";

  return (
    <LightMode>
      <SimpleGrid
        columns={categorias.length > 4 ? 2 : 1}
        mb={3}
        ml={2}
        spacing={2}
        bottom={0}
        position="absolute"
        key={key}
      >
        {nodes &&
          categorias.map((c) => (
            <Tag
              cursor="pointer"
              bg={C.GRUPOS[c]?.color}
              key={c}
              onClick={() => {
                setKey(!key);
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
