import React from "react";
import { Select, Box } from "@chakra-ui/react";
import { GraphContext } from "../Contexts";

const OrientacionSelect = () => {
  const { carrera } = React.useContext(GraphContext);

  return (
    <Box>
      <Select bg="transparent" placeholder="Orientación">
        {Object.keys(carrera.finDeCarrera).map((id) => (
          <option value={id}>{carrera.finDeCarrera[id].nombre}</option>
        ))}
      </Select>
    </Box>
  );
};

export default OrientacionSelect;
