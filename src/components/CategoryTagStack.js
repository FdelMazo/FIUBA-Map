import { AddIcon, MinusIcon } from "@chakra-ui/icons";
import {
  HStack,
  LightMode,
  SimpleGrid,
  Tag,
  TagLabel,
  TagLeftIcon,
} from "@chakra-ui/react";
import React from "react";
import * as C from "../constants";
import { GraphContext } from "../Contexts";

const CategoryTagStack = (props) => {
  const {
    toggleGroup,
    isGroupHidden,
    toggleElectivas,
    electivasStatus,
    nodes,
  } = React.useContext(GraphContext);
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
            c !== "Fin de Carrera" &&
            c !== "Materias Electivas"
        )
    : [];

  return (
    <LightMode>
      <SimpleGrid
        columns={categorias.length + 1 > 4 ? 2 : 1}
        mb={3}
        ml={2}
        spacing={2}
        bottom={0}
        position="absolute"
        key={key}
      >
        {nodes && (
          <Tag
            cursor="pointer"
            bg={C.GRUPOS["Materias Electivas"]?.color}
            onClick={() => {
              setKey(!key);
              toggleElectivas();
            }}
          >
            <TagLeftIcon
              as={() => {
                switch (electivasStatus()) {
                  case "hidden":
                    return <AddIcon mr="0.5rem" />;
                  case "partial":
                    return (
                      <HStack spacing={0} mr="0.5rem">
                        <AddIcon />
                        <AddIcon />
                      </HStack>
                    );

                  case "shown":
                    return <MinusIcon mr="0.5rem" />;
                  default:
                    return;
                }
              }}
            />
            <TagLabel>Materias Electivas</TagLabel>
          </Tag>
        )}
        {nodes &&
          categorias.map((c) => (
            <Tag
              cursor="pointer"
              bg={C.GRUPOS[c]?.color}
              onClick={() => {
                setKey(!key);
                toggleGroup(c);
              }}
            >
              <TagLeftIcon as={isGroupHidden(c) ? AddIcon : MinusIcon} />
              <TagLabel>{c}</TagLabel>
            </Tag>
          ))}
      </SimpleGrid>
    </LightMode>
  );
};

export default CategoryTagStack;
