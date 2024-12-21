import { COLORS } from "../theme";

export interface MateriaCredito {
  id: string;
  nombrecorto: string;
  bg: string;
  color: string;
}

export interface MateriaJSON {
  id: string;
  materia: string;
  creditos: number;
  categoria: string;
  level: number;
  correlativas?: string;
  requiere?: number;
  requiereCBC?: boolean;
}

export interface Checkbox {
  nombre: string;
  nombrecorto: string;
  bg: string;
  color: string;
  check?: boolean;
}

export interface Electivas {
  tesis: number;
  tpp: number;
  [key: string]: number;
}

export interface OrientacionCredito {
  orientacion: number;
  electivas: Electivas;
}

export interface Creditos {
  total: number;
  electivas?: number | Electivas;
  checkbox?: Checkbox[];
  materias?: MateriaCredito[];
  orientacion?: { [key: string]: OrientacionCredito };
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
