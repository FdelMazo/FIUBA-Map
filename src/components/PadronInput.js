import { CheckCircleIcon, CloseIcon, SettingsIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  IconButton,
  Input,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect } from "react";
import { UserContext } from "../Contexts";
import UserModal from "./UserModal";

const PadronInput = () => {
  const { login, logged, loading, firstTime, user } = React.useContext(
    UserContext
  );
  const { isOpen, onOpen, onClose } = useDisclosure();

  const toast = useToast();

  useEffect(() => {
    if (firstTime)
      toast({
        position: "top",
        duration: 3000,
        render: () => (
          <Button colorScheme="teal" onClick={onOpen}>
            Registrar
          </Button>
        ),
      });
  }, [firstTime, toast, onOpen]);

  return (
    <Box>
      <form
        onSubmit={(t) => {
          t.preventDefault();
          login(t.target.elements["padron"].value);
        }}
      >
        <Flex align="center" bg="primary" color="secondary">
          <Input
            borderRadius={4}
            bg="transparent"
            size="sm"
            color="white"
            name="padron"
            placeholder="Padrón"
            value={user.padron || null}
            isDisabled={logged}
          />
          <IconButton
            variant="outline"
            ml={1}
            colorScheme={firstTime ? "red" : "teal"}
            icon={
              logged ? (
                <SettingsIcon />
              ) : firstTime ? (
                <CloseIcon />
              ) : (
                <CheckCircleIcon />
              )
            }
            size="sm"
            isLoading={loading}
            type={logged ? null : "submit"}
            onClick={logged ? onOpen : null}
          />
        </Flex>
      </form>
      <UserModal onClose={onClose} isOpen={isOpen} />
    </Box>
  );
};

export default PadronInput;
