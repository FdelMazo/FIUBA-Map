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
  const {
    carrera,
    changeCarrera,
    orientacion,
    setOrientacion,
    finDeCarrera,
    setFinDeCarrera,
    nodeFunctions,
  } = React.useContext(GraphContext);
  const { getNode } = nodeFunctions;

  return (
    <Modal
      isOpen={props.isOpen}
      onClose={props.onClose}
      closeOnOverlayClick={false}
    >
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
                  value={user.padron || props.padronInput}
                  disabled={logged}
                />

                <Select
                  w="85%"
                  name="carrera"
                  value={carrera.id}
                  onChange={(e) => changeCarrera(e.target.value)}
                >
                  {CARRERAS.map((c) => (
                    <option value={c.id}>{c.nombre}</option>
                  ))}
                </Select>

                <Collapse in={carrera.finDeCarrera}>
                  <Select
                    name="finDeCarrera"
                    value={finDeCarrera || null}
                    onChange={(event) => {
                      setFinDeCarrera(event.currentTarget.value);
                    }}
                    placeholder="Final de carrera no definido"
                    w="85%"
                  >
                    {carrera.finDeCarrera &&
                      Object.values(carrera.finDeCarrera).map((v) => (
                        <option value={v.id}>
                          {getNode(v.materia) && getNode(v.materia).materia}
                        </option>
                      ))}
                  </Select>
                </Collapse>

                <Collapse
                  in={
                    carrera.orientaciones &&
                    (carrera.eligeOrientaciones === true ||
                      carrera.eligeOrientaciones?.[finDeCarrera])
                  }
                >
                  <Select
                    name="orientacion"
                    value={orientacion || null}
                    placeholder="Orientación no definida"
                    onChange={(event) =>
                      setOrientacion(event.currentTarget.value)
                    }
                    w="85%"
                  >
                    {carrera.orientaciones &&
                      carrera.orientaciones.map((v) => (
                        <option value={v.nombre}>{v.nombre}</option>
                      ))}
                  </Select>
                </Collapse>
              </VStack>
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={5} onClick={props.onClose}>
              Cerrar
            </Button>

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
