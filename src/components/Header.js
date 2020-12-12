import React from "react";
import PadronInput from "./PadronInput";
import CarreraSelect from "./CarreraSelect";
import { UserContext } from "../Contexts";

import { Box, Flex } from "@chakra-ui/react";

const Promedio = () => <Box>Promedio: 7.50</Box>;

const Header = () => {
  const { logged } = React.useContext(UserContext);

  return (
    <Flex
      align="center"
      justify="space-between"
      bg="primary"
      color="secondary"
      padding="0.6rem"
    >
      <PadronInput />
      {logged ? <Promedio /> : <CarreraSelect />}
    </Flex>
  );
};

export default Header;
