import React from "react";
import CARRERAS from "./carreras";
import * as C from "./constants";

const userObj = {
  padron: "",
  carrera: null,
  orientacion: null,
  finDeCarrera: null,
  allLogins: [],
};

const useLogin = () => {
  const [user, setUser] = React.useState(userObj);
  const [loading, setLoading] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const logged = user.padron !== "";

  React.useEffect(() => {
    if (!logged && window.localStorage.getItem("padron"))
      login(window.localStorage.getItem("padron"));
  }, [logged]);

  const login = async (padron) => {
    setLoading(true);
    if (!padron) {
      setLoading(false);
      return false;
    }

    const padrones = await fetch(
      `${C.SPREADSHEET}${C.SHEETS.user}!B:B?majorDimension=COLUMNS&key=${C.KEY}`
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

    const allLogins = [];
    let data = null;
    for (let i = 0; i < indexes.length; i++) {
      data = await fetch(
        `${C.SPREADSHEET}${C.SHEETS.user}!${indexes[i] + 1}:${
          indexes[i] + 1
        }?key=${C.KEY}`
      ).then((res) => res.json().then((res) => res.values[0]));
      allLogins.push({
        carreraid: data[2],
        orientacionid: data?.[3],
        findecarreraid: data?.[4],
      });
    }

    const { carreraid, orientacionid, findecarreraid } = allLogins[0];
    const carrera = CARRERAS.find((c) => c.id === carreraid);

    setUser({
      padron,
      carrera,
      orientacion: carrera.orientaciones?.find(
        (c) => c.nombre === orientacionid
      ),
      finDeCarrera: carrera.finDeCarrera?.find((c) => c.id === findecarreraid),
      allLogins,
    });
    window.localStorage.setItem("padron", padron);
    setLoading(false);
    return true;
  };

  const postGraph = (nodes, checkboxes) => {
    setSaving(true);
    const formData = new FormData();
    const padron = user.padron;
    const carreraid = user.carrera.id;
    const map = {
      materias: nodes.get({
        filter: (n) => n.aprobada,
        fields: ["id", "nota"],
      }),
    };
    if (checkboxes)
      map.checkboxes = checkboxes
        .filter((c) => c.check === true)
        .map((c) => c.nombre);

    formData.append(`${C.GRAPH_FORM_ENTRIES.padron}`, padron);
    formData.append(`${C.GRAPH_FORM_ENTRIES.carrera}`, carreraid);
    formData.append(`${C.GRAPH_FORM_ENTRIES.map}`, JSON.stringify(map));
    fetch(`${C.GRAPH_FORM}`, {
      body: formData,
      method: "POST",
    })
      .then((r) => setSaving(false))
      .catch((r) => setSaving(false));
  };

  const getGraph = async (padron, carrera) => {
    const padrones = await fetch(
      `${C.SPREADSHEET}${C.SHEETS.registros}!B:D?majorDimension=COLUMNS&key=${C.KEY}`
    )
      .then((res) => res.json())
      .then((res) => (!res.error ? res.values[0] : null));
    if (!padrones) return;

    const indexes = [];
    let j = -1;
    while ((j = padrones.indexOf(padron, j + 1)) !== -1) {
      indexes.push(j);
    }
    if (!indexes.length) return;

    const allLogins = [];
    let data = null;
    for (let i = 0; i < indexes.length; i++) {
      data = await fetch(
        `${C.SPREADSHEET}${C.SHEETS.registros}!${indexes[i] + 1}:${
          indexes[i] + 1
        }?key=${C.KEY}`
      ).then((res) => res.json().then((res) => res.values[0]));
      allLogins.push({
        carreraid: data[2],
        map: data[3],
      });
    }

    const map = allLogins.find((l) => l.carreraid === carrera).map;
    return JSON.parse(map);
  };

  const register = (data) => {
    const formData = new FormData();
    const padron = data["padron"].value;
    const carreraid = data["carrera"].value;
    const orientacionid = data["orientacion"]?.value;
    const findecarreraid = data["finDeCarrera"]?.value;
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

    setUser({
      padron,
      carrera,
      orientacion: carrera.orientaciones?.find(
        (c) => c.nombre === orientacionid
      ),
      finDeCarrera: carrera.finDeCarrera?.find((c) => c.id === findecarreraid),
      allLogins: [...addToAllLogins()],
    });
    window.localStorage.setItem("padron", padron);
  };

  const logout = () => {
    setUser({ ...user, padron: "" });
    window.localStorage.removeItem("padron");
  };

  const submitBug = (bug) => {
    const formData = new FormData();
    const padron = user.padron;
    const carreraid = user.carrera?.id;
    const orientacionid = user.orientacion?.nombre;
    const findecarreraid = user.finDeCarrera?.id;
    formData.append(`${C.BUGS_FORM_ENTRIES.padron}`, padron);
    formData.append(`${C.BUGS_FORM_ENTRIES.carrera}`, carreraid);
    formData.append(`${C.BUGS_FORM_ENTRIES.orientacion}`, orientacionid || "");
    formData.append(
      `${C.BUGS_FORM_ENTRIES.finDeCarrera}`,
      findecarreraid || ""
    );
    formData.append(`${C.BUGS_FORM_ENTRIES.bug}`, bug || "");
    fetch(`${C.BUGS_FORM}`, {
      body: formData,
      method: "POST",
    });
  };

  return {
    user,
    logged,
    login,
    loading,
    register,
    logout,
    saving,
    postGraph,
    submitBug,
    setUser,
    getGraph,
  };
};

export default useLogin;
