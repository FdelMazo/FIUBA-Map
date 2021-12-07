import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Flex,
  Icon,
  Link,
  Menu,
  MenuButton,
  MenuItemOption,
  MenuList,
  MenuOptionGroup,
  ScaleFade,
  Tooltip,
  useColorModeValue,
} from "@chakra-ui/react";
import React from "react";
import CARRERAS from "../carreras";
import { GraphContext, UserContext } from "../Contexts";
import MateriaMenu from "./MateriaMenu";
import PadronInput from "./PadronInput";
import useWindowSize from "./useWindowSize";

const Header = (props) => {
  const { displayedNode } = props;
  const { changeCarrera, setFirstTime } = React.useContext(GraphContext);
  const { user } = React.useContext(UserContext);
  const size = useWindowSize();
  const mobile = size.width < 750;
  return (
    <Flex
      height="4em"
      zIndex={11}
      align="center"
      justify="space-between"
      bg={useColorModeValue("headerbg", "headerbgdark")}
      padding="0.8em"
    >
      {displayedNode && <MateriaMenu displayedNode={displayedNode} />}
      <ScaleFade in={!displayedNode}>
        <PadronInput displayedNode={displayedNode} />
      </ScaleFade>

      <ScaleFade in={!displayedNode} unmountOnExit>
        <Menu placement="bottom-end" isLazy>
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
            {mobile ? user.carrera?.nombrecorto : user.carrera?.nombre}
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
        {!mobile && (
          <Tooltip label="Plan de Estudios" placement="bottom-start">
            <Link color="white" href={user.carrera?.link} isExternal>
              <Icon boxSize={6} ml={2} viewBox="0 0 512 512">
                <path
                  fill="currentColor"
                  d="M496 128v16a8 8 0 0 1-8 8h-24v12c0 6.627-5.373 12-12 12H60c-6.627 0-12-5.373-12-12v-12H24a8 8 0 0 1-8-8v-16a8 8 0 0 1 4.941-7.392l232-88a7.996 7.996 0 0 1 6.118 0l232 88A8 8 0 0 1 496 128zm-24 304H40c-13.255 0-24 10.745-24 24v16a8 8 0 0 0 8 8h464a8 8 0 0 0 8-8v-16c0-13.255-10.745-24-24-24zM96 192v192H60c-6.627 0-12 5.373-12 12v20h416v-20c0-6.627-5.373-12-12-12h-36V192h-64v192h-64V192h-64v192h-64V192H96z"
                />
              </Icon>
            </Link>
          </Tooltip>
        )}
      </ScaleFade>
    </Flex>
  );
};

export default Header;
