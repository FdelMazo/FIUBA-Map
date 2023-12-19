import {
  InfoOutlineIcon,
  PlusSquareIcon,
  SmallCloseIcon
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
  Tooltip
} from "@chakra-ui/react";
import React from "react";
import { GraphContext, UserContext } from "../../MapContext";

// Componente para mostrar los creditos totales de la carrera
// y en hover setupear creditos por fuera del plan (materias optativas)
const Creditos = () => {
  const { user } = React.useContext(UserContext);
  const {
    optativas,
    optativasDispatch,
    creditos,
  } = React.useContext(GraphContext);

  const creditosTotales = React.useMemo(() => {
    return creditos.reduce((acc, c) => {
      if (c.checkbox) return acc
      return acc + c.creditos
    }, 0)
  }, [creditos])

  const creditosTotalesNecesarios = React.useMemo(() => {
    // TODO: En un mundo ideal esto no esta hardcodeado y se computa
    // pero cada carrera es tan distinta que esto se hace imposible
    // con la estructura actual de carreras.js
    // Ademas... no tengo forma de obtener los creditos del fin de carrera
    // de un usuario que no lo configuro, porque el nodo no esta presente en
    // el grafo
    return user.carrera.creditos.total
  }, [user.carrera])

  return (
    <Box>
      <Popover placement="top" trigger="hover">
        <PopoverTrigger>
          <Box w={{base: '12ch', md: '16ch'}}>
            <Stat p="0.4em" color="white" size="sm">
              <StatLabel>
                Créditos
                <Tooltip
                  placement="right"
                  hasArrow
                  label="Agregar créditos"
                >
                  <PlusSquareIcon
                    ml={1}
                    boxSize={4}
                    color="electivas.400"
                    cursor="pointer"
                    onClick={() => {
                      optativasDispatch({ action: 'create' });
                    }} />
                </Tooltip>
              </StatLabel>
              <StatNumber>
                {creditosTotales + " de " + creditosTotalesNecesarios}
                <Hide ssr={false} below="md">
                  <LightMode>
                    <Badge
                      ml={2}
                      colorScheme="green"
                      variant="solid"
                    >
                      {Math.round(
                        (creditosTotales / creditosTotalesNecesarios) * 100
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
          <PopoverHeader border="none">
            <Flex justifyContent="space-between">
              <Text mr={4} alignSelf="center"><strong>Créditos por fuera del plan</strong></Text>
              <Tooltip
                placement="top"
                hasArrow
                label={
                  <>
                    <Text>Los créditos por fuera del plan contabilizan como materias electivas y no influyen en el promedio.</Text>
                    <Text>Pueden ser materias optativas (materias dadas en otra facultad o carrera), cursos de posgrado, o créditos otorgados por cualquier otro motivo que la curricular avale.</Text>
                  </>
                }
              >
                <InfoOutlineIcon boxSize={4} alignSelf="center" color={"electivas.600"} />
              </Tooltip>
            </Flex>
          </PopoverHeader>

          {optativas.length > 0 && (
            <PopoverBody>
              {optativas.map((o) => (
                <Editable
                  key={[o.nombre, o.id].join('-')}
                  m={1}
                  textAlign="left"
                  defaultValue={o.nombre}
                  onSubmit={(nombre) =>
                    optativasDispatch({
                      action: 'edit',
                      value: { id: o.id, nombre, creditos: o.creditos }
                    })
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
                          optativasDispatch({
                            action: 'edit',
                            value: {
                              id: o.id, nombre: o.nombre, creditos: creditos || 0
                            }
                          })
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
                      <IconButton mx={1} onClick={() => {
                        optativasDispatch({
                          action: 'remove',
                          value: { id: o.id }
                        })
                      }} icon={<SmallCloseIcon />} size="sm" />
                    </Tooltip>
                  </Flex>
                </Editable>
              ))}
            </PopoverBody>
          )}
        </PopoverContent>
      </Popover>
    </Box>
  );
};

export default Creditos;
