import { NodeType } from "./Node";
import { COLORS } from "../theme";
import { accCreditos } from "../utils";

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

  AllShownWithCuatri(): NodeType[];

  AllShownWithoutCuatri(): NodeType[];

  WithoutNivel(): NodeType[];

  Electivas(): NodeType[];

  Levels(): NodeType[];

  FinDeCarrera(): NodeType[];
}

export interface CTX {
  // getters;
  // user;
  // network;
  // getNode;
  // creditos: { creditosTotales; creditosCBC };
  // showLabels: logged;
  // colorMode;
}

export interface GraphType {

}

export interface Optativa {
  id: number;
  nombre: string;
  creditos: number;
}

// export interface GraphNode {
//   nodeRef:;
//   materia: string;
//
//   setOptions(data:): boolean;
// }

export interface ClickEvent {
  nodes: string[], // FIXME: nodes in clickevent is maybe number[]
  edges: string[],
  event: Event, // FIXME: quiza haya algo mas especifico para el clickEvent que Event
  pointer: {
    DOM: Position,
    canvas: Position
  }
}

export interface DeselectEvent extends ClickEvent {
  previousSelection: {
    nodes: string[];
    edges: string[];
  }
}

export interface HoverEvent {
  node: string;
}

export interface Nodes {
  get(
    query?: number | {
      filter: (node: NodeType) => string | number | boolean | undefined,
      // FIXME: me parece hardcodeado permitir undefined
      fields?: string[],
      type?: { level: string }
    }
  ): NodeType[];
  distinct(property: string) : string[];
  update(nodes: NodeType[]): void;
  [key: number]: NodeType;
}

export interface Edges {
  get(
    query?: number | {
      filter: (node: EdgeType) => string | number | boolean | undefined,
      // FIXME: me parece hardcodeado permitir undefined
      fields?: string[],
      type?: { level: string }
    }
  ): EdgeType[];
  update(nodes: EdgeType[]): void;
}

export interface EdgeType {
  hoverWidth: number | undefined;
  selectionWidth: number | undefined;
  arrows: { to: { scaleFactor: number } } | undefined;
  color: { opacity: number } | string | undefined;
  id: string;
}

export interface NodesHandler {
  update(
    ids: number[],
    changedData: { level: number }[],
    oldData: { level: number }[]
  ): void;
}

export interface Position {
  x: number,
  y: number
}

export interface GraphCredito {
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
}

export interface Network {
  body: {
    data: {
      edges: Edges;
      nodes: Nodes;
    };
    nodes: Nodes;
    emitter: {
      emit(string: string): void;
    }
  };
  nodesHandler: NodesHandler;

  redraw(): void;

  fit(): void;

  create(properties: { [key: string]: any }): NodeType;

  getViewPosition(): Position;

  on(eventName: string, callback: () => void): void;

  getScale(): number;

  moveTo(position: {
    position: Position,
    scale: number,
  }): void;

  key: string;

  getConnectedNodes(id: string, direction?: "to" | "from" | undefined): string[];

  getConnectedEdges(id: string): string[];

  getSelectedNodes(): NodeType[];

  selectNodes(query: string[]): void;
}