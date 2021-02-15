import {
  Box,
  Flex,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Progress,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
} from "@chakra-ui/react";
import React from "react";
import * as C from "../constants";
import { GraphContext, UserContext } from "../Contexts";
const Footer = () => {
  const { logged } = React.useContext(UserContext);
  const { graph } = React.useContext(GraphContext);

  return (
    <>
      {!logged && (
        <Flex alignItems="center" bg="primary" bottom="0" position="relative">
          <SimpleGrid
            px={5}
            flexGrow={1}
            ml={5}
            columns={graph.groups.filter((c) => c !== "CBC").length}
            gap={0}
          >
            {graph.groups
              .filter((c) => c !== "CBC")
              .map((c) => (
                <Popover placement="top" trigger="hover">
                  <PopoverTrigger>
                    <Box>
                      <Progress
                        css={{
                          "& *": { backgroundColor: C.GRUPOS[c].color },
                        }}
                        value={100}
                      />
                    </Box>
                  </PopoverTrigger>
                  <PopoverContent>
                    <PopoverArrow />
                    <PopoverHeader>{c}</PopoverHeader>
                    <PopoverBody>
                      Tenes x de y creditos necesarios para recibirte
                    </PopoverBody>
                  </PopoverContent>
                </Popover>
              ))}
          </SimpleGrid>
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
