import { CheckCircleIcon } from "@chakra-ui/icons";
import {
  Button,
  Input,
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
        borderRadius={4}
        size="sm"
        w="20ch"
        borderColor="white"
        color="white"
        name="padron"
        placeholder="Padrón"
        value={user.padron || padronInput}
        autoFocus={true}
        isReadOnly={loading || logged}
        onChange={(e) => setPadronInput(e.target.value)}
        isDisabled={loading}
      />

      <Button
        colorScheme={showRegisterButton ? "red" : "whiteAlpha"}
        color="white"
        variant={showRegisterButton ? "solid" : "outline"}
        size="sm"
        title={!showRegisterButton && "Ingresar"}
        px={showRegisterButton && 7}
        mx={2}
        isLoading={loading}
        isDisabled={padronInput === ""}
        type="submit"
      >
        {showRegisterButton ? "Registrarse" : <CheckCircleIcon />}
      </Button>
    </form>

  );
};

export default PadronInput;
