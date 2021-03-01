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
  const { padronInput, isOpen, onClose } = props;
  const {
    changeCarrera,
    changeOrientacion,
    changeFinDeCarrera,
    getNode,
  } = React.useContext(GraphContext);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      closeOnOverlayClick={false}
      closeOnEsc={false}
    >
      <ModalOverlay />
      <ModalContent>
        <form
          onSubmit={(t) => {
            t.preventDefault();
            register(t.target.elements);
            onClose();
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
                  value={user.padron || padronInput}
                  disabled={logged}
                />
                1
                <Select
                  w="85%"
                  name="carrera"
                  value={user.carrera?.id}
                  onChange={(e) => changeCarrera(e.target.value)}
                >
                  {CARRERAS.map((c) => (
                    <option value={c.id}>{c.nombre}</option>
                  ))}
                </Select>
                <Collapse in={user.carrera?.finDeCarrera} unmountOnExit>
                  <Select
                    key={user.carrera?.id}
                    name="finDeCarrera"
                    value={user.finDeCarrera?.id || null}
                    onChange={(event) => {
                      changeFinDeCarrera(event.currentTarget.value);
                    }}
                    placeholder="Final de carrera no definido"
                    w="85%"
                  >
                    {user.carrera?.finDeCarrera &&
                      Object.values(user.carrera.finDeCarrera).map((v) => (
                        <option value={v.id}>
                          {getNode(v.materia)?.materia}
                        </option>
                      ))}
                  </Select>
                </Collapse>
                <Collapse
                  in={
                    user.carrera?.eligeOrientaciones === true ||
                    user.carrera?.eligeOrientaciones?.[user.finDeCarrera?.id]
                  }
                  unmountOnExit
                >
                  <Select
                    name="orientacion"
                    value={user.orientacion?.nombre || null}
                    placeholder="Orientación no definida"
                    onChange={(event) =>
                      changeOrientacion(event.currentTarget.value)
                    }
                    w="85%"
                  >
                    {user.carrera?.orientaciones &&
                      user.carrera?.orientaciones.map((v) => (
                        <option value={v.nombre}>{v.nombre}</option>
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
                  onClose();
                }}
              >
                Cerrar sesion
              </Button>
            )}
            {!logged && (
              <Button colorScheme="blue" mr={5} onClick={onClose}>
                Cerrar
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
