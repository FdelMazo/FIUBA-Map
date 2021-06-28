import { SettingsIcon } from "@chakra-ui/icons";
import {
  Button,
  LightMode,
  Menu,
  MenuButton,
  MenuItem,
  MenuItemOption,
  MenuList,
  MenuOptionGroup,
} from "@chakra-ui/react";
import React from "react";
import { GraphContext, UserContext } from "../Contexts";

const UserMenu = (props) => {
  const { logout, user } = React.useContext(UserContext);
  const { setFirstTime, changeOrientacion, changeFinDeCarrera, getNode } =
    React.useContext(GraphContext);

  const OrientacionesMenuGroup = () => (
    <MenuOptionGroup
      onChange={(value) => {
        setFirstTime(false);
        changeOrientacion(value);
      }}
      value={user.orientacion?.nombre || "none"}
      title="Orientación"
      type="radio"
    >
      <MenuItemOption type="checkbox" value={"none"}>
        No me decidí
      </MenuItemOption>

      {user.carrera?.orientaciones &&
        user.carrera?.orientaciones
          .filter((o) => !o.nonEligible)
          .map((o) => (
            <MenuItemOption type="checkbox" value={o.nombre}>
              {o.nombre}
            </MenuItemOption>
          ))}
    </MenuOptionGroup>
  );

  return (
    <Menu
      defaultIsOpen={
        ((user.carrera.eligeOrientaciones === true ||
          user.carrera?.eligeOrientaciones?.[user.finDeCarrera?.id]) &&
          !user.orientacion) ||
        (user.carrera.finDeCarrera && !user.finDeCarrera)
      }
      closeOnSelect={false}
    >
      {!props.displayedNode && (
        <>
          <LightMode>
            <MenuButton
              w="20ch"
              textAlign="left"
              as={Button}
              leftIcon={<SettingsIcon />}
              size="sm"
              colorScheme="teal"
              alignSelf="flex-end"
            >
              {user.padron}
            </MenuButton>
          </LightMode>
          <MenuList>
            {user.carrera.finDeCarrera && (
              <MenuOptionGroup
                onChange={(value) => {
                  setFirstTime(false);
                  changeFinDeCarrera(value);
                }}
                value={user.finDeCarrera?.id || "none"}
                title="Fin de Carrera"
                type="radio"
              >
                <MenuItemOption type="checkbox" value={"none"}>
                  No me decidí
                </MenuItemOption>

                {user.carrera?.finDeCarrera &&
                  Object.values(user.carrera.finDeCarrera).map((v) => (
                    <MenuItemOption type="checkbox" value={v.id}>
                      {getNode(v.materia)?.materia}
                    </MenuItemOption>
                  ))}
              </MenuOptionGroup>
            )}

            {(user.carrera?.eligeOrientaciones === true ||
              user.carrera?.eligeOrientaciones?.[user.finDeCarrera?.id]) && (
              <OrientacionesMenuGroup />
            )}

            <MenuItem onClick={logout}>
              <strong>Cerrar Sesión</strong>
            </MenuItem>
          </MenuList>
        </>
      )}
    </Menu>
  );
};

export default UserMenu;
