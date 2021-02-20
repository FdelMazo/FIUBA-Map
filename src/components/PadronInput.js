import { CheckCircleIcon, SettingsIcon } from "@chakra-ui/icons";
import { Box, Button, Flex, Input, useDisclosure } from "@chakra-ui/react";
import React from "react";
import { UserContext } from "../Contexts";
import UserModal from "./UserModal";

const PadronInput = () => {
  const { login, logged, user } = React.useContext(UserContext);

  const [loading, setLoading] = React.useState(false);
  const [notRegistered, setNotRegistered] = React.useState(false);
  const [lastInput, setLastInput] = React.useState("");
  const [padronInput, setPadronInput] = React.useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();

  const showRegisterButton = notRegistered && padronInput === lastInput;

  return (
    <Box>
      <form
        onSubmit={async (t) => {
          t.preventDefault();
          const padron = t.target.elements["padron"].value;
          if (logged || showRegisterButton) {
            onOpen();
            setLastInput(padron);
            return;
          }

          setLoading(true);
          const couldLogin = await login(padron);
          if (!couldLogin) setNotRegistered(true);
          setLoading(false);
          setLastInput(padron);
        }}
      >
        <Flex align="center">
          <Input
            borderRadius={4}
            size="sm"
            color="white"
            name="padron"
            placeholder="Padrón"
            value={user.padron || padronInput}
            onChange={(e) => setPadronInput(e.target.value)}
            isDisabled={logged}
          />

          <Button
            colorScheme={showRegisterButton ? "red" : "teal"}
            variant={showRegisterButton ? "solid" : "outline"}
            size="sm"
            px={showRegisterButton && 5}
            mx={2}
            isLoading={loading}
            type="submit"
          >
            {logged ? (
              <SettingsIcon />
            ) : showRegisterButton ? (
              "Registrarse"
            ) : (
              <CheckCircleIcon />
            )}
          </Button>
        </Flex>
      </form>
      <UserModal padronInput={padronInput} onClose={onClose} isOpen={isOpen} />
    </Box>
  );
};

export default PadronInput;
