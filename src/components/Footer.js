import {
  Box,
  Checkbox,
  Collapse,
  Flex,
  Grid,
  GridItem,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Progress,
  Stat,
  StatLabel,
  StatNumber,
} from "@chakra-ui/react";
import React from "react";
import { GraphContext, UserContext } from "../Contexts";
const Footer = () => {
  const { logged, user } = React.useContext(UserContext);
  const {
    promedio,
    actualizarMetadata,
    creditos,
    redraw,
    toggleCheckbox,
  } = React.useContext(GraphContext);

  React.useEffect(() => {
    setTimeout(redraw, 300);
  }, [logged, redraw]);

  return (
    <Collapse in={logged} key={user.carrera?.id} position="relative">
      <Flex alignItems="center" bg="headerbg">
        <Grid
          flexGrow={1}
          mx={5}
          columns={creditos.length}
          templateColumns="repeat(10, 1fr)"
        >
          {creditos.map((c) => (
            <GridItem colSpan={c.proportion}>
              <Popover placement="top" trigger="hover">
                <PopoverTrigger>
                  <Box>
                    <Progress
                      hasStripe
                      css={{
                        backgroundColor: c.bg,
                      }}
                      max={c.creditosNecesarios}
                      value={c.creditos}
                      colorScheme={c.color}
                    />
                  </Box>
                </PopoverTrigger>
                <PopoverContent>
                  <PopoverArrow />
                  <PopoverHeader border="none">
                    <strong>{c.nombre}</strong>
                  </PopoverHeader>
                  <PopoverBody>
                    {c.checkbox ? (
                      <Checkbox
                        isIndeterminate={!!!c.check}
                        isChecked={!!c.check}
                        colorScheme={c.color}
                        onClick={(e) => {
                          e.preventDefault();
                          toggleCheckbox(c);
                          actualizarMetadata();
                        }}
                      >
                        Marcar como completo
                      </Checkbox>
                    ) : c.creditosNecesarios ? (
                      `${c.creditos} de ${c.creditosNecesarios} créditos necesarios.`
                    ) : (
                      `Tenés ${c.creditos} créditos.
                      Elegí entre tesis y tpp para saber cuantos necesitás.`
                    )}
                  </PopoverBody>
                </PopoverContent>
              </Popover>
            </GridItem>
          ))}
        </Grid>
        <Box>
          <Stat p="0.4em" color="white" size="sm" textAlign="right">
            <StatLabel>Promedio</StatLabel>
            <StatNumber>{promedio}</StatNumber>
          </Stat>
        </Box>
      </Flex>
    </Collapse>
  );
};

export default Footer;
