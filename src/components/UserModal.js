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

                <Select
                  w="85%"
                  value={carrera || null}
                  onChange={(e) => changeCarrera(e.target.value)}
                >
                  {Object.keys(CARRERAS).map((id) => (
                    <option value={id}>{CARRERAS[id].nombre}</option>
                  ))}
                </Select>

                <Collapse in={carrera.finDeCarrera}>
                  <Select
                    value={finDeCarrera || null}
                    onChange={(event) => {
                      setFinDeCarrera(event.currentTarget.value);
                    }}
                    w="85%"
                    placeholder="Sin final de carrera definido"
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
                    value={orientacion || null}
                    onChange={(event) =>
                      setOrientacion(event.currentTarget.value)
                    }
                    w="85%"
                    placeholder="Sin orientación definida"
                  >
                    {carrera.orientaciones &&
                      Object.keys(carrera?.orientaciones).map((name) => (
                        <option value={name}>{name}</option>
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
