import React from 'react'
import { ChevronDownIcon } from "@chakra-ui/icons";
import {
    Button,
    Icon,
    Link,
    Menu,
    MenuButton,
    MenuItemOption,
    MenuList,
    MenuOptionGroup,
    Tooltip,
    Box,
    Text,
    Hide,
    Show,
} from "@chakra-ui/react";
import CARRERAS from "../../carreras";
import { GraphContext, UserContext } from "../../MapContext";

// Componente para elegir carrera
const DropdownCarreras = () => {
    const { user } = React.useContext(UserContext);
    const { changeCarrera } = React.useContext(GraphContext);

    return (<Box>
        <Menu placement="bottom-end" isLazy>
            <Tooltip placement="bottom"
                label={
                    user.carrera.beta && (<Box fontSize="xs">
                        <Text >Los planes nuevos (y como pasarse de plan) cambian todo el tiempo.</Text>
                        <Text>Esto está solamente para <Text as="em">darse una idea</Text> de como te quedaría la carrera si te cambias de plan, pero no es algo estricto ni 100% fiel a la realidad.</Text>
                        <Text>Cuando se oficialicen los planes, lo mejor va a ser revisar uno por uno todo lo aprobado contra el SIU para confirmar que no quedó nada mal cargado</Text>
                    </Box>)
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
                    {/* Hardcoded to chakra md breakpoint */}
                    <Show ssr={false} breakpoint='(max-width: 48em)'>
                        {user.carrera.nombrecorto}
                    </Show>
                    <Hide ssr={false} breakpoint='(max-width: 48em)'>
                        {user.carrera.nombre}
                    </Hide>
                </MenuButton>
            </Tooltip>
            <MenuList>
                <MenuOptionGroup
                    onChange={(v) => {
                        changeCarrera(v);
                    }}
                    defaultValue={user.carrera.id}
                    type="radio"
                >
                    {CARRERAS.map((c) => (
                        <MenuItemOption key={c.id} value={c.id}>
                            {c.nombre}
                        </MenuItemOption>
                    ))}
                </MenuOptionGroup>
            </MenuList>
        </Menu>
        <Hide ssr={false} below="md">
            <Tooltip closeOnClick hasArrow label="Plan de Estudios" placement="bottom">
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
    </Box>)
}

export default DropdownCarreras;
