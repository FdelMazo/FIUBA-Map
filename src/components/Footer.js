import React from "react";
import { Box } from "@chakra-ui/core";
import UserContext from "./UserContext";

const Footer = () => {
  const { logged } = React.useContext(UserContext);
  if (!logged) return <Box />;
  return <Box>Footer</Box>;
};

export default Footer;
