import React from "react";
import { SettingsIcon } from "@chakra-ui/icons";
import {
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuItemOption,
  MenuList,
  MenuOptionGroup,
  Icon,
  IconButton,
  Tooltip,
  Text,
  Box,
  PlacementWithLogical,
  ResponsiveValue
} from "@chakra-ui/react";
import { BiLogOut } from "react-icons/bi";
import { Property } from "csstype";
import { FaSave, FaUndo } from "react-icons/fa";
import { GraphContext, UserContext } from "../../MapContext";

const ButtonProps = {
  bg: "teal.500",
  color: "white",
  _hover: { bg: "teal.600" },
  _active: { bg: "teal.600" },
  size: "sm",
};

const TooltipProps = {
  closeOnClick: true,
  hasArrow: true,
  placement: "bottom" as PlacementWithLogical,
  textAlign: "center" as ResponsiveValue<Property.TextAlign>,
};

// Menu para elegir orientacion y fin de carrera (y para "cerrar sesion")
// Es un botoncito de settings donde esta el padron, arriba a la izquierda de la app
// Tambien botones para guardar el grafo, y reiniciar los cuatrimestres planeados
const UserMenu = () => {
  const { logout, user } = React.useContext(UserContext);

  const {
    saveGraph,
    restartGraphCuatris,
    getters,
    changeOrientacion,
    changeFinDeCarrera,
    getNode,
  } = React.useContext(GraphContext);
  const [saving, setSaving] = React.useState(false);

  const isBeta = user.carrera.beta;
  return (
    <Box>
      <Menu
        closeOnSelect={false}
        defaultIsOpen={
          (user.carrera.eligeOrientaciones && !user.orientacion) ||
          (user.carrera.finDeCarrera && !user.finDeCarrera)
        }
      >
        <MenuButton
          w="20ch"
          textAlign="left"
          as={Button}
          leftIcon={<SettingsIcon />}
          {...ButtonProps}
        >
          <Text overflow="hidden" textOverflow="ellipsis">
            {user.padron}
          </Text>
        </MenuButton>
        <MenuList>
          {user.carrera.finDeCarrera && (
            <MenuOptionGroup
              onChange={(value) => {
                changeFinDeCarrera(value as string);
              }}
              value={user.finDeCarrera?.id || "none"}
              title="Fin de Carrera"
              type="radio"
            >
              <MenuItemOption type="checkbox" value={"none"}>
                No me decidí
              </MenuItemOption>

              {user.carrera.finDeCarrera &&
                Object.values(user.carrera.finDeCarrera).map((v) => (
                  <MenuItemOption type="checkbox" value={v.id} key={v.id}>
                    {getNode(v.materia)?.materia}
                  </MenuItemOption>
                ))}
            </MenuOptionGroup>
          )}

          {user.carrera.eligeOrientaciones && (
            <MenuOptionGroup
              onChange={(value) => {
                changeOrientacion(value as string);
              }}
              value={user.orientacion?.nombre || "none"}
              title="Orientación"
              type="radio"
            >
              <MenuItemOption type="checkbox" value={"none"}>
                No me decidí
              </MenuItemOption>

              {user.carrera.orientaciones &&
                user.carrera.orientaciones
                  .filter((o) => !o.nonEligible)
                  .map((o) => (
                    <MenuItemOption
                      type="checkbox"
                      value={o.nombre}
                      key={o.nombre}
                    >
                      {o.nombre}
                    </MenuItemOption>
                  ))}
            </MenuOptionGroup>
          )}

          <MenuItem onClick={logout} icon={<BiLogOut size={"1.8em"} />}>
            <strong>Cerrar Sesión</strong>
          </MenuItem>
        </MenuList>
      </Menu>
      <Tooltip
        {...TooltipProps}
        label={
          isBeta
            ? "No se pueden guardar datos hasta que se oficialice el plan"
            : "Guardar datos"
        }
      >
        <IconButton
          {...ButtonProps}
          ml={2}
          isLoading={saving}
          onClick={async () => {
            setSaving(true);
            await saveGraph().catch(console.error);
            setSaving(false);
          }}
          isDisabled={isBeta}
          aria-label="Icono para guardar los datos del plan"
        >
          <Icon boxSize={5} as={FaSave} />
        </IconButton>
      </Tooltip>

      {getters.Cuatrimestres().length > 0 && (
        <Tooltip {...TooltipProps} label="Limpiar todos los cuatris">
          <IconButton
            {...ButtonProps}
            ml={2}
            onClick={restartGraphCuatris}
            aria-label="Icono para limpiar la data de los cuatrimestres"
          >
            <Icon boxSize={4} as={FaUndo} />
          </IconButton>
        </Tooltip>
      )}
    </Box>
  );
};

export default UserMenu;
