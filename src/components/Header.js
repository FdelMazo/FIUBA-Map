import { Box, Flex, Select, SlideFade } from "@chakra-ui/react";
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
      color="white"
      align="center"
      justify="space-between"
      bg="primary"
      padding="0.6rem"
    >
      {logged ? (
        <>
          {displayedNode ? (
            <SlideFade in={displayedNode}>
              <MateriaMenu displayedNode={displayedNode} />
            </SlideFade>
          ) : (
            <PadronInput />
          )}
        </>
      ) : (
        <>
          <Box>
            <PadronInput />
          </Box>
          <Box>
            <Select
              css={{ color: "#ffffff" }}
              onChange={(e) => changeCarrera(e.target.value)}
              value={carrera.id}
            >
              {CARRERAS.map((c) => (
                <option value={c.id}>{c.nombre}</option>
              ))}
            </Select>
          </Box>
        </>
      )}
    </Flex>
  );
};

export default Header;
