import { GraphType } from "./Graph";
import type { BgColor, ColorScheme } from "../theme";

export namespace UserType {
  interface Checkbox {
    nombre: string;
    nombrecorto: string;
    bg: BgColor;
    color: string;
    check?: boolean;
  }

  // Lo que pide cada orientacion elegible: sus creditos propios, y los de electivas que quedan
  interface OrientacionCredito {
    creditos: number;
    electivas: Electivas;
  }

  interface Creditos {
    electivas?: number | Electivas;
    checkbox?: Checkbox[];
    // Solo en las carreras que te hacen elegir orientacion. Las claves son los nombres de los grupos elegibles
    orientaciones?: { [nombre: string]: OrientacionCredito };
  }

  export interface MateriaJSON {
    id: string;
    materia: string;
    creditos: number;
    categoria: string;
    grupo?: string;
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

  export interface Grupo {
    colorScheme: ColorScheme;
    nombre: string;
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
    finDeCarrera?: FinDeCarrera[];
  }

  export interface Materia {
    id: string;
    nota: number;
    cuatrimestre?: number;
  }

  export interface DBRecord {
    padron: string;
    ultimaCarrera: string;
    carreras: {
      [carreraid: string]: {
        orientacion?: string;
        finDeCarrera?: string;
        materias: Materia[];
        checkboxes?: string[];
        optativas?: GraphType.Optativa[];
        aplazos?: number;
      };
    };
  }

  export interface Info {
    padron: string;
    carrera: Carrera;
    orientacion: Grupo | undefined | null;
    finDeCarrera: FinDeCarrera | undefined | null;
    record: DBRecord;
  }
}
