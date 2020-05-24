import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  Button,
  Input,
  ModalCloseButton,
} from "@chakra-ui/core";
import PadronInput from "./PadronInput";
import CarreraSelect from "./CarreraSelect";

const UserModal = (props) => (
  <Modal isOpen={props.isOpen} onClose={props.onClose}>
    <ModalOverlay />
    <ModalContent>
      <ModalHeader>Modal Title</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <PadronInput />
        <CarreraSelect />
      </ModalBody>
    </ModalContent>
  </Modal>
);

export default UserModal;
