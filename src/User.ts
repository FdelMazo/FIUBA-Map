import React from "react";
import { CARRERAS } from "./carreras";
import * as C from "./constants";
import { getGraphs, postGraph, postUser } from "./dbutils";
import { UserType } from "./types/User";
import { GoogleSheetAPI } from "./types/externalAPI";

// La base de datos se parte en dos tablas (relacional... ponele)
// La clave que une a las bases de datos es la combinación de padron y carrera
// Por un lado, se guarda en allLogins [padron, carrera, orientacion, findecarrera]
// Por el otro, se guarda en maps [padron, carrera, mapa]

// El padron se setea una vez que el usuario se loguea exitosamente (O sea, logged = padron !== "")
// allLogins contiene un array con todas las [carrera,orientacion,findecarrera] que tiene el usuario en la DB
// maps contiene todos los mapas que tiene el usuario en la DB
const initialUser: UserType.Info = {
  padron: "",
  carrera: CARRERAS.find((c) => c.id === "informatica-2020")!,
  orientacion: null,
  finDeCarrera: null,
  allLogins: [],
  maps: [],
};

const Login = (): UserType.Context => {
  const [user, setUser] = React.useState<UserType.Info>(initialUser);

  // Inicializamos el padron en lo que hay en el storage, o vacio
  const [padronInput, setPadronInput] = React.useState(
    window.localStorage.getItem("padron") || "",
  );
  const logged = user.padron !== "";

  // Loading es para el spinner del input del padron
  // Si tenemos algo en el storage, directo arrancamos con loading
  const [loading, setLoading] = React.useState(
    !!window.localStorage.getItem("padron"),
  );

  // loggingIn es para cuando la pagina esta cargando todos los datos del usuario
  const [loggingIn, setLoggingIn] = React.useState(false);

  // On boot nos fijamos si hay un padron inicial del localStorage
  // Si existe, lo usamos para loguear al usuario
  React.useEffect(() => {
    if (padronInput) {
      login(padronInput);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // login agarra todo lo que sabemos del usuario, de ambas tablas de la DB
  // y lo guarda en el estado `user`
  // Usamos de carrera la ultima que registro el usuario
  const login = async (padron: string) => {
    setLoading(true);
    if (!padron) {
      setLoading(false);
      return false;
    }

    const userMaps = await fetch(
      // `https://fiuba-map-backend.vercel.app/api/load?binId=6817f2cb8561e97a500de00d`,
      `http://localhost:3001/api/load?binId=6817f2cb8561e97a500de00d`,
      {
        method: "GET",
      },
    ).then((res) => res.json());

    console.log("Fede Test", userMaps);

    const padrones = await fetch(
      `${C.SPREADSHEET}/${C.SHEETS.user}!B:B?majorDimension=COLUMNS&key=${C.KEY}`,
    )
      .then((res) => res.json())
      .then((res: GoogleSheetAPI.UserValueRange) =>
        !res.error ? res.values[0] : null,
      );

    if (!padrones) {
      setLoading(false);
      return false;
    }

    const indexes: number[] = [];
    let j = -1;
    while ((j = padrones.indexOf(padron, j + 1)) !== -1) {
      indexes.push(j);
    }

    if (!indexes.length) {
      setLoading(false);
      return false;
    }

    setLoggingIn(true);
    const ranges = indexes.map(
      (index) => `&ranges=${C.SHEETS.user}!${index + 1}:${index + 1}`,
    );

    const data = await fetch(
      `${C.SPREADSHEET}:batchGet?key=${C.KEY}${ranges.join("")}`,
    ).then((res) =>
      res.json().then((res: GoogleSheetAPI.BatchGet) => res.valueRanges),
    );

    const allLogins: UserType.CarreraInfo[] = data.map((d) => ({
      carreraid: d.values[0][2],
      orientacionid: d.values[0][3],
      findecarreraid: d.values[0][4],
    }));

    let carrera = CARRERAS.find((c) => c.id === "informatica-2020")!;
    let orientacion: UserType.Orientacion | undefined = undefined;
    let finDeCarrera: UserType.FinDeCarrera | undefined = undefined;
    for (const login of allLogins) {
      const foundCarrera = CARRERAS.find((c) => c.id === login.carreraid);
      if (foundCarrera) {
        carrera = foundCarrera;
        orientacion = foundCarrera.orientaciones?.find(
          (c) => c.nombre === login.orientacionid,
        );
        finDeCarrera = carrera.finDeCarrera?.find(
          (c) => c.id === login.findecarreraid,
        );
        break;
      }
    }

    const maps = await getGraphs(padron);

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
    setLoggingIn(false);
    return true;
  };

  // register es para hacer nuevos registros de un usuario en la DB
  // Solo lidia con [padron, carrera, orientacion, findecarrera], no con mapas
  // Se usa para siempre tener un registro de cual es la ultima carrera que un usuario uso
  // Asi no tenes que a mano guardar un cambio de carrera
  const register = async (user: UserType.Info) => {
    const addToAllLogins = () => {
      const newAllLogins = user.allLogins.filter(
        (l) => l.carreraid !== user.carrera.id,
      );
      newAllLogins.push({
        carreraid: user.carrera.id,
        orientacionid: user.orientacion?.nombre,
        findecarreraid: user.finDeCarrera?.id,
      });
      return newAllLogins;
    };

    await postUser(user);
    setUser({
      ...user,
      allLogins: [...addToAllLogins()],
    });
  };

  // Signup es para registrar usuarios nuevos
  // no hace mas que guardar en el storage el padron, y llamar a register
  const signup = async (padron: string) => {
    const newUser = {
      ...user,
      padron,
    };
    window.localStorage.setItem("padron", padron);
    setLoading(true);
    await register(newUser);
    setLoading(false);
  };

  // En el logout limpiamos el usuario entero, y nos quedamos en la carrera seteada
  const logout = () => {
    setUser({ ...initialUser, carrera: user.carrera });
    window.localStorage.removeItem("padron");
  };

  // Aca guardamos el mapa y toda la metadata que tiene
  const saveUserGraph: UserType.SaveGraph = async (
    user,
    materias,
    checkboxes,
    optativas,
    aplazos,
  ) => {
    const map: UserType.CarreraMap = {
      materias,
    };
    if (checkboxes) {
      map.checkboxes = checkboxes;
    }
    if (optativas) {
      map.optativas = optativas;
    }
    if (aplazos) {
      map.aplazos = aplazos;
    }
    await postGraph(user, map);

    const addToMaps = () => {
      if (!user.maps) return [];
      const newMaps = user.maps.filter((l) => l.carreraid !== user.carrera.id);
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
    loggingIn,
    saveUserGraph,
    signup,
  };
};

export default Login;
