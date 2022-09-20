import {
  Badge,
  Box,
  Checkbox,
  Flex,
  Grid,
  GridItem,
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
import { GraphContext, UserContext } from "../../Contexts";

const ProgressBar = () => {
  const { user, isMobile } = React.useContext(UserContext);
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
                      <Icon
                        alignSelf="center"
                        boxSize={5}
                        viewBox="0 0 640 512"
                      >
                        <path
                          fill={c.bg}
                          d="M622.34 153.2L343.4 67.5c-15.2-4.67-31.6-4.67-46.79 0L17.66 153.2c-23.54 7.23-23.54 38.36 0 45.59l48.63 14.94c-10.67 13.19-17.23 29.28-17.88 46.9C38.78 266.15 32 276.11 32 288c0 10.78 5.68 19.85 13.86 25.65L20.33 428.53C18.11 438.52 25.71 448 35.94 448h56.11c10.24 0 17.84-9.48 15.62-19.47L82.14 313.65C90.32 307.85 96 298.78 96 288c0-11.57-6.47-21.25-15.66-26.87.76-15.02 8.44-28.3 20.69-36.72L296.6 284.5c9.06 2.78 26.44 6.25 46.79 0l278.95-85.7c23.55-7.24 23.55-38.36 0-45.6zM352.79 315.09c-28.53 8.76-52.84 3.92-65.59 0l-145.02-44.55L128 384c0 35.35 85.96 64 192 64s192-28.65 192-64l-14.18-113.47-145.03 44.56z"
                        />
                      </Icon>
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
                    {!isMobile && (
                      <Badge
                        fontSize="x-small"
                        ml={1}
                        colorScheme={"whiteAlpha"}
                        variant="solid"
                        alignSelf="center"
                      >
                        {c.nombrecorto}
                      </Badge>
                    )}
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
                  />
                </Box>
              </PopoverTrigger>
            </LightMode>
            <PopoverContent borderColor="electivas.500">
              <PopoverArrow bg="electivas.500" />
              <PopoverHeader border="none">
                <Stat size="sm">
                  <StatLabel><strong>{c.nombre}</strong></StatLabel>
                  {!c.checkbox && (
                    <>
                      <StatNumber fontWeight="normal" fontSize="larger">{c.creditos}{!!c.creditosNecesarios && ` de ${c.creditosNecesarios} `} créditos</StatNumber>
                      {!c.creditosNecesarios &&
                        <StatHelpText fontSize="smaller">
                          Elegí {user.carrera.eligeOrientaciones && !user.orientacion ? "orientación" : ""}
                          {user.carrera.eligeOrientaciones && !user.orientacion && !user.finDeCarrera ? " y " : ""}
                          {!user.finDeCarrera ? "entre tesis y tpp" : ""} para saber cuantos necesitás.
                        </StatHelpText>
                      }
                      <>
                        {!!c.nmaterias && <StatHelpText fontSize="smaller">({c.nmaterias} {c.nmaterias === 1 ? 'materia aprobada' : 'materias aprobadas'})</StatHelpText>}
                      </>
                    </>
                  )}
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
