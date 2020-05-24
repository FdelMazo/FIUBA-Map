import React from "react";
import { Input } from "@chakra-ui/core";
import { debounce } from "lodash";
import UserContext from "./UserContext";

const PadronInput = () => {
  const { login } = React.useContext(UserContext);

  let debouncedOnChange = null;

  const onChange = (event) => {
    event.persist();
    if (!debouncedOnChange) {
      debouncedOnChange = debounce(() => {
        login(event.target.value);
      }, 300);
    }
    debouncedOnChange();
  };

  return <Input size="sm" placeholder="Padrón" onChange={onChange} />;
};

export default PadronInput;
