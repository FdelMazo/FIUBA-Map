import {
  Badge,
  Flex,
  IconButton,
  Input,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Tooltip,
  Text,
} from "@chakra-ui/react";
import {
  CheckIcon,
  DeleteIcon,
  EditIcon,
  QuestionIcon,
} from "@chakra-ui/icons";
import React from "react";
import { GraphContext } from "../../MapContext";
import type Node from "../../Node";

// Fila de edicion de una optativa: nombre, creditos, borrarla y confirmar
const EditarOptativa = ({
  node,
  onTerminar,
}: {
  node: Node;
  onTerminar: () => void;
}) => {
  const { editarOptativa, borrarOptativa } = React.useContext(GraphContext);

  const terminar = () => {
    if (!node.materia.trim()) {
      editarOptativa(node.id, "Materia Optativa", node.creditos);
    }
    onTerminar();
  };

  return (
    <Flex align="center" gap={2} flex={1} minW={0}>
      <Tooltip label="Nombre" hasArrow>
        <Input
          size="sm"
          color="white"
          maxW="40ch"
          defaultValue={node.materia}
          autoFocus
          onChange={(e) =>
            editarOptativa(node.id, e.target.value, node.creditos)
          }
          onKeyDown={(e) => e.key === "Enter" && terminar()}
        />
      </Tooltip>
      <Tooltip label="Créditos" hasArrow>
        <NumberInput
          size="sm"
          width="8ch"
          flexShrink={0}
          color="white"
          min={0}
          value={node.creditos}
          onChange={(_, creditos) =>
            editarOptativa(node.id, node.materia, creditos || 0)
          }
        >
          <NumberInputField
            onKeyDown={(e) => e.key === "Enter" && terminar()}
          />
          <NumberInputStepper>
            <NumberIncrementStepper color="white" />
            <NumberDecrementStepper color="white" />
          </NumberInputStepper>
        </NumberInput>
      </Tooltip>
      <Tooltip label="Eliminar" hasArrow>
        <IconButton
          size="sm"
          variant="ghost"
          color="red.400"
          icon={<DeleteIcon />}
          aria-label="Eliminar materia optativa"
          onClick={() => borrarOptativa(node.id)}
        />
      </Tooltip>
      <Tooltip label="Confirmar" hasArrow>
        <IconButton
          size="sm"
          variant="ghost"
          color="green.400"
          icon={<CheckIcon />}
          aria-label="Terminar de editar"
          onClick={terminar}
        />
      </Tooltip>
    </Flex>
  );
};

// Cuando hay una materia seleccionada, te muestra el codigo, cuantos creditos da, etc
const MateriaStatus = () => {
  const { getNode, displayedNode } = React.useContext(GraphContext);
  const node = React.useMemo(
    () => (displayedNode ? getNode(displayedNode) : undefined),
    [displayedNode, getNode],
  );

  // Las optativas las arma el usuario: con el boton de edicion se les cambia el nombre y los creditos, o se borran
  const esOptativa = node?.categoria === "Materias Optativas";
  const [editando, setEditando] = React.useState(false);
  React.useEffect(() => setEditando(false), [displayedNode]);

  if (node && esOptativa && editando) {
    return <EditarOptativa node={node} onTerminar={() => setEditando(false)} />;
  }

  // Para el tooltip nativo (hover) cuando el nombre queda cortado
  const fullTitle = `[${node?.id}] ${node?.materia}`;

  // Mismo layout en todos los tamaños: "[codigo] nombre" en una linea (cortado si es largo)
  // y abajo los badges de creditos
  return displayedNode ? (
    <Flex align="center" gap={2} flex={1} minW={0}>
      <Flex direction="column" align="flex-start" minW={0} gap={1}>
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
              <Badge
                fontSize="2xs"
                px={1}
                colorScheme="orange"
                variant="outline"
              >
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
      {esOptativa && (
        <Tooltip label="Editar" hasArrow>
          <IconButton
            size="md"
            color="white"
            bg="whiteAlpha.200"
            _hover={{ bg: "whiteAlpha.300" }}
            _active={{ bg: "whiteAlpha.400" }}
            icon={<EditIcon />}
            aria-label="Editar Materia Optativa"
            onClick={() => setEditando(true)}
          />
        </Tooltip>
      )}
    </Flex>
  ) : (
    <></>
  );
};

export default MateriaStatus;
