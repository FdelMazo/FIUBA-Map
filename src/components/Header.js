import { Flex, ScaleFade, Select, useColorModeValue } from "@chakra-ui/react";
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
        <Select
          borderColor="white"
          color="white"
          key={user.carrera?.id}
          css={{
            "& *": { color: "initial" },
          }}
          onChange={(e) => {
            setFirstTime(false);
            changeCarrera(e.target.value);
          }}
          value={user.carrera?.id}
        >
          {CARRERAS.map((c) => (
            <option value={c.id}>{c.nombre}</option>
          ))}
        </Select>
      </ScaleFade>
    </Flex>
  );
};

export default Header;
