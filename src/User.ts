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

  // register guarda [orientacion, findecarrera] y actualiza ultimaCarrera
  // Se usa para siempre tener un registro de cual es la ultima carrera que un usuario uso
  // Asi no tenes que a mano guardar un cambio de carrera
  const register = async (user: UserType.Info) => {
    const orientacion = user.orientacion?.nombre;
    const finDeCarrera = user.finDeCarrera?.id;
    const existing = user.record.carreras[user.carrera.id];

    // Si no cambio nada de lo que le importa a la DB, no gastamos un request
    // (UserMenu abre el menu solo para usuarios nuevos, y eso puede generar
    // varias re-selecciones de la misma orientacion/carrera)
    if (
      user.record.ultimaCarrera === user.carrera.id &&
      (existing?.orientacion || undefined) === orientacion &&
      (existing?.finDeCarrera || undefined) === finDeCarrera
    ) {
      setUser(user);
      return;
    }

    const carreraData: UserType.CarreraData = {
      ...(existing ?? { materias: [] }),
      orientacion,
      finDeCarrera,
    };
    if (!carreraData.orientacion) delete carreraData.orientacion;
    if (!carreraData.finDeCarrera) delete carreraData.finDeCarrera;

    const record: UserType.DBRecord = {
      ...user.record,
      ultimaCarrera: user.carrera.id,
      carreras: { ...user.record.carreras, [user.carrera.id]: carreraData },
    };

    await persist(user.padron, record);
    setUser({ ...user, record });
  };

  // Signup es para registrar usuarios nuevos. No hace ningun request: solo guarda el
  // padron localmente. El bin se crea recien en el primer guardado real (register o
  // saveUserGraph), asi que una cuenta que nunca hace nada nunca ocupa un bin
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

  // Aca guardamos el mapa y toda la metadata que tiene
  const saveUserGraph: UserType.SaveGraph = async (
    user,
    materias,
    checkboxes,
    optativas,
    aplazos,
  ) => {
    const carreras = { ...user.record.carreras };
    const existing = carreras[user.carrera.id];

    // Si no guardo más de una materia (el CBC por defecto), le borramos el mapa
    if (materias.length === 1) {
      delete carreras[user.carrera.id];
    } else {
      carreras[user.carrera.id] = {
        materias,
        ...(existing?.orientacion && { orientacion: existing.orientacion }),
        ...(existing?.finDeCarrera && { finDeCarrera: existing.finDeCarrera }),
        ...(checkboxes?.length && { checkboxes }),
        ...(optativas.length && { optativas }),
        ...(aplazos && { aplazos }),
      };
    }

    const record: UserType.DBRecord = { ...user.record, carreras };
    await persist(user.padron, record);
    setUser({ ...user, record });
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
    dbUnavailable,
    saveUserGraph,
    signup,
  };
};

export default Login;
