import { NodeType } from "./Node";

// Esta es nuestra interfaz con react-graph-vis, que no tiene soporte nativo para TypeScript

export namespace ReactGraphVisType {
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
  
  export interface NodesHandler {
    update(
      ids: number[],
      changedData: { level: number }[],
      oldData: { level: number }[],
    ): void;
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
    event: Event;
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
  
  export interface Position {
      x: number;
      y: number;
    }
}
