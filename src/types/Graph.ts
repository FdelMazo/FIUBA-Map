import type Node from "../Node";
import type Graph from "../Graph";
import { UserType } from "./User";
import type { BgColor } from "../theme";

export namespace GraphType {
  export type OptativasDispatcher =
    | { action: "override"; value: Optativa[] }
    | { action: "edit"; value: Optativa }
    | { action: "create"; value?: undefined }
    | { action: "remove"; value: { id: number } };

  export interface Optativa {
    id: number;
    nombre: string;
    creditos: number;
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
