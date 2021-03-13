import { AddIcon, MinusIcon } from "@chakra-ui/icons";
import { HStack, Stack, Tag, TagLabel, TagLeftIcon } from "@chakra-ui/react";
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
  return (
    <Stack mb={3} ml={2} bottom={0} position="absolute" key={key} zIndex={2}>
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
                  return <AddIcon color='black' mr="0.5rem" />;
                case "partial":
                  return (
                    <HStack spacing={0} mr="0.5rem">
                      <AddIcon />
                      <AddIcon />
                    </HStack>
                  );

                case "shown":
                  return <MinusIcon color='black' mr="0.5rem" />;
                default:
                  return;
              }
            }}
          />
          <TagLabel color='black'>Materias Electivas</TagLabel>
        </Tag>
      )}
      {nodes &&
        nodes
          .distinct("categoria")
          .filter(
            (c) =>
              c !== "CBC" &&
              c !== "Materias Obligatorias" &&
              c !== "Fin de Carrera (Obligatorio)" &&
              c !== "Fin de Carrera" &&
              c !== "Materias Electivas"
          )
          .map((c) => (
            <Tag
              cursor="pointer"
              bg={C.GRUPOS[c]?.color}
              onClick={() => {
                setKey(!key);
                toggleGroup(c);
              }}
            >
              <TagLeftIcon color='black' as={isGroupHidden(c) ? AddIcon : MinusIcon} />
              <TagLabel color='black'>{c}</TagLabel>
            </Tag>
          ))}
    </Stack>
  );
};

export default CategoryTagStack;
