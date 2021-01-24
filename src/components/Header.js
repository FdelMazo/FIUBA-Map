import React from "react";
import PadronInput from "./PadronInput";
import CarreraSelect from "./CarreraSelect";
import { GraphContext, UserContext } from "../Contexts";

import {
  Box,
  Flex,
  useDisclosure,
  Button,
  Collapse,
  SlideFade,
} from "@chakra-ui/react";

const Promedio = () => <Box>Promedio: 7.50</Box>;

const Header = (props) => {
  const { displayedNode } = props;
  const { nodeFunctions } = React.useContext(GraphContext);
  const { getNode } = nodeFunctions;
  const { logged } = React.useContext(UserContext);

  const { isOpen, onToggle } = useDisclosure();

  return (
    <Flex
      color="white"
      align="center"
      justify="space-between"
      bg="primary"
      padding="0.6rem"
    >
      <Box>
        {displayedNode && (
          <Collapse in={displayedNode}>
            <>{getNode(displayedNode).materia}</>
          </Collapse>
        )}
        <SlideFade in={!displayedNode}>
          <PadronInput />
        </SlideFade>
      </Box>
      <SlideFade in={!displayedNode}>
        {logged ? <Promedio /> : <CarreraSelect color="white" />}
      </SlideFade>
    </Flex>
  );
};

export default Header;
