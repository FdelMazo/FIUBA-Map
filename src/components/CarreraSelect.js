import React from "react";
import { Select, Box } from "@chakra-ui/core";
import { CARRERAS } from "../carreras";

const CarreraSelect = () => (
  <Box>
    <Select bg="transparent">
      {CARRERAS.map((c) => (
        <option>{c.nombre}</option>
      ))}
    </Select>
  </Box>
);

export default CarreraSelect;
