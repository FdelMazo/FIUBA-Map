import { useMediaQuery } from "@chakra-ui/react";
import React from "react";
import CARRERAS from "./carreras";
import * as C from "./constants";
import { getFiubaRepos, getGraphs } from "./dbutils";

const userObj = {
  padron: "",
  carrera: CARRERAS.find((c) => c.id === "sistemas"),
  orientacion: null,
  finDeCarrera: null,
  allLogins: [],
  maps: [],
};

const useLogin = () => {
  const [user, setUser] = React.useState(userObj);
  const [loading, setLoading] = React.useState(false);
  const [loggingIn, setLoggingIn] = React.useState(false);
  const [padronInput, setPadronInput] = React.useState("");
  const logged = user.padron !== "";

  React.useEffect(() => {
    const padronStorage = window.localStorage.getItem("padron");
    if (padronStorage) {
      setPadronInput(padronStorage);
      login(padronStorage);
    }
  }, []);

  const login = async (padron) => {
    setLoading(true);
    if (!padron) {
      setLoading(false);
      return false;
    }

    const padrones = await fetch(
      `${C.SPREADSHEET}/${C.SHEETS.user}!B:B?majorDimension=COLUMNS&key=${C.KEY}`
    )
      .then((res) => res.json())
      .then((res) => (!res.error ? res.values[0] : null));

    if (!padrones) {
      setLoading(false);
      return false;
    }

    const indexes = [];
    let j = -1;
    while ((j = padrones.indexOf(padron, j + 1)) !== -1) {
      indexes.push(j);
    }

    if (!indexes.length) {
      setLoading(false);
      return false;
    }

    setLoggingIn(true)
    const ranges = indexes.map(
      (index) => `&ranges=${C.SHEETS.user}!${index + 1}:${index + 1}`
    );
    const data = await fetch(
      `${C.SPREADSHEET}:batchGet?key=${C.KEY}${ranges.join("")}`
    ).then((res) => res.json().then((res) => res.valueRanges));

    const allLogins = data.map((d) => ({
      carreraid: d.values[0][2],
      orientacionid: d.values[0][3],
      findecarreraid: d.values[0][4],
    }));

    let carrera, orientacion, finDeCarrera
    for (let login of allLogins) {
      const foundCarrera = CARRERAS.find((c) => c.id === login.carreraid);
      if (foundCarrera) {
        carrera = foundCarrera
        orientacion = foundCarrera.orientaciones?.find(
          (c) => c.nombre === login.orientacionid
        )
        finDeCarrera = carrera.finDeCarrera?.find((c) => c.id === login.findecarreraid)
        break
      };
    }

    const maps = await getGraphs(padron)

    setUser({
      padron,
      carrera,
      orientacion,
      finDeCarrera,
      allLogins,
      maps,
    });
    window.localStorage.setItem("padron", padron);
    setLoading(false);
    setLoggingIn(false)
    return true;
  };

  const register = async (p) => {
    const formData = new FormData();
    const padron = p || user.padron;
    const carreraid = user.carrera.id;
    const orientacionid = user.orientacion?.nombre;
    const findecarreraid = user.finDeCarrera?.id;
    formData.append(`${C.USER_FORM_ENTRIES.padron}`, padron);
    formData.append(`${C.USER_FORM_ENTRIES.carrera}`, carreraid);
    formData.append(`${C.USER_FORM_ENTRIES.orientacion}`, orientacionid || "");
    formData.append(
      `${C.USER_FORM_ENTRIES.finDeCarrera}`,
      findecarreraid || ""
    );
    fetch(`${C.USER_FORM}`, {
      body: formData,
      method: "POST",
      mode: "no-cors",
    });

    const carrera = CARRERAS.find((c) => c.id === carreraid);

    const addToAllLogins = () => {
      const newAllLogins = user.allLogins.filter(
        (l) => l.carreraid !== carreraid
      );
      newAllLogins.push({
        carreraid,
        orientacionid,
        findecarreraid,
      });
      return newAllLogins;
    };

    if (!logged) {
      setUser({
        padron,
        carrera,
        orientacion: carrera.orientaciones?.find(
          (c) => c.nombre === orientacionid
        ),
        finDeCarrera: carrera.finDeCarrera?.find(
          (c) => c.id === findecarreraid
        ),
        allLogins: [...addToAllLogins()],
      });
      window.localStorage.setItem("padron", padron);
    } else {
      setUser({
        ...user,
        allLogins: [...addToAllLogins()],
      });
    }
  };

  const logout = () => {
    setUser({ ...user, padron: "" });
    window.localStorage.removeItem("padron");
  };

  const [fiubaRepos, setFiubaRepos] = React.useState([])

  React.useEffect(() => {
    const fetchFiubaRepos = async () => {
      setFiubaRepos(await getFiubaRepos())
    };
    fetchFiubaRepos();
  }, []);

  const [isSmallMobile, isMobile] = useMediaQuery(['(max-width: 420px)', '(max-width: 750px)']);

  return {
    user,
    logged,
    login,
    loading,
    register,
    logout,
    setUser,
    padronInput,
    setPadronInput,
    fiubaRepos,
    isMobile,
    isSmallMobile,
    loggingIn,
  };
};

export default useLogin;
