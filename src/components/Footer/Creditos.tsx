import {
  Badge,
  Box,
  LightMode,
  Stat,
  StatLabel,
  StatNumber,
} from "@chakra-ui/react";
import React from "react";
import { GraphContext, UserContext } from "../../MapContext";
import { getCreditosTotalesNecesarios } from "../../utils";

// Componente para mostrar los creditos totales de la carrera
const Creditos = () => {
  const { user } = React.useContext(UserContext);
  const { creditos } = React.useContext(GraphContext);

  const creditosTotales = React.useMemo(() => {
    return creditos.reduce((acc, c) => {
      if (c.checkbox) return acc;
      return acc + c.creditos;
    }, 0);
  }, [creditos]);

  const creditosTotalesNecesarios = React.useMemo(
    () => getCreditosTotalesNecesarios(user.carrera),
    [user.carrera],
  );

  return (
    <Box w={{ base: "12ch", md: "16ch" }}>
      <Stat p="0.4em" color="white" size="sm">
        <StatLabel>Créditos</StatLabel>
        <StatNumber>
          {creditosTotales + " de " + creditosTotalesNecesarios}
          <LightMode>
            <Badge
              display={{ base: "none", md: "inline-block" }}
              ml={2}
              colorScheme="green"
              variant="solid"
            >
              {Math.round((creditosTotales / creditosTotalesNecesarios) * 100) +
                "%"}
            </Badge>
          </LightMode>
        </StatNumber>
      </Stat>
    </Box>
  );
};

export default Creditos;
