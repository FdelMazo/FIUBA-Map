import { GraphType } from "./Graph";
import type { BgColor, ColorScheme } from "../theme";

export namespace UserType {
  interface MateriaCredito {
    id: string;
    nombrecorto: string;
    bg: BgColor;
    color: string;
  }

  interface Checkbox {
    nombre: string;
    nombrecorto: string;
    bg: BgColor;
    color: string;
    check?: boolean;
  }

  interface OrientacionCredito {
    orientacion: number;
    electivas: Electivas;
  }

  interface Creditos {
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
    colorScheme: ColorScheme;
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
    orientacion: Orientacion | undefined | null;
    finDeCarrera: FinDeCarrera | undefined | null;
    record: DBRecord;
  }
}
