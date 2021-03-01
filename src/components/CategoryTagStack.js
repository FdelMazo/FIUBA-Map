import { AddIcon, MinusIcon } from "@chakra-ui/icons";
import { Stack, Tag, TagLabel, TagLeftIcon } from "@chakra-ui/react";
import React from "react";
import * as C from "../constants";
import { GraphContext } from "../Contexts";

const CategoryTagStack = (props) => {
  const { toggleGroup, isGroupHidden, nodes } = React.useContext(GraphContext);

  const [key, setKey] = React.useState(false);
  return (
    <Stack mb={3} ml={2} bottom={0} position="absolute" key={key} zIndex={2}>
      {nodes &&
        nodes
          .distinct("categoria")
          .filter(
            (c) =>
              c !== "CBC" &&
              c !== "Materias Obligatorias" &&
              c !== "Fin de Carrera (Obligatorio)" &&
              c !== "Fin de Carrera"
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
              <TagLeftIcon as={isGroupHidden(c) ? AddIcon : MinusIcon} />
              <TagLabel>{c}</TagLabel>
            </Tag>
          ))}
    </Stack>
  );
};

export default CategoryTagStack;
