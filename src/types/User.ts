import React from "react";
import { Carrera, FinDeCarrera, Orientacion } from "./carreras";
import { Optativa } from "./Graph";
import { MateriaFIUBARepo } from "./externalAPI";
import { NodeType } from "./Node";

export interface UserCarreraInfo {
  carreraid: string;
  orientacionid: string | undefined;
  findecarreraid: string | undefined;
}

// FIXME: a orientacion y finDeCarrera se le otorga a lo largo de la app
//   valores de null y undefined, undefined cuando se esta definiendo al usuario inicial (src/User.ts initialUser)
//   y null cuando se especifica que no tiene ni orientacion ni finDeCarrera (src/Graph.ts changeCarrera)
//   es este el comportamiento esperado????
export interface UserInfo {
  padron: string;
  carrera: Carrera;
  orientacion: Orientacion | undefined | null;
  finDeCarrera: FinDeCarrera | undefined | null;
  allLogins: UserCarreraInfo[];
  maps: UserMap[] | undefined;
}

export interface UserCarreraMap {
  materias: NodeType[];
  checkboxes?: string[];
  optativas?: Optativa[];
  aplazos?: number;
}

export interface UserMap {
  carreraid: string;
  map: UserCarreraMap;
}

export interface SaveUserGraph {
  (
    user: UserInfo,
    materias: NodeType[],
    checkboxes: string[] | undefined,
    optativas: Optativa[],
    aplazos: number,
  ): Promise<void>;
}

export interface UserContextType {
  login(padron: string): Promise<boolean>;

  signup(padron: string): Promise<void>;

  register(user: UserInfo): Promise<void>;

  logout(): void;

  loading: boolean;
  user: UserInfo;
  logged: boolean;
  setUser: React.Dispatch<React.SetStateAction<UserInfo>>;
  padronInput: string;
  setPadronInput: React.Dispatch<React.SetStateAction<string>>;
  fiubaRepos: MateriaFIUBARepo[];
  loggingIn: boolean;
  saveUserGraph: SaveUserGraph;
}
