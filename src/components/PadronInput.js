import { CheckCircleIcon, SettingsIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  Icon,
  IconButton,
  Input,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Switch,
  useDisclosure,
} from "@chakra-ui/react";
import React from "react";
import { GraphContext, UserContext } from "../Contexts";
import { COLORS } from "../theme";
import UserModal from "./UserModal";

const PadronInput = () => {
  const { login, logged, user, loading, saving } = React.useContext(
    UserContext
  );

  const { autosave, setAutosave, saveGraph } = React.useContext(GraphContext);

  const [notRegistered, setNotRegistered] = React.useState(false);
  const [lastInput, setLastInput] = React.useState("");
  const [padronInput, setPadronInput] = React.useState("");
  const { isOpen, onOpen, onClose: onClosex } = useDisclosure();
  const onClose = () => {
    setNotRegistered(false);
    onClosex();
  };

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

          const couldLogin = await login(padron);
          if (!couldLogin) setNotRegistered(true);
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
            colorScheme={showRegisterButton ? "red" : "accent"}
            variant={showRegisterButton ? "solid" : "outline"}
            size="sm"
            title={!logged && !showRegisterButton && "Ingresar"}
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
          {logged && (
            <Popover placement="right-end" trigger="hover">
              <PopoverTrigger>
                <IconButton
                  colorScheme="accent"
                  variant={"outline"}
                  size="sm"
                  isLoading={saving}
                  onClick={() => {
                    saveGraph();
                  }}
                >
                  <Icon boxSize={5} viewBox="0 0 448 512">
                    <path
                      fill={COLORS.accent[600]}
                      d="M433.941 129.941l-83.882-83.882A48 48 0 0 0 316.118 32H48C21.49 32 0 53.49 0 80v352c0 26.51 21.49 48 48 48h352c26.51 0 48-21.49 48-48V163.882a48 48 0 0 0-14.059-33.941zM224 416c-35.346 0-64-28.654-64-64 0-35.346 28.654-64 64-64s64 28.654 64 64c0 35.346-28.654 64-64 64zm96-304.52V212c0 6.627-5.373 12-12 12H76c-6.627 0-12-5.373-12-12V108c0-6.627 5.373-12 12-12h228.52c3.183 0 6.235 1.264 8.485 3.515l3.48 3.48A11.996 11.996 0 0 1 320 111.48z"
                    />
                  </Icon>
                </IconButton>
              </PopoverTrigger>
              <PopoverContent size="sm" w="fit-content" borderColor="white">
                <PopoverArrow />
                <PopoverBody
                  isChecked={autosave}
                  onClick={() => {
                    setAutosave(!autosave);
                  }}
                  color="black"
                >
                  auto-save
                  <Switch colorScheme="accent" ml={2} />
                </PopoverBody>
              </PopoverContent>
            </Popover>
          )}
        </Flex>
      </form>
      <UserModal padronInput={padronInput} onClose={onClose} isOpen={isOpen} />
    </Box>
  );
};

export default PadronInput;
