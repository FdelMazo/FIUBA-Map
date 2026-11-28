import { AddIcon } from "@chakra-ui/icons";
import {
  Tag,
  TagLabel,
  TagLeftIcon,
  Text,
  Tooltip,
  useColorModeValue,
} from "@chakra-ui/react";
import React from "react";
import { GraphContext } from "../../MapContext";

// Boton para agregar materias por fuera del plan (optativas)
// Se editan desde el header, como cualquier otra materia
const AddOptativaButton = () => {
  const { crearOptativa } = React.useContext(GraphContext);
  const tagBg = useColorModeValue("blackAlpha.200", "whiteAlpha.300");

  return (
    <Tooltip
      placement="top-start"
      hasArrow
      label={
        <>
          <Text>
            Las materias optativas contabilizan como materias electivas.
          </Text>
          <Text>
            Pueden ser materias dadas en otra carrera, cursos de posgrado, o
            créditos otorgados por cualquier otro motivo que la curricular
            avale.
          </Text>
        </>
      }
    >
      <Tag
        cursor="pointer"
        bg={tagBg}
        size={{ base: "sm", md: "md" }}
        w="fit-content"
        onClick={crearOptativa}
      >
        <TagLeftIcon as={AddIcon} boxSize="0.8em" />
        <TagLabel>Agregar Materia Optativa</TagLabel>
      </Tag>
    </Tooltip>
  );
};

export default AddOptativaButton;
