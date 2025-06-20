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
  Progress,
} from "@chakra-ui/react";
import React from "react";
import { GraphContext, UserContext } from "../../MapContext";

// Componente para mostrar los creditos totales de la carrera
// y en hover setupear creditos por fuera del plan (materias optativas)
const Creditos = () => {
  const { user } = React.useContext(UserContext);
  const { optativas, optativasDispatch, creditos, maxCreditosOptativas } =
    React.useContext(GraphContext);
  const [isOpen, setIsOpen] = React.useState(false);

  const textColor = useColorModeValue("black", "white");

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
    if (creditosOptativas >= maxCreditosOptativas) {
      return; // No permitir crear más optativas si ya se alcanzó el límite
    }
    optativasDispatch({ action: "create" });
    // Mantener el popover abierto cuando se crea una nueva optativa
    setIsOpen(true);
  };

  const handleEditOptativa = (id: number, nombre: string, creditos: number) => {
    const currentOptativas = optativas.filter(o => o.id !== id);
    const currentCreditos = currentOptativas.reduce((acc, o) => acc + o.creditos, 0);
    
    if (currentCreditos + creditos > maxCreditosOptativas) {
      return; // No permitir editar si excedería el límite
    }
    
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
                  label={
                    creditosOptativas >= maxCreditosOptativas 
                      ? "Límite máximo de créditos alcanzado" 
                      : `Agregar créditos (máximo ${maxCreditosOptativas} total)`
                  }
                >
                  <PlusSquareIcon
                    ml={1}
                    boxSize={4}
                    color={creditosOptativas >= maxCreditosOptativas ? "gray.400" : "electivas.400"}
                    cursor={creditosOptativas >= maxCreditosOptativas ? "not-allowed" : "pointer"}
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
          {creditosOptativas > 0 && (
            <Box p={3}>
              <Flex justifyContent="space-between" alignItems="center" mb={2}>
                <Text fontSize="sm" color={textColor}>
                  <strong>Créditos de optativas: {creditosOptativas} / {maxCreditosOptativas}</strong>
                </Text>
              </Flex>
              <Progress
                value={(creditosOptativas / maxCreditosOptativas) * 100}
                size="sm"
                borderRadius={3}
                bg="electivas.100"
                sx={{
                  "& > div": {
                    backgroundColor: creditosOptativas >= maxCreditosOptativas ? "red.400" : "electivas.400",
                  },
                }}
              />
              {creditosOptativas >= maxCreditosOptativas && (
                <Text fontSize="xs" color="red.500" mt={1}>
                  Límite máximo alcanzado
                </Text>
              )}
            </Box>
          )}

          {optativas.length === 0 && maxCreditosOptativas > 0 && (
            <Box p={3}>
              <Text fontSize="sm" color={textColor} textAlign="center">
                Puedes agregar hasta <strong>{maxCreditosOptativas} créditos</strong> de optativas
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
                <strong>Créditos por fuera del plan</strong>
              </Text>
              <Flex gap={2}>
                {optativas.length > 0 && (
                  <Tooltip placement="top" hasArrow label="Eliminar todas las optativas">
                    <IconButton
                      size="sm"
                      icon={<DeleteIcon />}
                      colorScheme="red"
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
                    color={useColorModeValue("electivas.600", "electivas.400")}
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
