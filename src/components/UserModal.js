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
} from "@chakra-ui/core";
import { UserContext } from "../Contexts";

const UserModal = (props) => {
  const { register, logout, user } = React.useContext(UserContext);
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
              <FormLabel>Padrón</FormLabel>
              <Input
                name="padron"
                placeholder="Padrón"
                value={user.padron}
                disabled
              />
              <Input name="carrera" placeholder="Carrera" />
              <Input name="orientacion" placeholder="Orientacion" />
              <Input name="finDeCarrera" placeholder="Fin de Carrera" />
            </FormControl>
            <Button type="submit">Guardar</Button>
          </form>
        </ModalBody>

        <ModalFooter>
          <Button onClick={props.onClose}>Cerrar</Button>
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
