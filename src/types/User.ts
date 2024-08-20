import { Carrera, FinDeCarrera, Orientacion } from "./carreras";
import React from "react";
import { Optativa } from "./Graph";
import { MateriaFIUBARepo } from "./externalAPI";

interface MateriaNodo {
  id: string;
  nota: number;
  cuatrimestre: number;
}

export interface UserCarreraInfo {
  carreraid: string;
  orientacionid: string | undefined;
  findecarreraid: string | undefined;
}

export interface UserInfo {
  padron: string;
  carrera: Carrera;
  orientacion: Orientacion | undefined;
  finDeCarrera: FinDeCarrera | undefined;
  allLogins: UserCarreraInfo[];
  maps: UserMap[] | undefined;
}

export interface UserCarreraMap {
  materias: MateriaNodo[];
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
    materias: MateriaNodo[],
    checkboxes: string[],
    optativas: Optativa[],
    aplazos: number
  ): Promise<void>;
}

export interface UserLogin {
  user: UserInfo;
  logged: boolean;
  login(padron: string): Promise<boolean>;
  loading: boolean;
  register(user: UserInfo): Promise<void>;
  logout(): void;
  setUser: React.Dispatch<React.SetStateAction<UserInfo>>;
  padronInput: string;
  setPadronInput: React.Dispatch<React.SetStateAction<string>>;
  fiubaRepos: MateriaFIUBARepo[];
  loggingIn: boolean;
  saveUserGraph: SaveUserGraph;
  signup(padron: string): Promise<void>;
}
