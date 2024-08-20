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
  requiere?: boolean;
  materia: string;
  aprobar(nota: number): this | undefined;
  desaprobar(): this;
  cursando(cuatri: number): this;
  isHabilitada(ctx:): boolean;
}