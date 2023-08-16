import {
  Badge,
  Box,
  Checkbox,
  Flex,
  Grid,
  GridItem,
  Hide,
  Icon,
  LightMode,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Progress,
  Stat,
  StatHelpText,
  StatLabel,
  StatNumber,
} from "@chakra-ui/react";
import React from "react";
import { FaGraduationCap } from "react-icons/fa";
import { GraphContext } from "../../MapContext";

// Componente con una barra de progresso para mostrar todos los creditos de las
// materias aprobadas
const ProgressBar = () => {
  const {
    creditos,
    toggleCheckbox
  } = React.useContext(GraphContext);

  return (
    <Grid
      flexGrow={1}
      columns={creditos.length}
      templateColumns="repeat(10, 1fr)"
    >
      {creditos.map((c) => (
        <GridItem colSpan={c.proportion} key={c.nombre}>
          <Popover placement="top" trigger="hover">
            <LightMode>
              <PopoverTrigger>
                <Box>
                  <Flex mb={1} mx={1} height={5}>
                    {c.creditos >= c.creditosNecesarios ? (
                      <Icon as={FaGraduationCap} color={c.bg} alignSelf="center" boxSize={5} />
                    ) : (
                      <Badge
                        alignSelf={
                          c.creditosNecesarios &&
                          c.creditos !== 0 &&
                          "baseline"
                        }
                        colorScheme={c.color}
                        variant="solid"
                      >
                        {c.creditosNecesarios &&
                          c.creditos !== 0 &&
                          (Math.round(
                            (c.creditos / c.creditosNecesarios) * 100
                          ) || 0) + "%"}
                      </Badge>
                    )}
                    <Hide ssr={false} below="md">
                      <Badge
                        fontSize="x-small"
                        ml={1}
                        colorScheme={"whiteAlpha"}
                        variant="subtle"
                        alignSelf="center"
                      >
                        {c.nombrecorto}
                      </Badge>
                    </Hide>
                  </Flex>
                  <Progress
                    hasStripe
                    height={4}
                    css={{
                      backgroundColor: c.bg,
                    }}
                    max={c.creditosNecesarios}
                    value={c.creditos}
                    colorScheme={c.color}
                    // MAGIC: https://github.com/chakra-ui/chakra-ui/issues/68
                    sx={{
                      "& > div:first-of-type": {
                        transitionProperty: "width",
                      },
                    }}
                  />
                </Box>
              </PopoverTrigger>
            </LightMode>
            <PopoverContent borderColor="electivas.500">
              <PopoverArrow bg="electivas.500" />
              <PopoverHeader border="none">
                <Stat size="sm">
                  <StatLabel><strong>{c.nombre}</strong></StatLabel>
                  {!c.dummy && <StatNumber fontWeight="normal" fontSize="larger">{c.creditos}{!!c.creditosNecesarios && ` de ${c.creditosNecesarios} `} créditos</StatNumber>}
                  {!!c.nmaterias && <StatHelpText fontSize="smaller">({c.nmaterias} {c.nmaterias === 1 ? 'materia aprobada' : 'materias aprobadas'}{c.totalmaterias && ` de ${c.totalmaterias}`})</StatHelpText>}
                  {!!c.helpText && <StatHelpText fontSize="smaller">{c.helpText}</StatHelpText>}
                </Stat>
              </PopoverHeader>
              {!!c.checkbox && (
                <PopoverBody>
                  <LightMode>
                    <Checkbox
                      isIndeterminate={!!!c.check}
                      isChecked={!!c.check}
                      colorScheme={c.color}
                      onChange={(e) => {
                        e.preventDefault();
                        toggleCheckbox(c.nombre);
                      }}
                    >
                      Marcar como completo
                    </Checkbox>
                  </LightMode>
                </PopoverBody>)}
            </PopoverContent>
          </Popover>
        </GridItem>
      ))}
    </Grid>
  );
};

export default ProgressBar;
