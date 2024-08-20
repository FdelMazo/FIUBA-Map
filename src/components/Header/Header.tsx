import { ScaleFade, Flex, Box, useColorModeValue } from "@chakra-ui/react";
import React from "react";
import { GraphContext, UserContext } from "../../MapContext";
import MateriaDisplay from "./MateriaDisplay";
import PadronInput from "./PadronInput";
import DropdownCarreras from "./DropdownCarreras";
import UserMenu from "./UserMenu";

// Componente toplevel de header
// Si tengo una materia clickeada, muestra sus controles
// Si no, muestra un input para loguearse (o un menu del usuario loguead) y
//  un dropdown para elegir las carrera
const Header = () => {
  const { logged } = React.useContext(UserContext);
  const { displayedNode } = React.useContext(GraphContext);
  const CommonProps = {
    height: { base: "8.7rem", md: "4.5rem" },
    bg: useColorModeValue("headerbg", "headerbgdark"),
  };

  const FlexProps = {
    py: { base: 4, md: 2 },
    px: 4,
    gap: 4,
    align: "center",
    justify: "space-between",
    flexWrap: "wrap",
    justifyContent: { base: "space-around", md: "space-between" },
  };

  const AntiFlexProps = {
    height: 0,
    p: 0,
    m: 0,
  };

  return (
    <Box {...CommonProps}>
      <ScaleFade in={displayedNode} transition={{ enter: { delay: 0.0015 } }}>
        <Flex
          {...CommonProps}
          {...(displayedNode && FlexProps)}
          {...(!displayedNode && AntiFlexProps)}
        >
          <MateriaDisplay />
        </Flex>
      </ScaleFade>
      {!displayedNode && (
        <Flex {...CommonProps} {...(!displayedNode && FlexProps)}>
          {logged ? <UserMenu /> : <PadronInput />}
          <DropdownCarreras />
        </Flex>
      )}
    </Box>
  );
};

export default Header;
