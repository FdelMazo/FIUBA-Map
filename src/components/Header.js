import { Flex, ScaleFade, Select } from "@chakra-ui/react";
import React from "react";
import CARRERAS from "../carreras";
import { GraphContext, UserContext } from "../Contexts";
import MateriaMenu from "./MateriaMenu";
import PadronInput from "./PadronInput";

const Header = (props) => {
  const { displayedNode } = props;
  const { changeCarrera } = React.useContext(GraphContext);
  const { logged, user, register } = React.useContext(UserContext);

  return (
    <Flex
      height="4em"
      align="center"
      justify="space-between"
      bg="headerbg"
      padding="0.8em"
    >
      {displayedNode && <MateriaMenu displayedNode={displayedNode} />}
      <ScaleFade in={!displayedNode} unmountOnExit>
        <PadronInput />
      </ScaleFade>

      <ScaleFade in={!displayedNode} unmountOnExit>
        <Select
          color="white"
          css={{
            "& *": { color: "initial" },
          }}
          onChange={(e) => {
            changeCarrera(e.target.value);
            if (logged) register();
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
