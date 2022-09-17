import {
  Flex,
  ScaleFade,
  useColorModeValue,
} from "@chakra-ui/react";
import React from "react";
import { GraphContext } from "../../Contexts";
import MateriaMenu from "./MateriaMenu";
import PadronInput from "./PadronInput";
import useWindowSize from "../useWindowSize";
import DropdownCarreras from "./DropdownCarreras";

const Header = () => {
  const { displayedNode } = React.useContext(GraphContext);
  const { isMobile } = useWindowSize();
  return (
    <Flex
      height="fit-content"
      minHeight="4em"
      zIndex={11}
      align="center"
      justify="space-between"
      bg={useColorModeValue("headerbg", "headerbgdark")}
      px={isMobile ? "0.4em" : "0.8em"}
      py={1}
    >
      {displayedNode && <MateriaMenu displayedNode={displayedNode} />}
      <ScaleFade in={!displayedNode}>
        <PadronInput displayedNode={displayedNode} />
      </ScaleFade>

      <ScaleFade in={!displayedNode} unmountOnExit>
        <DropdownCarreras />
      </ScaleFade>
    </Flex>
  );
};

export default Header;
