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
} from "@chakra-ui/react";
import React from "react";
import { GraphContext, UserContext } from "../../Contexts";

const UserMenu = () => {
  const {
    logout,
    user,
    saving,
  } = React.useContext(UserContext);

  const { saveGraph, restartGraph, nodes } = React.useContext(GraphContext);

  const { setFirstTime, changeOrientacion, changeFinDeCarrera, getNode } =
    React.useContext(GraphContext);

  return (
    <>
      <Menu
        defaultIsOpen={
          (user?.carrera?.eligeOrientaciones && !user?.orientacion) ||
          (user?.carrera?.finDeCarrera && !user?.finDeCarrera)
        }
        closeOnSelect={false}
      >
        <MenuButton
          w="20ch"
          textAlign="left"
          as={Button}
          leftIcon={<SettingsIcon />}
          size="sm"
          alignSelf="flex-end"
          bg="teal.500"
          _hover={{ bg: "teal.600" }}
          _active={{ bg: "teal.600" }}
          color="white"
        >
          {user?.padron}
        </MenuButton>
        <MenuList>
          {user?.carrera?.finDeCarrera && (
            <MenuOptionGroup
              onChange={(value) => {
                setFirstTime(false);
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
                setFirstTime(false);
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

          <MenuItem onClick={logout}>
            <strong>Cerrar Sesión</strong>
          </MenuItem>
        </MenuList>
      </Menu>
      <Tooltip closeOnClick hasArrow placement="bottom" label="Guardar datos">
        <IconButton
          bg="teal.500"
          _hover={{ bg: "teal.600" }}
          color="white"
          size="sm"
          isLoading={saving}
          mx={2}
          onClick={() => {
            saveGraph();
          }}
        >
          <Icon boxSize={5} viewBox="0 0 448 512">
            <path
              fill="white"
              d="M433.941 129.941l-83.882-83.882A48 48 0 0 0 316.118 32H48C21.49 32 0 53.49 0 80v352c0 26.51 21.49 48 48 48h352c26.51 0 48-21.49 48-48V163.882a48 48 0 0 0-14.059-33.941zM224 416c-35.346 0-64-28.654-64-64 0-35.346 28.654-64 64-64s64 28.654 64 64c0 35.346-28.654 64-64 64zm96-304.52V212c0 6.627-5.373 12-12 12H76c-6.627 0-12-5.373-12-12V108c0-6.627 5.373-12 12-12h228.52c3.183 0 6.235 1.264 8.485 3.515l3.48 3.48A11.996 11.996 0 0 1 320 111.48z"
            />
          </Icon>
        </IconButton>
      </Tooltip>

      {nodes?.get({
        filter: (n) => n.cuatrimestre,
        fields: ["cuatrimestre"],
      }).length > 0 && (
          <Tooltip closeOnClick hasArrow placement="bottom" label="Limpiar todos los cuatris">
            <IconButton
              bg="teal.500"
              _hover={{ bg: "teal.600" }}
              color="white"
              size="sm"
              mx={0}
              onClick={() => {
                restartGraph();
              }}
            >
              <Icon boxSize={5} viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M12.2071 2.29289C12.5976 2.68342 12.5976 3.31658 12.2071 3.70711L10.9142 5H12.5C17.1523 5 21 8.84772 21 13.5C21 18.1523 17.1523 22 12.5 22C7.84772 22 4 18.1523 4 13.5C4 12.9477 4.44772 12.5 5 12.5C5.55228 12.5 6 12.9477 6 13.5C6 17.0477 8.95228 20 12.5 20C16.0477 20 19 17.0477 19 13.5C19 9.95228 16.0477 7 12.5 7H10.9142L12.2071 8.29289C12.5976 8.68342 12.5976 9.31658 12.2071 9.70711C11.8166 10.0976 11.1834 10.0976 10.7929 9.70711L7.79289 6.70711C7.40237 6.31658 7.40237 5.68342 7.79289 5.29289L10.7929 2.29289C11.1834 1.90237 11.8166 1.90237 12.2071 2.29289Z"
                />
              </Icon>
            </IconButton>
          </Tooltip>
        )}
    </>
  );
};

export default UserMenu;
