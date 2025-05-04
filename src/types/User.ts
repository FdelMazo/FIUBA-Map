import React from "react";
import { GraphType } from "./Graph";
import { NodeType } from "./Node";
import { COLORS } from "../theme";

export namespace UserType {
  interface MateriaCredito {
    id: string;
    nombrecorto: string;
    bg: string;
    color: string;
  }
  
  interface Checkbox {
    nombre: string;
    nombrecorto: string;
    bg: string;
    color: string;
    check?: boolean;
  }
  
  interface OrientacionCredito {
    orientacion: number;
    electivas: Electivas;
  }
  
  interface Creditos {
    total: number;
    electivas?: number | Electivas;
    checkbox?: Checkbox[];
    materias?: MateriaCredito[];
    orientacion?: { [key: string]: OrientacionCredito };
  }

  export interface MateriaJSON {
    id: string;
    materia: string;
    creditos: number;
    categoria: string;
    level: number;
    correlativas: string | undefined;
    requiere: number | undefined;
    requiereCBC: boolean | undefined;
  }
  
  export interface Electivas {
    tesis: number;
    tpp: number;
    [key: string]: number;
  }
  
  export interface Orientacion {
    colorScheme: keyof typeof COLORS;
    nombre: string;
    nonEligible?: true;
    color?: string;
  }
  
  export interface FinDeCarrera {
    id: string;
    materia: string;
  }
  
  export interface Carrera {
    id: string;
    link: string;
    ano: number;
    beta?: boolean;
    graph: MateriaJSON[];
    creditos: Creditos;
    eligeOrientaciones?: true;
    orientaciones?: Orientacion[];
    finDeCarrera?: FinDeCarrera[];
  }
  
  export interface CarreraInfo {
    carreraid: string;
    orientacionid: string | undefined;
    findecarreraid: string | undefined;
  }
  
  export interface CarreraMap {
    materias: NodeType[];
    checkboxes?: string[];
    optativas?: GraphType.Optativa[];
    aplazos?: number;
  }
  
  export interface Map {
    carreraid: string;
    map: CarreraMap;
  }
  
  export interface SaveGraph {
    (
      user: Info,
      materias: NodeType[],
      checkboxes: string[] | undefined,
      optativas: GraphType.Optativa[],
      aplazos: number,
    ): Promise<void>;
  }
  
  export interface Context {
    loading: boolean;
    user: Info;
    logged: boolean;
    padronInput: string;
    loggingIn: boolean;
    
    login(padron: string): Promise<boolean>;
    signup(padron: string): Promise<void>;
    register(user: Info): Promise<void>;
    logout(): void;
    setUser: React.Dispatch<React.SetStateAction<Info>>;
    setPadronInput: React.Dispatch<React.SetStateAction<string>>;
    saveUserGraph: SaveGraph;
  }

  export interface Info {
    padron: string;
    carrera: Carrera;
    orientacion: Orientacion | undefined | null;
    finDeCarrera: FinDeCarrera | undefined | null;
    allLogins: CarreraInfo[];
    maps: Map[] | undefined;
  }
}
