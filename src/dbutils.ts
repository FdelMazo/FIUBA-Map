import * as C from "./constants";
import { UserType } from "./types/User";

// Le pega al form de bugs
export const submitBug = async (user: UserType.Info, bug: string) => {
  if (!bug) return;
  const formData = new FormData();
  const padron = user.padron;
  const carreraid = user.carrera.id;
  const orientacionid = user.orientacion?.nombre;
  const findecarreraid = user.finDeCarrera?.id;
  formData.append(`${C.BUGS_FORM_ENTRIES.padron}`, padron);
  formData.append(`${C.BUGS_FORM_ENTRIES.carrera}`, carreraid);
  formData.append(`${C.BUGS_FORM_ENTRIES.orientacion}`, orientacionid || "");
  formData.append(`${C.BUGS_FORM_ENTRIES.finDeCarrera}`, findecarreraid || "");
  formData.append(`${C.BUGS_FORM_ENTRIES.bug}`, bug || "");
  return fetch(`${C.BUGS_FORM}`, {
    body: formData,
    method: "POST",
    mode: "no-cors",
  });
};

const callProxy = async <T>(body: object): Promise<T> => {
  const res = await fetch(C.DB_PROXY, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    throw new Error(`db proxy respondio ${res.status}`);
  }
  return res.json();
};

// Busca el bin del padron.
export const dbLogin = (padron: string, binId?: string) =>
  callProxy<
    | { status: "ok"; binId: string; record: UserType.DBRecord }
    | { status: "notfound" }
  >({ action: "login", padron, binId });

// Crea el bin de un padron nuevo
export const dbCreate = (padron: string, record: UserType.DBRecord) =>
  callProxy<{
    status: "ok";
    binId: string;
    record: UserType.DBRecord;
  }>({ action: "create", padron, record });

// Pisa el bin entero
export const dbSave = (
  padron: string,
  binId: string,
  record: UserType.DBRecord,
) => callProxy<{ status: "ok" }>({ action: "save", padron, binId, record });
