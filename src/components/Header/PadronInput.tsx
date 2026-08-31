import { CheckCircleIcon } from "@chakra-ui/icons";
import { Button, Input, Tooltip, useToast } from "@chakra-ui/react";
import React from "react";
import { UserContext } from "../../MapContext";

// Input del padron, para cuando no estas logueado
// On boot, si hay un padron en el local storage, usa ese
// Si el padron se pudo loguear, genial. Si no, te muestra un botoncito de "registrate" para guardar en la db
const PadronInput = () => {
  const {
    login,
    logged,
    user,
    loading,
    signup,
    padronInput,
    setPadronInput,
    dbUnavailable,
  } = React.useContext(UserContext);
  const toast = useToast();

  const [notRegistered, setNotRegistered] = React.useState(false);
  const [lastInput, setLastInput] = React.useState("");

  const showRegisterButton =
    notRegistered && padronInput === lastInput && !dbUnavailable;

  return (
    <form
      onSubmit={async (t) => {
        t.preventDefault();
        if (showRegisterButton) {
          setLastInput("");
          signup(padronInput);
          return;
        }

        const res = await login(padronInput);
        if (res === "notfound") {
          setNotRegistered(true);
          setLastInput(padronInput);
        } else if (res === "error") {
          toast({
            status: "error",
            variant: "subtle",
            title: "No se pudo conectar con la base de datos",
            duration: 4000,
            isClosable: true,
          });
        }
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

      {!dbUnavailable && (
        <Tooltip
          closeOnClick
          hasArrow
          label={showRegisterButton ? undefined : "Ingresar"}
          placement="bottom-start"
        >
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
              size: "sm",
            })}
          >
            {showRegisterButton ? "Registrarse" : <CheckCircleIcon />}
          </Button>
        </Tooltip>
      )}
    </form>
  );
};

export default PadronInput;
