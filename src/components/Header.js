import React from "react";
import { Flex, Input, Select, Box } from "@chakra-ui/core";

export const Header = () => (
  <Flex
    align="center"
    justify="space-between"
    padding="0.4rem"
    bg="primary"
    color="secondary"
  >
    <Box>
      <Input size="sm" placeholder="Padrón" />
    </Box>

    <Box>
      <Select bg="transparent">
        <option>Licenciatura en Sistemas</option>
        <option>Ingenieria en Informática</option>
      </Select>
    </Box>
  </Flex>
);
