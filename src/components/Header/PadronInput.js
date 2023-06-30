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
    signup,
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
        if (showRegisterButton) {
          setLastInput("");
          await signup(padronInput);
          return;
        }

        await login(padronInput).then((res) => {
          if (!res) {
            setNotRegistered(true);
            setLastInput(padronInput);
          }
        })
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
        placeholder="Padrón"
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
