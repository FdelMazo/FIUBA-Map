import React from "react";
import * as C from "./constants";

const userObj = {
  padron: "",
  carrera: "",
  orientacion: "",
  finDeCarrera: "",
};

const useLogin = () => {
  const [user, setUser] = React.useState(userObj);
  let [loading, setLoading] = React.useState(false);
  let [firstTime, setFirstTime] = React.useState(false);

  const logged = user.padron !== "";

  React.useEffect(() => {
    if (!logged && window.localStorage.getItem("padron"))
      login(window.localStorage.getItem("padron"));
  }, [logged]);

  const login = async (padron) => {
    setFirstTime(false);
    setLoading(true);
    const index = await fetch(
      `${C.SPREADSHEET}${C.SHEETS.user.name}!${C.SHEETS.user.columns.padron}:${C.SHEETS.user.columns.padron}?majorDimension=COLUMNS&key=${C.KEY}`
    )
      .then((res) => res.json())
      .then((res) => res.values[0].indexOf(padron));
    if (index === -1) {
      setFirstTime(true);
      setLoading(false);
      return;
    }
    const dbUser = await fetch(
      `${C.SPREADSHEET}${C.SHEETS.user.name}!${index + 1}:${index + 1}?key=${
        C.KEY
      }`
    ).then((res) => res.json().then((res) => res.values[0]));
    setUser({
      padron,
      carrera: dbUser[`${C.SHEETS.user.index.carrera}`],
      orientacion: dbUser[`${C.SHEETS.user.index.orientacion}`],
      finDeCarrera: dbUser[`${C.SHEETS.user.index.finDeCarrera}`],
    });
    window.localStorage.setItem("padron", padron);
    setFirstTime(false);
    setLoading(false);
  };

  const register = (data) => {
    const formData = new FormData();
    formData.append(`${C.USER_FORM_ENTRIES.padron}`, data["padron"].value);
    formData.append(`${C.USER_FORM_ENTRIES.carrera}`, data["carrera"].value);
    formData.append(
      `${C.USER_FORM_ENTRIES.orientacion}`,
      data["orientacion"]?.value
    );
    formData.append(
      `${C.USER_FORM_ENTRIES.finDeCarrera}`,
      data["finDeCarrera"]?.value
    );
    fetch(`${C.USER_FORM}`, {
      body: formData,
      method: "POST",
    });
  };

  const logout = () => {
    setUser(userObj);
    window.localStorage.removeItem("padron");
  };

  return { user, logged, login, loading, firstTime, register, logout };
};

export default useLogin;
