import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  Input,
  FormControl,
  FormLabel,
  ModalCloseButton,
  ModalFooter,
  Button,
} from "@chakra-ui/react";
import { UserContext, GraphContext } from "../Contexts";
import CarreraSelect from "./CarreraSelect";
import OrientacionSelect from "./OrientacionSelect";
import FinDeCarreraSelect from "./FinDeCarreraSelect";

const UserModal = (props) => {
  const { register, logout, user } = React.useContext(UserContext);
  const { carrera } = React.useContext(GraphContext);
  return (
    <Modal isOpen={props.isOpen} onClose={props.onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Tus Datos</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form
            onSubmit={(t) => {
              t.preventDefault();
              register(t.target.elements);
            }}
          >
            <FormControl>
              <Input
                name="padron"
                placeholder="Padrón"
                value={user.padron}
                disabled
              />
              <CarreraSelect />
              {carrera.orientaciones && <OrientacionSelect />}
              {carrera.finDeCarrera && <FinDeCarreraSelect />}
            </FormControl>
            <Button type="submit">Guardar</Button>
          </form>
        </ModalBody>

        <ModalFooter>
          <Button
            onClick={() => {
              logout();
              props.onClose();
            }}
          >
            Cerrar sesion
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default UserModal;
