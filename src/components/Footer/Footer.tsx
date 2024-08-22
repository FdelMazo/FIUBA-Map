import { Collapse, Flex, useColorModeValue } from "@chakra-ui/react";
import React from "react";
import { UserContext } from "../../MapContext";
import Creditos from "./Creditos";
import ProgressBar from "./ProgressBar";
import Promedio from "./Promedio";

// Footer que solo se muestra si estas logueado
// (no tiene sentido ver promedio, creditos, etc si no los vas a guardar)
const Footer = () => {
  const { logged, user } = React.useContext(UserContext);

  return (
    <Collapse in={logged} unmountOnExit>
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
