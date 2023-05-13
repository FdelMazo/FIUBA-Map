import { CheckCircleIcon } from "@chakra-ui/icons";
import {
  Button,
  Input,
  Tooltip,
} from "@chakra-ui/react";
import React from "react";
import { UserContext } from "../../Contexts";

const PadronInput = () => {
  const {
    login,
    logged,
    user,
    loading,
    register,
    padronInput,
    setPadronInput,
  } = React.useContext(UserContext);

  const [notRegistered, setNotRegistered] = React.useState(false);
  const [lastInput, setLastInput] = React.useState("");

  const showRegisterButton = notRegistered && padronInput === lastInput;

  return (
    <form
      onSubmit={async (t) => {
        t.preventDefault();
        const padron = t.target.elements["padron"].value;
        if (showRegisterButton) {
          setLastInput("");
          register(padron);
          return;
        }

        const couldLogin = await login(padron);
        if (!couldLogin) setNotRegistered(true);
        setLastInput(padron);
      }}
    >
      <Input
        css={{
          "&::placeholder": {
            color: "LightGray",
          },
        }}
        borderRadius={"md"}
        size="sm"
        w="20ch"
        borderColor="white"
        color="white"
        name="padron"
        placeholder="Legajo"
        value={user.padron || padronInput}
        autoFocus={true}
        isReadOnly={loading || logged}
        onChange={(e) => setPadronInput(e.target.value)}
        isDisabled={loading}
      />

      <Tooltip closeOnClick hasArrow label={showRegisterButton ? undefined : "Ingresar"} placement="bottom-start">
        <Button
          colorScheme={"whiteAlpha"}
          color="white"
          variant={"outline"}
          size="sm"
          ml={2}
          px={0}
          isLoading={loading}
          isDisabled={padronInput === ""}
          type="submit"
          {...(showRegisterButton && {
            px: 6,
            variant: "solid",
            bg: "red.500",
            _hover: { bg: "red.600" },
            size: "sm"
          })}
        >
          {showRegisterButton ? "Registrarse" : <CheckCircleIcon />}
        </Button>
      </Tooltip>
    </form>

  );
};

export default PadronInput;
