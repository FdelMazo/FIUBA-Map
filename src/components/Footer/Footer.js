import {
  Collapse,
  Flex,
  useColorModeValue,
} from "@chakra-ui/react";
import React from "react";
import { GraphContext, UserContext } from "../../Contexts";
import Creditos from "./Creditos";
import ProgressBar from "./ProgressBar";
import Promedio from "./Promedio";

const Footer = () => {
  const { logged, user } = React.useContext(UserContext);
  const { loadingGraph } = React.useContext(GraphContext);


  return (
    <Collapse in={logged && !loadingGraph} position="relative">
      <Flex
        alignItems="center"
        bg={useColorModeValue("headerbg", "headerbgdark")}
        key={user.carrera?.id}
      >
        <Creditos />
        <ProgressBar />
        <Promedio />
      </Flex>
    </Collapse>
  );
};

export default Footer;
