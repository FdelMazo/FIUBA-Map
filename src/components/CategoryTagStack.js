import { AddIcon, MinusIcon } from "@chakra-ui/icons";
import { Stack, Tag, TagLabel, TagLeftIcon } from "@chakra-ui/react";
import React from "react";
import * as C from "../constants";
import { GraphContext } from "../Contexts";

const CategoryTagStack = (props) => {
  const { toggleGroup, nodes } = React.useContext(GraphContext);

  const [key, setKey] = React.useState(false);
  return (
    <Stack mb={3} ml={2} bottom={0} position="absolute" key={key} zIndex={2}>
      {nodes &&
        nodes
          .get({ fields: ["categoria", "hidden"] })
          .filter(
            (c) =>
              c.categoria !== "CBC" &&
              c.categoria !== "Materias Obligatorias" &&
              c.categoria !== "Fin de Carrera"
          )
          .reduce(
            (acc, cur) => [
              ...acc.filter((obj) => obj.categoria !== cur.categoria),
              cur,
            ],
            []
          )
          .reverse()
          .map((c) => (
            <Tag
              cursor="pointer"
              bg={C.GRUPOS[c.categoria].color}
              borderRadius="full"
              onClick={() => {
                setKey(!key);
                toggleGroup(c.categoria);
              }}
            >
              <TagLeftIcon as={c.hidden ? AddIcon : MinusIcon} />
              <TagLabel>{c.categoria}</TagLabel>
            </Tag>
          ))}
    </Stack>
  );
};

export default CategoryTagStack;
