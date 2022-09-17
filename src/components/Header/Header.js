import {
  Flex,
  ScaleFade,
  useColorModeValue,
} from "@chakra-ui/react";
import React from "react";
import { GraphContext, UserContext } from "../../Contexts";
import MateriaMenu from "./MateriaMenu";
import PadronInput from "./PadronInput";
import useWindowSize from "../useWindowSize";
import DropdownCarreras from "./DropdownCarreras";
import UserMenu from "./UserMenu";

const Header = () => {
  const { displayedNode } = React.useContext(GraphContext);
  const { isMobile } = useWindowSize();

  const { logged } = React.useContext(UserContext);
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
      {displayedNode && <MateriaMenu />}

      <ScaleFade in={!displayedNode}>
        {logged ? (
          <UserMenu />
        ) : (
          <PadronInput />
        )}
      </ScaleFade>

      <ScaleFade in={!displayedNode} unmountOnExit>
        <DropdownCarreras />
      </ScaleFade>
    </Flex>
  );
};

export default Header;
