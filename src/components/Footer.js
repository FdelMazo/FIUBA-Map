import {
  Box,
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
  const { getCreditos } = React.useContext(GraphContext);

  return (
    <>
      {!logged && (
        <Flex alignItems="center" bg="primary" bottom="0" position="relative">
          <Grid
            pr={2}
            flexGrow={1}
            ml={5}
            columns={getCreditos().length}
            gap={0}
            templateColumns="repeat(10, 1fr)"
          >
            {getCreditos().map((c) => (
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
                      Tenes {c.creditos} de {c.creditosNecesarios} creditos
                      necesarios para recibirte
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
            >
              <StatLabel>Promedio</StatLabel>
              <StatNumber>9.50</StatNumber>
            </Stat>
          </Box>
        </Flex>
      )}
    </>
  );
};

export default Footer;
