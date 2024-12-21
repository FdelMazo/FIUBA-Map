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
  loading: boolean;
  user: UserInfo;
  logged: boolean;
  padronInput: string;
  fiubaRepos: MateriaFIUBARepo[];
  loggingIn: boolean;
  
  login(padron: string): Promise<boolean>;
  signup(padron: string): Promise<void>;
  register(user: UserInfo): Promise<void>;
  logout(): void;
  setUser: React.Dispatch<React.SetStateAction<UserInfo>>;
  setPadronInput: React.Dispatch<React.SetStateAction<string>>;
  saveUserGraph: SaveUserGraph;
}
