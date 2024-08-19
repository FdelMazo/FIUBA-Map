export interface NodeType {
  nodeRef: this;
  label: string;
  group: string;
  nota: number;
  aprobada: boolean;
  cuatrimestre: number | boolean;
  level: number;
  originalLevel: number;
  hidden: boolean
  aprobar(nota: number): this | undefined;
  desaprobar(): this;
  cursando(cuatri: number): this;
}