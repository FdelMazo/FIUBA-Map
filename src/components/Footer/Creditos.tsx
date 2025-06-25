import {
  InfoOutlineIcon,
  PlusSquareIcon,
  SmallCloseIcon,
  DeleteIcon,
} from "@chakra-ui/icons";
import {
  Badge,
  Box,
  Editable,
  EditableInput,
  EditablePreview,
  Flex,
  Hide,
  IconButton,
  LightMode,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Stat,
  StatLabel,
  StatNumber,
  Text,
  Tooltip,
  useColorModeValue,
} from "@chakra-ui/react";
import React from "react";
import { GraphContext, UserContext } from "../../MapContext";

// Componente para mostrar los creditos totales de la carrera
// y en hover setupear creditos por fuera del plan (materias optativas)
const Creditos = () => {
  const { user } = React.useContext(UserContext);
  const { optativas, optativasDispatch, creditos } =
    React.useContext(GraphContext);
  const [isOpen, setIsOpen] = React.useState(false);

  const textColor = useColorModeValue("black", "white");
  const electivasColor = useColorModeValue("electivas.600", "electivas.400");
  const electivasBgHover = useColorModeValue("electivas.50", "electivas.900");

  const creditosTotales = React.useMemo(() => {
    return creditos.reduce((acc, c) => {
      if (c.checkbox) return acc;
      return acc + c.creditos;
    }, 0);
  }, [creditos]);

  const creditosOptativas = React.useMemo(() => {
    return optativas.reduce((acc, o) => acc + o.creditos, 0);
  }, [optativas]);

  const creditosTotalesNecesarios = React.useMemo(() => {
    // TODO: En un mundo ideal esto no esta hardcodeado y se computa
    // pero cada carrera es tan distinta que esto se hace imposible
    // con la estructura actual de carreras.ts
    // Ademas... no tengo forma de obtener los creditos del fin de carrera
    // de un usuario que no lo configuro, porque el nodo no esta presente en
    // el grafo
    return user.carrera.creditos.total;
  }, [user.carrera]);

  const handleCreateOptativa = () => {
    optativasDispatch({ action: "create" });
    // Mantener el popover abierto cuando se crea una nueva optativa
    setIsOpen(true);
  };

  const handleEditOptativa = (id: number, nombre: string, creditos: number) => {
    optativasDispatch({
      action: "edit",
      value: { id, nombre, creditos },
    });
  };

  return (
    <Box>
      <Popover 
        placement="top" 
        trigger="hover"
        isOpen={isOpen}
        onOpen={() => setIsOpen(true)}
        onClose={() => setIsOpen(false)}
      >
        <PopoverTrigger>
          <Box w={{ base: "12ch", md: "16ch" }}>
            <Stat p="0.4em" color="white" size="sm">
              <StatLabel>
                Créditos
                <Tooltip 
                  placement="right" 
                  hasArrow 
                  label="Agregar créditos de optativas"
                >
                  <PlusSquareIcon
                    ml={1}
                    boxSize={4}
                    color="electivas.400"
                    cursor="pointer"
                    onClick={handleCreateOptativa}
                  />
                </Tooltip>
              </StatLabel>
              <StatNumber>
                {creditosTotales + " de " + creditosTotalesNecesarios}
                <Hide ssr={false} below="md">
                  <LightMode>
                    <Badge ml={2} colorScheme="green" variant="solid">
                      {Math.round(
                        (creditosTotales / creditosTotalesNecesarios) * 100,
                      ) + "%"}
                    </Badge>
                  </LightMode>
                </Hide>
              </StatNumber>
            </Stat>
          </Box>
        </PopoverTrigger>
        <PopoverContent borderColor="electivas.500" width="fit-content">
          <PopoverArrow bg="electivas.500" />
          {optativas.length === 0 && (
            <Box p={3}>
              <Text fontSize="sm" color={textColor} textAlign="center">
                Puedes agregar créditos de optativas
              </Text>
            </Box>
          )}

          {optativas.length > 0 && (
            <PopoverBody>
              {optativas.map((o) => (
                <Editable
                  key={[o.nombre, o.id].join("-")}
                  m={1}
                  textAlign="left"
                  defaultValue={o.nombre}
                  onSubmit={(nombre) =>
                    handleEditOptativa(o.id, nombre, o.creditos)
                  }
                  submitOnBlur={true}
                >
                  <Flex justifyContent="space-between">
                    <Tooltip placement="top" label="Motivo" hasArrow>
                      <EditablePreview px={2} width="12rem" noOfLines={1} />
                    </Tooltip>
                    <Tooltip placement="top" label="Motivo" hasArrow>
                      <EditableInput px={2} width="12rem" noOfLines={1} />
                    </Tooltip>
                    <Tooltip placement="top" label="Créditos" hasArrow>
                      <NumberInput
                        mx={2}
                        borderRadius={5}
                        size="sm"
                        width="4rem"
                        value={o.creditos}
                        min={0}
                        onChange={(_, creditos) => {
                          handleEditOptativa(o.id, o.nombre, creditos || 0);
                        }}
                      >
                        <NumberInputField />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                    </Tooltip>
                    <Tooltip placement="top" label="Eliminar" hasArrow>
                      <IconButton
                        mx={1}
                        onClick={() => {
                          optativasDispatch({
                            action: "remove",
                            value: { id: o.id },
                          });
                        }}
                        icon={<SmallCloseIcon />}
                        size="sm"
                        aria-label="Eliminar materia optativa"
                      />
                    </Tooltip>
                  </Flex>
                </Editable>
              ))}
            </PopoverBody>
          )}

          <PopoverHeader border="none" borderTop="1px solid" borderColor="electivas.200">
            <Flex justifyContent="space-between">
              <Text mr={4} alignSelf="center">
                <strong>Créditos por fuera del plan: {creditosOptativas}</strong>
              </Text>
              <Flex gap={2}>
                {optativas.length > 0 && (
                  <Tooltip placement="top" hasArrow label="Eliminar todas las optativas">
                    <IconButton
                      size="sm"
                      icon={<DeleteIcon />}
                      color={electivasColor}
                      bg="transparent"
                      _hover={{ bg: electivasBgHover }}
                      variant="ghost"
                      onClick={() => {
                        optativasDispatch({ action: "override", value: [] });
                      }}
                      aria-label="Eliminar todas las optativas"
                    />
                  </Tooltip>
                )}
                <Tooltip
                  placement="top"
                  hasArrow
                  label={
                    <>
                      <Text>
                        Los créditos por fuera del plan contabilizan como materias
                        electivas y no influyen en el promedio.
                      </Text>
                      <Text>
                        Pueden ser materias optativas (materias dadas en otra
                        facultad o carrera), cursos de posgrado, o créditos
                        otorgados por cualquier otro motivo que la curricular
                        avale.
                      </Text>
                    </>
                  }
                >
                  <InfoOutlineIcon
                    boxSize={4}
                    alignSelf="center"
                    color={electivasColor}
                  />
                </Tooltip>
              </Flex>
            </Flex>
          </PopoverHeader>
        </PopoverContent>
      </Popover>
    </Box>
  );
};

export default Creditos;
