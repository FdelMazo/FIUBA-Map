import React, { useEffect } from "react";
import {
  Input,
  Button,
  Box,
  Flex,
  IconButton,
  useToast,
  useDisclosure,
} from "@chakra-ui/core";
import UserContext from "../UserContext";
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
        title: "Padrón no registrado",
        description: <Button onClick={onOpen}>Registrar</Button>,
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
            bg="transparent"
            size="sm"
            color="secondary"
            name="padron"
            placeholder="Padrón"
            value={user.padron || null}
            isDisabled={logged}
          />
          <IconButton
            variant="outline"
            ml={1}
            variantColor={firstTime ? "red" : "teal"}
            icon={logged ? "settings" : firstTime ? "close" : "check"}
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
