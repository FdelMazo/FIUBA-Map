import { useMediaQuery } from "@chakra-ui/react";
import React from "react";
import CARRERAS from "./carreras";
import * as C from "./constants";
import { getFiubaRepos, getGraphs, postGraph, postUser } from "./dbutils";

// La base de datos se parte en dos tablas (relacional... ponele)
// La clave que une a las bases de datos es la combinación de padron y carrera
// Por un lado, se guarda en allLogins [padron, carrera, orientacion, findecarrera]
// Por el otro, se guarda en maps [padron, carrera, mapa]

// El padron se setea una vez que el usuario se loguea exitosamente (O sea, logged = padron !== "")
// allLogins contiene un array con todas las [carrera,orientacion,findecarrera] que tiene el usuario en la DB
// maps contiene todos los mapas que tiene el usuario en la DB
const initialUser = {
  padron: "",
  carrera: CARRERAS.find((c) => c.id === "sistemas"),
  orientacion: null,
  finDeCarrera: null,
  allLogins: [],
  maps: [],
};

const Login = () => {
  const [user, setUser] = React.useState(initialUser);
  const [padronInput, setPadronInput] = React.useState("");
  const logged = user.padron !== "";

  // Loading es para el spinner del input del padron
  const [loading, setLoading] = React.useState(false);
  // Loggin in es para cuando la pagina entera esta cargando todos los datos del usuario
  const [loggingIn, setLoggingIn] = React.useState(false);


  // On boot nos fijamos si hay un padron guardado en el local storage
  // Si existe, lo usamos para loguear al usuario
  React.useEffect(() => {
    const padronStorage = window.localStorage.getItem("padron");
    if (padronStorage) {
      setPadronInput(padronStorage);
      login(padronStorage);
    }
  }, []);

  // On boot pedimos todos los fiuba repos para poder mostrarlos en el header
  // Un poquito de cross promotion nunca mato a nadie...
  const [fiubaRepos, setFiubaRepos] = React.useState([])
  React.useEffect(() => {
    const fetchFiubaRepos = async () => {
      setFiubaRepos(await getFiubaRepos())
    };
    fetchFiubaRepos();
  }, []);


  // Login agarra todo lo que sabemos del usuario, de ambas tablas de la db
  // y lo guarda en el estado `user`
  // Usamos de carrera la ultima que registro el usuario
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

  // Register es para hacer nuevos registros de un usuario en la DB
  // Solo lidia con [padron, carrera, orientacion, findecarrera], no con mapas
  // Se usa para siempre tener un registro de cual es la ultima carrera que un usuario uso
  // Asi no tenes que a mano guardar un cambio de carrera
  const register = async (user) => {
    const addToAllLogins = () => {
      const newAllLogins = user.allLogins.filter(
        (l) => l.carreraid !== user.carrera.id
      );
      newAllLogins.push({
        carreraid: user.carrera.id,
        orientacionid: user.orientacion?.nombre,
        findecarreraid: user.finDeCarrera?.id,
      });
      return newAllLogins;
    };

    await postUser(user)
    setUser({
      ...user,
      allLogins: [...addToAllLogins()],
    });
  };

  // Signup es para registrar usuarios nuevos
  // no hace mas que guardar en el storage el padron, y llamar a register
  const signup = async (padron) => {
    const newUser = {
      ...user,
      padron,
    }
    window.localStorage.setItem("padron", padron);
    setLoading(true)
    await register(newUser)
    setLoading(false)
  }

  // En el logout limpiamos el padron, asi ya no esta mas seteada la variable logged
  // No debería pasar mucho, porque casi nunca te deslogueas, porque no hay casos de uso
  // donde alguien tenga mas de un usuario
  // Pero la verdad es que es raro... porque te queda todo el resto setupeado
  // O sea, me logueo con usuario1, me deslogueo, me logueo con usuario2,
  // y de la nada usuario2 tiene todos los datos de usuario1 ahí. Si llega a guardar, se le pisan todos los datos
  // Pero la alternativa es limpiar todo el usuario en logout, y queda feo desloguearte y ver que todo vuelve al estado inicial
  const logout = () => {
    setUser({ ...user, padron: "" });
    window.localStorage.removeItem("padron");
  };

  // Aca guardamos el mapa y toda la metadata que tiene
  const saveUserGraph = async (user, materias, checkboxes, optativas, aplazos) => {
    const map = {
      materias
    };
    if (checkboxes) {
      map.checkboxes = checkboxes;
    }
    if (optativas) {
      map.optativas = optativas
    };
    if (aplazos) {
      map.aplazos = aplazos
    };
    await postGraph(user, map)

    const addToMaps = () => {
      const newMaps = user.maps.filter(
        (l) => l.carreraid !== user.carrera.id
      );
      newMaps.push({
        carreraid: user.carrera.id,
        map,
      });
      return newMaps;
    };

    setUser({
      ...user,
      maps: [...addToMaps()],
    });
  };

  // Usamos los mismos valores de mobile/no mobile en toda la app, para no volverse loco con el responsiveness
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
    saveUserGraph,
    signup
  };
};

export default Login;
