import { Flex, ScaleFade, Select } from "@chakra-ui/react";
import React from "react";
import CARRERAS from "../carreras";
import { GraphContext, UserContext } from "../Contexts";
import MateriaMenu from "./MateriaMenu";
import PadronInput from "./PadronInput";

const Header = (props) => {
  const { displayedNode } = props;
  const { changeCarrera, carrera } = React.useContext(GraphContext);
  const { logged } = React.useContext(UserContext);

  return (
    <Flex
      height="3em"
      color="white"
      align="center"
      justify="space-between"
      bg="primary"
      padding="0.6rem"
    >
      <ScaleFade in={logged && displayedNode} unmountOnExit>
        <MateriaMenu displayedNode={displayedNode} />
      </ScaleFade>
      <ScaleFade in={!(logged && displayedNode)} unmountOnExit>
        <PadronInput />
      </ScaleFade>
      <ScaleFade in={!logged} unmountOnExit>
        <Select
          css={{ color: "white" }}
          onChange={(e) => changeCarrera(e.target.value)}
          value={carrera.id}
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
