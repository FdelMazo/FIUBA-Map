import { GraphType } from "./Graph";

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
  requiere: number | undefined;
  requiereCBC: boolean | undefined;
  materia: string;
  font: { color: "white" | "black" } | undefined;
  color: string | undefined;
  
  aprobar(nota: number): this | undefined;
  desaprobar(): this;
  cursando(cuatri: number | undefined): this;
  isHabilitada(graphInfo: GraphType.Info): boolean;
  actualizar(graphInfo: GraphType.Info): this;
  // Opciones completas estan en https://visjs.github.io/vis-network/docs/network/#options
  // Aca estan solamente las que se usan en la app
  setOptions?(data: { level: number }): boolean | undefined;
}

export namespace NodeType {
  // La interfaz de ctxRenderer que utilizamos con vis.js para dibujar los nodos
  // mas info en https://visjs.github.io/vis-network/docs/network/nodes.html

  interface Ctx {
    fillStyle: string;
    strokeStyle: string;
    lineWidth: number;
    globalAlpha: number;
    textAlign: string;
    font: string;
  
    beginPath(): void;
    moveTo(x: number, y: number): void;
    lineTo(x: number, y: number): void;
    closePath(): void;
    save(): void;
    fill(): void;
    stroke(): void;
    restore(): void;
    measureText(text: string): { width: number };
    fillText(text: string, x: number, y: number): void;
  }
  
  export interface DrawFinDeCarrera {
    ctx: Ctx;
    id: string;
    x: number;
    y: number;
    state: { selected: boolean; hover: boolean };
    style: { size: number; opacity: number; color: string };
    label: string;
  }
}
