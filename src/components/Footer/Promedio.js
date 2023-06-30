import {
  Box,
  Flex,
  LightMode,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Stat,
  StatLabel,
  StatNumber,
  Text,
} from "@chakra-ui/react";
import React from "react";
import { GraphContext } from "../../MapContext";
import { promediar } from "../../utils";

const Promedio = () => {
  const {
    getters,
    aplazos,
    setAplazos,
  } = React.useContext(GraphContext);

  const promedio = React.useMemo(() => {
    return {
      promedio: promediar(getters.MateriasAprobadasSinEquivalenciasSinCBC()),
      promedioConCBC: promediar(getters.MateriasAprobadasConCBC()),
      promedioConAplazos: promediar([
        ...getters.MateriasAprobadasSinEquivalenciasSinCBC(),
        ...Array(aplazos).fill({ nota: 2 })
      ]),
    }
  }, [aplazos, getters])

  return (
    <Popover placement="top" trigger="hover">
      <LightMode>
        <PopoverTrigger>
          <Box w="12ch">
            <Stat p="0.4em" color="white" size="sm" textAlign="right">
              <StatLabel>Promedio</StatLabel>
              <StatNumber>{promedio.promedio}</StatNumber>
            </Stat>
          </Box>
        </PopoverTrigger>
      </LightMode>
      <PopoverContent borderColor="electivas.500">
        <PopoverArrow bg="electivas.500" />
        <PopoverBody>
          <Flex justifyContent="space-between" alignItems="center">
            <Text fontSize="md" as={'span'}>
              <strong>
                Promedio con
                <NumberInput
                  display="inline-block"
                  borderRadius={5}
                  mx={2}
                  size="xs"
                  width="6ch"
                  value={aplazos}
                  min={0}
                  onChange={(v) => setAplazos(parseFloat(v))}
                >
                  <NumberInputField
                    _hover={{
                      borderColor: "transparent",
                    }}
                    _focus={{
                      borderColor: "transparent",
                    }} />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
                aplazos
              </strong>
            </Text>
            <Text fontSize="md">{promedio.promedioConAplazos}</Text>
          </Flex>
          <Flex justifyContent="space-between" alignItems="center">
            <Text fontSize="md">
              <strong>Promedio con CBC</strong>
            </Text>
            <Text fontSize="md">{promedio.promedioConCBC}</Text>
          </Flex>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default Promedio;
