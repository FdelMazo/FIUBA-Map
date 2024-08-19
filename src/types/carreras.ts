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
}

export interface Checkbox {
  nombre: string;
  nombrecorto: string;
  bg: string;
  color: string;
}

export interface Electivas {
  tesis: number;
  tpp: number;
}

export interface OrientacionCredito {
  [key: string]: {
    orientacion: number;
    electivas: Electivas;
  };
}

export interface Creditos {
  total: number;
  electivas?: number | Electivas;
  checkbox?: Checkbox[];
  materias?: MateriaCredito[];
  orientacion?: OrientacionCredito;
}

export interface Orientacion {
  colorScheme: string;
  nombre: string;
  nonEligible?: true;
}

export interface FinDeCarrera {
  id: string;
  materia: string;
}

export interface Carrera {
  id: string;
  link: string;
  ano: number;
  graph: MateriaJSON[];
  creditos: Creditos;
  eligeOrientaciones?: true;
  orientaciones?: Orientacion[];
  finDeCarrera?: FinDeCarrera[];
}