import { GraphInfo } from "./Graph";

// El tipo de la clase Node

export interface NodeType {
  nodeRef: this;
  label: string;
  group: string;
  nota: number;
  aprobada: boolean;
  cuatrimestre: number | undefined;
  level: number;
  originalLevel: number;
  hidden: boolean;
  categoria: string;
  opacity: number | undefined;
  id: string;
  creditos: number;
  requiere?: number;
  requiereCBC?: boolean;
  materia: string;
  font?: { color: "white" | "black" };
  color?: string;
  
  aprobar(nota: number): this | undefined;
  desaprobar(): this;
  cursando(cuatri: number | undefined): this;
  isHabilitada(graphInfo: GraphInfo): boolean;
  actualizar(graphInfo: GraphInfo): this;
  // Opciones completas estan en https://visjs.github.io/vis-network/docs/network/#options
  // Aca estan solamente las que se usan en la app
  setOptions?(data: { level: number }): boolean;
}
