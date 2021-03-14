import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Flex,
  Menu,
  MenuButton,
  MenuItemOption,
  MenuList,
  MenuOptionGroup,
  ScaleFade,
  useColorModeValue,
} from "@chakra-ui/react";
import React from "react";
import CARRERAS from "../carreras";
import { GraphContext, UserContext } from "../Contexts";
import MateriaMenu from "./MateriaMenu";
import PadronInput from "./PadronInput";

const Header = (props) => {
  const { displayedNode } = props;
  const { changeCarrera, setFirstTime } = React.useContext(GraphContext);
  const { user } = React.useContext(UserContext);

  return (
    <Flex
      zIndex={5501}
      height="4em"
      align="center"
      justify="space-between"
      bg={useColorModeValue("headerbg", "headerbgdark")}
      padding="0.8em"
    >
      {displayedNode && <MateriaMenu displayedNode={displayedNode} />}
      <ScaleFade in={!displayedNode} unmountOnExit>
        <PadronInput />
      </ScaleFade>

      <ScaleFade in={!displayedNode} unmountOnExit>
        <Menu placement="bottom-end" closeOnSelect={false}>
          <MenuButton
            _hover={{ borderColor: "gray.400" }}
            _expanded={{ borderColor: "blue.400" }}
            _focus={{ borderColor: "blue.400" }}
            px={4}
            py={2}
            color="white"
            borderColor="white"
            borderRadius="md"
            borderWidth="1px"
          >
            {user.carrera?.nombre}
            <ChevronDownIcon ml={2} />
          </MenuButton>

          <MenuList>
            <MenuOptionGroup
              onChange={(v) => {
                setFirstTime(false);
                changeCarrera(v);
              }}
              key={user.carrera?.id}
              defaultValue={user.carrera?.id}
              type="radio"
            >
              {CARRERAS.map((c) => (
                <MenuItemOption value={c.id}>{c.nombre}</MenuItemOption>
              ))}
            </MenuOptionGroup>
          </MenuList>
        </Menu>
      </ScaleFade>
    </Flex>
  );
};

export default Header;
