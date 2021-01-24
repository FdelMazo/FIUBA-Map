import React from "react";
import { Select, Box } from "@chakra-ui/react";
import CARRERAS from "../carreras";
import { GraphContext } from "../Contexts";

const CarreraSelect = () => {
  const { changeCarrera } = React.useContext(GraphContext);

  return (
    <Box color="white">
      <Select onChange={(e) => changeCarrera(e.target.value)} bg="transparent">
        {Object.keys(CARRERAS).map((id) => (
          <option value={id}>{CARRERAS[id].nombre}</option>
        ))}
      </Select>
    </Box>
  );
};

export default CarreraSelect;
