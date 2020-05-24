import React from "react";

const userObj = {
  padron: "",
  nombre: "",
  carrera: "",
  orientacion: "",
  finDeCarrera: "",
};

const useLogin = () => {
  const [user, setUser] = React.useState(userObj);

  const login = (padron) => {
    setUser({ ...user, padron });
  };

  const logged = user.padron !== "";

  return { user, logged, login };
};

export default useLogin;
