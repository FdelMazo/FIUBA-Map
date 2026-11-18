import { ScaleFade, Flex, Box, useColorModeValue } from "@chakra-ui/react";
import { GraphContext, UserContext } from "../../MapContext";
import MateriaDisplay from "./MateriaDisplay";
import PadronInput from "./PadronInput";
import DropdownCarreras from "./DropdownCarreras";
import UserMenu from "./UserMenu";
import React from "react";

// Componente toplevel de header
// Si tengo una materia clickeada, muestra sus controles
// Si no, muestra un input para loguearse (o un menu del usuario loguead) y
//  un dropdown para elegir las carrera
const Header = () => {
  const { logged } = React.useContext(UserContext);
  const { displayedNode } = React.useContext(GraphContext);

  const FlexProps = {
    minHeight: { base: "3.5rem", md: "4.5rem" },
    py: 2,
    px: 4,
    gap: { base: 2, md: 4 },
    align: "center",
    justify: "space-between",
  };

  return (
    <Box bg={useColorModeValue("headerbg", "headerbgdark")} flexShrink={0}>
      {displayedNode ? (
        <ScaleFade in initialScale={0.9}>
          <Flex {...FlexProps} flexWrap="nowrap">
            <MateriaDisplay />
          </Flex>
        </ScaleFade>
      ) : (
        <Flex {...FlexProps} flexWrap="nowrap">
          {logged ? <UserMenu /> : <PadronInput />}
          <DropdownCarreras />
        </Flex>
      )}
    </Box>
  );
};

export default Header;
