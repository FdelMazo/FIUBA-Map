type TipoMateria = "*CBC" | "Obligatorias" | "Electivas" | "FinDeCarrera";

export type Materia = {
  id: string;
  materia: string;
  creditos: number;
  categoria: TipoMateria;
  level: number;
} & (
  | {
      correlativas: Array<string>;
    }
  | {
      requiere: number;
      requiereCBC: boolean;
    }
);
