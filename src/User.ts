import React from "react";
import { CARRERAS } from "./carreras";
import { dbCreate, dbLogin, dbSave } from "./dbutils";
import { UserType } from "./types/User";

// El padron se setea una vez que el usuario se loguea exitosamente (O sea, logged = padron !== "")
const initialUser: UserType.Info = {
  padron: "",
  carrera: CARRERAS.find((c) => c.id === "informatica-2020")!,
  orientacion: null,
  finDeCarrera: null,
  record: { padron: "", ultimaCarrera: "informatica-2020", carreras: {} },
};

const Login = (): UserType.Context => {
  const [user, setUser] = React.useState<UserType.Info>(initialUser);

  // Inicializamos el padron (y el binId cacheado, si hay uno) con lo que hay en el storage
  const [padronInput, setPadronInput] = React.useState(
    window.localStorage.getItem("padron") || "",
  );
  const [binId, setBinId] = React.useState<string | undefined>(
    window.localStorage.getItem("binId") || undefined,
  );
  const logged = user.padron !== "";

  // Loading es para el spinner del input del padron
  // Si tenemos algo en el storage, directo arrancamos con loading
  const [loading, setLoading] = React.useState(
    !!window.localStorage.getItem("padron"),
  );

  // loggingIn es para cuando la pagina esta cargando todos los datos del usuario
  const [loggingIn, setLoggingIn] = React.useState(false);

  // Si el proxy no responde, no intentamos auto-loguear a nadie
  const [dbUnavailable, setDbUnavailable] = React.useState(false);

  // On boot nos fijamos si hay un padron inicial del localStorage
  // Si existe, lo usamos para loguear al usuario
  React.useEffect(() => {
    if (padronInput) {
      login(padronInput);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // login le pregunta al proxy todo lo que sabe de un padron, y lo guarda en el estado `user`
  const login = async (padron: string): Promise<UserType.LoginResult> => {
    if (!padron) return "error";

    setLoading(true);
    setLoggingIn(true);

    let res;
    try {
      res = await dbLogin(padron, binId);
      setDbUnavailable(false);
    } catch {
      setDbUnavailable(true);
      setLoading(false);
      setLoggingIn(false);
      return "error";
    }

    if (res.status === "notfound") {
      setLoading(false);
      setLoggingIn(false);
      return "notfound";
    }

    const { record, binId: foundBinId } = res;
    const carrera =
      CARRERAS.find((c) => c.id === record.ultimaCarrera) ??
      CARRERAS.find((c) => c.id === "informatica-2020")!;
    const carreraData = record.carreras[carrera.id];
    const orientacion = carreraData?.orientacion
      ? carrera.orientaciones?.find((o) => o.nombre === carreraData.orientacion)
      : undefined;
    const finDeCarrera = carreraData?.finDeCarrera
      ? carrera.finDeCarrera?.find((f) => f.id === carreraData.finDeCarrera)
      : undefined;

    setUser({ padron, carrera, orientacion, finDeCarrera, record });
    setBinId(foundBinId);
    window.localStorage.setItem("padron", padron);
    window.localStorage.setItem("binId", foundBinId);
    setLoading(false);
    setLoggingIn(false);
    return "ok";
  };

  // Guarda en jsonbin, creando el bin del padron si todavia no existe (primer
  // guardado real de una cuenta nueva). El bin se crea con el record ya adentro,
  // asi el primer guardado no necesita un segundo request
  const persist = async (padron: string, record: UserType.DBRecord) => {
    if (binId) {
      await dbSave(padron, binId, record);
      return binId;
    }
    const created = await dbCreate(padron, record);
    setBinId(created.binId);
    window.localStorage.setItem("binId", created.binId);
    return created.binId;
  };

  // Signup es para registrar usuarios nuevos. No hace ningun request: solo guarda el
  // padron localmente. El bin se crea recien en el primer guardado real (saveUserGraph),
  // asi que una cuenta que nunca hace nada nunca ocupa un bin
  const signup = (padron: string) => {
    window.localStorage.setItem("padron", padron);
    window.localStorage.removeItem("binId");
    setBinId(undefined);
    setUser({
      ...initialUser,
      padron,
      carrera: user.carrera,
      record: { padron, ultimaCarrera: user.carrera.id, carreras: {} },
    });
  };

  // En el logout limpiamos el usuario entero, y nos quedamos en la carrera seteada
  const logout = () => {
    setUser({ ...initialUser, carrera: user.carrera });
    setBinId(undefined);
    window.localStorage.removeItem("padron");
    window.localStorage.removeItem("binId");
  };

  // Aca guardamos el mapa y toda la metadata que tiene, incluyendo ultimaCarrera y
  // la orientacion/findecarrera actualmente elegidas -- este es el unico momento en el
  // que se persiste algo: navegar carreras/orientaciones sin guardar no gasta requests
  const saveUserGraph: UserType.SaveGraph = async (
    user,
    materias,
    checkboxes,
    optativas,
    aplazos,
  ) => {
    const carreras = { ...user.record.carreras };

    // Si no guardo más de una materia (el CBC por defecto), le borramos el mapa
    if (materias.length <= 1) {
      delete carreras[user.carrera.id];
    } else {
      carreras[user.carrera.id] = {
        materias,
        ...(user.orientacion && { orientacion: user.orientacion.nombre }),
        ...(user.finDeCarrera && { finDeCarrera: user.finDeCarrera.id }),
        ...(checkboxes?.length && { checkboxes }),
        ...(optativas.length && { optativas }),
        ...(aplazos && { aplazos }),
      };
    }

    const record: UserType.DBRecord = {
      ...user.record,
      ultimaCarrera: user.carrera.id,
      carreras,
    };

    // Si nada cambio respecto a lo que ya esta guardado, no gastamos un request
    if (JSON.stringify(record) !== JSON.stringify(user.record)) {
      await persist(user.padron, record);
    }
    setUser({ ...user, record });
  };

  return {
    user,
    logged,
    login,
    loading,
    logout,
    setUser,
    padronInput,
    setPadronInput,
    loggingIn,
    dbUnavailable,
    saveUserGraph,
    signup,
  };
};

export default Login;
