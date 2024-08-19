import { Carrera, FinDeCarrera, Orientacion } from "./carreras";
import React from "react";

// Fuente: https://developers.google.com/sheets/api/reference/rest/v4/Dimension
// Capaz no haga falta especificar majorDimensionEnum si no se utiliza?
enum majorDimensionEnum {
  DIMENSION_UNSPECIFIED = "DIMENSION_UNSPECIFIED",
  ROWS = "ROWS",
  COLUMNS = "COLUMNS",
}

// Fuente: https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets.values#ValueRange
export interface ValueRange {
  range: string;
  majorDimension: majorDimensionEnum;
  error?: string; // Nose como sera el error en google sheets api
}

export interface UserValueRange extends ValueRange {
  values: string[][];
}

export interface RegistrosValueRange extends ValueRange {
  values: {
    carreras: Carrera[];
    padrones: string[];
    maps: UserMap[];
  };
}

interface MateriaNodo {
  id: string;
  nota: number | undefined;
}

export interface UserMap {
  carreraid: string;
  materias: MateriaNodo[];
  checkboxes: ;
  optativas: ;
  aplazos: ;
}

// Fuente: https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets.values/batchGet
// Es necesario BatchGet?
export interface BatchGet {
  spreadsheetId: string;
  valueRanges: ValueRange[];
}

export interface UserLogin {
  carreraid: string;
  orientacionid: string | undefined;
  findecarreraid: string | undefined;
}

export interface InitialUser {
  padron: string;
  carrera: Carrera;
  orientacion: Orientacion | undefined;
  finDeCarrera: FinDeCarrera | undefined;
  allLogins: UserLogin[];
  //maps: ;
}

export interface UserType {
  user: InitialUser;
  logged: boolean;
  login(padron: string): Promise<boolean>;
  loading: boolean;
  register(user: InitialUser): Promise<void>;
  logout(): void;
  setUser: React.Dispatch<React.SetStateAction<InitialUser>>;
  padronInput: string;
  setPadronInput: React.Dispatch<React.SetStateAction<string>>;
  fiubaRepos: ;
  loggingIn: ;
  saveUserGraph: ;
  signup: ;
}
