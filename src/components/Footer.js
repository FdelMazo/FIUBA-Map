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
  const { logged } = React.useContext(UserContext);
  const { promedio, creditos } = React.useContext(GraphContext);

  return (
    <Collapse in={logged} position="relative">
      <Flex alignItems="center" bg="primary" bottom="0">
        <Grid
          pr={2}
          flexGrow={1}
          ml={5}
          columns={creditos.length}
          gap={0}
          templateColumns="repeat(10, 1fr)"
        >
          {creditos.map((c) => (
            <GridItem colSpan={c.proportion}>
              <Popover placement="top" trigger="hover">
                <PopoverTrigger>
                  <Box>
                    <Progress
                      hasStripe
                      max={c.creditosNecesarios}
                      value={c.creditos}
                      colorScheme={c.color}
                    />
                  </Box>
                </PopoverTrigger>
                <PopoverContent>
                  <PopoverArrow />
                  <PopoverHeader>{c.nombre}</PopoverHeader>
                  <PopoverBody>
                    {c.checkbox ? (
                      <Checkbox
                        isIndeterminate={c.check === false}
                        isChecked={c.check === true}
                        colorScheme={c.color}
                      >
                        Marcar como completo
                      </Checkbox>
                    ) : (
                      `${c.creditos} de ${c.creditosNecesarios} créditos necesarios.`
                    )}
                  </PopoverBody>
                </PopoverContent>
              </Popover>
            </GridItem>
          ))}
        </Grid>
        <Box>
          <Stat
            p="0.4rem"
            color="white"
            css={{ "& *": { marginTop: 0, marginBottom: 0 } }}
            size="sm"
            textAlign="right"
          >
            <StatLabel>Promedio</StatLabel>
            <StatNumber>{promedio}</StatNumber>
          </Stat>
        </Box>
      </Flex>
    </Collapse>
  );
};

export default Footer;
