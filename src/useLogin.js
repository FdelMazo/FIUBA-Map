import { useMediaQuery } from "@chakra-ui/react";
import React from "react";
import CARRERAS from "./carreras";
import * as C from "./constants";
import ALIAS_MATERIAS from "./data/alias_materias";

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
  const [loggingIn, setLoggingIn] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [padronInput, setPadronInput] = React.useState("");
  const logged = user.padron !== "";

  React.useEffect(() => {
    if (window.localStorage.getItem("padron")) {
      setPadronInput(window.localStorage.getItem("padron"));
      login(window.localStorage.getItem("padron"));
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
    let ranges = indexes.map(
      (index) => `&ranges=${C.SHEETS.user}!${index + 1}:${index + 1}`
    );
    let data = await fetch(
      `${C.SPREADSHEET}:batchGet?key=${C.KEY}${ranges.join("")}`
    ).then((res) => res.json().then((res) => res.valueRanges));

    const allLogins = data.map((d) => ({
      carreraid: d.values[0][2],
      orientacionid: d.values[0][3],
      findecarreraid: d.values[0][4],
    }));

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
    setLoggingIn(false)
    return true;
  };

  const postGraph = (nodes, checkboxes, optativas, aplazos) => {
    setSaving(true);
    const formData = new FormData();
    const padron = user.padron;
    const carreraid = user.carrera.id;
    const map = {
      materias: nodes.get({
        filter: (n) => n.aprobada || n.nota === -1 || n.cuatrimestre,
        fields: ["id", "nota", "cuatrimestre"],
      }),
    };
    if (checkboxes)
      map.checkboxes = checkboxes
        .filter((c) => c.check === true)
        .map((c) => c.nombre);
    if (optativas) map.optativas = optativas;
    if (aplazos) map.aplazos = aplazos;

    formData.append(`${C.GRAPH_FORM_ENTRIES.padron}`, padron);
    formData.append(`${C.GRAPH_FORM_ENTRIES.carrera}`, carreraid);
    formData.append(`${C.GRAPH_FORM_ENTRIES.map}`, JSON.stringify(map));
    fetch(`${C.GRAPH_FORM}`, {
      body: formData,
      method: "POST",
      mode: "no-cors",
    })
      .then((r) => setSaving(false))
      .catch((r) => setSaving(false));
  };

  const getGraph = async (padron, carrera) => {
    const data = await fetch(
      `${C.SPREADSHEET}/${C.SHEETS.registros}!B:D?majorDimension=COLUMNS&key=${C.KEY}`
    )
      .then((res) => res.json())
      .then((res) => (!res.error ? res.values : null));
    if (!data) return;

    const padrones = data[0];
    const carreras = data[1];
    const maps = data[2];

    const indexes = [];
    let j = -1;
    while ((j = padrones.indexOf(padron, j + 1)) !== -1) {
      indexes.push(j);
    }

    const allLogins = [];
    for (let i = 0; i < indexes.length; i++) {
      allLogins.push({
        carreraid: carreras[indexes[i]],
        map: maps[indexes[i]],
      });
    }

    const map = allLogins.find((l) => l.carreraid === carrera)?.map || "{}";
    return JSON.parse(map);
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

  const submitBug = (bug) => {
    if (!bug) return;
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
      mode: "no-cors",
    });
  };

  const [fiubaRepos, setFiubaRepos] = React.useState([])
  const fetchFiubaRepos = async () => {
    let totalCount = null;
    const items = [];
    let i = 1;
    while (!totalCount || items.length < totalCount) {
      const res = await fetch(
        `https://api.github.com/search/repositories?` + new URLSearchParams({
          q: "topic:fiuba fork:true",
          sort: "updated",
          order: "desc",
          page: i,
          per_page: 100,
        }), {
        headers: {
          Accept: "application/vnd.github.v3+json"
        }
      });
      const json = await res.json();
      if (!json.items || !json.items.length) break;
      totalCount = json.total_count;
      items.push(...json.items);
      i++;
    }

    const codigosMaterias = [...new Set(items.flatMap(r =>
      r.topics.filter(t => t.match(/^\d\d\d\d$/))
    ))]

    let allMaterias = Object.keys(ALIAS_MATERIAS).reduce((acc, c) => {
      const nombre = ALIAS_MATERIAS[c];
      let m = acc.find(mx => mx.nombre === nombre)
      if (m) {
        m.codigos.push(c)
      } else {
        acc.push({
          codigos: [c],
          nombre,
        })
      }
      return acc;
    }, [])

    codigosMaterias.forEach(c => {
      const materia = allMaterias.find(m => m.codigos.includes(c))
      if (!materia) return;
      if (materia.reponames) {
        materia.reponames = new Set([...materia.reponames, ...items.filter(r => r.topics.includes(c)).map(r => r.full_name)])
      } else {
        materia['reponames'] = new Set(items.filter(r => r.topics.includes(c)).map(r => r.full_name))
      }
    })

    const processedMaterias = allMaterias.filter(m => m.reponames?.size > 0);
    setFiubaRepos(processedMaterias)
  };


  React.useEffect(() => {
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
    saving,
    postGraph,
    submitBug,
    setUser,
    getGraph,
    padronInput,
    setPadronInput,
    fiubaRepos,
    isMobile,
    isSmallMobile,
    loggingIn,
  };
};

export default useLogin;
