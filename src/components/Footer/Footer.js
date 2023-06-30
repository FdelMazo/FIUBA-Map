import {
  Collapse,
  Flex,
  useColorModeValue,
} from "@chakra-ui/react";
import React from "react";
import { UserContext } from "../../MapContext";
import Creditos from "./Creditos";
import ProgressBar from "./ProgressBar";
import Promedio from "./Promedio";

const Footer = () => {
  const { logged, user } = React.useContext(UserContext);

  return (
    <Collapse in={logged} position="relative">
      <Flex
        alignItems="center"
        bg={useColorModeValue("headerbg", "headerbgdark")}
        key={user.carrera.id}
      >
        <Creditos />
        <ProgressBar />
        <Promedio />
      </Flex>
    </Collapse>
  );
};

export default Footer;
