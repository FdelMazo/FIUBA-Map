import {
  ScaleFade,
  Flex,
  Alert,
  Box,
  useColorModeValue,
  Text,
  VStack,
} from "@chakra-ui/react";
import React from "react";
import { GraphContext, UserContext } from "../../Contexts";
import MateriaDisplay from "./MateriaDisplay";
import PadronInput from "./PadronInput";
import DropdownCarreras from "./DropdownCarreras";
import UserMenu from "./UserMenu";


const Header = () => {
  const { isMobile, logged, user } = React.useContext(UserContext);
  const { displayedNode } = React.useContext(GraphContext);
  const isBeta = user?.carrera?.beta;
  const CommonProps = {
    height: isMobile ? "8.7rem" : "4.5rem",
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
          {!isMobile && isBeta &&
            <Alert colorScheme='purple' borderRadius="md" p={"4px"} w="fit-content" textAlign="center">
              <VStack spacing={0}>
                <Text fontSize="small">No te preocupes, nada de lo que hagas acá se guarda.</Text>
                <Text fontSize="xx-small">regalame un cafecito no seas mala persona</Text>
              </VStack>
            </Alert>
          }
          <DropdownCarreras />
        </Flex>
      </ScaleFade>
    </Box>
  );
};

export default Header;
