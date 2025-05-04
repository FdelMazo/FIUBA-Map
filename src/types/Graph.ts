import React from "react";
import { NodeType } from "./Node";
import { UserType } from "./User";
import { ReactGraphVisType } from "./ReactGraphVis";

export namespace GraphType {
  export interface Getters {
    NodesFrom(id: string): string[];
    NodesTo(id: string): string[];
    NeighborNodes(id: string): string[];
    NeighborEdges(id: string): string[];
    // TODO: en realidad los getters no retornan un NodeType sino varios especificamente un field
    Cuatrimestres(): NodeType[];
    SelectableCategorias(): string[];
    ALL(): NodeType[];
    MateriasAprobadasCBC(): NodeType[];
    MateriasAprobadasSinCBC(): NodeType[];
    MateriasAprobadasSinEquivalenciasSinCBC(): NodeType[];
    MateriasAprobadasConCBC(): NodeType[];
    CBC(): NodeType[];
    Obligatorias(): NodeType[];
    ObligatoriasAprobadas(): NodeType[];
    ElectivasAprobadas(): NodeType[];
    OrientacionAprobadas(): NodeType[];
    CategoriaOnly(categoria: string): NodeType[];
    CategoriaRelevantes(categoria: string): NodeType[];
    AllRelevantes(): NodeType[];
    Shown(): NodeType[];
    AllShown(): NodeType[];
    AllShownWithCuatri(): (NodeType & { cuatrimestre: number })[];
    AllShownWithoutCuatri(): (NodeType & { cuatrimestre: undefined })[];
    WithoutNivel(): NodeType[];
    Electivas(): NodeType[];
    Levels(): NodeType[];
    FinDeCarrera(): NodeType[];
  }

  interface OverrideOptativas {
    action: "override";
    value: Optativa[];
  }

  interface EditOptativa {
    action: "edit";
    value: Optativa;
  }

  interface CreateOptativa {
    action: "create";
    value?: undefined;
  }

  interface RemoveOptativa {
    action: "remove";
    value: { id: number };
  }

  export type OptativasDispatcher =
    | OverrideOptativas
    | EditOptativa
    | CreateOptativa
    | RemoveOptativa;

  export interface Optativa {
    id: number;
    nombre: string;
    creditos: number;
  }

  export interface Credito {
    nombrecorto: string;
    nombre: string;
    bg: string; // FIXME: en realidad bg de Credito es un value de COLORS de theme
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

  export interface Content {
    nodes: NodeType[];
    edges: { from: string; to: string; color: string }[];
    groups: string[];
    key: string;
  }

  // El context del Graph que pasamos a lo largo de la app

  export interface Context {
    optativas: Optativa[];
    graph: Content;
    creditos: Credito[];
    displayedNode: string;
    getters: Getters;
    events: ReactGraphVisType.NodeEvents;
    aplazos: number;

    setDisplayedNode: React.Dispatch<React.SetStateAction<string>>;
    setNetwork: React.Dispatch<React.SetStateAction<ReactGraphVisType.Network>>;
    optativasDispatch: React.Dispatch<OptativasDispatcher>;
    setAplazos: React.Dispatch<React.SetStateAction<number>>;

    networkRef: (instance: Element | null) => void;
    toggleGroup(categoria: string): void;
    getNode(id: string): NodeType | undefined;
    aprobar(id: string, nota: number): void;
    desaprobar(id: string): void;
    saveGraph(): Promise<void>;
    restartGraphCuatris(): void;
    changeCarrera(id: string): void;
    changeOrientacion(id: string): void;
    changeFinDeCarrera(id: string): void;
    toggleCheckbox(c: string, forceTrue?: boolean): void;
    cursando(id: string, cuatrimestre: number | undefined): void;
    groupStatus(categoria: string): "hidden" | "shown" | "partial";
    createNetwork(network: ReactGraphVisType.Network): void;
  }

  export interface Info {
    creditos: {
      creditosTotales: number;
      creditosCBC: number;
    };
    showLabels: boolean;
    colorMode: "light" | "dark";
    getters: Getters;
    user: UserType.Info;
    network: ReactGraphVisType.Network;

    getNode(id: string): NodeType | undefined;
  }
}
