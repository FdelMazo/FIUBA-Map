import React from "react";
import { NodeType } from "./Node";
import { UserInfo } from "./User";

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

export interface Optativa {
  id: number;
  nombre: string;
  creditos: number;
}

// La interfaz del Node que tenemos respecto vis.js
// Mas info en https://visjs.github.io/vis-network/docs/network/nodes.html

export interface NodesGetQuery {
  filter: (node: NodeType) => string | number | boolean | undefined;
  // FIXME: me parece hardcodeado permitir undefined en NodesGetQuery interface
  fields?: string[];
  type?: { level: string };
}

export type NodesGet<T extends string | NodesGetQuery> = T extends string
  ? NodeType
  : NodeType[];

export interface Nodes {
  get(): NodeType[];

  get<T extends string | NodesGetQuery>(query: T): NodesGet<T>;

  distinct(property: string): string[];

  update(nodes: NodeType[] | NodeType): void;

  map(callback: (node: NodeType) => NodeType): NodeType[];

  [key: number]: NodeType;

  sort(callback: (a: NodeType, b: NodeType) => number): NodeType[];
}

// La interfaz de los edges que tenemos respecto vis.js
// Mas info en https://visjs.github.io/vis-network/docs/network/edges.html

export interface Edges {
  get(
    query?:
      | number
      | {
          filter: (node: EdgeType) => string | number | boolean | undefined;
          // FIXME: me parece hardcodeado permitir undefined
          fields?: string[];
          type?: { level: string };
        },
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

// Nuestra interfaz sobre los eventos de vis.js
// Mas info en https://visjs.github.io/vis-network/docs/network/#Events

export interface NodeEvents {
  doubleClick: (event: ClickEvent) => void;
  hoverNode: (event: HoverEvent) => void;
  blurNode: () => void;
  selectNode: (event: ClickEvent) => void;
  deselectNode: (event: DeselectEvent) => void;
}

export interface ClickEvent {
  nodes: string[];
  edges: string[];
  event: Event; // FIXME: quiza haya algo mas especifico para el clickEvent que Event
  pointer: {
    DOM: Position;
    canvas: Position;
  };
}

export interface DeselectEvent extends ClickEvent {
  previousSelection: {
    nodes: string[];
    edges: string[];
  };
}

export interface HoverEvent {
  node: string;
}

export interface OverrideOptativas {
  action: "override";
  value: GraphOptativa[];
}

export interface EditOptativa {
  action: "edit";
  value: GraphOptativa;
}

export interface CreateOptativa {
  action: "create";
  value?: undefined;
}

export interface RemoveOptativa {
  action: "remove";
  value: { id: number };
}

export type OptativasDispatcher =
  | OverrideOptativas
  | EditOptativa
  | CreateOptativa
  | RemoveOptativa;

export interface GraphOptativa {
  id: number;
  nombre: string;
  creditos: number;
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
  check?: boolean | undefined;
}

export interface NodesHandler {
  update(
    ids: number[],
    changedData: { level: number }[],
    oldData: { level: number }[],
  ): void;
}

// La network es nuestra interfaz con vis.js
// Nos da acceso a los nodos, las aristas y varias funciones
// https://visjs.github.io/vis-network/docs/network/

export interface Network {
  body: {
    data: {
      edges: Edges;
      nodes: Nodes;
    };
    nodes: Nodes;
    emitter: {
      emit(string: string): void;
    };
  };
  nodesHandler: NodesHandler;
  key: string;

  redraw(): void;

  fit(): void;

  create(properties: { [key: string]: any }): NodeType;

  getViewPosition(): Position;

  on(eventName: string, callback: () => void): void;

  getScale(): number;

  moveTo(position: { position: Position; scale?: number }): void;

  getConnectedNodes(
    id: string,
    direction?: "to" | "from" | undefined,
  ): string[];

  getConnectedEdges(id: string): string[];

  getSelectedNodes(): string[];

  selectNodes(query: string[]): void;
}

export interface GraphType {
  nodes: NodeType[];
  edges: { from: string; to: string; color: string }[];
  groups: string[];
  key: string;
}

// El context del Graph que pasamos a lo largo de la app

export interface GraphContextType {
  optativas: GraphOptativa[];
  graph: GraphType;
  creditos: GraphCredito[];
  setNetwork: React.Dispatch<React.SetStateAction<Network>>;
  optativasDispatch: React.Dispatch<OptativasDispatcher>;
  displayedNode: string;
  setDisplayedNode: React.Dispatch<React.SetStateAction<string>>;
  getters: Getters;
  events: NodeEvents;
  aplazos: number;
  setAplazos: React.Dispatch<React.SetStateAction<number>>;
  networkRef: (instance: Element | null) => void; // TODO: quiza se pueda mejorar el networkRef type

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

  createNetwork(network: Network): void;
}

export interface GraphInfo {
  creditos: {
    creditosTotales: number;
    creditosCBC: number;
  };
  showLabels: boolean;
  colorMode: "light" | "dark";
  getters: Getters;
  user: UserInfo;
  network: Network;

  getNode(id: string): NodeType | undefined;
}

export interface Position {
  x: number;
  y: number;
}
