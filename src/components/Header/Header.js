import {
  ScaleFade,
  Flex,
  Box,
  useColorModeValue,
} from "@chakra-ui/react";
import React from "react";
import { GraphContext, UserContext } from "../../Contexts";
import MateriaDisplay from "./MateriaDisplay";
import PadronInput from "./PadronInput";
import DropdownCarreras from "./DropdownCarreras";
import UserMenu from "./UserMenu";


const Header = () => {
  const { isMobile, logged } = React.useContext(UserContext);
  const { displayedNode } = React.useContext(GraphContext);
  const CommonProps = {
    height: isMobile ? "8.7rem" : "5.5rem",
    bg: useColorModeValue("headerbg", "headerbgdark")
  }

  const FlexProps = {
    py: isMobile ? 4 : 2,
    px: 4,
    gap: 4,
    align: "center",
    justify: "space-between",
    flexWrap: "wrap",
    justifyContent: isMobile ? "space-around" : "space-between",
  }

  const AntiFlexProps = {
    height: 0,
    p: 0,
    m: 0,
  }

  return (
    <Box {...CommonProps}>
      <ScaleFade in={displayedNode}>
        <Flex {...CommonProps} {...(displayedNode && FlexProps)} {...(!displayedNode && AntiFlexProps)}>
          <MateriaDisplay />
        </Flex>
      </ScaleFade>
      <ScaleFade in={!displayedNode}>
        <Flex {...CommonProps} {...(!displayedNode && FlexProps)} {...(displayedNode && AntiFlexProps)}>
          {logged ? (
            <UserMenu />
          ) : (
            <PadronInput />
          )}
          <DropdownCarreras />
        </Flex>
      </ScaleFade>
    </Box>
  );
};

export default Header;
