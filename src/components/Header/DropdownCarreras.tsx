import React from "react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Button,
  Icon,
  Link,
  Menu,
  MenuButton,
  MenuList,
  Tooltip,
  Box,
  Text,
  Hide,
  Show,
  Badge,
  MenuItem,
  useColorModeValue,
} from "@chakra-ui/react";
import { CARRERAS, PLANES } from "../../carreras";
import { GraphContext, UserContext } from "../../MapContext";

const AnoBadge = ({ ano, active, ...rest }) => {
  const activeVariant = useColorModeValue("solid", "subtle");
  const commonProps = {
    mx: 1,
    variant: active ? activeVariant : "outline",
    textAlign: "center",
    colorScheme: "gray",
    ...rest,
  };
  if (ano === 2020) {
    return (
      <Badge {...commonProps} fontSize="x-small" colorScheme="green">
        PLAN <br /> 2020
      </Badge>
    );
  }
  return (
    <Badge {...commonProps} fontSize="small">
      {ano}
    </Badge>
  );
};

// Componente para elegir carrera
const DropdownCarreras = () => {
  const { user } = React.useContext(UserContext);
  const { changeCarrera } = React.useContext(GraphContext);

  const carrera = React.useMemo(() => {
    const { nombre, nombrecorto } = PLANES.find((p) =>
      p.planes.includes(user.carrera.id),
    );
    return { nombre, nombrecorto };
  }, [user.carrera.id]);

  return (
    <Box key={user.carrera.id}>
      <Menu placement="bottom" isLazy>
        <Tooltip
          placement="bottom"
          label={
            user.carrera.beta && (
              <Box fontSize="xs">
                <Text>Los planes nuevos cambian todo el tiempo.</Text>
                <Text>
                  Esto puede estar desactualizado frente a los últimos anuncios.
                </Text>
                <Text>
                  Haceme saber si falta alguna actualización sustancial del
                  plan.
                </Text>
              </Box>
            )
          }
        >
          <MenuButton
            colorScheme="whiteAlpha"
            variant="outline"
            color="white"
            borderRadius="md"
            as={Button}
            mr={2}
            rightIcon={<ChevronDownIcon />}
          >
            {user.carrera.beta && (
              <Badge variant="subtle" mr={1} colorScheme="purple">
                BETA
              </Badge>
            )}
            {/* Hardcoded to chakra md breakpoint */}
            <Show ssr={false} breakpoint="(max-width: 48em)">
              {carrera.nombrecorto}
            </Show>
            <Hide ssr={false} breakpoint="(max-width: 48em)">
              {carrera.nombre}
            </Hide>
            <AnoBadge ano={user.carrera.ano} active={true} />
          </MenuButton>
        </Tooltip>
        <MenuList overflowY="auto" maxHeight="70vh">
          {PLANES.map((p) => (
            <MenuItem
              key={p.nombrecorto}
              display="flex"
              justifyContent="space-between"
              {...(p.planes.length === 1
                ? {
                    onClick: () => {
                      changeCarrera(p.planes[0]);
                    },
                  }
                : { cursor: "default", closeOnSelect: false })}
            >
              <Text as={p.planes.includes(user.carrera.id) && "b"}>
                {p.nombre}
              </Text>
              <Box ml={2}>
                {p.planes.map((c) => {
                  const plan = CARRERAS.find((carrera) => carrera.id === c);
                  const active = user.carrera.id === c;
                  return (
                    <AnoBadge
                      key={c}
                      ano={plan.ano}
                      active={active}
                      cursor="pointer"
                      onClick={() => {
                        changeCarrera(c);
                      }}
                      _hover={
                        !active &&
                        p.planes.length > 1 && {
                          border: "1px",
                        }
                      }
                    />
                  );
                })}
              </Box>
            </MenuItem>
          ))}
        </MenuList>
      </Menu>
      <Hide ssr={false} below="md">
        <Tooltip
          closeOnClick
          hasArrow
          label="Plan de Estudios"
          placement="bottom"
        >
          <Link color="white" href={user.carrera.link} isExternal>
            <Icon boxSize={6} viewBox="0 0 512 512">
              <path
                fill="currentColor"
                d="M496 128v16a8 8 0 0 1-8 8h-24v12c0 6.627-5.373 12-12 12H60c-6.627 0-12-5.373-12-12v-12H24a8 8 0 0 1-8-8v-16a8 8 0 0 1 4.941-7.392l232-88a7.996 7.996 0 0 1 6.118 0l232 88A8 8 0 0 1 496 128zm-24 304H40c-13.255 0-24 10.745-24 24v16a8 8 0 0 0 8 8h464a8 8 0 0 0 8-8v-16c0-13.255-10.745-24-24-24zM96 192v192H60c-6.627 0-12 5.373-12 12v20h416v-20c0-6.627-5.373-12-12-12h-36V192h-64v192h-64V192h-64v192h-64V192H96z"
              />
            </Icon>
          </Link>
        </Tooltip>
      </Hide>
    </Box>
  );
};

export default DropdownCarreras;
