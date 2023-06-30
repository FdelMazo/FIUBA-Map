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
} from "@chakra-ui/react";
import { BiLogOut } from "react-icons/bi";
import { FaSave, FaUndo } from "react-icons/fa";

import React from "react";
import { GraphContext, UserContext } from "../../MapContext";

const ButtonProps = {
  bg: "teal.500",
  color: "white",
  _hover: { bg: "teal.600" },
  _active: { 'bg': "teal.600" },
  size: "sm"
}

const TooltipProps = {
  closeOnClick: true,
  hasArrow: true,
  placement: "bottom"
}

const UserMenu = () => {
  const {
    logout,
    user,
  } = React.useContext(UserContext);

  const { saveGraph, restartGraphCuatris, getters, changeOrientacion, changeFinDeCarrera, getNode } = React.useContext(GraphContext);

  const [saving, setSaving] = React.useState(false);

  const isBeta = user?.carrera?.beta;
  return (
    <Box>
      <Menu
        closeOnSelect={false}
        defaultIsOpen={
          (user?.carrera?.eligeOrientaciones && !user?.orientacion) ||
          (user?.carrera?.finDeCarrera && !user?.finDeCarrera)
        }>
        <MenuButton
          w="20ch"
          textAlign="left"
          as={Button}
          leftIcon={<SettingsIcon />}
          {...ButtonProps}
        >
          <Text overflow='hidden' textOverflow='ellipsis'>
            {user?.padron}
          </Text>
        </MenuButton>
        <MenuList>
          {user?.carrera?.finDeCarrera && (
            <MenuOptionGroup
              onChange={(value) => {
                changeFinDeCarrera(value);
              }}
              value={user?.finDeCarrera?.id || "none"}
              title="Fin de Carrera"
              type="radio"
            >
              <MenuItemOption type="checkbox" value={"none"}>
                No me decidí
              </MenuItemOption>

              {user?.carrera?.finDeCarrera &&
                Object.values(user?.carrera.finDeCarrera).map((v) => (
                  <MenuItemOption type="checkbox" value={v.id} key={v.id}>
                    {getNode(v.materia)?.materia}
                  </MenuItemOption>
                ))}
            </MenuOptionGroup>
          )}

          {user?.carrera?.eligeOrientaciones &&
            (<MenuOptionGroup
            onChange={(value) => {
                changeOrientacion(value);
              }}
              value={user?.orientacion?.nombre || "none"}
              title="Orientación"
              type="radio"
            >
              <MenuItemOption type="checkbox" value={"none"}>
                No me decidí
              </MenuItemOption>

              {user?.carrera?.orientaciones &&
                user?.carrera?.orientaciones
                  .filter((o) => !o.nonEligible)
                  .map((o) => (
                    <MenuItemOption type="checkbox" value={o.nombre} key={o.nombre}>
                      {o.nombre}
                    </MenuItemOption>
                  ))}
            </MenuOptionGroup>)
          }

          <MenuItem onClick={logout} icon={<BiLogOut size={"1.8em"} />}>
            <strong>Cerrar Sesión</strong>
          </MenuItem>

        </MenuList>
      </Menu>
      <Tooltip {...TooltipProps} label="Guardar datos">
        <IconButton
          {...ButtonProps}
          ml={2}
          isLoading={saving}
          onClick={async () => {
            setSaving(true);
            await saveGraph().catch(console.error);
            setSaving(false);
          }}
          disabled={isBeta}
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
          >
            <Icon boxSize={4} as={FaUndo} />
            </IconButton>
          </Tooltip>
        )}
    </Box>
  );
};

export default UserMenu;
