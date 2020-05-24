import React from "react";
import UserForm from "./UserForm";
import CarreraSelect from "./CarreraSelect";
import Promedio from "./Promedio";
import UserContext from "./UserContext";

import { Flex } from "@chakra-ui/core";

const Header = () => {
  const { logged } = React.useContext(UserContext);

  return (
    <Flex
      align="center"
      justify="space-between"
      padding="0.4rem"
      bg="primary"
      color="secondary"
    >
      <UserForm />
      {logged ? <Promedio /> : <CarreraSelect />}
    </Flex>
  );
};

export default Header;
