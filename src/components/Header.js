import { Flex, ScaleFade, Select } from "@chakra-ui/react";
import React from "react";
import CARRERAS from "../carreras";
import { GraphContext, UserContext } from "../Contexts";
import MateriaMenu from "./MateriaMenu";
import PadronInput from "./PadronInput";

const Header = (props) => {
  const { displayedNode } = props;
  const { changeCarrera } = React.useContext(GraphContext);
  const { logged, user } = React.useContext(UserContext);

  return (
    <Flex
      height="3em"
      color="white"
      align="center"
      justify="space-between"
      bg="primary"
      padding="0.6rem"
    >
      {displayedNode && <MateriaMenu displayedNode={displayedNode} />}
      <ScaleFade in={!displayedNode} unmountOnExit>
        <PadronInput />
      </ScaleFade>

      <ScaleFade in={!displayedNode} unmountOnExit>
        <Select
          w="fit-content"
          css={{ color: "white" }}
          onChange={(e) => changeCarrera(e.target.value)}
          value={user.carrera?.id}
          isDisabled={logged}
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
