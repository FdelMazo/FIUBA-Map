import {
  Button,
  Collapse,
  FormControl,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  VStack,
} from "@chakra-ui/react";
import React from "react";
import CARRERAS from "../carreras";
import { GraphContext, UserContext } from "../Contexts";

const UserModal = (props) => {
  const { register, logout, user, logged } = React.useContext(UserContext);
  const { carrera, changeCarrera } = React.useContext(GraphContext);

  return (
    <Modal isOpen={props.isOpen} onClose={props.onClose}>
      <ModalOverlay />
      <ModalContent>
        <form
          onSubmit={(t) => {
            t.preventDefault();
            register(t.target.elements);
          }}
        >
          <ModalHeader>{logged ? "Configuración" : "Registrate"}</ModalHeader>
          <ModalBody>
            <FormControl>
              <VStack spacing={4} align="stretch">
                <Input
                  w="90%"
                  name="padron"
                  placeholder="Padrón"
                  value={user.padron || null}
                  disabled={logged}
                />
                <Select w="85%" onChange={(e) => changeCarrera(e.target.value)}>
                  {Object.keys(CARRERAS).map((id) => (
                    <option value={id}>{CARRERAS[id].nombre}</option>
                  ))}
                </Select>

                <Collapse in={carrera.orientaciones}>
                  <Select w="85%" placeholder="Sin orientación definida">
                    {carrera.orientaciones &&
                      Object.keys(carrera?.orientaciones).map((id) => (
                        <option value={id}>
                          {carrera.orientaciones[id].nombre}
                        </option>
                      ))}
                  </Select>
                </Collapse>

                <Collapse in={carrera.finDeCarrera}>
                  <Select w="85%" placeholder="Sin final de carrera definido">
                    {carrera.finDeCarrera &&
                      Object.keys(carrera.finDeCarrera).map((id) => (
                        <option value={id}>
                          {carrera.finDeCarrera[id].nombre}
                        </option>
                      ))}
                  </Select>
                </Collapse>
              </VStack>
            </FormControl>
          </ModalBody>

          <ModalFooter>
            {logged && (
              <Button
                colorScheme="red"
                mr={5}
                onClick={() => {
                  logout();
                  props.onClose();
                }}
              >
                Cerrar sesion
              </Button>
            )}

            <Button type="submit" colorScheme="teal">
              Guardar
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default UserModal;
