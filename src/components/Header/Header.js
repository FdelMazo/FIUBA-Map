import {
  Flex,
  useColorModeValue,
} from "@chakra-ui/react";
import React from "react";
import { GraphContext, UserContext } from "../../Contexts";
import MateriaDisplay from "./MateriaDisplay";
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
      align="center"
      justify="space-between"
      bg={useColorModeValue("headerbg", "headerbgdark")}
      px={4}
      py={4}
      gap={2}
      flexWrap="wrap"
      justifyContent={isMobile ? "space-around" : "space-between"}
    >
      {displayedNode ? (
        <MateriaDisplay />
      ) : (
        <>
          {logged ? (
            <UserMenu />
          ) : (
            <PadronInput />
          )}
            <DropdownCarreras />
        </>
      )}
    </Flex>
  );
};

export default Header;
