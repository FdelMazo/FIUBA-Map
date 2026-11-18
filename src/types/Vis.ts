import type { DataSet } from "vis-data";
import type { Edge } from "vis-network";
// "Node" a secas dentro del declare module seria el Node de vis-network
import type MateriaNode from "../Node";

// vis-network y vis-data traen sus propios tipos. Aca solo le agregamos a la clase Network
// lo que sus tipos no declaran: la key que le ponemos y los internals que tocamos
// (se aumenta el modulo donde esta declarada la clase, no el re-export de "vis-network")
declare module "vis-network/declarations/network/Network" {
  interface Network {
    // Le ponemos la key de la carrera para compararla contra la del graph
    key: string;
    body: {
      data: { nodes: Nodes; edges: Edges };
      // Los nodos internos de vis (no los nuestros), ver el monkeypatch en Graph.ts > createNetwork
      nodes: Record<string, VisInternalNode>;
      emitter: { emit(event: string): void };
    };
    nodesHandler: {
      update(
        ids: string[],
        changedData: MateriaNode[],
        oldData?: MateriaNode[],
      ): void;
      create(data: MateriaNode): VisInternalNode;
    };
  }
}

interface VisInternalNode {
  setOptions(data: MateriaNode): boolean;
}

// vis-data tipa `fields` pero devuelve el item entero: lo corregimos para que devuelva solo esos campos
type Nodes = {
  get<K extends keyof MateriaNode>(query: {
    filter: (node: MateriaNode) => boolean;
    fields: K[];
  }): Pick<MateriaNode, K>[];
} & DataSet<MateriaNode>;

// vis-data le asigna un id (string) a cada edge que agregamos sin id
type Edges = DataSet<Edge & { id: string }>;
