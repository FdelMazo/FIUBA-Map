import type Node from "../Node";
import type Graph from "../Graph";
import { UserType } from "./User";
import type { BgColor } from "../theme";

export namespace GraphType {
  export interface Optativa {
    // Las guardadas antes de que fueran nodos tienen id numerico,
    // ahora las guardamos como `OPT-1`, `OPT-2`, etc.
    id: string | number;
    nombre: string;
    creditos: number;
    // Las guardadas antes de que fueran nodos no tienen nota,
    // pero desde entonces es obligatorio
    nota?: number;
    cuatrimestre?: number;
  }

  export interface Credito {
    nombrecorto: string;
    nombre: string;
    bg?: BgColor;
    color: string;
    creditosNecesarios: number;
    creditos: number;
    nmaterias?: number;
    totalmaterias?: number;
    proportion?: number;
    dummy?: boolean;
    helpText?: string | boolean;
    checkbox?: boolean;
    check?: boolean;
  }

  // Lo que Graph le pasa a cada Node para que se actualice
  export interface Info {
    creditos: {
      creditosTotales: number;
      creditosCBC: number;
    };
    showLabels: boolean;
    colorMode: "light" | "dark";
    getters: ReturnType<typeof Graph>["getters"];
    // Explicito (y no inferido de Graph) para cortar el ciclo de inferencia Graph -> Node -> Info
    getNode(id: string): Node;
    user: UserType.Info;
  }
}
