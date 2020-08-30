import React from "react";
import PadronInput from "./PadronInput";
import CarreraSelect from "./CarreraSelect";
import Promedio from "./Promedio";
import { UserContext } from "../Contexts";

import { Flex } from "@chakra-ui/core";

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
