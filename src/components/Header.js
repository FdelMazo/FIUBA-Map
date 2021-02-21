import { Flex, Select } from "@chakra-ui/react";
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
      {logged && displayedNode && <MateriaMenu displayedNode={displayedNode} />}
      {!(logged && displayedNode) && <PadronInput />}
      {!logged && (
        <Select
          w="fit-content"
          css={{ color: "white" }}
          onChange={(e) => changeCarrera(e.target.value)}
          value={carrera.id}
        >
          {CARRERAS.map((c) => (
            <option value={c.id}>{c.nombre}</option>
          ))}
        </Select>
      )}
    </Flex>
  );
};

export default Header;
