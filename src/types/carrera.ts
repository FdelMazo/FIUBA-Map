import { Color, Materia, Palette, palette } from ".";

type CreditosCheckbox = {
  nombre: string;
  nombrecorto: string;
  bg: Palette;
  color: Color;
};

type CreditosMateria = {
  id: string;
  nombrecorto: "pp" | "tesis";
  bg: Palette;
  color: Color;
};

type CreditosElectivas = {
  tesis: number;
  tpp: number;
};

type Creditos = {
  total: number;
  obligatorias: number;
  checkbox: Array<CreditosCheckbox>;
} & (
  | {
      electivas: number | CreditosElectivas;
    }
  | {
      // Awkward, capaz debería ser un array de orientaciones en vez de indexable type?
      orientacion: {
        [key: string]: CreditosElectivas;
      };
    }
);

export type Carrera = {
  id: string;
  link: string;
  ano: number;
  graph: Array<Materia>;
  finDeCarrera: Array<{
    id: string;
    materia: string;
  }>;
} & {
  eligeOrientaciones: true;
  orientaciones: Array<{
    nombre: string;
    colorScheme: keyof typeof palette; // Esto no está del todo bien tipado, parece que acá sólo puede ser una de las orientaciones.
  }>;
};
